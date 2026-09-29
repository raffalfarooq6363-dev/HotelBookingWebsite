import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { EXPERIENCES } from '../data/hotelsData';

export default function Experiences({ onExplore }) {
  return (
    <section id="experiences" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Beyond Accommodation</span>
          <h2 className="section-title">Curated Bespoke Experiences</h2>
          <p className="section-description">
            Immerse yourself in world-class culinary journeys, transformative wellness sanctuaries, and private maritime charters.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px'
        }}>
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              className="luxury-card"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                <img
                  src={exp.image}
                  alt={exp.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: 'var(--gold)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  {exp.tag}
                </span>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {exp.subtitle}
                </span>
                <h3 style={{ fontSize: '1.25rem', margin: '4px 0 10px 0', lineHeight: 1.3 }}>
                  {exp.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {exp.description}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <a
                    href="#catalog"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--gold)'
                    }}
                  >
                    Reserve an Experience <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
