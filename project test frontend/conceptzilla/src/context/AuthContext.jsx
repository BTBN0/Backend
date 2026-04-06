import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'cz-user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const saveUser = (u) => {
    setUser(u)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const login = (email, password) => {
    const name = email.split('@')[0]
    const initials = name.slice(0, 2).toUpperCase()
    saveUser({ email, name, initials, color: '#0071e3', bg: '#e8f1fb' })
    return true
  }

  const register = (name, email, password) => {
    const initials = name.slice(0, 2).toUpperCase()
    saveUser({ email, name, initials, color: '#0071e3', bg: '#e8f1fb' })
    return true
  }

  const logout = () => saveUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
