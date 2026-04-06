import './index.css'
import { useApi } from './hooks/useApi'
import Header      from './components/Header'
import MetricsGrid from './components/MetricsGrid'
import MemoryBars  from './components/MemoryBars'
import AlertRules  from './components/AlertRules'
import LogStream   from './components/LogStream'
import TestPanel   from './components/TestPanel'
import Card        from './components/Card'

export default function App() {
  const {
    metrics, logs, alerts,
    connected, lastFetch,
    logFilter, changeFilter,
    fetchAll, testApi,
  } = useApi()

  return (
    <>
      <Header connected={connected} lastFetch={lastFetch} onRefresh={fetchAll} />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

        <MetricsGrid metrics={metrics} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Card title="Memory breakdown">
            <MemoryBars metrics={metrics} />
          </Card>
          <Card title="Task 5 — Alert rules (6)">
            <AlertRules alerts={alerts} />
          </Card>
        </div>

        <Card title="Task 1 + 2 + 3 — Live log stream">
          <LogStream logs={logs} logFilter={logFilter} onFilterChange={changeFilter} />
        </Card>

        <Card title="Backend шалгах — API тест">
          <TestPanel onTest={testApi} />
        </Card>

        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)', paddingBottom: 24 }}>
          <code style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px' }}>
            Backend: http://localhost:3000
          </code>
          <code style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px' }}>
            Frontend: http://localhost:5173
          </code>
          {lastFetch && <span>Last fetch: {lastFetch.toLocaleTimeString()}</span>}
        </div>

      </main>
    </>
  )
}
