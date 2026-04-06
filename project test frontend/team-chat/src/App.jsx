import { useState, useRef, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Message from './components/Message'
import RightPanel from './components/RightPanel'
import ComposeBar from './components/ComposeBar'
import {
  workspace,
  channels,
  directMessages,
  members,
  messagesByChannel,
  pinnedMessages,
  recentFiles,
} from './data/mockData'
import styles from './App.module.css'

const ME = {
  name: 'You',
  initials: 'YO',
  color: '#854F0B',
  bg: '#FAEEDA',
}

export default function App() {
  const [activeChannel, setActiveChannel] = useState('engineering')
  const [msgMap, setMsgMap] = useState(messagesByChannel)
  const messagesEndRef = useRef(null)

  const activeCh = channels.find(c => c.id === activeChannel)
  const activeDm = directMessages.find(d => d.id === activeChannel)
  const activeLabel = activeCh ? activeCh.name : activeDm ? activeDm.name : activeChannel
  const activeDesc = activeCh ? activeCh.description : activeDm ? (activeDm.statusText || '') : ''

  const msgs = msgMap[activeChannel] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs.length, activeChannel])

  const handleSend = (text) => {
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const newMsg = {
      id: Date.now(),
      author: ME,
      time,
      date: 'Today',
      text,
    }
    setMsgMap(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }))
  }

  // Group messages by date for dividers
  let lastDate = null

  const allMembers = [...members]

  return (
    <div className={styles.app}>
      <Sidebar
        workspace={workspace}
        channels={channels}
        directMessages={directMessages}
        activeChannel={activeChannel}
        onSelect={setActiveChannel}
      />

      <div className={styles.main}>
        <header className={styles.chatHeader}>
          <div className={styles.chatTitle}>
            {activeCh && <span className={styles.hash}>#</span>}
            {activeDm && (
              <div
                style={{
                  width: 20, height: 20, borderRadius: 5,
                  background: activeDm.bg, color: activeDm.color,
                  fontSize: 9, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {activeDm.initials}
              </div>
            )}
            {activeLabel}
          </div>
          {activeDesc && <span className={styles.chatDesc}>{activeDesc}</span>}
          <div className={styles.headerActions}>
            <div className={styles.memberPips}>
              {allMembers.slice(0, 3).map(m => (
                <div
                  key={m.id}
                  className={styles.pip}
                  style={{ background: m.bg, color: m.color }}
                  title={m.name}
                >
                  {m.initials}
                </div>
              ))}
              <div className={styles.pip} style={{ background: '#f0ede8', color: '#6b6560' }}>
                +{allMembers.length - 3}
              </div>
            </div>
            <button className={styles.hdrBtn}>🔗 Integrations</button>
            <button className={styles.hdrBtn}>🔍 Search</button>
          </div>
        </header>

        <div className={styles.messages}>
          {msgs.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>#</div>
              <p>No messages yet in <strong>#{activeLabel}</strong></p>
              <p>Be the first to say something!</p>
            </div>
          )}
          {msgs.map((msg) => {
            const showDate = msg.date !== lastDate
            lastDate = msg.date
            return (
              <Message key={msg.id} msg={msg} showDate={showDate} />
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        <ComposeBar
          channelName={activeLabel}
          onSend={handleSend}
        />
      </div>

      <RightPanel
        members={allMembers}
        pinnedMessages={pinnedMessages}
        recentFiles={recentFiles}
      />
    </div>
  )
}
