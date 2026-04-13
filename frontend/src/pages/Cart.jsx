import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div style={{fontSize: '5rem', marginBottom: '20px'}}>🛒</div>
        <h2 className="section-title">Your cart is empty</h2>
        <p className="hero-subtitle" style={{color: 'var(--gray-500)'}}>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-hero-primary mt-4">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="hero-section" style={{padding: '40px 0', minHeight: 'auto'}}>
        <div className="container">
          <h1 className="hero-title" style={{fontSize: '2.5rem'}}>Shopping <span className="highlight">Cart</span></h1>
          <p className="hero-subtitle">Review your items and proceed to secure checkout.</p>
        </div>
      </div>

      <section className="section-gap">
        <div className="container">
          <div className="row g-4">
            {/* Cart Items List */}
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="d-flex align-items-center gap-3">
                    <img src={item.image || '/hero.png'} alt={item.name} style={{width: '60px', height: '60px', borderRadius: '8px', objectFit: 'contain'}} />
                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">₹{item.price}</div>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center gap-4">
                    <div className="qty-controls">
                      <button className="qty-btn minus" onClick={() => updateQuantity(item.id, -1)}>
                        <i className="fa fa-minus"></i>
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="cart-summary-box">
                <h4 className="footer-heading" style={{color: 'var(--gray-900)', borderBottom: '1px solid var(--gray-100)', paddingBottom: '12px', marginBottom: '16px'}}>Order Summary</h4>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span className="text-success">{cartTotal > 499 ? 'FREE' : '₹40'}</span>
                </div>
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>₹{cartTotal > 499 ? cartTotal : cartTotal + 40}</span>
                </div>
                
                <Link to="/checkout" className="btn-main mt-4" style={{textDecoration: 'none'}}>
                  Proceed to Checkout <i className="fa fa-arrow-right"></i>
                </Link>
                
                <p className="text-center mt-3" style={{fontSize: '0.75rem', color: 'var(--gray-400)'}}>
                  <i className="fa fa-shield-alt me-1"></i> Secure 256-bit SSL Encrypted Payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
