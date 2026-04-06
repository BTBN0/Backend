import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../lib/api'
import { connectSocket, disconnectSocket } from '../lib/socket'

const Ctx = createContext(null)
const USER_KEY    = 'cz-user'
const TOKEN_KEY   = 'cz-token'
const PROFILE_KEY = 'cz-profile'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  // Persistent profile extras: bio, skin, coverId, avatarUrl
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {} } catch { return {} }
  })

  const saveProfile = useCallback((updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const persist = (u, token) => {
    setUser(u)
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u))
      if (token) localStorage.setItem(TOKEN_KEY, token)
      connectSocket(token)
    } else {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      disconnectSocket()
    }
  }

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const name     = email.split('@')[0]
      const initials = name.slice(0, 2).toUpperCase()
      const mockUser = { id: Date.now(), email, name, initials, avatar: null, role: 'member' }
      persist(mockUser, 'mock-token-' + Date.now())
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || 'Нэвтрэх амжилтгүй' }
    } finally { setLoading(false) }
  }, [])

  const register = useCallback(async (name, email, password) => {
    setLoading(true)
    try {
      const initials = name.slice(0, 2).toUpperCase()
      const mockUser = { id: Date.now(), email, name, initials, avatar: null, role: 'member' }
      persist(mockUser, 'mock-token-' + Date.now())
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || 'Бүртгэл амжилтгүй' }
    } finally { setLoading(false) }
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    persist(null)
  }, [])

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, profile, saveProfile }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
