import React, { useState } from 'react'

export function CheckList({ items, color = '#00e887' }) {
  return (
    <div style={{
      marginTop: 20, padding: '14px 16px',
      background: `${color}08`,
      border: `1px solid ${color}22`,
      borderRadius: 10,
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
        Checkpoint
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text2)', marginBottom: 5, lineHeight: 1.5 }}>
          <span style={{ color, flexShrink: 0 }}>✓</span>{item}
        </div>
      ))}
    </div>
  )
}

export function IdInput({ label, defaultValue, onChange }) {
  const [val, setVal] = useState(String(defaultValue ?? ''))
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
      <input value={val} onChange={e => { setVal(e.target.value); onChange?.(e.target.value) }}
        style={{
          width: '100%', background: 'rgba(0,0,0,0.35)',
          border: '1px solid var(--border)', borderRadius: 8,
          color: 'var(--cyan)', fontFamily: 'var(--mono)', fontSize: 13,
          padding: '8px 12px', outline: 'none', transition: 'border-color .2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}

export function CodeSnip({ children, color = 'var(--text3)' }) {
  return (
    <pre style={{
      background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 14px', marginBottom: 14,
      fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.8,
      color, overflowX: 'auto',
    }}>{children}</pre>
  )
}
