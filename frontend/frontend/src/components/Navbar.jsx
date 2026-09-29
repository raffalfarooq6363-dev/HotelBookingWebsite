import React, { useState, useEffect } from 'react';
import { 
  Hotel, 
  Heart, 
  Briefcase, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { CURRENCIES } from '../data/hotelsData';

export default function Navbar({
  currency,
  setCurrency,
  wishlistCount,
  bookingsCount,
  onOpenWishlist,
  onOpenBookings,
  onOpenAuth,
  currentUser,
  onLogout
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Rooms & Suites', href: '#catalog' },
    { name: 'Destinations', href: '#destinations' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Special Offers', href: '#offers' },
    { name: 'Guest Reviews', href: '#reviews' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.35s ease',
        background: isScrolled 
          ? 'rgba(255, 255, 255, 0.96)' 
          : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(197, 155, 63, 0.22)',
        boxShadow: isScrolled ? '0 10px 30px rgba(180, 160, 120, 0.12)' : '0 4px 20px rgba(180, 160, 120, 0.05)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <a 
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#1c1917',
            textDecoration: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            background: 'var(--gold-gradient)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(197, 155, 63, 0.35)'
          }}>
            <Hotel size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '1.45rem', 
              fontWeight: 700, 
              letterSpacing: '0.03em',
              color: '#1c1917',
              lineHeight: 1
            }}>
              Luxe<span style={{ color: 'var(--gold)' }}>Haven</span>
            </span>
            <span style={{ 
              fontSize: '0.65rem', 
              letterSpacing: '0.22em', 
              textTransform: 'uppercase', 
              color: '#857f77',
              marginTop: '4px',
              fontWeight: 600
            }}>
              Hotels & Resorts
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                color: '#292524',
                fontSize: '0.92rem',
                fontWeight: 600,
                letterSpacing: '0.01em',
                transition: 'color 0.2s ease',
                position: 'relative',
                padding: '6px 0'
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.target.style.color = '#292524')}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Currency Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#1c1917',
                background: '#ffffff',
                border: '1px solid #e8e2d5',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
              aria-label="Currency Selector"
            >
              <span>{currency.code}</span>
              <span style={{ color: 'var(--gold)' }}>({currency.symbol})</span>
              <ChevronDown size={14} style={{ color: '#857f77' }} />
            </button>

            {currencyDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid rgba(197, 155, 63, 0.3)',
                  borderRadius: '10px',
                  padding: '6px',
                  minWidth: '140px',
                  boxShadow: '0 12px 30px rgba(160, 140, 110, 0.15)',
                  zIndex: 950
                }}
              >
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      color: currency.code === curr.code ? 'var(--gold)' : '#1c1917',
                      fontSize: '0.85rem',
                      fontWeight: currency.code === curr.code ? 700 : 500,
                      background: currency.code === curr.code ? 'var(--gold-light)' : 'none'
                    }}
                  >
                    <span>{curr.code}</span>
                    <span style={{ color: 'var(--gold)' }}>{curr.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #e8e2d5',
              color: '#1c1917',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
            title="Saved Favorites"
            aria-label="Wishlist"
          >
            <Heart size={18} style={{ color: wishlistCount > 0 ? '#ef4444' : '#1c1917', fill: wishlistCount > 0 ? '#ef4444' : 'none' }} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* My Bookings Button */}
          <button
            onClick={onOpenBookings}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--gold-light)',
              border: '1px solid var(--gold-border)',
              color: '#8b5e14',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(197, 155, 63, 0.08)'
            }}
            title="Manage Reservations"
          >
            <Briefcase size={16} style={{ color: 'var(--gold)' }} />
            <span className="hide-sm">My Bookings</span>
            {bookingsCount > 0 && (
              <span
                style={{
                  background: 'var(--gold)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}
              >
                {bookingsCount}
              </span>
            )}
          </button>

          {/* User Profile / Sign In */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--gold-gradient)',
                  color: '#ffffff',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(197, 155, 63, 0.25)'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#1c1917',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hide-sm">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#ffffff',
                    border: '1px solid rgba(197, 155, 63, 0.3)',
                    borderRadius: '10px',
                    padding: '8px',
                    minWidth: '200px',
                    boxShadow: '0 12px 30px rgba(160, 140, 110, 0.15)',
                    zIndex: 950
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1ece1' }}>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#1c1917' }}>{currentUser.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#857f77' }}>{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onOpenBookings();
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      color: '#1c1917',
                      fontSize: '0.85rem',
                      marginTop: '4px'
                    }}
                  >
                    <Briefcase size={16} style={{ color: 'var(--gold)' }} /> My Reservations
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      color: '#ef4444',
                      fontSize: '0.85rem'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--gold-gradient)',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(197, 155, 63, 0.3)'
              }}
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #e8e2d5',
              color: '#1c1917'
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            background: '#ffffff',
            borderBottom: '1px solid rgba(197, 155, 63, 0.25)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 15px 35px rgba(160, 140, 110, 0.15)'
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#1c1917',
                fontSize: '1.05rem',
                fontWeight: 600,
                padding: '8px 0',
                borderBottom: '1px solid #f4ede2'
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
