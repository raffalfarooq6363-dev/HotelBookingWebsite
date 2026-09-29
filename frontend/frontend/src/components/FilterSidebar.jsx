import React from 'react';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';
import { CATEGORIES, ALL_AMENITIES } from '../data/hotelsData';

export default function FilterSidebar({
  filters,
  setFilters,
  currency,
  onResetFilters
}) {
  const toggleAmenity = (amenity) => {
    setFilters(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  return (
    <aside
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--shadow-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1ede6', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} style={{ color: 'var(--gold)' }} />
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Filter Stays</h3>
        </div>
        <button
          onClick={onResetFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontWeight: 600
          }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* 1. Category */}
      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', display: 'block', marginBottom: '12px' }}>
          Property Style
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: filters.category === cat ? 'var(--gold)' : 'var(--border-subtle)',
                background: filters.category === cat ? 'var(--gold-light)' : '#ffffff',
                color: filters.category === cat ? '#9c6c1a' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Price Range Slider */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
            Max Price / Night
          </label>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold)' }}>
            {currency.symbol}{Math.round(filters.maxPrice * currency.rate).toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="250"
          max="1200"
          step="50"
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          style={{
            width: '100%',
            accentColor: 'var(--gold)',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
          <span>{currency.symbol}{Math.round(250 * currency.rate)}</span>
          <span>{currency.symbol}{Math.round(1200 * currency.rate)}+</span>
        </div>
      </div>

      {/* 3. Rating */}
      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', display: 'block', marginBottom: '10px' }}>
          Minimum Rating
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Any Rating', val: 0 },
            { label: '4.8+ Stars', val: 4.8 },
            { label: '4.9+ Stars', val: 4.9 },
            { label: '4.95+ Luxury', val: 4.95 }
          ].map(r => (
            <button
              key={r.val}
              onClick={() => setFilters(prev => ({ ...prev, minRating: r.val }))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: filters.minRating === r.val ? 'var(--gold)' : 'var(--border-subtle)',
                background: filters.minRating === r.val ? 'var(--gold-light)' : '#faf8f5',
                color: filters.minRating === r.val ? '#9c6c1a' : 'var(--text-muted)'
              }}
            >
              {r.val > 0 && <Star size={13} style={{ fill: '#eab308', color: '#eab308' }} />}
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Amenities Checklist */}
      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', display: 'block', marginBottom: '12px' }}>
          Luxury Amenities
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ALL_AMENITIES.map(amenity => {
            const isChecked = filters.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: isChecked ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isChecked ? 600 : 400
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: isChecked ? '1px solid var(--gold)' : '1px solid #cbd5e1',
                  background: isChecked ? 'var(--gold)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0
                }}>
                  {isChecked && <Check size={13} />}
                </div>
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
