import React, { useState } from 'react';
import { X, Star, CheckCircle, Send, Sparkles } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, onSubmitReview }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [hotelStayed, setHotelStayed] = useState('Presidential Oceanfront Villa, Maldives');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newReview = {
      id: Date.now(),
      name,
      title: 'Verified Guest',
      location: location || 'Global Traveler',
      hotelStayed,
      rating,
      date: 'Just now',
      comment,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };

    if (onSubmitReview) {
      onSubmitReview(newReview);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-container" style={{ maxWidth: '580px', padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <Sparkles size={14} /> Guest Feedback
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '4px 0 0', color: 'var(--primary)' }}>
              Write a Verified Review
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '8px', borderRadius: '50%', background: 'var(--bg-alt)', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Rating Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
              Overall Rating
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Star
                    size={28}
                    style={{
                      fill: (hoverRating || rating) >= star ? '#eab308' : 'none',
                      color: (hoverRating || rating) >= star ? '#eab308' : 'var(--border)',
                      transition: '0.15s'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Victoria Sterling"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', fontSize: '0.9rem', background: 'var(--bg-main)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                City / Country
              </label>
              <input
                type="text"
                placeholder="e.g. London, UK"
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', fontSize: '0.9rem', background: 'var(--bg-main)'
                }}
              />
            </div>
          </div>

          {/* Property Stayed */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Property Stayed At
            </label>
            <select
              value={hotelStayed}
              onChange={e => setHotelStayed(e.target.value)}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', fontSize: '0.9rem', background: 'var(--bg-main)'
              }}
            >
              <option value="Presidential Oceanfront Villa, Maldives">Presidential Oceanfront Villa, Maldives</option>
              <option value="Grand Royal Eiffel Suite, Paris">Grand Royal Eiffel Suite, Paris</option>
              <option value="Santorini Cliffside Cave Sanctuary">Santorini Cliffside Cave Sanctuary</option>
              <option value="Alpine Matterhorn Panorama Chalet">Alpine Matterhorn Panorama Chalet</option>
              <option value="Ubud Rainforest Zen Retreat">Ubud Rainforest Zen Retreat</option>
              <option value="Tokyo Sky Tower Executive Suite">Tokyo Sky Tower Executive Suite</option>
              <option value="Manhattan Central Park Penthouse">Manhattan Central Park Penthouse</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Your Review & Story *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Share details about your stay, butler service, infinity pool, or dining experience..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', fontSize: '0.9rem', background: 'var(--bg-main)',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn-gold"
            style={{ width: '100%', marginTop: '10px', padding: '14px' }}
          >
            <Send size={16} /> Submit Verified Story
          </button>
        </form>
      </div>
    </div>
  );
}
