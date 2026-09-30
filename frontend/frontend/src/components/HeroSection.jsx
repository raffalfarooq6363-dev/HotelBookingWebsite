import React from 'react';
import { ShieldCheck, Award, Clock, Sparkles, ArrowRight } from 'lucide-react';
import SearchConsole from './SearchConsole';

export default function HeroSection({ searchFilters, setSearchFilters, onPerformSearch }) {
  return (
    <section style={{
      position:   'relative',
      minHeight:  '92vh',
      display:    'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingTop: 'calc(var(--nav-height) + 40px)',
      paddingBottom: '80px',
      overflow:   'hidden',
    }}>
      {/* Background Image */}
      <div style={{
        position:   'absolute',
        inset:      0,
        backgroundImage: `url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2200&q=90')`,
        backgroundSize:     'cover',
        backgroundPosition: 'center 45%',
        zIndex: 0,
      }} />

      {/* Gradient Overlays */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg, rgba(8,15,30,0.75) 0%, rgba(15,32,68,0.6) 50%, rgba(8,15,30,0.45) 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', zIndex: 2,
        background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 100%)',
      }} />

      {/* Decorative gold line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px', zIndex: 3,
        background: 'var(--gold-gradient)',
      }} />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>

        {/* Top Pill Badge */}
        <div style={{
          display:      'inline-flex',
          alignItems:   'center',
          gap:          '8px',
          background:   'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          border:       '1px solid rgba(184,145,58,0.5)',
          padding:      '7px 22px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '28px',
        }}>
          <Sparkles size={14} style={{ color: 'var(--gold-bright)' }} />
          <span style={{
            fontSize:      '0.73rem',
            fontWeight:    700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'var(--gold-bright)',
          }}>
            World's Leading Luxury Hotel Collection
          </span>
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize:      'clamp(2.6rem, 5.5vw, 4.8rem)',
          lineHeight:    1.12,
          fontWeight:    700,
          color:         '#ffffff',
          maxWidth:      '960px',
          margin:        '0 auto 22px',
          letterSpacing: '-0.02em',
          textShadow:    '0 4px 30px rgba(0,0,0,0.3)',
        }}>
          Where Elegance Meets{' '}
          <span style={{
            background:  'var(--gold-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Extraordinary Escapes
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize:   'clamp(1rem, 1.8vw, 1.2rem)',
          color:      'rgba(255,255,255,0.72)',
          maxWidth:   '680px',
          margin:     '0 auto 44px',
          lineHeight: 1.7,
          fontWeight: 400,
        }}>
          Discover overwater villas, alpine chalets, and Parisian landmark suites — curated for those who expect nothing less than perfection.
        </p>

        {/* Search Console */}
        <SearchConsole
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          onPerformSearch={onPerformSearch}
        />

        {/* Trust Badges */}
        <div style={{
          display:       'flex',
          flexWrap:      'wrap',
          justifyContent:'center',
          gap:           '12px',
          marginTop:     '48px',
        }}>
          {[
            { icon: <Award size={16} />,       text: 'Best Rate Guarantee' },
            { icon: <Clock size={16} />,        text: 'Free 48h Cancellation' },
            { icon: <ShieldCheck size={16} />,  text: '100% Verified Stays' },
            { icon: <Sparkles size={16} />,     text: '24/7 Personal Concierge' },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '8px',
              background:   'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              border:       '1px solid rgba(255,255,255,0.18)',
              borderRadius: 'var(--radius-full)',
              padding:      '8px 18px',
            }}>
              <span style={{ color: 'var(--gold-bright)' }}>{icon}</span>
              <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap' }}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
            Explore Collection
          </span>
          <div style={{
            width: '1.5px', height: '42px',
            background: 'linear-gradient(to bottom, rgba(184,145,58,0.8), transparent)',
          }} />
        </div>
      </div>
    </section>
  );
}
