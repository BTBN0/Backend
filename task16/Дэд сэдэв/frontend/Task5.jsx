import { useState } from 'react';
import { useLog } from '../hooks/useLog';
import LogPanel from './LogPanel';
import { Btn, Chip, Row } from './UI';

export default function Task5() {
  const { entries, add, clear } = useLog();
  const [loading, setLoading] = useState(false);
  const [security, setSecurity] = useState(null);

  async function healthCheck() {
    setLoading(true);
    add('GET /api/health →', 'info');
    try {
      const r = await fetch('/api/health');
      const data = await r.json();
      if (data.success) {
        add(`✓ Status: <span style="color:var(--success)">${data.status}</span>`, 'success');
        add(`🌍 Environment: <span style="color:var(--accent)">${data.environment}</span>`, 'info');
        add(`⏱ Uptime: <span style="color:var(--accent)">${data.uptime}s</span>`, 'info');
        add(`🔐 Secret configured: <span style="color:var(--success)">${data.secretConfigured}</span>`, 'success');
        add('✓ Олон давхар хамгаалалт бүгд идэвхтэй!', 'success');
        setSecurity(data.security);
      }
    } catch (e) {
      add('✗ Сервертэй холбогдож чадсангүй', 'error');
    }
    setLoading(false);
  }

  const STACK = [
    { key: 'helmet',     label: 'Helmet Headers' },
    { key: 'rateLimit',  label: 'Rate Limiting' },
    { key: 'envSecrets', label: '.env Secrets' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Row gap={10}>
        <Btn onClick={healthCheck} loading={loading}>❤ Health Check</Btn>
        <Btn onClick={clear} variant="danger">↺ Clear</Btn>
      </Row>

      {security && (
        <Row gap={8} wrap>
          {STACK.map(s => (
            <Chip key={s.key} active={!!security[s.key]} color="var(--success)">
              {s.label}
            </Chip>
          ))}
          <Chip active color="var(--accent)">Nginx HTTPS config</Chip>
        </Row>
      )}

      <LogPanel entries={entries} onClear={clear} label="PRODUCTION STATUS" />

      {/* Nginx HTTPS config snippet */}
      <div style={{
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 8, overflow: 'hidden',
      }}>
        <div style={{
          padding: '7px 14px', borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
          letterSpacing: 2, background: 'rgba(0,0,0,0.3)',
        }}>
          ● NGINX HTTPS CONFIG (task5/nginx-https.conf)
        </div>
        <pre style={{
          padding: '14px', fontFamily: 'var(--mono)', fontSize: 11,
          lineHeight: 1.75, color: '#6870a0', overflowX: 'auto',
        }}>{`# HTTP → HTTPS redirect (Bonus)
server {
    listen 80;
    return 301 https://$host$request_uri;
}

# HTTPS + SSL + Rate limiting
server {
    listen 443 ssl http2;
    ssl_certificate  /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    add_header Strict-Transport-Security
        "max-age=31536000" always;

    location /api/ {
        limit_req zone=api_limit burst=5 nodelay;
        proxy_pass http://localhost:3000;
    }
}`}</pre>
      </div>
    </div>
  );
}
