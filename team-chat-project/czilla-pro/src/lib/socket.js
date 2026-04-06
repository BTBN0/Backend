import { io } from 'socket.io-client'

const URL = import.meta.env.VITE_SOCKET_URL || '/'

let socket = null

export const getSocket = () => {
  if (!socket) {
    socket = io(URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

export const connectSocket = (token) => {
  const s = getSocket()
  s.auth = { token }
  s.connect()
  return s
}

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect()
}

// ── Socket event helpers ──
export const EVENTS = {
  // Client → Server
  JOIN_CHANNEL:   'channel:join',
  LEAVE_CHANNEL:  'channel:leave',
  SEND_MESSAGE:   'message:send',
  TYPING_START:   'typing:start',
  TYPING_STOP:    'typing:stop',

  // Server → Client
  NEW_MESSAGE:    'message:new',
  MESSAGE_DELETED:'message:deleted',
  USER_JOINED:    'user:joined',
  USER_LEFT:      'user:left',
  USER_ONLINE:    'user:online',
  USER_OFFLINE:   'user:offline',
  TYPING:         'typing',
  CHANNEL_UPDATED:'channel:updated',
  NOTIFICATION:   'notification',
}
