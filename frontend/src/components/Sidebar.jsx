import React from 'react';
import { LayoutDashboard, Send, Scan, Layers, PieChart, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="BJP Logo" />
        <div className="portal-info">
          <h2>आपका संदेश</h2>
          <p>सिंधिया तक</p>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <div className="menu-group">
          <p className="menu-label">MENU</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
          <SidebarItem icon={Send} label="New Requests" to="/requests" />
          <SidebarItem icon={Scan} label="Scan / Upload" to="/upload" />
          <SidebarItem icon={Layers} label="Categories" to="/categories" />
        </div>
        
        <div className="menu-group">
          <p className="menu-label">REPORTS</p>
          <SidebarItem icon={PieChart} label="Analytics" to="/reports" />
          <SidebarItem icon={Settings} label="Settings" to="/settings" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
