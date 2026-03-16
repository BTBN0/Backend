import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar({ nav, page }) {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "var(--bg)",
      borderBottom: "1px solid var(--border)",
    }}>
      {/* Top bar */}
      <div style={{
        background: "var(--gold)", padding: "4px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
          color: "#0a0a0a", textTransform: "uppercase",
        }}>
          🇲🇳 МОНГОЛ ХИЙЦИЙН БҮТЭЭГДЭХҮҮН — ЧАНАРТ БАТАЛГААТАЙ
        </p>
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
          color: "#0a0a0a",
        }}>
          {user ? `${user.name.toUpperCase()} — ${user.role.toUpperCase()}` : "ЗОЧИН ХЭРЭГЛЭГЧ"}
        </p>
      </div>

      {/* Main nav */}
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div onClick={() => nav("home")} style={{ cursor: "crosshair", display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 42, lineHeight: 1, color: "var(--gold)",
            letterSpacing: "0.05em",
          }}>BTBN</span>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.25em",
            color: "var(--muted)", textTransform: "uppercase",
          }}>MONGOL SHOP</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { label: "ДЭЛГҮҮР", page: "home" },
            ...(user?.role === "admin" ? [{ label: "ХЯНАЛТ", page: "admin" }] : []),
          ].map(l => (
            <button key={l.page} onClick={() => nav(l.page)} style={{
              background: page === l.page ? "var(--gold)" : "transparent",
              color: page === l.page ? "#0a0a0a" : "var(--muted)",
              border: "none", padding: "8px 16px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 12, letterSpacing: "0.15em",
              cursor: "crosshair", transition: "all 0.12s",
            }}
              onMouseEnter={e => { if (page !== l.page) { e.target.style.color = "var(--text)"; } }}
              onMouseLeave={e => { if (page !== l.page) { e.target.style.color = "var(--muted)"; } }}
            >
              {l.label}
            </button>
          ))}

          <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 12px" }} />

          {user ? (
            <button onClick={logout} style={{
              background: "transparent", color: "var(--muted)",
              border: "1px solid var(--border)", padding: "7px 14px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.15em",
              cursor: "crosshair", transition: "all 0.12s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "var(--red)"; e.target.style.color = "var(--red)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--muted)"; }}
            >
              ГАРАХ
            </button>
          ) : (
            <>
              <button onClick={() => nav("login")} style={{
                background: "transparent", color: "var(--muted)",
                border: "none", padding: "7px 14px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, fontSize: 12, letterSpacing: "0.15em", cursor: "crosshair",
              }}>НЭВТРЭХ</button>
              <button onClick={() => nav("register")} style={{
                background: "transparent", color: "var(--gold)",
                border: "1px solid var(--gold)", padding: "7px 14px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, fontSize: 12, letterSpacing: "0.15em", cursor: "crosshair",
              }}>БҮРТГҮҮЛЭХ</button>
            </>
          )}

          {/* Cart */}
          <button onClick={() => nav("cart")} style={{
            background: "var(--gold)", color: "#0a0a0a",
            border: "none", padding: "10px 18px",
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: 12, letterSpacing: "0.15em",
            cursor: "crosshair", marginLeft: 8,
            transition: "opacity 0.12s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
            </svg>
            САГС
            {count > 0 && (
              <span style={{
                background: "#0a0a0a", color: "var(--gold)",
                borderRadius: "50%", width: 18, height: 18, fontSize: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900,
              }}>{count}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
