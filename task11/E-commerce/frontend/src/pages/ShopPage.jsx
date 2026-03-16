import { useState, useEffect } from 'react'
import { productAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import styles from './ShopPage.module.css'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search)   params.name = search
    if (category) params.category = category
    productAPI.list(params)
      .then(r => setProducts(r.data || r))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, category])

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Discover Products</h1>
        <p className={styles.sub}>Powered by microservices architecture</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {['Electronics', 'Sports', 'Kitchen', 'Home'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.spinner} />
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <span>🔍</span>
          <h3>No products found</h3>
          <p>Try a different search or category</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
