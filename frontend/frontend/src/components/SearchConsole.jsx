import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  ChevronDown, 
  Plus, 
  Minus 
} from 'lucide-react';
import { DESTINATIONS } from '../data/hotelsData';

export default function SearchConsole({
  searchFilters,
  setSearchFilters,
  onPerformSearch
}) {
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);

  // Helper to calculate nights between check-in and check-out
  const getNights = () => {
    try {
      const d1 = new Date(searchFilters.checkIn);
      const d2 = new Date(searchFilters.checkOut);
      const diffTime = d2 - d1;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const updateGuests = (field, delta) => {
    setSearchFilters(prev => {
      const current = prev[field];
      const next = Math.max(field === 'adults' || field === 'rooms' ? 1 : 0, current + delta);
      return { ...prev, [field]: next };
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setGuestPopoverOpen(false);
    if (onPerformSearch) {
      onPerformSearch();
    }
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0 20px 50px rgba(180, 160, 120, 0.15)',
        border: '1px solid rgba(197, 155, 63, 0.35)',
        width: '100%',
        maxWidth: '1180px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 160px',
          gap: '14px',
          alignItems: 'center'
        }}
        className="search-console-grid"
      >
        {/* 1. Destination Selector */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '10px 14px',
          background: '#faf8f5',
          borderRadius: '10px',
          border: '1px solid #e9e3d8'
        }}>
          <label style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '4px'
          }}>
            <MapPin size={13} /> Destination
          </label>
          <select
            value={searchFilters.destination}
            onChange={(e) => setSearchFilters(prev => ({ ...prev, destination: e.target.value }))}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--primary)',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {DESTINATIONS.map(dest => (
              <option key={dest.id} value={dest.id}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Check-In Date */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '10px 14px',
          background: '#faf8f5',
          borderRadius: '10px',
          border: '1px solid #e9e3d8'
        }}>
          <label style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '4px'
          }}>
            <Calendar size={13} /> Check-In
          </label>
          <input
            type="date"
            value={searchFilters.checkIn}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSearchFilters(prev => ({ ...prev, checkIn: e.target.value }))}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'var(--primary)',
              cursor: 'pointer',
              width: '100%'
            }}
          />
        </div>

        {/* 3. Check-Out Date */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '10px 14px',
          background: '#faf8f5',
          borderRadius: '10px',
          border: '1px solid #e9e3d8'
        }}>
          <label style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} /> Check-Out
            </span>
            <span style={{
              background: 'rgba(200, 155, 63, 0.15)',
              color: '#9c6c1a',
              padding: '1px 6px',
              borderRadius: '4px',
              fontSize: '0.68rem',
              fontWeight: 700
            }}>
              {getNights()} {getNights() === 1 ? 'Night' : 'Nights'}
            </span>
          </label>
          <input
            type="date"
            value={searchFilters.checkOut}
            min={searchFilters.checkIn}
            onChange={(e) => setSearchFilters(prev => ({ ...prev, checkOut: e.target.value }))}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'var(--primary)',
              cursor: 'pointer',
              width: '100%'
            }}
          />
        </div>

        {/* 4. Guests & Rooms Dropdown/Popover */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setGuestPopoverOpen(!guestPopoverOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 14px',
              background: '#faf8f5',
              borderRadius: '10px',
              border: '1px solid #e9e3d8',
              cursor: 'pointer'
            }}
          >
            <label style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--gold)',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
              pointerEvents: 'none'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={13} /> Guests & Rooms
              </span>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </label>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {searchFilters.adults + searchFilters.children} Guests, {searchFilters.rooms} {searchFilters.rooms === 1 ? 'Room' : 'Rooms'}
            </div>
          </div>

          {/* Guest Selection Popover Modal */}
          {guestPopoverOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                right: 0,
                background: '#ffffff',
                border: '1px solid rgba(200, 155, 63, 0.3)',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.18)',
                zIndex: 900,
                minWidth: '260px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Adults Counter */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>Adults</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ages 13 and above</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); updateGuests('adults', -1); }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: searchFilters.adults <= 1 ? '#cbd5e1' : 'var(--primary)'
                    }}
                    disabled={searchFilters.adults <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{searchFilters.adults}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); updateGuests('adults', 1); }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Children Counter */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>Children</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ages 0 - 12</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); updateGuests('children', -1); }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: searchFilters.children <= 0 ? '#cbd5e1' : 'var(--primary)'
                    }}
                    disabled={searchFilters.children <= 0}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{searchFilters.children}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); updateGuests('children', 1); }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Rooms Counter */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>Rooms</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Private suites/villas</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); updateGuests('rooms', -1); }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: searchFilters.rooms <= 1 ? '#cbd5e1' : 'var(--primary)'
                    }}
                    disabled={searchFilters.rooms <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{searchFilters.rooms}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); updateGuests('rooms', 1); }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGuestPopoverOpen(false)}
                style={{
                  marginTop: '8px',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                Apply Selection
              </button>
            </div>
          )}
        </div>

        {/* 5. Search Button */}
        <div>
          <button
            type="submit"
            style={{
              width: '100%',
              height: '58px',
              background: 'var(--gold-gradient)',
              color: '#ffffff',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              boxShadow: '0 6px 20px var(--gold-glow)',
              transition: 'all 0.25s ease'
            }}
          >
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
