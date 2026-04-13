import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find(item => item.id === product.id);

  return (
    <div className="product-card">
      <div className="product-card-img-wrap">
        <img src={product.image || '/hero.png'} alt={product.name} />
      </div>
      <div className="product-card-body">
        <span className={`product-badge ${product.badgeClass || 'badge-otc'}`}>
          {product.badge || 'OTC'}
        </span>
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description}</div>
        <div className="product-footer">
          <div className="product-price">
            ₹{product.price}
            {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
          </div>
          {cartItem ? (
            <div className="quantity-control">
              <button 
                className="qty-btn" 
                onClick={() => updateQuantity(product.id, -1)}
              >
                <i className="fa fa-minus"></i>
              </button>
              <span className="qty-val">{cartItem.quantity}</span>
              <button 
                className="qty-btn" 
                onClick={() => updateQuantity(product.id, 1)}
              >
                <i className="fa fa-plus"></i>
              </button>
            </div>
          ) : (
            <button 
              className="btn-add-cart" 
              onClick={() => addToCart(product)}
            >
              <i className="fa fa-plus"></i> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
