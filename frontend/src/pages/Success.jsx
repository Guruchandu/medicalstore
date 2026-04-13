import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="container py-5 text-center">
      <div className="success-icon" style={{fontSize: '5rem', marginBottom: '24px'}}>🎉</div>
      <h1 className="hero-title" style={{fontSize: '3rem'}}>Order <span className="highlight">Placed!</span></h1>
      <p className="hero-subtitle mb-5">Thank you for your purchase. Your order is being processed and will be delivered within 24-48 hours.</p>
      
      <div className="d-flex justify-content-center gap-3">
        <Link to="/dashboard" className="btn-main" style={{textDecoration: 'none'}}>
          View My Orders <i className="fa fa-arrow-right ms-2"></i>
        </Link>
        <Link to="/" className="btn-hero-secondary" style={{textDecoration: 'none'}}>
           Back to Home
        </Link>
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="trust-strip" style={{padding: '30px', background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: '24px'}}>
             <div className="trust-item mb-3">
                <div className="trust-icon">📩</div>
                <div className="trust-text"><strong>Confirmation Email</strong><small>We've sent a receipt to your email address.</small></div>
             </div>
             <div className="trust-item">
                <div className="trust-icon">🚚</div>
                <div className="trust-text"><strong>Live Tracking</strong><small>You can track your order status in the dashboard.</small></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
