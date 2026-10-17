import React from 'react';
import { X, Printer, CheckCircle, Calendar, MapPin, User, Mail, Phone, Banknote, Shield } from 'lucide-react';

export default function VoucherModal({ booking, onClose }) {
  if (!booking) return null;

  const room = booking.room || {
    name: booking.roomName,
    destinationName: booking.destinationName,
    images: booking.roomImage ? [booking.roomImage] : []
  };

  const guest = booking.guestDetails || {
    firstName: booking.firstName,
    lastName: booking.lastName,
    email: booking.email,
    phone: booking.phone
  };

  const totalAmount = booking.convertedTotal || booking.totalAmountUSD || 0;
  const currencySymbol = booking.currencySymbol || '$';
  const currency = booking.currency || 'USD';

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 15, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), 0 0 1px rgba(212, 175, 55, 0.5)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Top Metallic Gold Accent */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #d4af37, #f7df94, #b89037)' }} />

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          background: '#fafafa',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #d4af37, #b89037)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0b0e14',
              fontWeight: 800,
              fontSize: '14px',
            }}>
              🏨
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: '#0f172a' }}>
                Official Reservation Voucher
              </h3>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>
                LuxeHaven Hotels &amp; Resorts Portfolio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              padding: '6px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Voucher Card */}
        <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }} id="printable-voucher-content">
          <div style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '16px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            padding: '24px',
            position: 'relative',
          }}>
            {/* Header with Reference & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b89037', fontWeight: 700 }}>
                  Confirmed Stay
                </span>
                <h4 style={{ margin: '3px 0 0', fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#0f172a' }}>
                  {room.name}
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} style={{ color: '#b89037' }} />
                  {room.destinationName}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Booking Reference
                </span>
                <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em' }}>
                  {booking.id}
                </div>
                <span style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: '#ecfdf5',
                  color: '#065f46',
                }}>
                  {booking.status || 'Confirmed'}
                </span>
              </div>
            </div>

            {/* Dates & Guests */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px', background: '#f1f5f9', padding: '14px 16px', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Check-In</span>
                <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  {booking.checkIn} <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>(from 3:00 PM)</span>
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Check-Out</span>
                <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  {booking.checkOut} <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>(by 11:00 AM)</span>
                </p>
              </div>
            </div>

            {/* Guest Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#475569', marginBottom: '18px' }}>
              <div>
                <strong>Primary Guest:</strong> {guest.firstName} {guest.lastName}
              </div>
              <div>
                <strong>Contact Email:</strong> {guest.email}
              </div>
              {guest.phone && (
                <div>
                  <strong>Phone:</strong> {guest.phone}
                </div>
              )}
              {booking.specialRequests && (
                <div>
                  <strong>Special Requests:</strong> {booking.specialRequests}
                </div>
              )}
            </div>

            {/* Payment & Cash Settlement Notice */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fef08a',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}>
              <Banknote size={24} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Cash Settlement on Arrival
                  </span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    {currencySymbol}{totalAmount.toLocaleString()} {currency}
                  </span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#78350f', lineHeight: 1.45 }}>
                  Please present this voucher and a government-issued photo ID at the front desk upon arrival. Settle the balance of <strong>{currencySymbol}{totalAmount.toLocaleString()}</strong> in cash to receive your suite access cards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '16px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Printer size={16} />
            <span>Print Voucher</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #d4af37, #b89037)',
              color: '#0b0e14',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
