import React from 'react'

export default function GlassCard({ children, style, glow, onClick }) {
  const glowColor = {
    cyan:   '0 0 30px rgba(0,229,255,0.15)',
    violet: '0 0 30px rgba(155,89,255,0.15)',
    green:  '0 0 30px rgba(0,232,135,0.15)',
    pink:   '0 0 30px rgba(255,79,163,0.15)',
    red:    '0 0 30px rgba(255,71,87,0.15)',
    amber:  '0 0 30px rgba(255,165,2,0.15)',
  }[glow] || 'none'

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: glowColor,
        transition: 'box-shadow .3s, border-color .3s',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border2)'
        if (glow) e.currentTarget.style.boxShadow = glowColor.replace('0.15', '0.3')
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = glowColor
      }}
    >
      {children}
    </div>
  )
}
