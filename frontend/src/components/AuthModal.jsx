import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login: setAuthData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      setAuthData(res.data.user || res.data, res.data.token);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" style={{display: 'flex'}} onClick={onClose}>
      <div className="auth-modal-card" onClick={e => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-modal-logo">M</div>
          <div className="auth-modal-title">Welcome to MediStore</div>
          <p className="auth-modal-subtitle">Login or create an account to continue</p>
          <button className="auth-modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'auth-tab-active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'auth-tab-active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-form-wrap">
          {error && <p className="text-danger text-center mb-3" style={{fontSize: '0.8rem'}}>{error}</p>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="auth-input-group mb-3">
                <label className="auth-label">Full Name</label>
                <input 
                  type="text" 
                  className="auth-input" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required 
                />
              </div>
            )}
            <div className="auth-input-group mb-3">
              <label className="auth-label">Email Address</label>
              <input 
                type="email" 
                className="auth-input" 
                placeholder="you@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="auth-input-group mb-4">
              <label className="auth-label">Password</label>
              <input 
                type="password" 
                className="auth-input" 
                placeholder="********" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="auth-submit-btn">
              <i className={`fa fa-sign-in-alt me-2`}></i> 
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-divider my-4">or</div>
          
          <button className="google-auth-btn" onClick={() => alert("Google login is coming soon!")}>
             <img src="https://imagepng.org/wp-content/uploads/2019/08/google-icon.png" width="20" alt="google" />
             Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
