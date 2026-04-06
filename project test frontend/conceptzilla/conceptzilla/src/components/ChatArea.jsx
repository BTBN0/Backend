import { useState, useRef, useEffect } from 'react'
import s from './ChatArea.module.css'

function Avatar({ initials, color, bg, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, fontSize: size * 0.33,
      fontWeight: 600, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>{initials}</div>
  )
}

function Mention({ text }) {
  return <span className={s.mention}>{text}</span>
}

function MessageBubble({ msg, onReact }) {
  const [hover, setHover] = useState(false)
  return (
    <div className={s.msgRow} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Avatar initials={msg.author.initials} color={msg.author.color} bg={msg.author.bg} />
      <div className={s.msgBody}>
        <div className={s.msgMeta}>
          <span className={s.msgAuthor}>{msg.author.name}</span>
          <span className={s.msgTime}>{msg.time}</span>
        </div>
        <p className={s.msgText}>
          {msg.text}
          {msg.mentions && msg.mentions.map(m => <Mention key={m} text={m} />)}
          {msg.mention && <><Mention text={msg.mention} />{msg.afterText}</>}
          {msg.afterMention && msg.afterMention}
        </p>
        {msg.link && (
          <div className={s.linkPreview}>
            <div className={s.linkIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className={s.linkInfo}>
              <div className={s.linkTitle}>{msg.link.title}</div>
              <div className={s.linkUrl}>{msg.link.url}</div>
            </div>
            <button className={s.linkBtn}>{msg.link.label}</button>
          </div>
        )}
        {msg.memberPopup && (
          <div className={s.memberPopup}>
            <div className={s.popupLabel}>Members</div>
            {msg.popupMembers.map(m => (
              <div key={m.name} className={s.popupMember}>
                <Avatar initials={m.initials} color={m.color} bg={m.bg} size={26} />
                <span className={s.popupName}>{m.name}</span>
              </div>
            ))}
          </div>
        )}
        {msg.reactions && msg.reactions.length > 0 && (
          <div className={s.reactions}>
            {msg.reactions.map(r => (
              <button
                key={r.emoji}
                className={`${s.reaction} ${r.mine ? s.mine : ''}`}
                onClick={() => onReact(msg.id, r.emoji)}
              >
                {r.emoji} <span>{r.count}</span>
              </button>
            ))}
            <button className={s.addReaction}>＋</button>
          </div>
        )}
      </div>
      {hover && (
        <div className={s.msgActions}>
          <button className={s.actBtn} title="React">☺</button>
          <button className={s.actBtn} title="Reply">↩</button>
          <button className={s.actBtn} title="More">•••</button>
        </div>
      )}
    </div>
  )
}

export default function ChatArea({ messages: initMsgs, channel, onMenuOpen, onInfoOpen }) {
  const [msgs, setMsgs] = useState(initMsgs)
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs.length])

  const handleSend = () => {
    if (!input.trim()) return
    setMsgs(prev => [...prev, {
      id: Date.now(),
      author: { name: 'You', initials: 'YO', color: '#5b4fcf', bg: '#ebe9f8' },
      time: 'just now',
      text: input.trim(),
    }])
    setInput('')
  }

  const handleReact = (msgId, emoji) => {
    setMsgs(prev => prev.map(m => {
      if (m.id !== msgId) return m
      const reactions = (m.reactions || []).map(r =>
        r.emoji === emoji ? { ...r, count: r.mine ? r.count - 1 : r.count + 1, mine: !r.mine } : r
      ).filter(r => r.count > 0)
      return { ...m, reactions }
    }))
  }

  return (
    <div className={s.area}>
      <div className={s.header}>
        <button className={`${s.hdrBtn} ${s.menuBtn}`} onClick={onMenuOpen} title="Channels">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className={s.breadcrumb}>
          <span className={s.bcPart}>Website</span>
          <span className={s.bcSep}>/</span>
          <span className={s.bcPart}>v3.0</span>
          <span className={s.bcSep}>/</span>
          <span className={s.bcActive}>Ui-kit design</span>
          <span className={s.bcIcon}>⊡</span>
        </div>
        <div className={s.headerActions}>
          <button className={s.hdrBtn}>•••</button>
          <button className={s.hdrBtn}>★</button>
          <button className={`${s.hdrBtn} ${s.infoBtn}`} onClick={onInfoOpen}>ⓘ</button>
        </div>
      </div>

      <div className={s.messages}>
        {msgs.map(msg => (
          <MessageBubble key={msg.id} msg={msg} onReact={handleReact} />
        ))}
        <div ref={endRef} />
      </div>

      <div className={s.composeWrap}>
        <div className={s.compose}>
          <div className={s.composeTop}>
            <button className={s.cBtn}>★</button>
            <button className={s.cBtn}>@</button>
            <button className={s.cBtn}>⚡</button>
            <button className={s.cBtn}>☺</button>
            <button className={s.cBtn}>⊕</button>
            <button className={s.cBtn}>🎤</button>
          </div>
          <textarea
            className={s.composeInput}
            placeholder={`Message #${channel || 'uikit'}…`}
            value={input}
            rows={2}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          />
          <div className={s.composeFoot}>
            <button className={s.discardBtn} onClick={() => setInput('')}>Discard</button>
            <button className={s.sendBtn} onClick={handleSend} disabled={!input.trim()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
