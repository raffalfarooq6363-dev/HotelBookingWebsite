import React, { useState } from 'react';
import { LayoutGrid, List, SlidersHorizontal, Sparkles } from 'lucide-react';
import RoomCard from './RoomCard';
import FilterSidebar from './FilterSidebar';

export default function RoomCatalog({
  rooms,
  currency,
  nightsCount,
  wishlist,
  onToggleFavorite,
  onSelectRoom,
  onBookNow,
  filters,
  setFilters,
  onResetFilters
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <section id="catalog" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">Private Sanctuaries</span>
          <h2 className="section-title">Curated Rooms, Suites & Villas</h2>
          <p className="section-description">
            Each stay in our portfolio is hand-selected for architectural distinction, personalized butler hospitality, and breathtaking vistas.
          </p>
        </div>

        {/* Catalog Control Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
              Showing {rooms.length} {rooms.length === 1 ? 'Stay' : 'Stays'}
            </span>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
              ({nightsCount} {nightsCount === 1 ? 'night selected' : 'nights selected'})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="show-on-mobile-flex"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  cursor: 'pointer'
                }}
              >
                <option value="featured">Featured / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div style={{
              display: 'flex',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '2px'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: viewMode === 'grid' ? 'var(--gold-light)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--gold)' : 'var(--text-muted)',
                  display: 'flex'
                }}
                aria-label="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: viewMode === 'list' ? 'var(--gold-light)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--gold)' : 'var(--text-muted)',
                  display: 'flex'
                }}
                aria-label="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout: Filter Sidebar + Room Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '32px',
          alignItems: 'start'
        }} className="catalog-grid-layout">
          {/* Desktop Filter Sidebar */}
          <div className="desktop-filter-col">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              currency={currency}
              onResetFilters={onResetFilters}
            />
          </div>

          {/* Rooms Grid / List */}
          <div>
            {rooms.length === 0 ? (
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
                border: '1px dashed var(--border-subtle)'
              }}>
                <Sparkles size={40} style={{ color: 'var(--gold)', margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Available Stays Found</h3>
                <p style={{ maxWidth: '440px', margin: '0 auto 20px auto', fontSize: '0.92rem' }}>
                  We couldn't find any rooms matching your exact filter preferences. Try resetting filters or expanding your budget range.
                </p>
                <button
                  onClick={onResetFilters}
                  className="btn-primary"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
                  gap: '24px'
                }}
              >
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    currency={currency}
                    nightsCount={nightsCount}
                    isFavorite={wishlist.some(item => item.id === room.id)}
                    onToggleFavorite={onToggleFavorite}
                    onSelectRoom={onSelectRoom}
                    onBookNow={onBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
