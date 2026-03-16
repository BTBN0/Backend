// src/components/layout/Shell.jsx
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import Sidebar from './Sidebar'
import { useClock } from '../../hooks/index.js'

export default function Shell() {
  const { token, user } = useAuthStore()
  const navigate        = useNavigate()
  const time            = useClock()

  useEffect(() => {
    if (!token || !user) navigate('/login', { replace: true })
  }, [token, user])

  if (!token || !user) return null

  return (
    <div className="flex min-h-screen grid-bg">
      <Sidebar />
      <div className="ml-56 flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 border-b border-rim bg-shell/70 backdrop-blur-sm flex items-center justify-end px-6 gap-4 sticky top-0 z-30">
          <span className="text-[11px] font-mono text-ghost border border-rim px-2.5 py-1 rounded-md">
            {time.toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
