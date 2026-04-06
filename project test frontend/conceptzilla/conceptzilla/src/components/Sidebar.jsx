import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import s from './Sidebar.module.css'

function Avatar({ initials, color, bg, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, fontSize: size * 0.36,
      fontWeight: 700, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, letterSpacing: '-0.5px',
    }}>{initials}</div>
  )
}

const NAV_ICONS = {
  assistant: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  drafts:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  saved:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
  inbox:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22,12 16,12 14,15 10,15 8,12 2,12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  dm:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
}

function ChannelTree({ items, depth = 0, activeId, onSelect }) {
  const [collapsed, setCollapsed] = useState({})
  return (
    <>
      {items.map(ch => (
        <div key={ch.id}>
          <div
            className={`${s.chRow} ${activeId === ch.id ? s.chActive : ''}`}
            style={{ paddingLeft: 14 + depth * 12 }}
            onClick={() => {
              if (ch.children) setCollapsed(c => ({ ...c, [ch.id]: !c[ch.id] }))
              else onSelect(ch.id)
            }}
          >
            {ch.children
              ? <span className={s.chCaret}>{collapsed[ch.id] ? '▶' : '▾'}</span>
              : <span className={s.chCaret} />
            }
            <span className={s.chRowIcon}>{ch.icon}</span>
            <span className={s.chRowLabel}>{ch.label}</span>
            {ch.count > 0 && <span className={s.chBadge}>{ch.count}</span>}
          </div>
          {ch.children && !collapsed[ch.id] && (
            <ChannelTree items={ch.children} depth={depth + 1} activeId={activeId} onSelect={onSelect} />
          )}
        </div>
      ))}
    </>
  )
}

export default function Sidebar({ navItems, favorites, channels, activeId, onSelect, theme, onToggleTheme, user }) {
  const { logout } = useAuth()
  const [search, setSearch] = useState('')
  const [favOpen, setFavOpen] = useState(true)
  const [chOpen, setChOpen] = useState(true)

  const filteredChannels = search
    ? channels.filter(c => c.label?.toLowerCase().includes(search.toLowerCase()))
    : channels

  return (
    <aside className={s.sidebar}>

      <div className={s.topBar}>
        <div className={s.brandMark}>
          <div className={s.logoBox}>
            <svg width="13" height="16" viewBox="0 0 814 1000" fill="currentColor">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.2c-49.5-71.8-93.7-184.7-93.7-292.9 0-161 105-246 209-246 55.6 0 101.5 37.1 135.3 37.1 32.5 0 83.2-39.2 147-39.2 23.9 0 108.2 2.2 168.3 84zM549.4 35.2c25.4-30.3 44.7-72.5 44.7-114.7 0-5.8-.6-11.7-1.9-16.3-42.3 1.6-91.4 28.3-121 59.2-23.5 25.1-46 67.2-46 110 0 6.4 1.3 12.8 1.9 14.7 2.6.6 6.4 1.3 10.3 1.3 37.4-.1 84.2-25.7 112-54.2z"/>
            </svg>
          </div>
          <div>
            <div className={s.brandName}>Conceptzilla</div>
            <div className={s.brandSub}>Design workspace</div>
          </div>
        </div>
        <div className={s.topActions}>
          <button className={s.topBtn} onClick={onToggleTheme} title="Toggle theme">
            {theme === 'dark'
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            }
          </button>
          <button className={s.topBtn} title="New">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={s.searchRow}>
        <div className={s.searchBox}>
          <svg className={s.searchIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className={s.searchInput}
            placeholder="Search channels…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={s.clearBtn} onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      <div className={s.quickNav}>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`${s.quickItem} ${activeId === item.id ? s.quickActive : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <span className={s.quickIcon}>{NAV_ICONS[item.id] || item.icon}</span>
            <span className={s.quickLabel}>{item.label}</span>
            {item.badge && <span className={s.newPill}>{item.badge}</span>}
            {item.count > 0 && <span className={s.numBadge}>{item.count}</span>}
          </button>
        ))}
      </div>

      <div className={s.ruleDivider} />

      <div className={s.scroll}>

        <div className={s.group}>
          <button className={s.groupHeader} onClick={() => setFavOpen(o => !o)}>
            <svg style={{ transform: favOpen ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }}
              width="10" height="10" viewBox="0 0 10 10" fill="var(--text-3)">
              <path d="M2 3l3 4 3-4z"/>
            </svg>
            <span className={s.groupLabel}>Favorites</span>
          </button>
          {favOpen && favorites.map(fav => (
            <div
              key={fav.id}
              className={`${s.chRow} ${activeId === fav.id ? s.chActive : ''}`}
              style={{ paddingLeft: 14 }}
              onClick={() => onSelect(fav.id)}
            >
              <span className={s.chCaret} />
              {fav.type === 'dm'
                ? <Avatar initials={fav.icon} color={fav.color} bg={fav.bg} size={18} />
                : <span className={s.chRowIcon}>{fav.icon}</span>
              }
              <span className={s.chRowLabel}>{fav.label}</span>
              {fav.count > 0 && <span className={s.chBadge}>{fav.count}</span>}
            </div>
          ))}
        </div>

        <div className={s.group}>
          <button className={s.groupHeader} onClick={() => setChOpen(o => !o)}>
            <svg style={{ transform: chOpen ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }}
              width="10" height="10" viewBox="0 0 10 10" fill="var(--text-3)">
              <path d="M2 3l3 4 3-4z"/>
            </svg>
            <span className={s.groupLabel}>Channels</span>
            <button className={s.groupAdd} onClick={e => e.stopPropagation()} title="Add">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </button>
          {chOpen && (
            <ChannelTree items={filteredChannels} activeId={activeId} onSelect={onSelect} />
          )}
        </div>

      </div>

      <div className={s.userBar}>
        <div className={s.userAvatarWrap}>
          <Avatar
            initials={user?.initials || 'YO'}
            color={user?.color || '#0071e3'}
            bg={user?.bg || '#e8f1fb'}
            size={32}
          />
          <span className={s.onlineDot} />
        </div>
        <div className={s.userInfo}>
          <div className={s.userName}>{user?.name || 'You'}</div>
          <div className={s.userStatus}>● Active</div>
        </div>
        <button className={s.topBtn} title="Гарах" onClick={logout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

    </aside>
  )
}
