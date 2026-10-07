import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, MessageCircle, Clock, User } from 'lucide-react';
import { api } from '../services/api';

export default function InlineChatView({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Generate or get conversation ID
  useEffect(() => {
    if (currentUser?.id) {
      const genConvId = `${currentUser.id}-${Date.now()}`;
      setConversationId(genConvId);
      loadMessages(genConvId);
    }
    setLoading(false);
  }, [currentUser?.id]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (convId) => {
    try {
      const data = await api.getChatMessages(convId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Failed to load chat messages:', e);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending || !conversationId) return;

    const userMessage = {
      id: Date.now().toString(),
      conversationId,
      sender: currentUser?.name || 'Guest',
      senderRole: currentUser?.role || 'customer',
      text: input.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, userMessage]);
    setSending(true);
    setInput('');

    try {
      await api.sendChatMessage({
        conversationId,
        senderRole: currentUser?.role || 'customer',
        message: input.trim(),
        senderName: currentUser?.name || 'Guest'
      });

      // Simulate manager response after a short delay
      setTimeout(() => {
        const managerReply = {
          id: (Date.now() + 1).toString(),
          conversationId,
          sender: 'Hotel Manager',
          senderRole: 'manager',
          text: 'Thank you for your message! We\'ll get back to you shortly with assistance.',
          timestamp: new Date().toISOString(),
          isRead: false
        };
        setMessages(prev => [...prev, managerReply]);
      }, 1000);
    } catch (e) {
      console.warn('Failed to send message:', e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>
          <MessageCircle size={32} />
        </div>
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      maxWidth: '800px',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Chat Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 100%)',
        color: '#ffffff',
        padding: '18px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageCircle size={20} style={{ color: 'var(--gold-bright)' }} />
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>
              Chat with Hotel Support
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', opacity: 0.85 }}>
              Average response time: 2 minutes
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: 'var(--bg-secondary)'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No messages yet</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
              Start a conversation with our hotel support team
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.senderRole === 'customer' ? 'flex-end' : 'flex-start',
                gap: '8px',
                alignItems: 'flex-end'
              }}
            >
              {msg.senderRole === 'manager' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--gold-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  M
                </div>
              )}
              <div
                style={{
                  background: msg.senderRole === 'customer' ? 'var(--primary)' : '#ffffff',
                  color: msg.senderRole === 'customer' ? '#ffffff' : 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: msg.senderRole === 'customer' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                  border: msg.senderRole === 'manager' ? '1px solid var(--border-light)' : 'none',
                  fontSize: '0.9rem',
                  lineHeight: 1.4
                }}
              >
                <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: 600, opacity: 0.7 }}>
                  {msg.sender}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.text}</p>
                <p style={{
                  margin: '4px 0 0',
                  fontSize: '0.7rem',
                  opacity: 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <Clock size={10} />
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '10px',
          background: '#ffffff'
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)'
          }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            background: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            cursor: sending ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
            fontSize: '0.88rem',
            opacity: sending ? 0.6 : 1
          }}
        >
          <Send size={16} />
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
