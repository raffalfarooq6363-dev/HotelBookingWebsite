import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  MapPin, 
  Users, 
  Maximize2, 
  Bed, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function RoomCard({
  room,
  currency,
  nightsCount,
  isFavorite,
  onToggleFavorite,
  onSelectRoom,
  onBookNow
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = room.images && room.images.length > 0 ? room.images : ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Currency converted prices
  const convertedPrice = Math.round(room.pricePerNight * currency.rate);
  const convertedOriginalPrice = room.originalPrice ? Math.round(room.originalPrice * currency.rate) : null;
  const totalPrice = convertedPrice * nightsCount;

  return (
    <div
      className="luxury-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Image Preview Carousel */}
      <div
        style={{
          position: 'relative',
          height: '260px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#1e293b'
        }}
      >
        <img
          src={images[currentImageIndex]}
          alt={room.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          loading="lazy"
        />

        {/* Overlay Badges */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          display: 'flex',
          gap: '8px',
          zIndex: 2
        }}>
          {room.badge && (
            <span style={{
              background: 'var(--gold-gradient)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              {room.badge}
            </span>
          )}
          {room.discountBadge && (
            <span style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600
            }}>
              {room.discountBadge}
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(room);
          }}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={18}
            style={{
              color: isFavorite ? '#ef4444' : '#64748b',
              fill: isFavorite ? '#ef4444' : 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </button>

        {/* Carousel Prev/Next Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.65)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                opacity: 0.85
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.65)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                opacity: 0.85
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dots indicator */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: '5px',
              zIndex: 2
            }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentImageIndex ? '16px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === currentImageIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Destination & Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{
            fontSize: '0.82rem',
            color: 'var(--gold)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <MapPin size={13} /> {room.destinationName}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} style={{ fill: '#eab308', color: '#eab308' }} />
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--primary)' }}>
              {room.rating}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ({room.reviewsCount})
            </span>
          </div>
        </div>

        {/* Room Name */}
        <h3
          onClick={() => onSelectRoom(room)}
          style={{
            fontSize: '1.25rem',
            marginBottom: '8px',
            cursor: 'pointer',
            lineHeight: 1.3
          }}
        >
          {room.name}
        </h3>

        {/* Specs Icons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginBottom: '16px',
          paddingBottom: '14px',
          borderBottom: '1px solid #f1ede6'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={14} /> Up to {room.maxGuests} guests
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bed size={14} /> {room.bedType}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Maximize2 size={14} /> {room.sizeSqM} m²
          </span>
        </div>

        {/* Highlights Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {room.highlights && room.highlights.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.72rem',
                background: '#faf6ee',
                color: '#8c631a',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 600
              }}
            >
              • {item}
            </span>
          ))}
        </div>

        {/* Price & Action Footer */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingTop: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--primary)'
              }}>
                {currency.symbol}{convertedPrice.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/ night</span>

              {convertedOriginalPrice && (
                <span style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-light)',
                  textDecoration: 'line-through'
                }}>
                  {currency.symbol}{convertedOriginalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {currency.symbol}{totalPrice.toLocaleString()} total ({nightsCount} {nightsCount === 1 ? 'night' : 'nights'})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onSelectRoom(room)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary)'
              }}
            >
              Details
            </button>
            <button
              onClick={() => onBookNow(room)}
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target.style.background = 'var(--gold)')}
              onMouseLeave={(e) => (e.target.style.background = 'var(--primary)')}
            >
              Book <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
