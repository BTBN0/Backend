import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext(null)

// Apply immediately before first render flash
const getInitialTheme = () => {
  const saved = localStorage.getItem('cz-theme') || 'dark'
  document.documentElement.classList.toggle('dark', saved === 'dark')
  return saved
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('cz-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
