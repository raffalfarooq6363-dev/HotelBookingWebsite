import React, { useState } from 'react';
import { Star, Quote, CheckCircle, Edit3 } from 'lucide-react';
import { TESTIMONIALS as INITIAL_TESTIMONIALS } from '../data/hotelsData';

export default function Testimonials({ onOpenReviewModal }) {
  return (
    <section id="reviews" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Verified Guest Stories</span>
          <h2 className="section-title">Words From Discerning Travelers</h2>
          <p className="section-description">
            Read authentic reviews from guests who made LuxeHaven their home away from home across the globe.
          </p>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={onOpenReviewModal}
              className="btn-outline"
              style={{ padding: '10px 22px', fontSize: '0.88rem' }}
            >
              <Edit3 size={15} /> Write a Review
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '50px'
        }}>
          {INITIAL_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="luxury-card"
              style={{
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Rating & Quote Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} style={{ fill: '#eab308', color: '#eab308' }} />
                    ))}
                  </div>
                  <Quote size={28} style={{ color: 'var(--gold)', opacity: 0.35 }} />
                </div>

                {/* Comment */}
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: 'var(--text-main)',
                  fontStyle: 'italic',
                  marginBottom: '24px'
                }}>
                  "{t.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {t.name}
                    <CheckCircle size={14} style={{ color: '#16a34a' }} title="Verified Guest" />
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600 }}>
                    {t.hotelStayed}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    {t.location} • {t.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Statistics Banner */}
        <div style={{
          background: 'var(--primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          textAlign: 'center',
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div>
            <h3 style={{ fontSize: '2.4rem', color: 'var(--gold-bright)', margin: 0, fontFamily: 'var(--font-serif)' }}>
              4.96 / 5.0
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--primary-pale)' }}>
              Average Guest Rating
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.4rem', color: 'var(--gold-bright)', margin: 0, fontFamily: 'var(--font-serif)' }}>
              99.2%
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--primary-pale)' }}>
              Guest Return & Recommendation
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.4rem', color: 'var(--gold-bright)', margin: 0, fontFamily: 'var(--font-serif)' }}>
              45,000+
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--primary-pale)' }}>
              Discerning Guests Welcomed
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.4rem', color: 'var(--gold-bright)', margin: 0, fontFamily: 'var(--font-serif)' }}>
              24 / 7
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--primary-pale)' }}>
              Bespoke Private Butler Care
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
