import { createContext, useContext, useState, useEffect } from 'react'
import { useSocket } from './SocketContext'

const Ctx = createContext(null)

export function CallProvider({ children }) {
  const { socket } = useSocket()
  const [incomingCall, setIncomingCall] = useState(null)

  useEffect(() => {
    if (!socket) return
    const onOffer = ({ offer, fromSocketId, fromUserId, fromUsername }) =>
      setIncomingCall({ offer, fromSocketId, fromUserId, fromUsername })
    const onEnded = () => setIncomingCall(null)
    socket.on('dm_call_offer', onOffer)
    socket.on('dm_call_ended', onEnded)
    return () => { socket.off('dm_call_offer', onOffer); socket.off('dm_call_ended', onEnded) }
  }, [socket])

  return (
    <Ctx.Provider value={{ incomingCall, clearIncomingCall: () => setIncomingCall(null) }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCall = () => useContext(Ctx)
