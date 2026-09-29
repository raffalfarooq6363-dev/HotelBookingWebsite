import React, { useState } from 'react';
import { 
  Hotel, 
  Mail, 
  Send, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Globe, 
  Share2, 
  Compass, 
  MessageCircle, 
  Check 
} from 'lucide-react';

export default function Footer({ onSubscribeNewsletter }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    if (onSubscribeNewsletter) {
      onSubscribeNewsletter(email);
    }
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer style={{ 
      backgroundColor: '#f6f3ec', 
      color: '#57534e', 
      paddingTop: '80px', 
      paddingBottom: '40px', 
      borderTop: '1px solid #e8e2d5' 
    }}>
      <div className="container">
        {/* Top Newsletter Banner - Luminous Light Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '70px',
          border: '1px solid rgba(197, 155, 63, 0.3)',
          boxShadow: '0 12px 35px rgba(180, 160, 120, 0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div style={{ maxWidth: '480px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: 700 }}>
              The LuxeClub Journal
            </span>
            <h3 style={{ fontSize: '1.65rem', color: '#1c1917', margin: '6px 0 8px 0', fontFamily: 'var(--font-serif)' }}>
              Join Our Private Circle
            </h3>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#57534e' }}>
              Receive invitation-only private sale alerts, seasonal complimentary upgrade codes, and insider travel dossiers.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexGrow: 1, maxWidth: '440px' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#857f77' }} />
              <input
                type="email"
                required
                placeholder="Enter your private email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1px solid #dcd5c9',
                  color: '#1c1917',
                  fontSize: '0.9rem',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-gold"
              style={{ padding: '12px 22px', borderRadius: '8px' }}
            >
              {subscribed ? <Check size={18} /> : <Send size={18} />}
            </button>
          </form>
        </div>

        {/* 4 Columns Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'var(--gold-gradient)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 3px 12px rgba(197, 155, 63, 0.3)'
              }}>
                <Hotel size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: '#1c1917' }}>
                Luxe<span style={{ color: 'var(--gold)' }}>Haven</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '20px', color: '#57534e' }}>
              Curating architectural masterpieces and unparalleled private stays for the world’s most refined travelers.
            </p>
            <div style={{ display: 'flex', gap: '14px' }}>
              <a href="#" style={{ color: '#857f77', transition: 'color 0.2s' }} aria-label="Global Network"><Globe size={18} /></a>
              <a href="#" style={{ color: '#857f77', transition: 'color 0.2s' }} aria-label="Social Share"><Share2 size={18} /></a>
              <a href="#" style={{ color: '#857f77', transition: 'color 0.2s' }} aria-label="Discover"><Compass size={18} /></a>
              <a href="#" style={{ color: '#857f77', transition: 'color 0.2s' }} aria-label="Concierge Chat"><MessageCircle size={18} /></a>
            </div>
          </div>

          {/* Col 2: Destinations */}
          <div>
            <h4 style={{ color: '#1c1917', fontSize: '1rem', marginBottom: '16px' }}>Destinations</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a href="#destinations" style={{ color: '#57534e' }}>Malé Atoll, Maldives</a></li>
              <li><a href="#destinations" style={{ color: '#57534e' }}>Paris, France</a></li>
              <li><a href="#destinations" style={{ color: '#57534e' }}>Ubud & Seminyak, Bali</a></li>
              <li><a href="#destinations" style={{ color: '#57534e' }}>Zermatt, Swiss Alps</a></li>
              <li><a href="#destinations" style={{ color: '#57534e' }}>Roppongi, Tokyo</a></li>
              <li><a href="#destinations" style={{ color: '#57534e' }}>Oia, Santorini</a></li>
              <li><a href="#destinations" style={{ color: '#57534e' }}>Central Park, New York</a></li>
            </ul>
          </div>

          {/* Col 3: Experiences */}
          <div>
            <h4 style={{ color: '#1c1917', fontSize: '1rem', marginBottom: '16px' }}>Experiences</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a href="#experiences" style={{ color: '#57534e' }}>Michelin-Star Gastronomy</a></li>
              <li><a href="#experiences" style={{ color: '#57534e' }}>Ayurvedic Thermal Spa</a></li>
              <li><a href="#experiences" style={{ color: '#57534e' }}>Private Yacht Charters</a></li>
              <li><a href="#experiences" style={{ color: '#57534e' }}>Alpine Helicopter Flights</a></li>
              <li><a href="#offers" style={{ color: '#57534e' }}>Honeymoon Sanctuaries</a></li>
              <li><a href="#offers" style={{ color: '#57534e' }}>Extended Stay Privileges</a></li>
            </ul>
          </div>

          {/* Col 4: Concierge & Contact */}
          <div>
            <h4 style={{ color: '#1c1917', fontSize: '1rem', marginBottom: '16px' }}>24/7 Global Concierge</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#44403c' }}>
                <Phone size={16} style={{ color: 'var(--gold)' }} />
                <span>+1 (800) 892-LUXE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#44403c' }}>
                <Mail size={16} style={{ color: 'var(--gold)' }} />
                <span>concierge@luxehaven.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#44403c' }}>
                <MapPin size={16} style={{ color: 'var(--gold)' }} />
                <span>Mayfair, London • 5th Ave, NY</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: '#f4ede2', borderRadius: '8px', border: '1px solid #e8e0d2' }}>
              <span style={{ fontSize: '0.78rem', color: '#57534e', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <ShieldCheck size={16} style={{ color: 'var(--gold)' }} /> Verified 5-Star Hospitality
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security */}
        <div style={{
          borderTop: '1px solid #e8e2d5',
          paddingTop: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#78716c'
        }}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} LuxeHaven Hotels & Resorts Group. All Rights Reserved.
          </p>

          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: '#78716c' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#78716c' }}>Terms of Service</a>
            <a href="#" style={{ color: '#78716c' }}>Cookie Preferences</a>
            <a href="#" style={{ color: '#78716c' }}>Security Verification</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
