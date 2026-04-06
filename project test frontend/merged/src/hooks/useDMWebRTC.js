import { useRef, useState, useEffect } from 'react'

const useDMWebRTC = (socket, targetUserId) => {
  const [inCall, setInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [callStatus, setCallStatus] = useState(null)
  const localStreamRef = useRef(null)
  const peerRef = useRef(null)
  const remoteSocketIdRef = useRef(null)

  const createPeer = (stream) => {
    const peer = new RTCPeerConnection({ iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}] })
    stream.getTracks().forEach(t=>peer.addTrack(t,stream))
    peer.onicecandidate = (e) => { if(e.candidate && remoteSocketIdRef.current) socket.emit('dm_call_ice_candidate',{candidate:e.candidate,toSocketId:remoteSocketIdRef.current}) }
    peer.ontrack = (e) => { const a=new Audio(); a.srcObject=e.streams[0]; a.play().catch(console.error) }
    return peer
  }

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:false})
      localStreamRef.current = stream
      const peer = createPeer(stream)
      peerRef.current = peer
      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)
      socket.emit('dm_call_offer',{offer,toUserId:targetUserId})
      setCallStatus('calling'); setInCall(true)
    } catch(err) { console.error(err); alert('Микрофоны эрх шаардлагатай.') }
  }

  const endCall = () => {
    localStreamRef.current?.getTracks().forEach(t=>t.stop())
    localStreamRef.current = null
    peerRef.current?.close(); peerRef.current = null
    remoteSocketIdRef.current = null
    socket?.emit('dm_call_end',{toUserId:targetUserId})
    setInCall(false); setIsMuted(false); setCallStatus(null)
  }

  const toggleMute = () => {
    if (!localStreamRef.current) return
    const t = localStreamRef.current.getAudioTracks()[0]
    if (t) { t.enabled=!t.enabled; setIsMuted(!t.enabled) }
  }

  useEffect(() => {
    if (!socket) return
    const onAnswer = async ({ answer, fromSocketId }) => {
      remoteSocketIdRef.current = fromSocketId
      if (peerRef.current) { await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer)); setCallStatus('active') }
    }
    const onICE    = async ({ candidate }) => { if(peerRef.current) await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate)) }
    const onEnded  = () => {
      localStreamRef.current?.getTracks().forEach(t=>t.stop())
      localStreamRef.current=null; peerRef.current?.close(); peerRef.current=null; remoteSocketIdRef.current=null
      setInCall(false); setIsMuted(false); setCallStatus(null)
    }
    socket.on('dm_call_answer', onAnswer)
    socket.on('dm_call_ice_candidate', onICE)
    socket.on('dm_call_ended', onEnded)
    return () => { socket.off('dm_call_answer',onAnswer); socket.off('dm_call_ice_candidate',onICE); socket.off('dm_call_ended',onEnded) }
  }, [socket, targetUserId])

  useEffect(() => { return () => { if (inCall) endCall() } }, [])

  return { inCall, isMuted, callStatus, startCall, endCall, toggleMute }
}

export default useDMWebRTC
