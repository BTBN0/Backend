import { useState } from 'react'
import styles from './Sidebar.module.css'

export default function Sidebar({ workspace, channels, directMessages, activeChannel, onSelect }) {
  const [search, setSearch] = useState('')

  const filtered = channels.filter(c => c.name.includes(search.toLowerCase()))

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.workspaceName}>
          <span className={styles.wsDot} />
          {workspace.name}
        </div>
        <button className={styles.newBtn} title="New message">+</button>
      </div>

      <div className={styles.searchWrap}>
        <input
          className={styles.searchInput}
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <nav className={styles.nav}>
        <div className={styles.sectionLabel}>Channels</div>
        {filtered.map(ch => (
          <button
            key={ch.id}
            className={`${styles.navItem} ${activeChannel === ch.id ? styles.active : ''}`}
            onClick={() => onSelect(ch.id)}
          >
            <span className={styles.hash}>#</span>
            <span className={styles.chName}>{ch.name}</span>
            {ch.unread > 0 && <span className={styles.badge}>{ch.unread}</span>}
          </button>
        ))}
        <button className={styles.addBtn}>+ Add channel</button>

        <div className={`${styles.sectionLabel} ${styles.sectionLabelSpaced}`}>Direct messages</div>
        {directMessages.map(dm => (
          <button
            key={dm.id}
            className={`${styles.navItem} ${activeChannel === dm.id ? styles.active : ''}`}
            onClick={() => onSelect(dm.id)}
          >
            <div className={styles.dmAvatarWrap}>
              <div
                className={styles.dmAvatar}
                style={{ background: dm.bg, color: dm.color }}
              >
                {dm.initials}
              </div>
              <span
                className={styles.statusDot}
                style={{ background: dm.status === 'online' ? 'var(--color-online)' : dm.status === 'away' ? 'var(--color-away)' : 'transparent' }}
              />
            </div>
            <span className={styles.chName} style={dm.status === 'away' ? { opacity: 0.6 } : {}}>{dm.name}</span>
            {dm.unread > 0 && <span className={styles.badge}>{dm.unread}</span>}
          </button>
        ))}
      </nav>
    </aside>
  )
}
