import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('medistore_token');
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Orders fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="admin-page">
      <div className="hero-section" style={{padding: '40px 0', minHeight: 'auto', background: 'linear-gradient(135deg, var(--gray-800) 0%, var(--gray-900) 100%)'}}>
        <div className="container">
          <h1 className="hero-title" style={{fontSize: '2.5rem', color: 'white'}}>Admin <span className="highlight" style={{color: 'var(--green-400)'}}>Portal</span></h1>
          <p className="hero-subtitle mb-0" style={{color: 'rgba(255,255,255,0.7)'}}>Management dashboard for products and orders.</p>
        </div>
      </div>

      <section className="section-gap">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
             <h4 className="footer-heading mb-0" style={{color: 'var(--gray-900)'}}>Customer Orders</h4>
             <span className="badge-otc" style={{fontSize: '0.8rem', padding: '6px 14px', borderRadius: '12px', background: 'var(--gray-100)', color: 'var(--gray-600)'}}>Total: {orders.length}</span>
          </div>

          {loading ? (
             <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
          ) : (
            <div className="table-responsive" style={{background: 'white', borderRadius: '16px', border: '1.5px solid var(--gray-200)', overflow: 'hidden'}}>
               <table className="table table-hover mb-0" style={{fontSize: '0.85rem'}}>
                  <thead style={{background: 'var(--gray-50)'}}>
                     <tr>
                        <th style={{padding: '16px 20px'}}>ID</th>
                        <th style={{padding: '16px 20px'}}>User</th>
                        <th style={{padding: '16px 20px'}}>Date</th>
                        <th style={{padding: '16px 20px'}}>Total</th>
                        <th style={{padding: '16px 20px'}}>Paid</th>
                        <th style={{padding: '16px 20px'}}>Delivered</th>
                        <th style={{padding: '16px 20px'}}>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {orders.map(order => (
                       <tr key={order._id}>
                          <td style={{padding: '16px 20px', fontWeight: 600}}>#{order._id.slice(-6).toUpperCase()}</td>
                          <td style={{padding: '16px 20px'}}>{order.user?.name || 'Unknown User'}</td>
                          <td style={{padding: '16px 20px'}}>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td style={{padding: '16px 20px'}}>₹{order.totalPrice}</td>
                          <td style={{padding: '16px 20px'}}>
                              {order.isPaid ? 
                                <span className="badge-otc" style={{background: 'var(--green-50)', color: 'var(--green-700)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem'}}>Paid</span> : 
                                <span className="badge-rx" style={{background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem'}}>Pending</span>
                              }
                          </td>
                          <td style={{padding: '16px 20px'}}>
                              {order.isDelivered ? 
                                <span className="badge-otc" style={{background: 'var(--green-50)', color: 'var(--green-700)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem'}}>Delivered</span> : 
                                <span className="badge-rx" style={{background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem'}}>In Transit</span>
                              }
                          </td>
                          <td style={{padding: '16px 20px'}}>
                              <button className="btn-hero-secondary" style={{padding: '4px 12px', fontSize: '0.75rem', borderRadius: '6px', minHeight: 'auto'}} onClick={() => alert("Order management coming soon!")}>Details</button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Admin;
