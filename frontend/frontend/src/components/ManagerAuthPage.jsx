import React, { useState } from 'react';
import { Hotel, Lock, Mail, User, AlertCircle, Eye, EyeOff, Shield, ChevronLeft } from 'lucide-react';
import { api } from '../services/api';

export default function ManagerAuthPage({ onLoginSuccess, onBackToSite }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Confirm password check
    if (isRegister && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isRegister) {
        result = await api.managerRegister(name.trim(), email.trim(), password);
        setSuccessMessage('Manager account created successfully! Please sign in.');
        setIsRegister(false);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        result = await api.managerLogin(email.trim(), password);
        // Verify that logged-in user is actually a manager/admin
        const role = result?.user?.role?.toLowerCase();
        if (!['admin', 'manager'].includes(role)) {
          api.logout();
          setErrorMessage('Access denied. This portal is restricted to hotel managers only.');
          return;
        }
        onLoginSuccess(result.user);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setErrorMessage('');
    setSuccessMessage('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1f1a 0%, #1a3028 40%, #0f2920 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background circles */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        right: '-120px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(89,135,125,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(89,135,125,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Back to site button */}
      <button
        onClick={onBackToSite}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.7)',
          padding: '8px 14px',
          borderRadius: '8px',
          fontSize: '0.84rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(8px)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
        }}
      >
        <ChevronLeft size={16} />
        Back to Website
      </button>

      {/* Auth Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '36px 36px 28px 36px',
          background: 'linear-gradient(135deg, rgba(89,135,125,0.2) 0%, rgba(89,135,125,0.05) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--gold-gradient)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(89,135,125,0.4)'
            }}>
              <Hotel size={26} color="#ffffff" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1
              }}>
                Luxe<span style={{ color: 'var(--gold)' }}>Haven</span>
              </div>
              <div style={{
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                marginTop: '3px'
              }}>
                Hotels &amp; Resorts
              </div>
            </div>
          </div>

          {/* Manager badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(89,135,125,0.2)',
            border: '1px solid rgba(89,135,125,0.35)',
            borderRadius: '20px',
            padding: '4px 14px',
            marginBottom: '14px'
          }}>
            <Shield size={12} color="var(--gold)" />
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
              Manager Portal
            </span>
          </div>

          <h2 style={{
            margin: '0 0 6px 0',
            fontSize: '1.55rem',
            color: '#ffffff',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700
          }}>
            {isRegister ? 'Create Manager Account' : 'Manager Sign In'}
          </h2>
          <p style={{
            margin: 0,
            fontSize: '0.84rem',
            color: 'rgba(255,255,255,0.5)'
          }}>
            {isRegister
              ? 'Register a new hotel management account'
              : 'Authorized hotel staff access only'
            }
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '28px 36px 32px 36px' }}>
          {/* Error */}
          {errorMessage && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#fca5a5',
              border: '1px solid rgba(239,68,68,0.3)',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.83rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ marginTop: '1px', flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div style={{
              background: 'rgba(34,197,94,0.1)',
              color: '#86efac',
              border: '1px solid rgba(34,197,94,0.3)',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.83rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Shield size={16} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Name field (register only) */}
            {isRegister && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={inputIconStyle} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmed Raza"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={inputIconStyle} />
                <input
                  type="email"
                  required
                  placeholder="manager@luxehaven.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={inputIconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (register only) */}
            {isRegister && (
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={inputIconStyle} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading
                  ? 'rgba(89,135,125,0.4)'
                  : 'var(--gold-gradient)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(89,135,125,0.35)',
                marginTop: '4px'
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite'
                  }} />
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <Shield size={16} />
                  {isRegister ? 'Create Manager Account' : 'Sign In to Dashboard'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div style={{
            marginTop: '22px',
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.45)' }}>
              {isRegister ? 'Already have a manager account?' : "Need to register as manager?"}
            </span>
            {' '}
            <button
              type="button"
              onClick={switchMode}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
                textUnderlineOffset: '3px'
              }}
            >
              {isRegister ? 'Sign In' : 'Register Here'}
            </button>
          </div>

          {/* Security notice */}
          <div style={{
            marginTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'rgba(255,255,255,0.28)',
            fontSize: '0.74rem'
          }}>
            <Lock size={11} />
            <span>Restricted access — authorized personnel only</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Shared input styles
const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 600,
  display: 'block',
  marginBottom: '7px',
  color: 'rgba(255,255,255,0.7)'
};

const inputIconStyle = {
  position: 'absolute',
  left: '13px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'rgba(255,255,255,0.35)',
  pointerEvents: 'none'
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px 11px 40px',
  borderRadius: '9px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.07)',
  color: '#ffffff',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box'
};
