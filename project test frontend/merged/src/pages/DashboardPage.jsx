import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, LogOut, Copy, Check, Hash, Users, ChevronRight } from 'lucide-react'
import { workspaceApi, channelApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const WorkspaceAvatar = ({ workspace, size=44 }) => {
  const g = ['linear-gradient(135deg,#3b82f6,#6366f1)','linear-gradient(135deg,#8b5cf6,#ec4899)','linear-gradient(135deg,#06b6d4,#3b82f6)','linear-gradient(135deg,#10b981,#06b6d4)','linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#ec4899,#f43f5e)']
  const grad = g[workspace?.name?.charCodeAt(0) % g.length] || g[0]
  if (workspace?.avatar) return <img src={workspace.avatar} alt={workspace.name} style={{ width:size, height:size, borderRadius:12, objectFit:'cover', flexShrink:0 }}/>
  return <div style={{ width:size, height:size, borderRadius:12, background:grad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:size*0.38, fontWeight:700, flexShrink:0 }}>{workspace?.name?.[0]?.toUpperCase()}</div>
}

const UserAvatar = ({ user, size=32 }) => {
  const g = ['linear-gradient(135deg,#3b82f6,#6366f1)','linear-gradient(135deg,#8b5cf6,#ec4899)','linear-gradient(135deg,#06b6d4,#3b82f6)','linear-gradient(135deg,#10b981,#06b6d4)']
  const grad = g[user?.username?.charCodeAt(0) % g.length] || g[0]
  if (user?.avatar) return <img src={user.avatar} alt={user.username} style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover' }}/>
  return <div style={{ width:size, height:size, borderRadius:'50%', background:grad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:size*0.38, fontWeight:600 }}>{user?.username?.[0]?.toUpperCase()}</div>
}

const WorkspaceCard = ({ workspace, onEnter }) => {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const copyInvite = async (e) => { e.stopPropagation(); await navigator.clipboard.writeText(workspace.inviteCode); setCopied(true); setTimeout(()=>setCopied(false),2000) }
  return (
    <div onClick={()=>onEnter(workspace)} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ background:hovered?'var(--surface2)':'var(--surface)', border:'1px solid', borderColor:hovered?'var(--border2)':'var(--border)', borderRadius:14, padding:'16px 18px', cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', gap:14 }}>
      <WorkspaceAvatar workspace={workspace} size={44}/>
      <div style={{ flex:1, minWidth:0 }}>
        <h3 style={{ fontSize:15, fontWeight:600, color:'var(--text)', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{workspace.name}</h3>
        {workspace.description && <p style={{ fontSize:12, color:'var(--text4)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:4 }}>{workspace.description}</p>}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <code style={{ fontSize:10, color:'var(--text5)', fontFamily:'monospace', background:'var(--surface3)', padding:'2px 6px', borderRadius:4 }}>{workspace.inviteCode}</code>
          <button onClick={copyInvite} style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 7px', background:'none', border:'1px solid var(--border2)', borderRadius:5, cursor:'pointer', color:copied?'var(--green)':'var(--text4)', fontSize:11, fontWeight:500, transition:'all 0.15s' }}>
            {copied ? <Check size={10}/> : <Copy size={10}/>}{copied?'Хуулсан':'Хуулах'}
          </button>
        </div>
      </div>
      <ChevronRight size={16} color="var(--text5)" style={{ flexShrink:0, opacity:hovered?1:0, transition:'opacity 0.15s' }}/>
    </div>
  )
}

const Modal = ({ title, children, onClose }) => (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:'0 16px' }}>
    <div style={{ width:'100%', maxWidth:400, background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:16, overflow:'hidden', boxShadow:'0 24px 48px rgba(0,0,0,0.5)' }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h3 style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{title}</h3>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text5)', cursor:'pointer', fontSize:18, lineHeight:1 }}>✕</button>
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  </div>
)

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [createForm, setCreateForm] = useState({ name:'', description:'' })
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    workspaceApi.list().then(({ data }) => setWorkspaces(data.data||[])).finally(()=>setLoading(false))
  }, [])

  const handleEnter = async (ws) => {
    const { data } = await channelApi.list(ws.id)
    const chs = data.data || []
    if (chs.length > 0) navigate(`/chat/${ws.id}/${chs[0].id}`)
  }

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true)
    try {
      const { data } = await workspaceApi.create(createForm)
      setWorkspaces(p => [...p, data.data]); setShowCreate(false); setCreateForm({ name:'', description:'' }); handleEnter(data.data)
    } catch(err) { setError(err.response?.data?.message||'Үүсгэх амжилтгүй') }
    finally { setSubmitting(false) }
  }

  const handleJoin = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true)
    try {
      const { data } = await workspaceApi.join(joinCode)
      setWorkspaces(p => [...p, data.data]); setShowJoin(false); setJoinCode(''); handleEnter(data.data)
    } catch(err) { setError(err.response?.data?.message||'Нэгдэх амжилтгүй') }
    finally { setSubmitting(false) }
  }

  const inp = { width:'100%', background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:9, padding:'9px 12px', color:'var(--text)', fontSize:13, marginBottom:12, outline:'none', transition:'border-color 0.15s' }
  const btn = { width:'100%', padding:'10px', borderRadius:9, border:'none', background:'var(--text)', color:'var(--bg)', fontSize:13, fontWeight:600, cursor:'pointer' }

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <div style={{ height:52, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', background:'var(--surface)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#27272a,#18181b)', border:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:10, fontWeight:700, color:'var(--text)' }}>AS</span>
          </div>
          <span style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>AuraSync</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={()=>navigate('/profile')}>
            <UserAvatar user={user} size={28}/>
            <span style={{ fontSize:13, color:'var(--text3)', fontWeight:500 }}>@{user?.username}</span>
          </div>
          <button onClick={logout} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', background:'none', border:'1px solid var(--border)', borderRadius:7, color:'var(--text4)', fontSize:12, cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.color='var(--text)' }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text4)' }}>
            <LogOut size={12}/> Гарах
          </button>
        </div>
      </div>

      <div style={{ flex:1, maxWidth:720, width:'100%', margin:'0 auto', padding:'48px 24px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:'var(--text)', marginBottom:4 }}>Сайн байна уу, {user?.username} 👋</h1>
            <p style={{ fontSize:14, color:'var(--text4)' }}>Үргэлжлүүлэхэд тавтай морил</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>{ setError(''); setShowJoin(true) }}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:9, color:'var(--text3)', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}
              onMouseEnter={e=>{ e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='var(--text5)' }}
              onMouseLeave={e=>{ e.currentTarget.style.color='var(--text3)'; e.currentTarget.style.borderColor='var(--border2)' }}>
              <Hash size={13}/> Нэгдэх
            </button>
            <button onClick={()=>{ setError(''); setShowCreate(true) }}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'var(--text)', border:'none', borderRadius:9, color:'var(--bg)', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              <Plus size={14}/> Шинэ workspace
            </button>
          </div>
        </div>

        {loading ? <div style={{ textAlign:'center', padding:'64px 0', color:'var(--text5)', fontSize:13 }}>Уншиж байна...</div>
        : workspaces.length===0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ width:56, height:56, borderRadius:16, background:'var(--surface2)', border:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><Users size={24} color="var(--text5)"/></div>
            <p style={{ fontSize:15, fontWeight:600, color:'var(--text3)', marginBottom:6 }}>Workspace байхгүй</p>
            <p style={{ fontSize:13, color:'var(--text5)', marginBottom:20 }}>Шинэ workspace үүсгэх эсвэл урилгаар нэгдэх</p>
            <button onClick={()=>setShowCreate(true)} style={{ padding:'9px 20px', background:'var(--text)', border:'none', borderRadius:9, color:'var(--bg)', fontSize:13, fontWeight:600, cursor:'pointer' }}>Эхний workspace үүсгэх</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {workspaces.map(ws => <WorkspaceCard key={ws.id} workspace={ws} onEnter={handleEnter}/>)}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Workspace үүсгэх" onClose={()=>setShowCreate(false)}>
          {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'8px 12px', marginBottom:14, color:'#fca5a5', fontSize:12 }}>{error}</div>}
          <form onSubmit={handleCreate}>
            <label style={{ display:'block', fontSize:11, fontWeight:500, color:'var(--text4)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.4px' }}>Нэр</label>
            <input type="text" placeholder="Миний workspace" required value={createForm.name} onChange={e=>setCreateForm({...createForm,name:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor='var(--text5)'} onBlur={e=>e.target.style.borderColor='var(--border2)'}/>
            <label style={{ display:'block', fontSize:11, fontWeight:500, color:'var(--text4)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.4px' }}>Тайлбар <span style={{ color:'var(--text5)' }}>(заавал биш)</span></label>
            <input type="text" placeholder="Энэ workspace юунд зориулагдсан бэ?" value={createForm.description} onChange={e=>setCreateForm({...createForm,description:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor='var(--text5)'} onBlur={e=>e.target.style.borderColor='var(--border2)'}/>
            <button type="submit" disabled={submitting} style={{ ...btn, opacity:submitting?0.6:1, cursor:submitting?'not-allowed':'pointer' }}>{submitting?'Үүсгэж байна...':'Workspace үүсгэх →'}</button>
          </form>
        </Modal>
      )}

      {showJoin && (
        <Modal title="Workspace-д нэгдэх" onClose={()=>setShowJoin(false)}>
          {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'8px 12px', marginBottom:14, color:'#fca5a5', fontSize:12 }}>{error}</div>}
          <form onSubmit={handleJoin}>
            <label style={{ display:'block', fontSize:11, fontWeight:500, color:'var(--text4)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.4px' }}>Урилгын код</label>
            <input type="text" placeholder="Кодоо оруулна уу..." required value={joinCode} onChange={e=>setJoinCode(e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor='var(--text5)'} onBlur={e=>e.target.style.borderColor='var(--border2)'}/>
            <button type="submit" disabled={submitting} style={{ ...btn, opacity:submitting?0.6:1, cursor:submitting?'not-allowed':'pointer' }}>{submitting?'Нэгдэж байна...':'Workspace-д нэгдэх →'}</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
export default DashboardPage
