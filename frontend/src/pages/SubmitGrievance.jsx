import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle2, AlertCircle, User, MapPin, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import QRCodePoster from '../components/QRCodePoster';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

const SubmitGrievance = ({ admin = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    district: 'Gwalior',
    description: '',
    contact: '',
    category: 'Public Grievance'
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) data.append('pdf', file);

    try {
      await axios.post(`${API_URL}/api/grievances`, data);
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={admin ? '' : 'submit-page'}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card success-card">
          <div className="upload-icon-circle" style={{ background: 'var(--status-resolved)', color: 'white' }}>
            <CheckCircle2 size={32} />
          </div>
          <h2>सफलतापूर्वक जमा किया गया!</h2>
          <p>आपका संदेश सुरक्षित रूप से सिंधिया जी के कार्यालय तक पहुँचा दिया गया है।</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>वापस जाएँ</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={admin ? 'admin-form-wrap' : 'submit-page'}>
      {!admin && (
        <div className="submit-header animate-fade">
          <img src="/logo.png" alt="BJP Logo" className="bjp-logo-large" />
          <h1>आपका संदेश सिंधिया तक</h1>
          <p>माननीय मंत्री जी के साथ सीधे संवाद के लिए इस फॉर्म का उपयोग करें। हम आपकी समस्याओं के त्वरित समाधान के लिए प्रतिबद्ध हैं।</p>
        </div>
      )}

      <div className="form-container">
        <form className="card form-card animate-fade" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label><User size={16} /> नाम (Full Name)</label>
              <input type="text" name="name" required placeholder="अपना पूरा नाम लिखें" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label><Phone size={16} /> मोबाइल नंबर (Contact)</label>
              <input type="tel" name="contact" required placeholder="10 अंकों का मोबाइल नंबर" value={formData.contact} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label><MapPin size={16} /> शहर (City)</label>
              <input type="text" name="city" required placeholder="अपने शहर/गाँव का नाम" value={formData.city} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label><MapPin size={16} /> जिला (District)</label>
              <select name="district" value={formData.district} onChange={handleChange}>
                <option value="Gwalior">Gwalior (ग्वालियर)</option>
                <option value="Guna">Guna (गुना)</option>
                <option value="Shivpuri">Shivpuri (शिवपुरी)</option>
                <option value="Ashoknagar">Ashoknagar (अशोकनगर)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label><MessageSquare size={16} /> समस्या / शिकायत (Grievance)</label>
            <textarea name="description" rows="5" placeholder="अपनी समस्या या सुझाव का विवरण यहाँ विस्तार से लिखें..." value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label><Upload size={16} /> पत्र अपलोड करें (Optional PDF)</label>
            <div className={`file-upload ${file ? 'active' : ''}`}>
              <input type="file" accept="application/pdf" onChange={handleFileChange} />
              <div className="upload-content">
                <div className="upload-icon-circle">
                  <Upload size={28} />
                </div>
                <p>{file ? file.name : 'PDF प्रारूप में पत्र अपलोड करें'}</p>
                <span>अधिकतम फाइल साइज: 5MB</span>
              </div>
            </div>
          </div>

          {error && <div className="error-msg" style={{ marginTop: '1rem', color: 'red' }}><AlertCircle size={18} /> {error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'कृपया प्रतीक्षा करें...' : 'अपना संदेश भेजें (Send Message)'}
          </button>
        </form>

        {!admin && (
          <div style={{ marginTop: '4rem' }}>
            <QRCodePoster url={FRONTEND_URL + '/submit'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitGrievance;
