import React from 'react'

function hl(str) {
  return str.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    m => {
      if (/^"/.test(m)) return /:$/.test(m)
        ? `<span style="color:#00e5ff">${m}</span>`
        : `<span style="color:#00e887">${m}</span>`
      if (/true|false/.test(m)) return `<span style="color:#9b59ff">${m}</span>`
      if (/null/.test(m))       return `<span style="color:#4a5878">${m}</span>`
      return `<span style="color:#ffa502">${m}</span>`
    }
  )
}

export default function JsonViewer({ data, status, ms }) {
  const ok   = status >= 200 && status < 300
  const none = status === 0
  const cfg  = none
    ? { bar: 'rgba(255,165,2,0.15)',   dot: '#ffa502', label: 'NO CONNECTION' }
    : ok
    ? { bar: 'rgba(0,232,135,0.12)',   dot: '#00e887', label: `${status} OK` }
    : { bar: 'rgba(255,71,87,0.12)',   dot: '#ff4757', label: `${status} ERROR` }

  return (
    <div style={{
      borderRadius: 10, overflow: 'hidden',
      border: '1px solid var(--border)',
      animation: 'slideIn .2s ease',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 12px', background: cfg.bar,
        fontFamily: 'var(--mono)', fontSize: 11,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
          background: cfg.dot, boxShadow: `0 0 8px ${cfg.dot}`,
          animation: ok ? 'glow 2s infinite' : 'none',
        }} />
        <span style={{ flex: 1, color: cfg.dot, fontWeight: 400 }}>{cfg.label}</span>
        <span style={{ color: 'var(--text3)' }}>{ms}ms</span>
      </div>
      <pre style={{
        background: 'rgba(0,0,0,0.4)', padding: '12px 14px',
        fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.8,
        overflowX: 'auto', maxHeight: 260, overflowY: 'auto',
        whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'var(--text)',
      }}
        dangerouslySetInnerHTML={{ __html: hl(JSON.stringify(data, null, 2)) }}
      />
    </div>
  )
}
