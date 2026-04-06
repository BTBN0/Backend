import { useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import { EV } from '../lib/socket'

const requestPermission = async () => {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  return (await Notification.requestPermission()) === 'granted'
}

const show = (title, body, icon, onClick) => {
  if (Notification.permission !== 'granted') return
  if (document.visibilityState === 'visible') return
  const n = new Notification(title, { body, icon: icon || '/favicon.ico', silent: false })
  n.onclick = () => { window.focus(); onClick?.(); n.close() }
  setTimeout(() => n.close(), 5000)
}

const usePushNotifications = () => {
  const { socket } = useSocket()
  const { user } = useAuth()

  useEffect(() => { requestPermission() }, [])

  useEffect(() => {
    if (!socket || !user) return
    const onDM  = (msg) => { if (msg.senderId===user.id) return; show(`💬 ${msg.sender?.username||'Шинэ мессеж'}`, msg.content||'Файл илгээлээ', msg.sender?.avatar, ()=>{ window.location.href=`/dm/${msg.senderId}` }) }
    const onReq = (req) => show('👥 Найзын хүсэлт', `${req.sender?.username} найзын хүсэлт илгээлээ`, req.sender?.avatar, ()=>{ window.location.href='/friends' })
    const onMsg = (msg) => { if (msg.user?.id===user.id) return; if (!msg.content?.includes(`@${user.username}`)) return; show(`🔔 ${msg.user?.username} таныг дурдлаа`, msg.content, msg.user?.avatar, ()=>{ if (msg.channelId) window.location.href=`/chat/${msg.workspaceId}/${msg.channelId}` }) }
    socket.on(EV.DM_NEW, onDM)
    socket.on(EV.FRIEND_REQUEST_RECEIVED, onReq)
    socket.on(EV.NEW_MESSAGE, onMsg)
    return () => { socket.off(EV.DM_NEW, onDM); socket.off(EV.FRIEND_REQUEST_RECEIVED, onReq); socket.off(EV.NEW_MESSAGE, onMsg) }
  }, [socket, user])
}

export default usePushNotifications
