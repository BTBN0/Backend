import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi } from '../lib/api'
import { connectSocket, disconnectSocket } from '../lib/socket'

const Ctx = createContext(null)

const persist = (u, token) => {
  if (u?.id) {
    u.initials = (u.username || '??').slice(0, 2).toUpperCase()
    localStorage.setItem('cz-user', JSON.stringify(u))
    if (token) localStorage.setItem('cz-token', token)
  }
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cz-profile')) || {} } catch { return {} }
  })
  const [loading, setLoading] = useState(false)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    // 1. Google OAuth callback — URL-д ?token= байвал хүлээн авна
    const params = new URLSearchParams(window.location.search)
    const oauthToken = params.get('token')
    if (oauthToken) {
      window.history.replaceState({}, '', window.location.pathname)
      localStorage.setItem('cz-token', oauthToken)
      connectSocket(oauthToken)
      authApi.me()
        .then(({ data }) => {
          const u = data.data
          if (u?.id) { persist(u); setUser(u) }
        })
        .catch(() => { localStorage.removeItem('cz-token') })
        .finally(() => setReady(true))
      return
    }

    // 2. Хадгалагдсан session сэргээх
    const token  = localStorage.getItem('cz-token')
    const cached = localStorage.getItem('cz-user')
    if (token && cached) {
      try {
        const u = JSON.parse(cached)
        u.initials = (u.username || '??').slice(0, 2).toUpperCase()
        setUser(u)
        connectSocket(token)
      } catch {}
      authApi.me()
        .then(({ data }) => {
          const u = data.data
          if (u?.id) { persist(u); setUser(u) }
        })
        .catch(() => {
          localStorage.removeItem('cz-token')
          localStorage.removeItem('cz-user')
          setUser(null)
          disconnectSocket()
        })
        .finally(() => setReady(true))
    } else {
      setReady(true)
    }
  }, [])

  const saveProfile = useCallback((updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem('cz-profile', JSON.stringify(next))
      return next
    })
  }, [])

  // Email-only login (passwordless)
  const login = useCallback(async (email) => {
    setLoading(true)
    try {
      const { data } = await authApi.login({ email })
      const token = data.data?.token
      const u     = data.data?.user
      if (!token || !u) return { ok: false, error: data.message || 'Нэвтрэлт амжилтгүй' }
      persist(u, token)
      setUser(u)
      connectSocket(token)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || 'Нэвтрэх амжилтгүй' }
    } finally { setLoading(false) }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cz-token')
    localStorage.removeItem('cz-user')
    setUser(null)
    disconnectSocket()
  }, [])

  const updateProfile = useCallback(async (formData) => {
    try {
      const res = await authApi.updateProfile(formData)
      const updated = res.data.data
      if (updated?.id) { persist(updated); setUser(updated) }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || 'Алдаа гарлаа' }
    }
  }, [])

  const updateAvatar = useCallback(async (file) => {
    try {
      const res = await authApi.updateAvatar(file)
      const updated = res.data.data
      if (updated?.id) { persist(updated); setUser(updated) }
      return { ok: true, avatarUrl: updated?.avatar }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || 'Алдаа гарлаа' }
    }
  }, [])

  return (
    <Ctx.Provider value={{
      user, profile, loading, ready,
      login, logout,
      saveProfile, updateProfile, updateAvatar,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
