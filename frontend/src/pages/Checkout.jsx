import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = cartTotal > 499 ? 0 : 40;
  const grandTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item.id
      })),
      shippingAddress: address,
      paymentMethod: 'Cash on Delivery',
      itemsPrice: cartTotal,
      shippingPrice: deliveryFee,
      totalPrice: grandTotal,
    };

    try {
      const token = localStorage.getItem('medistore_token');
      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      clearCart();
      navigate('/success');
    } catch (err) {
      alert("Order failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="hero-section" style={{padding: '40px 0', minHeight: 'auto'}}>
        <div className="container">
          <h1 className="hero-title" style={{fontSize: '2.5rem'}}>Secure <span className="highlight">Checkout</span></h1>
          <p className="hero-subtitle">Enter your delivery details and complete your order.</p>
        </div>
      </div>

      <section className="section-gap">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="cart-summary-box" style={{padding: '30px'}}>
                <h4 className="footer-heading mb-4" style={{color: 'var(--gray-900)'}}>Delivery Information</h4>
                <form onSubmit={handlePlaceOrder}>
                  <div className="mb-3">
                    <label className="auth-label">Full Name</label>
                    <input type="text" className="auth-input" value={user?.name} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="auth-label">Shipping Address</label>
                    <textarea 
                      className="auth-input" 
                      rows="3" 
                      placeholder="Street, City, Zip Code" 
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      required 
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="auth-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="auth-input" 
                      placeholder="+91 9876543210" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="auth-label">Payment Method</label>
                    <div className="trust-item" style={{background: 'var(--green-50)', padding: '12px', border: '1px solid var(--green-200)', borderRadius: '10px'}}>
                      <div className="trust-icon">💵</div>
                      <div className="trust-text"><strong>Cash on Delivery</strong><small>Pay when you receive your order</small></div>
                    </div>
                  </div>
                  <button type="submit" className="btn-main w-100" disabled={loading}>
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="cart-summary-box">
                <h4 className="footer-heading mb-3" style={{color: 'var(--gray-900)'}}>Order Summary</h4>
                <div className="checkout-items mb-3" style={{maxHeight: '300px', overflowY: 'auto'}}>
                  {cartItems.map(item => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                       <span style={{fontSize: '0.85rem'}}>{item.name} x {item.quantity}</span>
                       <span style={{fontWeight: 600}}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="dropdown-divider my-3"></div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Payable</span>
                  <span>₹{grandTotal}</span>
                </div>

                <div className="trust-strip mt-4" style={{padding: '15px', background: '#f8fafc', borderRadius: '12px'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', textAlign: 'center'}}>
                    <i className="fa fa-lock me-1"></i> 100% Safe and Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
