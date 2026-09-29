import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQS } from '../data/hotelsData';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(prev => prev === index ? -1 : index);
  };

  return (
    <section id="faq" className="section-padding" style={{ backgroundColor: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <div className="section-header">
          <span className="section-subtitle">Common Inquiries</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-description">
            Everything you need to know about our reservation process, arrival arrangements, and resort policies.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                style={{
                  border: '1px solid',
                  borderColor: isOpen ? 'var(--gold-border)' : 'var(--border-subtle)',
                  borderRadius: '12px',
                  background: isOpen ? '#fcfaf7' : '#ffffff',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    color: isOpen ? 'var(--primary)' : 'var(--text-main)',
                    fontSize: '1.02rem',
                    fontWeight: 700
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HelpCircle size={18} style={{ color: isOpen ? 'var(--gold)' : '#94a3b8', flexShrink: 0 }} />
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: isOpen ? 'var(--gold)' : 'var(--text-muted)',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 20px 54px',
                    fontSize: '0.92rem',
                    lineHeight: 1.7,
                    color: 'var(--text-muted)'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          padding: '24px',
          background: 'var(--bg-cream)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: 600 }}>
            Have a bespoke request or question not answered here?
          </p>
          <a
            href="mailto:concierge@luxehaven.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--gold)',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            <MessageSquare size={16} /> Contact Our 24/7 Concierge Desk
          </a>
        </div>
      </div>
    </section>
  );
}
