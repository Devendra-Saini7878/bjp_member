import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SubmitGrievance from './pages/SubmitGrievance';

function App() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Router>
      <Routes>
        {/* Public Route for Grievance Submission */}
        <Route path="/submit" element={<SubmitGrievance />} />
        
        {/* Admin/Dashboard Routes */}
        <Route 
          path="*" 
          element={
            <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
              {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
              <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
              <main className="main-content">
                <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <Routes>
                  <Route path="/" element={<Dashboard view="all" />} />
                  <Route path="/requests" element={<Dashboard view="pending" />} />
                  <Route path="/upload" element={<Dashboard view="upload" />} />
                  <Route path="/categories" element={<Dashboard view="categories" />} />
                  <Route path="/reports" element={<Dashboard view="reports" />} />
                  <Route path="/settings" element={<Dashboard view="settings" />} />
                  <Route path="/profile" element={<Dashboard view="profile" />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
