import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './components/AuthPage'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import RightPanel from './components/RightPanel'
import BackgroundFX from './components/BackgroundFX'
import { navItems, favorites, channels, messages, members, threadInfo } from './data/mockData'
import s from './App.module.css'

function AppShell() {
  const { user } = useAuth()
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cz-theme') || 'dark'
  })
  const [activeId, setActiveId] = useState('uikit')
  const [mobileView, setMobileView] = useState('chat')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('cz-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const handleSelectChannel = (id) => {
    setActiveId(id)
    setMobileView('chat')
  }

  if (!user) return <><BackgroundFX theme={theme} /><AuthPage theme={theme} onToggleTheme={toggleTheme} /></>

  return (
    <div className={s.app}>
      <BackgroundFX theme={theme} />
      <div className={`${s.panel} ${mobileView === 'sidebar' ? s.mobileVisible : s.mobileHidden}`}>
        <Sidebar
          navItems={navItems}
          favorites={favorites}
          channels={channels}
          activeId={activeId}
          onSelect={handleSelectChannel}
          theme={theme}
          onToggleTheme={toggleTheme}
          user={user}
        />
      </div>

      <div className={`${s.panel} ${s.panelMain} ${mobileView === 'chat' ? s.mobileVisible : s.mobileHidden}`}>
        <ChatArea
          messages={messages}
          channel={activeId}
          onMenuOpen={() => setMobileView('sidebar')}
          onInfoOpen={() => setMobileView('panel')}
        />
      </div>

      <div className={`${s.panel} ${mobileView === 'panel' ? s.mobileVisible : s.mobileHidden}`}>
        <RightPanel threadInfo={threadInfo} members={members} />
      </div>

      <nav className={s.mobileTabBar}>
        <button className={`${s.tabItem} ${mobileView === 'sidebar' ? s.tabActive : ''}`} onClick={() => setMobileView('sidebar')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="10" rx="1"/>
          </svg>
          <span>Channels</span>
        </button>
        <button className={`${s.tabItem} ${mobileView === 'chat' ? s.tabActive : ''}`} onClick={() => setMobileView('chat')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <span>Chat</span>
        </button>
        <button className={`${s.tabItem} ${mobileView === 'panel' ? s.tabActive : ''}`} onClick={() => setMobileView('panel')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/>
          </svg>
          <span>Info</span>
        </button>
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
