import { useCart } from "../context/CartContext.jsx";
import { Btn } from "../components/UI.jsx";

export default function CartPage({ nav }) {
  const { cart, remove, setQty, total, clear } = useCart();

  if (!cart.length) return (
    <div style={{ maxWidth: 600, margin: "100px auto", textAlign: "center", padding: "0 32px" }}>
      <p style={{
        fontFamily: "'Bebas Neue', cursive",
        fontSize: 80, color: "var(--border)",
        letterSpacing: "0.05em", lineHeight: 1,
        marginBottom: 20,
      }}>ХООСОН</p>
      <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 14 }}>Сагс хоосон байна. Бүтээгдэхүүн нэмцгээе.</p>
      <Btn onClick={() => nav("home")}>ДЭЛГҮҮР РҮҮ ОЧИХ →</Btn>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 40, borderBottom: "1px solid var(--border)", paddingBottom: 20 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, letterSpacing: "0.05em" }}>
          САГС
        </h1>
        <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 14, color: "var(--muted)", letterSpacing: "0.1em" }}>
          {cart.length} БҮТЭЭГДЭХҮҮН
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 48 }}>
        {/* Items */}
        <div>
          {cart.map((item, i) => (
            <div key={item.id} style={{
              display: "flex", gap: 20, padding: "20px 0",
              borderBottom: "1px solid var(--border)",
              animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
            }}>
              <div style={{ width: 80, height: 80, overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }}>
                <img src={item.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160"}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Barlow Condensed'", fontSize: 17, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                  {item.name}
                </p>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>{item.price?.toLocaleString()}₮</p>
              </div>
              {/* Qty controls */}
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
                {[
                  { label: "−", action: () => setQty(item.id, item.qty - 1) },
                  { label: item.qty, action: null },
                  { label: "+", action: () => setQty(item.id, item.qty + 1) },
                ].map((b, i) => (
                  <button key={i} onClick={b.action} style={{
                    width: 34, height: 34, background: "none", border: "none",
                    color: b.action ? "var(--gold)" : "var(--text)",
                    cursor: b.action ? "crosshair" : "default",
                    fontFamily: "'Bebas Neue'", fontSize: 16,
                    borderRight: i < 2 ? "1px solid var(--border)" : "none",
                  }}>{b.label}</button>
                ))}
              </div>
              <div style={{ minWidth: 90, textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <p style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: "var(--gold)", letterSpacing: "0.03em" }}>
                  {(item.price * item.qty).toLocaleString()}₮
                </p>
                <button onClick={() => remove(item.id)} style={{
                  background: "none", border: "none", color: "var(--muted)",
                  fontSize: 10, cursor: "crosshair", letterSpacing: "0.15em",
                  fontFamily: "'Barlow Condensed'", fontWeight: 700,
                  transition: "color 0.12s", textTransform: "uppercase",
                }}
                  onMouseEnter={e => e.target.style.color = "var(--red)"}
                  onMouseLeave={e => e.target.style.color = "var(--muted)"}
                >УСТГАХ</button>
              </div>
            </div>
          ))}
          <button onClick={clear} style={{
            marginTop: 20, background: "none", border: "none",
            color: "var(--muted)", fontSize: 11, cursor: "crosshair",
            fontFamily: "'Barlow Condensed'", fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase",
            transition: "color 0.12s",
          }}
            onMouseEnter={e => e.target.style.color = "var(--red)"}
            onMouseLeave={e => e.target.style.color = "var(--muted)"}
          >
            САГС ЦЭВЭРЛЭХ
          </button>
        </div>

        {/* Summary */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          padding: 28, height: "fit-content",
        }}>
          <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: "0.05em", marginBottom: 20 }}>
            НИЙТ ДҮН
          </h3>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginBottom: 20 }}>
            {cart.map(i => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "var(--muted)", fontSize: 12 }}>{i.name} ×{i.qty}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{(i.price * i.qty).toLocaleString()}₮</span>
              </div>
            ))}
          </div>
          <div style={{
            borderTop: "1px solid var(--gold)", paddingTop: 16, marginBottom: 24,
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
          }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              НИЙТ
            </span>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 30, color: "var(--gold)", letterSpacing: "0.03em" }}>
              {total.toLocaleString()}₮
            </span>
          </div>
          <div style={{ color: "var(--green)", fontSize: 11, fontFamily: "'Barlow Condensed'", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 20 }}>
            ✓ ХҮРГЭЛТ ҮНЭГҮЙ
          </div>
          <Btn onClick={() => nav("checkout")} full>ЗАХИАЛАХ →</Btn>
          <button onClick={() => nav("home")} style={{
            display: "block", width: "100%", marginTop: 10, background: "none", border: "none",
            color: "var(--muted)", fontSize: 11, cursor: "crosshair", fontFamily: "'Barlow Condensed'",
            fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 0",
          }}>
            БУЦАХ
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
