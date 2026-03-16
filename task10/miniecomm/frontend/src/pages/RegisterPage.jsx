import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Btn, Field, Alert } from "../components/UI.jsx";

export default function RegisterPage({ nav }) {
  const { register } = useAuth();
  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirm: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.email || !form.password) return setError("Бүх талбарыг бөглөнө үү");
    if (form.password !== form.confirm) return setError("Нууц үг тохирохгүй байна");
    if (form.password.length < 6) return setError("Нууц үг дор хаяж 6 тэмдэгт байх ёстой");
    setLoading(true); setError("");
    try {
      await register(form.name, form.email, form.password);
      nav("home");
    } catch (err) {
      setError(err.response?.data?.error || "Бүртгэлд алдаа гарлаа");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "48px 32px",
    }}>
      <div style={{ width: "100%", maxWidth: 460, background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div style={{
          background: "var(--gold)", padding: "20px 32px",
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 32, letterSpacing: "0.05em", color: "#0a0a0a",
        }}>
          БҮРТГҮҮЛЭХ
        </div>

        <div style={{ padding: 32 }}>
          {error && <Alert>{error}</Alert>}
          <Field label="Нэр"     value={form.name}     onChange={e => set("name",     e.target.value)} required />
          <Field label="Имэйл"   type="email" value={form.email}    onChange={e => set("email",    e.target.value)} required />
          <Field label="Нууц үг" type="password" value={form.password} onChange={e => set("password", e.target.value)} required />
          <Field label="Давтах"  type="password" value={form.confirm}  onChange={e => set("confirm",  e.target.value)} required />
          <Btn onClick={submit} disabled={loading} full>
            {loading ? "БҮРТГЭЖ БАЙНА..." : "БҮРТГҮҮЛЭХ →"}
          </Btn>
          <p style={{
            textAlign: "center", marginTop: 20,
            fontSize: 12, color: "var(--muted)",
            fontFamily: "'Barlow Condensed'", letterSpacing: "0.1em",
          }}>
            БҮРТГЭЛТЭЙ ЮУ?{" "}
            <span onClick={() => nav("login")} style={{ color: "var(--gold)", cursor: "crosshair", fontWeight: 700 }}>
              НЭВТРЭХ
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
