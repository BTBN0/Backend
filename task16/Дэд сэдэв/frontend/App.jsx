import TaskCard from './components/TaskCard';
import Task1 from './components/Task1';
import Task2 from './components/Task2';
import Task3 from './components/Task3';
import Task4 from './components/Task4';
import Task5 from './components/Task5';

const TASKS = [
  {
    num: 1, level: 'easy',
    title: 'Express — Basic Rate Limiting',
    desc: '1 IP-ээс 1 минутанд дээд тал нь <b>5 request</b> зөвшөөрнө.<br/>Хэтэрвэл → <span style="color:var(--error)">429 Too Many Requests</span>',
    component: Task1, defaultOpen: true,
  },
  {
    num: 2, level: 'medium',
    title: 'Express — Security Headers (Helmet)',
    desc: 'Helmet middleware-р <b>XSS, Clickjacking, MIME sniffing</b> халдлагуудаас хамгаалах header-уудыг автоматаар нэмнэ.',
    component: Task2,
  },
  {
    num: 3, level: 'medium',
    title: 'Nginx — Rate Limiting Config',
    desc: 'Nginx reverse proxy түвшинд <b>/api/</b> route дээр секундэд <b>2 request</b>, burst=5 тохиргоотойгоор хязгаарлана.',
    component: Task3,
  },
  {
    num: 4, level: 'hard',
    title: 'Login — Brute-Force Хамгаалалт',
    desc: '<b>5 удаа</b> буруу оролдвол <b>10 минут</b> блокладна. IP болон username хоёуланг нь хянана.',
    component: Task4,
  },
  {
    num: 5, level: 'hard',
    title: 'Production Security Stack',
    desc: 'Helmet + Rate Limiting + .env + Nginx HTTPS — <b>олон давхар хамгаалалт</b> бүхий production орчин.',
    component: Task5,
  },
];

export default function App() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 60px', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <header style={{ padding: '44px 0 36px', borderBottom: '1px solid var(--border)', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)',
              letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10,
            }}>
              ЧЭ10 · Дэд сэдэв 6, 7
            </div>
            <h1 style={{
              fontFamily: 'var(--display)', fontSize: 'clamp(38px, 7vw, 72px)',
              lineHeight: 0.95, letterSpacing: 2, color: 'var(--text)',
              animation: 'flicker 8s infinite',
            }}>
              SECURITY<br />
              <span style={{ color: 'var(--accent)', WebkitTextStroke: '1px var(--accent)', }}>DASHBOARD</span>
            </h1>
          </div>

          {/* Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11,
              background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)',
              color: 'var(--accent)', padding: '7px 14px', borderRadius: 100,
              display: 'flex', alignItems: 'center', gap: 8,
              animation: 'glowPulse 3s infinite',
            }}>
              <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              SERVER ONLINE
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>
              localhost:3000
            </div>
          </div>
        </div>

        {/* Sub info */}
        <div style={{
          marginTop: 20, display: 'flex', gap: 20, flexWrap: 'wrap',
          fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)',
        }}>
          {['Node.js + Express', 'express-rate-limit', 'helmet', 'Nginx config', 'Brute-force protection'].map(t => (
            <span key={t}>
              <span style={{ color: 'var(--border2)', marginRight: 8 }}>▸</span>{t}
            </span>
          ))}
        </div>
      </header>

      {/* Task cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TASKS.map(({ component: Comp, ...t }, i) => (
          <div key={t.num} style={{ animationDelay: `${i * 0.07}s` }}>
            <TaskCard {...t}>
              <Comp />
            </TaskCard>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: 48, paddingTop: 20, borderTop: '1px solid var(--border)',
        textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 10,
        color: 'var(--muted)', letterSpacing: 1.5,
      }}>
        ЧЭ10 · SECURITY ENGINEERING · NODE.JS + EXPRESS + NGINX
      </footer>
    </div>
  );
}
