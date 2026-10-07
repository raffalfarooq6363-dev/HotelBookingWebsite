import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Calendar, Users, X } from 'lucide-react';
import { EXPERIENCES } from '../data/hotelsData';

export default function Experiences({ onExplore, metaData, experiencesList }) {
  const [selectedExp, setSelectedExp] = useState(null);
  const [reserved, setReserved] = useState(false);
  const list = experiencesList && experiencesList.length > 0 ? experiencesList : EXPERIENCES;

  const subtitle = metaData?.subtitle || 'Beyond Accommodation';
  const title = metaData?.title || 'Curated Bespoke Experiences';
  const description = metaData?.description || 'Immerse yourself in world-class culinary journeys, transformative wellness sanctuaries, and private maritime charters.';

  const handleReserve = (e) => {
    e.preventDefault();
    setReserved(true);
    setTimeout(() => {
      setReserved(false);
      setSelectedExp(null);
    }, 2200);
  };

  return (
    <section id="experiences" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-description">
            {description}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px'
        }}>
          {list.map((exp) => (
            <div
              key={exp.id}
              className="luxury-card"
              style={{
                borderRadius: 'var(--radius-md)',
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
                  background: 'var(--bg-dark)',
                  backdropFilter: 'blur(6px)',
                  color: 'var(--gold-bright)',
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
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                  {exp.subtitle}
                </span>
                <h3 style={{ fontSize: '1.25rem', margin: '4px 0 10px 0', lineHeight: 1.3, color: 'var(--primary)' }}>
                  {exp.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {exp.description}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={() => setSelectedExp(exp)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--gold)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Reserve Experience <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Reservation Modal */}
      {selectedExp && (
        <div className="modal-backdrop">
          <div className="modal-content-container" style={{ maxWidth: '520px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="badge-gold">{selectedExp.tag}</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginTop: '6px', color: 'var(--primary)' }}>
                  {selectedExp.title}
                </h2>
              </div>
              <button onClick={() => setSelectedExp(null)} style={{ padding: '6px' }}><X size={20} /></button>
            </div>

            {reserved ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <CheckCircle size={48} color="var(--gold)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>Experience Reserved!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                  Our concierge team will arrange your private booking for {selectedExp.title}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReserve} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {selectedExp.description}
                </p>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', fontSize: '0.9rem', background: 'var(--bg-main)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                    Number of Guests
                  </label>
                  <select
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', fontSize: '0.9rem', background: 'var(--bg-main)'
                    }}
                  >
                    <option value="2">2 Guests (Couple Special)</option>
                    <option value="4">4 Guests (Family & Friends)</option>
                    <option value="6">6+ Guests (Private Group)</option>
                  </select>
                </div>

                <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '8px', padding: '13px' }}>
                  Confirm Experience Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
