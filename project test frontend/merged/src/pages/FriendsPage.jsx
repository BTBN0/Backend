import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { friendApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { EV } from '../lib/socket'

const UserAvatar = ({ user, size='md' }) => {
  const sizes = { sm:'w-7 h-7 text-xs', md:'w-10 h-10 text-sm' }
  const colors = ['bg-indigo-600','bg-purple-600','bg-pink-600','bg-blue-600']
  const color = colors[user?.username?.charCodeAt(0) % colors.length] || 'bg-indigo-600'
  if (user?.avatar) return <img src={user.avatar} alt={user.username} className={`${sizes[size]} rounded-full object-cover flex-shrink-0`}/>
  return <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>{user?.username?.[0]?.toUpperCase()||'?'}</div>
}

const FriendsPage = () => {
  const { user } = useAuth()
  const { socket, onlineUsers } = useSocket()
  const navigate = useNavigate()
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [tab, setTab] = useState('friends')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    if (!socket) return
    const onReq  = (req) => setRequests(p => [req,...p])
    const onAcc  = ({ userId, username }) => setFriends(p => [...p,{id:userId,username}])
    socket.on(EV.FRIEND_REQUEST_RECEIVED, onReq)
    socket.on(EV.FRIEND_ACCEPTED, onAcc)
    return () => { socket.off(EV.FRIEND_REQUEST_RECEIVED,onReq); socket.off(EV.FRIEND_ACCEPTED,onAcc) }
  }, [socket])

  const fetchAll = async () => {
    try {
      const [fRes, rRes] = await Promise.all([friendApi.list(), friendApi.requests()])
      setFriends(fRes.data.data||[]); setRequests(rRes.data.data||[])
    } catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSend = async (e) => {
    e.preventDefault(); setError(''); setSuccess('')
    try {
      const { data } = await friendApi.send({ username })
      socket?.emit(EV.FRIEND_REQUEST_SENT, { toUserId:data.data?.receiverId, request:data.data })
      setSuccess(`@${username}-д найзын хүсэлт илгээлээ`); setUsername('')
      setTimeout(()=>setSuccess(''),3000)
    } catch(err) { setError(err.response?.data?.message||'Хүсэлт илгээх амжилтгүй') }
  }

  const handleAccept = async (request) => {
    try {
      await friendApi.accept(request.id)
      setRequests(p=>p.filter(r=>r.id!==request.id)); setFriends(p=>[...p,request.sender])
      socket?.emit(EV.FRIEND_REQUEST_ACCEPTED, { toUserId:request.senderId })
    } catch(err) { console.error(err) }
  }

  const handleDecline = async (requestId) => {
    try { await friendApi.decline(requestId); setRequests(p=>p.filter(r=>r.id!==requestId)) }
    catch(err) { console.error(err) }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="border-b border-[#2d3748] px-8 py-4 flex items-center gap-4">
        <button onClick={()=>navigate(-1)} className="text-slate-400 hover:text-white transition text-sm">← Буцах</button>
        <h1 className="text-lg font-semibold">Найзууд</h1>
        {requests.length>0 && <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full font-medium">{requests.length} хүлээгдэж байна</span>}
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        <div className="mb-8 p-5 bg-[#1a1d27] border border-[#2d3748] rounded-xl">
          <h2 className="text-sm font-semibold text-white mb-3">Найз нэмэх</h2>
          <p className="text-slate-400 text-xs mb-4">Нарийн хэрэглэгчийн нэрээр нэмнэ үү.</p>
          {error && <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
          {success && <div className="mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">{success}</div>}
          <form onSubmit={handleSend} className="flex gap-3">
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} required placeholder="Хэрэглэгчийн нэр"
              className="flex-1 px-4 py-2 bg-[#0f1117] border border-[#2d3748] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm"/>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition">Хүсэлт илгээх</button>
          </form>
        </div>

        <div className="flex gap-1 mb-6 bg-[#1a1d27] p-1 rounded-lg border border-[#2d3748]">
          <button onClick={()=>setTab('friends')} className={`flex-1 py-2 text-sm font-medium rounded-md transition ${tab==='friends'?'bg-indigo-600 text-white':'text-slate-400 hover:text-white'}`}>Найзууд {friends.length>0&&`(${friends.length})`}</button>
          <button onClick={()=>setTab('requests')} className={`flex-1 py-2 text-sm font-medium rounded-md transition ${tab==='requests'?'bg-indigo-600 text-white':'text-slate-400 hover:text-white'}`}>Хүлээгдэж буй {requests.length>0&&`(${requests.length})`}</button>
        </div>

        {loading ? <p className="text-slate-400 text-sm">Уншиж байна...</p>
        : tab==='friends' ? (
          friends.length===0 ? <div className="text-center py-16 text-slate-500"><p className="text-3xl mb-3">👥</p><p className="text-sm">Найз байхгүй — дээрээс нэмнэ үү!</p></div>
          : <div className="space-y-2">{friends.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-4 bg-[#1a1d27] border border-[#2d3748] rounded-xl hover:border-indigo-500/50 transition">
              <div className="relative"><UserAvatar user={f}/><span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1a1d27] ${onlineUsers.includes(f.id)?'bg-green-400':'bg-slate-600'}`}/></div>
              <div className="flex-1"><p className="text-sm font-semibold text-white">{f.username}</p><p className="text-xs text-slate-500">{onlineUsers.includes(f.id)?'Online':'Offline'}</p></div>
              <button onClick={()=>navigate(`/dm/${f.id}`)} className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-lg text-xs font-medium transition">Мессеж</button>
            </div>
          ))}</div>
        ) : (
          requests.length===0 ? <div className="text-center py-16 text-slate-500"><p className="text-3xl mb-3">📬</p><p className="text-sm">Хүсэлт байхгүй</p></div>
          : <div className="space-y-2">{requests.map(req => (
            <div key={req.id} className="flex items-center gap-3 p-4 bg-[#1a1d27] border border-[#2d3748] rounded-xl">
              <UserAvatar user={req.sender}/>
              <div className="flex-1"><p className="text-sm font-semibold text-white">{req.sender.username}</p><p className="text-xs text-slate-500">Найзын хүсэлт илгээлээ</p></div>
              <div className="flex gap-2">
                <button onClick={()=>handleAccept(req)} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-medium transition">Зөвшөөрөх</button>
                <button onClick={()=>handleDecline(req.id)} className="px-3 py-1.5 bg-[#2d3748] hover:bg-red-600/20 text-slate-400 hover:text-red-400 rounded-lg text-xs font-medium transition">Татгалзах</button>
              </div>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  )
}
export default FriendsPage
