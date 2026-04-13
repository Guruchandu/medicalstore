import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [popularProducts, setPopularProducts] = useState([]);
  const [reorderedProducts, setReorderedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Tablets', icon: '💊', count: '120+ items', bg: '#dcfce7' },
    { name: 'Syrups', icon: '🧴', count: '80+ items', bg: '#dbeafe' },
    { name: 'Vitamins', icon: '🍊', count: '60+ items', bg: '#fef3c7' },
    { name: 'Devices', icon: '🩺', count: '40+ items', bg: '#fce7f3' },
  ];

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        // Taking first 3 as popular for home page parity
        setPopularProducts(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch popular products:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('medistore_token');
      if (user && token) {
        try {
          const res = await axios.get('http://localhost:5000/api/orders/myorders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const allItems = res.data.flatMap(order => order.orderItems);
          const uniqueProducts = [];
          const seenIds = new Set();
          
          for (const item of allItems) {
            if (!seenIds.has(item.product)) {
              seenIds.add(item.product);
              uniqueProducts.push({
                id: item.product,
                name: item.name,
                price: item.price,
                image: item.image,
                description: 'From your last order',
                badge: 'Ordered',
                badgeClass: 'badge-new'
              });
            }
          }
          setReorderedProducts(uniqueProducts.slice(0, 3));
        } catch (err) {
          console.error("Failed to fetch orders:", err.message);
        }
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <div className="hero-badge">✅ Trusted by 50,000+ customers</div>
              <h1 className="hero-title">Your Health,<br /><span className="highlight">Our Priority</span></h1>
              <p className="hero-subtitle">Quality medicines delivered to your doorstep. Browse trusted brands at the best prices — fast, safe & reliable.</p>
              <div className="hero-actions">
                <Link to="/products" className="btn-hero-primary"><i className="fa fa-pills"></i> Shop Now</Link>
                <Link to="/conditions" className="btn-hero-secondary"><i className="fa fa-stethoscope"></i> Browse Conditions</Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="stat-num">500+</div>
                  <div className="stat-label">Medicines</div>
                </div>
                <div className="hero-stat">
                  <div className="stat-num">24hr</div>
                  <div className="stat-label">Delivery</div>
                </div>
                <div className="hero-stat">
                  <div className="stat-num">100%</div>
                  <div className="stat-label">Genuine Products</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="hero-img-wrap">
                <div className="hero-img-glow"></div>
                <img src="/hero.png" className="hero-img" alt="MediStore" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="trust-strip">
        <div className="container">
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="trust-item">
                <div className="trust-icon">🚚</div>
                <div className="trust-text"><strong>Free Delivery</strong><small>On orders above ₹499</small></div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="trust-item">
                <div className="trust-icon">✅</div>
                <div className="trust-text"><strong>100% Genuine</strong><small>Verified medicines</small></div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="trust-item">
                <div className="trust-icon">🔒</div>
                <div className="trust-text"><strong>Secure Payment</strong><small>Safe & encrypted</small></div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="trust-item">
                <div className="trust-icon">🔄</div>
                <div className="trust-text"><strong>Easy Returns</strong><small>Hassle-free process</small></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="section-gap">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Browse By Type</div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
          <div className="row g-3">
            {categories.map((cat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="category-card">
                  <div className="category-icon" style={{ background: cat.bg }}>{cat.icon}</div>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Buy it Again ── */}
      {user && reorderedProducts.length > 0 && (
        <section className="section-gap" style={{background: 'var(--blue-50)', padding: '60px 0'}}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag" style={{background: 'var(--blue-500)', color: 'white'}}>Quick Reorder</div>
              <h2 className="section-title">Buy it Again</h2>
              <p className="section-subtitle">Based on your recent purchases</p>
            </div>
            <div className="row g-4">
              {reorderedProducts.map(product => (
                <div key={product.id} className="col-md-4 col-sm-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Popular Medicines ── */}
      <section className="section-gap">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="section-header mb-0">
              <div className="section-tag">Best Sellers</div>
              <h2 className="section-title">Popular Medicines</h2>
            </div>
            <Link to="/products" className="nav-link-item">View all <i className="fa fa-arrow-right ms-1"></i></Link>
          </div>
          <div className="row g-4">
            {loading ? (
               [1,2,3].map(i => <div key={i} className="col-md-4 col-sm-6"><div className="product-card skeleton" style={{height: '300px'}}></div></div>)
            ) : (
              popularProducts.map(product => (
                <div key={product._id} className="col-md-4 col-sm-6">
                  <ProductCard 
                     product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        image: product.img || '/hero.png',
                        badge: 'OTC',
                        badgeClass: 'badge-otc'
                     }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Conditional: Order Again / Suggested (Skeletons for parity) */}
      {user && (
         <section className="section-gap" style={{background: 'var(--gray-50)', borderRadius: '32px', padding: '60px 0'}}>
            <div className="container text-center">
               <div className="section-tag">Personalized</div>
               <h2 className="section-title">Suggested for You</h2>
               <p className="section-subtitle">Based on your health interests</p>
               <div className="mt-4" style={{opacity: 0.5}}>We're calculating the best recommendations for you...</div>
            </div>
         </section>
      )}
    </div>
  );
};

export default Home;
