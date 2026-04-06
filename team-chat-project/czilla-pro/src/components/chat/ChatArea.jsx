import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useChat } from '../../context/ChatContext'
import MessageBubble from './MessageBubble'
import StoryBar from '../story/StoryBar'
import StoryPanel from '../story/StoryPanel'
import StoryCreator from '../story/StoryCreator'

function TypingIndicator({ names }) {
  if (!names.length) return null
  const text = names.length === 1 ? `${names[0]} бичиж байна` : `${names.slice(0,-1).join(', ')} болон ${names.at(-1)} бичиж байна`
  return (
    <div className="flex items-center gap-2 px-5 pb-1 text-xs text-gray-400 dark:text-gray-500">
      <div className="flex gap-0.5">
        {[0,1,2].map(i => (
          <span key={i} className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
            style={{animationDelay:`${i*0.15}s`, animationDuration:'1s'}} />
        ))}
      </div>
      <span>{text}…</span>
    </div>
  )
}

function UploadBar({ progress }) {
  return (
    <div className="px-4 py-2 border-t border-gray-100 dark:border-white/15">
      <div className="flex items-center gap-3">
        <svg className="w-4 h-4 text-accent animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0110 10"/>
        </svg>
        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-150" style={{width:`${progress}%`}} />
        </div>
        <span className="text-xs text-gray-400 tabular-nums w-8 text-right">{progress}%</span>
      </div>
    </div>
  )
}

export default function ChatArea({ onMenuOpen, onAIOpen, aiOpen, onStoryOpen }) {
  const { user } = useAuth()
  const { activeChannel, activeMessages, activeTyping, sendMessage, uploadFile, startTyping, uploading, uploadProgress } = useChat()
  const [text, setText] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [addingStory, setAddingStory]     = useState(false)
  const [storyPanelOpen, setStoryPanelOpen] = useState(false)
  const endRef     = useRef(null)
  const inputRef   = useRef(null)
  const fileRef    = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages.length, activeTyping.length])

  const handleSend = useCallback(async () => {
    if (!text.trim()) return
    const t = text; setText('')
    await sendMessage(t)
    inputRef.current?.focus()
  }, [text, sendMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
    else startTyping()
  }

  const handleFile = (files) => {
    if (!files?.length) return
    uploadFile(files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files)
  }

  // Group messages by user for avatar display
  const groupedMessages = activeMessages.map((msg, i) => {
    const prev = activeMessages[i - 1]
    const showAvatar = !prev || prev.user?.id !== msg.user?.id ||
      (new Date(msg.createdAt) - new Date(prev.createdAt)) > 5 * 60 * 1000
    return { ...msg, showAvatar }
  })

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-white dark:bg-black h-full"
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-100 dark:border-white/15 flex-shrink-0 bg-white dark:bg-dark-800">
        <button onClick={onMenuOpen} className="md:hidden btn-ghost px-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">{activeChannel?.type === 'channel' ? '#' : ''}</span>
            <h2 className="font-semibold text-sm text-gray-900 dark:text-gray-100 tracking-tight">{activeChannel?.name}</h2>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">
            {activeChannel?.type === 'channel' ? 'Channel' : 'Direct message'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {/* Story button */}
          <button
            onClick={() => setStoryPanelOpen(o => !o)}
            title="Stories"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150
              ${storyPanelOpen
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:text-pink-500'}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <defs>
                <linearGradient id="storyBtnGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316"/>
                  <stop offset="50%" stopColor="#ec4899"/>
                  <stop offset="100%" stopColor="#a855f7"/>
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" stroke="url(#storyBtnGrad)" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="16" stroke="url(#storyBtnGrad)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="8" y1="12" x2="16" y2="12" stroke="url(#storyBtnGrad)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Story
          </button>

          {/* AI button */}
          <button
            onClick={onAIOpen}
            title="AI Assistant"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150
              ${aiOpen
                ? 'bg-accent text-white'
                : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-accent/10 hover:text-accent'}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
            AI
          </button>
          <button className="btn-ghost px-2 py-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </div>
      </div>

      {/* Story panel — slides down when open */}
      {storyPanelOpen && (
        <StoryPanel
          onClose={() => setStoryPanelOpen(false)}
          onStoryOpen={onStoryOpen}
          onAddStory={() => { setStoryPanelOpen(false); setAddingStory(true) }}
        />
      )}

      {/* StoryCreator modal */}
      {addingStory && <StoryCreator onClose={() => setAddingStory(false)} />}

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto py-4 relative
        ${dragOver ? 'ring-2 ring-inset ring-accent/40 bg-accent/5' : ''}`}>
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="flex flex-col items-center gap-2 text-accent">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p className="text-sm font-medium">Файлаа энд чирнэ үү</p>
            </div>
          </div>
        )}

        {groupedMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-2xl">
              {activeChannel?.icon || '💬'}
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">#{activeChannel?.name}</p>
              <p className="text-xs mt-0.5">Энэ channel-ийн эхлэл</p>
            </div>
          </div>
        )}

        <div className="space-y-0.5">
          {groupedMessages.map(msg => (
            <MessageBubble key={msg.id} msg={msg}
              isOwn={msg.user?.id === user?.id || msg.user?.id === String(user?.id)}
              showAvatar={msg.showAvatar} />
          ))}
        </div>

        <TypingIndicator names={activeTyping} />
        <div ref={endRef} />
      </div>

      {/* Upload progress */}
      {uploading && <UploadBar progress={uploadProgress} />}

      {/* Compose */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-gray-100 dark:border-white/15">
        <div className={`flex flex-col rounded-2xl border transition-all duration-150
          ${text ? 'border-accent/50 shadow-sm shadow-accent/10' : 'border-gray-200 dark:border-white/18'}
          bg-gray-50 dark:bg-dark-700`}>

          <textarea
            ref={inputRef}
            className="px-4 pt-3 pb-2 bg-transparent text-sm text-gray-900 dark:text-gray-100
                       placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none min-h-[44px] max-h-36"
            placeholder={`Message ${activeChannel?.type === 'channel' ? '#' : ''}${activeChannel?.name || ''}…`}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <div className="flex items-center gap-1 px-3 pb-2.5">
            {/* File upload */}
            <button onClick={() => fileRef.current?.click()}
              className="btn-ghost px-2 py-1.5 text-gray-400 hover:text-accent" title="Файл хавсаргах">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input ref={fileRef} type="file" className="hidden" multiple
              onChange={e => handleFile(e.target.files)} />

            {/* Emoji */}
            <button className="btn-ghost px-2 py-1.5 text-gray-400" title="Emoji">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </button>

            {/* Mention */}
            <button className="btn-ghost px-2 py-1.5 text-gray-400" title="Mention">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94"/></svg>
            </button>

            <div className="flex-1" />

            {/* Send */}
            <button onClick={handleSend} disabled={!text.trim()}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-150
                ${text.trim()
                  ? 'bg-accent text-white hover:bg-accent-hover active:scale-95'
                  : 'bg-gray-200 dark:bg-dark-600 text-gray-400 dark:text-gray-600'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send
            </button>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1.5 text-center">
          Enter — илгээх · Shift+Enter — шинэ мөр · Файл чирж оруулж болно
        </p>
      </div>
    </div>
  )
}
