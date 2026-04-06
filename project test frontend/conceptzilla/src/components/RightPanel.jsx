import s from './RightPanel.module.css'

function Avatar({ initials, color, bg, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, fontSize: size * 0.33,
      fontWeight: 600, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>{initials}</div>
  )
}

const TAG_STYLES = {
  design: { background: 'var(--tag-design)', color: 'var(--tag-design-t)' },
  mgmt:   { background: 'var(--tag-mgmt)',   color: 'var(--tag-mgmt-t)' },
  dev:    { background: 'var(--tag-dev)',     color: 'var(--tag-dev-t)' },
}

export default function RightPanel({ threadInfo, members }) {
  const tabs = ['Info', 'Pins', 'Files', 'Links']
  return (
    <aside className={s.panel}>
      <div className={s.tabs}>
        {tabs.map((t, i) => (
          <button key={t} className={`${s.tab} ${i === 0 ? s.activeTab : ''}`}>{t}</button>
        ))}
      </div>

      <div className={s.body}>
        <section className={s.section}>
          <div className={s.sectionTitle}>Main info</div>
          <div className={s.infoRow}>
            <span className={s.infoIcon}>👤</span>
            <span className={s.infoLabel}>Creator</span>
            <span className={s.infoVal}>{threadInfo.creator}</span>
          </div>
          <div className={s.infoRow}>
            <span className={s.infoIcon}>📅</span>
            <span className={s.infoLabel}>Date of creation</span>
            <span className={s.infoVal}>{threadInfo.createdDate}</span>
          </div>
          <div className={s.infoRow}>
            <span className={s.infoIcon}>✦</span>
            <span className={s.infoLabel}>Status</span>
            <span className={s.statusBadge}>● {threadInfo.status}</span>
          </div>
          <div className={s.infoRow}>
            <span className={s.infoIcon}>🏷</span>
            <span className={s.infoLabel}>Tags</span>
            <span className={s.infoLink}>{threadInfo.tags} ›</span>
          </div>
          <div className={s.infoRow}>
            <span className={s.infoIcon}>⏱</span>
            <span className={s.infoLabel}>Tasks</span>
            <span className={s.infoLink}>{threadInfo.tasks} ›</span>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.sectionTitle}>Linked threads</div>
          {threadInfo.linkedThreads.map((t, i) => (
            <div key={i} className={s.threadLink}>
              <span className={s.threadHash}>#</span>
              <span className={s.threadName}>{t.label}</span>
              {t.count && <span className={s.threadCount}>{t.count}</span>}
            </div>
          ))}
        </section>

        <section className={s.section}>
          <div className={s.activityTitle}>Thread activity</div>
          <div className={s.activityBars}>
            {Array.from({ length: 28 }, (_, i) => (
              <div
                key={i}
                className={s.bar}
                style={{
                  height: `${Math.floor(Math.random() * 80) + 20}%`,
                  background: i > 20 ? 'var(--accent)' : 'var(--bg-hover)',
                }}
              />
            ))}
          </div>
        </section>

        <section className={s.section}>
          <div className={s.membersHeader}>
            <span className={s.sectionTitle}>Members</span>
            <span className={s.memberCount}>{members.length}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              <button className={s.mBtn}>+</button>
              <button className={s.mBtn}>⇄</button>
              <button className={s.mBtn}>↕</button>
            </div>
          </div>
          <div className={s.memberList}>
            {members.map(m => (
              <div key={m.id} className={s.memberRow}>
                <div className={s.mAvatarWrap}>
                  <Avatar initials={m.initials} color={m.color} bg={m.bg} size={34} />
                  <span className={s.mStatus} style={{
                    background: m.status === 'online' ? '#22c55e' : '#94a3b8'
                  }} />
                </div>
                <div className={s.mInfo}>
                  <div className={s.mName}>{m.name}</div>
                  <div className={s.mRole}>{m.role}</div>
                </div>
                <span className={s.mTag} style={TAG_STYLES[m.tagStyle]}>{m.tag}</span>
              </div>
            ))}
          </div>
          <div className={s.offlineLabel}>Offline</div>
        </section>
      </div>
    </aside>
  )
}
