import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="medistore-nav">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">M</div>
          <span className="logo-text">Medi<span>Store</span></span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link-item ${isActive('/')}`}>Home</Link>
          <Link to="/products" className={`nav-link-item ${isActive('/products')}`}>Products</Link>
          <Link to="/conditions" className={`nav-link-item ${isActive('/conditions')}`}>Conditions</Link>
          
          <button 
            id="darkToggle" 
            className="dark-toggle-btn" 
            onClick={toggleTheme} 
            title="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="nav-profile-wrap">
              <button 
                className="profile-trigger" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="profile-avatar-small">
                  {(user.name || 'U')[0].toUpperCase()}
                </div>
                <span className="logo-text" style={{fontSize: '0.85rem', fontWeight: 600}}>{user.name}</span>
              </button>
              <div className={`profile-dropdown ${showDropdown ? 'active' : ''}`}>
                <Link to="/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <i className="fa fa-user"></i> Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <i className="fa fa-cog"></i> Admin Portal
                  </Link>
                )}
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-danger" onClick={() => { logout(); setShowDropdown(false); }}>
                  <i className="fa fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </div>
          ) : (
            <button className="nav-link-item" onClick={() => setIsAuthModalOpen(true)}>Login</button>
          )}

          <Link to="/cart" className="nav-cart-btn">
            <i className="fa fa-shopping-cart"></i> Cart
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
