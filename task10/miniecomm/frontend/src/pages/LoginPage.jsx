import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Btn, Field, Alert } from "../components/UI.jsx";

export default function LoginPage({ nav }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const submit = async () => {
    if (!email || !password) return setError("Бүх талбарыг бөглөнө үү");
    setLoading(true); setError("");
    try {
      const data = await login(email, password);
      nav(data.user.role === "admin" ? "admin" : "home");
    } catch (err) {
      setError(err.response?.data?.error || "Нэвтрэхэд алдаа гарлаа");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "48px 32px",
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}>
        {/* Header */}
        <div style={{
          background: "var(--gold)", padding: "20px 32px",
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 32, letterSpacing: "0.05em", color: "#0a0a0a",
        }}>
          НЭВТРЭХ
        </div>

        <div style={{ padding: 32 }}>
          {error && <Alert>{error}</Alert>}
          <Field label="Имэйл" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Field label="Нууц үг" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <div style={{ marginBottom: 20 }} />
          <Btn onClick={submit} disabled={loading} full>
            {loading ? "НЭВТЭРЧ БАЙНА..." : "НЭВТРЭХ →"}
          </Btn>
          <p style={{
            textAlign: "center", marginTop: 20,
            fontSize: 12, color: "var(--muted)",
            fontFamily: "'Barlow Condensed'", letterSpacing: "0.1em",
          }}>
            БҮРТГЭЛГҮЙ ЮУ?{" "}
            <span onClick={() => nav("register")} style={{
              color: "var(--gold)", cursor: "crosshair", fontWeight: 700,
            }}>
              БҮРТГҮҮЛЭХ
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
