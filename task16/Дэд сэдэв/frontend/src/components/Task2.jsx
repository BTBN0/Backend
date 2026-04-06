import { useState } from 'react';
import { useLog } from '../hooks/useLog';
import LogPanel from './LogPanel';
import { Btn, Chip, Row } from './UI';

const HEADER_INFO = {
  'X-Frame-Options':       { desc: 'Clickjacking халдлагаас хамгаална', color: 'var(--success)' },
  'X-Content-Type-Options':{ desc: 'MIME sniffing халдлагаас хамгаална', color: 'var(--accent)' },
  'X-XSS-Protection':      { desc: 'Cross-site scripting халдлагаас хамгаална', color: 'var(--warn)' },
};

export default function Task2() {
  const { entries, add, clear } = useLog();
  const [headers, setHeaders] = useState({});
  const [loading, setLoading] = useState(false);

  async function checkHeaders() {
    setLoading(true);
    add('GET /api/info →', 'info');
    try {
      const r = await fetch('/api/info');
      const data = await r.json();
      setHeaders(data.headers || {});
      Object.entries(data.headers || {}).forEach(([k, v]) => {
        const info = HEADER_INFO[k];
        add(`<span style="color:var(--accent)">${k}</span>: <span style="color:var(--text)">${v}</span>`, 'success');
        if (info) add(`  → ${info.desc}`, 'info');
      });
      add('✓ Бүх security header-ууд идэвхтэй!', 'success');
    } catch (e) {
      add('✗ Сервертэй холбогдож чадсангүй', 'error');
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Row gap={10}>
        <Btn onClick={checkHeaders} loading={loading}>🔍 Header шалгах</Btn>
        <Btn onClick={clear} variant="danger">↺ Clear</Btn>
      </Row>

      {/* Active header chips */}
      {Object.keys(headers).length > 0 && (
        <Row gap={8}>
          {Object.keys(HEADER_INFO).map(k => (
            <Chip key={k} active={!!headers[k]} color="var(--success)">{k}</Chip>
          ))}
        </Row>
      )}

      <LogPanel entries={entries} onClear={clear} label="SECURITY HEADERS" />
    </div>
  );
}
