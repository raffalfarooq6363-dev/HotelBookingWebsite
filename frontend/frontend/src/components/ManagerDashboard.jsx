import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, Users, Briefcase, DollarSign, Star, Hotel,
  Mail, TrendingUp, ChevronRight, ArrowLeft, Search,
  CheckCircle, XCircle, Clock, Eye, Trash2, Edit3,
  Shield, Calendar, MapPin, AlertCircle, RefreshCw,
  Filter, Download, MoreVertical, Image, Upload, Save, Sparkles, Layout, MessageCircle
} from 'lucide-react';
import { api } from '../services/api';
import ManagerChatPanel from './ManagerChatPanel';

export default function ManagerDashboard({ currentUser, onClose, onSiteContentUpdated }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const [siteContent, setSiteContent] = useState({
    hero: {
      badge: "World's Leading Luxury Hotel Collection",
      title: "Where Elegance Meets Extraordinary Escapes",
      subtitle: "Discover overwater villas, alpine chalets, and Parisian landmark suites — curated for those who expect nothing less than perfection.",
      bgImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2200&q=90"
    },
    destinations_meta: {
      subtitle: "World-Renowned Destinations",
      title: "Escape to Extraordinary Places",
      description: "From secluded private atolls in the Indian Ocean to chic Parisian boulevards, find sanctuary in the world’s most coveted locales."
    },
    offers_meta: {
      subtitle: "Exclusive Privileges",
      title: "Seasonal Offers & Packages",
      description: "Enhance your luxury itinerary with our limited-edition promotional credits, complimentary nights, and VIP privileges."
    },
    experiences_meta: {
      subtitle: "Beyond Accommodation",
      title: "Curated Bespoke Experiences",
      description: "Immerse yourself in world-class culinary journeys, transformative wellness sanctuaries, and private maritime charters."
    },
    experiences: [
      {
        id: 'exp-1',
        title: 'Michelin-Star Gastronomy',
        subtitle: 'Culinary Artistry',
        description: 'Dine in world-renowned establishments helmed by multi-star chefs, featuring farm-to-table organic produce and rare vintage wine pairings.',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        tag: 'Signature Dining'
      },
      {
        id: 'exp-2',
        title: 'Holistic Ayurvedic Wellness & Spa',
        subtitle: 'Rejuvenation Sanctuary',
        description: 'Immerse in ancient thermal water circuits, Himalayan salt caves, Tibetan singing bowl meditations, and custom botanical therapies.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        tag: 'Wellness & Vitality'
      },
      {
        id: 'exp-3',
        title: 'Private Yacht & Helicopter Expeditions',
        subtitle: 'Bespoke Journeys',
        description: 'Sail into secluded turquoise lagoons on our 80-foot Sunseeker yacht or take a scenic alpine helicopter flight over glaciers.',
        image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=800&q=80',
        tag: 'Exclusive Excursions'
      },
      {
        id: 'exp-4',
        title: 'Infinity Sunset Pools & Lounges',
        subtitle: 'Architectural Wonder',
        description: 'Float suspended above turquoise oceans and vibrant city skylines with handcrafted artisanal mixology and ambient sunset sessions.',
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
        tag: 'Rooftop Serenity'
      }
    ]
  });

  // Load all data
  const loadData = async () => {
    setRefreshing(true);
    try {
      const [statsData, bookingsData, usersData, reviewsData, roomsData, subsData, siteContentData, destsData] = await Promise.allSettled([
        api.getAdminStats(),
        api.getAllBookings(),
        api.getAllUsers(),
        api.getAllReviews(),
        api.getRooms(),
        api.getAllSubscribers(),
        api.getSiteContent(),
        api.getDestinations()
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (bookingsData.status === 'fulfilled') setAllBookings(bookingsData.value);
      if (usersData.status === 'fulfilled') setAllUsers(usersData.value);
      if (reviewsData.status === 'fulfilled') setAllReviews(reviewsData.value);
      if (roomsData.status === 'fulfilled') setAllRooms(roomsData.value);
      if (subsData.status === 'fulfilled') setSubscribers(subsData.value);
      if (destsData.status === 'fulfilled') setDestinations(destsData.value);

      if (siteContentData.status === 'fulfilled' && siteContentData.value) {
        const raw = siteContentData.value;
        const parsed = {};
        Object.keys(raw).forEach(k => {
          try {
            parsed[k] = JSON.parse(raw[k]);
          } catch {
            parsed[k] = raw[k];
          }
        });
        setSiteContent(prev => ({ ...prev, ...parsed }));
      }
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

  // Save Front Page & Images changes to Backend API
  const handleSaveFrontPage = async () => {
    setSavingContent(true);
    setSaveSuccessMsg('');
    try {
      await Promise.all([
        api.updateSiteContent('hero', siteContent.hero),
        api.updateSiteContent('destinations_meta', siteContent.destinations_meta),
        api.updateSiteContent('offers_meta', siteContent.offers_meta),
        api.updateSiteContent('experiences_meta', siteContent.experiences_meta),
        api.updateSiteContent('experiences', siteContent.experiences)
      ]);

      if (destinations && destinations.length > 0) {
        await Promise.all(
          destinations.map(d => api.updateDestination(d.id, d))
        );
      }

      if (onSiteContentUpdated) {
        onSiteContentUpdated();
      }

      setSaveSuccessMsg('Front Page & Images updated successfully! Live website reflects your changes.');
      setTimeout(() => setSaveSuccessMsg(''), 4500);
    } catch (e) {
      console.error('Failed to save front page content:', e);
      alert('Error saving changes: ' + (e.message || 'Server error'));
    } finally {
      setSavingContent(false);
    }
  };

  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await api.uploadImage(file);
      if (res && res.url) {
        callback(res.url);
      }
    } catch (err) {
      alert('Image upload failed: ' + (err.message || 'Error uploading file'));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'frontpage', label: 'Front Page & Images', icon: Layout },
    { id: 'bookings', label: 'Bookings', icon: Briefcase },
    { id: 'rooms', label: 'Rooms', icon: Hotel },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'chat', label: 'Customer Chat', icon: MessageCircle }
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


      {/* ─── MAIN BODY: Sidebar + Content ─── */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--nav-height) - 130px)' }}>

        {/* ─── LEFT SIDEBAR ─── */}
        <aside style={{
          width: '230px', flexShrink: 0,
          background: '#ffffff',
          borderRight: '1px solid var(--border)',
          position: 'sticky',
          top: 'var(--nav-height)',
          height: 'calc(100vh - var(--nav-height))',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '12px',
          paddingBottom: '24px',
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)'
        }}>
          {/* Sidebar label */}
          <div style={{ padding: '10px 20px 14px', borderBottom: '1px solid var(--border)' }}>
            <span style={{
              fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--text-muted)'
            }}>
              Navigation
            </span>
          </div>

          {/* Tab buttons */}
          <nav style={{ flex: 1, padding: '10px 10px' }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '11px',
                    padding: '11px 14px', borderRadius: '10px', marginBottom: '4px',
                    fontSize: '0.88rem', fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--primary-light)' : 'var(--text-body)',
                    background: isActive
                      ? 'linear-gradient(135deg, var(--primary-pale) 0%, #ede9fe 100%)'
                      : 'transparent',
                    border: isActive ? '1px solid rgba(124,58,237,0.15)' : '1px solid transparent',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.18s ease',
                    boxShadow: isActive ? '0 2px 6px rgba(124,58,237,0.08)' : 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = '#f5f3ff';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* Icon with coloured pill background when active */}
                  <span style={{
                    width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive
                      ? 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)'
                      : '#f3f4f6',
                    transition: 'background 0.18s ease'
                  }}>
                    <tab.icon size={15} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer — user info */}
          <div style={{
            margin: '0 10px', padding: '12px 14px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary-pale) 0%, #ede9fe 100%)',
            border: '1px solid rgba(124,58,237,0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
              }}>
                {(currentUser?.name || 'M').charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.name || 'Manager'}
                </p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                  {currentUser?.role || 'Admin'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── MAIN CONTENT AREA ─── */}
        <main style={{ flex: 1, padding: '28px 28px', overflowX: 'hidden', minWidth: 0 }}>


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

        {/* ─── FRONT PAGE & IMAGES TAB ─── */}
        {activeTab === 'frontpage' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, color: 'var(--text-main)' }}>
                  Front Page Content & Image Management
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Update hero banner, titles, descriptions, and all images displayed on the public landing page.
                </p>
              </div>

              <button
                onClick={handleSaveFrontPage}
                disabled={savingContent}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700,
                  background: 'var(--gold-gradient)', color: '#ffffff',
                  border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(184,145,58,0.35)'
                }}
              >
                <Save size={16} />
                {savingContent ? 'Saving Changes...' : 'Save Front Page Changes'}
              </button>
            </div>

            {saveSuccessMsg && (
              <div style={{
                background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0',
                padding: '14px 18px', borderRadius: '10px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '0.88rem'
              }}>
                <CheckCircle size={18} />
                {saveSuccessMsg}
              </div>
            )}

            {/* 1. Hero Section Banner Controls */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                <Sparkles size={20} style={{ color: 'var(--gold)' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>
                  Hero Section Banner
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Top Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero?.badge || ''}
                    onChange={(e) => setSiteContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, badge: e.target.value }
                    }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Main Heading Title
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero?.title || ''}
                    onChange={(e) => setSiteContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value }
                    }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    value={siteContent.hero?.subtitle || ''}
                    onChange={(e) => setSiteContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value }
                    }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.88rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Hero Background Picture
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Paste Image URL..."
                      value={siteContent.hero?.bgImage || ''}
                      onChange={(e) => setSiteContent(prev => ({
                        ...prev,
                        hero: { ...prev.hero, bgImage: e.target.value }
                      }))}
                      style={{ flex: 1, minWidth: '260px', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                    />
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '10px 18px', borderRadius: '8px', background: 'var(--primary-pale)',
                      color: 'var(--primary)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', border: '1px solid var(--border)'
                    }}>
                      <Upload size={15} /> Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, (url) => {
                          setSiteContent(prev => ({ ...prev, hero: { ...prev.hero, bgImage: url } }));
                        })}
                      />
                    </label>
                  </div>
                  {siteContent.hero?.bgImage && (
                    <div style={{ marginTop: '12px', borderRadius: '10px', overflow: 'hidden', height: '140px', border: '1px solid var(--border)' }}>
                      <img src={siteContent.hero.bgImage} alt="Hero Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Destinations Showcase & Pictures */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                <MapPin size={20} style={{ color: 'var(--gold)' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>
                  Destinations Showcase & Pictures
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={siteContent.destinations_meta?.subtitle || ''}
                    onChange={(e) => setSiteContent(prev => ({
                      ...prev,
                      destinations_meta: { ...prev.destinations_meta, subtitle: e.target.value }
                    }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={siteContent.destinations_meta?.title || ''}
                    onChange={(e) => setSiteContent(prev => ({
                      ...prev,
                      destinations_meta: { ...prev.destinations_meta, title: e.target.value }
                    }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Section Description
                  </label>
                  <input
                    type="text"
                    value={siteContent.destinations_meta?.description || ''}
                    onChange={(e) => setSiteContent(prev => ({
                      ...prev,
                      destinations_meta: { ...prev.destinations_meta, description: e.target.value }
                    }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '16px 0 12px', color: 'var(--text-main)' }}>
                Manage Destination Pictures & Names:
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {(destinations && destinations.length > 0 ? destinations : [
                  { id: 'bali', name: 'Bali, Indonesia', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
                  { id: 'maldives', name: 'Malé Atoll, Maldives', country: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
                  { id: 'paris', name: 'Paris, France', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
                  { id: 'swiss-alps', name: 'Zermatt, Switzerland', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80' },
                  { id: 'tokyo', name: 'Tokyo, Japan', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
                  { id: 'santorini', name: 'Santorini, Greece', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80' },
                  { id: 'new-york', name: 'Manhattan, New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' }
                ]).map((dest, idx) => (
                  <div key={dest.id || idx} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', background: '#fcfcfc' }}>
                    <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                      <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <input
                      type="text"
                      value={dest.name}
                      placeholder="Destination Name"
                      onChange={(e) => {
                        const newName = e.target.value;
                        setDestinations(prev => prev.map(d => d.id === dest.id ? { ...d, name: newName } : d));
                      }}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}
                    />
                    <input
                      type="text"
                      value={dest.country}
                      placeholder="Country"
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        setDestinations(prev => prev.map(d => d.id === dest.id ? { ...d, country: newCountry } : d));
                      }}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.78rem', marginBottom: '6px' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={dest.image}
                        placeholder="Image URL"
                        onChange={(e) => {
                          const newImg = e.target.value;
                          setDestinations(prev => prev.map(d => d.id === dest.id ? { ...d, image: newImg } : d));
                        }}
                        style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.75rem' }}
                      />
                      <label style={{ padding: '6px 10px', borderRadius: '6px', background: 'var(--primary-pale)', cursor: 'pointer', border: '1px solid var(--border)', fontSize: '0.75rem' }}>
                        <Upload size={12} />
                        <input
                          type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, (url) => {
                            setDestinations(prev => prev.map(d => d.id === dest.id ? { ...d, image: url } : d));
                          })}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Bespoke Experiences & Pictures */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                <Image size={20} style={{ color: 'var(--gold)' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>
                  Bespoke Experiences & Cards
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={siteContent.experiences_meta?.subtitle || ''}
                    onChange={(e) => setSiteContent(prev => ({
                      ...prev,
                      experiences_meta: { ...prev.experiences_meta, subtitle: e.target.value }
                    }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={siteContent.experiences_meta?.title || ''}
                    onChange={(e) => setSiteContent(prev => ({
                      ...prev,
                      experiences_meta: { ...prev.experiences_meta, title: e.target.value }
                    }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {(siteContent.experiences || []).map((exp, idx) => (
                  <div key={exp.id || idx} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: '#fcfcfc' }}>
                    <div style={{ height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                      <img src={exp.image} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <input
                      type="text"
                      value={exp.title}
                      placeholder="Title"
                      onChange={(e) => {
                        const val = e.target.value;
                        setSiteContent(prev => ({
                          ...prev,
                          experiences: prev.experiences.map((item, i) => i === idx ? { ...item, title: val } : item)
                        }));
                      }}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}
                    />
                    <input
                      type="text"
                      value={exp.tag}
                      placeholder="Tag (e.g. Signature Dining)"
                      onChange={(e) => {
                        const val = e.target.value;
                        setSiteContent(prev => ({
                          ...prev,
                          experiences: prev.experiences.map((item, i) => i === idx ? { ...item, tag: val } : item)
                        }));
                      }}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.78rem', marginBottom: '6px' }}
                    />
                    <textarea
                      rows={2}
                      value={exp.description}
                      placeholder="Description"
                      onChange={(e) => {
                        const val = e.target.value;
                        setSiteContent(prev => ({
                          ...prev,
                          experiences: prev.experiences.map((item, i) => i === idx ? { ...item, description: val } : item)
                        }));
                      }}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.78rem', fontFamily: 'inherit', marginBottom: '6px' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={exp.image}
                        placeholder="Picture URL"
                        onChange={(e) => {
                          const val = e.target.value;
                          setSiteContent(prev => ({
                            ...prev,
                            experiences: prev.experiences.map((item, i) => i === idx ? { ...item, image: val } : item)
                          }));
                        }}
                        style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.75rem' }}
                      />
                      <label style={{ padding: '6px 10px', borderRadius: '6px', background: 'var(--primary-pale)', cursor: 'pointer', border: '1px solid var(--border)', fontSize: '0.75rem' }}>
                        <Upload size={12} />
                        <input
                          type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, (url) => {
                            setSiteContent(prev => ({
                              ...prev,
                              experiences: prev.experiences.map((item, i) => i === idx ? { ...item, image: url } : item)
                            }));
                          })}
                        />
                      </label>
                    </div>
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

        {/* ─── CUSTOMER CHAT TAB ─── */}
        {activeTab === 'chat' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, color: 'var(--text-main)' }}>
                Customer Chat
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Real-time chat with your customers. All conversations appear in the left panel.
              </p>
            </div>
            <ManagerChatPanel currentUser={currentUser} />
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
