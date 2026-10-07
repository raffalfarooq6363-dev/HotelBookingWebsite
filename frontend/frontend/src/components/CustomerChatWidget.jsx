import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function CustomerChatWidget({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  // Initialize chat
  useEffect(() => {
    if (currentUser?.id) {
      const convId = `${currentUser.id}-widget`;
      setConversationId(convId);
    }
  }, [currentUser?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending || !conversationId) return;

    const msg = {
      id: Date.now().toString(),
      sender: currentUser?.name || 'Guest',
      senderRole: 'customer',
      text: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, msg]);
    setSending(true);
    setInput('');

    try {
      await api.sendChatMessage({
        conversationId,
        senderRole: 'customer',
        message: input.trim(),
        senderName: currentUser?.name || 'Guest'
      });

      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'Hotel Support',
          senderRole: 'manager',
          text: 'Thanks for reaching out! How can we help you today?',
          timestamp: new Date().toISOString()
        }]);
      }, 800);
    } catch (e) {
      console.warn('Failed to send message:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 100%)',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(147, 51, 234, 0.4)',
          zIndex: 999,
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          ':hover': {
            boxShadow: '0 8px 30px rgba(147, 51, 234, 0.5)'
          }
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(147, 51, 234, 0.5)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(147, 51, 234, 0.4)'}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '380px',
          height: '500px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 998,
          animation: 'slideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 100%)',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>
                Chat Support
              </h4>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', opacity: 0.8 }}>
                We typically reply in minutes
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'var(--bg-secondary)'
          }}>
            {messages.length === 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                <MessageCircle size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>
                  Hello! Need help?
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>
                  Ask us anything about your stay
                </p>
              </div>
            )}
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.senderRole === 'customer' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    background: msg.senderRole === 'customer' ? 'var(--primary)' : '#ffffff',
                    color: msg.senderRole === 'customer' ? '#ffffff' : 'var(--text-main)',
                    padding: '9px 12px',
                    borderRadius: msg.senderRole === 'customer' ? '12px 3px 12px 12px' : '3px 12px 12px 12px',
                    maxWidth: '80%',
                    wordWrap: 'break-word',
                    fontSize: '0.85rem',
                    lineHeight: 1.4,
                    border: msg.senderRole === 'manager' ? '1px solid var(--border-light)' : 'none'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '8px',
              background: '#ffffff'
            }}
          >
            <input
              type="text"
              placeholder="Type message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-body)'
              }}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                cursor: sending ? 'not-allowed' : 'pointer',
                opacity: sending ? 0.6 : 1
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
