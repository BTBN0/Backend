import { createContext, useContext, useEffect, useState } from 'react'
import { getSocket, EV } from '../lib/socket'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!user) return
    const socket = getSocket()

    const onOnline  = ({ userId }) => setOnlineUsers(p => [...new Set([...p, userId])])
    const onOffline = ({ userId }) => setOnlineUsers(p => p.filter(id => id !== userId))
    const onKicked  = ({ message }) => { alert(`Та энэ workspace-аас хасагдлаа.\n\nШалтгаан: ${message}`); window.location.href = '/' }
    const onExpired = ({ message }) => { localStorage.removeItem('cz-token'); alert(`Session дуусав: ${message}`); window.location.reload() }

    socket.on(EV.USER_ONLINE,  onOnline)
    socket.on(EV.USER_OFFLINE, onOffline)
    socket.on('kicked_from_workspace', onKicked)
    socket.on(EV.SESSION_EXPIRED, onExpired)

    return () => {
      socket.off(EV.USER_ONLINE,  onOnline)
      socket.off(EV.USER_OFFLINE, onOffline)
      socket.off('kicked_from_workspace', onKicked)
      socket.off(EV.SESSION_EXPIRED, onExpired)
    }
  }, [user])

  const socket = getSocket()
  return (
    <Ctx.Provider value={{ socket, onlineUsers }}>
      {children}
    </Ctx.Provider>
  )
}

export const useSocket = () => useContext(Ctx)
