import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '420px',
      width: 'calc(100% - 48px)'
    }}>
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgColor = '#0f172a';
        let iconColor = '#59877D';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = '#ef4444';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = '#38bdf8';
        }

        return (
          <div
            key={toast.id}
            style={{
              background: bgColor,
              color: '#ffffff',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: iconColor
              }}>
                <Icon size={20} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: '#ffffff' }}>
                  {toast.title || 'Notification'}
                </p>
                {toast.message && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                    {toast.message}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                color: '#94a3b8',
                background: 'none',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex'
              }}
              aria-label="Dismiss toast"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
