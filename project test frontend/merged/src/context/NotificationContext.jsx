import { createContext, useContext, useState, useEffect } from 'react'
import { useSocket } from './SocketContext'
import { useAuth } from './AuthContext'
import { EV } from '../lib/socket'

const Ctx = createContext(null)

export function NotificationProvider({ children }) {
  const { socket } = useSocket()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])

  const add = (n) => setNotifications(p => [{ ...n, id: Date.now(), read: false }, ...p])

  useEffect(() => {
    if (!socket || !user) return

    const onFriendReq   = (req)       => add({ type:'friend_request', title:'Найзын хүсэлт', message:`${req.sender?.username} найзын хүсэлт илгээлээ`, link:'/friends' })
    const onFriendAccept= ({ username })=> add({ type:'friend_accepted', title:'Хүсэлт хүлээн авав', message:`${username} таны хүсэлтийг зөвшөөрлөө`, link:'/friends' })
    const onDM          = (msg)       => { if (msg.senderId === user.id) return; add({ type:'dm', title:'Шинэ мессеж', message:`${msg.sender?.username}: ${msg.content||'Файл'}`, link:`/dm/${msg.senderId}` }) }
    const onMsg         = (msg)       => { if (msg.user?.id===user.id) return; if (msg.content?.includes(`@${user.username}`)) add({ type:'mention', title:'Таныг дурдлаа', message:`${msg.user?.username} #${msg.channelName||'channel'}-д дурдлаа`, link:`/chat/${msg.workspaceId}/${msg.channelId}` }) }

    socket.on(EV.FRIEND_REQUEST_RECEIVED, onFriendReq)
    socket.on(EV.FRIEND_ACCEPTED, onFriendAccept)
    socket.on(EV.DM_NEW, onDM)
    socket.on(EV.NEW_MESSAGE, onMsg)
    return () => {
      socket.off(EV.FRIEND_REQUEST_RECEIVED, onFriendReq)
      socket.off(EV.FRIEND_ACCEPTED, onFriendAccept)
      socket.off(EV.DM_NEW, onDM)
      socket.off(EV.NEW_MESSAGE, onMsg)
    }
  }, [socket, user])

  const unreadCount = notifications.filter(n => !n.read).length
  const markRead    = (id) => setNotifications(p => p.map(n => n.id===id ? {...n,read:true} : n))
  const markAllRead = ()   => setNotifications(p => p.map(n => ({...n,read:true})))
  const clearAll    = ()   => setNotifications([])

  return (
    <Ctx.Provider value={{ notifications, unreadCount, markRead, markAllRead, clearAll }}>
      {children}
    </Ctx.Provider>
  )
}

export const useNotifications = () => useContext(Ctx)
