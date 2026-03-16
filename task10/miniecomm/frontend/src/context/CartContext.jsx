import { createContext, useContext, useState, useEffect } from "react";

const Ctx = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("cart")) || []); } catch {}
  }, []);

  const save = (c) => { setCart(c); localStorage.setItem("cart", JSON.stringify(c)); };
  const add  = (product, qty = 1) => {
    const ex = cart.find(i => i.id === product.id);
    save(ex ? cart.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
            : [...cart, { ...product, qty }]);
  };
  const remove = (id)      => save(cart.filter(i => i.id !== id));
  const setQty = (id, qty) => qty <= 0 ? remove(id) : save(cart.map(i => i.id === id ? { ...i, qty } : i));
  const clear  = ()        => save([]);

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return <Ctx.Provider value={{ cart, add, remove, setQty, clear, count, total }}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
