import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { SPECIAL_OFFERS } from '../data/hotelsData';

export default function SpecialOffers({ onCopyCode, metaData, offersList }) {
  const [copiedId, setCopiedId] = useState(null);
  const list = offersList && offersList.length > 0 ? offersList : SPECIAL_OFFERS;

  const subtitle = metaData?.subtitle || 'Exclusive Privileges';
  const title = metaData?.title || 'Seasonal Offers & Packages';
  const description = metaData?.description || 'Enhance your luxury itinerary with our limited-edition promotional credits, complimentary nights, and VIP privileges.';

  const handleCopy = (offer) => {
    navigator.clipboard.writeText(offer.code);
    setCopiedId(offer.id);
    if (onCopyCode) {
      onCopyCode(offer.code);
    }
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <section id="offers" className="section-padding" style={{ backgroundColor: '#ffffff' }}>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {list.map((offer) => (
            <div
              key={offer.id}
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                background: '#f6f9f8',
                padding: '30px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'transform 0.3s ease'
              }}
              className="luxury-card"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{
                    background: 'var(--gold-light)',
                    color: '#3d6b5e',
                    border: '1px solid var(--gold-border)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {offer.validUntil}
                  </span>
                  <Sparkles size={18} style={{ color: 'var(--gold)' }} />
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>{offer.title}</h3>
                <p style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-serif)',
                  marginBottom: '10px'
                }}>
                  {offer.discount}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {offer.description}
                </p>
              </div>

              {/* Promo Code Box */}
              <div style={{
                background: '#ffffff',
                border: '1px dashed var(--gold-border)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>
                    Promo Code
                  </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>
                    {offer.code}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(offer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: copiedId === offer.id ? '#ecfdf5' : 'var(--gold-light)',
                    color: copiedId === offer.id ? '#065f46' : '#3d6b5e',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  {copiedId === offer.id ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
