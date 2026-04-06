import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dmApi, workspaceApi, channelApi, blockApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import useDMWebRTC from '../hooks/useDMWebRTC'
import Sidebar from '../components/sidebar/Sidebar'
import MessageInput from '../components/chat/MessageInput'

const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })

const UserAvatar = ({ user, size='md' }) => {
  const sizes = { sm:'w-7 h-7 text-xs', md:'w-9 h-9 text-sm' }
  const colors = ['bg-indigo-600','bg-purple-600','bg-pink-600','bg-blue-600']
  const color = colors[user?.username?.charCodeAt(0) % colors.length] || 'bg-indigo-600'
  if (user?.avatar) return <img src={user.avatar} alt={user.username} className={`${sizes[size]} rounded-full object-cover flex-shrink-0`}/>
  return <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>{user?.username?.[0]?.toUpperCase()||'?'}</div>
}

const DMPage = () => {
  const { userId } = useParams()
  const { user } = useAuth()
  const { socket, onlineUsers } = useSocket()
  const navigate = useNavigate()

  const [workspaces, setWorkspaces] = useState([])
  const [channels, setChannels] = useState([])
  const [currentWorkspace, setCurrentWorkspace] = useState(null)
  const [messages, setMessages] = useState([])
  const [targetUser, setTargetUser] = useState(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isBlockedBy, setIsBlockedBy] = useState(false)
  const [showBlockConfirm, setShowBlockConfirm] = useState(false)
  const bottomRef = useRef(null)

  const canInteract = !isBlocked && !isBlockedBy
  const { inCall, isMuted, callStatus, startCall, endCall, toggleMute } = useDMWebRTC(socket, userId)
  const isOnline = onlineUsers.includes(userId)

  useEffect(() => {
    workspaceApi.list().then(async ({ data }) => {
      const ws = data.data || []
      setWorkspaces(ws)
      const lastId = localStorage.getItem('lastWorkspaceId') || ws[0]?.id
      const cw = ws.find(w=>w.id===lastId)||ws[0]||null
      setCurrentWorkspace(cw)
      if (cw) {
        const [chRes, memRes] = await Promise.all([channelApi.list(cw.id), dmApi.members(cw.id)])
        setChannels(chRes.data.data || [])
        const found = (memRes.data.data||[]).find(m=>m.id===userId)
        if (found) setTargetUser(found)
      }
    })
  }, [userId])

  useEffect(() => {
    if (!userId) return
    setMessages([])
    dmApi.list(userId).then(({ data }) => {
      const msgs = data.data?.messages || data.data || []
      setMessages(msgs)
      if (msgs.length>0 && !targetUser) {
        const other = msgs[0].senderId===user?.id ? msgs[0].receiver : msgs[0].sender
        setTargetUser(other)
      }
    })
    blockApi.checkBlock(userId).then(({ data }) => setIsBlocked(data.data?.blocked||false)).catch(()=>{})
    // check blocked-by via a separate endpoint if available
    fetch(`/api/blocks/blocked-by/${userId}`, { headers: { Authorization:`Bearer ${localStorage.getItem('cz-token')}` } })
      .then(r=>r.json()).then(d=>setIsBlockedBy(d.data?.blockedBy||false)).catch(()=>{})
  }, [userId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  useEffect(() => {
    if (!socket) return
    const onDM = (msg) => {
      if ((msg.senderId===userId&&msg.receiverId===user?.id)||(msg.senderId===user?.id&&msg.receiverId===userId))
        setMessages(p=>[...p,msg])
    }
    socket.on('dm_new_message', onDM)
    return () => socket.off('dm_new_message', onDM)
  }, [socket, userId])

  const handleSend = async (content, fileUrl, fileType) => {
    if (!canInteract) return
    try {
      const { data } = await dmApi.send(userId, { content, fileUrl, fileType })
      setMessages(p=>[...p,data.data])
      socket?.emit('dm_send', { toUserId:userId, message:data.data })
    } catch(err) { console.error(err) }
  }

  const handleBlock = async () => {
    try {
      const { data } = await blockApi.block(userId)
      setIsBlocked(data.data?.blocked||false)
      setShowBlockConfirm(false)
    } catch(err) { console.error(err) }
  }

  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      <Sidebar workspaces={workspaces} channels={channels} setChannels={setChannels} currentWorkspace={currentWorkspace}/>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-[#2d3748] flex items-center justify-between px-6 bg-[#13161f]">
          <div className="flex items-center gap-3">
            <div className="relative"><UserAvatar user={targetUser} size="sm"/><span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#13161f] ${isOnline?'bg-green-400':'bg-slate-500'}`}/></div>
            <div>
              <h2 className="font-semibold text-white text-sm">{targetUser?.username||'Шууд мессеж'}</h2>
              <p className="text-xs text-slate-500">{isBlocked?'🚫 Та блоклосон':isBlockedBy?'🚫 Блоклогдсон':isOnline?'Online':'Offline'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canInteract && !inCall && <button onClick={startCall} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg transition">📞 Залгах</button>}
            {inCall && <>
              <span className="text-xs text-green-400 font-medium flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>{callStatus==='calling'?'Залгаж байна...':'Дуудлагад'}</span>
              <button onClick={toggleMute} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${isMuted?'bg-red-600/20 text-red-400 border border-red-500/50':'bg-[#2d3748] text-slate-300'}`}>{isMuted?'🔇 Дуу нээх':'🎙️ Дуу хааx'}</button>
              <button onClick={endCall} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition">📵 Дуусгах</button>
            </>}
            {!isBlockedBy && <button onClick={()=>setShowBlockConfirm(true)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${isBlocked?'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30':'bg-[#2d3748] text-slate-400 hover:text-red-400'}`}>{isBlocked?'🚫 Блок цуцлах':'🚫 Блоклох'}</button>}
          </div>
        </div>

        {isBlocked && <div className="px-6 py-3 bg-red-900/10 border-b border-red-700/20 text-center"><p className="text-red-400 text-xs">Та энэ хэрэглэгчийг блоклосон. Блок цуцлахад мессеж бичих болно.</p></div>}
        {isBlockedBy && !isBlocked && <div className="px-6 py-3 bg-[#1a1d27] border-b border-[#2d3748] text-center"><p className="text-slate-500 text-xs">Энэ хүнд мессеж бичих эсвэл залгах боломжгүй.</p></div>}

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
          {messages.length===0 && <div className="flex flex-col items-center justify-center h-full text-slate-500"><p className="text-4xl mb-3">💬</p><p className="text-sm">{canInteract?`${targetUser?.username}-тай ярилцаж эхлэх`:'Мессеж байхгүй'}</p></div>}
          {messages.map((msg,i) => {
            const isOwn = msg.senderId===user?.id
            const showAvatar = i===0 || messages[i-1]?.senderId!==msg.senderId
            return (
              <div key={msg.id} className={`flex items-start gap-3 ${showAvatar?'mt-4':'mt-0.5'}`}>
                <div className="w-9 flex-shrink-0">{showAvatar && <UserAvatar user={isOwn?user:targetUser}/>}</div>
                <div className="flex-1 min-w-0">
                  {showAvatar && <div className="flex items-baseline gap-2 mb-0.5"><span className={`text-sm font-semibold ${isOwn?'text-indigo-400':'text-white'}`}>{isOwn?user?.username:targetUser?.username}</span><span className="text-xs text-slate-500">{formatTime(msg.createdAt)}</span></div>}
                  {msg.deleted ? <p className="text-slate-500 italic text-sm">Мессеж устгагдсан</p> : <>
                    {msg.content && <p className="text-slate-300 text-sm leading-relaxed break-words">{msg.content}</p>}
                    {msg.fileUrl && msg.fileType?.startsWith('image/') && <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="block mt-2"><img src={msg.fileUrl} alt="attachment" className="max-w-xs max-h-64 rounded-xl border border-[#2d3748] object-cover hover:opacity-90 transition"/></a>}
                  </>}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef}/>
        </div>

        <MessageInput onSend={handleSend} onTyping={()=>{}} channelName={targetUser?.username} disabled={!canInteract}/>
      </div>

      {showBlockConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-sm bg-[#1a1d27] border border-[#2d3748] rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-2">{isBlocked?'Блок цуцлах':'Блоклох'} @{targetUser?.username}?</h3>
            <p className="text-slate-400 text-sm mb-6">{isBlocked?'Тэд дахин мессеж бичих болон залгах боломжтой болно.':'Тэд таны мессеж болон дуудлагыг харахгүй.'}</p>
            <div className="flex gap-3">
              <button onClick={()=>setShowBlockConfirm(false)} className="flex-1 py-2.5 border border-[#2d3748] rounded-lg text-slate-400 hover:text-white transition text-sm">Цуцлах</button>
              <button onClick={handleBlock} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium transition text-sm">{isBlocked?'Блок цуцлах':'Блоклох'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default DMPage
