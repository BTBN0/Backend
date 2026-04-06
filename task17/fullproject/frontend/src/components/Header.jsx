import styles from './Header.module.css'

export default function Header({ connected, lastFetch, onRefresh }) {
  const statusColor = connected === null ? '#8892a4' : connected ? '#4ade80' : '#f87171'
  const statusText  = connected === null ? 'Connecting…'
                    : connected ? '● Connected'
                    : '● Offline — backend ажиллаагүй'

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <span className={styles.dot} />
        Logging Dashboard
      </h1>
      <div className={styles.right}>
        <span style={{ color: statusColor, fontSize: 13 }}>{statusText}</span>
        {lastFetch && (
          <span className={styles.time}>{lastFetch.toLocaleTimeString()}</span>
        )}
        <button className={styles.btn} onClick={onRefresh}>↻ Refresh</button>
      </div>
    </header>
  )
}
