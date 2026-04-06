import { useState } from 'react';
import { useLog } from '../hooks/useLog';
import LogPanel from './LogPanel';
import { Btn, StatBox, Input, Row } from './UI';

export default function Task4() {
  const { entries, add, clear } = useLog();
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('wrongpass');
  const [fails, setFails]   = useState(0);
  const [remain, setRemain] = useState(5);
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | blocked | ok

  async function doLogin(user = username, pass = password) {
    setLoading(true);
    add(`POST /api/login → <span style="color:var(--accent)">${user}</span>`, 'info');
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await r.json();

      if (r.status === 200) {
        setFails(0); setRemain(5); setStatus('ok');
        add(`✓ ${data.message}`, 'success');
        add(`🔑 ${data.token}`, 'success');
      } else if (r.status === 429) {
        setStatus('blocked');
        add(`🚫 BLOCKED — ${data.message}`, 'error');
      } else {
        const newFails = fails + 1;
        setFails(newFails);
        setRemain(Math.max(0, 5 - newFails));
        setStatus('idle');
        add(`✗ ${r.status} — ${data.message}`, 'warn');
      }
    } catch (e) {
      add('✗ Сервертэй холбогдож чадсангүй', 'error');
    }
    setLoading(false);
  }

  async function autoAttack() {
    setAutoLoading(true);
    setPassword('wrongpass');
    add('💥 Brute-force халдлага эхэллээ...', 'warn');
    for (let i = 0; i < 6; i++) {
      await doLogin(username, 'wrongpass');
      await new Promise(r => setTimeout(r, 350));
    }
    setAutoLoading(false);
  }

  function reset() {
    setFails(0); setRemain(5); setStatus('idle'); clear();
  }

  const statusColor = status === 'ok' ? 'var(--success)' : status === 'blocked' ? 'var(--error)' : 'var(--muted)';
  const statusText  = status === 'ok' ? 'НЭВТЭРСЭН' : status === 'blocked' ? 'БЛОКЛОГДСОН' : 'ХҮЛЭЭЖ БУЙ';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats */}
      <Row gap={10}>
        <StatBox value={fails}              label="Буруу оролдлого" color="var(--error)" />
        <StatBox value={Math.max(0,remain)} label="Үлдсэн"          color="var(--warn)" />
        <div style={{
          flex: 1, minWidth: 90, background: 'var(--bg)',
          border: `1px solid ${statusColor}30`,
          borderRadius: 8, padding: '12px 16px', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--display)', fontSize: 20, lineHeight: 1,
            color: statusColor, marginBottom: 5, letterSpacing: 1,
          }}>
            {statusText}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: 1.5 }}>
            СТАТУС
          </div>
        </div>
      </Row>

      {/* Hint */}
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
        ✓ Зөв: <span style={{ color: 'var(--accent)' }}>alice/password123</span> &nbsp;·&nbsp;
        <span style={{ color: 'var(--accent)' }}>bob/securepass456</span>
      </div>

      {/* Inputs */}
      <Row gap={10}>
        <Input placeholder="username" value={username} onChange={setUsername} />
        <Input placeholder="password" value={password} onChange={setPassword} type="password" />
      </Row>

      <Row gap={10}>
        <Btn onClick={() => doLogin()} loading={loading}>🔐 Нэвтрэх</Btn>
        <Btn onClick={autoAttack} variant="secondary" loading={autoLoading}>💥 Brute-force</Btn>
        <Btn onClick={reset} variant="danger">↺ Reset</Btn>
      </Row>

      <LogPanel entries={entries} onClear={clear} label="LOGIN LOG" />
    </div>
  );
}
