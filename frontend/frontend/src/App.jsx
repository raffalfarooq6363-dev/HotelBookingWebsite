import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DestinationsShowcase from './components/DestinationsShowcase';
import RoomCatalog from './components/RoomCatalog';
import RoomDetailModal from './components/RoomDetailModal';
import BookingModal from './components/BookingModal';
import MyBookingsDrawer from './components/MyBookingsDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/AuthModal';
import SpecialOffers from './components/SpecialOffers';
import Experiences from './components/Experiences';
import Testimonials from './components/Testimonials';
import ReviewModal from './components/ReviewModal';
import ConciergeWidget from './components/ConciergeWidget';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CustomerDashboard from './components/CustomerDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ManagerAuthPage from './components/ManagerAuthPage';

import { ROOMS_DATA, CURRENCIES } from './data/hotelsData';
import { api } from './services/api';
import './App.css';

export default function App() {
  // ─── Manager Portal Route Detection ───
  // Supports both /manager path and #manager-portal hash
  const isManagerRoute = () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return (
      path === '/manager' ||
      path.startsWith('/manager/') ||
      hash === '#manager-portal'
    );
  };

  const [isManagerPortal, setIsManagerPortal] = useState(() => isManagerRoute());

  // Listen to URL changes (hash + popstate)
  React.useEffect(() => {
    const onUrlChange = () => setIsManagerPortal(isManagerRoute());
    window.addEventListener('hashchange', onUrlChange);
    window.addEventListener('popstate', onUrlChange);
    return () => {
      window.removeEventListener('hashchange', onUrlChange);
      window.removeEventListener('popstate', onUrlChange);
    };
  }, []);

  // 1. Currency State
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [allRooms, setAllRooms] = useState(ROOMS_DATA);
  const [destinationsList, setDestinationsList] = useState([]);
  const [siteContent, setSiteContent] = useState({});

  const loadSiteContent = async () => {
    try {
      const [contentData, destsData] = await Promise.allSettled([
        api.getSiteContent(),
        api.getDestinations()
      ]);

      if (contentData.status === 'fulfilled' && contentData.value) {
        const raw = contentData.value;
        const parsed = {};
        Object.keys(raw).forEach(k => {
          try {
            parsed[k] = JSON.parse(raw[k]);
          } catch {
            parsed[k] = raw[k];
          }
        });
        setSiteContent(parsed);
      }

      if (destsData.status === 'fulfilled' && destsData.value) {
        setDestinationsList(destsData.value);
      }
    } catch (e) {
      console.warn('Error fetching site content:', e);
    }
  };

  // 2. Default Dates: Today + 7 days & Today + 11 days (4 nights)
  const defaultDates = useMemo(() => {
    const today = new Date();
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + 7);
    const checkOutDate = new Date(today);
    checkOutDate.setDate(today.getDate() + 11);

    return {
      checkIn: checkInDate.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0]
    };
  }, []);

  // 3. Search Bar State
  const [searchFilters, setSearchFilters] = useState({
    destination: 'all',
    checkIn: defaultDates.checkIn,
    checkOut: defaultDates.checkOut,
    adults: 2,
    children: 0,
    rooms: 1
  });

  // 4. Catalog Filters State
  const [catalogFilters, setCatalogFilters] = useState({
    category: 'All',
    maxPrice: 1200,
    minRating: 0,
    amenities: [],
    sortBy: 'featured'
  });

  // 5. Wishlist (Persisted in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('luxehaven_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Bookings (Persisted in localStorage with 1 initial sample booking)
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('luxehaven_bookings');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Initial sample booking for realistic presentation
    return [
      {
        id: 'LXH-829140',
        room: {
          id: 'room-1',
          name: 'Presidential Oceanfront Villa',
          destinationName: 'Malé Atoll, Maldives',
          images: [ROOMS_DATA[0].images[0]],
          pricePerNight: 890
        },
        checkIn: defaultDates.checkIn,
        checkOut: defaultDates.checkOut,
        nights: 4,
        guests: '2 Adults',
        selectedAddons: ['VIP Private Chauffeur / Speedboat Transfer', 'Couples Holistic Spa & Aromatherapy (90 Min)'],
        guestDetails: { firstName: 'Alexander', lastName: 'Vance', email: 'alexander.vance@luxury.com' },
        paymentMethod: 'card',
        totalAmountUSD: 3980,
        currency: 'USD',
        currencySymbol: '$',
        convertedTotal: 3980,
        createdAt: new Date().toISOString(),
        status: 'Confirmed'
      }
    ];
  });

  // 7. User Authentication State (Persisted)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('luxehaven_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 8. Modals & Drawers State
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState(null);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [dashboardView, setDashboardView] = useState(null);

  // 9. Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load live data from Backend API
  useEffect(() => {
    loadSiteContent();

    api.getRooms()
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setAllRooms(data);
        }
      })
      .catch(e => console.warn('Backend rooms unavailable, using initial data:', e));

    api.getBookings()
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          const normalized = data.map(b => ({
            ...b,
            room: b.room || {
              id: b.roomId,
              name: b.roomName,
              destinationName: b.destinationName,
              images: b.roomImage ? [b.roomImage] : [],
              pricePerNight: b.pricePerNight
            },
            guestDetails: b.guestDetails || {
              firstName: b.firstName,
              lastName: b.lastName,
              email: b.email,
              phone: b.phone
            }
          }));
          setBookings(normalized);
        }
      })
      .catch(e => console.warn('Backend bookings unavailable, using initial bookings:', e));
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('luxehaven_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('luxehaven_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('luxehaven_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('luxehaven_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Calculate nights count from search
  const nightsCount = useMemo(() => {
    try {
      const d1 = new Date(searchFilters.checkIn);
      const d2 = new Date(searchFilters.checkOut);
      const diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [searchFilters.checkIn, searchFilters.checkOut]);

  // Filter & Sort Rooms
  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      // Destination filter
      if (searchFilters.destination !== 'all' && room.destinationId !== searchFilters.destination) {
        return false;
      }
      // Guest capacity filter
      const totalGuests = searchFilters.adults + searchFilters.children;
      if (room.maxGuests < totalGuests) {
        return false;
      }
      // Category filter
      if (catalogFilters.category !== 'All' && room.category !== catalogFilters.category) {
        return false;
      }
      // Max price filter (in USD)
      if (room.pricePerNight > catalogFilters.maxPrice) {
        return false;
      }
      // Min rating filter
      if (room.rating < catalogFilters.minRating) {
        return false;
      }
      // Amenities filter
      if (catalogFilters.amenities.length > 0) {
        const hasAllAmenities = catalogFilters.amenities.every(a => room.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }
      return true;
    }).sort((a, b) => {
      if (catalogFilters.sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (catalogFilters.sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (catalogFilters.sortBy === 'rating') return b.rating - a.rating;
      if (catalogFilters.sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      // Default: featured first, then rating
      if (a.featured === b.featured) return b.rating - a.rating;
      return a.featured ? -1 : 1;
    });
  }, [searchFilters, catalogFilters]);

  // Handlers
  const handleToggleFavorite = (room) => {
    const exists = wishlist.some(item => item.id === room.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== room.id));
      addToast('Removed from Wishlist', `${room.name} was removed from your favorites.`, 'info');
    } else {
      setWishlist(prev => [...prev, room]);
      addToast('Saved to Wishlist', `${room.name} has been saved to your dream stays!`, 'success');
    }
  };

  const handlePerformSearch = () => {
    const element = document.getElementById('catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    addToast('Search Updated', `Found ${filteredRooms.length} luxury stays for your dates.`, 'info');
  };

  const handleSelectDestination = (destId) => {
    setSearchFilters(prev => ({ ...prev, destination: destId }));
    const element = document.getElementById('catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setCatalogFilters({
      category: 'All',
      maxPrice: 1200,
      minRating: 0,
      amenities: [],
      sortBy: 'featured'
    });
    setSearchFilters(prev => ({ ...prev, destination: 'all' }));
    addToast('Filters Reset', 'Displaying all available rooms and suites.', 'info');
  };

  const handleCompleteBooking = (newBooking) => {
    setBookings(prev => [newBooking, ...prev]);
    addToast('Reservation Confirmed!', `Booking ${newBooking.id} is confirmed. A digital voucher is ready.`, 'success');
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.cancelBooking(bookingId);
    } catch (e) {
      console.warn('Backend cancellation error:', e);
    }
    setBookings(prev => prev.map(booking => (
      booking.id === bookingId ? { ...booking, status: 'Cancelled' } : booking
    )));
    addToast('Reservation Cancelled', `Booking reference ${bookingId} has been cancelled with full refund.`, 'info');
  };

  const handleCopyCode = (code) => {
    addToast('Coupon Copied', `Code ${code} copied to clipboard! Paste it during checkout.`, 'success');
  };

  const handleSubscribeNewsletter = async (email) => {
    try {
      await api.subscribeNewsletter(email);
    } catch (e) {
      console.warn('Backend newsletter error:', e);
    }
    addToast('Welcome to LuxeClub', `Confirmation transmitted to ${email}. Check your inbox for your 10% welcome privilege!`, 'success');
  };

  const handleOpenDashboard = () => {
    const isManager = ['admin', 'manager'].includes(currentUser?.role?.toLowerCase());
    setDashboardView(isManager ? 'manager' : 'customer');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setDashboardView(null);
    addToast('Signed Out', 'You have been signed out of your LuxeClub account.', 'info');
  };

  return (
    <div className="app-root">
      {/* ── Manager Portal ── completely separate from customer site */}
      {isManagerPortal && !['admin', 'manager'].includes(currentUser?.role?.toLowerCase()) && (
        <ManagerAuthPage
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            addToast('Welcome, Manager', `Signed in as ${user.name}. Redirecting to dashboard.`, 'success');
          }}
          onBackToSite={() => {
            window.location.hash = '';
            window.history.pushState({}, '', '/');
            setIsManagerPortal(false);
          }}
        />
      )}

      {/* If manager is logged in via manager portal, show Manager Dashboard directly */}
      {isManagerPortal && ['admin', 'manager'].includes(currentUser?.role?.toLowerCase()) && (
        <ManagerDashboard
          currentUser={currentUser}
          onSiteContentUpdated={loadSiteContent}
          onClose={() => {
            handleLogout();
            window.location.hash = '';
            window.history.pushState({}, '', '/');
            setIsManagerPortal(false);
          }}
        />
      )}

      {/* ── Customer Site ── hidden when manager portal is active */}
      {!isManagerPortal && (
        <>
      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Navigation Header */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        wishlistCount={wishlist.length}
        bookingsCount={bookings.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenBookings={() => setIsBookingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {dashboardView ? (
        dashboardView === 'manager' ? (
          <ManagerDashboard currentUser={currentUser} onSiteContentUpdated={loadSiteContent} onClose={() => setDashboardView(null)} />
        ) : (
          <CustomerDashboard
            currentUser={currentUser}
            bookings={bookings}
            wishlist={wishlist}
            currency={currency}
            onCancelBooking={handleCancelBooking}
            onBookNow={(room) => {
              setDashboardView(null);
              setBookingRoom(room);
            }}
            onRemoveWishlistItem={(roomId) => {
              setWishlist(prev => prev.filter(room => room.id !== roomId));
              addToast('Removed from Wishlist', 'Property removed from saved stays.', 'info');
            }}
            onLogout={handleLogout}
            onClose={() => setDashboardView(null)}
          />
        )
      ) : null}

      {!dashboardView && <>
      {/* Hero with Integrated Search Console */}
      <HeroSection
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
        onPerformSearch={handlePerformSearch}
        heroData={siteContent.hero}
      />

      {/* Destinations Showcase */}
      <DestinationsShowcase
        onSelectDestination={handleSelectDestination}
        metaData={siteContent.destinations_meta}
        destinationsList={destinationsList}
      />

      {/* Curated Rooms & Suites Catalog */}
      <RoomCatalog
        rooms={filteredRooms}
        currency={currency}
        nightsCount={nightsCount}
        wishlist={wishlist}
        onToggleFavorite={handleToggleFavorite}
        onSelectRoom={(room) => setSelectedRoomForDetail(room)}
        onBookNow={(room) => setBookingRoom(room)}
        filters={catalogFilters}
        setFilters={setCatalogFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Special Offers & Codes */}
      <SpecialOffers
        onCopyCode={handleCopyCode}
      />

      {/* Bespoke Experiences */}
      <Experiences
        onExplore={() => {
          const element = document.getElementById('catalog');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Guest Reviews & Statistics */}
      <Testimonials onOpenReviewModal={() => setIsReviewOpen(true)} />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Footer */}
      <Footer
        onSubscribeNewsletter={handleSubscribeNewsletter}
      />

      {/* Room Detail Modal */}
      {selectedRoomForDetail && (
        <RoomDetailModal
          room={selectedRoomForDetail}
          currency={currency}
          nightsCount={nightsCount}
          onClose={() => setSelectedRoomForDetail(null)}
          onBookNow={(room) => {
            setSelectedRoomForDetail(null);
            setBookingRoom(room);
          }}
        />
      )}

      {/* Multi-Step Booking Modal */}
      {bookingRoom && (
        <BookingModal
          room={bookingRoom}
          currency={currency}
          searchDates={searchFilters}
          onClose={() => setBookingRoom(null)}
          onCompleteBooking={handleCompleteBooking}
        />
      )}

      {/* My Bookings Drawer */}
      <MyBookingsDrawer
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onViewVoucher={(_booking) => {
          // Open voucher by triggering print or showing summary
          window.print();
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        currency={currency}
        onRemoveFavorite={(roomId) => {
          setWishlist(prev => prev.filter(r => r.id !== roomId));
          addToast('Removed from Wishlist', 'Property removed from saved stays.', 'info');
        }}
        onBookNow={(room) => {
          setIsWishlistOpen(false);
          setBookingRoom(room);
        }}
      />

      {/* Sign In / Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          addToast('Welcome back', `Logged in as ${user.name} (${user.membershipTier}).`, 'success');
        }}
      />

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmitReview={(newReview) => {
          addToast('Review Submitted', 'Thank you! Your verified story has been recorded.', 'success');
        }}
      />

      {/* Floating VIP Concierge Assistant */}
      <ConciergeWidget
        onOpenAuth={() => setIsAuthOpen(true)}
        onExploreCatalog={() => {
          const element = document.getElementById('catalog');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }}
        onCopyCode={handleCopyCode}
      />
      </>}
      </>
      )}
    </div>
  );
}
