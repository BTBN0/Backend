// src/components/layout/Sidebar.jsx
import { clsx } from 'clsx'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, ShieldCheck, Activity,
  FileText, BarChart3, User, LogOut, KeyRound,
  ScrollText, Layers
} from 'lucide-react'

const ADMIN_NAV = [
  { group: 'Ерөнхий' },
  { path: '/admin',             icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/users',       icon: Users,           label: 'Хэрэглэгчид' },
  { group: 'Систем' },
  { path: '/admin/roles',       icon: ShieldCheck,     label: 'Roles' },
  { path: '/admin/abac',        icon: Layers,          label: 'ABAC Policies' },
  { path: '/admin/audit',       icon: ScrollText,      label: 'Audit Logs' },
]

const USER_NAV = [
  { group: 'Миний' },
  { path: '/user',              icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/user/profile',      icon: User,            label: 'Профайл' },
  { path: '/user/posts',        icon: FileText,        label: 'Нийтлэлүүд' },
  { path: '/user/reports',      icon: BarChart3,       label: 'Тайлан' },
]

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuthStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const nav       = isAdmin() ? ADMIN_NAV : USER_NAV
  const initials  = user?.name?.[0]?.toUpperCase() ?? '?'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-shell border-r border-rim flex flex-col fixed left-0 top-0 bottom-0 z-40 animate-slide-in">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-rim flex items-center gap-3">
        <div className={clsx(
          'w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0',
          isAdmin() ? 'bg-gradient-to-br from-gold to-amber-600 text-ink' : 'bg-gradient-to-br from-iris to-violet-700 text-white'
        )}>
          {isAdmin() ? '♛' : '◈'}
        </div>
        <div>
          <div className="font-display text-snow text-sm leading-tight">AccessOS</div>
          <div className={clsx('text-[9px] tracking-[.15em] uppercase font-mono font-semibold', isAdmin() ? 'text-gold' : 'text-moss')}>
            {isAdmin() ? 'admin' : 'user'}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {nav.map((item, i) => {
          if (item.group) {
            return (
              <div key={i} className="text-[9px] tracking-[.18em] uppercase text-ghost/60 font-mono px-5 py-2 mt-2">
                {item.group}
              </div>
            )
          }
          const active = location.pathname === item.path
          const Icon   = item.icon
          return (
            <div
              key={item.path}
              className={clsx('nav-item', active && 'active')}
              onClick={() => navigate(item.path)}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </div>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-rim flex items-center gap-3">
        <div className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold flex-shrink-0',
          isAdmin() ? 'bg-gradient-to-br from-gold to-amber-600 text-ink' : 'bg-gradient-to-br from-iris to-violet-700 text-white'
        )}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-snow text-xs font-medium truncate">{user?.name}</div>
          <div className="text-ghost text-[10px] font-mono truncate">{user?.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="text-ghost hover:text-flame transition-colors p-1 rounded"
          title="Гарах"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
