import { useState } from 'react'
import styles from './TestPanel.module.css'

const TESTS = [
  {
    method: 'POST', path: '/api/login',
    body: { email: 'user@test.com', password: 'correct' },
    badge: '200', badgeLevel: 'info',
    title: '✓ Амжилттай login',
    desc: 'POST /api/login — зөв нууц үг',
  },
  {
    method: 'POST', path: '/api/login',
    body: { email: 'user@test.com', password: 'wrong' },
    badge: '401', badgeLevel: 'warn',
    title: '✗ Буруу нууц үг',
    desc: 'auth_failed warn log үүснэ',
  },
  {
    method: 'POST', path: '/api/login',
    body: {},
    badge: '400', badgeLevel: 'warn',
    title: '✗ Хоосон мэдээлэл',
    desc: 'validation_failed warn log',
  },
  {
    method: 'GET', path: '/api/users',
    body: null,
    badge: '500', badgeLevel: 'error',
    title: '✗ DB error симуляци',
    desc: 'db_query_failed error log үүснэ',
  },
  {
    method: 'GET', path: '/health',
    body: null,
    badge: '200', badgeLevel: 'info',
    title: '♥ Health check',
    desc: 'GET /health — сервер байдал',
  },
  {
    method: 'GET', path: '/api/metrics',
    body: null,
    badge: '200', badgeLevel: 'info',
    title: '📊 Live metrics',
    desc: 'GET /api/metrics — CPU + Memory',
  },
]

export default function TestPanel({ onTest }) {
  const [response, setResponse] = useState(null)
  const [loading, setLoading]   = useState(false)

  const run = async (t) => {
    setLoading(true)
    setResponse(null)
    try {
      const result = await onTest(t.method, t.path, t.body)
      setResponse(result)
    } catch (e) {
      setResponse({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  const responseText = response
    ? response.error
      ? `Error: ${response.error}\n\nBackend ажиллаж байгаа эсэхийг шалгана уу:\n  cd backend && npm run dev`
      : [
          `${response.method} ${response.path}  →  ${response.status} ${response.statusText}  (${response.dur}ms)`,
          `X-Request-ID: ${response.rid}`,
          '',
          JSON.stringify(response.data, null, 2),
        ].join('\n')
    : loading
    ? 'Sending…'
    : 'Дээрх товчлуур дарж API шалгана уу…'

  return (
    <div>
      <div className={styles.grid}>
        {TESTS.map((t, i) => (
          <button key={i} className={styles.card} onClick={() => run(t)}>
            <span className={`${styles.badge} ${styles[t.badgeLevel]}`}>{t.badge}</span>
            <div className={styles.title}>{t.title}</div>
            <div className={styles.desc}>{t.desc}</div>
          </button>
        ))}
      </div>
      <div className={styles.label}>Хариу + X-Request-ID header:</div>
      <pre className={styles.box}>{responseText}</pre>
    </div>
  )
}
