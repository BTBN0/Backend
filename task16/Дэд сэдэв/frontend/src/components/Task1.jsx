import { useState } from 'react';
import { useLog } from '../hooks/useLog';
import LogPanel from './LogPanel';
import { Btn, StatBox, Row } from './UI';

export default function Task1() {
  const { entries, add, clear } = useLog();
  const [ok, setOk] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [remain, setRemain] = useState(5);
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);

  async function sendRequest() {
    setLoading(true);
    add('GET /api/test →', 'info');
    try {
      const r = await fetch('/api/test');
      const data = await r.json();
      if (r.status === 200) {
        setOk(v => v + 1);
        setRemain(v => Math.max(0, v - 1));
        add(`✓ ${r.status} — ${data.message}`, 'success');
      } else {
        setBlocked(v => v + 1);
        add(`✗ ${r.status} — ${data.message}`, 'error');
      }
    } catch (e) {
      add(`✗ Сервертэй холбогдож чадсангүй`, 'error');
    }
    setLoading(false);
  }

  async function autoFire() {
    setAutoLoading(true);
    add('⚡ 6 request дараалан явуулж байна...', 'warn');
    for (let i = 0; i < 6; i++) {
      await sendRequest();
      await new Promise(r => setTimeout(r, 250));
    }
    setAutoLoading(false);
  }

  function reset() {
    setOk(0); setBlocked(0); setRemain(5); clear();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats */}
      <Row gap={10}>
        <StatBox value={ok}      label="Амжилттай" color="var(--success)" />
        <StatBox value={blocked} label="Блоклогдсон" color="var(--error)" />
        <StatBox value={Math.max(0, remain)} label="Үлдсэн" color="var(--warn)" />
      </Row>

      {/* Controls */}
      <Row gap={10}>
        <Btn onClick={sendRequest}  loading={loading}>▶ GET /api/test</Btn>
        <Btn onClick={autoFire} variant="secondary" loading={autoLoading}>⚡ 6× дараалан</Btn>
        <Btn onClick={reset}    variant="danger">↺ Reset</Btn>
      </Row>

      <LogPanel entries={entries} onClear={clear} label="RATE LIMIT LOG" />
    </div>
  );
}
