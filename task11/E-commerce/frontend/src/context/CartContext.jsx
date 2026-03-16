import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart(c => {
      const existing = c.find(i => i.id === product.id)
      if (existing) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...c, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => setCart(c => c.filter(i => i.id !== id))

  const changeQty = (id, delta) => {
    setCart(c =>
      c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQty, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
