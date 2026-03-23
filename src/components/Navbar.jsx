import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HiLogout, HiSun, HiMoon } from 'react-icons/hi';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <header className="navbar-header glass-panel">
      <div className="navbar-content">
        <h1 className="logo-title">VocabBuilder 🚀</h1>
        
        <nav className="navbar-links">
          <Link 
            to="/" 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/review" 
            className={`nav-item ${location.pathname === '/review' ? 'active' : ''}`}
          >
            Review (Ôn tập)
          </Link>
        </nav>

        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn-icon theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {isDarkMode ? <HiSun size={24} /> : <HiMoon size={24} />}
          </button>
          <span className="user-email">{currentUser?.email}</span>
          <button className="btn-icon logout-btn" onClick={handleLogout} title="Logout">
            <HiLogout size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
