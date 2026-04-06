import { useState } from 'react'
import styles from './LogStream.module.css'

const SKIP = new Set(['timestamp', 'level', 'service'])

function colorVal(v) {
  if (typeof v === 'string') return <span className={styles.str}>"{v}"</span>
  if (typeof v === 'number') return <span className={styles.num}>{v}</span>
  if (typeof v === 'object' && v !== null) return <span className={styles.obj}>{JSON.stringify(v)}</span>
  return <span>{String(v)}</span>
}

function LogBody({ entry }) {
  const pairs = Object.entries(entry).filter(([k]) => !SKIP.has(k))
  return (
    <span className={styles.body}>
      {pairs.map(([k, v], i) => (
        <span key={k}>
          <span className={styles.key}>{k}: </span>{colorVal(v)}
          {i < pairs.length - 1 ? '  ' : ''}
        </span>
      ))}
    </span>
  )
}

const FILTERS = [
  { label: 'All',   value: '' },
  { label: 'Info',  value: 'info' },
  { label: 'Warn',  value: 'warn' },
  { label: 'Error', value: 'error' },
]

export default function LogStream({ logs, logFilter, onFilterChange }) {
  return (
    <div>
      <div className={styles.controls}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`${styles.filterBtn} ${logFilter === f.value ? styles.active : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
        <span className={styles.count}>{logs.length} log</span>
      </div>

      <div className={styles.list}>
        {logs.length === 0 ? (
          <div className={styles.empty}>Log олдсонгүй — доорх тест товчлуурыг ашиглана уу</div>
        ) : (
          logs.map((l, i) => {
            const d = new Date(l.timestamp)
            const ts = d.toLocaleTimeString('mn-MN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
            const ms = String(d.getMilliseconds()).padStart(3, '0')
            return (
              <div key={i} className={styles.row}>
                <div className={styles.time}>
                  {ts}.{ms}
                  {l.requestId && <span className={styles.rid}> [{l.requestId}]</span>}
                </div>
                <span className={`${styles.level} ${styles[l.level]}`}>
                  {l.level.toUpperCase()}
                </span>
                <LogBody entry={l} />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
