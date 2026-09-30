import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
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
      // If backend error, show error or fallback gracefully
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        {/* Header - Luminous Champagne Ivory */}
        <div style={{
          padding: '26px 24px',
          background: 'linear-gradient(135deg, #f0f7f4 0%, #e0eeea 100%)',
          color: '#1a2e28',
          position: 'relative',
          borderBottom: '1px solid rgba(89, 135, 125, 0.3)'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              color: '#5a7a70',
              background: '#ffffff',
              border: '1px solid #d4e4dd',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <X size={18} />
          </button>

          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: 700 }}>
            LuxeClub Membership
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', color: '#1a2e28', fontFamily: 'var(--font-serif)' }}>
            {isRegister ? 'Join LuxeHaven Prestige' : 'Welcome Back'}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#5a7a70' }}>
            Unlock exclusive member rates, early check-in, and complimentary upgrades.
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px' }}>
          {errorMessage && (
            <div style={{
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isRegister && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victoria Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  placeholder="name@luxurymail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '6px' }}
            >
              {isRegister ? 'Create LuxeClub Account' : 'Sign In'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage('');
            }}
            className="btn-outline"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <User size={16} style={{ color: 'var(--gold)' }} />
            {isRegister ? 'Back to Sign In' : 'Register'}
          </button>

          <p style={{ textAlign: 'center', margin: '20px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already a member?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{ color: 'var(--gold)', fontWeight: 700 }}
            >
              {isRegister ? 'Sign In' : 'Join Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
