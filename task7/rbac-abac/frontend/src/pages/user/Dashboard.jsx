// src/pages/user/Dashboard.jsx
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { StatCard, SectionLabel, Tag, Loading, ErrorBox } from '../../components/ui'
import { useAuthStore } from '../../stores/authStore'

export default function UserDashboard() {
  const { user } = useAuthStore()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/user/dashboard')
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />

  const perms = data?.permissions || []

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h2 className="font-display text-2xl text-snow italic">
          Сайн уу, {user?.name} <span className="not-italic text-moss text-lg">◈</span>
        </h2>
        <p className="text-ghost text-sm font-mono mt-0.5">Таны хэрэглэгчийн тиш</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon="◈" label="Миний Role"      value={(user?.roles||[]).join(', ')} glowColor="moss" />
        <StatCard icon="⬡" label="Permission тоо"  value={perms.length}                 glowColor="iris" />
      </div>

      <SectionLabel>Миний permissions</SectionLabel>
      <div className="bg-plate border border-rim rounded-xl p-5 flex flex-wrap gap-2">
        {perms.length === 0
          ? <span className="text-ghost text-xs font-mono">Permission байхгүй</span>
          : perms.map(p => <Tag key={p} variant="perm">{p}</Tag>)
        }
      </div>

      <SectionLabel>Таны attributes (ABAC шалгахад ашиглана)</SectionLabel>
      <div className="bg-plate border border-rim rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Хэлтэс',     value: user?.department || 'тохируулаагүй' },
          { label: 'Level',      value: user?.level },
          { label: 'Бүсчлэл',   value: user?.region || 'тохируулаагүй' },
          { label: 'Идэвхтэй',  value: user?.isActive ? 'тийм' : 'үгүй' },
        ].map(a => (
          <div key={a.label}>
            <div className="text-[9px] tracking-[.14em] uppercase text-ghost font-mono mb-1.5">{a.label}</div>
            <span className="tag-perm">{a.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export function UserProfile() {
  const { user, refreshMe } = useAuthStore()
  const [name,    setName]    = useState(user?.name || '')
  const [region,  setRegion]  = useState(user?.region || '')
  const [saving,  setSaving]  = useState(false)
  const [ok,      setOk]      = useState(false)

  async function save() {
    setSaving(true); setOk(false)
    try {
      await api.put('/user/profile', { name, region: region || undefined })
      await refreshMe()
      setOk(true)
      setTimeout(() => setOk(false), 2000)
    } catch {}
    finally { setSaving(false) }
  }

  return (
    <div className="animate-fade-up space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-2xl text-snow italic">Профайл</h2>
        <p className="text-ghost text-sm font-mono mt-0.5">Өөрийн мэдээлэл</p>
      </div>

      {/* Avatar block */}
      <div className="bg-plate border border-rim rounded-xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-iris to-violet-700 flex items-center justify-center font-display font-bold text-2xl text-white flex-shrink-0">
          {user?.name?.[0]}
        </div>
        <div>
          <div className="text-snow font-semibold text-lg">{user?.name}</div>
          <div className="text-ghost text-sm font-mono">{user?.email}</div>
          <div className="flex gap-2 mt-2">{(user?.roles||[]).map(r => <Tag key={r} variant={r}>{r}</Tag>)}</div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-plate border border-rim rounded-xl p-6 space-y-4">
        <SectionLabel>Мэдээлэл засах</SectionLabel>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[.14em] uppercase text-ghost font-mono">Нэр</label>
            <input className="input-base" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[.14em] uppercase text-ghost font-mono">Бүсчлэл</label>
            <input className="input-base" value={region} onChange={e => setRegion(e.target.value)} placeholder="MN" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="bg-iris hover:bg-iris/80 text-white text-sm font-sans font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-40"
          >
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
          {ok && <span className="text-moss text-xs font-mono">✓ Хадгалагдлаа</span>}
        </div>
      </div>
    </div>
  )
}

// ─── Posts ───────────────────────────────────────────────────────────────────
export function UserPosts() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/user/posts')
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="animate-fade-up space-y-5">
      <div>
        <h2 className="font-display text-2xl text-snow italic">Нийтлэлүүд</h2>
        <p className="text-ghost text-sm font-mono mt-0.5">RBAC: <span className="text-iris">read:posts</span> permission шаардлагатай</p>
      </div>

      {error ? (
        <div className="bg-plate border border-rim rounded-xl p-10 flex flex-col items-center gap-4 text-center">
          <div className="text-5xl opacity-20">🔒</div>
          <div className="text-snow font-display italic text-xl">Хандах эрхгүй</div>
          <div className="text-flame text-sm font-mono">{error}</div>
        </div>
      ) : (
        (data?.posts || []).map(post => (
          <div key={post.id} className="bg-plate border border-rim rounded-xl p-5 hover:border-iris/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-mono text-ghost border border-rim rounded px-2 py-0.5">#{post.id}</span>
              <h3 className="text-snow font-semibold">{post.title}</h3>
            </div>
            <p className="text-ghost text-sm">{post.body}</p>
          </div>
        ))
      )}
    </div>
  )
}

// ─── Reports (ABAC) ──────────────────────────────────────────────────────────
export function UserReports() {
  const { user } = useAuthStore()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/user/reports')
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="animate-fade-up space-y-5">
      <div>
        <h2 className="font-display text-2xl text-snow italic">Тайлан</h2>
        <p className="text-ghost text-sm font-mono mt-0.5">
          ABAC policy: <span className="text-iris">finance хэлтэс + level ≥ 3</span> шаардлагатай
        </p>
      </div>

      {error ? (
        <div className="bg-plate border border-rim/60 rounded-xl overflow-hidden">
          <div className="bg-flame/5 border-b border-flame/20 px-5 py-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-flame animate-pulse" />
            <span className="text-flame text-sm font-mono">ABAC: Хандах татгалзлаа</span>
          </div>
          <div className="px-5 py-5 space-y-4">
            <div className="text-smoke text-sm">{error}</div>
            <div className="bg-ink border border-rim rounded-lg p-4 font-mono text-xs space-y-2">
              <div className="text-ghost text-[10px] tracking-widest uppercase mb-3">Таны attributes</div>
              <div className="flex gap-4">
                <div><span className="text-ghost">department:</span> <span className="text-iris">{user?.department || 'тохируулаагүй'}</span></div>
                <div><span className="text-ghost">level:</span> <span className="text-iris">{user?.level}</span></div>
              </div>
              <div className="border-t border-rim pt-2 mt-2 text-ghost">
                Шаардлага: <span className="text-volt">department = "finance"</span> AND <span className="text-volt">level ≥ 3</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-moss/5 border border-moss/20 rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-moss" />
            <span className="text-moss text-sm font-mono">
              ABAC зөвшөөрсөн — policy: <strong>{data?.abacPolicy || 'RBAC fallback'}</strong>
            </span>
          </div>
          {(data?.reports || []).map(r => (
            <div key={r.id} className="bg-plate border border-rim rounded-xl p-5 hover:border-iris/30 transition-colors flex items-center gap-4">
              <div className="text-2xl opacity-50">📊</div>
              <div>
                <div className="text-snow font-semibold">{r.title}</div>
                <div className="text-ghost text-xs font-mono mt-0.5">{r.date}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
