// src/pages/admin/Roles.jsx
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { Tag, Loading, ErrorBox, SectionLabel } from '../../components/ui'

export default function Roles() {
  const [roles, setRoles]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/admin/roles')
      .then(r => setRoles(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h2 className="font-display text-2xl text-snow italic">Roles & Permissions</h2>
        <p className="text-ghost text-sm font-mono mt-0.5">RBAC — Role-д суурилсан хандалт</p>
      </div>

      {roles.map(role => (
        <div key={role.id} className="bg-plate border border-rim rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-rim flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag variant={role.name}>{role.name}</Tag>
              <span className="text-snow text-sm">{role.description}</span>
            </div>
            <span className="text-ghost text-xs font-mono">{role._count?.users || 0} хэрэглэгч</span>
          </div>
          <div className="px-5 py-4 flex flex-wrap gap-2">
            {role.permissions.length === 0
              ? <span className="text-ghost text-xs font-mono">Permission байхгүй</span>
              : role.permissions.map(rp => (
                  <Tag key={rp.permission.id} variant="perm">
                    {rp.permission.action}:{rp.permission.resource}
                  </Tag>
                ))
            }
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

// src/pages/admin/Abac.jsx  (exported below)
export function Abac() {
  const [policies, setPolicies] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    api.get('/admin/abac-policies')
      .then(r => setPolicies(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />

  return (
    <div className="animate-fade-up space-y-5">
      <div>
        <h2 className="font-display text-2xl text-snow italic">ABAC Policies</h2>
        <p className="text-ghost text-sm font-mono mt-0.5">Attribute-д суурилсан нарийн нөхцөлт хандалт</p>
      </div>

      {/* Legend */}
      <div className="bg-iris/5 border border-iris/20 rounded-xl px-5 py-4 text-xs font-mono text-ghost space-y-1">
        <div className="text-iris text-[10px] tracking-[.15em] uppercase font-semibold mb-2">Хэрхэн ажилладаг вэ?</div>
        <div>1. Хандалт хүссэн үед бүх policy-г priority-оор эрэмбэлж шалгана</div>
        <div>2. Subject (хэрэглэгч) + Resource нөхцөл хоёулаа тохирвол ALLOW/DENY шийднэ</div>
        <div>3. Ямар ч policy тохирохгүй бол RBAC permission-оор fallback хийнэ</div>
      </div>

      {policies.map(p => (
        <div key={p.id} className="bg-plate border border-rim rounded-xl p-5 hover:border-iris/30 transition-colors">
          <div className="flex items-start gap-4">
            <div className={`px-2.5 py-1 rounded text-[9px] tracking-[.1em] uppercase font-mono font-bold flex-shrink-0 mt-0.5
              ${p.effect === 'ALLOW' ? 'bg-moss/15 text-moss' : 'bg-flame/15 text-flame'}`}>
              {p.effect}
            </div>
            <div className="flex-1">
              <div className="text-snow text-sm font-semibold mb-1">{p.name}</div>
              <div className="text-ghost text-xs font-mono mb-3">{p.description}</div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] text-ghost">Subject:</span>
                {Object.entries(p.subjectConditions || {}).map(([k, v]) => (
                  <span key={k} className="bg-ink border border-rim rounded px-2 py-0.5 text-[11px] font-mono text-iris">
                    {k}: {JSON.stringify(v)}
                  </span>
                ))}
                <span className="text-[10px] text-ghost ml-2">Resource:</span>
                {Object.entries(p.resourceConditions || {}).map(([k, v]) => (
                  <span key={k} className="bg-ink border border-rim rounded px-2 py-0.5 text-[11px] font-mono text-iris">
                    {k}: {JSON.stringify(v)}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-ink border border-rim rounded px-2 py-1 text-[10px] font-mono text-ghost flex-shrink-0">
              p:{p.priority}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

// src/pages/admin/AuditLogs.jsx  (exported below)
export function AuditLogs() {
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [filter,  setFilter]  = useState('all')

  useEffect(() => {
    api.get('/admin/audit-logs?limit=50')
      .then(r => setLogs(r.data.data || []))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? logs : logs.filter(l => l.result === filter)

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-snow italic">Audit Logs</h2>
          <p className="text-ghost text-sm font-mono mt-0.5">Хандалт бүрийн бүртгэл</p>
        </div>
        <div className="flex gap-2">
          {['all','allowed','denied'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] tracking-[.1em] uppercase font-mono px-3 py-1.5 rounded border transition-all
                ${filter === f
                  ? 'border-iris/60 bg-iris/10 text-iris'
                  : 'border-rim text-ghost hover:border-iris/30'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-plate border border-rim rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rim">
                {['User', 'Үйлдэл', 'Resource', 'Үр дүн', 'Шалтгаан', 'IP', 'Огноо'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[.14em] uppercase text-ghost font-mono">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-ghost text-xs font-mono">Лог байхгүй</td></tr>
              ) : filtered.map((log, i) => (
                <tr key={i} className="border-b border-rim/20 hover:bg-iris/3 transition-colors">
                  <td className="px-4 py-2.5 text-ghost font-mono text-[11px]">{log.userId ? log.userId.slice(0,8)+'…' : 'anon'}</td>
                  <td className="px-4 py-2.5 text-smoke font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-2.5 text-smoke font-mono text-xs">{log.resource}</td>
                  <td className="px-4 py-2.5"><Tag variant={log.result}>{log.result}</Tag></td>
                  <td className="px-4 py-2.5 text-ghost text-[11px] font-mono max-w-[180px] truncate">{log.reason || '—'}</td>
                  <td className="px-4 py-2.5 text-ghost text-[11px] font-mono">{log.ipAddress || '—'}</td>
                  <td className="px-4 py-2.5 text-ghost text-[11px] font-mono whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('mn-MN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
