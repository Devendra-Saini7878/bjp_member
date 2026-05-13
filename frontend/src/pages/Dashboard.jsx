import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, MoreVertical, FileText, CheckCircle, Clock, AlertTriangle, Eye, Download, Search, Upload, User, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import SubmitGrievance from './SubmitGrievance'; 
import QRCodePoster from '../components/QRCodePoster';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const FRONTEND_URL = (import.meta.env.VITE_FRONTEND_URL || window.location.origin).replace(/\/$/, '');
const socket = io(API_URL);

const SummaryCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="summary-card"
  >
    <div className={`icon-box ${color}`}>
      <Icon size={24} />
    </div>
    <div className="card-content">
      <p className="card-title">{title}</p>
      <h3 className="card-value">{value}</h3>
    </div>
  </motion.div>
);

const GrievanceModal = ({ grievance, onClose, onUpdateStatus }) => {
  if (!grievance) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="modal-content" onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Request Details: {grievance.requestID}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="detail-section"><label>Citizen Name</label><p>{grievance.name}</p></div>
          <div className="detail-section"><label>Contact</label><p>{grievance.contact}</p></div>
          <div className="detail-section"><label>Location</label><p>{grievance.city}, {grievance.district}</p></div>
          <div className="detail-section full"><label>Category</label><p className="category-tag">{grievance.category}</p></div>
          <div className="detail-section full"><label>Description / Grievance</label><p>{grievance.description || 'No description provided.'}</p></div>
          {grievance.pdfUrl && (
            <div className="detail-section full">
              <label>Attached Document</label>
              <a href={`${API_URL}${grievance.pdfUrl}`} target="_blank" rel="noreferrer" className="btn-secondary">
                <Download size={16} /> View PDF Document
              </a>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="status-updater">
            <label>Update Status:</label>
            <select value={grievance.status} onChange={(e) => onUpdateStatus(grievance._id, e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="High Priority">High Priority</option>
            </select>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProfileView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-view card">
    <div className="profile-hero">
      <img src="/minister.png" alt="Jyotiraditya Scindia" className="large-avatar" />
      <div className="hero-text">
        <h1>Shri Jyotiraditya Scindia</h1>
        <p className="role">Union Minister of Communications & North Eastern Region</p>
        <div className="badges">
          <span className="badge-tag">MP, Guna</span>
          <span className="badge-tag">BJP Member</span>
        </div>
      </div>
    </div>
    <div className="profile-details-grid">
      <div className="detail-card">
        <MapPin size={20} />
        <div><label>Constituency</label><p>Guna, Madhya Pradesh</p></div>
      </div>
      <div className="detail-card">
        <Phone size={20} />
        <div><label>Office Contact</label><p>+91 11 2306 1234</p></div>
      </div>
      <div className="detail-card">
        <div><label>Email</label><p>office@scindia.in</p></div>
      </div>
    </div>
  </motion.div>
);

const CategoriesView = ({ grievances }) => {
  const categories = ['Public Grievance', 'Party Matter', 'Personal', 'Invitation', 'Other'];
  return (
    <div className="categories-view grid animate-fade">
      {categories.map(cat => (
        <div key={cat} className="card category-card">
          <div className="cat-header">
            <h4>{cat}</h4>
            <span className="count">{grievances.filter(g => g.category === cat).length}</span>
          </div>
          <p className="cat-desc">Manage all requests related to {cat.toLowerCase()}.</p>
          <button className="btn-secondary small">View All</button>
        </div>
      ))}
    </div>
  );
};

const SettingsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="settings-view card animate-fade">
    <h3>System Settings</h3>
    <div className="settings-list">
      <div className="setting-item">
        <div><h4>Email Notifications</h4><p>Receive alerts for new high-priority grievances.</p></div>
        <input type="checkbox" defaultChecked />
      </div>
      <div className="setting-item">
        <div><h4>Real-time Dashboard</h4><p>Enable live updates for the grievance feed.</p></div>
        <input type="checkbox" defaultChecked />
      </div>
    </div>
  </motion.div>
);

const Dashboard = ({ view = 'all' }) => {
  const [grievances, setGrievances] = useState([]);
  const [filter, setFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  const fetchGrievances = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/grievances`);
      setGrievances(res.data);
    } catch (err) {
      console.error('Error fetching:', err);
    }
  };

  useEffect(() => {
    fetchGrievances();
    socket.on('newGrievance', (data) => setGrievances(prev => [data, ...prev]));
    socket.on('updateGrievance', (data) => {
      setGrievances(prev => prev.map(g => g._id === data._id ? data : g));
      setSelectedGrievance(prev => (prev && prev._id === data._id) ? data : prev);
    });
    return () => { socket.off('newGrievance'); socket.off('updateGrievance'); };
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try { 
      // Optimistic Update
      setGrievances(prev => prev.map(g => g._id === id ? { ...g, status } : g));
      if (selectedGrievance && selectedGrievance._id === id) {
        setSelectedGrievance(prev => ({ ...prev, status }));
      }
      
      await axios.patch(`${API_URL}/api/grievances/${id}`, { status }); 
    } 
    catch (err) { 
      console.error('Error updating status:', err); 
      // Revert if failed (optional, but good for robustness)
      fetchGrievances();
    }
  };

  const filteredGrievances = grievances.filter(g => {
    const dMatch = districtFilter === 'All Districts' || g.district === districtFilter;
    let sMatch = filter === 'All' || g.status === filter;
    
    // Custom views overrides
    if (view === 'pending') sMatch = g.status === 'Pending';
    
    const tMatch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   g.requestID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   g.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    return dMatch && sMatch && tMatch;
  });

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'Pending').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
    high: grievances.filter(g => g.status === 'High Priority').length,
  };

  if (view === 'profile') return <ProfileView />;
  if (view === 'upload') return (
    <div className="admin-upload animate-fade">
      <div className="card upload-header-card" style={{ marginBottom: '2.5rem' }}>
        <Upload size={32} color="var(--primary-saffron)" />
        <div>
          <h2>Register New Offline Request</h2>
          <p>Scan a barcode or manually enter details for requests received via post or in-person.</p>
        </div>
      </div>
      
      <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', marginBottom: '3rem', alignItems: 'start' }}>
        <div className="card-container">
           <SubmitGrievance admin={true} />
        </div>
        <div className="qr-section">
           <QRCodePoster url={FRONTEND_URL + '/submit'} />
        </div>
      </div>
    </div>
  );

  if (view === 'categories') return <CategoriesView grievances={grievances} />;
  if (view === 'settings') return <SettingsView />;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>{view === 'pending' ? 'New Requests' : view === 'reports' ? 'Analytics & Reports' : 'Dashboard Overview'}</h1>
          <p className="subtitle">Real-time grievance monitoring and management</p>
        </div>
        <div className="header-actions-row">
          <div className="search-box">
            <Search size={18} color="var(--text-secondary)" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="district-selector">
            <Filter size={18} /><select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}><option>All Districts</option><option>Gwalior</option><option>Guna</option><option>Shivpuri</option></select>
          </div>
        </div>
      </div>

      {view !== 'reports' && (
        <div className="summary-grid">
          <SummaryCard title="Total" value={stats.total} icon={FileText} color="blue" delay={0.1} />
          <SummaryCard title="Pending" value={stats.pending} icon={Clock} color="orange" delay={0.2} />
          <SummaryCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="green" delay={0.3} />
          <SummaryCard title="High Priority" value={stats.high} icon={AlertTriangle} color="red" delay={0.4} />
        </div>
      )}

      <div className="content-grid">
        <div className="card table-card">
          <div className="table-header">
            <h3>Live Grievance Feed</h3>
            <div className="table-actions">
              <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All</button>
              <button className={filter === 'Pending' ? 'active' : ''} onClick={() => setFilter('Pending')}>Pending</button>
              <button className={filter === 'Resolved' ? 'active' : ''} onClick={() => setFilter('Resolved')}>Resolved</button>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead><tr><th>ID</th><th>CITIZEN</th><th>CATEGORY</th><th>STATUS</th><th>DATE</th><th>ACTION</th></tr></thead>
              <tbody>
                <AnimatePresence>
                  {filteredGrievances.map((g) => (
                    <motion.tr key={g._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                      <td className="req-id">{g.requestID}</td>
                      <td><div className="citizen-info"><div className="avatar">{g.name[0]}</div><div><p className="name">{g.name}</p><p className="city">{g.city}</p></div></div></td>
                      <td><span className="category-tag">{g.category}</span></td>
                      <td><span className={`status-pill status-${g.status.toLowerCase().replace(' ', '-')}`}>{g.status}</span></td>
                      <td className="date">{new Date(g.createdAt).toLocaleDateString()}</td>
                      <td><button className="icon-btn" onClick={() => setSelectedGrievance(g)}><Eye size={18} /></button></td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedGrievance && <GrievanceModal grievance={selectedGrievance} onClose={() => setSelectedGrievance(null)} onUpdateStatus={handleUpdateStatus} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
