import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 20,
      padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      <img
        src={item.imageUrl} alt={item.name}
        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(212,175,55,0.2)" }}
      />
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: "0 0 4px", color: "#f0ece4", fontFamily: "'Playfair Display', serif", fontSize: 15 }}>
          {item.name}
        </h4>
        <p style={{ margin: 0, color: "#d4af37", fontWeight: 700, fontSize: 14 }}>
          {item.price.toLocaleString()}₮
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid rgba(212,175,55,0.3)", background: "transparent", color: "#d4af37", cursor: "pointer", fontSize: 16 }}
        >−</button>
        <span style={{ color: "#f0ece4", fontWeight: 600, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid rgba(212,175,55,0.3)", background: "transparent", color: "#d4af37", cursor: "pointer", fontSize: 16 }}
        >+</button>
      </div>
      <span style={{ color: "#f0ece4", fontWeight: 700, minWidth: 80, textAlign: "right" }}>
        {(item.price * item.quantity).toLocaleString()}₮
      </span>
      <button
        onClick={() => removeFromCart(item.id)}
        style={{ background: "none", border: "none", color: "rgba(192,57,43,0.7)", cursor: "pointer", fontSize: 18, padding: 4, transition: "color 0.2s" }}
        onMouseEnter={e => e.target.style.color = "#c0392b"}
        onMouseLeave={e => e.target.style.color = "rgba(192,57,43,0.7)"}
      >✕</button>
    </div>
  );
}
