import styles from './RightPanel.module.css'

export default function RightPanel({ members, pinnedMessages, recentFiles }) {
  const online = members.filter(m => m.status === 'online')
  const away = members.filter(m => m.status === 'away')

  return (
    <aside className={styles.panel}>
      <section className={styles.section}>
        <div className={styles.sectionTitle}>Online now</div>
        {[...online, ...away].map(m => (
          <div key={m.id} className={styles.memberRow}>
            <div className={styles.mAvatarWrap}>
              <div
                className={styles.mAvatar}
                style={{ background: m.bg, color: m.color }}
              >
                {m.initials}
              </div>
              <span
                className={styles.mStatus}
                style={{
                  background:
                    m.status === 'online' ? 'var(--color-online)' :
                    m.status === 'away' ? 'var(--color-away)' : 'transparent',
                }}
              />
            </div>
            <div>
              <div className={styles.mName}>{m.name}</div>
              <div className={styles.mStatusText}>{m.statusText}</div>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>Pinned</div>
        {pinnedMessages.map(p => (
          <div key={p.id} className={styles.pinnedItem}>
            <span className={styles.pinIcon}>📌</span>
            <div className={styles.pinText}>
              <span className={styles.pinAuthor}>{p.author}</span>
              {' — '}
              {p.isCode
                ? <><span>{p.text.split(p.code)[0]}</span><code className={styles.pinCode}>{p.code}</code></>
                : p.text
              }
            </div>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>Recent files</div>
        {recentFiles.map(f => (
          <div key={f.id} className={styles.fileRow}>
            <div className={styles.fileIcon} style={{ background: f.color }}>{f.icon}</div>
            <div>
              <div className={styles.fileName}>{f.name}</div>
              <div className={styles.fileMeta}>{f.author} · {f.when}</div>
            </div>
          </div>
        ))}
      </section>
    </aside>
  )
}
