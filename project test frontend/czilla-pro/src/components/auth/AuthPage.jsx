import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const GOOGLE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/google`

export default function AuthPage() {
  const { login, loading } = useAuth()
  const { theme, toggle } = useTheme()
  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!email.includes('@')) return setError('Имэйл буруу байна.')
    const r = await login(email)
    if (!r.ok) setError(r.error || 'Нэвтрэх амжилтгүй.')
    else setSuccess('Амжилттай нэвтэрлээ!')
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 dark:bg-black p-4 relative">

      {/* Theme toggle */}
      <button onClick={toggle}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full
                   bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10
                   text-gray-600 dark:text-gray-300 text-xs font-medium
                   hover:border-accent hover:text-accent transition-all duration-150 backdrop-blur-xl">
        {theme === 'dark'
          ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>Light</>
          : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>Dark</>
        }
      </button>

      {/* Card */}
      <div className="w-full max-w-[880px] flex rounded-2xl overflow-hidden shadow-2xl
                      border border-gray-200 dark:border-white/8 animate-fade-up">

        {/* Left — branding (ORIGINAL - unchanged) */}
        <div className="hidden md:flex flex-col justify-between flex-1 p-12 relative overflow-hidden"
          style={{background:'linear-gradient(145deg,#0d0d1a 0%,#0f0a1e 40%,#0a1628 100%)'}}>

          <div className="absolute inset-0 pointer-events-none">
            <div style={{position:'absolute',top:'15%',left:'20%',width:320,height:320,borderRadius:'50%',background:'radial-gradient(circle,rgba(168,85,247,0.18) 0%,transparent 70%)'}}/>
            <div style={{position:'absolute',bottom:'20%',right:'10%',width:240,height:240,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)'}}/>
            <div style={{position:'absolute',top:'50%',left:'50%',width:180,height:180,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)'}}/>
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#a855f7,#6366f1,#3b82f6)'}}>
              <svg viewBox="0 0 56 56" width="56" height="56" fill="none">
                <circle cx="28" cy="28" r="11" fill="rgba(255,255,255,0.22)"/>
                <circle cx="28" cy="28" r="5.5" fill="rgba(255,255,255,0.92)"/>
                <circle cx="28" cy="13" r="3" fill="rgba(255,255,255,0.5)"/>
                <circle cx="28" cy="43" r="3" fill="rgba(255,255,255,0.5)"/>
                <circle cx="13" cy="28" r="3" fill="rgba(255,255,255,0.5)"/>
                <circle cx="43" cy="28" r="3" fill="rgba(255,255,255,0.5)"/>
                <circle cx="17.5" cy="17.5" r="2" fill="rgba(255,255,255,0.3)"/>
                <circle cx="38.5" cy="38.5" r="2" fill="rgba(255,255,255,0.3)"/>
                <circle cx="38.5" cy="17.5" r="2" fill="rgba(255,255,255,0.3)"/>
                <circle cx="17.5" cy="38.5" r="2" fill="rgba(255,255,255,0.3)"/>
              </svg>
            </div>
            <h1 className="font-black text-white mb-1"
              style={{fontFamily:"'Syne',sans-serif",fontSize:'48px',letterSpacing:'0.22em',lineHeight:1}}>
              AURA
            </h1>
            <p className="text-sm mb-8" style={{color:'rgba(255,255,255,0.4)'}}>
              Таны дотоод харилцааны орон зай
            </p>
          </div>

          <div className="relative z-10 animate-fade-up" style={{animationDelay:'0.6s'}}>
            <div className="relative flex items-end justify-center gap-6 mb-4" style={{height:120}}>
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{background:'linear-gradient(135deg,#a855f7,#7c3aed)',color:'white'}}>A</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2"
                    style={{borderColor:'#0d0d1a'}}/>
                </div>
                <div className="w-14 h-16 rounded-t-2xl flex items-center justify-center"
                  style={{background:'linear-gradient(180deg,rgba(168,85,247,0.3),rgba(168,85,247,0.1))'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 max-w-[140px]">
                <div className="self-start px-3 py-1.5 rounded-2xl rounded-bl-sm text-xs animate-fade-up"
                  style={{background:'rgba(168,85,247,0.25)',color:'rgba(255,255,255,0.85)',animationDelay:'0.8s'}}>
                  Сайн байна уу! 👋
                </div>
                <div className="self-end px-3 py-1.5 rounded-2xl rounded-br-sm text-xs animate-fade-up"
                  style={{background:'rgba(99,102,241,0.3)',color:'rgba(255,255,255,0.85)',animationDelay:'1s'}}>
                  Сайн! Та яаж байна? 😊
                </div>
                <div className="self-start flex gap-1 pl-2 animate-fade-up" style={{animationDelay:'1.2s'}}>
                  {[0,1,2].map(i=><span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{background:'rgba(168,85,247,0.6)',animationDelay:`${i*0.15}s`,animationDuration:'1s'}}/>)}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{background:'linear-gradient(135deg,#3b82f6,#6366f1)',color:'white'}}>B</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2"
                    style={{borderColor:'#0d0d1a'}}/>
                </div>
                <div className="w-14 h-16 rounded-t-2xl flex items-center justify-center"
                  style={{background:'linear-gradient(180deg,rgba(99,102,241,0.3),rgba(99,102,241,0.1))'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-center text-xs" style={{color:'rgba(255,255,255,0.2)'}}>
              AURA — Хаана ч, хэзээ ч холбогдоорой
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="w-full md:w-[400px] flex-shrink-0 bg-white dark:bg-dark-800 flex items-center p-8 md:p-10">
          <div className="w-full">

            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1"
                style={{fontFamily:'Syne,sans-serif'}}>
                Тавтай морил 👋
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Workspace руугаа нэвтрэх
              </p>
            </div>

            {/* Google — primary button */}
            <a href={GOOGLE_URL}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                         border-2 border-gray-200 dark:border-white/10
                         bg-white dark:bg-dark-700
                         text-gray-700 dark:text-gray-200 text-sm font-semibold
                         hover:border-blue-400 dark:hover:border-blue-500
                         hover:bg-blue-50 dark:hover:bg-blue-950/20
                         transition-all duration-150 active:scale-[0.98] mb-5 cursor-pointer select-none"
              style={{textDecoration:'none'}}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google-ээр нэвтрэх
            </a>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"/>
              <span className="text-xs text-gray-400 dark:text-gray-600">эсвэл имэйлээр</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"/>
            </div>

            {/* Email-only form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Имэйл</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input className="input-base pl-9" type="email" placeholder="name@example.com"
                    value={email} onChange={e => { setEmail(e.target.value); setError(''); setSuccess('') }}
                    autoComplete="email" autoFocus />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm animate-slide-down">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 text-green-600 dark:text-green-400 text-sm animate-slide-down">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
                  {success}
                </div>
              )}

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading
                  ? <><svg className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0110 10"/></svg>Түр хүлээнэ үү…</>
                  : <>Нэвтрэх <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                }
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
