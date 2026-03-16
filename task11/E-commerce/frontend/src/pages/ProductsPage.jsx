import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const limit = 12;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    setLoading(true);
    getProducts({ page, limit, name: search || undefined, category: category || undefined })
      .then(({ data }) => { setProducts(data.products); setTotal(data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, category]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Collection</h2>
        <p>{total > 0 ? `${total} items available` : 'Browse our curated selection'}</p>
      </div>

      <div className="filters">
        <div className="filter-input-wrap">
          <span className="filter-icon">⌕</span>
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="filter-input-wrap">
          <span className="filter-icon">◈</span>
          <input
            placeholder="Filter by category..."
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          Loading
        </div>
      ) : (
        <div className="product-grid">
          {products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            products.map(p => (
              <ProductCard key={p.id} product={p} onToast={showToast} />
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
