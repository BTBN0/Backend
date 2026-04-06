import { useState } from 'react'
import styles from './ComposeBar.module.css'

export default function ComposeBar({ channelName, onSend }) {
  const [text, setText] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim())
      setText('')
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <div className={styles.toolbar}>
          <button className={`${styles.fmtBtn} ${styles.bold}`}>B</button>
          <button className={`${styles.fmtBtn} ${styles.italic}`}>i</button>
          <button className={`${styles.fmtBtn} ${styles.underline}`}>U</button>
          <button className={`${styles.fmtBtn} ${styles.mono}`}>{ '{ }' }</button>
          <div className={styles.divider} />
          <button className={styles.fmtBtn}>≡</button>
        </div>
        <textarea
          className={styles.input}
          placeholder={`Message #${channelName}…`}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.actBtn} title="Attach file">📎</button>
            <button className={styles.actBtn} title="Emoji">🙂</button>
            <button className={styles.actBtn} title="Mention">@</button>
            <button className={styles.actBtn} title="GIF" style={{ fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', width: 'auto', padding: '0 7px' }}>GIF</button>
          </div>
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!text.trim()}
          >
            Send ↗
          </button>
        </div>
      </div>
      <div className={styles.hint}>
        <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
      </div>
    </div>
  )
}
