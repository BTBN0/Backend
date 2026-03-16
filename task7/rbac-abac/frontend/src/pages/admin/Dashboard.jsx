// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { StatCard, SectionLabel, Tag, Loading, ErrorBox } from '../../components/ui'
import { useAuthStore } from '../../stores/authStore'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />

  const stats = data?.stats || {}
  const logs  = data?.recentActivity || []

  return (
    <div className="animate-fade-up space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="font-display text-2xl text-snow italic mb-1">
          Сайн уу, {user?.name} <span className="not-italic text-gold text-lg">♛</span>
        </h2>
        <p className="text-ghost text-sm font-mono">Системийн бүрэн хяналт</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="◉" label="Нийт хэрэглэгч" value={stats.totalUsers}  glowColor="iris" />
        <StatCard icon="◈" label="Нийт Role"       value={stats.totalRoles}  glowColor="gold" />
        <StatCard icon="⬡" label="Permission"      value={stats.totalPerms}  glowColor="moss" />
        <StatCard icon="◎" label="Сүүлийн лог"     value={logs.length}       glowColor="flame" />
      </div>

      {/* Recent activity */}
      <div>
        <SectionLabel>Сүүлийн үйлдлүүд</SectionLabel>
        <div className="bg-plate border border-rim rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rim">
                  {['Үйлдэл', 'Resource', 'Үр дүн', 'Шалтгаан', 'Огноо'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[.14em] uppercase text-ghost font-mono">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-ghost text-xs font-mono">Лог байхгүй</td></tr>
                ) : logs.map((log, i) => (
                  <tr key={i} className="border-b border-rim/20 hover:bg-iris/3 transition-colors">
                    <td className="px-4 py-3 text-smoke font-mono text-xs">{log.action}</td>
                    <td className="px-4 py-3 text-smoke font-mono text-xs">{log.resource}</td>
                    <td className="px-4 py-3"><Tag variant={log.result}>{log.result}</Tag></td>
                    <td className="px-4 py-3 text-ghost text-xs font-mono max-w-[200px] truncate">{log.reason || '—'}</td>
                    <td className="px-4 py-3 text-ghost text-xs font-mono whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('mn-MN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
