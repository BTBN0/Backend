import React, { useState } from 'react'

export default function LabPanel({ tabs, activeColor = '#00e5ff' }) {
  const [active, setActive] = useState(0)
  const tab = tabs[active]

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 4, flexWrap: 'wrap',
        marginBottom: 24,
        padding: '6px',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        backdropFilter: 'blur(12px)',
      }}>
        {tabs.map((t, i) => {
          const isActive = i === active
          return (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: '8px 16px',
              background: isActive
                ? `linear-gradient(135deg, ${t.color || activeColor}33, ${t.color || activeColor}18)`
                : 'transparent',
              border: isActive ? `1px solid ${t.color || activeColor}55` : '1px solid transparent',
              borderRadius: 10,
              color: isActive ? (t.color || activeColor) : 'var(--text3)',
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', letterSpacing: .5,
              transition: 'all .2s',
              whiteSpace: 'nowrap',
              boxShadow: isActive ? `0 0 14px ${t.color || activeColor}22` : 'none',
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text2)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text3)' }}
            >
              <span style={{ marginRight: 6, fontFamily: 'var(--mono)', fontSize: 10, opacity: .6 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Active panel */}
      <div key={active} style={{ animation: 'fadeUp .3s ease' }}>
        {/* Panel heading */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10,
            color: tab.color || activeColor,
            letterSpacing: 2, textTransform: 'uppercase',
            padding: '3px 10px',
            border: `1px solid ${tab.color || activeColor}44`,
            borderRadius: 4,
            background: `${tab.color || activeColor}11`,
          }}>
            LAB {String(active + 1).padStart(2, '0')}
          </div>
          <h2 style={{
            fontFamily: 'var(--sans)', fontSize: 22, fontWeight: 600,
            color: 'var(--text)', letterSpacing: -.3,
          }}>{tab.title}</h2>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>
            {tab.subtitle}
          </span>
        </div>

        {tab.content}
      </div>
    </div>
  )
}
