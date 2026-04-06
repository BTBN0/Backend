import { useState } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { StoryProvider, useStory } from './context/StoryContext'
import { useCursor } from './hooks/useCursor'
import AuthPage from './components/auth/AuthPage'
import Sidebar from './components/sidebar/Sidebar'
import ChatArea from './components/chat/ChatArea'
import AIPanel from './components/ai/AIPanel'
import NotificationToast from './components/notifications/NotificationToast'
import UserProfile from './components/profile/UserProfile'
import StoryViewer from './components/story/StoryViewer'

function CursorCanvas({ hidden }) {
  return (
    <canvas id="particle-canvas" style={{
      position:'fixed',top:0,left:0,
      width:'100vw',height:'100vh',
      pointerEvents:'none',
      zIndex: hidden ? -1 : 99999,
      display:'block',
      opacity: hidden ? 0 : 1,
      transition: 'opacity 0.15s',
    }}/>
  )
}

function AuthScreen() {
  const { theme } = useTheme()
  useCursor(theme)
  return <><AuthPage /><CursorCanvas /></>
}

function AppScreen() {
  const { theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [aiOpen,      setAiOpen]      = useState(false)
  const [storyUser,   setStoryUser]   = useState(null)

  useCursor(theme)

  return (
    <div className="flex h-dvh overflow-hidden bg-gray-50 dark:bg-black">

      <div className="hidden md:flex flex-shrink-0">
        <Sidebar
          onProfileOpen={() => setProfileOpen(true)}
          onStoryOpen={(u) => setStoryUser(u)}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 z-50">
            <Sidebar
              onClose={() => setSidebarOpen(false)}
              onProfileOpen={() => setProfileOpen(true)}
              onStoryOpen={(u) => setStoryUser(u)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 min-w-0 overflow-hidden">
        <ChatArea
          onMenuOpen={() => setSidebarOpen(true)}
          onAIOpen={() => setAiOpen(o => !o)}
          aiOpen={aiOpen}
          onStoryOpen={setStoryUser}
        />

        {/* AI Panel — smooth mount/unmount via CSS */}
        <div
          className="hidden md:flex flex-shrink-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: aiOpen ? 288 : 0, opacity: aiOpen ? 1 : 0 }}
        >
          <div className="w-72 flex-shrink-0 h-full">
            {aiOpen && <AIPanel onClose={() => setAiOpen(false)} />}
          </div>
        </div>
      </div>

      {/* Mobile AI overlay */}
      {aiOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAiOpen(false)} />
          <div
            className="absolute right-0 top-0 bottom-0 w-80 z-50"
            style={{animation:'slideInRight .28s cubic-bezier(0.22,1,0.36,1)'}}
          >
            <AIPanel onClose={() => setAiOpen(false)} />
          </div>
        </div>
      )}

      <NotificationToast />

      {profileOpen && (
        <UserProfile
          onClose={() => setProfileOpen(false)}
          onStoryOpen={(u) => { setProfileOpen(false); setStoryUser(u) }}
        />
      )}

      {storyUser && (
        <StoryViewer userId={storyUser.userId || storyUser} onClose={() => setStoryUser(null)} />
      )}

      <CursorCanvas hidden={false} />
    </div>
  )
}

function Shell() {
  const { user } = useAuth()
  return user ? <AppScreen /> : <AuthScreen />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <StoryProvider>
            <Shell />
          </StoryProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
