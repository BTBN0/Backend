import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getSocket, EVENTS } from '../lib/socket'
import { messageApi, channelApi } from '../lib/api'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)

const MOCK_CHANNELS = [
  { id: 'general',  name: 'general',        icon: '🔥', type: 'channel', unread: 0 },
  { id: 'frontend', name: 'front-end',       icon: '#',  type: 'channel', unread: 3 },
  { id: 'design',   name: 'design',          icon: '🎨', type: 'channel', unread: 0 },
  { id: 'releases', name: 'releases',        icon: '🚀', type: 'channel', unread: 1 },
  { id: 'random',   name: 'random',          icon: '🎲', type: 'channel', unread: 0 },
]

const MOCK_DMS = [
  { id: 'dm-sofia',  name: 'Sofia R.',   initials: 'SR', color: '#be185d', bg: '#fce7f3', status: 'online'  },
  { id: 'dm-marcus', name: 'Marcus K.',  initials: 'MK', color: '#7c3aed', bg: '#ede9fe', status: 'online'  },
  { id: 'dm-priya',  name: 'Priya L.',   initials: 'PL', color: '#059669', bg: '#d1fae5', status: 'away'    },
  { id: 'dm-jamie',  name: 'Jamie T.',   initials: 'JT', color: '#d97706', bg: '#fef3c7', status: 'offline' },
]

const makeMockMessages = (channelId) => [
  {
    id: '1', channelId,
    user: { id: 'sofia', name: 'Sofia R.', initials: 'SR', color: '#be185d', bg: '#fce7f3' },
    text: 'Hey team 👋 the UI kit refactor is almost done. Will push to staging tonight.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    reactions: [{ emoji: '👀', count: 3, users: [] }],
    type: 'text',
  },
  {
    id: '2', channelId,
    user: { id: 'marcus', name: 'Marcus K.', initials: 'MK', color: '#7c3aed', bg: '#ede9fe' },
    text: 'Nice! The `refreshToken()` edge case is fixed too right?',
    createdAt: new Date(Date.now() - 3000000).toISOString(),
    reactions: [],
    type: 'text',
  },
  {
    id: '3', channelId,
    user: { id: 'sofia', name: 'Sofia R.', initials: 'SR', color: '#be185d', bg: '#fce7f3' },
    text: 'Yes, addressed it with a retry loop. PR is up for review 🚀',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    reactions: [{ emoji: '✅', count: 2, users: [] }, { emoji: '🔥', count: 1, users: [] }],
    type: 'text',
  },
]

export function ChatProvider({ children }) {
  const { user } = useAuth()
  const [channels]        = useState(MOCK_CHANNELS)
  const [dms]             = useState(MOCK_DMS)
  const [activeId, setActiveId] = useState('general')
  const [messages, setMessages] = useState({})
  const [onlineUsers, setOnlineUsers] = useState(new Set(['sofia', 'marcus']))
  const [typingUsers, setTypingUsers] = useState({})
  const [notifications, setNotifications] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const typingTimer = useRef({})

  // Load messages for active channel
  useEffect(() => {
    if (!activeId) return
    if (!messages[activeId]) {
      // Mock: load from mock data. Real: await messageApi.list(activeId)
      setMessages(prev => ({ ...prev, [activeId]: makeMockMessages(activeId) }))
    }
  }, [activeId])

  // Socket setup
  useEffect(() => {
    if (!user) return
    const socket = getSocket()

    socket.on(EVENTS.NEW_MESSAGE, (msg) => {
      setMessages(prev => ({
        ...prev,
        [msg.channelId]: [...(prev[msg.channelId] || []), msg],
      }))
      if (msg.channelId !== activeId) {
        addNotification({ type: 'message', channel: msg.channelId, from: msg.user.name, text: msg.text })
      }
    })

    socket.on(EVENTS.USER_ONLINE,  ({ userId }) => setOnlineUsers(s => new Set([...s, userId])))
    socket.on(EVENTS.USER_OFFLINE, ({ userId }) => setOnlineUsers(s => { const n = new Set(s); n.delete(userId); return n }))

    socket.on(EVENTS.TYPING, ({ channelId, user: u, typing }) => {
      setTypingUsers(prev => {
        const ch = { ...(prev[channelId] || {}) }
        if (typing) ch[u.id] = u.name
        else delete ch[u.id]
        return { ...prev, [channelId]: ch }
      })
    })

    socket.on(EVENTS.NOTIFICATION, (n) => addNotification(n))

    return () => {
      socket.off(EVENTS.NEW_MESSAGE)
      socket.off(EVENTS.USER_ONLINE)
      socket.off(EVENTS.USER_OFFLINE)
      socket.off(EVENTS.TYPING)
      socket.off(EVENTS.NOTIFICATION)
    }
  }, [user, activeId])

  const addNotification = useCallback((n) => {
    const id = Date.now()
    setNotifications(prev => [{ ...n, id }, ...prev].slice(0, 20))
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== id)), 4000)
  }, [])

  const sendMessage = useCallback(async (text, file = null) => {
    if (!user || (!text.trim() && !file)) return

    const socket = getSocket()
    const msg = {
      id: Date.now().toString(),
      channelId: activeId,
      user: { id: user.id, name: user.name, initials: user.initials, avatar: user.avatar },
      text,
      createdAt: new Date().toISOString(),
      reactions: [],
      type: file ? 'file' : 'text',
      file: file ? { name: file.name, size: file.size, url: URL.createObjectURL(file), type: file.type } : null,
    }

    // Optimistic update
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), msg] }))

    // Emit via socket (real backend will broadcast to others)
    socket.emit(EVENTS.SEND_MESSAGE, { channelId: activeId, text, fileId: file?.id })

    // Real: await messageApi.send(activeId, { text })
  }, [user, activeId])

  const uploadFile = useCallback(async (file) => {
    setUploading(true)
    setUploadProgress(0)
    try {
      // Mock upload — real: const { data } = await fileApi.upload(activeId, file, setUploadProgress)
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(r => setTimeout(r, 80))
        setUploadProgress(i)
      }
      await sendMessage(`📎 ${file.name}`, file)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [activeId, sendMessage])

  const startTyping = useCallback(() => {
    const socket = getSocket()
    socket.emit(EVENTS.TYPING_START, { channelId: activeId })
    clearTimeout(typingTimer.current[activeId])
    typingTimer.current[activeId] = setTimeout(() => {
      socket.emit(EVENTS.TYPING_STOP, { channelId: activeId })
    }, 2000)
  }, [activeId])

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const activeChannel = [...channels, ...dms].find(c => c.id === activeId)
  const activeMessages = messages[activeId] || []
  const activeTyping = Object.values(typingUsers[activeId] || {})

  return (
    <Ctx.Provider value={{
      channels, dms, activeId, setActiveId,
      activeChannel, activeMessages, activeTyping,
      onlineUsers, notifications, uploading, uploadProgress,
      sendMessage, uploadFile, startTyping, dismissNotification,
      addNotification,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useChat = () => useContext(Ctx)
