import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, Users, Briefcase, DollarSign, Star, Hotel,
  Mail, TrendingUp, ChevronRight, ArrowLeft, Search,
  CheckCircle, XCircle, Clock, Eye, Trash2, Edit3,
  Shield, Calendar, MapPin, AlertCircle, RefreshCw,
  Filter, Download, MoreVertical
} from 'lucide-react';
import { api } from '../services/api';

export default function ManagerDashboard({ currentUser, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load all data
  const loadData = async () => {
    setRefreshing(true);
    try {
      const [statsData, bookingsData, usersData, reviewsData, roomsData, subsData] = await Promise.allSettled([
        api.getAdminStats(),
        api.getAllBookings(),
        api.getAllUsers(),
        api.getAllReviews(),
        api.getRooms(),
        api.getAllSubscribers()
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (bookingsData.status === 'fulfilled') setAllBookings(bookingsData.value);
      if (usersData.status === 'fulfilled') setAllUsers(usersData.value);
      if (reviewsData.status === 'fulfilled') setAllReviews(reviewsData.value);
      if (roomsData.status === 'fulfilled') setAllRooms(roomsData.value);
      if (subsData.status === 'fulfilled') setSubscribers(subsData.value);
    } catch (e) {
      console.warn('Dashboard data load error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Booking status update
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      setAllBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (e) {
      console.warn('Status update error:', e);
    }
  };

  // Delete room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.deleteRoom(roomId);
      setAllRooms(prev => prev.filter(r => r.id !== roomId));
    } catch (e) {
      console.warn('Delete room error:', e);
    }
  };

  // Filtered data
  const filteredBookings = useMemo(() => {
    let result = allBookings;
    if (bookingStatusFilter !== 'all') {
      result = result.filter(b => b.status === bookingStatusFilter);
    }
    if (bookingSearch) {
      const term = bookingSearch.toLowerCase();
      result = result.filter(b =>
        (b.id || '').toLowerCase().includes(term) ||
        (b.roomName || '').toLowerCase().includes(term) ||
        (b.email || '').toLowerCase().includes(term) ||
        (b.firstName || '').toLowerCase().includes(term) ||
        (b.lastName || '').toLowerCase().includes(term)
      );
    }
    return result;
  }, [allBookings, bookingStatusFilter, bookingSearch]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return allUsers;
    const term = userSearch.toLowerCase();
    return allUsers.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  }, [allUsers, userSearch]);

  // Computed stats fallback
  const computedStats = useMemo(() => {
    if (stats) return stats;
    return {
      totalBookings: allBookings.length,
      confirmedBookings: allBookings.filter(b => b.status === 'Confirmed').length,
      cancelledBookings: allBookings.filter(b => b.status === 'Cancelled').length,
      totalRevenue: allBookings.filter(b => b.status === 'Confirmed').reduce((s, b) => s + (b.totalAmountUSD || 0), 0),
      totalRooms: allRooms.length,
      totalUsers: allUsers.length,
      totalReviews: allReviews.length,
      totalSubscribers: subscribers.length,
      averageRating: allReviews.length > 0 ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(2) : 0
    };
  }, [stats, allBookings, allRooms, allUsers, allReviews, subscribers]);

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'bookings', label: 'Bookings', icon: Briefcase },
    { id: 'rooms', label: 'Rooms', icon: Hotel },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'newsletter', label: 'Newsletter', icon: Mail }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingTop: 'var(--nav-height)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
          <p style={{ fontWeight: 600 }}>Loading Manager Dashboard...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingTop: 'var(--nav-height)' }}>
      {/* Dashboard Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 100%)',
        padding: '36px 0 46px 0',
        color: '#ffffff', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px',
          borderRadius: '50%', background: 'rgba(244,114,182,0.12)', pointerEvents: 'none'
        }} />
        <div className="container">
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', fontWeight: 500,
              marginBottom: '14px', background: 'none', border: 'none', cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Shield size={18} style={{ color: 'var(--gold-bright)' }} />
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700, color: 'var(--gold-bright)' }}>
                  Manager Control Panel
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: 0, fontWeight: 700, color: '#fff' }}>
                Hotel Operations Dashboard
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.88rem', opacity: 0.8 }}>
                Signed in as {currentUser?.name} · {currentUser?.role || 'Admin'}
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={refreshing}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 18px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600,
                background: 'rgba(255,255,255,0.15)', color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <RefreshCw size={14} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 'var(--nav-height)', zIndex: 50
      }}>
        <div className="container" style={{ display: 'flex', gap: '2px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '13px 16px', fontSize: '0.85rem', fontWeight: 600,
                color: activeTab === tab.id ? 'var(--primary-light)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '3px solid var(--gold)' : '3px solid transparent',
                background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '28px 24px' }}>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px', marginBottom: '28px'
            }}>
              {[
                { label: 'Total Revenue', value: `$${Math.round(computedStats.totalRevenue).toLocaleString()}`, icon: DollarSign, color: '#059669', bg: '#ecfdf5' },
                { label: 'Total Bookings', value: computedStats.totalBookings, icon: Briefcase, color: 'var(--primary-light)', bg: 'var(--primary-pale)' },
                { label: 'Confirmed', value: computedStats.confirmedBookings, icon: CheckCircle, color: '#10b981', bg: '#ecfdf5' },
                { label: 'Cancelled', value: computedStats.cancelledBookings, icon: XCircle, color: '#ef4444', bg: '#fef2f2' },
                { label: 'Active Rooms', value: computedStats.totalRooms, icon: Hotel, color: 'var(--primary)', bg: 'var(--primary-pale)' },
                { label: 'Registered Users', value: computedStats.totalUsers, icon: Users, color: 'var(--primary-light)', bg: 'var(--primary-pale)' },
                { label: 'Guest Reviews', value: computedStats.totalReviews, icon: Star, color: '#f59e0b', bg: '#fffbeb' },
                { label: 'Avg Rating', value: `${computedStats.averageRating}★`, icon: TrendingUp, color: '#f59e0b', bg: '#fffbeb' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: '#ffffff', borderRadius: '12px', padding: '18px',
                  border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {stat.label}
                    </span>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: stat.bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <stat.icon size={16} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Bookings + Recent Users side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
              {/* Recent Bookings */}
              <div style={{
                background: '#ffffff', borderRadius: '14px', padding: '22px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                    Recent Bookings
                  </h3>
                  <button onClick={() => setActiveTab('bookings')} style={{
                    color: 'var(--gold-hover)', fontSize: '0.78rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '3px'
                  }}>
                    View All <ChevronRight size={13} />
                  </button>
                </div>
                {allBookings.slice(0, 5).map(b => (
                  <div key={b.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.82rem'
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>{b.firstName} {b.lastName}</p>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b.roomName} · {b.id}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 700,
                        background: b.status === 'Confirmed' ? '#ecfdf5' : '#fef2f2',
                        color: b.status === 'Confirmed' ? '#059669' : '#dc2626'
                      }}>
                        {b.status}
                      </span>
                      <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.72rem' }}>${b.totalAmountUSD}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Users */}
              <div style={{
                background: '#ffffff', borderRadius: '14px', padding: '22px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                    Registered Users
                  </h3>
                  <button onClick={() => setActiveTab('users')} style={{
                    color: 'var(--gold-hover)', fontSize: '0.78rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '3px'
                  }}>
                    View All <ChevronRight size={13} />
                  </button>
                </div>
                {allUsers.slice(0, 5).map(u => (
                  <div key={u.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 0', borderBottom: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: 'var(--gold-gradient)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ffffff', fontSize: '0.8rem', fontWeight: 700
                    }}>
                      {u.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-main)' }}>{u.name}</p>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.72rem' }}>{u.email}</p>
                    </div>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px',
                      background: u.role === 'Admin' ? 'var(--primary-pale)' : 'var(--bg-alt)',
                      color: u.role === 'Admin' ? 'var(--primary)' : 'var(--text-body)'
                    }}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── BOOKINGS TAB ─── */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="text" placeholder="Search bookings by ID, name, email, room..."
                  value={bookingSearch} onChange={(e) => setBookingSearch(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px',
                    border: '1px solid var(--border)', fontSize: '0.85rem', background: '#ffffff'
                  }}
                />
              </div>
              {['all', 'Confirmed', 'Cancelled'].map(f => (
                <button key={f} onClick={() => setBookingStatusFilter(f)}
                  style={{
                    padding: '9px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                    background: bookingStatusFilter === f ? 'var(--primary)' : '#ffffff',
                    color: bookingStatusFilter === f ? '#ffffff' : 'var(--text-body)',
                    border: bookingStatusFilter === f ? 'none' : '1px solid var(--border)', cursor: 'pointer'
                  }}
                >
                  {f === 'all' ? `All (${allBookings.length})` : `${f} (${allBookings.filter(b => b.status === f).length})`}
                </button>
              ))}
            </div>

            {/* Bookings Table */}
            <div style={{
              background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border)',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--primary-pale)', borderBottom: '1px solid var(--border)' }}>
                      {['Booking ID', 'Guest', 'Room', 'Dates', 'Amount', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--primary-light)' }}>{b.id}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>{b.firstName} {b.lastName}</p>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.72rem' }}>{b.email}</p>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-main)', maxWidth: '180px' }}>{b.roomName}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-body)', whiteSpace: 'nowrap' }}>
                          {b.checkIn} → {b.checkOut}<br />
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.nights} nights</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-main)' }}>${b.totalAmountUSD}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700,
                            background: b.status === 'Confirmed' ? '#ecfdf5' : b.status === 'Cancelled' ? '#fef2f2' : '#fffbeb',
                            color: b.status === 'Confirmed' ? '#059669' : b.status === 'Cancelled' ? '#dc2626' : '#d97706'
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {b.status === 'Confirmed' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}
                                title="Cancel Booking"
                                style={{
                                  padding: '5px 8px', borderRadius: '6px', fontSize: '0.72rem',
                                  background: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer'
                                }}
                              >
                                <XCircle size={13} />
                              </button>
                            )}
                            {b.status === 'Cancelled' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                                title="Reconfirm Booking"
                                style={{
                                  padding: '5px 8px', borderRadius: '6px', fontSize: '0.72rem',
                                  background: '#ecfdf5', color: '#059669', border: 'none', cursor: 'pointer'
                                }}
                              >
                                <CheckCircle size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredBookings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <Briefcase size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No bookings match your search</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── ROOMS TAB ─── */}
        {activeTab === 'rooms' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                Room Inventory ({allRooms.length})
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {allRooms.map(room => (
                <div key={room.id} style={{
                  background: '#ffffff', borderRadius: '14px', overflow: 'hidden',
                  border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={room.images?.[0] || ''} alt={room.name}
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                    {room.featured && (
                      <span style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: 'var(--primary)', color: '#ffffff', padding: '3px 10px',
                        borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700
                      }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{room.name}</p>
                    <p style={{ margin: '3px 0 8px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {room.destinationName}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', background: 'var(--primary-pale)', padding: '3px 8px', borderRadius: '6px', color: 'var(--primary)', fontWeight: 600 }}>
                          {room.category}
                        </span>
                        <span style={{ fontSize: '0.72rem', background: '#fffbeb', padding: '3px 8px', borderRadius: '6px', color: '#d97706', fontWeight: 600 }}>
                          ★ {room.rating}
                        </span>
                        <span style={{ fontSize: '0.72rem', background: 'var(--primary-pale)', padding: '3px 8px', borderRadius: '6px', color: 'var(--primary)', fontWeight: 600 }}>
                          Max {room.maxGuests} guests
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '1rem' }}>${room.pricePerNight}</span>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          style={{
                            padding: '5px 8px', borderRadius: '6px',
                            background: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer'
                          }}
                          title="Delete Room"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── USERS TAB ─── */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="text" placeholder="Search users by name, email, or role..."
                  value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px',
                    border: '1px solid var(--border)', fontSize: '0.85rem', background: '#ffffff'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {filteredUsers.length} user(s)
              </span>
            </div>

            <div style={{
              background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--primary-pale)', borderBottom: '1px solid var(--border)' }}>
                      {['User', 'Email', 'Membership', 'Role', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%',
                              background: 'var(--gold-gradient)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#ffffff', fontSize: '0.75rem', fontWeight: 700
                            }}>
                              {u.name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-body)' }}>{u.email}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: '8px',
                            background: 'var(--primary-pale)', color: 'var(--primary)'
                          }}>
                            {u.membershipTier}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '8px',
                            background: u.role === 'Admin' ? 'var(--primary)' : 'var(--primary-pale)',
                            color: u.role === 'Admin' ? '#ffffff' : 'var(--primary)'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── REVIEWS TAB ─── */}
        {activeTab === 'reviews' && (
          <div>
            <h3 style={{ margin: '0 0 18px', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
              Guest Reviews ({allReviews.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {allReviews.map((review, i) => (
                <div key={review.id || i} style={{
                  background: '#ffffff', borderRadius: '14px', padding: '20px',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <img
                      src={review.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                      alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{review.name}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{review.title} · {review.location}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem' }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{review.date}</span>
                        </div>
                      </div>
                      <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                        {review.comment}
                      </p>
                      <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Stayed at: {review.hotelStayed}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {allReviews.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <Star size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No reviews yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── NEWSLETTER TAB ─── */}
        {activeTab === 'newsletter' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                Newsletter Subscribers ({subscribers.length})
              </h3>
            </div>
            <div style={{
              background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--primary-pale)', borderBottom: '1px solid var(--border)' }}>
                      {['#', 'Email Address', 'Subscribed On'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, i) => (
                      <tr key={sub.id || i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={14} style={{ color: 'var(--primary-light)' }} />
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sub.email}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-body)' }}>
                          {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {subscribers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <Mail size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No subscribers yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
