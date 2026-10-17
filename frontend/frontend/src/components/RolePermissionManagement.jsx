import React, { useState, useEffect } from 'react';
import {
  Shield, Check, X, Plus, Trash2, Edit3, Save, Users,
  BarChart3, Layout, Briefcase, Hotel, Star, Mail, MessageCircle,
  AlertCircle, CheckCircle, RefreshCw, UserPlus, Key, Info, ChevronRight, Lock
} from 'lucide-react';
import { api } from '../services/api';

const MODULE_DEFINITIONS = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    description: 'Executive revenue metrics, occupancy KPIs, total reservations, and recent stays summary.',
    category: 'Analytics',
    icon: BarChart3,
    color: '#3b82f6'
  },
  {
    id: 'frontpage',
    label: 'Front Page & Images',
    description: 'Hero carousel headlines, background banners, curated experiences, and live destination cards.',
    category: 'CMS',
    icon: Layout,
    color: '#8b5cf6'
  },
  {
    id: 'bookings',
    label: 'Bookings Management',
    description: 'Full reservation pipeline, status modification (Confirm / Cancel / Complete), and guest details.',
    category: 'Operations',
    icon: Briefcase,
    color: '#10b981'
  },
  {
    id: 'rooms',
    label: 'Rooms & Suites',
    description: 'Room inventory, nightly rates, suite capacity, amenities, and room catalogue deletion.',
    category: 'Inventory',
    icon: Hotel,
    color: '#f59e0b'
  },
  {
    id: 'users',
    label: 'Guest Accounts',
    description: 'Registered guest roster, membership tiers (Prestige, VIP), and customer contact directory.',
    category: 'Guests',
    icon: Users,
    color: '#ec4899'
  },
  {
    id: 'reviews',
    label: 'Guest Reviews',
    description: 'Customer ratings, guest feedback testimonials, and luxury stay review moderation.',
    category: 'Quality',
    icon: Star,
    color: '#eab308'
  },
  {
    id: 'newsletter',
    label: 'Newsletter Subscribers',
    description: 'Mailing list subscribers, subscriber growth timestamps, and promotional email reach.',
    category: 'Marketing',
    icon: Mail,
    color: '#06b6d4'
  },
  {
    id: 'chat',
    label: 'Customer Live Chat',
    description: 'Real-time two-way guest concierge communication, instant inquiries, and message unread badges.',
    category: 'Concierge',
    icon: MessageCircle,
    color: '#14b8a6'
  },
  {
    id: 'roles',
    label: 'Role & Permissions Hub',
    description: 'Define staff roles, grant/revoke module access, and manage hotel team accounts and permissions.',
    category: 'Administration',
    icon: Shield,
    color: '#6366f1'
  }
];

