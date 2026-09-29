import React from 'react';
import { 
  X, 
  Heart, 
  Star, 
  MapPin, 
  Trash2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  currency,
  onRemoveFavorite,
  onBookNow
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="drawer-content-container" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header - Luminous Champagne Ivory */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          borderBottom: '1px solid rgba(197, 155, 63, 0.3)',
          background: 'linear-gradient(135deg, #fdfbf7 0%, #f4ede0 100%)',
          color: '#1c1917'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={22} style={{ color: '#ef4444', fill: '#ef4444' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1c1917', fontFamily: 'var(--font-serif)' }}>Saved Favorites</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#57534e' }}>
                {wishlist.length} {wishlist.length === 1 ? 'saved property' : 'saved properties'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#57534e',
              background: '#ffffff',
              border: '1px solid #e7e0d3',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content List */}
        <div style={{ padding: '24px', flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {wishlist.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)'
            }}>
              <Heart size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px auto', display: 'block' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px' }}>Your Wishlist is Empty</h4>
              <p style={{ fontSize: '0.88rem', margin: '0 0 24px 0' }}>
                Tap the heart icon on any suite or villa to save it to your personal dream vacation list.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Browse Stays <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            wishlist.map((room) => {
              const convertedPrice = Math.round(room.pricePerNight * currency.rate);

              return (
                <div
                  key={room.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    boxShadow: 'var(--shadow-subtle)',
                    position: 'relative'
                  }}
                >
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    style={{ width: '90px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {room.destinationName}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Star size={12} style={{ fill: '#eab308', color: '#eab308' }} />
                          <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{room.rating}</span>
                        </div>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.98rem' }}>{room.name}</h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
                        {currency.symbol}{convertedPrice} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ night</span>
                      </span>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => onRemoveFavorite(room.id)}
                          style={{
                            color: '#94a3b8',
                            padding: '6px',
                            borderRadius: '6px'
                          }}
                          title="Remove from favorites"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onBookNow(room);
                          }}
                          style={{
                            background: 'var(--primary)',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
