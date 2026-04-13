import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('medistore_token');
        const res = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Order fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="hero-section" style={{padding: '40px 0', minHeight: 'auto'}}>
        <div className="container">
          <div className="d-flex align-items-center gap-3">
             <div className="profile-avatar-large" style={{width: '64px', height: '64px', borderRadius: '50%', background: 'var(--green-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800'}}>
                {(user?.name || 'U')[0].toUpperCase()}
             </div>
             <div>
                <h1 className="hero-title" style={{fontSize: '2rem', marginBottom: '4px'}}>Hello, <span className="highlight">{user?.name}</span></h1>
                <p className="hero-subtitle mb-0">Track your orders and manage your account.</p>
             </div>
          </div>
        </div>
      </div>

      <section className="section-gap">
        <div className="container">
          <h4 className="footer-heading mb-4" style={{color: 'var(--gray-900)'}}>Recent Orders</h4>
          
          {loading ? (
             <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
          ) : orders.length === 0 ? (
             <div className="cart-summary-box text-center py-5">
                <div style={{fontSize: '3rem'}}>📦</div>
                <h5>No orders yet</h5>
                <p>Start shopping to see your orders here.</p>
             </div>
          ) : (
             <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="cart-item" style={{display: 'flex', flexDirection: 'column', gap: '15px', padding: '25px'}}>
                    <div className="d-flex justify-content-between align-items-center w-100">
                       <span style={{fontWeight: 700, color: 'var(--gray-500)'}}>Order #{order._id.slice(-6).toUpperCase()}</span>
                       <span className={`product-badge ${order.isPaid ? 'badge-otc' : 'badge-rx'}`} style={{background: order.isPaid ? 'var(--green-50)' : '#fee2e2', color: order.isPaid ? 'var(--green-700)' : '#991b1b'}}>
                          {order.isPaid ? 'Paid' : 'Payment Pending'}
                       </span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div>
                       {order.orderItems.map((item, i) => (
                         <div key={i} className="d-flex justify-content-between mb-1" style={{fontSize: '0.9rem'}}>
                            <span>{item.name} x {item.qty}</span>
                            <span>₹{item.price * item.qty}</span>
                         </div>
                       ))}
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="d-flex justify-content-between align-items-center w-100">
                       <div style={{fontSize: '0.8rem', color: 'var(--gray-400)'}}>
                          Placed on: {new Date(order.createdAt).toLocaleDateString()}
                       </div>
                       <div style={{fontWeight: 800, fontSize: '1.1rem', color: 'var(--green-700)'}}>
                          Total: ₹{order.totalPrice}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
