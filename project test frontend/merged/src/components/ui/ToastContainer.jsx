import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'
import { EV } from '../../lib/socket'

const Toast = ({ toast, onClose }) => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => handleClose(), 5000)
    return () => clearTimeout(t)
  }, [])
  const handleClose = () => { setLeaving(true); setTimeout(() => onClose(toast.id), 300) }
  const handleClick = () => { if(toast.link) navigate(toast.link); handleClose() }
  const typeColors = { dm:'border-indigo-500/40 bg-indigo-500/5', friend_request:'border-purple-500/40 bg-purple-500/5', friend_accepted:'border-green-500/40 bg-green-500/5', mention:'border-amber-500/40 bg-amber-500/5', default:'border-[#2d3748] bg-[#1a1d27]' }
  const typeIcons  = { dm:'💬', friend_request:'👥', friend_accepted:'✅', mention:'🔔', default:'🔔' }
  return (
    <div onClick={handleClick} style={{ transform:visible&&!leaving?'translateX(0)':'translateX(120%)', opacity:visible&&!leaving?1:0, transition:'transform 0.3s ease, opacity 0.3s ease' }}
      className={`w-80 bg-[#1a1d27] border ${typeColors[toast.type]||typeColors.default} rounded-xl shadow-2xl cursor-pointer overflow-hidden`}>
      <div className="h-0.5 bg-[#2d3748] w-full"><div className="h-full bg-indigo-500 origin-left" style={{ animation:'shrink 5s linear forwards' }}/></div>
      <div className="p-3 flex items-start gap-3">
        <div className="flex-shrink-0">{toast.avatar ? <img src={toast.avatar} alt="" className="w-9 h-9 rounded-full object-cover"/> : <div className="w-9 h-9 bg-[#2d3748] rounded-full flex items-center justify-center text-base">{typeIcons[toast.type]||'🔔'}</div>}</div>
        <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{toast.title}</p><p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{toast.message}</p></div>
        <button onClick={e=>{e.stopPropagation();handleClose()}} className="text-slate-600 hover:text-white transition text-xs flex-shrink-0 mt-0.5">✕</button>
      </div>
    </div>
  )
}

const ToastContainer = () => {
  const { socket } = useSocket()
  const { user } = useAuth()
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)
  const add = (t) => setToasts(p => [...p, { ...t, id:++counter.current }])
  const remove = (id) => setToasts(p => p.filter(t=>t.id!==id))

  useEffect(() => {
    if (!socket || !user) return
    const onDM  = (msg) => { if(msg.senderId===user.id) return; add({ type:'dm', title:`💬 ${msg.sender?.username||'Шинэ мессеж'}`, message:msg.content||'Файл илгээлээ', avatar:msg.sender?.avatar, link:`/dm/${msg.senderId}` }) }
    const onReq = (req) => add({ type:'friend_request', title:'👥 Найзын хүсэлт', message:`${req.sender?.username} найзын хүсэлт илгээлээ`, avatar:req.sender?.avatar, link:'/friends' })
    const onAcc = ({ username }) => add({ type:'friend_accepted', title:'✅ Хүсэлт хүлээн авав', message:`${username} таны хүсэлтийг зөвшөөрлөө`, link:'/friends' })
    const onMsg = (msg) => { if(msg.user?.id===user.id) return; if(!msg.content?.includes(`@${user.username}`)) return; add({ type:'mention', title:`🔔 ${msg.user?.username} таныг дурдлаа`, message:msg.content, avatar:msg.user?.avatar, link:msg.channelId?`/chat/${msg.workspaceId}/${msg.channelId}`:null }) }
    socket.on(EV.DM_NEW, onDM); socket.on(EV.FRIEND_REQUEST_RECEIVED, onReq); socket.on(EV.FRIEND_ACCEPTED, onAcc); socket.on(EV.NEW_MESSAGE, onMsg)
    return () => { socket.off(EV.DM_NEW, onDM); socket.off(EV.FRIEND_REQUEST_RECEIVED, onReq); socket.off(EV.FRIEND_ACCEPTED, onAcc); socket.off(EV.NEW_MESSAGE, onMsg) }
  }, [socket, user])

  if (!toasts.length) return null
  return (
    <>
      <style>{`@keyframes shrink { from{transform:scaleX(1)} to{transform:scaleX(0)} }`}</style>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => <Toast key={t.id} toast={t} onClose={remove}/>)}
      </div>
    </>
  )
}
export default ToastContainer
