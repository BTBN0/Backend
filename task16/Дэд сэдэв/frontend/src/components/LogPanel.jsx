import { useEffect, useRef } from 'react';

const TYPE_STYLES = {
  success: { border: '#00e5a0', bg: 'rgba(0,229,160,0.06)', dot: '#00e5a0' },
  error:   { border: '#ff3d71', bg: 'rgba(255,61,113,0.06)', dot: '#ff3d71' },
  warn:    { border: '#ffb800', bg: 'rgba(255,184,0,0.06)',  dot: '#ffb800' },
  info:    { border: '#7b61ff', bg: 'rgba(123,97,255,0.06)', dot: '#7b61ff' },
};

export default function LogPanel({ entries, onClear, label = 'OUTPUT' }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 14px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.3)',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 2 }}>
          ● {label}
        </span>
        <button onClick={onClear} style={{
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
          background: 'none', border: 'none', cursor: 'pointer',
          letterSpacing: 1, padding: '2px 6px', borderRadius: 4,
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.target.style.color = 'var(--error)'}
          onMouseLeave={e => e.target.style.color = 'var(--muted)'}
        >
          CLR
        </button>
      </div>

      {/* Entries */}
      <div style={{
        padding: '10px',
        minHeight: 90,
        maxHeight: 240,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}>
        {entries.length === 0 && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', padding: '8px 4px' }}>
            <span style={{ marginRight: 8 }}>_</span>waiting for input...
          </div>
        )}
        {entries.map(e => {
          const s = TYPE_STYLES[e.type] || TYPE_STYLES.info;
          return (
            <div key={e.id} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.55,
              padding: '7px 10px', borderRadius: 6,
              background: s.bg, borderLeft: `2px solid ${s.border}`,
              animation: 'fadeUp 0.18s ease',
            }}>
              <span style={{ color: 'var(--muted)', flexShrink: 0, fontSize: 11 }}>{e.time}</span>
              <span style={{ flex: 1, wordBreak: 'break-all', color: 'var(--text)' }}
                dangerouslySetInnerHTML={{ __html: e.text }} />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
