import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 10000,
})

// Attach token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('cz-token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// 401 → logout
api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cz-token')
      localStorage.removeItem('cz-user')
      window.location.reload()
    }
    return Promise.reject(err)
  }
)

export default api

// ── Auth ──
export const authApi = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me:       ()     => api.get('/auth/me'),
  logout:   ()     => api.post('/auth/logout'),
}

// ── Channels ──
export const channelApi = {
  list:    ()       => api.get('/channels'),
  create:  (data)   => api.post('/channels', data),
  join:    (id)     => api.post(`/channels/${id}/join`),
  members: (id)     => api.get(`/channels/${id}/members`),
}

// ── Messages ──
export const messageApi = {
  list:   (channelId, params) => api.get(`/channels/${channelId}/messages`, { params }),
  send:   (channelId, data)   => api.post(`/channels/${channelId}/messages`, data),
  delete: (id)                => api.delete(`/messages/${id}`),
}

// ── Files ──
export const fileApi = {
  upload: (channelId, file, onProgress) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/channels/${channelId}/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => onProgress?.(Math.round(e.loaded / e.total * 100)),
    })
  },
}

// ── Users ──
export const userApi = {
  profile:       ()     => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  updateAvatar:  (file) => {
    const form = new FormData()
    form.append('avatar', file)
    return api.post('/users/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}
