import React from 'react';
import { 
  X, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Printer, 
  Trash2, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export default function MyBookingsDrawer({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onViewVoucher
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
          borderBottom: '1px solid rgba(89, 135, 125, 0.3)',
          background: 'linear-gradient(135deg, #f0f7f4 0%, #e0eeea 100%)',
          color: '#1a2e28'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={22} style={{ color: 'var(--gold)' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1a2e28', fontFamily: 'var(--font-serif)' }}>My Reservations</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#5a7a70' }}>
                {bookings.length} {bookings.length === 1 ? 'active booking' : 'active bookings'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#5a7a70',
              background: '#ffffff',
              border: '1px solid #d4e4dd',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Bookings List */}
        <div style={{ padding: '24px', flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {bookings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)'
            }}>
              <Briefcase size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px auto', display: 'block' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px' }}>No Active Bookings</h4>
              <p style={{ fontSize: '0.88rem', margin: '0 0 24px 0' }}>
                You have not reserved any suites or villas yet. Explore our portfolio to book your next getaway.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Explore Stays <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  background: '#f6f9f8',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                {/* Header with Reference & Status */}
                <div style={{
                  padding: '12px 16px',
                  background: '#edf5f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #d4e4dd'
                }}>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                    Ref: {booking.id}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: '#ecfdf5',
                    color: '#065f46',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {booking.status || 'Confirmed'}
                  </span>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                    {booking.room.images && booking.room.images[0] && (
                      <img
                        src={booking.room.images[0]}
                        alt={booking.room.name}
                        style={{ width: '80px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{booking.room.name}</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600 }}>
                        <MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} />
                        {booking.room.destinationName}
                      </p>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      <span>{booking.checkIn} → {booking.checkOut} ({booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'})</span>
                    </div>
                    <div>
                      <strong>Guest:</strong> {booking.guestDetails?.firstName} {booking.guestDetails?.lastName}
                    </div>
                    <div>
                      <strong>Total:</strong> <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{booking.currencySymbol || '$'}{booking.convertedTotal?.toLocaleString() || booking.totalAmountUSD?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #d4e4dd'
                  }}>
                    <button
                      onClick={() => onViewVoucher(booking)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      <Printer size={14} /> View Voucher
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to cancel reservation ${booking.id}?`)) {
                          onCancelBooking(booking.id);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#ef4444',
                        padding: '6px 10px',
                        borderRadius: '6px'
                      }}
                    >
                      <Trash2 size={14} /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
