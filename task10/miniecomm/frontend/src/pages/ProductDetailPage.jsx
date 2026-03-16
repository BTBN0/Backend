import { useState, useEffect } from "react";
import { productApi } from "../api/index.js";
import { useCart } from "../context/CartContext.jsx";
import { Btn, Spinner, Label } from "../components/UI.jsx";

export default function ProductDetailPage({ nav, productId }) {
  const [product, setProduct] = useState(null);
  const [qty,     setQty]     = useState(1);
  const [flash,   setFlash]   = useState(false);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    productApi.getOne(productId)
      .then(({ data }) => setProduct(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAdd = () => {
    add(product, qty);
    setFlash(true);
    setTimeout(() => setFlash(false), 1400);
  };

  if (loading) return <Spinner />;
  if (!product) return (
    <div style={{ textAlign: "center", padding: 100 }}>
      <p style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: "var(--muted)", letterSpacing: "0.1em" }}>
        ОЛДСОНГҮЙ
      </p>
      <button onClick={() => nav("home")} style={{ marginTop: 20, color: "var(--gold)", background: "none", border: "none", cursor: "crosshair", fontFamily: "'Barlow Condensed'", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em" }}>
        ← БУЦАХ
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
      <button onClick={() => nav("home")} style={{
        background: "none", border: "none", color: "var(--muted)",
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700, fontSize: 12, letterSpacing: "0.2em",
        cursor: "crosshair", marginBottom: 40,
        textTransform: "uppercase",
        display: "flex", alignItems: "center", gap: 8,
        transition: "color 0.12s",
      }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
      >
        ← БУЦАХ
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
        {/* Image */}
        <div style={{ position: "relative", border: "1px solid var(--border)", overflow: "hidden" }}>
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}
            alt={product.name}
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", filter: "brightness(0.85)" }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "12px 16px",
            background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)",
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 12, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)",
          }}>
            #{String(product.id).padStart(3, "0")} — {product.category || "БҮТЭЭГДЭХҮҮН"}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.category && <Label>{product.category}</Label>}
          <h1 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "clamp(40px, 5vw, 68px)",
            lineHeight: 0.95, letterSpacing: "0.03em",
            color: "var(--text)", margin: "20px 0 16px",
            textTransform: "uppercase",
          }}>
            {product.name}
          </h1>

          <p style={{
            color: "var(--muted)", lineHeight: 1.8,
            fontSize: 14, fontWeight: 300, marginBottom: 32,
          }}>
            {product.description}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)", marginBottom: 28 }} />

          <div style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 52, color: "var(--gold)",
            letterSpacing: "0.03em", marginBottom: 32, lineHeight: 1,
          }}>
            {product.price?.toLocaleString()}₮
          </div>

          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{
              fontFamily: "'Barlow Condensed'", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase",
            }}>ТОО</span>
            <div style={{ display: "flex", border: "1px solid var(--border)" }}>
              {[
                { label: "−", action: () => setQty(Math.max(1, qty - 1)) },
                { label: qty, action: null },
                { label: "+", action: () => setQty(qty + 1) },
              ].map((b, i) => (
                <button key={i} onClick={b.action} style={{
                  width: 40, height: 40, background: "none", border: "none",
                  color: b.action ? "var(--gold)" : "var(--text)",
                  cursor: b.action ? "crosshair" : "default",
                  fontFamily: "'Bebas Neue', cursive", fontSize: 18,
                  borderRight: i < 2 ? "1px solid var(--border)" : "none",
                }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Btn onClick={handleAdd} full>
              {flash ? "✓ САГСАНД НЭМЭГДЛЭЭ" : "САГСАНД НЭМЭХ"}
            </Btn>
            <Btn variant="outline" onClick={() => { add(product, qty); nav("checkout"); }}>
              ЗАХИАЛАХ
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
