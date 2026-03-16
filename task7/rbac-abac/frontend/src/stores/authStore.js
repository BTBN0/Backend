// src/stores/authStore.js
import { create } from 'zustand'
import { persist }  from 'zustand/middleware'
import api           from '../lib/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token:   null,
      user:    null,
      loading: false,
      error:   null,

      // ─── Login ──────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          localStorage.setItem('token', data.token)
          set({ token: data.token, user: data.user, loading: false })
          return data.redirectTo   // '/admin/dashboard' or '/user/dashboard'
        } catch (err) {
          const msg = err.response?.data?.error || 'Нэвтрэх амжилтгүй'
          set({ error: msg, loading: false })
          throw new Error(msg)
        }
      },

      // ─── Logout ─────────────────────────────────────────────────────────
      logout: () => {
        localStorage.removeItem('token')
        set({ token: null, user: null })
      },

      // ─── Refresh me ─────────────────────────────────────────────────────
      refreshMe: async () => {
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data })
        } catch { get().logout() }
      },

      // ─── Helpers ────────────────────────────────────────────────────────
      isAdmin:   ()  => get().user?.roles?.includes('admin') ?? false,
      hasRole:   (r) => get().user?.roles?.includes(r) ?? false,
      hasPerm:   (p) => get().user?.permissions?.includes(p) ?? false,
      clearError: ()  => set({ error: null }),
    }),
    {
      name: 'rbac-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
)
