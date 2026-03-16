// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Input, Button, ErrorBox } from '../components/ui'

const DEMOS = [
  { label: 'Admin', role: 'admin', email: 'admin@example.com', pass: 'Admin@1234' },
  { label: 'User',  role: 'user',  email: 'user@example.com',  pass: 'User@1234'  },
]

export default function Login() {
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const { login, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    clearError()
    try {
      const redirectTo = await login(email, pass)
      navigate(redirectTo, { replace: true })
    } catch {}
  }

  function fillDemo(d) {
    setEmail(d.email)
    setPass(d.pass)
    clearError()
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-iris/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm animate-fade-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-iris/10 border border-iris/25 px-3 py-1.5 rounded-full text-iris text-[10px] tracking-[.2em] uppercase font-mono font-semibold mb-6">
            ◈ RBAC + ABAC
          </div>
          <h1 className="font-display text-4xl text-snow mb-2 italic">AccessOS</h1>
          <p className="text-ghost text-sm">Role-д суурилсан хандалтын систем</p>
        </div>

        {/* Card */}
        <div className="bg-plate border border-rim rounded-2xl p-7 relative overflow-hidden">
          {/* corner glow */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-iris/8 rounded-full blur-3xl pointer-events-none" />

          {/* Demo accounts */}
          <div className="mb-6">
            <div className="text-[9px] tracking-[.18em] uppercase text-ghost font-mono mb-3">Demo акаунтууд</div>
            <div className="grid grid-cols-2 gap-2">
              {DEMOS.map(d => (
                <button
                  key={d.role}
                  onClick={() => fillDemo(d)}
                  className="bg-ink border border-rim hover:border-iris/50 rounded-lg p-3 text-left transition-all duration-150 group"
                >
                  <div className={`text-[9px] tracking-[.12em] uppercase font-mono font-bold mb-1 ${d.role === 'admin' ? 'text-gold' : 'text-moss'}`}>
                    {d.label}
                  </div>
                  <div className="text-[11px] text-ghost font-mono truncate group-hover:text-smoke">{d.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="И-мэйл"
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Нууц үг"
              id="password"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
            />

            <ErrorBox message={error} />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center mt-2"
            >
              {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх →'}
            </Button>
          </form>
        </div>

        <p className="text-center text-[11px] text-ghost/50 font-mono mt-6">
          Backend: localhost:3000 — Prisma + Express
        </p>
      </div>
    </div>
  )
}
