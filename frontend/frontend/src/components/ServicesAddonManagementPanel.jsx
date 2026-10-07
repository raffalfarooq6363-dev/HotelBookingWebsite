import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Edit3, Trash2, Search, X, Save, Sparkles,
  DollarSign, Clock
} from 'lucide-react';
import { api } from '../services/api';

export default function ServicesAddonManagementPanel() {
  const [addons, setAddons] = useState([
    {
      id: 'addon-1',
      title: 'VIP Private Chauffeur / Speedboat Transfer',
      description: 'Premium ground and water transportation with personal concierge service',
      price: 250,
      duration: '1-2 hours',
      category: 'Transportation',
      image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'addon-2',
      title: 'Couples Holistic Spa & Aromatherapy',
      description: 'Rejuvenating 90-minute couples massage with premium essential oils',
      price: 450,
      duration: '90 minutes',
      category: 'Wellness',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'addon-3',
      title: 'Michelin-Star Dining Experience',
      description: '7-course tasting menu with wine pairings and private chef consultation',
      price: 350,
      duration: '3 hours',
      category: 'Dining',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingAddon, setEditingAddon] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    duration: '',
    category: 'Services',
    image: ''
  });

  const categories = ['All', 'Transportation', 'Wellness', 'Dining', 'Activities', 'Services'];

  const filteredAddons = useMemo(() => {
    let result = addons;
    if (filterCategory !== 'All') {
      result = result.filter(a => a.category === filterCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a =>
        a.title?.toLowerCase().includes(term) ||
        a.description?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [addons, filterCategory, searchTerm]);

  const handleEditAddon = (addon) => {
    setFormData(addon);
    setEditingAddon(addon.id);
    setIsCreating(false);
  };

  const handleNewAddon = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      duration: '',
      category: 'Services',
      image: ''
    });
    setEditingAddon(null);
    setIsCreating(true);
  };

  const handleSaveAddon = async () => {
    if (!formData.title || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const newAddon = { ...formData, id: `addon-${Date.now()}` };
        await api.createLuxuryAddon(newAddon);
        setAddons(prev => [...prev, newAddon]);
      } else {
        await api.updateLuxuryAddon(editingAddon, formData);
        setAddons(prev => prev.map(a => a.id === editingAddon ? { ...a, ...formData } : a));
      }
      setEditingAddon(null);
      setIsCreating(false);
    } catch (e) {
      alert('Error saving addon: ' + (e.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddon = async (addonId) => {
    if (!window.confirm('Are you sure you want to delete this addon?')) return;
    try {
      await api.deleteLuxuryAddon(addonId);
      setAddons(prev => prev.filter(a => a.id !== addonId));
    } catch (e) {
      alert('Error deleting addon: ' + (e.message || 'Unknown error'));
    }
  };

  const handleCancel = () => {
    setEditingAddon(null);
    setIsCreating(false);
  };

  if (editingAddon || isCreating) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        padding: '28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
            {isCreating ? 'Create New Service/Addon' : 'Edit Service/Addon'}
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

        {/* Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '18px', marginBottom: '24px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px'
            }}>
              Service Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Private Yacht Charter"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px'
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the service..."
              rows="4"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-body)',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '6px'
              }}>
                Price (USD) *
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '11px',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '6px'
              }}>
                Duration
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '11px',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 2 hours"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px'
            }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-body)'
              }}
            >
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px'
            }}>
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-body)'
              }}
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                style={{
                  marginTop: '12px',
                  width: '100%',
                  maxWidth: '300px',
                  height: '150px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
            )}
          </div>
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
            onClick={handleSaveAddon}
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
            {saving ? 'Saving...' : 'Save Addon'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
            Services & Luxury Addons
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage premium services and add-ons ({filteredAddons.length} services)
          </p>
        </div>
        <button
          onClick={handleNewAddon}
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
          Add Service/Addon
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
            placeholder="Search services..."
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

      {/* Addons Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '18px'
      }}>
        {filteredAddons.map(addon => (
          <div
            key={addon.id}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {addon.image && (
              <img
                src={addon.image}
                alt={addon.title}
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover'
                }}
              />
            )}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', flex: 1 }}>
                  {addon.title}
                </h3>
                <span style={{
                  background: 'var(--primary-pale)',
                  color: 'var(--primary)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}>
                  {addon.category}
                </span>
              </div>
              <p style={{
                margin: '0 0 12px 0',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
                flex: 1
              }}>
                {addon.description}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-light)'
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Price</p>
                  <p style={{ margin: '2px 0 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                    ${addon.price}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Duration</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {addon.duration}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEditAddon(addon)}
                  style={{
                    flex: 1,
                    background: 'var(--primary-pale)',
                    color: 'var(--primary)',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <Edit3 size={13} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddon(addon.id)}
                  style={{
                    flex: 1,
                    background: '#fef2f2',
                    color: '#ef4444',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAddons.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <Sparkles size={48} style={{ opacity: 0.3, marginBottom: '16px', margin: '0 auto 16px' }} />
          <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>No services found</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
            Create a new service or adjust your filters
          </p>
        </div>
      )}
    </div>
  );
}
