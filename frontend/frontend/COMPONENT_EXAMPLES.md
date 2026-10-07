# Component Examples

Real-world examples of components built with the design system.

## 🏨 Room Card Component

```jsx
// src/components/RoomCard.jsx
import { Heart, MapPin, Star, Zap } from 'lucide-react';

export default function RoomCard({ 
  room, 
  nightsCount, 
  currency,
  isFavorite, 
  onToggleFavorite, 
  onBookNow,
  onViewDetails 
}) {
  const totalPrice = room.pricePerNight * nightsCount;

  return (
    <div className="card luxury-card">
      {/* Image Section */}
      <div className="relative overflow-hidden bg-tertiary" style={{ height: '280px' }}>
        <img
          src={room.images?.[0] || 'https://via.placeholder.com/400x300'}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {room.featured && <span className="badge badge-accent">Featured</span>}
          {room.category && <span className="badge badge-primary">{room.category}</span>}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(room)}
          className="absolute top-3 right-3 btn btn-icon bg-white hover:bg-accent-100"
          aria-label="Add to favorites"
        >
          <Heart
            size={20}
            fill={isFavorite ? 'currentColor' : 'none'}
            color={isFavorite ? '#ec4899' : '#666'}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="card-body">
        {/* Title */}
        <h3 className="text-xl font-semibold text-primary mb-1">
          {room.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-secondary mb-3">
          <MapPin size={16} />
          <span className="text-sm">{room.destinationName}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-secondary leading-relaxed mb-4">
          {room.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.floor(room.rating) ? '#f59e0b' : '#e7e5e4'}
              color={i < Math.floor(room.rating) ? '#f59e0b' : '#e7e5e4'}
            />
          ))}
          <span className="text-xs text-tertiary ml-2">
            ({room.reviewsCount} reviews)
          </span>
        </div>

        {/* Amenities */}
        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="badge badge-sm badge-neutral">
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Price Section */}
        <div className="border-t border-light pt-4 mb-4">
          <div className="flex justify-between items-baseline gap-2 mb-2">
            <span className="text-sm text-tertiary">Price per night</span>
            <span className="text-2xl font-bold text-primary">
              {currency}{room.pricePerNight}
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-2">
            <span className="text-sm text-tertiary">Total ({nightsCount} nights)</span>
            <span className="text-lg font-bold text-accent">
              {currency}{totalPrice}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onViewDetails(room)}
            className="btn btn-outline"
          >
            View Details
          </button>
          <button
            onClick={() => onBookNow(room)}
            className="btn btn-primary"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 🔍 Search Filter Component

```jsx
// src/components/SearchFilter.jsx
import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchFilter({ onApply, onReset }) {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    amenities: []
  });

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={onReset} className="btn btn-ghost btn-sm">
          <X size={18} /> Reset
        </button>
      </div>

      <div className="card-body space-y-6">
        {/* Price Range */}
        <div className="form-group">
          <label className="form-label">Price Range</label>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">${filters.priceRange[0]}</span>
            <input
              type="range"
              min="0"
              max="2000"
              value={filters.priceRange[0]}
              onChange={(e) => setFilters({
                ...filters,
                priceRange: [parseInt(e.target.value), filters.priceRange[1]]
              })}
              className="form-control flex-1"
            />
            <span className="text-sm font-medium">${filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="form-group">
          <label className="form-label">Minimum Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setFilters({ ...filters, rating: star })}
                className={`btn btn-sm ${
                  filters.rating >= star
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                ⭐ {star}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="form-group">
          <label className="form-label">Amenities</label>
          <div className="space-y-2">
            {['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'].map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-control"
                  checked={filters.amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        amenities: [...filters.amenities, amenity]
                      });
                    } else {
                      setFilters({
                        ...filters,
                        amenities: filters.amenities.filter(a => a !== amenity)
                      });
                    }
                  }}
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => onApply(filters)}
          className="btn btn-primary w-full"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
```

## 📝 Booking Form Component

```jsx
// src/components/BookingForm.jsx
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function BookingForm({ room, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Room Summary */}
      <div className="bg-accent-light border border-accent-200 rounded-lg p-4">
        <h4 className="font-semibold text-primary mb-2">Booking Summary</h4>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-secondary">{room.name}</p>
            <p className="text-xs text-tertiary">{room.destinationName}</p>
          </div>
          <span className="font-bold text-lg text-primary">${room.totalPrice}</span>
        </div>
      </div>

      {/* Guest Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-primary">Guest Information</h4>
        
        {/* First Name */}
        <div className="form-group">
          <label className="form-label required" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form-control ${errors.firstName ? 'border-error' : ''}`}
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="form-error">
              <AlertCircle size={14} /> {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label className="form-label required" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`form-control ${errors.lastName ? 'border-error' : ''}`}
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="form-error">
              <AlertCircle size={14} /> {errors.lastName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label required" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'border-error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="form-error">
              <AlertCircle size={14} /> {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label required" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={`form-control ${errors.phone ? 'border-error' : ''}`}
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && (
            <p className="form-error">
              <AlertCircle size={14} /> {errors.phone}
            </p>
          )}
        </div>

        {/* Special Requests */}
        <div className="form-group">
          <label className="form-label" htmlFor="specialRequests">
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            className="form-control"
            rows="4"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Any special requests? (Early check-in, high floor, etc.)"
          />
          <p className="form-hint">We'll do our best to accommodate your requests</p>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-start gap-3 bg-info-light border border-info rounded-lg p-4">
        <CheckCircle size={20} className="text-info flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-info">
            By proceeding, you agree to our Terms & Conditions and Privacy Policy
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-light">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-primary flex-1 ${isSubmitting ? 'btn-loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
}
```

## 🎨 Hero Section Component

```jsx
// src/components/HeroSection.jsx
import { ArrowRight, Sparkles } from 'lucide-react';
import SearchConsole from './SearchConsole';

