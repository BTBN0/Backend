// src/pages/admin/Users.jsx
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { Tag, Button, Input, Select, Loading, ErrorBox, SectionLabel, Card } from '../../components/ui'
import { useToast } from '../../components/ui'
import { Plus, X, RefreshCw } from 'lucide-react'

export default function AdminUsers() {
  const [users,   setUsers]   = useState([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [showForm,setShowForm]= useState(false)
  const [saving,  setSaving]  = useState(null) // userId being updated
  const { toast } = useToast()

  // Create form state
  const [form, setForm] = useState({ email: '', name: '', password: '', department: '', region: '', role: 'user' })

  async function load() {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get('/admin/users?limit=50')
      setUsers(data.data || [])
      setTotal(data.meta?.total || 0)
    } catch (e) { setError(e.response?.data?.error || e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function toggleActive(u) {
    setSaving(u.id)
    try {
      await api.put(`/admin/users/${u.id}`, { isActive: !u.isActive })
      toast(u.isActive ? 'Идэвхгүй болголоо' : 'Идэвхжүүллээ')
      load()
    } catch (e) { toast(e.response?.data?.error || e.message, 'error') }
    finally { setSaving(null) }
  }

  async function createUser() {
    setSaving('new')
    try {
      await api.post('/admin/users', {
        ...form,
        roles: [form.role],
        department: form.department || undefined,
        region: form.region || undefined,
      })
      toast('Хэрэглэгч үүслээ!')
      setShowForm(false)
      setForm({ email: '', name: '', password: '', department: '', region: '', role: 'user' })
      load()
    } catch (e) { toast(e.response?.data?.error || e.message, 'error') }
    finally { setSaving(null) }
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-snow italic">Хэрэглэгчид</h2>
          <p className="text-ghost text-sm font-mono mt-0.5">Нийт {total} хэрэглэгч</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={load}><RefreshCw size={13} /></Button>
          <Button variant="volt"  size="sm" onClick={() => setShowForm(s => !s)}>
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? 'Хаах' : 'Нэмэх'}
          </Button>
        </div>
      </div>

      <ErrorBox message={error} />

      {/* Create form */}
      {showForm && (
        <Card className="animate-fade-up">
          <SectionLabel>Шинэ хэрэглэгч</SectionLabel>
          <div className="grid grid-cols-2 gap-4">
            <Input label="И-мэйл" type="email" placeholder="user@example.com"
              value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
            <Input label="Нэр" placeholder="Нэр"
              value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
            <Input label="Нууц үг" type="password" placeholder="••••••"
              value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} />
            <Select label="Role" value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))}>
              <option value="user">user</option>
              <option value="manager">manager</option>
              <option value="admin">admin</option>
            </Select>
            <Input label="Хэлтэс" placeholder="engineering"
              value={form.department} onChange={e => setForm(p => ({...p, department: e.target.value}))} />
            <Input label="Бүсчлэл" placeholder="MN"
              value={form.region} onChange={e => setForm(p => ({...p, region: e.target.value}))} />
          </div>
          <div className="flex gap-2 mt-5">
            <Button onClick={createUser} disabled={saving === 'new'}>
              {saving === 'new' ? 'Үүсгэж байна...' : 'Үүсгэх'}
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Цуцлах</Button>
          </div>
        </Card>
      )}

      {/* Table */}
      {loading ? <Loading /> : (
        <div className="bg-plate border border-rim rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rim">
                  {['Хэрэглэгч', 'И-мэйл', 'Role', 'Хэлтэс', 'Lvl', 'Бүс', 'Төлөв', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[.14em] uppercase text-ghost font-mono">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-rim/20 hover:bg-iris/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold flex-shrink-0
                          ${u.roles?.[0] === 'admin' ? 'bg-gradient-to-br from-gold to-amber-600 text-ink' : 'bg-gradient-to-br from-iris to-violet-700 text-white'}`}>
                          {u.name[0]}
                        </div>
                        <span className="text-snow text-xs">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ghost font-mono text-xs">{u.email}</td>
                    <td className="px-4 py-3">{(u.roles||[]).map(r => <Tag key={r} variant={r}>{r}</Tag>)}</td>
                    <td className="px-4 py-3 text-ghost text-xs font-mono">{u.department || '—'}</td>
                    <td className="px-4 py-3 text-smoke text-xs">{u.level}</td>
                    <td className="px-4 py-3 text-ghost text-xs font-mono">{u.region || '—'}</td>
                    <td className="px-4 py-3"><Tag variant={u.isActive ? 'active' : 'inactive'}>{u.isActive ? '●' : '○'}</Tag></td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm" variant="ghost"
                        disabled={saving === u.id}
                        onClick={() => toggleActive(u)}
                      >
                        {u.isActive ? 'Идэвхгүй' : 'Идэвхжүүлэх'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
