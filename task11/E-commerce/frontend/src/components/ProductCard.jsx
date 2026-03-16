import { useState } from 'react';
import { createOrder } from '../services/api';

function parseJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

export default function ProductCard({ product, onToast }) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) { onToast?.('Please sign in to purchase'); return; }
    const { userId } = parseJwt(token);
    setLoading(true);
    try {
      await createOrder({
        userId,
        items: [{ productId: product.id, quantity: 1, price: product.price }],
      });
      onToast?.('Order placed — view in Orders');
    } catch (err) {
      onToast?.(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} />
      )}
      <div className="product-tag">{product.category}</div>
      <h3>{product.name}</h3>
      {product.description && <p className="desc">{product.description}</p>}
      <div className="product-footer">
        <span className="price">${Number(product.price).toFixed(2)}</span>
        <button className="btn-buy" onClick={handleBuy} disabled={loading}>
          {loading ? '...' : 'Purchase'}
        </button>
      </div>
    </div>
  );
}
