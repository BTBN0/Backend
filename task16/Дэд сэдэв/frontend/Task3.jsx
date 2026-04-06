import { useState } from 'react';
import { Btn, Chip, Row } from './UI';

const NGINX_CONFIG = `limit_req_zone $binary_remote_addr \\
  zone=api_limit:10m rate=2r/s;

server {
    listen 80;
    server_name localhost;

    location /api/ {
        limit_req zone=api_limit
                  burst=5 nodelay;
        limit_req_status 429;

        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP
                  $remote_addr;
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}`;

function highlight(code) {
  return code
    .replace(/(limit_req_zone|limit_req|location|server|proxy_pass|proxy_set_header|listen|server_name|limit_req_status)/g,
      '<span style="color:#7b61ff">$1</span>')
    .replace(/(\$[a-z_]+)/g, '<span style="color:#ff3d71">$1</span>')
    .replace(/(#[^\n]*)/g, '<span style="color:#4a5280">$1</span>')
    .replace(/(\d+[a-z]*r\/s|\d+m|\b\d+\b)/g, '<span style="color:#ffb800">$1</span>')
    .replace(/(http:\/\/[^\s;]+)/g, '<span style="color:#00e5a0">$1</span>');
}

export default function Task3() {
  const [shown, setShown] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Row gap={10}>
        <Btn onClick={() => setShown(v => !v)} variant={shown ? 'secondary' : 'primary'}>
          {shown ? '▲ Нуух' : '📄 Config харах'}
        </Btn>
      </Row>

      {shown && (
        <>
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{
              padding: '7px 14px', borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
              letterSpacing: 2, background: 'rgba(0,0,0,0.3)',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <span style={{ color: '#ff3d71' }}>●</span>
              <span style={{ color: '#ffb800' }}>●</span>
              <span style={{ color: '#00e5a0' }}>●</span>
              <span style={{ marginLeft: 8 }}>nginx.conf</span>
            </div>
            <pre style={{
              padding: '18px', fontFamily: 'var(--mono)', fontSize: 12,
              lineHeight: 1.8, color: '#8890b8', overflowX: 'auto',
              whiteSpace: 'pre-wrap',
            }}
              dangerouslySetInnerHTML={{ __html: highlight(NGINX_CONFIG) }}
            />
          </div>

          <Row gap={8} wrap>
            {['limit_req_zone', 'burst=5 nodelay', '2r/s rate', 'proxy_pass', '429 status', 'reverse proxy'].map(t => (
              <Chip key={t} active>{t}</Chip>
            ))}
          </Row>

          <div style={{
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)',
            lineHeight: 1.9, padding: '12px 16px',
            background: 'rgba(255,255,255,0.02)',
            borderLeft: '2px solid var(--warn)', borderRadius: '0 6px 6px 0',
          }}>
            <span style={{ color: 'var(--warn)' }}>Шалгах команд:</span><br />
            $ for i in {'{'}{1}..10{'}'}; do curl -s -o /dev/null -w "%{'{'}http_code{'}'}\n" http://localhost/api/test; done
          </div>
        </>
      )}
    </div>
  );
}
