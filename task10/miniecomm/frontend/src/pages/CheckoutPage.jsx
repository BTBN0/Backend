import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { orderApi } from "../api/index.js";
import { Btn, Field, Alert } from "../components/UI.jsx";

export default function CheckoutPage({ nav }) {
  const { cart, total, clear } = useCart();
  const { user } = useAuth();
  const [form,    setForm]    = useState({ name: user?.name || "", email: user?.email || "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) return setError("Бүх талбарыг бөглөнө үү");
    if (!user) return nav("login");
    setLoading(true); setError("");
    try {
      const { data } = await orderApi.create({
        items: cart.map(i => ({ productId: i.id, quantity: i.qty, price: i.price })),
        totalPrice: total,
      });
      clear();
      setDone(data.id);
    } catch (err) {
      setError(err.response?.data?.error || "Захиалга хийхэд алдаа гарлаа");
    } finally { setLoading(false); }
  };

  if (done) return (
    <div style={{ maxWidth: 520, margin: "80px auto", textAlign: "center", padding: "0 32px" }}>
      <div style={{
        border: "1px solid var(--gold)",
        background: "var(--surface)", padding: "48px 40px",
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 80, color: "var(--gold)", lineHeight: 1, marginBottom: 16,
        }}>✓</div>
        <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36, letterSpacing: "0.05em", marginBottom: 8 }}>
          АМЖИЛТТАЙ!
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 4, fontSize: 14 }}>
          Захиалгын дугаар:
        </p>
        <p style={{ fontFamily: "'Bebas Neue'", fontSize: 32, color: "var(--gold)", marginBottom: 28 }}>
          #{String(done).padStart(5, "0")}
        </p>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 32 }}>
          Удахгүй холбоо барина.
        </p>
        <Btn onClick={() => nav("home")} full>ДЭЛГҮҮРТ БУЦАХ →</Btn>
      </div>
    </div>
  );

  if (!cart.length) { nav("cart"); return null; }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 32px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, letterSpacing: "0.05em", marginBottom: 40, borderBottom: "1px solid var(--border)", paddingBottom: 20 }}>
        ЗАХИАЛАХ
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 48 }}>
        <div>
          {!user && (
            <Alert type="info">
              <span onClick={() => nav("login")} style={{ color: "var(--gold)", cursor: "crosshair", fontWeight: 700 }}>
                НЭВТЭРЧ
              </span>{" "}
              орсны дараа захиалах боломжтой.
            </Alert>
          )}
          {error && <Alert>{error}</Alert>}
          <Field label="Нэр"   value={form.name}    onChange={e => set("name",    e.target.value)} required />
          <Field label="Имэйл" type="email" value={form.email}   onChange={e => set("email",   e.target.value)} required />
          <Field label="Утас"  type="tel"  value={form.phone}   onChange={e => set("phone",   e.target.value)} placeholder="+976 XXXX XXXX" required />
          <Field label="Хаяг"  value={form.address} onChange={e => set("address", e.target.value)} placeholder="Дүүрэг, хороо, байр, орц, давхар..." required />
          <Btn onClick={submit} disabled={loading} full>
            {loading ? "БОЛОВСРУУЛЖ БАЙНА..." : "ЗАХИАЛГА БАТЛАХ →"}
          </Btn>
        </div>

        {/* Summary */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 24, height: "fit-content" }}>
          <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: "0.05em", marginBottom: 16 }}>
            ЗАХИАЛГА
          </h3>
          {cart.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}>
              <span style={{ color: "var(--muted)" }}>{i.name} ×{i.qty}</span>
              <span style={{ fontWeight: 600 }}>{(i.price * i.qty).toLocaleString()}₮</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--gold)", paddingTop: 14, marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>НИЙТ</span>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: "var(--gold)" }}>{total.toLocaleString()}₮</span>
          </div>
        </div>
      </div>
    </div>
  );
}
