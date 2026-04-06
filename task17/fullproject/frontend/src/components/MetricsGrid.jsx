import styles from './MetricsGrid.module.css'

function cpuColor(v) {
  if (v == null) return 'var(--muted)'
  if (v > 80) return 'var(--error)'
  if (v > 50) return 'var(--warn)'
  return 'var(--success)'
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value} style={{ color }}>{value ?? '—'}</div>
      <div className={styles.sub}>{sub}</div>
    </div>
  )
}

export default function MetricsGrid({ metrics }) {
  const m = metrics
  return (
    <div className={styles.grid}>
      <MetricCard
        label="CPU"
        value={m ? `${m.cpu}%` : null}
        sub="Process usage"
        color={cpuColor(m?.cpu)}
      />
      <MetricCard
        label="Heap Used"
        value={m ? `${m.heapUsedMB} MB` : null}
        sub={m ? `of ${m.heapTotalMB} MB` : '—'}
        color="var(--info)"
      />
      <MetricCard
        label="RSS"
        value={m ? `${m.rssMB} MB` : null}
        sub="Total process memory"
        color="var(--warn)"
      />
      <MetricCard
        label="Uptime"
        value={m ? `${m.uptime}s` : null}
        sub="Since server start"
        color="var(--success)"
      />
    </div>
  )
}
