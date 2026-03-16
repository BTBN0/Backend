import { useState, useCallback, useEffect } from 'react'
import api from '../lib/api'

/**
 * Generic data fetcher hook
 * const { data, loading, error, run } = useApi('/admin/users')
 */
export function useApi(endpoint, immediate = true) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)

  const run = useCallback(async (overrideUrl) => {
    setLoading(true)
    setError(null)
    try {
      const { data: res } = await api.get(overrideUrl ?? endpoint)
      setData(res)
      return res
    } catch (err) {
      const msg = err.response?.data?.error || err.message
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => { if (immediate) run() }, [])

  return { data, loading, error, run, setData }
}

/**
 * Live clock hook
 */
export function useClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}
