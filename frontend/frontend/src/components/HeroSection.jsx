import React from 'react';
import { ShieldCheck, Award, Clock, Sparkles } from 'lucide-react';
import SearchConsole from './SearchConsole';

export default function HeroSection({
  searchFilters,
  setSearchFilters,
  onPerformSearch
}) {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'calc(var(--nav-height) + 50px)',
        paddingBottom: '80px',
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.3) 35%, rgba(250, 248, 245, 0.85) 75%, var(--bg-cream) 100%), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2200&q=85')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        color: '#1c1917'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Top Luxury Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(197, 155, 63, 0.45)',
          padding: '7px 20px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '22px',
          boxShadow: '0 4px 20px rgba(197, 155, 63, 0.15)'
        }}>
          <Sparkles size={16} style={{ color: 'var(--gold)' }} />
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#8b5e14'
          }}>
            World's Leading Luxury Hotel Collection
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.3rem)',
          lineHeight: 1.15,
          fontWeight: 700,
          color: '#1c1917',
          maxWidth: '920px',
          margin: '0 auto 20px auto',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 20px rgba(255,255,255,0.8)'
        }}>
          Where Elegance Meets Extraordinary Escapes
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
          color: '#44403c',
          maxWidth: '720px',
          margin: '0 auto 40px auto',
          fontWeight: 450,
          lineHeight: 1.65
        }}>
          Discover overwater private sanctuaries, alpine timber chalets, and Parisian landmark suites tailored for unforgettable moments.
        </p>

        {/* Interactive Search Console */}
        <div style={{ marginTop: '24px' }}>
          <SearchConsole
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            onPerformSearch={onPerformSearch}
          />
        </div>

        {/* Key Guarantees Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '1000px',
            margin: '44px auto 0 auto',
            paddingTop: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Award size={20} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#292524' }}>
              Best Rate Guarantee
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Clock size={20} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#292524' }}>
              Flexible 48h Cancellation
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#292524' }}>
              100% Verified Luxury Stays
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Sparkles size={20} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#292524' }}>
              24/7 Personal Concierge
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