export default function HeroSection({ heroData }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroData?.bgImage || 'https://via.placeholder.com/1920x1080'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-1" />

      {/* Content */}
      <div className="container relative z-10 text-center py-32 px-4">
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-8 inline-flex bg-white/10 backdrop-blur px-4 py-2 rounded-full mx-auto">
          <Sparkles size={16} className="text-accent" />
          <span className="text-sm font-semibold text-white">
            {heroData?.badge || "World's Finest Luxury Hotels"}
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
          {heroData?.title || 'Where Elegance Meets Extraordinary Escapes'}
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow">
          {heroData?.subtitle || 'Discover overwater villas, alpine chalets, and Parisian landmark suites — curated for those who expect nothing less than perfection.'}
        </p>

        {/* CTA Button */}
        <div className="flex gap-4 justify-center mb-16">
          <button className="btn btn-primary btn-lg flex items-center gap-2">
            Explore Collection
            <ArrowRight size={20} />
          </button>
          <button className="btn btn-outline btn-lg text-white border-white hover:bg-white/10">
            Learn More
          </button>
        </div>

        {/* Search Console */}
        <div className="max-w-5xl mx-auto">
          <SearchConsole />
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-16 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-accent text-xl">✓</span>
            <span>Best Rate Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent text-xl">✓</span>
            <span>Free 48h Cancellation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent text-xl">✓</span>
            <span>24/7 Personal Concierge</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-wide">Scroll to explore</span>
          <div className="animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## 📱 Responsive Navigation Component

```jsx
// src/components/Navigation.jsx
import { Menu, X, Heart, Briefcase } from 'lucide-react';
import { useState } from 'react';

export default function Navigation({ user, onAuthClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-light shadow-sm">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary">
          🏨 LuxeHaven
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#rooms" className="text-secondary hover:text-primary transition">
            Rooms
          </a>
          <a href="#experiences" className="text-secondary hover:text-primary transition">
            Experiences
          </a>
          <a href="#offers" className="text-secondary hover:text-primary transition">
            Offers
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <button className="btn btn-icon hidden sm:flex">
            <Heart size={20} />
          </button>

          {/* Bookings */}
          <button className="btn btn-icon hidden sm:flex">
            <Briefcase size={20} />
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline">
                {user.name}
              </span>
              <button className="btn btn-secondary btn-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="btn btn-primary btn-sm hidden sm:inline-flex"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-icon md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-light bg-secondary">
          <div className="container py-4 space-y-2">
            <a href="#rooms" className="block py-2 text-secondary hover:text-primary">
              Rooms
            </a>
            <a href="#experiences" className="block py-2 text-secondary hover:text-primary">
              Experiences
            </a>
            <a href="#offers" className="block py-2 text-secondary hover:text-primary">
              Offers
            </a>
            <hr className="my-4 border-light" />
            <button
              onClick={onAuthClick}
              className="btn btn-primary w-full"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
```

---

These examples show how to build beautiful, consistent components using the design system. Mix and match utilities and pre-built components to create any UI you need!
