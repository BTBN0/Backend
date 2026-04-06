import { useState, useEffect, useCallback } from 'react'

// Vite proxy-оор дамжуулна — шууд /api/* дуудна
const API = ''

export function useApi() {
  const [metrics, setMetrics]     = useState(null)
  const [logs, setLogs]           = useState([])
  const [alerts, setAlerts]       = useState([])
  const [connected, setConnected] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)
  const [logFilter, setLogFilter] = useState('')

  const fetchMetrics = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/metrics`)
      const d = await r.json()
      setMetrics(d)
      setConnected(true)
    } catch {
      setConnected(false)
    }
  }, [])

  const fetchLogs = useCallback(async (filter) => {
    const f = filter !== undefined ? filter : logFilter
    try {
      const q = f ? `?level=${f}&limit=80` : '?limit=80'
      const r = await fetch(`${API}/api/logs${q}`)
      const d = await r.json()
      setLogs(d)
    } catch {}
  }, [logFilter])

  const fetchAlerts = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/alerts`)
      const d = await r.json()
      setAlerts(d)
    } catch {}
  }, [])

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchMetrics(), fetchLogs(), fetchAlerts()])
    setLastFetch(new Date())
  }, [fetchMetrics, fetchLogs, fetchAlerts])

  const testApi = useCallback(async (method, path, body) => {
    const opts = { method, headers: { 'Content-Type': 'application/json' } }
    if (body && method !== 'GET') opts.body = JSON.stringify(body)
    const start = Date.now()
    const r = await fetch(API + path, opts)
    const dur = Date.now() - start
    const data = await r.json()
    const rid = r.headers.get('X-Request-ID') || '—'
    setTimeout(() => fetchLogs(), 350)
    return { status: r.status, statusText: r.statusText, dur, rid, data, method, path }
  }, [fetchLogs])

  const changeFilter = useCallback((f) => {
    setLogFilter(f)
    fetchLogs(f)
  }, [fetchLogs])

  useEffect(() => {
    fetchAll()
    const t = setInterval(fetchAll, 5000)
    return () => clearInterval(t)
  }, [fetchAll])

  return { metrics, logs, alerts, connected, lastFetch, logFilter, changeFilter, fetchAll, testApi }
}
