import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const EMPTY = { name: '', description: '', price: '', stock: '', category: '', imageUrl: '' };

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [showForm, setShowForm] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editId) {
        await updateProduct(editId, payload);
        showToast('Product updated');
      } else {
        await createProduct(payload);
        showToast('Product created');
      }
      setForm(EMPTY); setEditId(null); setShowForm(false);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed');
    } finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, category: p.category, imageUrl: p.imageUrl || '' });
    setEditId(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      showToast('Deleted');
      fetchProducts();
    } catch (err) { showToast('Failed to delete'); }
  };

  const handleCancel = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Admin Panel</h2>
          <p>Manage your product catalogue</p>
        </div>
        {!showForm && (
          <button className="btn-buy" onClick={() => setShowForm(true)} style={{ padding: '0.6rem 1.5rem' }}>
            + Add Product
          </button>
        )}
      </div>

      {showForm && (
        <div className="admin-form-wrap">
          <div className="admin-form-header">
            <span className="auth-eyebrow">{editId ? 'Editing product' : 'New product'}</span>
            <button className="btn-logout" onClick={handleCancel}>Cancel</button>
          </div>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input placeholder="e.g. Leather Wallet" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input placeholder="e.g. Accessories" value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" placeholder="0.00" step="0.01" min="0" value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" placeholder="0" min="0" value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Image URL</label>
                <input placeholder="https://..." value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Description</label>
                <textarea placeholder="Product description..." value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} />
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={saving} style={{ marginTop: '1rem' }}>
              {saving ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner" />Loading</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>No products yet</td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', filter: 'grayscale(20%)' }} />}
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.1rem' }}>{p.description?.slice(0, 40)}{p.description?.length > 40 ? '...' : ''}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="product-tag" style={{ margin: 0 }}>{p.category}</span></td>
                  <td style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent)' }}>${Number(p.price).toFixed(2)}</td>
                  <td style={{ color: p.stock === 0 ? '#e74c3c' : 'var(--text2)' }}>{p.stock}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
