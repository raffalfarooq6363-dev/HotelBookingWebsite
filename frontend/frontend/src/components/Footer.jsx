import React, { useState } from 'react';
import {
  Hotel, Mail, Send, ShieldCheck,
  Phone, MapPin, Globe, Share2, Compass, MessageCircle, Check
} from 'lucide-react';

export default function Footer({ onSubscribeNewsletter }) {
  const [email, setEmail]         = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    if (onSubscribeNewsletter) onSubscribeNewsletter(email);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const linkStyle = {
    color: 'rgba(255,255,255,0.52)',
    fontSize: '0.87rem',
    lineHeight: '2',
    transition: 'color 0.2s ease',
    display: 'block',
  };

  const headingStyle = {
    color: '#fff',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    marginBottom: '18px',
    fontFamily: 'var(--font-sans)',
  };

  return (
    <footer style={{
      background:   'var(--bg-dark)',
      borderTop:    '3px solid var(--gold)',
      paddingTop:   '80px',
      paddingBottom:'40px',
      position:     'relative',
      overflow:     'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-80px',
        width: '450px', height: '450px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,145,58,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,64,128,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container">

        {/* Newsletter Banner */}
        <div style={{
          background:   'linear-gradient(135deg, rgba(184,145,58,0.14) 0%, rgba(30,64,128,0.12) 100%)',
          borderRadius: '20px',
          padding:      '44px 48px',
          marginBottom: '72px',
          border:       '1px solid rgba(184,145,58,0.22)',
          display:      'flex',
          flexWrap:     'wrap',
          alignItems:   'center',
          justifyContent: 'space-between',
          gap:          '28px',
        }}>
          <div style={{ maxWidth: '460px' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 700, marginBottom: '10px' }}>
              The LuxeClub Journal
            </div>
            <h3 style={{ fontSize: '1.7rem', color: '#fff', margin: '0 0 10px 0', fontFamily: 'var(--font-serif)' }}>
              Join Our Private Circle
            </h3>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              Receive invitation-only private sale alerts, seasonal upgrade codes, and insider travel dossiers.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexGrow: 1, maxWidth: '440px' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
              <input
                type="email"
                required
                placeholder="Enter your private email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 16px 13px 42px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <button type="submit" className="btn-gold" style={{ padding: '13px 22px', borderRadius: '10px', flexShrink: 0 }}>
              {subscribed ? <Check size={18} /> : <Send size={18} />}
            </button>
          </form>
        </div>

        {/* 4-Column Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '44px',
          marginBottom: '64px',
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px', height: '38px',
                background: 'var(--gold-gradient)',
                borderRadius: '9px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px var(--gold-glow)',
              }}>
                <Hotel size={20} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                Luxe<span style={{ color: 'var(--gold)' }}>Haven</span>
              </span>
            </div>
            <p style={{ fontSize: '0.87rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', marginBottom: '22px' }}>
              Curating architectural masterpieces and private stays for the world's most refined travelers.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[Globe, Share2, Compass, MessageCircle].map((Icon, i) => (
                <a key={i} href="#"
                  style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <div style={headingStyle}>Destinations</div>
            {['Malé Atoll, Maldives','Paris, France','Ubud & Seminyak, Bali','Zermatt, Swiss Alps','Roppongi, Tokyo','Oia, Santorini','Central Park, New York'].map(d => (
              <a key={d} href="#destinations" style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.52)'}
              >{d}</a>
            ))}
          </div>

          {/* Experiences */}
          <div>
            <div style={headingStyle}>Experiences</div>
            {['Michelin-Star Gastronomy','Ayurvedic Thermal Spa','Private Yacht Charters','Alpine Helicopter Flights','Honeymoon Sanctuaries','Extended Stay Privileges'].map(ex => (
              <a key={ex} href="#experiences" style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.52)'}
              >{ex}</a>
            ))}
          </div>

          {/* Concierge */}
          <div>
            <div style={headingStyle}>24/7 Global Concierge</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              {[
                { icon: <Phone size={14} />, text: '+1 (800) 892-LUXE' },
                { icon: <Mail size={14} />,  text: 'concierge@luxehaven.com' },
                { icon: <MapPin size={14} />,text: 'Mayfair, London • 5th Ave, NY' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.58)', fontSize: '0.87rem' }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
            <div style={{
              padding: '12px 14px',
              background: 'rgba(184,145,58,0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(184,145,58,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
                <ShieldCheck size={14} style={{ color: 'var(--gold)' }} />
                Verified 5-Star Hospitality
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop:  '1px solid rgba(255,255,255,0.08)',
          paddingTop: '28px',
          display:    'flex',
          flexWrap:   'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap:        '14px',
          fontSize:   '0.8rem',
          color:      'rgba(255,255,255,0.3)',
        }}>
          <span>© {new Date().getFullYear()} LuxeHaven Hotels &amp; Resorts Group. All rights reserved.</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {['Privacy Policy','Terms of Service','Cookie Preferences','Security'].map(l => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
