import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Phone, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function ConciergeWidget({ onOpenAuth, onExploreCatalog, onCopyCode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Welcome to LuxeHaven VIP Concierge! 🥂 How may I assist your extraordinary stay today?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const quickPrompts = [
    { label: '🌴 Recommend a Villa', query: 'villa' },
    { label: '🚤 Speedboat Transfer', query: 'transfer' },
    { label: '💍 Honeymoon Perks', query: 'honeymoon' },
    { label: '⏰ Check-in / Out', query: 'checkin' }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || input.trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate response
    setTimeout(() => {
      let botResponse = '';
      const lower = query.toLowerCase();

      if (lower.includes('villa') || lower.includes('recommend') || lower.includes('room')) {
        botResponse = 'Our signature Presidential Oceanfront Villa in Maldives and Santorini Cliffside Sanctuary are our highest-rated retreats! Would you like me to take you to our curated rooms catalog?';
      } else if (lower.includes('transfer') || lower.includes('airport') || lower.includes('speedboat')) {
        botResponse = 'All our stays offer executive VIP airport transfers. You can easily add round-trip private speedboat or chauffeur transfer during Step 2 of your checkout!';
      } else if (lower.includes('honeymoon') || lower.includes('offer') || lower.includes('discount')) {
        botResponse = 'Use exclusive promo code HONEYMOON25 during checkout for 25% OFF plus complimentary vintage champagne & candlelit beach dinner!';
      } else if (lower.includes('checkin') || lower.includes('check-in') || lower.includes('time')) {
        botResponse = 'Standard check-in is 3:00 PM and check-out is 11:00 AM. Guaranteed Early Check-in (10:00 AM) or Late Check-out (4:00 PM) can be selected at reservation.';
      } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('call')) {
        botResponse = 'Our 24/7 VIP Concierge Hotline is active at +1 (800) 888-LUXE or concierge@luxehaven.com. We are at your service anytime!';
      } else {
        botResponse = `Thank you for your message regarding "${query}". Our concierge desk will tailor every detail of your reservation. Feel free to explore our suites or filter destinations!`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1200 }}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--gold-gradient)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 30px var(--gold-glow)',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1.5px solid rgba(255,255,255,0.4)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, boxShadow 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={15} color="#fff" />
          </div>
          <span>VIP Concierge</span>
          <span style={{
            background: '#ffffff', color: 'var(--primary)',
            fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px',
            borderRadius: 'var(--radius-full)'
          }}>
            24/7
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '520px',
          maxHeight: 'calc(100vh - 100px)',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--primary)',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid var(--gold)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'var(--gold-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px var(--gold-glow)'
              }}>
                <Sparkles size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', fontFamily: 'var(--font-serif)' }}>
                  LuxeHaven Concierge
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gold-bright)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Online · Dedicated Private Assistant
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                color: 'rgba(255,255,255,0.7)',
                padding: '4px',
                borderRadius: '6px'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            background: 'var(--bg-main)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%'
                }}
              >
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  background: msg.sender === 'user' ? 'var(--primary)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  boxShadow: msg.sender === 'user' ? 'var(--shadow-xs)' : '0 2px 8px rgba(0,0,0,0.06)',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border)'
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  textAlign: msg.sender === 'user' ? 'right' : 'left'
                }}>
                  {msg.time}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Option Chips */}
          <div style={{
            padding: '8px 12px',
            background: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto'
          }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.label)}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gold-light)',
                  color: 'var(--gold-hover)',
                  border: '1px solid var(--gold-border)',
                  cursor: 'pointer'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '12px 16px',
              background: '#ffffff',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <input
              type="text"
              placeholder="Ask about stays, dining, transfers..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'var(--bg-alt)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--text-main)'
              }}
            />
            <button
              type="submit"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--gold-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px var(--gold-glow)'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
