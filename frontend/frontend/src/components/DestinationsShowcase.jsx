import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '../data/hotelsData';

export default function DestinationsShowcase({ onSelectDestination }) {
  const featuredDestinations = DESTINATIONS.filter(d => d.id !== 'all');

  return (
    <section id="destinations" className="section-padding" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">World-Renowned Destinations</span>
          <h2 className="section-title">Escape to Extraordinary Places</h2>
          <p className="section-description">
            From secluded private atolls in the Indian Ocean to chic Parisian boulevards, find sanctuary in the world’s most coveted locales.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {featuredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest.id)}
              style={{
                position: 'relative',
                height: '320px',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-card)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="destination-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
              />

              {/* Gradient Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)'
              }} />

              {/* Text Badge */}
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                color: '#ffffff'
              }}>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--gold)',
                    fontWeight: 700
                  }}>
                    {dest.country}
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.35rem', color: '#ffffff', fontFamily: 'var(--font-serif)' }}>
                    {dest.name}
                  </h3>
                </div>

                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(6px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
