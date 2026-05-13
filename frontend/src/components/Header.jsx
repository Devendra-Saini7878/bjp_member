import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { io } from 'socket.io-client';
import { NavLink } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

const Header = () => {
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    socket.on('newGrievance', () => {
      setNotifications(prev => prev + 1);
    });

    return () => socket.off('newGrievance');
  }, []);

  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} color="var(--text-secondary)" />
        <input type="text" placeholder="Global Search..." />
      </div>
      
      <div className="header-actions">
        <div className="notification-icon" onClick={() => setNotifications(0)}>
          <Bell size={20} />
          {notifications > 0 && <span className="badge">{notifications}</span>}
        </div>
        
        <NavLink to="/profile" className="profile-section">
          <div className="profile-info">
            <p className="profile-name">Jyotiraditya Scindia</p>
            <p className="profile-role">Union Minister</p>
          </div>
          <div className="profile-image">
            <img src="/minister.png" alt="Shri Jyotiraditya Scindia" />
          </div>
          <ChevronDown size={16} color="var(--text-secondary)" />
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
