import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useChat } from '../../context/ChatContext'
import { useTheme } from '../../context/ThemeContext'
import { useStory } from '../../context/StoryContext'
import { Avatar } from '../ui/Avatar'
import StoryRing from '../story/StoryRing'
import { SKINS } from '../profile/UserProfile'

function ChannelItem({ ch, active, unread, status, onClick }) {
  return (
    <button onClick={onClick}
      className={`sidebar-item w-full ${active ? 'sidebar-item-active' : ''}`}>
      {ch.type === 'channel'
        ? <span className="text-sm w-4 text-center opacity-60">{ch.icon}</span>
        : <Avatar user={ch} size={20} showStatus status={status} />
      }
      <span className="flex-1 truncate text-left">{ch.name}</span>
      {unread > 0 && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-white min-w-[18px] text-center">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </button>
  )
}

export default function Sidebar({ onClose, onProfileOpen, onStoryOpen }) {
  const { user, logout, profile } = useAuth()
  const { channels, dms, activeId, setActiveId, onlineUsers } = useChat()
  const { theme, toggle } = useTheme()
  const { allStories } = useStory()
  const [search, setSearch] = useState('')

  const select = (id) => { setActiveId(id); onClose?.() }

  const filtered = search
    ? [...channels, ...dms].filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : null

  return (
    <aside className="flex flex-col h-full w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-white/15">

      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-gray-100 dark:border-white/15 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
          <svg width="13" height="15" viewBox="0 0 814 1000" fill="white" className="dark:invert">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.2c-49.5-71.8-93.7-184.7-93.7-292.9 0-161 105-246 209-246 55.6 0 101.5 37.1 135.3 37.1 32.5 0 83.2-39.2 147-39.2 23.9 0 108.2 2.2 168.3 84zM549.4 35.2c25.4-30.3 44.7-72.5 44.7-114.7 0-5.8-.6-11.7-1.9-16.3-42.3 1.6-91.4 28.3-121 59.2-23.5 25.1-46 67.2-46 110 0 6.4 1.3 12.8 1.9 14.7 2.6.6 6.4 1.3 10.3 1.3 37.4-.1 84.2-25.7 112-54.2z"/>
          </svg>
        </div>
        <span className="font-bold text-sm tracking-tight text-gray-900 dark:text-gray-100 flex-1">Czilla</span>
        <button onClick={toggle} className="btn-ghost px-2 py-1.5 text-xs">
          {theme === 'dark'
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 flex-shrink-0">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Channel list */}
      <nav className="flex-1 overflow-y-auto px-0 pb-2">
        {filtered ? (
          <div className="px-1.5 py-1">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">Results</p>
            {filtered.map(ch => (
              <ChannelItem key={ch.id} ch={ch} active={activeId === ch.id}
                unread={ch.unread || 0}
                status={onlineUsers.has(ch.id) ? 'online' : 'offline'}
                onClick={() => select(ch.id)} />
            ))}
          </div>
        ) : (
          <>
            {/* Channels */}
            <div className="pt-3 px-1.5">
              <div className="flex items-center justify-between px-3 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">Channels</span>
                <button className="text-gray-400 hover:text-accent transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
              {channels.map(ch => (
                <ChannelItem key={ch.id} ch={ch} active={activeId === ch.id}
                  unread={ch.unread || 0} onClick={() => select(ch.id)} />
              ))}
            </div>

            {/* DMs */}
            <div className="pt-4 px-1.5">
              <div className="flex items-center justify-between px-3 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">Direct Messages</span>
                <button className="text-gray-400 hover:text-accent transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
              {dms.map(dm => {
                const storyGroup = allStories.find(s => s.userId === dm.id)
                return (
                  <div key={dm.id}
                    className={`sidebar-item w-full ${activeId === dm.id ? 'sidebar-item-active' : ''}`}
                    onClick={() => select(dm.id)}>
                    <div className="relative flex-shrink-0">
                      <StoryRing
                        user={dm}
                        size={22}
                        hasStory={!!storyGroup}
                        seen={storyGroup?.seen ?? true}
                        onClick={(e) => {
                          if (storyGroup) { e.stopPropagation(); onStoryOpen?.({ userId: dm.id }) }
                        }}
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-dark-800
                        ${onlineUsers.has(dm.id) ? 'bg-green-400' : dm.status === 'away' ? 'bg-amber-400' : 'bg-gray-400'}`}/>
                    </div>
                    <span className="flex-1 truncate">{dm.name}</span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </nav>

      {/* User bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 dark:border-white/15 flex-shrink-0">
        <button onClick={onProfileOpen} className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity">
          {(() => {
            const skin = SKINS[profile?.skinIdx ?? 0] || SKINS[0]
            const initials = user?.initials || user?.name?.slice(0,2).toUpperCase() || 'YO'
            return (
              <div className="relative flex-shrink-0">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center overflow-hidden text-xs font-bold select-none"
                  style={{
                    background: skin.bg,
                    color: skin.fg,
                    border: `2px solid ${skin.fg}55`,
                    boxShadow: `0 0 0 1px ${skin.bg}`,
                  }}>
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white dark:border-[#1c1c1e]"/>
              </div>
            )
          })()}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{profile?.name || user?.name}</p>
            <p className="text-[10px] text-green-500">● Online</p>
          </div>
        </button>
        <button onClick={logout} title="Гарах"
          className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}
