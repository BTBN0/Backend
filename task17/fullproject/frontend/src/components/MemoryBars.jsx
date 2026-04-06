import styles from './MemoryBars.module.css'

const BARS = [
  { key: 'heapUsedMB',  maxKey: 'heapTotalMB', label: 'Heap used',  color: '#60a5fa' },
  { key: 'heapTotalMB', maxKey: 'rssMB',        label: 'Heap total', color: '#818cf8' },
  { key: 'rssMB',       maxFixed: 512,           label: 'RSS',        color: '#fbbf24' },
  { key: 'externalMB',  maxFixed: 50,            label: 'External',   color: '#34d399' },
]

export default function MemoryBars({ metrics }) {
  if (!metrics) return <div className={styles.empty}>Loading…</div>

  return (
    <div className={styles.list}>
      {BARS.map(b => {
        const val = metrics[b.key] ?? 0
        const max = b.maxKey ? Math.max(metrics[b.maxKey] ?? 1, val) : Math.max(b.maxFixed, val)
        const pct = Math.round(Math.min(100, (val / max) * 100))
        return (
          <div key={b.key} className={styles.row}>
            <span className={styles.label}>{b.label}</span>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${pct}%`, background: b.color }} />
            </div>
            <span className={styles.val}>{val} MB</span>
          </div>
        )
      })}
    </div>
  )
}
