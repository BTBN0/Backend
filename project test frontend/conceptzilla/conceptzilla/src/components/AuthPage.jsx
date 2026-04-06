import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import s from './AuthPage.module.css'

function EyeIcon({ open }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

export default function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'register') {
      if (!form.name.trim()) return setError('Нэрээ оруулна уу.')
      if (!form.email.includes('@')) return setError('Имэйл буруу байна.')
      if (form.password.length < 6) return setError('Нууц үг 6+ тэмдэгт байх ёстой.')
    } else {
      if (!form.email.includes('@')) return setError('Имэйл буруу байна.')
      if (!form.password) return setError('Нууц үгээ оруулна уу.')
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    if (mode === 'login') login(form.email, form.password)
    else register(form.name, form.email, form.password)
    setLoading(false)
  }

  const switchMode = (m) => {
    setMode(m)
    setForm({ name: '', email: '', password: '' })
    setError('')
  }

  return (
    <div className={s.page}>
      {/* Grid overlay */}
      <div className={s.gridOverlay} />

      {/* Main layout */}
      <div className={`${s.layout} ${mounted ? s.layoutIn : ''}`}>

        {/* Left panel — branding */}
        <div className={s.leftPanel}>
          <div className={s.brandBlock}>
            <div className={s.logoMark}>
              <svg width="32" height="38" viewBox="0 0 814 1000" fill="white">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.2c-49.5-71.8-93.7-184.7-93.7-292.9 0-161 105-246 209-246 55.6 0 101.5 37.1 135.3 37.1 32.5 0 83.2-39.2 147-39.2 23.9 0 108.2 2.2 168.3 84zM549.4 35.2c25.4-30.3 44.7-72.5 44.7-114.7 0-5.8-.6-11.7-1.9-16.3-42.3 1.6-91.4 28.3-121 59.2-23.5 25.1-46 67.2-46 110 0 6.4 1.3 12.8 1.9 14.7 2.6.6 6.4 1.3 10.3 1.3 37.4-.1 84.2-25.7 112-54.2z"/>
              </svg>
            </div>
            <h1 className={s.brandName}>Conceptzilla</h1>
            <p className={s.brandTagline}>Design workspace for modern teams</p>

            <div className={s.featureList}>
              {[
                { icon: '⚡', text: 'Real-time collaboration' },
                { icon: '🎨', text: 'Design system management' },
                { icon: '🔒', text: 'Secure & private' },
              ].map((f, i) => (
                <div key={i} className={s.featureItem} style={{ animationDelay: `${0.4 + i * 0.12}s` }}>
                  <span className={s.featureIcon}>{f.icon}</span>
                  <span className={s.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating mock UI card */}
          <div className={s.mockCard}>
            <div className={s.mockHeader}>
              <div className={s.mockDot} style={{background:'#ff5f57'}}/>
              <div className={s.mockDot} style={{background:'#febc2e'}}/>
              <div className={s.mockDot} style={{background:'#28c840'}}/>
              <span className={s.mockTitle}>ui-kit design</span>
            </div>
            <div className={s.mockMsg}>
              <div className={s.mockAvatar} style={{background:'rgba(0,113,227,0.25)'}}>D</div>
              <div className={s.mockBubble}>UI kit is 90% complete ✓</div>
            </div>
            <div className={s.mockMsg} style={{justifyContent:'flex-end'}}>
              <div className={s.mockBubbleRight}>Looks great! 🚀</div>
            </div>
            <div className={s.mockTyping}>
              <span/><span/><span/>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className={s.rightPanel}>
          <div className={s.card}>

            {/* Mode toggle pills */}
            <div className={s.modePills}>
              <button
                className={`${s.pill} ${mode === 'login' ? s.pillActive : ''}`}
                onClick={() => switchMode('login')}
              >Нэвтрэх</button>
              <button
                className={`${s.pill} ${mode === 'register' ? s.pillActive : ''}`}
                onClick={() => switchMode('register')}
              >Бүртгүүлэх</button>
            </div>

            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>
                {mode === 'login' ? 'Тавтай морил 👋' : 'Эхлэцгээе ✨'}
              </h2>
              <p className={s.cardSub}>
                {mode === 'login'
                  ? 'Workspace руугаа нэвтрэх'
                  : 'Шинэ account үүсгэх'}
              </p>
            </div>

            <form className={s.form} onSubmit={handleSubmit}>

              {mode === 'register' && (
                <div className={`${s.field} ${s.fieldSlide}`}>
                  <label className={s.label}>Нэр</label>
                  <div className={s.inputWrap}>
                    <svg className={s.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input className={s.input} type="text" placeholder="Таны нэр"
                      value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name"/>
                  </div>
                </div>
              )}

              <div className={s.field}>
                <label className={s.label}>Имэйл</label>
                <div className={s.inputWrap}>
                  <svg className={s.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input className={s.input} type="email" placeholder="name@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email"/>
                </div>
              </div>

              <div className={s.field}>
                <div className={s.labelRow}>
                  <label className={s.label}>Нууц үг</label>
                  {mode === 'login' && <button type="button" className={s.forgotBtn}>Мартсан?</button>}
                </div>
                <div className={s.inputWrap}>
                  <svg className={s.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input className={`${s.input} ${s.pwInput}`}
                    type={showPw ? 'text' : 'password'}
                    placeholder={mode === 'login' ? '••••••••' : 'Хамгийн багадаа 6 тэмдэгт'}
                    value={form.password} onChange={e => set('password', e.target.value)}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/>
                  <button type="button" className={s.eyeBtn} onClick={() => setShowPw(v => !v)}>
                    <EyeIcon open={showPw}/>
                  </button>
                </div>
              </div>

              {error && (
                <div className={s.errorBox}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className={`${s.submitBtn} ${loading ? s.loading : ''}`} disabled={loading}>
                {loading ? (
                  <span className={s.spinnerWrap}>
                    <span className={s.spinner}/>
                    <span>Түр хүлээнэ үү…</span>
                  </span>
                ) : (
                  <span className={s.btnContent}>
                    {mode === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className={s.orRow}>
              <div className={s.orLine}/><span className={s.orText}>эсвэл үргэлжлүүлэх</span><div className={s.orLine}/>
            </div>

            <div className={s.socials}>
              <button className={s.socialBtn}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className={s.socialBtn}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{color:'var(--text-1)'}}>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </button>
            </div>

            <p className={s.switchText}>
              {mode === 'login' ? 'Бүртгэлгүй юу? ' : 'Бүртгэлтэй юу? '}
              <button type="button" className={s.switchBtn}
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Бүртгүүлэх →' : '← Нэвтрэх'}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
