export function Btn({ children, onClick, variant = "primary", disabled, full, small, type = "button" }) {
  const base = {
    border: "none", cursor: disabled ? "not-allowed" : "crosshair",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
    fontSize: small ? 11 : 13,
    padding: small ? "6px 14px" : "12px 28px",
    width: full ? "100%" : "auto",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.12s",
    position: "relative", overflow: "hidden",
  };
  const variants = {
    primary: { background: "var(--gold)", color: "#0a0a0a" },
    outline: { background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)" },
    ghost:   { background: "var(--border)", color: "var(--text)" },
    danger:  { background: "transparent", border: "1px solid var(--red)", color: "var(--red)" },
    white:   { background: "var(--text)", color: "#0a0a0a" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => { if (!disabled) e.target.style.opacity = "0.8"; }}
      onMouseLeave={e => { if (!disabled) e.target.style.opacity = "1"; }}
    >
      {children}
    </button>
  );
}

export function Field({ label, type = "text", value, onChange, placeholder, required, error }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label style={{
          display: "block", marginBottom: 6,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: "var(--muted)",
        }}>
          {label}{required && <span style={{ color: "var(--gold)", marginLeft: 3 }}>*</span>}
        </label>
      )}
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        style={{
          width: "100%", boxSizing: "border-box",
          border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
          background: "var(--surface)", color: "var(--text)",
          padding: "11px 14px", fontSize: 14,
          outline: "none", transition: "border-color 0.15s",
          fontFamily: "'Barlow', sans-serif",
        }}
        onFocus={e => e.target.style.borderColor = "var(--gold)"}
        onBlur={e  => e.target.style.borderColor = error ? "var(--red)" : "var(--border)"}
      />
      {error && <p style={{ color: "var(--red)", fontSize: 11, marginTop: 4, letterSpacing: "0.05em" }}>{error}</p>}
    </div>
  );
}

export function Alert({ children, type = "error" }) {
  const map = {
    error:   { border: "var(--red)",   bg: "#1a0a0a", color: "#e07070" },
    success: { border: "var(--green)", bg: "#0a1a0a", color: "#70c070" },
    info:    { border: "var(--gold)",  bg: "#1a1400", color: "var(--gold)" },
  };
  const c = map[type];
  return (
    <div style={{
      background: c.bg, borderLeft: `3px solid ${c.border}`,
      padding: "10px 14px", color: c.color,
      fontSize: 13, marginBottom: 20,
      fontFamily: "'Barlow', sans-serif",
    }}>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <div style={{
        width: 28, height: 28,
        border: "2px solid var(--border)",
        borderTop: "2px solid var(--gold)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        margin: "0 auto 12px",
      }} />
      <p style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
        АЧААЛЛАЖ БАЙНА
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function Label({ children }) {
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
      textTransform: "uppercase",
      padding: "2px 8px",
      border: "1px solid var(--gold)",
      color: "var(--gold)",
    }}>
      {children}
    </span>
  );
}
