import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filterQuery = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products. Make sure your backend is running.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const clearFilter = () => {
    setSearchParams({});
  };

  const filteredProducts = products.filter(product => {
    if (!filterQuery) return true;
    
    // Simple keyword matching across name, description, and category
    const query = filterQuery.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(query);
    const descMatch = product.description?.toLowerCase().includes(query);
    const catMatch = product.category?.toLowerCase().includes(query);
    
    // Also check for partial matches of individual words in the query for better results
    const queryWords = query.split(' ').filter(word => word.length > 2);
    const wordMatch = queryWords.some(word => 
      product.name?.toLowerCase().includes(word) || 
      product.description?.toLowerCase().includes(word)
    );

    return nameMatch || descMatch || catMatch || wordMatch;
  });

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-success"></div></div>;
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;

  return (
    <div className="product-gallery-page">
      <div className="hero-section" style={{padding: '40px 0', minHeight: 'auto'}}>
        <div className="container">
          <h1 className="hero-title" style={{fontSize: '2.5rem'}}>Product <span className="highlight">Gallery</span></h1>
          <p className="hero-subtitle">
            {filterQuery ? (
              <>Showing results for: <span style={{color: 'var(--amber-400)', fontWeight: 'bold'}}>"{filterQuery}"</span></>
            ) : (
              "Find the best medicines at the best prices."
            )}
          </p>
          {filterQuery && (
            <button 
              onClick={clearFilter}
              style={{
                marginTop: '10px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '99px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Clear Filter <i className="fa fa-times ms-1"></i>
            </button>
          )}
        </div>
      </div>

      <section className="section-gap">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <div style={{fontSize: '3rem'}}>💊</div>
              <h4>No products found</h4>
              <p>We couldn't find any products matching your specific condition.</p>
              <button onClick={clearFilter} className="btn-add-cart mt-3" style={{margin: '0 auto'}}>View All Products</button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map(product => (
                <div key={product._id} className="col-md-4 col-sm-6">
                  <ProductCard 
                    product={{
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      description: product.description,
                      image: product.img || '/hero.png',
                      badge: product.type || 'OTC',
                      badgeClass: product.type === 'Rx' ? 'badge-rx' : 'badge-otc'
                    }} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
