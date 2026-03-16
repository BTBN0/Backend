import React, { useState, useCallback } from 'react'
import GlassCard from './components/GlassCard'
import RequestCard from './components/RequestCard'
import LabPanel from './components/LabPanel'
import JsonViewer from './components/JsonViewer'
import { CheckList, IdInput, CodeSnip } from './components/Bits'
import { useApi, useServerStatus } from './hooks/index.js'

/* ─── tiny layout helpers ───────────────────────── */
const G2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>
)
const G4 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>{children}</div>
)

/* ─── Server status pill ─────────────────────────── */
function StatusPill({ status }) {
  const cfg = {
    online:   { color: '#00e887', glow: '0 0 12px rgba(0,232,135,0.5)' },
    offline:  { color: '#4a5878', glow: 'none' },
    checking: { color: '#ffa502', glow: '0 0 12px rgba(255,165,2,0.4)' },
    error:    { color: '#ff4757', glow: '0 0 12px rgba(255,71,87,0.4)' },
  }[status] || { color: '#4a5878', glow: 'none' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--mono)', fontSize: 11 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: cfg.color, boxShadow: cfg.glow,
        display: 'inline-block',
        animation: status === 'online' ? 'glow 2s infinite' : 'none',
      }} />
      <span style={{ color: cfg.color }}>{status}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════ */
