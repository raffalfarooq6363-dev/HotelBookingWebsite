import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Plane, 
  CheckCircle2, 
  Mail, 
  PhoneCall, 
  MessageCircle 
} from 'lucide-react';
import { FAQS } from '../data/hotelsData';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['All'];
    FAQS.forEach(faq => {
      const cat = faq.category || 'General';
      if (!cats.includes(cat)) cats.push(cat);
    });
    return cats;
  }, []);

  // Filter FAQs based on active category and search input
  const filteredFaqs = useMemo(() => {
    return FAQS.filter(faq => {
      const matchesCategory = selectedCategory === 'All' || (faq.category || 'General') === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;
      const inQuestion = faq.question.toLowerCase().includes(q);
      const inAnswer = faq.answer.toLowerCase().includes(q);
      const inTag = faq.tag ? faq.tag.toLowerCase().includes(q) : false;
      return matchesCategory && (inQuestion || inAnswer || inTag);
    });
  }, [selectedCategory, searchQuery]);

  const toggleFAQ = (index) => {
    setOpenIndex(prev => prev === index ? -1 : index);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Reservations':
        return <Clock size={12} />;
      case 'Pricing':
        return <ShieldCheck size={12} />;
      case 'Stay & Arrival':
        return <Clock size={12} />;
      case 'Payment':
        return <CreditCard size={12} />;
      case 'VIP Services':
        return <Plane size={12} />;
      default:
        return <HelpCircle size={12} />;
    }
  };

  return (
    <section 
      id="faq" 
      className="section-padding" 
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Ambient Background Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ maxWidth: '920px', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '36px', textAlign: 'center' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#f5d372',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}
          >
            <Sparkles size={14} style={{ color: '#d4af37' }} />
            Bespoke Guest Guidance
          </div>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '14px' }}>
            Frequently Asked Questions
          </h2>
          <p className="section-description" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1rem', color: '#94a3b8' }}>
            Everything you need to know regarding flexible reservations, transparent billing, 
            exclusive VIP arrangements, and seamless arrival procedures.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Live Search Input */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(18, 24, 40, 0.9) 0%, rgba(12, 16, 28, 0.95) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#d4af37',
                pointerEvents: 'none'
              }}
            />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inquiries (e.g. cancellation, taxes, check-in, speedboat, cards)..."
              style={{
                width: '100%',
                padding: '15px 44px 15px 48px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.96rem',
                fontFamily: 'inherit'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e2e8f0',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center'
            }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = cat === 'All' 
                ? FAQS.length 
                : FAQS.filter(f => (f.category || 'General') === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(184, 134, 11, 0.15) 100%)' 
                      : 'rgba(18, 24, 40, 0.65)',
                    color: isActive ? '#fceda8' : 'rgba(255, 255, 255, 0.72)',
                    border: `1px solid ${isActive ? 'rgba(212, 175, 55, 0.6)' : 'rgba(255, 255, 255, 0.08)'}`,
                    boxShadow: isActive ? '0 0 14px rgba(212, 175, 55, 0.2)' : 'none',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)';
                    }
                  }}
                >
                  {cat !== 'All' && getCategoryIcon(cat)}
                  <span>{cat}</span>
                  <span 
                    style={{
                      fontSize: '0.72rem',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      color: isActive ? '#fff' : '#94a3b8',
                      marginLeft: '2px'
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredFaqs.length === 0 ? (
            <div 
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'rgba(18, 24, 40, 0.6)',
                borderRadius: '16px',
                border: '1px dashed rgba(212, 175, 55, 0.25)',
                color: '#94a3b8'
              }}
            >
              <HelpCircle size={36} style={{ color: '#d4af37', marginBottom: '12px', opacity: 0.7 }} />
              <h4 style={{ color: '#ffffff', marginBottom: '6px', fontSize: '1.1rem' }}>No matching inquiries found</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Try searching for a different keyword or browse all questions.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#f5d372',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const formattedNumber = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={faq.id || idx}
                  style={{
                    borderRadius: '16px',
                    background: isOpen 
                      ? 'linear-gradient(145deg, rgba(22, 30, 52, 0.95) 0%, rgba(12, 16, 30, 0.98) 100%)' 
                      : 'linear-gradient(145deg, rgba(16, 22, 38, 0.85) 0%, rgba(10, 14, 26, 0.92) 100%)',
                    border: `1px solid ${isOpen ? 'rgba(212, 175, 55, 0.55)' : 'rgba(212, 175, 55, 0.16)'}`,
                    borderLeft: `4px solid ${isOpen ? '#d4af37' : 'rgba(212, 175, 55, 0.2)'}`,
                    boxShadow: isOpen 
                      ? '0 12px 32px rgba(0, 0, 0, 0.55), 0 0 16px rgba(212, 175, 55, 0.12)' 
                      : '0 4px 16px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* Accordion Toggle Header - Explicitly resetting button defaults */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isOpen) {
                        e.currentTarget.parentElement.style.borderColor = 'rgba(212, 175, 55, 0.38)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isOpen) {
                        e.currentTarget.parentElement.style.borderColor = 'rgba(212, 175, 55, 0.16)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      {/* Number Index Badge */}
                      <span 
                        style={{
                          fontSize: '0.85rem',
                          fontFamily: 'Cinzel, Georgia, serif',
                          fontWeight: 700,
                          color: isOpen ? '#fce08c' : 'rgba(212, 175, 55, 0.85)',
                          background: isOpen ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${isOpen ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}
                      >
                        {formattedNumber}
                      </span>

                      {/* Question Title & Meta Tag */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span 
                          style={{
                            color: isOpen ? '#fce08c' : '#ffffff',
                            fontSize: '1.03rem',
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                            transition: 'color 0.2s ease',
                            lineHeight: 1.45
                          }}
                        >
                          {faq.question}
                        </span>
                        {faq.tag && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span 
                              style={{
                                fontSize: '0.72rem',
                                color: 'rgba(212, 175, 55, 0.85)',
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em'
                              }}
                            >
                              ✦ {faq.tag}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Circular Gold Chevron Toggle */}
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: isOpen ? 'rgba(212, 175, 55, 0.22)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${isOpen ? 'rgba(212, 175, 55, 0.55)' : 'rgba(255, 255, 255, 0.12)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <ChevronDown
                        size={18}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                          color: isOpen ? '#f5d372' : '#94a3b8'
                        }}
                      />
                    </div>
                  </button>

                  {/* Expanded Answer Content */}
                  {isOpen && (
                    <div 
                      style={{
                        borderTop: '1px solid rgba(212, 175, 55, 0.12)',
                        padding: '18px 24px 22px 64px',
                        animation: 'fadeIn 0.2s ease'
                      }}
                    >
                      <p 
                        style={{
                          fontSize: '0.96rem',
                          lineHeight: 1.78,
                          color: 'rgba(226, 232, 240, 0.9)',
                          marginBottom: '14px'
                        }}
                      >
                        {faq.answer}
                      </p>

                      <div 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(212, 175, 55, 0.08)',
                          border: '1px solid rgba(212, 175, 55, 0.2)',
                          fontSize: '0.78rem',
                          color: '#f5d372',
                          fontWeight: 500
                        }}
                      >
                        <CheckCircle2 size={14} style={{ color: '#d4af37' }} />
                        <span>Verified LuxeHaven Hospitality Guarantee</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom VIP Concierge Support Card */}
        <div 
          style={{
            marginTop: '44px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(18, 24, 40, 0.95) 0%, rgba(10, 14, 26, 0.98) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            padding: '30px 32px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', maxWidth: '520px' }}>
            <div 
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d4af37',
                flexShrink: 0
              }}
            >
              <MessageCircle size={26} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#ffffff', fontWeight: 700 }}>
                Have a bespoke request or personal inquiry?
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Our 24/7 dedicated VIP Concierge desk coordinates private itineraries, charters, and custom dietary requests.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="mailto:concierge@luxehaven.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                e.currentTarget.style.color = '#f5d372';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              <Mail size={16} style={{ color: '#d4af37' }} />
              concierge@luxehaven.com
            </a>

            <a
              href="tel:+18008885893"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)',
                color: '#0a0e1a',
                fontSize: '0.86rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(212, 175, 55, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 175, 55, 0.3)';
              }}
            >
              <PhoneCall size={16} />
              +1 (800) 888-LUXE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}