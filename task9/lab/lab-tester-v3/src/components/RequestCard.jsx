import React, { useState } from 'react'
import GlassCard from './GlassCard'
import JsonViewer from './JsonViewer'

const METHOD_CFG = {
  GET:  { color: '#00e887', label: 'GET'  },
  POST: { color: '#00e5ff', label: 'POST' },
}

export default function RequestCard({
  method = 'GET', path, badge, badgeColor = '#00e5ff',
  showBody, defaultBody, responseId, response, onSend, children,
}) {
  const [body, setBody] = useState(defaultBody ? JSON.stringify(defaultBody, null, 2) : '')
  const [busy, setBusy] = useState(false)
  const mc = METHOD_CFG[method]

  const handle = async () => {
    setBusy(true)
    let parsed
    if (showBody) {
      try { parsed = JSON.parse(body) }
      catch { alert('JSON алдаатай'); setBusy(false); return }
    }
    await onSend(responseId, parsed)
    setBusy(false)
  }

  return (
    <GlassCard style={{ overflow: 'hidden' }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 400,
          padding: '2px 8px', borderRadius: 4,
          border: `1px solid ${mc.color}55`,
          color: mc.color, background: `${mc.color}11`,
          letterSpacing: 1, flexShrink: 0,
        }}>{mc.label}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)', flex: 1 }}>{path}</span>
        {badge && (
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10,
            color: badgeColor, letterSpacing: .5,
          }}>{badge}</span>
        )}
      </div>

      {/* body */}
      <div style={{ padding: 14 }}>
        {children}
        {showBody && (
          <div style={{ marginBottom: 12 }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)',
              letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5,
            }}>Body</div>
            <textarea
              value={body} onChange={e => setBody(e.target.value)} rows={4}
              style={{
                width: '100%', resize: 'vertical',
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--cyan)',
                fontFamily: 'var(--mono)', fontSize: 12.5,
                padding: '10px 12px', outline: 'none', lineHeight: 1.7,
                transition: 'border-color .2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        )}

        {/* Send button */}
        <button onClick={handle} disabled={busy} style={{
          width: '100%', padding: '10px 0',
          background: busy
            ? 'rgba(0,229,255,0.08)'
            : 'linear-gradient(135deg, rgba(0,229,255,0.18), rgba(155,89,255,0.18))',
          border: '1px solid rgba(0,229,255,0.3)',
          borderRadius: 8,
          color: busy ? 'var(--text3)' : 'var(--cyan)',
          fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
          cursor: busy ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all .2s', letterSpacing: .5,
        }}
          onMouseEnter={e => { if (!busy) { e.target.style.background = 'linear-gradient(135deg, rgba(0,229,255,0.28), rgba(155,89,255,0.28))'; e.target.style.boxShadow = '0 0 20px rgba(0,229,255,0.2)' } }}
          onMouseLeave={e => { if (!busy) { e.target.style.background = 'linear-gradient(135deg, rgba(0,229,255,0.18), rgba(155,89,255,0.18))'; e.target.style.boxShadow = 'none' } }}
        >
          {busy ? (
            <><span style={{ width: 12, height: 12, border: '2px solid rgba(0,229,255,0.3)', borderTopColor: 'var(--cyan)', borderRadius: '50%', display: 'inline-block', animation: 'spin .65s linear infinite' }} /> SENDING</>
          ) : '▶  EXECUTE'}
        </button>

        {response && !response.loading && (
          <div style={{ marginTop: 12 }}>
            <JsonViewer data={response.data} status={response.status} ms={response.ms} />
          </div>
        )}
      </div>
    </GlassCard>
  )
}