export default function App() {
  const [baseUrl, setBaseUrl] = useState('http://localhost:3000')
  const { res, request } = useApi()
  const serverStatus = useServerStatus(baseUrl)

  const [id1ok,   setId1ok]   = useState('1')
  const [id1fail, setId1fail] = useState('999')
  const [id4,     setId4]     = useState('1')

  const [concBusy,   setConcBusy]   = useState(false)
  const [concResult, setConcResult] = useState(null)

  const send = useCallback((id, method, path, body) =>
    request(id, { method, url: baseUrl + path, body }), [request, baseUrl])

  const runConc = async () => {
    setConcBusy(true); setConcResult(null)
    const go = sid => {
      const t = Date.now()
      return fetch(baseUrl + '/enrollments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: sid, courseId: 2 }),
      }).then(async r => ({ status: r.status, data: await r.json(), ms: Date.now() - t }))
        .catch(() => ({ status: 0, data: { error: 'Connection refused' }, ms: Date.now() - t }))
    }
    const [r1, r2] = await Promise.all([go(1), go(2)])
    const wins = [r1, r2].filter(r => r.status === 200).length
    setConcResult({ r1, r2, verdict: wins === 1 ? 'pass' : wins === 2 ? 'fail' : 'conn' })
    setConcBusy(false)
  }

  /* ── Tab definitions ─────────────────────────── */
  const tabs = [
    {
      label: 'Exception', color: '#ff4fa3', title: 'Exception Handling',
      subtitle: 'GlobalErrorHandler · NotFoundException',
      content: (
        <>
          <G2>
            <RequestCard method="GET" path="/students/:id" badge="✓ found" badgeColor="#00e887"
              responseId="l1ok" response={res['l1ok']}
              onSend={id => send(id, 'GET', `/students/${id1ok}`)}>
              <IdInput label="Student ID" defaultValue="1" onChange={setId1ok} />
            </RequestCard>
            <RequestCard method="GET" path="/students/:id" badge="✗ 404" badgeColor="#ff4757"
              responseId="l1fail" response={res['l1fail']}
              onSend={id => send(id, 'GET', `/students/${id1fail}`)}>
              <IdInput label="Student ID (байхгүй)" defaultValue="999" onChange={setId1fail} />
            </RequestCard>
          </G2>
          <CheckList color="#ff4fa3" items={[
            'Controller дотор try/catch байхгүй',
            'Exception → GlobalErrorHandler барна',
            '{ timestamp, status, code, message, path } format',
          ]} />
        </>
      ),
    },
    {
      label: 'Transaction', color: '#00e887', title: 'Transaction & Rollback',
      subtitle: '@Transactional · Error → rollback · Seat protected',
      content: (
        <>
          <G2>
            <RequestCard method="POST" path="/enrollments" badge="✓ success" badgeColor="#00e887"
              showBody defaultBody={{ studentId: 1, courseId: 1 }}
              responseId="l2ok" response={res['l2ok']}
              onSend={(id, b) => send(id, 'POST', '/enrollments', b)} />
            <RequestCard method="POST" path="/enrollments" badge="✗ full → rollback" badgeColor="#ff4757"
              showBody defaultBody={{ studentId: 2, courseId: 3 }}
              responseId="l2fail" response={res['l2fail']}
              onSend={(id, b) => send(id, 'POST', '/enrollments', b)} />
          </G2>
          <CheckList color="#00e887" items={[
            'COURSE_FULL → 400 error буцаана',
            'Enrollment хадгалагдаагүй (rollback)',
            'Seat count өөрчлөгдөөгүй',
          ]} />
        </>
      ),
    },
    {
      label: 'SOLID', color: '#9b59ff', title: 'SOLID — Notification',
      subtitle: 'NotificationSender interface · Email / SMS / Push',
      content: (
        <>
          <RequestCard method="POST" path="/enrollments" badge="email auto-sent" badgeColor="#9b59ff"
            showBody defaultBody={{ studentId: 2, courseId: 1 }}
            responseId="l3" response={res['l3']}
            onSend={(id, b) => send(id, 'POST', '/enrollments', b)} />
          <CodeSnip color="#9b59ff">
{`// Server console дээр харагдана:
[EMAIL] To: naran@school.mn | You enrolled in: Spring Boot Fundamentals

// Шинэ sender нэмэхэд NotificationService өөрчлөгдөхгүй:
class WhatsAppSender extends NotificationSender { ... } ✓`}
          </CodeSnip>
          <CheckList color="#9b59ff" items={[
            'NotificationSender interface ашигласан',
            'Service concrete implementation мэдэхгүй',
            'Шинэ sender нэмэхэд existing code өөрчлөгдөхгүй',
          ]} />
        </>
      ),
    },
    {
      label: 'Dep. Inversion', color: '#ffa502', title: 'Dependency Inversion',
      subtitle: 'Repository interface · MySQL / Mongo swap',
      content: (
        <>
          <RequestCard method="GET" path="/students/:id" badge="interface-д хандана" badgeColor="#ffa502"
            responseId="l4" response={res['l4']}
            onSend={id => send(id, 'GET', `/students/${id4}`)}>
            <IdInput label="Student ID" defaultValue="1" onChange={setId4} />
          </RequestCard>
          <CodeSnip color="#ffa502">
{`// app.js — нэг мөр солиход DB солигдоно:
const studentRepo = new InMemoryStudentRepository()
                //  new MySQLStudentRepository()  ← swap
                //  new MongoStudentRepository()  ← swap

// UseCase, Service — өөрчлөлт байхгүй ✓`}
          </CodeSnip>
          <CheckList color="#ffa502" items={[
            'StudentRepository abstract class (interface)',
            'DB солиход service code өөрчлөгдөхгүй',
            'Dependency app.js-д inject хийгдсэн',
          ]} />
        </>
      ),
    },
    {
      label: 'Clean Arch', color: '#00e5ff', title: 'Clean Architecture',
      subtitle: 'Controller → UseCase → Repository → Infrastructure',
      content: (
        <>
          {/* arch diagram */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', rowGap: 8, marginBottom: 20 }}>
            {[
              { l: 'Controller',     c: '#ff4fa3' },
              { l: 'UseCase',        c: '#ffa502' },
              { l: 'Repository',     c: '#00e887' },
              { l: 'Infrastructure', c: '#00e5ff' },
            ].map(({ l, c }, i, a) => (
              <React.Fragment key={l}>
                <div style={{
                  padding: '6px 14px',
                  background: `${c}11`, border: `1px solid ${c}44`, borderRadius: 8,
                  fontFamily: 'var(--mono)', fontSize: 12, color: c, fontWeight: 400,
                }}>{l}</div>
                {i < a.length - 1 && <span style={{ color: 'var(--text3)', padding: '0 8px', fontSize: 18 }}>→</span>}
              </React.Fragment>
            ))}
          </div>
          <G2>
            <RequestCard method="GET" path="/students/1" badge="GetStudentUseCase"
              responseId="l5g" response={res['l5g']}
              onSend={id => send(id, 'GET', '/students/1')} />
            <RequestCard method="POST" path="/enrollments" badge="EnrollStudentUseCase"
              showBody defaultBody={{ studentId: 3, courseId: 1 }}
              responseId="l5e" response={res['l5e']}
              onSend={(id, b) => send(id, 'POST', '/enrollments', b)} />
          </G2>
          <CheckList color="#00e5ff" items={[
            'Controller → UseCase (service биш)',
            'UseCase → Repository Interface',
            'Domain (entities.js) — framework import байхгүй',
          ]} />
        </>
      ),
    },
  ]

  /* ─────────────────────────────────────────────── */
  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

      {/* ── Top nav bar ───────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '0 28px', height: 56,
        background: 'rgba(6,9,20,0.85)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #00e5ff, #9b59ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700,
          }}>L</div>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, letterSpacing: .5, color: 'var(--text)' }}>
            Lab Tester
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Base URL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>URL</span>
          <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
            borderRadius: 6, color: 'var(--cyan)',
            fontFamily: 'var(--mono)', fontSize: 12,
            padding: '5px 10px', outline: 'none', width: 220,
            transition: 'border-color .2s',
          }}
            onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <StatusPill status={serverStatus} />
      </header>

      {/* ── Main ──────────────────────────────────── */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 52, animation: 'fadeUp .6s ease' }}>
          {/* glowing accent line */}
          <div style={{
            width: 48, height: 3, borderRadius: 2, marginBottom: 20,
            background: 'linear-gradient(90deg, #00e5ff, #9b59ff)',
            boxShadow: '0 0 16px rgba(0,229,255,0.5)',
          }} />
          <h1 style={{
            fontFamily: 'var(--sans)', fontSize: 'clamp(32px,5vw,58px)',
            fontWeight: 700, lineHeight: 1.05, letterSpacing: '-1.5px',
            marginBottom: 14,
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #00e5ff 0%, #9b59ff 50%, #ff4fa3 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'aurora 6s ease infinite',
            }}>Course Enrollment</span>
            <br />
            <span style={{ color: 'var(--text)', fontSize: '0.62em', letterSpacing: '-1px', fontWeight: 300 }}>
              API Lab Tester
            </span>
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 520 }}>
            LAB 1–5, Final Challenge болон Concurrency bonus-ийг шалгах хэрэгсэл. Зүүн tabs дарж лаб сонгоно.
          </p>
        </div>

        {/* ── Stats row ─────────────────────────── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
          {[
            { label: 'Labs', value: '5', color: '#00e5ff' },
            { label: 'Students', value: '1–3', color: '#9b59ff' },
            { label: 'Courses', value: '1–3', color: '#00e887' },
            { label: 'Course 2 seats', value: '1', color: '#ffa502' },
            { label: 'Course 3', value: 'FULL', color: '#ff4757' },
          ].map(({ label, value, color }) => (
            <GlassCard key={label} glow="cyan" style={{ padding: '12px 18px', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 22, fontWeight: 700, color, letterSpacing: -.5 }}>{value}</div>
            </GlassCard>
          ))}
        </div>

        {/* ── Lab tabs ──────────────────────────── */}
        <LabPanel tabs={tabs} />

        {/* ── Final Challenge ───────────────────── */}
        <div style={{ marginTop: 48 }}>
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: '#ff4fa3',
              letterSpacing: 2, textTransform: 'uppercase',
              padding: '3px 10px', border: '1px solid #ff4fa344',
              borderRadius: 4, background: '#ff4fa311',
            }}>FINAL CHALLENGE</div>
            <h2 style={{ fontFamily: 'var(--sans)', fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>
              All Scenarios
            </h2>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>
              Exception + Transaction + SOLID + DI + Clean Arch
            </span>
          </div>
          <G4>
            <RequestCard method="POST" path="/enrollments" badge="✓ success" badgeColor="#00e887"
              showBody defaultBody={{ studentId: 1, courseId: 1 }}
              responseId="f1" response={res['f1']}
              onSend={(id, b) => send(id, 'POST', '/enrollments', b)} />
            <RequestCard method="POST" path="/enrollments" badge="✗ course_full" badgeColor="#ff4757"
              showBody defaultBody={{ studentId: 1, courseId: 3 }}
              responseId="f2" response={res['f2']}
              onSend={(id, b) => send(id, 'POST', '/enrollments', b)} />
            <RequestCard method="POST" path="/enrollments" badge="✗ not_found" badgeColor="#ff4757"
              showBody defaultBody={{ studentId: 999, courseId: 1 }}
              responseId="f3" response={res['f3']}
              onSend={(id, b) => send(id, 'POST', '/enrollments', b)} />
            <RequestCard method="POST" path="/enrollments" badge="✗ duplicate" badgeColor="#ffa502"
              showBody defaultBody={{ studentId: 1, courseId: 1 }}
              responseId="f4" response={res['f4']}
              onSend={(id, b) => send(id, 'POST', '/enrollments', b)} />
          </G4>
        </div>

        {/* ── Bonus Concurrency ─────────────────── */}
        <GlassCard glow="violet" style={{ marginTop: 36, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: '#9b59ff',
              letterSpacing: 2, padding: '3px 10px',
              border: '1px solid #9b59ff44', borderRadius: 4, background: '#9b59ff11',
            }}>BONUS</div>
            <h2 style={{ fontFamily: 'var(--sans)', fontSize: 20, fontWeight: 600 }}>
              Concurrency Test
            </h2>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>
              Course 2 = 1 seat · зөвхөн 1 амжилттай
            </span>
          </div>

          <CodeSnip>
{`Promise.all([
  POST /enrollments { studentId: 1, courseId: 2 },  // Thread 1
  POST /enrollments { studentId: 2, courseId: 2 },  // Thread 2
])
// Expected: 1× 200 OK  +  1× 400 COURSE_FULL`}
          </CodeSnip>

          <button onClick={runConc} disabled={concBusy} style={{
            padding: '10px 28px', marginBottom: 16,
            background: concBusy ? 'rgba(155,89,255,0.1)' : 'linear-gradient(135deg, rgba(155,89,255,0.25), rgba(0,229,255,0.15))',
            border: '1px solid rgba(155,89,255,0.4)', borderRadius: 8,
            color: '#9b59ff', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
            cursor: concBusy ? 'not-allowed' : 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            transition: 'all .2s', letterSpacing: .5,
          }}
            onMouseEnter={e => { if (!concBusy) { e.target.style.boxShadow = '0 0 24px rgba(155,89,255,0.3)'; e.target.style.background = 'linear-gradient(135deg, rgba(155,89,255,0.35), rgba(0,229,255,0.25))' } }}
            onMouseLeave={e => { if (!concBusy) { e.target.style.boxShadow = 'none'; e.target.style.background = 'linear-gradient(135deg, rgba(155,89,255,0.25), rgba(0,229,255,0.15))' } }}
          >
            {concBusy ? (
              <><span style={{ width: 12, height: 12, border: '2px solid rgba(155,89,255,0.3)', borderTopColor: '#9b59ff', borderRadius: '50%', display: 'inline-block', animation: 'spin .65s linear infinite' }} /> Running parallel…</>
            ) : '⚡  Run Concurrency Test'}
          </button>

          {concResult && (
            <>
              <G2>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Thread 1 — Student 1</div>
                  <JsonViewer data={concResult.r1.data} status={concResult.r1.status} ms={concResult.r1.ms} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Thread 2 — Student 2</div>
                  <JsonViewer data={concResult.r2.data} status={concResult.r2.status} ms={concResult.r2.ms} />
                </div>
              </G2>
              <div style={{
                marginTop: 14, padding: '12px 16px', borderRadius: 8,
                fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, letterSpacing: .2,
                ...(concResult.verdict === 'pass'
                  ? { background: 'rgba(0,232,135,0.1)', border: '1px solid rgba(0,232,135,0.3)', color: '#00e887' }
                  : concResult.verdict === 'fail'
                  ? { background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', color: '#ff4757' }
                  : { background: 'rgba(255,165,2,0.1)', border: '1px solid rgba(255,165,2,0.3)', color: '#ffa502' }),
              }}>
                {concResult.verdict === 'pass' && '✓  PASSED — зөвхөн 1 хэрэглэгч амжилттай бүртгүүлсэн'}
                {concResult.verdict === 'fail' && '✗  FAILED — 2 хүн зэрэг бүртгүүлчихлээ! Pessimistic lock шаардлагатай.'}
                {concResult.verdict === 'conn' && '⚠  Server холбогдоогүй байна'}
              </div>
            </>
          )}

          <CheckList color="#9b59ff" items={[
            'Course 2: remainingSeats = 1',
            '2 thread зэрэг → зөвхөн 1 нь 200 OK авна',
            'Нөгөө нь 400 COURSE_FULL авна',
            'Seat count -1 болохгүй (race condition байхгүй)',
          ]} />
        </GlassCard>

        {/* Footer */}
        <div style={{ marginTop: 60, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>
          Course Enrollment System · Node.js + Express · LAB 1–5
        </div>

      </main>
    </div>
  )
}
