import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import { api } from '../services/api';

const HUB_URL = 'http://localhost:5080/hubs/chat';

export default function CustomerChatWidget({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const connectionRef = useRef(null);

  // ── Unified, Stable conversation ID ──
  // Always conv_{userId} so both widget and customer dashboard show the exact same chat
  const conversationId = currentUser?.id
    ? `conv_${currentUser.id}`
    : (typeof window !== 'undefined'
        ? localStorage.getItem('luxehaven_guest_chat_id') || (() => {
            const gid = 'conv_guest_' + Math.random().toString(36).substring(2, 10);
            localStorage.setItem('luxehaven_guest_chat_id', gid);
            return gid;
          })()
        : 'conv_guest');

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Load chat history & initialize SignalR connection
  useEffect(() => {
    if (!conversationId) return;

    let mounted = true;

    const loadHistory = async () => {
      setLoading(true);
      try {
        const data = await api.getChatMessages(conversationId);
        if (mounted && Array.isArray(data)) {
          setMessages(data);
        }
      } catch (e) {
        console.warn('Failed to load chat history:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadHistory();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('ReceiveMessage', (msg) => {
      if (!mounted) return;
      const cleanTarget = conversationId.replace('conv_', '');
      const msgConvClean = (msg.conversationId || '').replace('conv_', '').replace('-widget', '');
      if (msgConvClean === cleanTarget || msg.conversationId === conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    });

    const startSignalR = async () => {
      try {
        await connection.start();
        await connection.invoke('JoinConversation', conversationId);
        if (mounted) setConnected(true);
      } catch (e) {
        console.warn('Chat SignalR connection failed, using REST fallback:', e);
      }
    };

    startSignalR();
    connectionRef.current = connection;

    return () => {
      mounted = false;
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [conversationId]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending || !conversationId) return;

    setSending(true);
    setInput('');

    const senderId = currentUser?.id || 'guest';
    const senderName = currentUser?.name || 'Guest';

    try {
      if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
        await connectionRef.current.invoke(
          'SendMessage',
          conversationId,
          senderId,
          senderName,
          'User',
          text
        );
      } else {
        const saved = await api.sendChatMessage({
          conversationId,
          senderId,
          senderName,
          senderRole: 'User',
          message: text,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: saved.id || Date.now(),
            conversationId,
            senderId,
            senderName,
            senderRole: 'User',
            message: text,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (e) {
      console.warn('Failed to send message:', e);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e5c158 0%, #d4af37 50%, #b89037 100%)',
          color: '#0c0f17',
          border: '1.5px solid rgba(255, 240, 190, 0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.4)',
          zIndex: 999,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'scale(0.92)' : 'scale(1)',
        }}
        title="Direct Chat with Hotel Management"
        aria-label="Open Live Chat"
      >
        {isOpen ? <X size={26} strokeWidth={2.4} /> : <MessageCircle size={26} strokeWidth={2.4} />}
      </button>

      {/* Unified Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '95px',
            right: '24px',
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            height: '540px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'linear-gradient(165deg, rgba(16, 22, 38, 0.98) 0%, rgba(9, 13, 24, 0.99) 100%)',
            borderRadius: '18px',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 998,
            animation: 'chatSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #090d18 0%, #111827 50%, #0d121f 100%)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #e5c158 0%, #d4af37 50%, #b89037 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0c0f17',
                  boxShadow: '0 2px 10px rgba(212, 175, 55, 0.3)',
                }}
              >
                <Sparkles size={18} strokeWidth={2.4} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                  LuxeHaven Concierge &amp; Staff
                </h4>
                <div style={{ fontSize: '0.72rem', color: '#f7df94', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: connected ? '#10b981' : '#f59e0b',
                      display: 'inline-block',
                    }}
                  />
                  <span>{connected ? 'Live Connected' : 'Connecting...'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: '#ffffff',
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              <X size={17} />
            </button>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(5, 8, 15, 0.5)',
            }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.55)',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    color: '#d4af37',
                  }}
                >
                  <MessageCircle size={24} />
                </div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                  Direct Guest Support
                </p>
                <p style={{ margin: '6px 0 0', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  Ask us anything about your reservation, special suite requests, or dining arrangements. All your messages will be saved here in one chat.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderRole === 'User' || msg.senderRole === 'customer';
                return (
                  <div
                    key={msg.id || idx}
                    style={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      gap: '8px',
                      alignItems: 'flex-end',
                    }}
                  >
                    {!isMe && (
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #e5c158, #b89037)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0c0f17',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        H
                      </div>
                    )}
                    <div
                      style={{
                        background: isMe
                          ? 'linear-gradient(135deg, #e5c158 0%, #d4af37 100%)'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: isMe ? '#0c0f17' : '#ffffff',
                        padding: '10px 14px',
                        borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        maxWidth: '78%',
                        wordWrap: 'break-word',
                        fontSize: '0.88rem',
                        lineHeight: 1.45,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        border: isMe ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          opacity: isMe ? 0.75 : 0.6,
                          marginBottom: '3px',
                        }}
                      >
                        {msg.senderName || (isMe ? 'You' : 'Hotel Staff')}
                      </div>
                      <div style={{ fontWeight: isMe ? 600 : 400 }}>{msg.message || msg.text}</div>
                      <div
                        style={{
                          fontSize: '0.65rem',
                          opacity: isMe ? 0.75 : 0.5,
                          textAlign: 'right',
                          marginTop: '4px',
                        }}
                      >
                        {formatTime(msg.createdAt || msg.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '14px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '10px',
              background: 'rgba(10, 14, 25, 0.95)',
            }}
          >
            <input
              type="text"
              placeholder="Type message to hotel management..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: input.trim()
                  ? 'linear-gradient(135deg, #e5c158 0%, #d4af37 100%)'
                  : 'rgba(255, 255, 255, 0.08)',
                color: input.trim() ? '#0c0f17' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
