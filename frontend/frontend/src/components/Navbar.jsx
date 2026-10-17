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
  const [isScrolled, setIsScrolled]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen]     = useState(false);
  const [userDropOpen, setUserDropOpen]     = useState(false);

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

  const isManager = currentUser?.role && currentUser.role.toLowerCase() !== 'user';

  const navLinks = [
    { name: 'Rooms & Suites', href: '#catalog' },
    { name: 'Destinations',   href: '#destinations' },
    { name: 'Experiences',    href: '#experiences' },
    { name: 'Offers',         href: '#offers' },
    { name: 'Reviews',        href: '#reviews' },
    { name: 'FAQ',            href: '#faq' },
  ];

  const navbarBg = isScrolled
    ? 'rgba(9, 13, 24, 0.94)'
    : 'rgba(12, 17, 30, 0.82)';

  const navbarBorder = isScrolled
    ? '1px solid rgba(212, 175, 55, 0.25)'
    : '1px solid rgba(255, 255, 255, 0.08)';

  const navbarShadow = isScrolled
    ? '0 12px 36px rgba(0, 0, 0, 0.5)'
    : '0 4px 24px rgba(0, 0, 0, 0.3)';

  return (
    <>
      <header
        className="luxury-navbar"
        style={{
          background: navbarBg,
          borderBottom: navbarBorder,
          boxShadow: navbarShadow,
        }}
      >
        {/* Top Gold Hairline */}
        <div className="luxury-navbar-topline" />

        <div
          className="container"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* ── Brand Logo ── */}
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
              textDecoration: 'none',
            }}
          >
            {/* Crest Emblem */}
            <div
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #e5c158 0%, #d4af37 50%, #b89037 100%)',
                borderRadius: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 18px rgba(212, 175, 55, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(255, 240, 190, 0.5)',
                flexShrink: 0,
                transition: 'transform 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Hotel size={22} color="#0c0f17" strokeWidth={2.4} />
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1px',
                }}
              >
                <span>Luxe</span>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #fce08c 0%, #d4af37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: '#d4af37',
                  }}
                >
                  Haven
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(225, 220, 205, 0.82)',
                  marginTop: '2px',
                  fontWeight: 600,
                }}
              >
                Hotels &amp; Resorts
              </div>
            </div>
          </a>

          {/* ── Desktop Navigation Links ── */}
          <nav
            className="nav-desktop-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link-item"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
            {/* Currency Selector */}
            <div ref={currencyRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="nav-glass-btn"
                style={{
                  height: '38px',
                  padding: '0 12px',
                  border: currencyOpen
                    ? '1px solid rgba(212, 175, 55, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.16)',
                }}
                aria-label="Select Currency"
              >
                <span style={{ color: '#e5c158', fontWeight: 800 }}>{currency.symbol}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{currency.code}</span>
                <ChevronDown
                  size={13}
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    transform: currencyOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {currencyOpen && (
                <div
                  className="nav-dropdown-menu"
                  style={{ minWidth: '155px' }}
                >
                  <div
                    style={{
                      fontSize: '0.68rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'rgba(255, 255, 255, 0.5)',
                      padding: '4px 10px 8px',
                      fontWeight: 700,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      marginBottom: '4px',
                    }}
                  >
                    Select Currency
                  </div>
                  {CURRENCIES.map((curr) => {
                    const isSelected = currency.code === curr.code;
                    return (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setCurrency(curr);
                          setCurrencyOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.84rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#f7df94' : 'rgba(255, 255, 255, 0.9)',
                          background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                          border: isSelected
                            ? '1px solid rgba(212, 175, 55, 0.35)'
                            : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          marginBottom: '2px',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.color = '#f7df94';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                          }
                        }}
                      >
                        <span>{curr.code}</span>
                        <span style={{ color: '#e5c158', fontWeight: 800 }}>{curr.symbol}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="nav-glass-btn"
              title="Saved Suites & Villas"
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                padding: 0,
              }}
            >
              <Heart
                size={16}
                style={{
                  color: wishlistCount > 0 ? '#f43f5e' : 'rgba(255, 255, 255, 0.85)',
                  fill: wishlistCount > 0 ? '#f43f5e' : 'none',
                  transition: 'all 0.2s ease',
                }}
              />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                    color: '#ffffff',
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(244, 63, 94, 0.6)',
                    border: '1.5px solid rgba(13, 17, 28, 0.9)',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* My Bookings Button */}
            <button
              onClick={onOpenBookings}
              className="nav-glass-btn hide-sm"
              title="My Reservations"
              style={{
                height: '38px',
                padding: '0 14px',
              }}
            >
              <Briefcase size={15} style={{ color: '#e5c158' }} />
              <span>Bookings</span>
              {bookingsCount > 0 && (
                <span
                  style={{
                    background: 'linear-gradient(135deg, #e5c158, #b89037)',
                    color: '#0b0e14',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    marginLeft: '2px',
                    boxShadow: '0 2px 6px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  {bookingsCount}
                </span>
              )}
            </button>

            {/* User Profile / Sign In */}
            {currentUser ? (
              <div ref={userRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropOpen(!userDropOpen)}
                  className="nav-glass-btn"
                  style={{
                    height: '38px',
                    padding: '0 12px 0 6px',
                    border: userDropOpen
                      ? '1px solid rgba(212, 175, 55, 0.6)'
                      : '1px solid rgba(212, 175, 55, 0.3)',
                    background: userDropOpen
                      ? 'rgba(212, 175, 55, 0.14)'
                      : 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {/* User Initial Avatar */}
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e5c158 0%, #b89037 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#0b0e14',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                      border: '1.5px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <span className="hide-sm" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}
                  </span>

                  <ChevronDown
                    size={13}
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      transform: userDropOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>

                {userDropOpen && (
                  <div
                    className="nav-dropdown-menu"
                    style={{ minWidth: '220px' }}
                  >
                    {/* User info Card */}
                    <div
                      style={{
                        padding: '10px 12px 12px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        marginBottom: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #e5c158 0%, #b89037 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0b0e14',
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            flexShrink: 0,
                            border: '1.5px solid rgba(255, 240, 190, 0.7)',
                          }}
                        >
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                            }}
                          >
                            {currentUser.name}
                          </div>
                          <div
                            style={{
                              fontSize: '0.74rem',
                              color: 'rgba(255, 255, 255, 0.6)',
                              marginTop: '1px',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                            }}
                          >
                            {currentUser.email}
                          </div>
                        </div>
                      </div>

                      {/* Tier / Role Tag */}
                      <div
                        style={{
                          marginTop: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: isManager
                            ? 'rgba(212, 175, 55, 0.2)'
                            : 'rgba(59, 130, 246, 0.18)',
                          color: isManager ? '#f7df94' : '#93c5fd',
                          border: isManager
                            ? '1px solid rgba(212, 175, 55, 0.4)'
                            : '1px solid rgba(59, 130, 246, 0.35)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        {isManager ? (
                          <>
                            <Shield size={11} style={{ color: '#e5c158' }} />
                            <span>{currentUser.role} Portal</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={11} />
                            <span>{currentUser.membershipTier || 'Member'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Dashboard */}
                    <DropItem
                      icon={<LayoutDashboard size={15} />}
                      label={isManager ? `${currentUser?.role || 'Staff'} Dashboard` : 'My Dashboard'}
                      onClick={() => {
                        onOpenDashboard();
                        setUserDropOpen(false);
                      }}
                    />

                    {/* My Reservations */}
                    <DropItem
                      icon={<Briefcase size={15} />}
                      label="My Reservations"
                      onClick={() => {
                        onOpenBookings();
                        setUserDropOpen(false);
                      }}
                    />

                    {/* Sign Out */}
                    <div
                      style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        marginTop: '6px',
                        paddingTop: '6px',
                      }}
                    >
                      <DropItem
                        icon={<LogOut size={15} />}
                        label="Sign Out"
                        danger
                        onClick={() => {
                          onLogout();
                          setUserDropOpen(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="nav-gold-cta"
                title="Sign in to your LuxeHaven account"
              >
                <User size={15} color="#0b0e14" strokeWidth={2.5} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-glass-btn nav-mobile-toggle"
              aria-label="Open Mobile Menu"
              style={{
                width: '38px',
                height: '38px',
                padding: 0,
              }}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-height, 74px)',
            left: 0,
            right: 0,
            background: 'rgba(10, 14, 24, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            padding: '20px 24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 24px 50px rgba(0, 0, 0, 0.8)',
            zIndex: 890,
            animation: 'navFadeIn 0.2s ease',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '12px 14px',
                borderRadius: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                transition: 'all 0.15s ease',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
                e.currentTarget.style.color = '#f7df94';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <span>{link.name}</span>
              <span style={{ color: 'rgba(212, 175, 55, 0.5)', fontSize: '0.9rem' }}>→</span>
            </a>
          ))}

          {/* Quick Actions in Mobile Drawer */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* My Bookings in Mobile */}
            <button
              onClick={() => {
                onOpenBookings();
                setMobileMenuOpen(false);
              }}
              className="nav-glass-btn"
              style={{
                flex: 1,
                height: '42px',
                fontSize: '0.88rem',
              }}
            >
              <Briefcase size={16} style={{ color: '#e5c158' }} />
              <span>Bookings ({bookingsCount})</span>
            </button>

            {/* Wishlist in Mobile */}
            <button
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="nav-glass-btn"
              style={{
                flex: 1,
                height: '42px',
                fontSize: '0.88rem',
              }}
            >
              <Heart
                size={16}
                style={{
                  color: wishlistCount > 0 ? '#f43f5e' : '#fff',
                  fill: wishlistCount > 0 ? '#f43f5e' : 'none',
                }}
              />
              <span>Wishlist ({wishlistCount})</span>
            </button>
          </div>

          {/* Staff / Manager Portal Link in Mobile */}
          <a
            href="/manager"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#e5c158',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              textDecoration: 'none',
              marginTop: '6px',
            }}
          >
            <Shield size={15} />
            <span>Staff &amp; Manager Portal</span>
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
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        padding: '9px 12px',
        borderRadius: '6px',
        fontSize: '0.86rem',
        fontWeight: 500,
        color: danger ? '#f87171' : 'rgba(255, 255, 255, 0.9)',
        background: 'transparent',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger
          ? 'rgba(239, 68, 68, 0.15)'
          : 'rgba(212, 175, 55, 0.12)';
        if (!danger) e.currentTarget.style.color = '#f7df94';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = danger ? '#f87171' : 'rgba(255, 255, 255, 0.9)';
      }}
    >
      <span style={{ color: danger ? '#f87171' : '#e5c158', flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}
