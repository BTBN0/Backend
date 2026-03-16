import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, nav }) {
  const { add } = useCart();
  const [hover, setHover] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    add(product);
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  return (
    <div
      onClick={() => nav("product", { id: product.id })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface)",
        border: `1px solid ${hover ? "var(--gold)" : "var(--border)"}`,
        cursor: "crosshair",
        transition: "border-color 0.15s",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", paddingTop: "100%" }}>
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
          alt={product.name}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s",
            transform: hover ? "scale(1.08)" : "scale(1)",
            filter: hover ? "brightness(0.6)" : "brightness(0.75)",
          }}
        />
        {/* Overlay on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)",
        }} />
        {/* Category tag */}
        {product.category && (
          <div style={{
            position: "absolute", top: 12, left: 0,
            background: "var(--gold)", color: "#0a0a0a",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "3px 10px 3px 12px",
          }}>
            {product.category}
          </div>
        )}
        {/* Number */}
        <div style={{
          position: "absolute", top: 10, right: 12,
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 11, color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.1em",
        }}>
          #{String(product.id).padStart(3, "0")}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 16px 14px" }}>
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 18, fontWeight: 700,
          letterSpacing: "0.05em", textTransform: "uppercase",
          color: "var(--text)", marginBottom: 4,
          lineHeight: 1.2,
        }}>
          {product.name}
        </p>
        <p style={{
          fontSize: 12, color: "var(--muted)",
          lineHeight: 1.5, marginBottom: 14,
          fontWeight: 300,
        }}>
          {product.description?.substring(0, 50)}…
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 26, color: "var(--gold)",
            letterSpacing: "0.03em",
          }}>
            {product.price?.toLocaleString()}₮
          </span>
          <button
            onClick={handleAdd}
            style={{
              background: flash ? "var(--green)" : "var(--gold)",
              color: "#0a0a0a", border: "none",
              padding: "8px 16px", cursor: "crosshair",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.15em",
              transition: "background 0.2s",
              textTransform: "uppercase",
            }}
          >
            {flash ? "✓ НЭМЭГДЛЭЭ" : "+ САГС"}
          </button>
        </div>
      </div>
    </div>
  );
}
