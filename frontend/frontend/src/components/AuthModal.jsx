import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  pendingRoom = null   // room waiting for login before booking
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      let result;
      if (isRegister) {
        result = await api.register(name || 'Luxury Guest', email, password);
      } else {
        result = await api.login(email, password);
      }
      onLoginSuccess(result.user);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px 12px 42px',
    borderRadius: '10px',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  };

  const inputFocusHandler = (e) => {
    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.12)';
  };

  const inputBlurHandler = (e) => {
    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
    e.currentTarget.style.boxShadow = 'none';
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#d4af37',
    pointerEvents: 'none',
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        background: 'rgba(5, 8, 15, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '390px',
          background: 'linear-gradient(165deg, rgba(18, 24, 40, 0.98) 0%, rgba(12, 16, 28, 0.99) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.6), 0 0 1px rgba(212, 175, 55, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
        }}
      >
        {/* Top Gold Hairline */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(245, 211, 114, 0.8) 50%, transparent)',
            zIndex: 2,
          }}
        />

        {/* Decorative Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: '22px 24px 18px',
            position: 'relative',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              color: 'rgba(255, 255, 255, 0.6)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '7px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            <X size={16} />
          </button>

          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '9999px',
              padding: '4px 12px',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={12} style={{ color: '#e5c158' }} />
            <span
              style={{
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#f7df94',
                fontWeight: 700,
              }}
            >
              LuxeClub Membership
            </span>
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: '1.3rem',
              color: '#ffffff',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {isRegister ? (
              <>Join <span style={{ color: '#f7df94' }}>LuxeHaven</span> Prestige</>
            ) : (
              <>Welcome <span style={{ color: '#f7df94' }}>Back</span></>
            )}
          </h3>
          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '0.84rem',
              color: 'rgba(255, 255, 255, 0.55)',
              lineHeight: 1.5,
            }}
          >
            {isRegister
              ? 'Create your account to unlock exclusive member rates and VIP privileges.'
              : 'Sign in to access exclusive member rates, early check-in & complimentary upgrades.'}
          </p>
        </div>

        {/* Pending Booking Banner */}
        {pendingRoom && (
          <div
            style={{
              margin: '0',
              padding: '10px 24px',
              background: 'rgba(212, 175, 55, 0.12)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🏨</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#f7df94', fontWeight: 700 }}>
                Reservation Pending
              </p>
              <p style={{ margin: 0, fontSize: '0.73rem', color: 'rgba(255,255,255,0.6)', marginTop: '1px' }}>
                {pendingRoom.name} — Sign in to confirm your booking
              </p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div style={{ padding: '20px 24px 24px' }}>
          {/* Error Alert */}
          {errorMessage && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            {/* Full Name (Register only) */}
            {isRegister && (
              <div>
                <label
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '7px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    letterSpacing: '0.03em',
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={iconStyle} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victoria Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    onFocus={inputFocusHandler}
                    onBlur={inputBlurHandler}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '7px',
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.03em',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={iconStyle} />
                <input
                  type="email"
                  required
                  placeholder="name@luxurymail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '7px',
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.03em',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '4px',
                padding: '13px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 240, 190, 0.5)',
                background: 'linear-gradient(135deg, #e5c158 0%, #d4af37 50%, #b89037 100%)',
                color: '#0b0e14',
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.03em',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 24px rgba(212, 175, 55, 0.35)',
                transition: 'all 0.25s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(212, 175, 55, 0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(11, 14, 20, 0.3)',
                      borderTopColor: '#0b0e14',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield size={16} strokeWidth={2.5} />
                  <span>{isRegister ? 'Create LuxeClub Account' : 'Sign In to LuxeHaven'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '20px 0',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent)',
              }}
            />
            <span
              style={{
                fontSize: '0.72rem',
                color: 'rgba(255, 255, 255, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              or
            </span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent)',
              }}
            />
          </div>

          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage('');
            }}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
              e.currentTarget.style.color = '#f7df94';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
            }}
          >
            <User size={16} style={{ color: '#e5c158' }} />
            {isRegister ? 'Back to Sign In' : 'Create New Account'}
          </button>

          {/* Footer Text */}
          <p
            style={{
              textAlign: 'center',
              margin: '18px 0 0 0',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            {isRegister ? 'Already a member?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage('');
              }}
              style={{
                color: '#e5c158',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                padding: 0,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f7df94')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#e5c158')}
            >
              {isRegister ? 'Sign In' : 'Join Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
