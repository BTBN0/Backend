import { useNavigate, useParams } from 'react-router-dom'
import { channelApi } from '../../lib/api'

const WorkspaceList = ({ workspaces }) => {
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  const g = ['linear-gradient(135deg,#3b82f6,#6366f1)','linear-gradient(135deg,#8b5cf6,#ec4899)','linear-gradient(135deg,#06b6d4,#3b82f6)','linear-gradient(135deg,#10b981,#06b6d4)','linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#ec4899,#f43f5e)']

  const handleClick = async (ws) => {
    try {
      const { data } = await channelApi.list(ws.id)
      const chs = data.data || []
      if (chs.length > 0) navigate(`/chat/${ws.id}/${chs[0].id}`)
    } catch(err) { console.error(err) }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, width:'100%' }}>
      {workspaces.map(ws => {
        const isActive = ws.id === workspaceId
        const grad = g[ws.name?.charCodeAt(0) % g.length] || g[0]
        return (
          <button key={ws.id} onClick={()=>handleClick(ws)} title={ws.name}
            style={{ width:36, height:36, borderRadius:isActive?12:10, border:isActive?'2px solid rgba(255,255,255,0.15)':'2px solid transparent', background:'none', padding:0, cursor:'pointer', transition:'all 0.2s', flexShrink:0, position:'relative' }}>
            {ws.avatar ? <img src={ws.avatar} alt={ws.name} style={{ width:'100%', height:'100%', borderRadius:isActive?10:8, objectFit:'cover' }}/> :
              <div style={{ width:'100%', height:'100%', borderRadius:isActive?10:8, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff' }}>{ws.name?.[0]?.toUpperCase()}</div>}
            {isActive && <div style={{ position:'absolute', left:-6, top:'50%', transform:'translateY(-50%)', width:3, height:20, background:'var(--text)', borderRadius:'0 2px 2px 0' }}/>}
          </button>
        )
      })}
    </div>
  )
}
export default WorkspaceList
