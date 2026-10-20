import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Printer, 
  Clock, 
  Tag,
  Banknote,
  ShieldCheck,
  Wallet,
  Receipt
} from 'lucide-react';
import { LUXURY_ADDONS } from '../data/hotelsData';
import { api } from '../services/api';

export default function BookingModal({
  room,
  currency,
  searchDates,
  onClose,
  onCompleteBooking
}) {
  const [step, setStep] = useState(1); // 1: Overview, 2: Addons, 3: Guest Info, 4: Cash Payment, 5: Voucher
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  // Guest details form state
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  // Payment form state — strictly Cash on Arrival only (no online cards/gateways)
  const [paymentMethod, setPaymentMethod] = useState('Cash on Arrival');
  const [cashPreference, setCashPreference] = useState('exact');
  const [cashRemarks, setCashRemarks] = useState('');

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!room) return null;

  // Nights calculation
  const d1 = new Date(searchDates.checkIn);
  const d2 = new Date(searchDates.checkOut);
  const diffDays = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));

  // Pricing math
  const baseRoomRate = room.pricePerNight * diffDays;
  const addonsTotalUSD = selectedAddons.reduce((acc, addonId) => {
    const item = LUXURY_ADDONS.find(a => a.id === addonId);
    return acc + (item ? item.price : 0);
  }, 0);

  const subtotalUSD = baseRoomRate + addonsTotalUSD;
  const discountAmountUSD = (subtotalUSD * discountPercent) / 100;
  const discountedSubtotalUSD = subtotalUSD - discountAmountUSD;
  const taxesUSD = Math.round(discountedSubtotalUSD * 0.12); // 12% luxury & municipal tax
  const totalAmountUSD = discountedSubtotalUSD + taxesUSD;

  // Converted values
  const convertedTotal = Math.round(totalAmountUSD * currency.rate);

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    try {
      const res = await api.validatePromo(cleanCode);
      if (res.isValid) {
        setDiscountPercent(res.discountPercentage);
        setPromoMessage(res.message);
      } else {
        setDiscountPercent(0);
        setPromoMessage(res.message || 'Invalid or expired promotional code.');
      }
    } catch {
      // Local fallback
      if (cleanCode === 'HONEYMOON25') {
        setDiscountPercent(25);
        setPromoMessage('25% Luxury Discount applied successfully!');
      } else if (cleanCode === 'EARLYBIRD') {
        setDiscountPercent(20);
        setPromoMessage('20% Early Bird Privilege applied!');
      } else if (cleanCode === 'LUXE10') {
        setDiscountPercent(10);
        setPromoMessage('10% Member Welcome discount applied!');
      } else {
        setDiscountPercent(0);
        setPromoMessage('Invalid or expired promotional code.');
      }
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!guestDetails.firstName || !guestDetails.email) {
      alert('Please fill in your name and email to proceed.');
      return;
    }

    const payload = {
      roomId: room.id,
      checkIn: searchDates.checkIn,
      checkOut: searchDates.checkOut,
      adults: searchDates.adults,
      children: searchDates.children,
      selectedAddons: selectedAddons,
      promoCode: promoCode,
      firstName: guestDetails.firstName,
      lastName: guestDetails.lastName,
      email: guestDetails.email,
      phone: guestDetails.phone,
      specialRequests: [
        guestDetails.specialRequests,
        `[Payment: Cash on Arrival]`,
        cashRemarks ? `[Cash Note: ${cashRemarks}]` : null,
        cashPreference ? `[Cash Preference: ${cashPreference === 'exact' ? 'Exact Cash' : cashPreference === 'need_change' ? 'Requires Change' : 'Local/Foreign Currency'}]` : null
      ].filter(Boolean).join(' '),
      paymentMethod: 'Cash on Arrival',
      currency: currency.code,
      currencySymbol: currency.symbol,
      currencyRate: currency.rate
    };

    let confirmed;
    try {
      const serverBooking = await api.createBooking(payload);
      confirmed = {
        ...serverBooking,
        room: {
          id: room.id,
          name: room.name,
          destinationName: room.destinationName,
          images: room.images,
          pricePerNight: room.pricePerNight
        }
      };
    } catch (err) {
      console.warn('Booking API error, using local fallback:', err);
      confirmed = {
        id: `LXH-${Math.floor(100000 + Math.random() * 900000)}`,
        room: {
          id: room.id,
          name: room.name,
          destinationName: room.destinationName,
          images: room.images,
          pricePerNight: room.pricePerNight
        },
        checkIn: searchDates.checkIn,
        checkOut: searchDates.checkOut,
        nights: diffDays,
        guests: `${searchDates.adults} Adults, ${searchDates.children} Children`,
        selectedAddons: selectedAddons.map(id => LUXURY_ADDONS.find(a => a.id === id)?.name).filter(Boolean),
        guestDetails: { ...guestDetails },
        paymentMethod: 'Cash on Arrival',
        totalAmountUSD,
        currency: currency.code,
        currencySymbol: currency.symbol,
        convertedTotal,
        createdAt: new Date().toISOString(),
        status: 'Confirmed'
      };
    }

    setConfirmedBooking(confirmed);
    onCompleteBooking(confirmed);
    setStep(5);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '860px', overflow: 'hidden' }}
      >
        {/* Top Modal Header - Luminous Champagne Ivory */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '22px 28px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          background: 'linear-gradient(135deg, #090d18 0%, #111827 50%, #0d121f 100%)',
          color: '#ffffff'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: 700 }}>
              {step === 5 ? 'Reservation Confirmed' : 'LuxeHaven Reservation'}
            </span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.35rem', color: '#ffffff', fontFamily: 'var(--font-serif)' }}>
              {step === 5 ? 'Booking Voucher & Details' : room.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar (Hidden on Confirmation) */}
        {step < 5 && (
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '12px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            justifyContent: 'space-between'
          }}>
            {[
              { num: 1, label: 'Room & Dates' },
              { num: 2, label: 'Luxury Add-ons' },
              { num: 3, label: 'Guest Details' },
              { num: 4, label: 'Cash Payment' }
            ].map(s => (
              <div 
                key={s.num} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: step === s.num ? 'var(--gold)' : step > s.num ? 'var(--primary)' : 'var(--text-light)',
                  fontWeight: step === s.num ? 700 : 500,
                  fontSize: '0.85rem'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: step === s.num ? 'var(--gold)' : step > s.num ? 'var(--primary)' : '#e2e8f0',
                  color: step === s.num || step > s.num ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span className="hide-sm">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Step Content Container */}
        <div style={{ padding: '28px', maxHeight: 'calc(80vh - 140px)', overflowY: 'auto' }}>
          
          {/* STEP 1: Overview & Dates Confirmation */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <img
                  src={room.images[0]}
                  alt={room.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {room.destinationName}
                  </span>
                  <h4 style={{ fontSize: '1.2rem', margin: '4px 0 8px 0' }}>{room.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    {room.description}
                  </p>
                </div>
              </div>

              {/* Stay Summary Matrix */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check-In</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '0.95rem' }}>{searchDates.checkIn}</p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>From 3:00 PM</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check-Out</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '0.95rem' }}>{searchDates.checkOut}</p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Until 11:00 AM</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '0.95rem' }}>{diffDays} {diffDays === 1 ? 'Night' : 'Nights'}</p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{searchDates.adults + searchDates.children} Guests</span>
                </div>
              </div>

              {/* Inclusions */}
              <div>
                <h5 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>Complimentary Inclusions</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                  {room.amenities.map(a => (
                    <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Check size={14} style={{ color: 'var(--gold)' }} />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary"
                >
                  Continue to Add-ons <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Luxury Add-ons */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Elevate Your Stay with Curated Experiences</h4>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>
                  Select tailored enhancements to be arranged by your dedicated butler prior to arrival.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {LUXURY_ADDONS.map(addon => {
                  const isSelected = selectedAddons.includes(addon.id);
                  const convertedAddonPrice = Math.round(addon.price * currency.rate);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--gold)' : '#e2e8f0',
                        background: isSelected ? 'var(--gold-light)' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          border: isSelected ? '1px solid var(--gold)' : '1px solid #cbd5e1',
                          background: isSelected ? 'var(--gold)' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          marginTop: '2px'
                        }}>
                          {isSelected && <Check size={14} />}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                            {addon.name}
                          </p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {addon.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>
                          +{currency.symbol}{convertedAddonPrice}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-primary"
                >
                  Continue to Guest Info <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Guest Information */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Primary Guest Contact & Preferences</h4>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>
                  We will transmit your confirmation and digital key invitation to this address.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor"
                    value={guestDetails.firstName}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vance"
                    value={guestDetails.lastName}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@luxurytravel.com"
                    value={guestDetails.email}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={guestDetails.phone}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Special Requests / Occasion</label>
                <textarea
                  rows="3"
                  placeholder="Tell us if you are celebrating an anniversary, require dietary arrangements, or prefer a specific pillow type..."
                  value={guestDetails.specialRequests}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-outline"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!guestDetails.firstName || !guestDetails.email) {
                      alert('Please provide your name and email address.');
                      return;
                    }
                    setStep(4);
                  }}
                  className="btn-primary"
                >
                  Proceed to Cash Payment <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Cash Payment Wall */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Banknote size={20} style={{ color: 'var(--gold)' }} />
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 800, color: 'var(--gold)' }}>
                    Payment Wall: Cash on Arrival
                  </span>
                </div>
                <h4 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>
                  Cash Payment at Property Front Desk
                </h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  No credit card or online payment required. Your room reservation is immediately guaranteed and locked; settle the bill in cash when checking in.
                </p>
              </div>

              {/* Cash Guarantee Notice Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(89,135,125,0.08) 0%, rgba(217,119,6,0.06) 100%)',
                border: '1.5px solid rgba(89,135,125,0.25)',
                borderRadius: '12px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'var(--gold-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ffffff', flexShrink: 0
                  }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      100% Cash Settlement Guaranteed
                    </h5>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Pay zero online now. Settle directly at the resort reception desk in cash.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(89,135,125,0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                    <Check size={14} style={{ color: '#059669', flexShrink: 0 }} strokeWidth={3} />
                    <span>No advance charge or card hold</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                    <Check size={14} style={{ color: '#059669', flexShrink: 0 }} strokeWidth={3} />
                    <span>Official stamped cash receipt provided</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                    <Check size={14} style={{ color: '#059669', flexShrink: 0 }} strokeWidth={3} />
                    <span>Instant room &amp; suite lock-in</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                    <Check size={14} style={{ color: '#059669', flexShrink: 0 }} strokeWidth={3} />
                    <span>Pay in {currency.code} or equivalent cash</span>
                  </div>
                </div>
              </div>

              {/* Promo code bar */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Tag size={16} style={{ color: 'var(--gold)' }} />
                  <input
                    type="text"
                    placeholder="Enter Promo Code (e.g. HONEYMOON25)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    style={{
                      background: 'var(--primary)',
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p style={{
                    margin: '8px 0 0 0',
                    fontSize: '0.82rem',
                    color: discountPercent > 0 ? '#16a34a' : '#ef4444',
                    fontWeight: 600
                  }}>
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Bill Breakdown & Cash Payable Amount */}
              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-body)' }}>{room.name} ({diffDays} nights × {currency.symbol}{Math.round(room.pricePerNight * currency.rate)})</span>
                  <span style={{ fontWeight: 600 }}>{currency.symbol}{Math.round(baseRoomRate * currency.rate).toLocaleString()}</span>
                </div>
                {addonsTotalUSD > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-body)' }}>Selected Luxury Add-ons ({selectedAddons.length})</span>
                    <span style={{ fontWeight: 600 }}>+{currency.symbol}{Math.round(addonsTotalUSD * currency.rate).toLocaleString()}</span>
                  </div>
                )}
                {discountPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', color: '#16a34a', fontWeight: 600 }}>
                    <span>Promotion Discount ({discountPercent}%)</span>
                    <span>-{currency.symbol}{Math.round(discountAmountUSD * currency.rate).toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Hospitality Taxes &amp; Service Charges (12%)</span>
                  <span>+{currency.symbol}{Math.round(taxesUSD * currency.rate).toLocaleString()}</span>
                </div>

                {/* Total Cash Amount Highlight Box */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800, color: 'var(--gold)' }}>
                      Total Cash Payable at Check-in
                    </span>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Settled in full at resort reception desk
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                      {currency.symbol}{convertedTotal.toLocaleString()}
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {currency.code} Cash
                    </span>
                  </div>
                </div>
              </div>

              {/* Cash Settlement Options / Preferences */}
              <div style={{
                background: '#fafafa',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb'
              }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>
                  Cash Settlement Preference:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                  {[
                    { id: 'exact', label: '💵 Paying Exact Cash', desc: 'No change needed' },
                    { id: 'need_change', label: '🪙 Require Change', desc: 'Bringing larger notes' },
                    { id: 'foreign', label: '🌍 Local/Foreign Cash', desc: `Paying in ${currency.code}` }
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setCashPreference(opt.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: `1.5px solid ${cashPreference === opt.id ? 'var(--gold)' : '#e2e8f0'}`,
                        background: cashPreference === opt.id ? 'var(--gold-light)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: cashPreference === opt.id ? 'var(--gold-hover)' : 'var(--text-main)' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Optional note for Front Desk (e.g. Arriving late evening, paying in USD cash)..."
                  value={cashRemarks}
                  onChange={(e) => setCashRemarks(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    background: '#ffffff'
                  }}
                />
              </div>

              {/* Navigation & Confirm Reservation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-outline"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="btn-gold"
                  style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}
                >
                  <Banknote size={18} /> Confirm Reservation (Cash on Arrival) <Check size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Reservation Voucher & Confirmation */}
          {step === 5 && confirmedBooking && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--gold-light)',
                  border: '2px solid var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: 'var(--gold)'
                }}>
                  <Check size={36} />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Your Reservation is Confirmed!</h3>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  A confirmation packet with your digital access pass has been sent to <strong>{confirmedBooking.guestDetails.email}</strong>.
                </p>
              </div>

              {/* Printable Luxury Voucher */}
              <div 
                id="booking-voucher"
                style={{
                  border: '2px dashed var(--gold-border)',
                  borderRadius: '16px',
                  background: '#f0f7f4',
                  padding: '24px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #d4e4dd', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 700 }}>
                      Official Reservation Voucher
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1.3rem' }}>{confirmedBooking.room.name}</h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {confirmedBooking.room.destinationName}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Reference ID</span>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                      {confirmedBooking.id}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      background: '#ecfdf5',
                      color: '#065f46',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginTop: '4px'
                    }}>
                      GUARANTEED
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Primary Guest:</span>
                    <p style={{ margin: 0, fontWeight: 700 }}>{confirmedBooking.guestDetails.firstName} {confirmedBooking.guestDetails.lastName}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dates of Stay:</span>
                    <p style={{ margin: 0, fontWeight: 700 }}>{confirmedBooking.checkIn} to {confirmedBooking.checkOut}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration:</span>
                    <p style={{ margin: 0, fontWeight: 700 }}>{confirmedBooking.nights} Nights</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Amount:</span>
                    <p style={{ margin: 0, fontWeight: 800, color: 'var(--gold)', fontSize: '1.1rem' }}>
                      {confirmedBooking.currencySymbol}{confirmedBooking.convertedTotal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Method:</span>
                    <p style={{ margin: 0, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Banknote size={14} /> Cash on Arrival
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Settlement:</span>
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--primary)' }}>
                      Pay at Front Desk
                    </p>
                  </div>
                </div>

                {confirmedBooking.selectedAddons && confirmedBooking.selectedAddons.length > 0 && (
                  <div style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Included Add-ons: </span>
                    <span style={{ color: 'var(--text-muted)' }}>{confirmedBooking.selectedAddons.join(', ')}</span>
                  </div>
                )}

                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Banknote size={20} style={{ flexShrink: 0 }} />
                  <span>
                    <strong>Cash Settlement at Check-in:</strong> Please present this voucher at the resort front desk upon arrival. Settle <strong>{confirmedBooking.currencySymbol}{confirmedBooking.convertedTotal.toLocaleString()} {confirmedBooking.currency}</strong> in cash at the counter to receive your room keys.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-outline"
                >
                  <Printer size={16} /> Print / Save Voucher
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
