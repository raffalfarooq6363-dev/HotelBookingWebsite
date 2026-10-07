import React, { useState, useEffect, useRef } from 'react';
import {
  Hotel,
  Heart,
  Briefcase,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  LayoutDashboard,
  Phone,
  Shield
} from 'lucide-react';
import { CURRENCIES } from '../data/hotelsData';

export default function Navbar({
  currency,
  setCurrency,
  wishlistCount,
  bookingsCount,
  onOpenWishlist,
  onOpenBookings,
  onOpenDashboard,
  onOpenAuth,
  currentUser,
  onLogout
}) {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [currencyOpen, setCurrencyOpen]       = useState(false);
  const [userDropOpen, setUserDropOpen]       = useState(false);

  const currencyRef = useRef(null);
  const userRef     = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target)) setCurrencyOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isManager = ['admin', 'manager'].includes(currentUser?.role?.toLowerCase());

  const navLinks = [
    { name: 'Rooms & Suites',  href: '#catalog' },
    { name: 'Destinations',    href: '#destinations' },
    { name: 'Experiences',     href: '#experiences' },
    { name: 'Offers',          href: '#offers' },
    { name: 'Reviews',         href: '#reviews' },
    { name: 'FAQ',             href: '#faq' },
  ];

  const navbarBg = isScrolled
    ? 'linear-gradient(135deg, rgba(59, 7, 100, 0.95) 0%, rgba(88, 28, 135, 0.92) 100%)'
    : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 100%)';

  const navbarShadow = isScrolled
    ? '0 8px 32px rgba(88, 28, 135, 0.25)'
    : '0 4px 20px rgba(88, 28, 135, 0.15)';

  return (
    <>
      <header style={{
        position:     'fixed',
        top:          0,
        left:         0,
        right:        0,
        zIndex:       900,
        height:       'var(--nav-height)',
        background:   navbarBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isScrolled
          ? '1px solid rgba(255, 255, 255, 0.15)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow:    navbarShadow,
        transition:   'all 0.3s ease',
      }}>
        <div className="container" style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>

          {/* ── Brand Logo ── */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'var(--gold-gradient)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px var(--gold-glow)',
            }}>
              <Hotel size={22} color="#fff" />
            </div>
            <div>
              <div style={{
                fontFamily:    'var(--font-serif)',
                fontSize:      '1.5rem',
                fontWeight:    700,
                color:         'var(--primary)',
                letterSpacing: '0.01em',
                lineHeight:    1,
              }}>
                Luxe<span style={{ color: 'var(--gold)' }}>Haven</span>
              </div>
              <div style={{
                fontSize:      '0.58rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color:         'var(--text-muted)',
                marginTop:     '3px',
                fontWeight:    600,
              }}>
                Hotels &amp; Resorts
              </div>
            </div>
          </a>

          {/* ── Desktop Nav Links ── */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            flex: 1,
            justifyContent: 'center',
          }}>
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  color:         '#ffffff',
                  fontSize:      '0.875rem',
                  fontWeight:    500,
                  padding:       '6px 13px',
                  borderRadius:  'var(--radius-sm)',
                  transition:    'all 0.2s ease',
                  whiteSpace:    'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#f472b6';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

            {/* Currency Selector */}
            <div ref={currencyRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         '5px',
                  background:  '#fff',
                  border:      '1px solid var(--border)',
                  borderRadius:'var(--radius-sm)',
                  padding:     '7px 11px',
                  fontSize:    '0.82rem',
                  fontWeight:  600,
                  color:       'var(--text-main)',
                  boxShadow:   'var(--shadow-xs)',
                  transition:  'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{currency.symbol}</span>
                <span>{currency.code}</span>
                <ChevronDown size={13} style={{ color: 'var(--text-muted)', transform: currencyOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>

              {currencyOpen && (
                <div style={{
                  position:    'absolute',
                  top:         'calc(100% + 8px)',
                  right:       0,
                  background:  '#fff',
                  border:      '1px solid var(--border)',
                  borderRadius:'var(--radius-md)',
                  padding:     '6px',
                  minWidth:    '150px',
                  boxShadow:   'var(--shadow-lg)',
                  zIndex:      960,
                  animation:   'fadeIn 0.15s ease',
                }}>
                  {CURRENCIES.map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => { setCurrency(curr); setCurrencyOpen(false); }}
                      style={{
                        width:        '100%',
                        display:      'flex',
                        alignItems:   'center',
                        justifyContent: 'space-between',
                        padding:      '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize:     '0.85rem',
                        fontWeight:   currency.code === curr.code ? 700 : 500,
                        color:        currency.code === curr.code ? 'var(--gold)' : 'var(--text-main)',
                        background:   currency.code === curr.code ? 'var(--gold-light)' : 'transparent',
                        transition:   'all 0.15s ease',
                      }}
                      onMouseEnter={e => { if (currency.code !== curr.code) e.currentTarget.style.background = 'var(--bg-alt)'; }}
                      onMouseLeave={e => { if (currency.code !== curr.code) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span>{curr.code}</span>
                      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              title="Saved Favourites"
              style={{
                position:    'relative',
                width:       '38px',
                height:      '38px',
                display:     'flex',
                alignItems:  'center',
                justifyContent: 'center',
                borderRadius:'var(--radius-sm)',
                background:  '#fff',
                border:      '1px solid var(--border)',
                color:       'var(--text-main)',
                boxShadow:   'var(--shadow-xs)',
                transition:  'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.background = '#fff5f5';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = '#fff';
              }}
            >
              <Heart
                size={17}
                style={{
                  color: wishlistCount > 0 ? '#ef4444' : 'var(--text-muted)',
                  fill:  wishlistCount > 0 ? '#ef4444' : 'none',
                  transition: '0.2s'
                }}
              />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px',
                  background: '#ef4444', color: '#fff',
                  fontSize: '0.65rem', fontWeight: 800,
                  width: '17px', height: '17px',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(239,68,68,0.5)',
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* My Bookings */}
            <button
              onClick={onOpenBookings}
              className="hide-sm"
              title="My Reservations"
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '7px',
                background: 'var(--primary-pale)',
                border:     '1px solid rgba(15,32,68,0.12)',
                color:      'var(--primary)',
                padding:    '8px 15px',
                borderRadius: 'var(--radius-sm)',
                fontSize:   '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                boxShadow:  'var(--shadow-xs)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--primary-pale)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.borderColor = 'rgba(15,32,68,0.12)';
              }}
            >
              <Briefcase size={15} />
              Bookings
              {bookingsCount > 0 && (
                <span style={{
                  background: 'var(--gold)',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {bookingsCount}
                </span>
              )}
            </button>

            {/* User Profile / Sign In */}
            {currentUser ? (
              <div ref={userRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropOpen(!userDropOpen)}
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '8px',
                    background: 'var(--gold-gradient)',
                    color:      '#fff',
                    padding:    '7px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize:   '0.85rem',
                    fontWeight: 600,
                    boxShadow:  '0 4px 16px var(--gold-glow)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                >
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 800,
                    border: '1.5px solid rgba(255,255,255,0.5)',
                  }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hide-sm">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown size={13} style={{ transform: userDropOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>

                {userDropOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: '#fff',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    minWidth: '210px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 960,
                    animation: 'fadeIn 0.15s ease',
                  }}>
                    {/* User info */}
                    <div style={{
                      padding: '10px 12px 12px',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: '6px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'var(--gold-gradient)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            {currentUser.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                            {currentUser.email}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        marginTop: '8px',
                        display: 'inline-block',
                        background: 'var(--gold-light)',
                        color: 'var(--gold-hover)',
                        border: '1px solid var(--gold-border)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '2px 10px',
                        borderRadius: 'var(--radius-full)',
                      }}>
                        {isManager ? '⭐ Manager' : currentUser.membershipTier || 'Member'}
                      </div>
                    </div>

                    {/* Dashboard */}
                    <DropItem
                      icon={<LayoutDashboard size={15} />}
                      label={isManager ? 'Manager Dashboard' : 'My Dashboard'}
                      onClick={() => { onOpenDashboard(); setUserDropOpen(false); }}
                    />

                    {/* My Reservations */}
                    <DropItem
                      icon={<Briefcase size={15} />}
                      label="My Reservations"
                      onClick={() => { onOpenBookings(); setUserDropOpen(false); }}
                    />

                    {/* Sign Out */}
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '6px', paddingTop: '6px' }}>
                      <DropItem
                        icon={<LogOut size={15} />}
                        label="Sign Out"
                        danger
                        onClick={() => { onLogout(); setUserDropOpen(false); }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        '7px',
                  background: 'var(--primary)',
                  color:      '#fff',
                  padding:    '8px 18px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize:   '0.88rem',
                  fontWeight: 600,
                  boxShadow:  '0 4px 16px rgba(15,32,68,0.28)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--gold)';
                  e.currentTarget.style.boxShadow = '0 6px 20px var(--gold-glow)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,32,68,0.28)';
                }}
              >
                <User size={15} />
                Sign In
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display:      'none',
                alignItems:   'center',
                justifyContent: 'center',
                width:        '38px',
                height:       '38px',
                borderRadius: 'var(--radius-sm)',
                background:   '#fff',
                border:       '1px solid var(--border)',
                color:        'var(--text-main)',
                boxShadow:    'var(--shadow-xs)',
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div style={{
          position:   'fixed',
          top:        'var(--nav-height)',
          left:       0,
          right:      0,
          background: '#fff',
          borderBottom: '1px solid var(--border)',
          padding:    '20px 24px',
          display:    'flex',
          flexDirection: 'column',
          gap:        '4px',
          boxShadow:  'var(--shadow-lg)',
          zIndex:     850,
          animation:  'fadeIn 0.2s ease',
        }}>
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color:       'var(--text-main)',
                fontSize:    '1rem',
                fontWeight:  600,
                padding:     '11px 14px',
                borderRadius:'var(--radius-sm)',
                borderBottom:'1px solid var(--bg-alt)',
                transition:  'all 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-pale)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {link.name}
            </a>
          ))}
          {/* Mobile bookings */}
          <button
            onClick={() => { onOpenBookings(); setMobileMenuOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 14px', borderRadius: 'var(--radius-sm)',
              fontSize: '1rem', fontWeight: 600, color: 'var(--primary)',
              marginTop: '6px', background: 'var(--primary-pale)',
              border: '1px solid rgba(15,32,68,0.1)',
            }}
          >
            <Briefcase size={16} />
            My Bookings {bookingsCount > 0 && `(${bookingsCount})`}
          </button>
          {/* Mobile staff link */}
          <a
            href="/manager"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)',
              marginTop: '4px',
            }}
          >
            <Shield size={14} />
            Staff / Manager Login
          </a>
        </div>
      )}
    </>
  );
}

// ── Dropdown Item Helper ──────────────────────────────
function DropItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width:       '100%',
        display:     'flex',
        alignItems:  'center',
        gap:         '9px',
        padding:     '9px 12px',
        borderRadius:'var(--radius-sm)',
        fontSize:    '0.87rem',
        fontWeight:  500,
        color:       danger ? '#ef4444' : 'var(--text-main)',
        textAlign:   'left',
        transition:  'all 0.15s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? '#fff5f5' : 'var(--bg-alt)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color: danger ? '#ef4444' : 'var(--gold)', flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}
