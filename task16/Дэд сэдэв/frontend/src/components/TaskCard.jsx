import { useState } from 'react';

const LEVEL_STYLE = {
  easy:   { label: 'АМАРХАН', bg: 'rgba(0,229,160,0.1)',  color: '#00e5a0', border: 'rgba(0,229,160,0.25)' },
  medium: { label: 'ДУНД',    bg: 'rgba(255,184,0,0.1)',  color: '#ffb800', border: 'rgba(255,184,0,0.25)' },
  hard:   { label: 'ХЭЦҮҮ',   bg: 'rgba(255,61,113,0.1)', color: '#ff3d71', border: 'rgba(255,61,113,0.25)' },
};

export default function TaskCard({ num, title, level = 'easy', desc, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const lv = LEVEL_STYLE[level];

  return (
    <div style={{
      background: 'var(--card)',
      border: `1px solid ${open ? 'var(--border2)' : 'var(--border)'}`,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
      animation: 'fadeUp 0.4s both',
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px', cursor: 'pointer', userSelect: 'none',
          borderBottom: open ? '1px solid var(--border)' : 'none',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {/* Badge */}
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: 1.5, padding: '4px 10px', borderRadius: 5,
          background: lv.bg, color: lv.color,
          border: `1px solid ${lv.border}`, flexShrink: 0,
        }}>
          {lv.label}
        </span>

        {/* Title */}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>
            TASK {String(num).padStart(2, '0')}
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{title}</div>
        </div>

        {/* Chevron */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s', flexShrink: 0 }}>
          <path d="M3 6l5 5 5-5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Description */}
          {desc && (
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
              lineHeight: 1.75, padding: '11px 15px',
              background: 'rgba(255,255,255,0.02)',
              borderLeft: '2px solid var(--purple)', borderRadius: '0 6px 6px 0',
            }}
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          )}
          {children}
        </div>
      )}
    </div>
  );
}
