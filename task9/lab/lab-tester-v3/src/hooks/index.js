import { useState, useCallback, useEffect } from 'react'

export function useApi() {
  const [res, setRes] = useState({})
  const request = useCallback(async (id, { method = 'GET', url, body }) => {
    setRes(p => ({ ...p, [id]: { loading: true } }))
    const t = Date.now()
    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
      const data = await r.json()
      setRes(p => ({ ...p, [id]: { loading: false, status: r.status, data, ms: Date.now() - t } }))
      return { status: r.status, data }
    } catch {
      const data = { error: 'Connection refused', hint: 'npm start хийсэн үү?' }
      setRes(p => ({ ...p, [id]: { loading: false, status: 0, data, ms: Date.now() - t } }))
      return { status: 0, data }
    }
  }, [])
  return { res, request }
}

export function useServerStatus(baseUrl) {
  const [status, setStatus] = useState('checking')
  const ping = useCallback(async () => {
    try {
      const r = await fetch(baseUrl + '/students/1', { signal: AbortSignal.timeout(2500) })
      setStatus(r.ok ? 'online' : 'error')
    } catch { setStatus('offline') }
  }, [baseUrl])
  useEffect(() => { ping(); const id = setInterval(ping, 5000); return () => clearInterval(id) }, [ping])
  return status
}
