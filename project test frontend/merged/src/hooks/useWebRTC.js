import { useRef, useState, useEffect } from 'react'
import { EV } from '../lib/socket'

const useWebRTC = (socket, channelId) => {
  const [inCall, setInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [callParticipants, setCallParticipants] = useState([])
  const localStreamRef = useRef(null)
  const peersRef = useRef({})

  const createPeer = (toSocketId, stream) => {
    const peer = new RTCPeerConnection({ iceServers: [{ urls:'stun:stun.l.google.com:19302' },{ urls:'stun:stun1.l.google.com:19302' }] })
    stream.getTracks().forEach(t => peer.addTrack(t, stream))
    peer.onicecandidate = (e) => { if (e.candidate) socket.emit('call_ice_candidate', { candidate:e.candidate, toSocketId }) }
    peer.ontrack = (e) => { const a=new Audio(); a.srcObject=e.streams[0]; a.play().catch(console.error) }
    return peer
  }

  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true, video:false })
      localStreamRef.current = stream
      setInCall(true)
      socket.emit('call_join', { channelId })
    } catch (err) { console.error(err); alert('Микрофоны эрх шаардлагатай.') }
  }

  const leaveCall = () => {
    localStreamRef.current?.getTracks().forEach(t=>t.stop())
    localStreamRef.current = null
    Object.values(peersRef.current).forEach(p=>p.close())
    peersRef.current = {}
    setInCall(false); setIsMuted(false); setCallParticipants([])
    socket.emit('call_leave', { channelId })
  }

  const toggleMute = () => {
    if (!localStreamRef.current) return
    const t = localStreamRef.current.getAudioTracks()[0]
    if (t) { t.enabled = !t.enabled; setIsMuted(!t.enabled) }
  }

  useEffect(() => {
    if (!socket) return
    const onJoined = async ({ userId, username, socketId }) => {
      setCallParticipants(p => [...p, { userId, username, socketId }])
      if (!localStreamRef.current) return
      const peer = createPeer(socketId, localStreamRef.current)
      peersRef.current[socketId] = peer
      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)
      socket.emit('call_offer', { offer, toSocketId: socketId })
    }
    const onOffer = async ({ offer, fromSocketId, username, userId }) => {
      setCallParticipants(p => p.find(x=>x.socketId===fromSocketId) ? p : [...p,{userId,username,socketId:fromSocketId}])
      if (!localStreamRef.current) return
      const peer = createPeer(fromSocketId, localStreamRef.current)
      peersRef.current[fromSocketId] = peer
      await peer.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peer.createAnswer()
      await peer.setLocalDescription(answer)
      socket.emit('call_answer', { answer, toSocketId: fromSocketId })
    }
    const onAnswer = async ({ answer, fromSocketId }) => { const p=peersRef.current[fromSocketId]; if(p) await p.setRemoteDescription(new RTCSessionDescription(answer)) }
    const onICE    = async ({ candidate, fromSocketId }) => { const p=peersRef.current[fromSocketId]; if(p) await p.addIceCandidate(new RTCIceCandidate(candidate)) }
    const onLeft   = ({ userId }) => { setCallParticipants(p=>p.filter(x=>x.userId!==userId)) }

    socket.on('call_user_joined', onJoined)
    socket.on('call_offer', onOffer)
    socket.on('call_answer', onAnswer)
    socket.on('call_ice_candidate', onICE)
    socket.on('call_user_left', onLeft)
    return () => {
      socket.off('call_user_joined', onJoined)
      socket.off('call_offer', onOffer)
      socket.off('call_answer', onAnswer)
      socket.off('call_ice_candidate', onICE)
      socket.off('call_user_left', onLeft)
    }
  }, [socket, channelId])

  useEffect(() => { return () => { if (inCall) leaveCall() } }, [])

  return { inCall, isMuted, callParticipants, joinCall, leaveCall, toggleMute }
}

export default useWebRTC
