import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { messageApi, workspaceApi, channelApi, reactionApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import useWebRTC from '../hooks/useWebRTC'
import Sidebar from '../components/sidebar/Sidebar'
import ChatHeader from '../components/chat/ChatHeader'
import CallBar from '../components/chat/CallBar'
import PinnedMessage from '../components/chat/PinnedMessage'
import MessageList from '../components/chat/MessageList'
import MessageInput from '../components/chat/MessageInput'
import MemberList from '../components/chat/MemberList'
import SearchModal from '../components/ui/SearchModal'

const ChatPage = () => {
  const { workspaceId, channelId } = useParams()
  const { user } = useAuth()
  const { socket, onlineUsers } = useSocket()

  const [workspaces, setWorkspaces] = useState([])
  const [channels, setChannels] = useState([])
  const [messages, setMessages] = useState([])
  const [currentWorkspace, setCurrentWorkspace] = useState(null)
  const [currentChannel, setCurrentChannel] = useState(null)
  const [typingUsers, setTypingUsers] = useState([])
  const [showMembers, setShowMembers] = useState(false)
  const [members, setMembers] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [pinnedMessages, setPinnedMessages] = useState([])
  const isOwner = members.find(m => m.id === user?.id)?.role === 'OWNER'
  const currentChannelId = useRef(channelId)

  const { inCall, isMuted, callParticipants, joinCall, leaveCall, toggleMute } = useWebRTC(socket, channelId)

  useEffect(() => {
    workspaceApi.list().then(({ data }) => {
      const ws = data.data || []
      setWorkspaces(ws)
      setCurrentWorkspace(ws.find(w => w.id === workspaceId) || null)
      localStorage.setItem('lastWorkspaceId', workspaceId)
    })
  }, [workspaceId])

  useEffect(() => {
    if (!workspaceId) return
    channelApi.list(workspaceId).then(({ data }) => {
      const chs = data.data || []
      setChannels(chs)
      setCurrentChannel(chs.find(c => c.id === channelId) || null)
    })
  }, [workspaceId, channelId])

  useEffect(() => {
    if (!channelId) return
    currentChannelId.current = channelId
    setMessages([])
    messageApi.list(channelId).then(({ data }) => setMessages(data.data?.messages || data.data || []))
    messageApi.pinned(channelId).then(({ data }) => setPinnedMessages(data.data || []))
  }, [channelId])

  useEffect(() => {
    if (!workspaceId) return
    workspaceApi.members(workspaceId).then(({ data }) => setMembers(data.data || [])).catch(console.error)
  }, [workspaceId])

  useEffect(() => {
    if (!socket || !workspaceId || !channelId) return
    socket.emit('join_workspace', workspaceId)
    socket.emit('join_channel', channelId)

    const onMsg    = (msg) => { if (msg.channelId === currentChannelId.current) setMessages(p => [...p, msg]) }
    const onDel    = ({ messageId }) => setMessages(p => p.map(m => m.id===messageId ? {...m,deleted:true} : m))
    const onEdit   = ({ message }) => setMessages(p => p.map(m => m.id===message.id ? message : m))
    const onPin    = ({ message }) => {
      if (message.pinned) setPinnedMessages(p => [message, ...p.filter(m=>m.id!==message.id)])
      else setPinnedMessages(p => p.filter(m=>m.id!==message.id))
      setMessages(p => p.map(m => m.id===message.id ? {...m,pinned:message.pinned} : m))
    }
    const onTyping = ({ username, typing }) => {
      if (username===user?.username) return
      setTypingUsers(p => typing ? [...new Set([...p,username])] : p.filter(u=>u!==username))
    }
    const onReact  = ({ messageId, reactions }) => setMessages(p => p.map(m => m.id===messageId ? {...m,reactions} : m))

    socket.on('new_message', onMsg)
    socket.on('message_deleted', onDel)
    socket.on('message_edited', onEdit)
    socket.on('message_pinned', onPin)
    socket.on('user_typing', onTyping)
    socket.on('reaction_updated', onReact)
    return () => {
      socket.off('new_message', onMsg); socket.off('message_deleted', onDel)
      socket.off('message_edited', onEdit); socket.off('message_pinned', onPin)
      socket.off('user_typing', onTyping); socket.off('reaction_updated', onReact)
    }
  }, [socket, workspaceId, channelId])

  const handleSend = async (content, fileUrl, fileType) => {
    try {
      const { data } = await messageApi.send(channelId, { content, fileUrl, fileType })
      socket?.emit('send_message', data.data)
    } catch(err) { console.error(err) }
  }

  const handleEdit   = (updated) => setMessages(p => p.map(m => m.id===updated.id ? updated : m))
  const handleDelete = async (messageId) => {
    try {
      await messageApi.delete(messageId)
      setMessages(p => p.map(m => m.id===messageId ? {...m,deleted:true} : m))
      socket?.emit('delete_message', { messageId, channelId })
    } catch(err) { console.error(err) }
  }
  const handlePin = async (message) => {
    try {
      const { data } = await messageApi.pin(message.id)
      const updated = data.data
      if (updated.pinned) setPinnedMessages(p => [updated, ...p.filter(m=>m.id!==updated.id)])
      else setPinnedMessages(p => p.filter(m=>m.id!==updated.id))
      setMessages(p => p.map(m => m.id===updated.id ? {...m,pinned:updated.pinned} : m))
      socket?.emit('message_pinned', { message:updated, channelId })
    } catch(err) { console.error(err) }
  }
  const handleTyping = (isTyping) => {
    if (!socket||!channelId) return
    socket.emit(isTyping ? 'typing_start' : 'typing_stop', { channelId })
  }
  const handleReaction = async (messageId, emoji) => {
    try {
      await reactionApi.toggle(messageId, emoji)
      const { data } = await reactionApi.list(messageId)
      const reactions = data.data
      setMessages(p => p.map(m => m.id===messageId ? {...m,reactions} : m))
      socket?.emit('reaction_updated', { messageId, channelId, reactions })
    } catch(err) { console.error(err) }
  }

  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      <Sidebar workspaces={workspaces} channels={channels} setChannels={setChannels} currentWorkspace={currentWorkspace} />
      <div className="flex-1 flex min-w-0">
        <div className="flex-1 flex flex-col min-w-0">
          <ChatHeader channel={currentChannel} onlineCount={onlineUsers.length} onToggleMembers={()=>setShowMembers(p=>!p)} showMembers={showMembers} onSearch={()=>setShowSearch(true)} workspaceId={workspaceId} isOwner={isOwner}/>
          <CallBar inCall={inCall} isMuted={isMuted} callParticipants={callParticipants} onJoin={joinCall} onLeave={leaveCall} onToggleMute={toggleMute}/>
          <PinnedMessage messages={pinnedMessages} onUnpin={handlePin}/>
          <MessageList messages={messages} typingUsers={typingUsers} onReaction={handleReaction} onEdit={handleEdit} onDelete={handleDelete} onPin={handlePin} socket={socket} channelId={channelId}/>
          <MessageInput onSend={handleSend} onTyping={handleTyping} channelName={currentChannel?.name}/>
        </div>
        {showMembers && (
          <MemberList members={members} onClose={()=>setShowMembers(false)} workspaceId={workspaceId}
            onMemberBanned={(bannedId)=>setMembers(p=>p.filter(m=>m.id!==bannedId))}/>
        )}
      </div>
      {showSearch && <SearchModal onClose={()=>setShowSearch(false)} channelId={channelId}/>}
    </div>
  )
}
export default ChatPage
