// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { ToastProvider } from './components/ui'
import Shell   from './components/layout/Shell'
import Login   from './pages/Login'

// Admin pages
import AdminDashboard   from './pages/admin/Dashboard'
import AdminUsers       from './pages/admin/Users'
import { Abac, AuditLogs } from './pages/admin/Roles'
import Roles            from './pages/admin/Roles'

// User pages
import UserDashboard, { UserProfile, UserPosts, UserReports } from './pages/user/Dashboard'

// ─── Guards ──────────────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

function RequireAdmin({ children }) {
  const { isAdmin } = useAuthStore()
  return isAdmin() ? children : <Navigate to="/user" replace />
}

function RootRedirect() {
  const { token, isAdmin } = useAuthStore()
  if (!token)   return <Navigate to="/login"          replace />
  return isAdmin() ? <Navigate to="/admin" replace /> : <Navigate to="/user" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/"      element={<RootRedirect />} />

        {/* Admin shell */}
        <Route path="/admin" element={<RequireAuth><RequireAdmin><Shell /></RequireAdmin></RequireAuth>}>
          <Route index          element={<AdminDashboard />} />
          <Route path="users"   element={<AdminUsers />} />
          <Route path="roles"   element={<Roles />} />
          <Route path="abac"    element={<Abac />} />
          <Route path="audit"   element={<AuditLogs />} />
        </Route>

        {/* User shell */}
        <Route path="/user" element={<RequireAuth><Shell /></RequireAuth>}>
          <Route index           element={<UserDashboard />} />
          <Route path="profile"  element={<UserProfile />} />
          <Route path="posts"    element={<UserPosts />} />
          <Route path="reports"  element={<UserReports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
