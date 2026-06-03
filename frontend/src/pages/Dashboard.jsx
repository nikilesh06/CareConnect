import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  Users, FileText, Check, Settings as SettingsIcon, 
  Clock, Calendar, Shield, CreditCard, Award, Eye, 
  Plus, CheckCircle, Search, FileDown, LogOut, ArrowRight, Activity,
  Bell, Lock, RefreshCw, XCircle, ChevronRight, User as UserIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

// Helper function to check if appointment is within 24 hours (or past)
const isPastOrUnder24h = (dateStr, timeStr) => {
  const apptTime = new Date(dateStr);
  const [hours, minutes] = timeStr.split(':');
  apptTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  const diffHrs = (apptTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
  return diffHrs <= 24;
};

// ==========================================
// NOTIFICATION BELL COMPONENT
// ==========================================
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await axios.put('/api/notifications/read');
      fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)} 
        className="btn btn-secondary" 
        style={{ padding: '10px', position: 'relative', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px' }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', top: '-2px', right: '-2px', backgroundColor: 'var(--danger)', 
            color: 'white', fontSize: '0.65rem', fontWeight: 'bold', width: '18px', height: '18px', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 2px var(--background)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="card" style={{ 
          position: 'absolute', top: '50px', right: '0', width: '340px', 
          zIndex: '150', padding: '16px', maxHeight: '420px', overflowY: 'auto',
          animation: 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <h4 style={{ margin: '0', fontSize: '0.95rem', fontWeight: '700' }}>Platform Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>No notifications yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map(n => (
                <div key={n._id} style={{ 
                  padding: '10px 12px', borderRadius: '10px', fontSize: '0.8rem', 
                  borderLeft: `4px solid ${n.isRead ? 'var(--border)' : 'var(--primary)'}`,
                  backgroundColor: n.isRead ? 'transparent' : 'rgba(79, 70, 229, 0.03)',
                  transition: 'all 0.2s'
                }}>
                  <p style={{ margin: '0 0 6px', color: 'var(--text-main)', fontWeight: n.isRead ? 'normal' : '600', lineHeight: '1.4' }}>{n.message}</p>
                  <small className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ totalUsers: 0, totalDoctors: 0, totalAppointments: 0, totalCommission: 0 });
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [settings, setSettings] = useState({ adminCommissionPercentage: 10, appName: '' });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingDoctors = async () => {
    try {
      const res = await axios.get('/api/admin/doctors/pending');
      setPendingDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const res = await axios.get('/api/admin/doctors');
      setAllDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllPatients = async () => {
    try {
      const res = await axios.get('/api/admin/patients');
      setAllPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/admin/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'queue') fetchPendingDoctors();
    if (activeTab === 'doctors') fetchAllDoctors();
    if (activeTab === 'patients') fetchAllPatients();
    if (activeTab === 'settings') fetchSettings();
  }, [activeTab]);

  const approveDoctor = async (id) => {
    try {
      setLoading(true);
      await axios.put(`/api/admin/doctors/${id}/approve`);
      toast.success('Doctor successfully approved!');
      fetchPendingDoctors();
    } catch (err) {
      console.error(err);
      toast.error('Failed to approve doctor');
    } finally {
      setLoading(false);
    }
  };

  const removeDoctor = async (id) => {
    if (!window.confirm("WARNING: Are you sure you want to permanently deactivate and remove this doctor? This will cancel all their upcoming appointments. This action cannot be undone.")) return;
    try {
      setLoading(true);
      await axios.delete(`/api/admin/doctors/${id}`);
      toast.success('Doctor successfully removed from platform!');
      fetchAllDoctors();
      fetchPendingDoctors();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('/api/admin/settings', settings);
      toast.success('Application settings updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="tab-menu" style={{ display: 'inline-flex', gap: '8px', marginBottom: '32px' }}>
        <button onClick={() => setActiveTab('stats')} className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <Activity size={16} style={{ marginRight: '8px' }} /> Overview
        </button>
        <button onClick={() => setActiveTab('queue')} className={`btn ${activeTab === 'queue' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <Shield size={16} style={{ marginRight: '8px' }} /> Approvals ({pendingDoctors.length})
        </button>
        <button onClick={() => setActiveTab('doctors')} className={`btn ${activeTab === 'doctors' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <Award size={16} style={{ marginRight: '8px' }} /> Physicians Directory
        </button>
        <button onClick={() => setActiveTab('patients')} className={`btn ${activeTab === 'patients' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <Users size={16} style={{ marginRight: '8px' }} /> Patients Directory
        </button>
        <button onClick={() => setActiveTab('settings')} className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <SettingsIcon size={16} style={{ marginRight: '8px' }} /> System Config
        </button>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-4" style={{ gap: '24px' }}>
          <div className="card text-center" style={{ padding: '32px 24px', borderLeft: '5px solid var(--primary)', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Users size={20} />
            </div>
            <h4 className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Patients</h4>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>{stats.totalUsers}</h2>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '6px' }}>Registered site users</p>
          </div>
          <div className="card text-center" style={{ padding: '32px 24px', borderLeft: '5px solid var(--secondary)', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Award size={20} />
            </div>
            <h4 className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Doctors</h4>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>{stats.totalDoctors}</h2>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '6px' }}>Approved medical practitioners</p>
          </div>
          <div className="card text-center" style={{ padding: '32px 24px', borderLeft: '5px solid #F59E0B', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.08)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Calendar size={20} />
            </div>
            <h4 className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Appointments</h4>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>{stats.totalAppointments}</h2>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '6px' }}>Consultations booked</p>
          </div>
          <div className="card text-center" style={{ padding: '32px 24px', borderLeft: '5px solid #10B981', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10B981', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CreditCard size={20} />
            </div>
            <h4 className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commissions</h4>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '6px', color: 'var(--secondary)' }}>₹{stats.totalCommission.toFixed(2)}</h2>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '6px' }}>Platform profit split</p>
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px' }}>Doctor Verification Queue</h3>
          {pendingDoctors.length === 0 ? (
            <p className="text-muted" style={{ padding: '16px 0' }}>No pending doctor approvals at the moment.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Email Address</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Fee Rate</th>
                    <th>Credentials</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDoctors.map(doc => (
                    <tr key={doc._id}>
                      <td style={{ fontWeight: '600' }}>{doc.userId?.name}</td>
                      <td>{doc.userId?.email}</td>
                      <td>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>
                          {doc.specialization}
                        </span>
                      </td>
                      <td>{doc.experience} years</td>
                      <td style={{ fontWeight: '700' }}>₹{doc.fee}</td>
                      <td>
                        {doc.certificateFile ? (
                          <a href={`/${doc.certificateFile}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FileText size={14} /> View PDF
                          </a>
                        ) : <span className="text-muted">None Provided</span>}
                      </td>
                      <td>
                        <button disabled={loading} onClick={() => approveDoctor(doc._id)} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}>
                          <Check size={14} style={{ marginRight: '4px' }} /> Verify & Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card" style={{ maxWidth: '520px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>Configure Application Settings</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Set branding parameters and fee split configurations.</p>
          <form onSubmit={handleSettingsSubmit}>
            <div className="form-group">
              <label className="form-label">Application Branding Name</label>
              <input type="text" className="form-control" value={settings.appName} onChange={e => setSettings({ ...settings, appName: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label">Platform Split Commission (%)</label>
              <input type="number" className="form-control" min="0" max="100" value={settings.adminCommissionPercentage} onChange={e => setSettings({ ...settings, adminCommissionPercentage: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ padding: '12px' }}>
              {loading ? 'Saving Parameters...' : 'Save System Settings'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>Registered Physicians Directory</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>All approved and pending medical practitioners on CareConnect.</p>
          {allDoctors.length === 0 ? (
            <p className="text-muted" style={{ padding: '16px 0' }}>No registered doctors found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Fee Rate</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allDoctors.map(doc => (
                    <tr key={doc._id}>
                      <td style={{ fontWeight: '600' }}>{doc.userId?.name || 'Unknown'}</td>
                      <td>{doc.userId?.email || 'N/A'}</td>
                      <td>{doc.userId?.phone || 'N/A'}</td>
                      <td>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>
                          {doc.specialization}
                        </span>
                      </td>
                      <td>{doc.experience} years</td>
                      <td style={{ fontWeight: '700' }}>₹{doc.fee}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase',
                          backgroundColor: doc.isApproved ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                          color: doc.isApproved ? 'var(--secondary)' : '#F59E0B'
                        }}>
                          {doc.isApproved ? 'Approved' : 'Pending Verification'}
                        </span>
                      </td>
                      <td>
                        <button
                          disabled={loading}
                          onClick={() => removeDoctor(doc._id)}
                          className="btn btn-secondary"
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            borderRadius: '8px',
                            color: 'var(--danger)',
                            borderColor: 'rgba(239, 68, 68, 0.2)',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <XCircle size={12} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'patients' && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>Registered Patients Directory</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>All registered users utilizing the consultation and booking system.</p>
          {allPatients.length === 0 ? (
            <p className="text-muted" style={{ padding: '16px 0' }}>No registered patients found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allPatients.map(pat => (
                    <tr key={pat._id}>
                      <td style={{ fontWeight: '600' }}>{pat.name}</td>
                      <td>{pat.email}</td>
                      <td>{pat.phone || 'None Provided'}</td>
                      <td>{new Date(pat.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// DOCTOR DASHBOARD
// ==========================================
const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [profile, setProfile] = useState({ specialization: '', experience: '', fee: 0 });
  const [isApproved, setIsApproved] = useState(null); // null = still loading
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [prescription, setPrescription] = useState('');
  const [activeApptId, setActiveApptId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/doctor/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await axios.get('/api/doctor/slots');
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.profile) {
        setIsApproved(res.data.profile.isApproved);
        setProfile({
          specialization: res.data.profile.specialization || '',
          experience: res.data.profile.experience || 0,
          fee: res.data.profile.fee || 0
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile(); // Always fetch profile on mount to check approval status
    if (activeTab === 'appointments') fetchAppointments();
    if (activeTab === 'slots') fetchSlots();
  }, [activeTab]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('/api/doctor/profile', profile);
      toast.success('Practice profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/doctor/slots', newSlot);
      toast.success('Availability slot added!');
      setNewSlot({ date: '', startTime: '', endTime: '' });
      fetchSlots();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to schedule availability slot');
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`/api/doctor/appointments/${activeApptId}/prescription`, { prescription });
      toast.success('Prescription issued & session marked complete!');
      setActiveApptId(null);
      setPrescription('');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error('Failed to record prescription');
    } finally {
      setLoading(false);
    }
  };

  // Show pending banner if doctor is not yet approved
  if (isApproved === false) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="card" style={{
          maxWidth: '560px',
          width: '100%',
          padding: '48px 40px',
          textAlign: 'center',
          borderTop: '5px solid #F59E0B',
          animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          {/* Animated clock icon */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            border: '2px solid rgba(245, 158, 11, 0.2)'
          }}>
            <Clock size={32} color="#F59E0B" />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>
            Verification In Progress
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '28px' }}>
            Your medical credentials and registration certificate are currently under review by the <strong>CareConnect Admin Team</strong>.
            You will gain full platform access once your profile is verified and approved.
          </p>

          {/* Status steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <CheckCircle size={18} color="var(--secondary)" />
              <div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.85rem' }}>Registration Submitted</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your profile has been received.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <Clock size={18} color="#F59E0B" />
              <div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.85rem' }}>Admin Review — In Progress</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Credentials and certificate are being verified.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(15, 23, 42, 0.03)', border: '1px solid var(--border)' }}>
              <Lock size={18} color="var(--text-muted)" />
              <div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Platform Access Unlocked</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending approval — you will be notified.</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderRadius: '10px', backgroundColor: 'rgba(79, 70, 229, 0.05)', border: '1px solid rgba(79, 70, 229, 0.12)' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
              ⏱️ Average verification time is 24–48 hours. Please check back soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tab-menu" style={{ display: 'inline-flex', gap: '8px', marginBottom: '32px' }}>
        <button onClick={() => setActiveTab('appointments')} className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <Calendar size={16} style={{ marginRight: '8px' }} /> Consultations ({appointments.length})
        </button>
        <button onClick={() => setActiveTab('slots')} className={`btn ${activeTab === 'slots' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <Clock size={16} style={{ marginRight: '8px' }} /> Practice Hours
        </button>
        <button onClick={() => setActiveTab('profile')} className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <Users size={16} style={{ marginRight: '8px' }} /> Practice Settings
        </button>
      </div>

      {activeTab === 'appointments' && (
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px' }}>Consultation Schedules</h3>
          {appointments.length === 0 ? (
            <p className="text-muted" style={{ padding: '16px 0' }}>No consultations booked yet.</p>
          ) : (
            <div className="grid grid-cols-2" style={{ gap: '20px' }}>
              {appointments.map(appt => (
                <div key={appt._id} className="card" style={{ 
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  borderLeft: `5px solid ${appt.status === 'completed' ? 'var(--secondary)' : appt.status === 'cancelled' ? 'var(--danger)' : 'var(--primary)'}`
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>{appt.userId?.name}</h4>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>📞 {appt.userId?.phone || appt.userId?.email}</span>
                      </div>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase',
                        backgroundColor: appt.status === 'completed' ? 'rgba(16, 185, 129, 0.08)' : 
                                         appt.status === 'cancelled' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(79, 70, 229, 0.08)',
                        color: appt.status === 'completed' ? 'var(--secondary)' : 
                               appt.status === 'cancelled' ? 'var(--danger)' : 'var(--primary)'
                      }}>
                        {appt.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', backgroundColor: 'rgba(15,23,42,0.02)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Calendar size={14} color="var(--primary)" />
                        <span>{new Date(appt.date).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Clock size={14} color="var(--primary)" />
                        <span>{appt.slotStartTime} - {appt.slotEndTime}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Consultation Fee</span>
                      <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', margin: 0 }}>₹{appt.doctorFee}</h4>
                    </div>
                    <div>
                      {appt.status === 'completed' && (
                        <div style={{ fontSize: '0.8rem', padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(15,23,42,0.04)', maxWidth: '200px' }}>
                          <strong>Rx:</strong> "{appt.prescription}"
                        </div>
                      )}
                      {appt.status === 'cancelled' && (
                        <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: '600' }}>Session Cancelled</span>
                      )}
                      {appt.status === 'scheduled' && (
                        <button onClick={() => setActiveApptId(appt._id)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }}>
                          <FileText size={14} style={{ marginRight: '6px' }} /> Issue Rx & Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeApptId && (
            <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '200' }}>
              <div className="card" style={{ width: '460px', padding: '32px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>Issue Medical Prescription</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Provide prescriptions and guidelines to complete the session.</p>
                <form onSubmit={handlePrescriptionSubmit}>
                  <div className="form-group">
                    <label className="form-label">Diagnosis & Prescriptions</label>
                    <textarea className="form-control" rows="4" placeholder="Enter medicines, dosages, and follow-up consultation schedules..." value={prescription} onChange={e => setPrescription(e.target.value)} required style={{ resize: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: '1', padding: '10px' }}>Submit Prescription</button>
                    <button type="button" onClick={() => setActiveApptId(null)} className="btn btn-secondary" style={{ padding: '10px' }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="grid grid-cols-2" style={{ gap: '32px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px' }}>Schedule Availability</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Open up calendar hours for patient scheduling.</p>
            <form onSubmit={handleAddSlot}>
              <div className="form-group">
                <label className="form-label">Calendar Date</label>
                <input type="date" className="form-control" value={newSlot.date} onChange={e => setNewSlot({ ...newSlot, date: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input type="time" className="form-control" value={newSlot.startTime} onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input type="time" className="form-control" value={newSlot.endTime} onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })} required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ padding: '12px', marginTop: '8px' }}>Open Availability Slot</button>
            </form>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px' }}>Configured Availability Hours</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Your current scheduled consultation hours.</p>
            {slots.length === 0 ? (
              <p className="text-muted" style={{ padding: '16px 0' }}>No availability slots scheduled yet.</p>
            ) : (
              <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {slots.map((slot, index) => (
                  <div key={slot._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>{new Date(slot.date).toLocaleDateString()}</strong>
                      <span className="text-muted" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Clock size={12} /> {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700',
                      backgroundColor: slot.isBooked ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                      color: slot.isBooked ? 'var(--danger)' : 'var(--secondary)'
                    }}>
                      {slot.isBooked ? 'Reserved' : 'Vacant'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: '520px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px' }}>Manage Practice Profile</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Configure consultation fees, credentials, and practice information.</p>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Medical Specialization</label>
              <input type="text" className="form-control" placeholder="e.g. Cardiologist, Dermatologist" value={profile.specialization} onChange={e => setProfile({ ...profile, specialization: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input type="number" className="form-control" min="0" value={profile.experience} onChange={e => setProfile({ ...profile, experience: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label">Baseline Consultation Fee (₹)</label>
              <input type="number" className="form-control" min="0" value={profile.fee} onChange={e => setProfile({ ...profile, fee: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ padding: '12px' }}>Update Profile Settings</button>
          </form>
        </div>
      )}
    </div>
  );
};

// ==========================================
// USER DASHBOARD
// ==========================================
const SYMPTOM_MAP = {
  // Cardiologist
  'Chest Pain / Palpitations 🫀': 'Cardiologist',
  'High Blood Pressure 📈': 'Cardiologist',
  'Shortness of Breath 🫁': 'Cardiologist',
  'Irregular Heartbeat 💓': 'Cardiologist',

  // Dermatologist
  'Skin Rash / Acne 🧴': 'Dermatologist',
  'Eczema / Itchy Skin 🧬': 'Dermatologist',
  'Hair Loss / Dandruff 💇': 'Dermatologist',
  'Dry Skin / Psoriasis 🩹': 'Dermatologist',

  // Neurologist
  'Severe Headaches / Migraines 🧠': 'Neurologist',
  'Dizziness / Numbness 🌀': 'Neurologist',
  'Memory Loss / Confusion 💭': 'Neurologist',
  'Chronic Sleep Issues 😴': 'Neurologist',

  // Surgeon
  'Severe Abdominal Pain 🔪': 'Surgeon',
  'Hernia / Swelling 🩺': 'Surgeon',
  'Gallstones / Appendicitis 🧫': 'Surgeon',
  'Joint Pain / Bone Fracture 🦴': 'Surgeon',

  // Pediatrician
  'Fever / Cold (Childhood) 👶': 'Pediatrician',
  'Infant Vaccination / Cough 🍼': 'Pediatrician',
  'Childhood Allergies 🤧': 'Pediatrician',
  'Growth & Nutrition Query 📊': 'Pediatrician',

  // Ophthalmologist
  'Blurry Vision / Eye Pain 👁️': 'Ophthalmologist',
  'Red / Dry Eyes 💧': 'Ophthalmologist',
  'Double Vision / Glare 👓': 'Ophthalmologist',
  'Watery / Itchy Eyes 👀': 'Ophthalmologist'
};

const SYMPTOM_CATEGORIES = {
  'All Symptoms': 'all',
  '🫀 Cardiology': 'Cardiologist',
  '🧴 Dermatology': 'Dermatologist',
  '🧠 Neurology': 'Neurologist',
  '🩹 Surgery': 'Surgeon',
  '👶 Pediatrics': 'Pediatrician',
  '👁️ Ophthalmology': 'Ophthalmologist'
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('book');
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [activeSymptomCat, setActiveSymptomCat] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [userAppts, setUserAppts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/api/user/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserAppointments = async () => {
    try {
      const res = await axios.get('/api/user/appointments');
      setUserAppts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'book') fetchDoctors();
    if (activeTab === 'my-appts') fetchUserAppointments();
  }, [activeTab]);

  const handleSelectDoctor = async (doc) => {
    try {
      setSelectedDoc(doc);
      const res = await axios.get(`/api/user/doctors/${doc._id}/slots`);
      setAvailableSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookSlot = async (slot) => {
    try {
      setLoading(true);
      await axios.post('/api/user/appointments', {
        doctorId: selectedDoc._id,
        slotId: slot._id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      });
      toast.success('Appointment booked successfully!');
      setSelectedDoc(null);
      setAvailableSlots([]);
      fetchDoctors();
    } catch (err) {
      console.error(err);
      toast.error('Failed to book slot');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      setLoading(true);
      await axios.put(`/api/user/appointments/${apptId}/cancel`);
      toast.success('Appointment cancelled successfully.');
      fetchUserAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleAppointment = async (apptId) => {
    if (!window.confirm("Confirm rescheduling this appointment to the next available future slot?")) return;
    try {
      setLoading(true);
      await axios.put(`/api/user/appointments/${apptId}/reschedule`);
      toast.success('Appointment rescheduled successfully to the next available slot!');
      fetchUserAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reschedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    if (selectedSymptom) {
      const mapped = SYMPTOM_MAP[selectedSymptom];
      const specialties = Array.isArray(mapped)
        ? mapped.map(s => s.toLowerCase())
        : [mapped.toLowerCase()];
      if (!specialties.includes(doc.specialization.toLowerCase())) {
        return false;
      }
    }
    return (
      doc.userId?.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <div className="tab-menu" style={{ display: 'inline-flex', gap: '8px', marginBottom: '32px' }}>
        <button onClick={() => setActiveTab('book')} className={`btn ${activeTab === 'book' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <Search size={16} style={{ marginRight: '8px' }} /> Find Specialist
        </button>
        <button onClick={() => setActiveTab('my-appts')} className={`btn ${activeTab === 'my-appts' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <Clock size={16} style={{ marginRight: '8px' }} /> My Bookings ({userAppts.length})
        </button>
        <button onClick={() => setActiveTab('rx')} className={`btn ${activeTab === 'rx' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '10px' }}>
          <FileText size={16} style={{ marginRight: '8px' }} /> Medicine Cabinet 💊
        </button>
      </div>

      {activeTab === 'book' && (
        <div>
          <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
            <h4 className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Filter Symptoms by Area:
            </h4>
            
            {/* Category Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              {Object.entries(SYMPTOM_CATEGORIES).map(([label, value]) => {
                const isCatActive = activeSymptomCat === value;
                return (
                  <button
                    key={value}
                    onClick={() => {
                      setActiveSymptomCat(value);
                      setSelectedSymptom(null); // Clear selected symptom when switching categories for clean user flow
                    }}
                    className="btn"
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      borderRadius: '8px',
                      background: isCatActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                      color: isCatActive ? 'var(--primary)' : 'var(--text-muted)',
                      border: 'none',
                      fontWeight: isCatActive ? '700' : '500',
                      transition: 'all 0.15s ease',
                      cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <h4 className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Select specific symptom to instantly auto-match doctors:
            </h4>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {Object.keys(SYMPTOM_MAP)
                .filter(symptom => activeSymptomCat === 'all' || SYMPTOM_MAP[symptom] === activeSymptomCat)
                .map(symptom => {
                  const isSelected = selectedSymptom === symptom;
                  return (
                    <button
                      key={symptom}
                      onClick={() => setSelectedSymptom(isSelected ? null : symptom)}
                      className="btn"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.8rem',
                        borderRadius: '30px',
                        background: isSelected ? 'linear-gradient(135deg, var(--primary) 0%, #4338CA 100%)' : 'white',
                        color: isSelected ? 'white' : 'var(--text-main)',
                        border: isSelected ? 'none' : '1px solid var(--border)',
                        boxShadow: isSelected ? '0 4px 10px rgba(79, 70, 229, 0.2)' : 'var(--shadow-sm)',
                        transform: isSelected ? 'scale(1.03)' : 'none',
                        transition: 'all 0.2s ease',
                        fontWeight: '600'
                      }}
                    >
                      {symptom}
                    </button>
                  );
                })}
              {selectedSymptom && (
                <button
                  onClick={() => setSelectedSymptom(null)}
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    borderRadius: '30px',
                    color: 'var(--danger)',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    fontWeight: '600'
                  }}
                >
                  Clear filter ✕
                </button>
              )}
            </div>

            <div className="form-group" style={{ maxWidth: '440px', display: 'flex', gap: '8px', marginBottom: 0 }}>
              <input type="text" className="form-control" placeholder="Or search by Doctor Name / Speciality..." value={search} onChange={e => setSearch(e.target.value)} style={{ borderRadius: '10px' }} />
            </div>
          </div>

          <div className="grid grid-cols-3" style={{ gap: '24px' }}>
            {filteredDoctors.length === 0 ? (
              <p className="text-muted">No doctors found matching that search.</p>
            ) : (
              filteredDoctors.map(doc => {
                const getAvatarGradient = (spec) => {
                  switch(spec.toLowerCase()) {
                    case 'cardiologist': return 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)';
                    case 'dermatologist': return 'linear-gradient(135deg, #10B981 0%, #047857 100%)';
                    case 'neurologist': return 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)';
                    case 'surgeon': return 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
                    case 'pediatrician': return 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)';
                    default: return 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)';
                  }
                };
                const cleanName = doc.userId?.name.replace(/^Dr\.\s+/i, '') || '';
                const initial = cleanName.charAt(0).toUpperCase();

                return (
                  <div key={doc._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                        <div style={{ 
                          width: '48px', height: '48px', borderRadius: '50%', 
                          background: getAvatarGradient(doc.specialization), color: 'white', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontWeight: '700', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                          {initial}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-main)', fontWeight: '700' }}>Dr. {cleanName}</h3>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', fontWeight: '700' }}>
                            {doc.specialization}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>👨‍⚕️ {doc.experience} Years Active Practice</p>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '12px' }}>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Consultation Fee</span>
                        <h4 style={{ color: 'var(--secondary)', fontSize: '1.25rem', marginTop: '2px', fontWeight: '800' }}>₹{doc.fee}</h4>
                      </div>
                    </div>
                    <button onClick={() => handleSelectDoctor(doc)} className="btn btn-primary btn-block" style={{ marginTop: '20px', borderRadius: '10px' }}>
                      View Free Slots <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {selectedDoc && (
            <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '200' }}>
              <div className="card" style={{ width: '450px', maxHeight: '80vh', overflowY: 'auto', position: 'relative', padding: '32px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px' }}>Dr. {selectedDoc.userId?.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Select an open calendar slot to book:</p>

                {availableSlots.length === 0 ? (
                  <p className="text-muted" style={{ padding: '16px 0', textAlign: 'center' }}>No availability scheduled right now.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {availableSlots.map(slot => (
                      <button key={slot._id} disabled={loading} onClick={() => handleBookSlot(slot)} className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', width: '100%', textAlign: 'left', borderRadius: '12px' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem' }}>{new Date(slot.date).toLocaleDateString()}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>Book Now</span>
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={() => { setSelectedDoc(null); setAvailableSlots([]); }} className="btn btn-danger btn-block" style={{ padding: '10px' }}>Close Window</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'my-appts' && (
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px' }}>My Scheduled Consultations</h3>
          {userAppts.length === 0 ? (
            <p className="text-muted" style={{ padding: '16px 0' }}>You haven't scheduled any consultations yet.</p>
          ) : (
            <div className="grid grid-cols-2" style={{ gap: '24px' }}>
              {userAppts.map(appt => {
                const isLocked = appt.status !== 'scheduled' || isPastOrUnder24h(appt.date, appt.slotStartTime);
                return (
                  <div key={appt._id} className="card" style={{ 
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    borderLeft: `5px solid ${appt.status === 'completed' ? 'var(--secondary)' : appt.status === 'cancelled' ? 'var(--danger)' : 'var(--primary)'}`
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>Dr. {appt.doctorId?.userId?.name}</h4>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', fontWeight: '700', marginTop: '4px', display: 'inline-block' }}>
                            {appt.doctorId?.specialization}
                          </span>
                        </div>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase',
                          backgroundColor: appt.status === 'completed' ? 'rgba(16, 185, 129, 0.08)' : 
                                           appt.status === 'cancelled' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(79, 70, 229, 0.08)',
                          color: appt.status === 'completed' ? 'var(--secondary)' : 
                                 appt.status === 'cancelled' ? 'var(--danger)' : 'var(--primary)'
                        }}>
                          {appt.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', backgroundColor: 'rgba(15,23,42,0.02)', padding: '12px', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                          <Calendar size={14} color="var(--primary)" />
                          <span>{new Date(appt.date).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                          <Clock size={14} color="var(--primary)" />
                          <span>{appt.slotStartTime} - {appt.slotEndTime}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Total Amount Billed</span>
                          <h4 style={{ color: 'var(--secondary)', fontSize: '1.2rem', margin: 0, fontWeight: '800' }}>
                            ₹{appt.totalAmount}
                          </h4>
                          <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                            (₹{appt.doctorFee} fee + ₹{appt.adminCommission} platform split)
                          </span>
                        </div>
                        <div>
                          {appt.status === 'completed' ? (
                            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid rgba(16,185,129,0.1)', maxWidth: '240px' }}>
                              <strong>Rx Prescribed:</strong> "{appt.prescription}"
                            </div>
                          ) : appt.status === 'cancelled' ? (
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Session closed</span>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle size={14} color="var(--primary)" /> Confirmed appointment
                            </span>
                          )}
                        </div>
                      </div>

                      {appt.status === 'scheduled' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            disabled={isLocked || loading} 
                            onClick={() => handleRescheduleAppointment(appt._id)} 
                            className="btn btn-secondary" 
                            style={{ flex: '1', padding: '8px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '8px' }}
                            title={isLocked ? "Locked (Under 24 hour limit)" : "Reschedule to next available slot"}
                          >
                            {isLocked ? <Lock size={12} /> : <RefreshCw size={12} />} Reschedule
                          </button>
                          <button 
                            disabled={isLocked || loading} 
                            onClick={() => handleCancelAppointment(appt._id)} 
                            className="btn btn-danger" 
                            style={{ flex: '1', padding: '8px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '8px' }}
                            title={isLocked ? "Locked (Under 24 hour limit)" : "Cancel consultation"}
                          >
                            {isLocked ? <Lock size={12} /> : <XCircle size={12} />} Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'rx' && (
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px' }}>My Active Prescriptions & Medications</h3>
          {userAppts.filter(appt => appt.status === 'completed' && appt.prescription).length === 0 ? (
            <p className="text-muted" style={{ padding: '16px 0' }}>No medicines or active prescriptions recorded yet.</p>
          ) : (
            <div className="grid grid-cols-2" style={{ gap: '24px' }}>
              {userAppts.filter(appt => appt.status === 'completed' && appt.prescription).map(appt => (
                <div key={appt._id} className="card" style={{ 
                  display: 'flex', flexDirection: 'column', gap: '16px', padding: '28px',
                  borderLeft: '5px solid var(--secondary)', background: 'linear-gradient(135deg, var(--surface) 0%, rgba(255,255,255,0.98) 100%)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700', color: 'var(--text-main)' }}>
                        Dr. {appt.doctorId?.userId?.name}
                      </h4>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Specialist: {appt.doctorId?.specialization}
                      </span>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} color="var(--primary)" /> {new Date(appt.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.04)', padding: '16px 20px', borderRadius: '12px', 
                    border: '1px solid rgba(16, 185, 129, 0.1)', flexGrow: '1' 
                  }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      Prescription Guidelines & Dosage:
                    </strong>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.5' }}>
                      "{appt.prescription}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Authorized Signature: Certified CareConnect Practitioner
                    </span>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', 
                      backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--secondary)', textTransform: 'uppercase' 
                    }}>
                      Active Treatment
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN DASHBOARD ROUTER CONTAINER
// ==========================================
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', animation: 'fadeIn 0.35s ease-out' }}>
      
      {/* Premium Integrated Header panel */}
      <div className="card" style={{ 
        padding: '24px 32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', background: 'linear-gradient(135deg, var(--surface) 0%, rgba(255,255,255,0.95) 100%)',
        borderLeft: '5px solid var(--primary)', borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #4338CA 100%)', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: '700', fontSize: '1.4rem', boxShadow: '0 4px 14px rgba(79,70,229,0.2)'
          }}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              Welcome, {user?.name}!
              <span style={{ 
                fontSize: '0.75rem', padding: '4px 12px', borderRadius: '20px', 
                backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', 
                fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' 
              }}>
                {user?.role}
              </span>
            </h1>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '2px' }}>
              {user?.role === 'admin' && 'Monitor clinic stats, verify physician credentials, and set splitting fees.'}
              {user?.role === 'doctor' && 'Open calendar availability, consult with patients, and prescribe treatments.'}
              {user?.role === 'user' && 'Filter doctors by symptoms, schedule sessions, and track prescription histories.'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <NotificationBell />
          <button onClick={logout} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)', padding: '10px 18px', borderRadius: '12px' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'doctor' && <DoctorDashboard />}
      {user?.role === 'user' && <UserDashboard />}
    </div>
  );
};

export default Dashboard;
