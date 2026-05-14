import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { io } from 'socket.io-client';
import { NavLink } from 'react-router-dom';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const socket = io(API_URL);

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    socket.on('newGrievance', () => {
      setNotifications(prev => prev + 1);
    });

    return () => socket.off('newGrievance');
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="header-search">
          <Search size={18} color="var(--text-secondary)" />
          <input type="text" placeholder="Global Search..." />
        </div>
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
            <img src="/Mr Scindia 4.png" alt="Shri Jyotiraditya Scindia" />
          </div>
          <ChevronDown size={16} color="var(--text-secondary)" />
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
