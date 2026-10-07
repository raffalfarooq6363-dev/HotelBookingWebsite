import React, { useState, useMemo } from 'react';
import {
  Plus, Edit3, Trash2, Search, Filter, X, Save,
  ChevronDown, Image, Star, Users, Bed, Wifi, Coffee
} from 'lucide-react';
import { api } from '../services/api';

export default function RoomManagementPanel({ allRooms, onRoomsUpdated }) {
  const [rooms, setRooms] = useState(allRooms || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingRoom, setEditingRoom] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    destinationId: '',
    category: 'Deluxe',
    bedType: 'King Bed',
    maxGuests: 2,
    pricePerNight: 0,
    originalPrice: 0,
    rating: 5,
    reviewsCount: 0,
    amenities: [],
    images: [],
    badge: '',
    discountBadge: '',
    featured: false
  });

  const filteredRooms = useMemo(() => {
    let result = rooms;
    if (filterCategory !== 'All') {
      result = result.filter(r => r.category === filterCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.name?.toLowerCase().includes(term) ||
        r.destinationName?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [rooms, filterCategory, searchTerm]);

  const categories = ['All', 'Deluxe', 'Suite', 'Villa', 'Penthouse'];
  const amenitiesOptions = ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Concierge'];

  const handleEditRoom = (room) => {
    setFormData(room);
    setEditingRoom(room.id);
    setIsCreating(false);
  };

  const handleNewRoom = () => {
    setFormData({
      name: '',
      destinationId: '',
      category: 'Deluxe',
      bedType: 'King Bed',
      maxGuests: 2,
      pricePerNight: 0,
      originalPrice: 0,
      rating: 5,
      reviewsCount: 0,
      amenities: [],
      images: [],
      badge: '',
      discountBadge: '',
      featured: false
    });
    setEditingRoom(null);
    setIsCreating(true);
  };

  const handleSaveRoom = async () => {
    setSaving(true);
    try {
      if (isCreating) {
        await api.createRoom(formData);
        setRooms(prev => [...prev, { ...formData, id: Date.now().toString() }]);
      } else {
        await api.updateRoom(editingRoom, formData);
        setRooms(prev => prev.map(r => r.id === editingRoom ? { ...r, ...formData } : r));
      }
      setEditingRoom(null);
      setIsCreating(false);
      onRoomsUpdated?.();
    } catch (e) {
      alert('Error saving room: ' + (e.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.deleteRoom(roomId);
      setRooms(prev => prev.filter(r => r.id !== roomId));
      onRoomsUpdated?.();
    } catch (e) {
      alert('Error deleting room: ' + (e.message || 'Unknown error'));
    }
  };

  const handleCancel = () => {
    setEditingRoom(null);
    setIsCreating(false);
  };

  if (editingRoom || isCreating) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        padding: '28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
            {isCreating ? 'Create New Room' : 'Edit Room'}
          </h3>
          <button
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: 'var(--text-muted)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px', marginBottom: '24px' }}>
          {[
            { label: 'Room Name', key: 'name', type: 'text' },
            { label: 'Destination ID', key: 'destinationId', type: 'text' },
            { label: 'Category', key: 'category', type: 'select', options: categories },
            { label: 'Bed Type', key: 'bedType', type: 'text' },
            { label: 'Max Guests', key: 'maxGuests', type: 'number' },
            { label: 'Price/Night (USD)', key: 'pricePerNight', type: 'number' },
            { label: 'Original Price (USD)', key: 'originalPrice', type: 'number' },
            { label: 'Rating (0-5)', key: 'rating', type: 'number', min: 0, max: 5 },
            { label: 'Reviews Count', key: 'reviewsCount', type: 'number' },
            { label: 'Badge Text', key: 'badge', type: 'text' },
            { label: 'Discount Badge', key: 'discountBadge', type: 'text' }
          ].map((field, i) => (
            <div key={i}>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '6px'
              }}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.key]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  min={field.min}
                  max={field.max}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Amenities Checkboxes */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '10px'
          }}>
            Amenities
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {amenitiesOptions.map(amenity => (
              <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes(amenity) || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    amenities: e.target.checked
                      ? [...(prev.amenities || []), amenity]
                      : (prev.amenities || []).filter(a => a !== amenity)
                  }))}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.82rem' }}>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Featured Checkbox */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Featured Room</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: '#ffffff',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRoom}
            disabled={saving}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: saving ? 0.6 : 1
            }}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Room'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
            Room Management
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage all rooms, rates, and amenities ({filteredRooms.length} rooms)
          </p>
        </div>
        <button
          onClick={handleNewRoom}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            background: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.88rem'
          }}
        >
          <Plus size={16} />
          Add New Room
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by room name or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              fontSize: '0.88rem'
            }}
          />
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterCategory === cat ? 'var(--primary)' : '#ffffff',
              color: filterCategory === cat ? '#ffffff' : 'var(--text-body)',
              border: filterCategory === cat ? 'none' : '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rooms Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem'
          }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Room Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Destination</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Price/Night</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Rating</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Max Guests</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room, i) => (
                <tr
                  key={room.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: i % 2 === 0 ? '#ffffff' : 'var(--bg-secondary)'
                  }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                    {room.name}
                    {room.featured && (
                      <span style={{
                        display: 'inline-block',
                        marginLeft: '8px',
                        background: 'var(--gold-gradient)',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        Featured
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{room.destinationName || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: 'var(--primary-pale)',
                      color: 'var(--primary)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {room.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                    ${room.pricePerNight}
                    {room.originalPrice > room.pricePerNight && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '4px', textDecoration: 'line-through' }}>
                        ${room.originalPrice}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
                      {room.rating}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{room.maxGuests} guests</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEditRoom(room)}
                        style={{
                          background: 'var(--primary-pale)',
                          color: 'var(--primary)',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        <Edit3 size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        style={{
                          background: '#fef2f2',
                          color: '#ef4444',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRooms.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>No rooms found</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
              Try adjusting your filters or create a new room
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