export default function RolePermissionManagement({ currentUser, onRolesUpdated }) {
  const [subTab, setSubTab] = useState('roles'); // 'roles' | 'staff'
  const [roles, setRoles] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingRoleId, setSavingRoleId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });

  // Modal states
  const [isNewRoleOpen, setIsNewRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleModules, setNewRoleModules] = useState(['overview']);

  const [isNewStaffOpen, setIsNewStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Receptionist');

  const showNotification = (text, type = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg({ text: '', type: '' }), 4500);
  };

  // Load roles & staff data
  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, staffData] = await Promise.allSettled([
        api.getRoles(),
        api.getStaffMembers()
      ]);

      if (rolesData.status === 'fulfilled' && Array.isArray(rolesData.value)) {
        setRoles(rolesData.value);
      }
      if (staffData.status === 'fulfilled' && Array.isArray(staffData.value)) {
        setStaff(staffData.value);
      }
    } catch (err) {
      console.warn('Error loading roles data:', err);
      showNotification('Failed to load role permissions from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toggle permission in local state for a specific role
  const handleToggleModule = (roleId, moduleId) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r;
      const current = r.allowedModules || [];
      const has = current.includes(moduleId);
      let updated;
      if (has) {
        // Prevent removing 'roles' from Manager role
        if (r.roleName.toLowerCase() === 'manager' && moduleId === 'roles') {
          return r;
        }
        updated = current.filter(m => m !== moduleId);
      } else {
        updated = [...current, moduleId];
      }
      return { ...r, allowedModules: updated };
    }));
  };

  // Select all modules for a role
  const handleSelectAllModules = (roleId) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r;
      return { ...r, allowedModules: MODULE_DEFINITIONS.map(m => m.id) };
    }));
  };

  // Clear all modules for a role
  const handleClearModules = (roleId) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r;
      // Manager must keep roles module
      if (r.roleName.toLowerCase() === 'manager') {
        return { ...r, allowedModules: ['roles'] };
      }
      return { ...r, allowedModules: ['overview'] };
    }));
  };

  // Save changes to a role
  const handleSaveRole = async (role) => {
    setSavingRoleId(role.id);
    try {
      await api.updateRole(role.id, {
        allowedModules: role.allowedModules,
        description: role.description
      });
      showNotification(`Permissions updated for role "${role.roleName}"! Staff in this role will see the updated modules.`, 'success');
      if (onRolesUpdated) onRolesUpdated();
    } catch (err) {
      showNotification(`Failed to save role: ${err.message}`, 'error');
    } finally {
      setSavingRoleId(null);
    }
  };

  // Create new role
  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      const created = await api.createRole({
        roleName: newRoleName.trim(),
        description: newRoleDesc.trim(),
        allowedModules: newRoleModules
      });
      setRoles(prev => [...prev, created]);
      setIsNewRoleOpen(false);
      setNewRoleName('');
      setNewRoleDesc('');
      setNewRoleModules(['overview']);
      showNotification(`New role "${created.roleName}" created with ${created.allowedModules?.length || 0} module permissions!`, 'success');
      if (onRolesUpdated) onRolesUpdated();
    } catch (err) {
      showNotification(err.message || 'Failed to create role', 'error');
    }
  };

  // Delete custom role
  const handleDeleteRole = async (role) => {
    if (role.isSystem) {
      alert('System roles cannot be deleted.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the role "${role.roleName}"? Any users assigned to this role will be downgraded to standard user.`)) {
      return;
    }

    try {
      await api.deleteRole(role.id);
      setRoles(prev => prev.filter(r => r.id !== role.id));
      showNotification(`Role "${role.roleName}" has been removed.`, 'info');
      loadData(); // reload staff counts
      if (onRolesUpdated) onRolesUpdated();
    } catch (err) {
      showNotification(err.message || 'Failed to delete role', 'error');
    }
  };

  // Change a staff member's role
  const handleAssignRole = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      setStaff(prev => prev.map(s => s.id === userId ? { ...s, role: newRole } : s));
      showNotification(`User role updated to "${newRole}".`, 'success');
      loadData(); // refresh counts
      if (onRolesUpdated) onRolesUpdated();
    } catch (err) {
      showNotification(err.message || 'Failed to update user role', 'error');
    }
  };

  // Create new staff member
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim() || !newStaffPassword.trim()) return;

    try {
      await api.createStaffMember({
        name: newStaffName.trim(),
        email: newStaffEmail.trim(),
        password: newStaffPassword.trim(),
        role: newStaffRole
      });
      setIsNewStaffOpen(false);
      setNewStaffName('');
      setNewStaffEmail('');
      setNewStaffPassword('');
      showNotification(`Staff account created for "${newStaffName}" with role "${newStaffRole}"!`, 'success');
      loadData();
    } catch (err) {
      showNotification(err.message || 'Failed to create staff account', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '10px' }} />
        <p style={{ fontWeight: 600 }}>Loading Roles & Permissions Hub...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        color: '#ffffff',
        marginBottom: '26px',
        boxShadow: '0 12px 30px rgba(49,46,129,0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Shield size={20} style={{ color: '#a5b4fc' }} />
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 800, color: '#c7d2fe' }}>
              Access Control & RBAC Engine
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', margin: 0, fontWeight: 700, color: '#ffffff' }}>
            Role & Permission Management
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: '0.88rem', color: '#e0e7ff', lineHeight: 1.6 }}>
            The manager configures which modules each role can access. Multiple staff members share the same dashboard, but only their authorized modules will appear.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsNewRoleOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '11px 18px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 700,
              background: '#ffffff', color: '#312e81', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <Plus size={16} /> Create New Role
          </button>
          <button
            onClick={() => setIsNewStaffOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '11px 18px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 700,
              background: 'rgba(255,255,255,0.18)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)',
              cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
          >
            <UserPlus size={16} /> Add Staff Member
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg.text && (
        <div style={{
          padding: '12px 18px', borderRadius: '10px', marginBottom: '22px',
          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 600,
          background: feedbackMsg.type === 'error' ? '#fef2f2' : '#ecfdf5',
          color: feedbackMsg.type === 'error' ? '#991b1b' : '#065f46',
          border: `1px solid ${feedbackMsg.type === 'error' ? '#fecaca' : '#a7f3d0'}`,
          animation: 'fadeIn 0.2s ease'
        }}>
          {feedbackMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Sub Tabs: Roles Matrix vs Staff Accounts */}
      <div style={{
        display: 'flex', gap: '8px', borderBottom: '2px solid var(--border)',
        marginBottom: '26px'
      }}>
        <button
          onClick={() => setSubTab('roles')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', background: 'none', border: 'none',
            fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
            color: subTab === 'roles' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: subTab === 'roles' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px', transition: 'all 0.2s ease'
          }}
        >
          <Shield size={17} /> Roles &amp; Module Permissions ({roles.length})
        </button>
        <button
          onClick={() => setSubTab('staff')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', background: 'none', border: 'none',
            fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
            color: subTab === 'staff' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: subTab === 'staff' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px', transition: 'all 0.2s ease'
          }}
        >
          <Users size={17} /> Staff Accounts &amp; Assignments ({staff.length})
        </button>
      </div>

      {/* ─── TAB 1: ROLES & MODULE PERMISSIONS ─── */}
      {subTab === 'roles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {roles.map(role => {
            const isManagerRole = role.roleName.toLowerCase() === 'manager' || role.roleName.toLowerCase() === 'admin';
            const allowedList = role.allowedModules || [];

            return (
              <div
                key={role.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: isManagerRole ? '2px solid #818cf8' : '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                {/* Role Header */}
                <div style={{
                  padding: '20px 24px',
                  background: isManagerRole
                    ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
                    : 'var(--bg-alt)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {role.roleName}
                      </h3>
                      {role.isSystem ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          background: '#e0e7ff', color: '#3730a3',
                          fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
                          letterSpacing: '0.08em', padding: '3px 9px', borderRadius: '20px'
                        }}>
                          <Lock size={10} /> System Executive
                        </span>
                      ) : (
                        <span style={{
                          background: '#fef3c7', color: '#92400e',
                          fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
                          letterSpacing: '0.08em', padding: '3px 9px', borderRadius: '20px'
                        }}>
                          Custom Role
                        </span>
                      )}
                      <span style={{
                        background: '#f1f5f9', color: '#475569',
                        fontSize: '0.74rem', fontWeight: 600, padding: '3px 10px', borderRadius: '20px'
                      }}>
                        {role.userCount || 0} Staff Assigned
                      </span>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      {role.description || 'Configured access profile for hotel staff members.'}
                    </p>
                  </div>

                  {/* Role Header Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectAllModules(role.id)}
                      style={{
                        padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                        background: '#ffffff', border: '1px solid var(--border)', color: 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClearModules(role.id)}
                      style={{
                        padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                        background: '#ffffff', border: '1px solid var(--border)', color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => handleSaveRole(role)}
                      disabled={savingRoleId === role.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700,
                        background: 'var(--primary)', color: '#ffffff', border: 'none',
                        cursor: savingRoleId === role.id ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 8px rgba(15,32,68,0.2)'
                      }}
                    >
                      {savingRoleId === role.id ? (
                        <>
                          <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={14} /> Save Permissions
                        </>
                      )}
                    </button>
                    {!role.isSystem && (
                      <button
                        onClick={() => handleDeleteRole(role)}
                        title="Delete Role"
                        style={{
                          padding: '8px', borderRadius: '8px', background: '#fee2e2',
                          color: '#dc2626', border: 'none', cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Module Permission Checkboxes */}
                <div style={{ padding: '22px 24px' }}>
                  <div style={{
                    fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '14px'
                  }}>
                    Module Permissions ({allowedList.length} of {MODULE_DEFINITIONS.length} enabled)
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '12px'
                  }}>
                    {MODULE_DEFINITIONS.map(mod => {
                      const isChecked = allowedList.includes(mod.id);
                      const isLockedManager = isManagerRole && mod.id === 'roles';
                      const Icon = mod.icon;

                      return (
                        <div
                          key={mod.id}
                          onClick={() => {
                            if (!isLockedManager) handleToggleModule(role.id, mod.id);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            border: `1.5px solid ${isChecked ? 'var(--primary-light)' : 'var(--border)'}`,
                            background: isChecked ? 'rgba(88,28,135,0.04)' : '#fafafa',
                            cursor: isLockedManager ? 'default' : 'pointer',
                            transition: 'all 0.15s ease',
                            userSelect: 'none'
                          }}
                        >
                          {/* Checkbox box */}
                          <div style={{
                            width: '20px', height: '20px', borderRadius: '5px',
                            border: isChecked ? 'none' : '2px solid #cbd5e1',
                            background: isChecked ? 'var(--primary)' : '#ffffff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, marginTop: '2px',
                            boxShadow: isChecked ? '0 2px 6px rgba(15,32,68,0.2)' : 'none'
                          }}>
                            {isChecked && <Check size={14} color="#ffffff" strokeWidth={3} />}
                          </div>

                          {/* Icon & Details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                              <Icon size={15} style={{ color: mod.color, flexShrink: 0 }} />
                              <span style={{ fontWeight: 700, fontSize: '0.86rem', color: isChecked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                {mod.label}
                              </span>
                              {isLockedManager && (
                                <span title="Manager must always retain roles permission" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                  (Required)
                                </span>
                              )}
                            </div>
                            <p style={{
                              margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)',
                              lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                            }}>
                              {mod.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB 2: STAFF ACCOUNTS & ASSIGNMENTS ─── */}
      {subTab === 'staff' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Active Hotel Staff Directory
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Assign any role to staff members. The dashboard will instantly adjust module permissions for each user.
              </p>
            </div>
            <button
              onClick={() => setIsNewStaffOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700,
                background: 'var(--primary)', color: '#ffffff', border: 'none', cursor: 'pointer'
              }}
            >
              <UserPlus size={15} /> Add Staff Account
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Staff Member</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Assigned Role</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Modules Accessible</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Registered</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(user => {
                  const roleObj = roles.find(r => r.roleName.toLowerCase() === (user.role || '').toLowerCase());
                  const moduleCount = roleObj ? (roleObj.allowedModules || []).length : (user.role?.toLowerCase() === 'manager' ? 9 : 1);

                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 100%)',
                            color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.86rem', flexShrink: 0
                          }}>
                            {(user.name || 'S').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <select
                          value={user.role || 'Staff'}
                          onChange={e => handleAssignRole(user.id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid var(--border)',
                            background: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          {roles.map(r => (
                            <option key={r.id} value={r.roleName}>
                              {r.roleName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          background: '#f1f5f9', color: 'var(--text-main)',
                          padding: '4px 10px', borderRadius: '20px',
                          fontSize: '0.76rem', fontWeight: 700
                        }}>
                          <Shield size={12} color="var(--primary)" />
                          {moduleCount} Modules
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.75rem', color: '#059669', fontWeight: 600,
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          <CheckCircle size={13} /> Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {staff.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Users size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontWeight: 600 }}>No staff members registered yet.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── MODAL: CREATE NEW ROLE ─── */}
      {isNewRoleOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '580px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--bg-alt)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Create New Staff Role
                </h3>
              </div>
              <button
                onClick={() => setIsNewRoleOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRole} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '6px' }}>
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Night Concierge, Finance Lead, Housekeeper"
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '6px' }}>
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Describe the responsibilities and scope of this role..."
                  value={newRoleDesc}
                  onChange={e => setNewRoleDesc(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>

              {/* Module selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '10px' }}>
                  Select Initial Module Permissions
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {MODULE_DEFINITIONS.map(mod => {
                    const isChecked = newRoleModules.includes(mod.id);
                    const Icon = mod.icon;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => {
                          setNewRoleModules(prev =>
                            prev.includes(mod.id)
                              ? prev.filter(m => m !== mod.id)
                              : [...prev, mod.id]
                          );
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 12px', borderRadius: '8px',
                          border: `1.5px solid ${isChecked ? 'var(--primary)' : 'var(--border)'}`,
                          background: isChecked ? 'rgba(88,28,135,0.05)' : '#ffffff',
                          cursor: 'pointer', userSelect: 'none'
                        }}
                      >
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '4px',
                          border: isChecked ? 'none' : '2px solid #cbd5e1',
                          background: isChecked ? 'var(--primary)' : '#ffffff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isChecked && <Check size={12} color="#ffffff" strokeWidth={3} />}
                        </div>
                        <Icon size={14} style={{ color: mod.color }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{mod.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewRoleOpen(false)}
                  style={{
                    padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)',
                    background: '#ffffff', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px', borderRadius: '8px', border: 'none',
                    background: 'var(--primary)', color: '#ffffff', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE STAFF ACCOUNT ─── */}
      {isNewStaffOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '480px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--bg-alt)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserPlus size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Add Hotel Staff Member
                </h3>
              </div>
              <button
                onClick={() => setIsNewStaffOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="tariq@luxehaven.com"
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '6px' }}>
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newStaffPassword}
                  onChange={e => setNewStaffPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '6px' }}>
                  Assign Role *
                </label>
                <select
                  value={newStaffRole}
                  onChange={e => setNewStaffRole(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none',
                    fontWeight: 600, background: '#ffffff'
                  }}
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.roleName}>
                      {r.roleName} ({(r.allowedModules || []).length} modules)
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewStaffOpen(false)}
                  style={{
                    padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)',
                    background: '#ffffff', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px', borderRadius: '8px', border: 'none',
                    background: 'var(--primary)', color: '#ffffff', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
