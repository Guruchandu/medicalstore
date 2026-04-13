import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="footer-brand">
              <div className="logo-text">Medi<span>Store</span></div>
            </div>
            <p className="footer-desc">Your trusted online pharmacy. Quality medicines delivered to your doorstep, fast & safe.</p>
          </div>
          
          <div className="col-md-2 col-6">
            <div className="footer-heading">Quick Links</div>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/conditions">Conditions</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </div>

          <div className="col-md-2 col-6">
            <div className="footer-heading">Categories</div>
            <ul className="footer-links">
              <li><Link to="/products">Tablets</Link></li>
              <li><Link to="/products">Syrups</Link></li>
              <li><Link to="/products">Vitamins</Link></li>
              <li><Link to="/products">Devices</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <div className="footer-heading">Contact Us</div>
            <ul className="footer-links">
              <li><a href="#">📧 support@medistore.in</a></li>
              <li><a href="#">📞 1800-123-4567</a></li>
              <li><a href="#">🕗 Mon–Sat, 9am – 6pm</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span>© 2026 MediStore. All rights reserved.</span>
          <span>Made with ❤️ for better health</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
