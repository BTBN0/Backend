import { useState } from 'react'
import styles from './Message.module.css'

function Avatar({ initials, color, bg, size = 32 }) {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        background: bg,
        color,
        borderRadius: size > 24 ? 8 : 6,
        fontSize: size > 24 ? 12 : 9,
      }}
    >
      {initials}
    </div>
  )
}

export default function Message({ msg, showDate, prevDate }) {
  const [reactions, setReactions] = useState(msg.reactions || [])

  const toggleReaction = (emoji) => {
    setReactions(prev =>
      prev.map(r =>
        r.emoji === emoji
          ? { ...r, count: r.mine ? r.count - 1 : r.count + 1, mine: !r.mine }
          : r
      ).filter(r => r.count > 0)
    )
  }

  const renderText = (text, codeWord) => {
    if (!codeWord) return <span>{text}</span>
    const parts = text.split(codeWord)
    return (
      <>
        {parts[0]}
        <code className={styles.code}>{codeWord}</code>
        {parts[1]}
      </>
    )
  }

  return (
    <>
      {showDate && (
        <div className={styles.dateDivider}>
          <span>{msg.date}</span>
        </div>
      )}
      <div className={`${styles.msgRow} ${msg.continued ? styles.continued : ''}`}>
        <div className={styles.avatarCol}>
          {!msg.continued && (
            <Avatar
              initials={msg.author.initials}
              color={msg.author.color}
              bg={msg.author.bg}
            />
          )}
          {msg.continued && <div className={styles.avatarPlaceholder} />}
        </div>
        <div className={styles.body}>
          {!msg.continued && (
            <div className={styles.meta}>
              <span className={styles.author}>{msg.author.name}</span>
              {msg.badge && <span className={styles.badge}>{msg.badge}</span>}
              <span className={styles.time}>{msg.time}</span>
            </div>
          )}
          <p className={styles.text}>
            {renderText(msg.text, msg.codeWord)}
          </p>
          {msg.attachment && (
            <div className={styles.attachment}>
              <div className={styles.attachIcon} style={{ background: '#E6F1FB' }}>
                {msg.attachment.icon}
              </div>
              <div>
                <div className={styles.attachName}>{msg.attachment.name}</div>
                <div className={styles.attachMeta}>{msg.attachment.size}</div>
              </div>
            </div>
          )}
          {reactions.length > 0 && (
            <div className={styles.reactions}>
              {reactions.map(r => (
                <button
                  key={r.emoji}
                  className={`${styles.reaction} ${r.mine ? styles.mine : ''}`}
                  onClick={() => toggleReaction(r.emoji)}
                >
                  {r.emoji} <span>{r.count}</span>
                </button>
              ))}
              <button className={styles.addReaction}>+</button>
            </div>
          )}
          {msg.threadCount > 0 && (
            <div className={styles.thread}>
              <div className={styles.threadAvatars}>
                {msg.threadAvatars.map((a, i) => (
                  <Avatar key={i} initials={a.initials} color={a.color} bg={a.bg} size={16} />
                ))}
              </div>
              <span>{msg.threadCount} replies · Last reply {msg.threadLastTime}</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
