import React, { useState, useMemo } from 'react';
import {
  User, Mail, Shield, Calendar, MapPin, CreditCard,
  Heart, Star, Clock, ChevronRight, LogOut, Briefcase,
  Search, Filter, ArrowLeft, X, CheckCircle, XCircle,
  Award, TrendingUp, Sparkles, Edit3, Eye, MessageCircle,
  Printer, Banknote
} from 'lucide-react';
import CustomerChatWidget from './CustomerChatWidget';
import InlineChatView from './InlineChatView';
import VoucherModal from './VoucherModal';

export default function CustomerDashboard({
  currentUser,
  bookings,
  wishlist,
  currency,
  onCancelBooking,
  onBookNow,
  onRemoveWishlistItem,
  onLogout,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState(null);

  // Computed stats
  const stats = useMemo(() => {
    const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
    const cancelled = bookings.filter(b => b.status === 'Cancelled').length;
    const totalSpent = bookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + (b.totalAmountUSD || b.convertedTotal || 0), 0);
    const totalNights = bookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + (b.nights || 0), 0);

    return { confirmed, cancelled, totalSpent, totalNights, total: bookings.length };
  }, [bookings]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    let result = bookings;
    if (bookingFilter !== 'all') {
      result = result.filter(b => b.status === bookingFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b =>
        (b.id || '').toLowerCase().includes(term) ||
        (b.room?.name || b.roomName || '').toLowerCase().includes(term) ||
        (b.room?.destinationName || b.destinationName || '').toLowerCase().includes(term)
      );
    }
    return result;
  }, [bookings, bookingFilter, searchTerm]);

  const tabs = [
    { id: 'overview',  label: 'Overview',     icon: TrendingUp   },
    { id: 'bookings',  label: 'My Bookings',  icon: Briefcase    },
    { id: 'wishlist',  label: 'Wishlist',     icon: Heart        },
    { id: 'chat',      label: 'Chat Support', icon: MessageCircle },
    { id: 'profile',   label: 'Profile',      icon: User         }
  ];

  const formatPrice = (amount) => {
    if (!amount) return '$0';
    return `${currency?.symbol || '$'}${Math.round(amount * (currency?.rate || 1)).toLocaleString()}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      paddingTop: 'var(--nav-height)',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* ── Luxury Obsidian Header Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #090d18 0%, #111827 50%, #0d121f 100%)',
        padding: '34px 0 34px 0',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
        flexShrink: 0
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), rgba(245, 211, 114, 0.85), rgba(212, 175, 55, 0.4), transparent)',
          zIndex: 2
        }} />
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px', width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div className="container">
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', fontWeight: 500,
              marginBottom: '16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
              padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f7df94'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
          >
            <ArrowLeft size={16} /> Back to LuxeHaven
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #e5c158 0%, #b89037 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', fontWeight: 800, border: '2px solid rgba(255,255,255,0.6)',
              color: '#0b0e14', boxShadow: '0 4px 18px rgba(212,175,55,0.35)'
            }}>
              {currentUser?.name?.charAt(0)?.toUpperCase() || 'G'}
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', margin: 0, fontWeight: 700, color: '#fff' }}>
                Welcome, {currentUser?.name?.split(' ')[0] || 'Guest'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>{currentUser?.email}</span>
                <span style={{
                  background: 'rgba(212,175,55,0.18)', color: '#f7df94', padding: '3px 12px',
                  borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700,
                  letterSpacing: '0.05em', border: '1px solid rgba(212,175,55,0.35)',
                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                }}>
                  <Sparkles size={11} />
                  {currentUser?.membershipTier || 'Prestige VIP Member'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: Sidebar + Content ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* ── LEFT SIDEBAR ── */}
        <aside style={{
          width: '260px',
          minWidth: '260px',
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          gap: '4px',
          position: 'sticky',
          top: 'var(--nav-height)',
          height: 'calc(100vh - var(--nav-height))',
          overflowY: 'auto',
          alignSelf: 'flex-start'
        }}>
          {/* Nav label */}
          <p style={{
            fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            margin: '0 0 10px 8px'
          }}>
            Navigation
          </p>

          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#f7df94' : 'rgba(255, 255, 255, 0.75)',
                  background: isActive ? 'var(--primary-pale)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.18s ease',
                  position: 'relative'
                }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '3px', borderRadius: '0 3px 3px 0',
                    background: 'var(--gold)'
                  }} />
                )}
                <tab.icon
                  size={18}
                  style={{ color: isActive ? 'var(--gold)' : 'rgba(255, 255, 255, 0.5)', flexShrink: 0 }}
                />
                {tab.label}
              </button>
            );
          })}

          {/* Divider + Sign Out at bottom */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={onLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px',
                fontSize: '0.9rem', fontWeight: 600,
                background: '#fef2f2', color: '#ef4444',
                border: 'none', cursor: 'pointer', width: '100%'
              }}
            >
              <LogOut size={18} style={{ flexShrink: 0 }} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, minWidth: 0, padding: '32px 28px', overflowY: 'auto' }}>

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px', marginBottom: '32px'
              }}>
                {[
                  { label: 'Total Bookings', value: stats.total,                   icon: Briefcase,   color: 'var(--primary-light)' },
                  { label: 'Confirmed',       value: stats.confirmed,               icon: CheckCircle, color: '#10b981' },
                  { label: 'Total Spent',     value: formatPrice(stats.totalSpent), icon: CreditCard,  color: 'var(--primary)' },
                  { label: 'Nights Stayed',   value: stats.totalNights,             icon: Calendar,    color: 'var(--gold)' }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-card)', borderRadius: '14px', padding: '22px',
                    border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {stat.label}
                      </span>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'var(--primary-pale)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <stat.icon size={18} style={{ color: stat.color }} />
                      </div>
                    </div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Reservations */}
              <div style={{
                background: 'var(--bg-card)', borderRadius: '14px', padding: '24px',
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                    Recent Reservations
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    style={{ color: 'var(--gold-hover)', fontSize: '0.82rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                {bookings.slice(0, 3).map(booking => (
                  <div key={booking.id} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 0', borderBottom: '1px solid var(--border-subtle)'
                  }}>
                    <img
                      src={booking.room?.images?.[0] || booking.roomImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=100&q=80'}
                      alt="" style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {booking.room?.name || booking.roomName}
                      </p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {booking.checkIn} → {booking.checkOut} · {booking.nights} nights
                      </p>
                      <div style={{ marginTop: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.68rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          💵 {booking.paymentMethod || 'Cash on Arrival'}
                        </span>
                        <button
                          onClick={() => setSelectedVoucherBooking(booking)}
                          style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          View Voucher
                        </button>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                      background: booking.status === 'Confirmed' ? '#ecfdf5' : '#fef2f2',
                      color: booking.status === 'Confirmed' ? '#059669' : '#dc2626'
                    }}>
                      {booking.status}
                    </span>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '0.9rem' }}>
                    No reservations yet. Start exploring our luxury suites!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ─── BOOKINGS TAB ─── */}
          {activeTab === 'bookings' && (
            <div>
              {/* Filters */}
              <div style={{
                display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                  <input
                    type="text" placeholder="Search by booking ID, room, or destination..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px',
                      border: '1px solid var(--border)', fontSize: '0.88rem', background: 'var(--bg-card)', color: '#ffffff'
                    }}
                  />
                </div>
                {['all', 'Confirmed', 'Cancelled'].map(f => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    style={{
                      padding: '9px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                      background: bookingFilter === f ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.05)',
                      color: bookingFilter === f ? '#0c0f17' : 'rgba(255, 255, 255, 0.75)',
                      border: bookingFilter === f ? 'none' : '1px solid var(--border)',
                      cursor: 'pointer'
                    }}
                  >
                    {f === 'all' ? 'All' : f}
                  </button>
                ))}
              </div>

              {/* Booking Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredBookings.map(booking => (
                  <div key={booking.id} style={{
                    background: 'var(--bg-card)', borderRadius: '14px', padding: '20px',
                    border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)',
                    display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap'
                  }}>
                    <img
                      src={booking.room?.images?.[0] || booking.roomImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=80'}
                      alt="" style={{ width: '100px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                            {booking.room?.name || booking.roomName}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} /> {booking.room?.destinationName || booking.destinationName}
                          </p>
                        </div>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                          background: booking.status === 'Confirmed' ? '#ecfdf5' : '#fef2f2',
                          color: booking.status === 'Confirmed' ? '#059669' : '#dc2626'
                        }}>
                          {booking.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> {booking.checkIn} → {booking.checkOut}
                        </span>
                        <span>{booking.nights} nights</span>
                        <span>{booking.guests}</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {booking.currencySymbol || '$'}{booking.convertedTotal || booking.totalAmountUSD}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600,
                          background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px'
                        }}>
                          Ref: {booking.id}
                        </span>

                        <span style={{
                          fontSize: '0.72rem', background: '#ecfdf5', color: '#065f46',
                          border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: '6px', fontWeight: 600,
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          💵 {booking.paymentMethod || 'Cash on Arrival'}
                        </span>

                        <button
                          onClick={() => setSelectedVoucherBooking(booking)}
                          style={{
                            fontSize: '0.72rem', color: '#0f172a', fontWeight: 600,
                            background: '#ffffff', border: '1px solid #cbd5e1', padding: '3px 10px',
                            borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
                          }}
                        >
                          <Printer size={12} /> View Voucher
                        </button>

                        {booking.status === 'Confirmed' && (
                          <button
                            onClick={() => onCancelBooking(booking.id)}
                            style={{
                              fontSize: '0.72rem', color: '#ef4444', fontWeight: 600,
                              background: '#fef2f2', border: '1px solid #fee2e2', padding: '3px 8px', borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredBookings.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                    <Briefcase size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>No bookings found</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>Try adjusting your filters or make a new reservation.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── WISHLIST TAB ─── */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '18px', color: 'var(--text-main)' }}>
                Saved Stays ({wishlist.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {wishlist.map(room => (
                  <div key={room.id} style={{
                    background: 'var(--bg-card)', borderRadius: '14px', overflow: 'hidden',
                    border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)'
                  }}>
                    <img
                      src={room.images?.[0] || ''} alt={room.name}
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '16px' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{room.name}</p>
                      <p style={{ margin: '2px 0 8px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {room.destinationName}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '1rem' }}>
                          {formatPrice(room.pricePerNight)}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/night</span>
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => onBookNow(room)}
                            className="btn-gold"
                            style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '0.78rem' }}
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => onRemoveWishlistItem(room.id)}
                            style={{
                              padding: '7px 10px', borderRadius: '8px', fontSize: '0.78rem',
                              background: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer'
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {wishlist.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                  <Heart size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Your wishlist is empty</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>Tap the heart icon on rooms to save them here.</p>
                </div>
              )}
            </div>
          )}

          {/* ─── PROFILE TAB ─── */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '600px' }}>
              <div style={{
                background: 'var(--bg-card)', borderRadius: '14px', padding: '28px',
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '24px', color: 'var(--text-main)' }}>
                  Account Details
                </h3>
                {[
                  { icon: User,     label: 'Full Name',           value: currentUser?.name || 'Guest' },
                  { icon: Mail,     label: 'Email Address',        value: currentUser?.email || 'Not provided' },
                  { icon: Award,    label: 'Membership Tier',      value: currentUser?.membershipTier || 'Prestige VIP' },
                  { icon: Shield,   label: 'Account Role',         value: currentUser?.role || 'Customer' },
                  { icon: Briefcase,label: 'Total Reservations',   value: stats.total },
                  { icon: CreditCard, label: 'Lifetime Spend',     value: formatPrice(stats.totalSpent) }
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 0', borderBottom: i < 5 ? '1px solid var(--border-subtle)' : 'none'
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: 'var(--primary-pale)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <item.icon size={16} style={{ color: 'var(--primary-light)' }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        {item.label}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── CHAT SUPPORT TAB ─── */}
          {activeTab === 'chat' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>
                  Chat with Hotel Manager
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Ask questions about your reservation, special requests, or anything else.
                  Your conversation history is always saved.
                </p>
              </div>
              <InlineChatView currentUser={currentUser} />
            </div>
          )}

        </main>
      </div>

      {/* Floating Chat Widget — shown on all tabs EXCEPT the chat tab */}
      {activeTab !== 'chat' && <CustomerChatWidget currentUser={currentUser} />}

      {/* Official Luxury Voucher Modal */}
      {selectedVoucherBooking && (
        <VoucherModal
          booking={selectedVoucherBooking}
          onClose={() => setSelectedVoucherBooking(null)}
        />
      )}
    </div>
  );
}
