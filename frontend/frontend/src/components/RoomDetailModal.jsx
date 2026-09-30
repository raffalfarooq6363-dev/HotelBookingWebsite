import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Users, 
  Bed, 
  Maximize2, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function RoomDetailModal({
  room,
  currency,
  nightsCount,
  onClose,
  onBookNow
}) {
  const [activePhoto, setActivePhoto] = useState(0);

  if (!room) return null;

  const convertedPrice = Math.round(room.pricePerNight * currency.rate);
  const totalPrice = convertedPrice * nightsCount;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px', overflow: 'hidden' }}
      >
        {/* Modal Top Bar - Luminous Champagne Ivory */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: '1px solid rgba(89, 135, 125, 0.3)',
          background: 'linear-gradient(135deg, #f0f7f4 0%, #e0eeea 100%)',
          color: '#1a2e28'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--gold)', fontWeight: 700 }}>
              {room.category} • {room.destinationName}
            </span>
            <h3 style={{ margin: '3px 0 0 0', fontSize: '1.4rem', color: '#1a2e28', fontFamily: 'var(--font-serif)' }}>
              {room.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#5a7a70',
              background: '#ffffff',
              border: '1px solid #d4e4dd',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '28px', maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>
          {/* Main Gallery Display */}
          <div style={{ position: 'relative', height: '360px', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
            <img
              src={room.images[activePhoto]}
              alt={room.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {room.images.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhoto((prev) => (prev - 1 + room.images.length) % room.images.length)}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.7)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActivePhoto((prev) => (prev + 1) % room.images.length)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.7)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Row */}
          {room.images.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
              {room.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhoto(idx)}
                  style={{
                    width: '90px',
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: activePhoto === idx ? 'var(--gold)' : 'transparent',
                    flexShrink: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Key Specs Pills */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '28px'
          }}>
            <div style={{ background: '#f6f9f8', padding: '12px', borderRadius: '10px', border: '1px solid #d4e4dd' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Size</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Maximize2 size={15} style={{ color: 'var(--gold)' }} /> {room.sizeSqM} m² / {Math.round(room.sizeSqM * 10.76)} sqft
              </p>
            </div>
            <div style={{ background: '#f6f9f8', padding: '12px', borderRadius: '10px', border: '1px solid #d4e4dd' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Occupancy</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={15} style={{ color: 'var(--gold)' }} /> Up to {room.maxGuests} Guests
              </p>
            </div>
            <div style={{ background: '#f6f9f8', padding: '12px', borderRadius: '10px', border: '1px solid #d4e4dd' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bed Arrangement</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bed size={15} style={{ color: 'var(--gold)' }} /> {room.bedType}
              </p>
            </div>
            <div style={{ background: '#f6f9f8', padding: '12px', borderRadius: '10px', border: '1px solid #d4e4dd' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Guest Rating</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={15} style={{ color: '#eab308', fill: '#eab308' }} /> {room.rating} / 5.0 ({room.reviewsCount})
              </p>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Sanctuary Overview</h4>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
              {room.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Curated Amenities & Inclusions</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {room.amenities.map(a => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    flexShrink: 0
                  }}>
                    <Check size={12} />
                  </div>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies & Peace of Mind */}
          <div style={{
            background: '#f6f9f8',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #d4e4dd',
            marginBottom: '28px'
          }}>
            <h5 style={{ fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--gold)' }} /> LuxeHaven Stay Guarantee & Policies
            </h5>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <li><strong>Check-in:</strong> 3:00 PM onwards | <strong>Check-out:</strong> 11:00 AM (Late checkout available upon request)</li>
              <li><strong>Cancellation:</strong> 100% full refund available up to 48 hours prior to scheduled arrival.</li>
              <li><strong>Butler Service:</strong> Dedicated contact available 24/7 via WhatsApp or in-room tablet.</li>
              <li><strong>Hospitality:</strong> Complimentary welcome bottle of chilled vintage champagne and artisanal fruits upon check-in.</li>
            </ul>
          </div>

          {/* Bottom Bar: Price & Book CTA */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #d4e4dd',
            paddingTop: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {currency.symbol}{convertedPrice.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ night</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currency.symbol}{totalPrice.toLocaleString()} for {nightsCount} {nightsCount === 1 ? 'night' : 'nights'} (taxes included)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookNow(room);
                }}
                className="btn-gold"
              >
                Book This Stay <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
