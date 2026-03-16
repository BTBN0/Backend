import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { productApi, orderApi } from "../api/index.js";
import { Btn, Field, Alert, Spinner } from "../components/UI.jsx";

export default function AdminDashboard({ nav }) {
  const { user } = useAuth();
  const [tab,      setTab]      = useState("products");
  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState({ name: "", description: "", price: "", imageUrl: "", category: "" });
  const [error,    setError]    = useState("");
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [pr, or] = await Promise.all([productApi.getAll(), orderApi.getAll()]);
      setProducts(pr.data); setOrders(or.data);
    } catch {}
    setLoading(false);
  };

  if (!user || user.role !== "admin") return (
    <div style={{ textAlign: "center", padding: 100 }}>
      <Alert>АДМИН ЭРХ ШААРДЛАГАТАЙ</Alert>
      <Btn onClick={() => nav("home")}>БУЦАХ</Btn>
    </div>
  );

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", imageUrl: "", category: "" });
    setShowForm(true); setError("");
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", price: String(p.price), imageUrl: p.imageUrl || "", category: p.category || "" });
    setShowForm(true); setError("");
  };
  const save = async () => {
    if (!form.name || !form.price) return setError("Нэр болон үнэ заавал байх ёстой");
    setSaving(true);
    try {
      if (editing) {
        const { data } = await productApi.update(editing.id, { ...form, price: Number(form.price) });
        setProducts(products.map(p => p.id === editing.id ? data : p));
      } else {
        const { data } = await productApi.create({ ...form, price: Number(form.price) });
        setProducts([data, ...products]);
      }
      setShowForm(false); setEditing(null);
    } catch (err) { setError(err.response?.data?.error || "Алдаа гарлаа"); }
    setSaving(false);
  };
  const del = async (id) => {
    if (!confirm("Устгах уу?")) return;
    try { await productApi.remove(id); setProducts(products.filter(p => p.id !== id)); } catch {}
  };
  const changeStatus = async (id, status) => {
    try {
      const { data } = await orderApi.updateStatus(id, status);
      setOrders(orders.map(o => o.id === id ? { ...o, status: data.status } : o));
    } catch {}
  };

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.totalPrice, 0);
  const statusColor = { pending: "#f59e0b", processing: "#3b82f6", delivered: "#10b981", cancelled: "#ef4444" };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 32px" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24, marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, letterSpacing: "0.05em", lineHeight: 1 }}>
            ХЯНАЛТЫН<br /><span style={{ color: "var(--gold)" }}>САМБАР</span>
          </h1>
        </div>
        <p style={{ fontFamily: "'Barlow Condensed'", fontSize: 12, color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {user.name.toUpperCase()} — ADMIN
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--border)", marginBottom: 40 }}>
        {[
          { label: "БҮТЭЭГДЭХҮҮН", value: products.length },
          { label: "ЗАХИАЛГА",      value: orders.length },
          { label: "ОРЛОГО",        value: totalRevenue.toLocaleString() + "₮" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--surface)", padding: "28px 32px" }}>
            <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "var(--gold)", letterSpacing: "0.03em", lineHeight: 1, marginBottom: 4 }}>
              {s.value}
            </p>
            <p style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "1px solid var(--border)" }}>
        {[["products", "БҮТЭЭГДЭХҮҮН"], ["orders", "ЗАХИАЛГА"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "12px 24px", border: "none", cursor: "crosshair",
            fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: tab === t ? "var(--gold)" : "transparent",
            color: tab === t ? "#0a0a0a" : "var(--muted)",
            transition: "all 0.12s",
          }}>{label}</button>
        ))}
      </div>

      {loading ? <Spinner /> : tab === "products" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <p style={{ fontFamily: "'Barlow Condensed'", fontSize: 12, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {products.length} бүтээгдэхүүн
            </p>
            <Btn onClick={openNew}>+ НЭМЭХ</Btn>
          </div>

          {showForm && (
            <div style={{ background: "var(--bg2)", border: "1px solid var(--gold)", padding: 28, marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: "0.05em", color: "var(--gold)", marginBottom: 20 }}>
                {editing ? "ЗАСАХ" : "ШИНЭ БҮТЭЭГДЭХҮҮН"}
              </h3>
              {error && <Alert>{error}</Alert>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                <Field label="Нэр"         value={form.name}        onChange={e => set("name",        e.target.value)} required />
                <Field label="Үнэ (₮)"    type="number" value={form.price}  onChange={e => set("price",       e.target.value)} required />
                <Field label="Ангилал"    value={form.category}    onChange={e => set("category",    e.target.value)} />
                <Field label="Зургийн URL" value={form.imageUrl}   onChange={e => set("imageUrl",    e.target.value)} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed'", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)" }}>ТАЙЛБАР</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
                  style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", padding: "10px 14px", fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "var(--gold)"}
                  onBlur={e  => e.target.style.borderColor = "var(--border)"}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn onClick={save} disabled={saving}>{saving ? "ХАДГАЛЖ БАЙНА..." : "ХАДГАЛАХ"}</Btn>
                <Btn variant="ghost" onClick={() => setShowForm(false)}>БОЛИХ</Btn>
              </div>
            </div>
          )}

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg2)" }}>
                {["БҮТЭЭГДЭХҮҮН", "АНГИЛАЛ", "ҮНЭ", "ОГНОО", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "'Barlow Condensed'", fontSize: 10, letterSpacing: "0.2em", color: "var(--muted)", fontWeight: 700, borderBottom: "1px solid var(--border)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }}>
                      <img src={p.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80"} alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }} />
                    </div>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, letterSpacing: "0.05em" }}>{p.name.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: "14px", color: "var(--muted)", fontFamily: "'Barlow Condensed'", letterSpacing: "0.05em" }}>{p.category || "—"}</td>
                  <td style={{ padding: "14px", fontFamily: "'Bebas Neue'", fontSize: 18, color: "var(--gold)", letterSpacing: "0.03em" }}>{p.price?.toLocaleString()}₮</td>
                  <td style={{ padding: "14px", color: "var(--muted)", fontSize: 12 }}>{p.createdAt?.split("T")[0]}</td>
                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn small variant="ghost" onClick={() => openEdit(p)}>ЗАСАХ</Btn>
                      <Btn small variant="danger" onClick={() => del(p.id)}>УСТГАХ</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <p style={{ fontFamily: "'Barlow Condensed'", fontSize: 12, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>
            {orders.length} захиалга
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg2)" }}>
                {["#", "ХЭРЭГЛЭГЧ", "ДҮН", "СТАТУС", "ОГНОО", "СОЛИХ"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "'Barlow Condensed'", fontSize: 10, letterSpacing: "0.2em", color: "var(--muted)", fontWeight: 700, borderBottom: "1px solid var(--border)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px", color: "var(--muted)", fontFamily: "'Bebas Neue'", fontSize: 16 }}>
                    #{String(o.id).padStart(5, "0")}
                  </td>
                  <td style={{ padding: "14px", fontFamily: "'Barlow Condensed'", fontWeight: 700, letterSpacing: "0.05em" }}>
                    {(o.user?.name || "—").toUpperCase()}
                  </td>
                  <td style={{ padding: "14px", fontFamily: "'Bebas Neue'", fontSize: 18, color: "var(--gold)", letterSpacing: "0.03em" }}>
                    {o.totalPrice?.toLocaleString()}₮
                  </td>
                  <td style={{ padding: "14px" }}>
                    <span style={{
                      padding: "3px 10px", fontSize: 10, fontWeight: 700,
                      fontFamily: "'Barlow Condensed'", letterSpacing: "0.1em",
                      border: `1px solid ${statusColor[o.status]}`,
                      color: statusColor[o.status],
                      textTransform: "uppercase",
                    }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px", color: "var(--muted)", fontSize: 12 }}>{o.createdAt?.split("T")[0]}</td>
                  <td style={{ padding: "14px" }}>
                    <select value={o.status} onChange={e => changeStatus(o.id, e.target.value)}
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", padding: "7px 10px", fontSize: 11, fontFamily: "'Barlow Condensed'", fontWeight: 700, letterSpacing: "0.1em", cursor: "crosshair", outline: "none" }}>
                      {["pending", "processing", "delivered", "cancelled"].map(s =>
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
