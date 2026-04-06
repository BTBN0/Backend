import styles from './AlertRules.module.css'

const THRESHOLDS = {
  high_cpu:        'CPU > 80%',
  critical_cpu:    'CPU > 95%',
  high_memory:     'Heap > 85%',
  critical_memory: 'Heap > 95%',
  high_rss:        'RSS > 512 MB',
  high_load:       'Load > CPU×2',
}

export default function AlertRules({ alerts }) {
  if (!alerts.length) return <div className={styles.empty}>Loading…</div>

  return (
    <div className={styles.list}>
      {alerts.map(rule => (
        <div key={rule.name} className={styles.rule}>
          <span className={`${styles.badge} ${styles[rule.level]}`}>
            {rule.level.toUpperCase()}
          </span>
          <span className={styles.name}>{rule.name}</span>
          <span className={styles.threshold}>{THRESHOLDS[rule.name] ?? ''}</span>
          <span className={styles.cooldown}>cooldown {rule.cooldownMs / 60000}min</span>
        </div>
      ))}
    </div>
  )
}
