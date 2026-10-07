import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle, Send, Users, Search, X, Loader,
  ChevronLeft, Circle
} from 'lucide-react';
import * as signalR from '@microsoft/signalr';

const API_BASE_URL = 'http://localhost:5080/api';
const HUB_URL = 'http://localhost:5080/hubs/chat';

/**
 * ManagerChatPanel — shown inside Manager Dashboard as a tab
 * Lists all customer conversations on the left, and the selected chat on the right.
 */
export default function ManagerChatPanel({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [connected, setConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobilePanelView, setMobilePanelView] = useState('list'); // 'list' | 'chat'

  const connectionRef = useRef(null);
  const bottomRef = useRef(null);
  const prevConvRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load all conversations for manager
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/conversations/all`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) {
      console.warn('Failed to load conversations:', e);
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  // SignalR connection (manager listens to all convs)
  useEffect(() => {
    loadConversations();
    let connection = null;
    let mounted = true;

    const init = async () => {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, { withCredentials: true })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      connection.on('ReceiveMessage', (msg) => {
        if (!mounted) return;

        // Update the conversation list (unread count etc.)
        setConversations(prev => {
          const existing = prev.find(c => c.conversationId === msg.conversationId);
          if (existing) {
            return prev.map(c =>
              c.conversationId === msg.conversationId
                ? {
                    ...c,
                    lastMessage: msg.message,
                    lastMessageAt: msg.createdAt,
                    unreadCount: (msg.senderRole === 'User' && c.conversationId !== selectedConvId)
                      ? (c.unreadCount || 0) + 1
                      : c.unreadCount
                  }
                : c
            );
          } else {
            // New conversation appeared
            return [{
              conversationId: msg.conversationId,
              customerName: msg.senderName,
              customerId: msg.senderId,
              lastMessage: msg.message,
              lastMessageAt: msg.createdAt,
              unreadCount: msg.senderRole === 'User' ? 1 : 0
            }, ...prev];
          }
        });

        // If this message belongs to the currently open conversation, add it to the message list
        if (msg.conversationId === selectedConvId) {
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      });

      try {
        await connection.start();
        if (mounted) setConnected(true);
      } catch (e) {
        console.warn('Manager SignalR connection failed:', e);
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
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConvId) return;

    const loadMessages = async () => {
      setLoadingMsgs(true);
      setMessages([]);
      try {
        // Leave old conversation group
        if (prevConvRef.current && connectionRef.current?.state === signalR.HubConnectionState.Connected) {
          await connectionRef.current.invoke('LeaveConversation', prevConvRef.current).catch(() => {});
        }

        // Join new conversation group
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
          await connectionRef.current.invoke('JoinConversation', selectedConvId).catch(() => {});
        }
        prevConvRef.current = selectedConvId;

        const res = await fetch(`${API_BASE_URL}/chat/messages/${selectedConvId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }

        // Mark as read
        await fetch(`${API_BASE_URL}/chat/messages/${selectedConvId}/read?role=Manager`, { method: 'PUT' });
        setConversations(prev =>
          prev.map(c => c.conversationId === selectedConvId ? { ...c, unreadCount: 0 } : c)
        );
      } catch (e) {
        console.warn('Failed to load messages:', e);
      } finally {
        setLoadingMsgs(false);
      }
    };

    loadMessages();
  }, [selectedConvId]);

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !selectedConvId) return;

    setInputText('');

    const tempMsg = {
      id: `temp_${Date.now()}`,
      conversationId: selectedConvId,
      senderId: currentUser?.id || 'manager',
      senderName: currentUser?.name || 'Manager',
      senderRole: currentUser?.role || 'Admin',
      message: text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
        await connectionRef.current.invoke(
          'SendMessage',
          selectedConvId,
          currentUser?.id || 'manager',
          currentUser?.name || 'Manager',
          currentUser?.role || 'Admin',
          text
        );
      } else {
        // REST fallback
        await fetch(`${API_BASE_URL}/chat/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: selectedConvId,
            senderId: currentUser?.id || 'manager',
            senderName: currentUser?.name || 'Manager',
            senderRole: currentUser?.role || 'Admin',
            message: text
          })
        });
      }
    } catch (e) {
      console.warn('Send failed:', e);
    }
  }, [inputText, selectedConvId, currentUser]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filteredConvs = conversations.filter(c =>
    !searchTerm ||
    c.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.conversationId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.conversationId === selectedConvId);

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div style={{
      background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)',
      overflow: 'hidden', display: 'flex', height: '620px'
    }}>
      {/* Left Sidebar — Conversation List */}
      <div style={{
        width: '300px', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        background: '#fafafa'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '18px 16px 12px', borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <MessageCircle size={20} style={{ color: '#7c3aed' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Customer Chats
            </h3>
            {totalUnread > 0 && (
              <span style={{
                background: '#ef4444', color: '#fff', borderRadius: '50%',
                width: '20px', height: '20px', fontSize: '0.7rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px',
                border: '1px solid var(--border)', fontSize: '0.82rem',
                background: '#fff', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          padding: '6px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <Circle
            size={8}
            style={{ color: connected ? '#10b981' : '#f59e0b', fill: 'currentColor' }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {connected ? 'Real-time connected' : 'Connecting...'}
          </span>
        </div>

        {/* Conversations List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingConvs && (
            <div style={{ textAlign: 'center', padding: '30px', color: '#7c3aed' }}>
              <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
            </div>
          )}

          {!loadingConvs && filteredConvs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#9ca3af' }}>
              <Users size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>No conversations yet</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>
                Customers will appear here when they message you.
              </p>
            </div>
          )}

          {filteredConvs.map(conv => (
            <button
              key={conv.conversationId}
              onClick={() => setSelectedConvId(conv.conversationId)}
              style={{
                width: '100%', padding: '14px 16px', textAlign: 'left',
                background: selectedConvId === conv.conversationId ? '#ede9fe' : 'transparent',
                border: 'none', borderBottom: '1px solid var(--border-subtle)',
                cursor: 'pointer', transition: 'background 0.15s ease'
              }}
              onMouseEnter={e => {
                if (selectedConvId !== conv.conversationId)
                  e.currentTarget.style.background = '#f5f3ff';
              }}
              onMouseLeave={e => {
                if (selectedConvId !== conv.conversationId)
                  e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Avatar */}
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '0.85rem'
                }}>
                  {(conv.customerName || 'G').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{
                      margin: 0, fontWeight: conv.unreadCount > 0 ? 700 : 600,
                      fontSize: '0.85rem', color: 'var(--text-main)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {conv.customerName || 'Guest'}
                    </p>
                    <span style={{ fontSize: '0.68rem', color: '#9ca3af', flexShrink: 0, marginLeft: '6px' }}>
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                    <p style={{
                      margin: 0, fontSize: '0.75rem', color: '#6b7280',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontWeight: conv.unreadCount > 0 ? 600 : 400
                    }}>
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span style={{
                        background: '#7c3aed', color: '#fff', borderRadius: '50%',
                        minWidth: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 4px', flexShrink: 0, marginLeft: '4px'
                      }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel — Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {!selectedConvId ? (
          /* Empty state */
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: '#9ca3af'
          }}>
            <MessageCircle size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Select a conversation
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>
              Choose a customer from the left to start chatting.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '14px 18px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '12px', background: '#fff'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
              }}>
                {(selectedConv?.customerName || 'G').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {selectedConv?.customerName || 'Guest'}
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>
                  Customer · {selectedConvId}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
              background: '#f8f9ff'
            }}>
              {loadingMsgs && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#7c3aed' }}>
                  <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              )}

              {!loadingMsgs && messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <MessageCircle size={32} style={{ opacity: 0.25, marginBottom: '10px' }} />
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>No messages yet</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>
                    Send a greeting to start the conversation!
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => {
                const isManager = msg.senderRole === 'Admin' || msg.senderRole === 'Manager';
                return (
                  <div key={msg.id || idx} style={{
                    display: 'flex', justifyContent: isManager ? 'flex-end' : 'flex-start'
                  }}>
                    {!isManager && (
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                        flexShrink: 0, marginRight: '8px', alignSelf: 'flex-end'
                      }}>
                        {(msg.senderName || 'G').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{
                      maxWidth: '68%',
                      background: isManager
                        ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
                        : '#ffffff',
                      color: isManager ? '#fff' : '#1f2937',
                      padding: '10px 14px', borderRadius: isManager
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: isManager ? 'none' : '1px solid #e5e7eb'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {msg.message}
                      </p>
                      <p style={{
                        margin: '4px 0 0', fontSize: '0.68rem',
                        color: isManager ? 'rgba(255,255,255,0.65)' : '#9ca3af',
                        textAlign: 'right'
                      }}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                    {isManager && (
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: 'var(--gold-gradient)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                        flexShrink: 0, marginLeft: '8px', alignSelf: 'flex-end'
                      }}>
                        {(currentUser?.name || 'M').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px', background: '#fff',
              borderTop: '1px solid var(--border)',
              display: 'flex', gap: '10px', alignItems: 'flex-end'
            }}>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Reply to ${selectedConv?.customerName || 'customer'}...`}
                rows={1}
                style={{
                  flex: 1, resize: 'none', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '10px 14px', fontSize: '0.88rem',
                  fontFamily: 'inherit', outline: 'none', maxHeight: '100px',
                  overflowY: 'auto', lineHeight: '1.4'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: inputText.trim()
                    ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
                    : '#e5e7eb',
                  border: 'none', cursor: inputText.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'background 0.2s ease'
                }}
              >
                <Send size={16} color={inputText.trim() ? '#fff' : '#9ca3af'} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
