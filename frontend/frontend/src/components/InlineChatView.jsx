import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Clock } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import { api } from '../services/api';

const HUB_URL = 'http://localhost:5080/hubs/chat';

export default function InlineChatView({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const connectionRef = useRef(null);

  // ── Stable conversation ID: always userId (so same convo across page loads)
  const conversationId = currentUser?.id ? `conv_${currentUser.id}` : null;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load history + start SignalR
  useEffect(() => {
    if (!conversationId) { setLoading(false); return; }

    let mounted = true;

    const init = async () => {
      // 1. Load history from REST
      try {
        const data = await api.getChatMessages(conversationId);
        if (mounted) setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn('Failed to load chat messages:', e);
      } finally {
        if (mounted) setLoading(false);
      }

      // 2. Connect SignalR
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, { withCredentials: true })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      connection.on('ReceiveMessage', (msg) => {
        if (!mounted) return;
        // Only add if it belongs to this conversation and not already in list
        if (msg.conversationId === conversationId) {
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      });

      try {
        await connection.start();
        await connection.invoke('JoinConversation', conversationId);
        if (mounted) setConnected(true);
      } catch (e) {
        console.warn('SignalR connection failed:', e);
      }

      connectionRef.current = connection;
    };

    init();

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
    if (!input.trim() || sending || !conversationId) return;

    const text = input.trim();
    setSending(true);
    setInput('');

    try {
      if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
        // Send via SignalR — hub saves to DB and broadcasts
        await connectionRef.current.invoke(
          'SendMessage',
          conversationId,
          currentUser?.id || 'guest',
          currentUser?.name || 'Guest',
          'User',
          text
        );
      } else {
        // REST fallback
        const saved = await api.sendChatMessage({
          conversationId,
          senderId: currentUser?.id || 'guest',
          senderName: currentUser?.name || 'Guest',
          senderRole: 'User',
          message: text
        });
        // Optimistically add to UI since SignalR isn't available
        setMessages(prev => [...prev, {
          id: saved.id || Date.now(),
          conversationId,
          senderId: currentUser?.id,
          senderName: currentUser?.name || 'Guest',
          senderRole: 'User',
          message: text,
          createdAt: new Date().toISOString()
        }]);
      }
    } catch (e) {
      console.warn('Failed to send message:', e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        <MessageCircle size={32} style={{ opacity: 0.4 }} />
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
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>
              Chat with Hotel Support
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', opacity: 0.85 }}>
              Average response time: 2 minutes
            </p>
          </div>
          {/* Connection indicator */}
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: connected ? '#10b981' : '#f59e0b',
            display: 'inline-block', flexShrink: 0
          }} title={connected ? 'Real-time connected' : 'Connecting...'} />
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
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', textAlign: 'center', color: 'var(--text-muted)'
          }}>
            <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No messages yet</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
              Start a conversation with our hotel support team
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderRole === 'User';
            return (
              <div key={msg.id || idx} style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                gap: '8px', alignItems: 'flex-end'
              }}>
                {!isMe && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--gold-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: '#fff', fontSize: '0.75rem', fontWeight: 700
                  }}>
                    M
                  </div>
                )}
                <div style={{
                  background: isMe ? 'var(--primary)' : '#ffffff',
                  color: isMe ? '#ffffff' : 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  maxWidth: '70%', wordWrap: 'break-word',
                  border: !isMe ? '1px solid var(--border)' : 'none',
                  fontSize: '0.9rem', lineHeight: 1.4
                }}>
                  <p style={{ margin: '0 0 2px', fontSize: '0.72rem', fontWeight: 600, opacity: 0.7 }}>
                    {msg.senderName}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.message}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.68rem', opacity: 0.6, textAlign: 'right' }}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '16px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', gap: '10px', background: '#ffffff'
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: '10px',
            border: '1px solid var(--border)', fontSize: '0.9rem',
            fontFamily: 'var(--font-body)', outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          style={{
            padding: '10px 16px', borderRadius: '10px',
            background: 'var(--primary)', color: '#ffffff',
            border: 'none', cursor: sending ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontWeight: 600, fontSize: '0.88rem',
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
