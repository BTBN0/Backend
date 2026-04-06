import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    // Mock auth — any email/password works
    const name = email.split('@')[0]
    const initials = name.slice(0, 2).toUpperCase()
    setUser({ email, name, initials, color: '#0071e3', bg: '#e8f1fb' })
    return true
  }

  const register = (name, email, password) => {
    const initials = name.slice(0, 2).toUpperCase()
    setUser({ email, name, initials, color: '#0071e3', bg: '#e8f1fb' })
    return true
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
