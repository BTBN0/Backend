import { useState } from 'react';

/* ── Button ── */
const BTN = {
  primary:   { bg: 'var(--accent)',  color: '#000', border: 'transparent', hover: '#00c8e0' },
  secondary: { bg: 'transparent', color: 'var(--text)', border: 'var(--border2)', hover: 'var(--border2)' },
  danger:    { bg: 'transparent', color: 'var(--error)', border: 'rgba(255,61,113,0.3)', hover: 'rgba(255,61,113,0.1)' },
  success:   { bg: 'transparent', color: 'var(--success)', border: 'rgba(0,229,160,0.3)', hover: 'rgba(0,229,160,0.1)' },
};

export function Btn({ children, onClick, variant = 'primary', disabled = false, loading = false }) {
  const [hov, setHov] = useState(false);
  const s = BTN[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
        letterSpacing: 1.2, textTransform: 'uppercase',
        padding: '9px 18px', border: `1px solid ${s.border}`,
        borderRadius: 7, cursor: disabled || loading ? 'not-allowed' : 'pointer',
        color: s.color,
        background: hov && !disabled ? s.hover : s.bg,
        transition: 'all 0.15s',
        opacity: disabled ? 0.45 : 1,
        display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
      }}
    >
      {loading && (
        <span style={{
          width: 10, height: 10, border: '2px solid currentColor',
          borderTopColor: 'transparent', borderRadius: '50%',
          display: 'inline-block', animation: 'spin 0.7s linear infinite',
        }} />
      )}
      {children}
    </button>
  );
}

/* ── StatBox ── */
export function StatBox({ value, label, color = 'var(--accent)' }) {
  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '12px 16px', flex: 1, minWidth: 90, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--display)', fontSize: 34, lineHeight: 1,
        color, marginBottom: 5, letterSpacing: 1,
      }}>
        {value}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

/* ── TextInput ── */
export function Input({ placeholder, value, onChange, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        flex: 1, minWidth: 130,
        background: 'var(--bg)',
        border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
        color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 13,
        padding: '9px 14px', borderRadius: 7, outline: 'none',
        transition: 'border-color 0.2s',
      }}
    />
  );
}

/* ── Row ── */
export function Row({ children, gap = 10, wrap = true }) {
  return (
    <div style={{ display: 'flex', gap, flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: 'center' }}>
      {children}
    </div>
  );
}

/* ── Chip ── */
export function Chip({ children, active, color = 'var(--accent)' }) {
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: 11,
      padding: '4px 10px', borderRadius: 6,
      border: `1px solid ${active ? color : 'var(--border)'}`,
      color: active ? color : 'var(--muted)',
      background: active ? `${color}14` : 'transparent',
      transition: 'all 0.2s',
    }}>
      {active ? '✓ ' : ''}{children}
    </span>
  );
}
