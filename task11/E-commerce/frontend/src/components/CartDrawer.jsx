import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { orderAPI } from '../services/api'
import { useState } from 'react'
import styles from './CartDrawer.module.css'

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, changeQty, clearCart, cartTotal, cartCount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkout = async () => {
    if (!user) { onClose(); navigate('/login'); return }
    if (!cart.length) return
    setLoading(true)
    setError('')
    try {
      const order = await orderAPI.create({
        userId: user.id,
        items: cart.map(i => ({ productId: i.id, quantity: i.qty })),
      })
      clearCart()
      onClose()
      navigate('/orders')
    } catch (e) {
      setError(e.response?.data?.error || 'Checkout failed')
    }
    setLoading(false)
  }

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.drawer} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>Cart {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}</span>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.items}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🛒</span>
              <p>Your cart is empty</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</div>
              </div>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => changeQty(item.id, -1)}>−</button>
                <span className={styles.qty}>{item.qty}</span>
                <button className={styles.qtyBtn} onClick={() => changeQty(item.id, 1)}>+</button>
                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.total}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={checkout} disabled={loading}>
              {loading ? 'Placing order…' : 'Checkout →'}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
