# 🎨 RBAC Frontend — Vite + React

Vite, React 18, TailwindCSS, Zustand, React Router v6 ашиглан хийсэн бүрэн frontend.

---

## 🚀 Суурилуулах

```bash
npm install
npm run dev
# → http://localhost:5173
```

## 📁 Бүтэц

```
src/
├── main.jsx
├── App.jsx                  ← Router + Guards
├── index.css                ← Tailwind + design tokens
├── lib/
│   └── api.js               ← Axios instance (auto token)
├── stores/
│   └── authStore.js         ← Zustand (login, logout, persist)
├── hooks/
│   └── index.js             ← useApi, useClock
├── components/
│   ├── ui/index.jsx         ← Button, Input, Tag, Table, Toast...
│   └── layout/
│       ├── Shell.jsx        ← Sidebar + topbar wrapper
│       └── Sidebar.jsx      ← Navigation
└── pages/
    ├── Login.jsx
    ├── admin/
    │   ├── Dashboard.jsx
    │   ├── Users.jsx        ← CRUD + toggle active
    │   └── Roles.jsx        ← Roles, ABAC, AuditLogs
    └── user/
        └── Dashboard.jsx    ← Dashboard, Profile, Posts, Reports
```

## 🔐 Route guards

| Route             | Хандах нөхцөл        |
|-------------------|----------------------|
| `/login`          | public               |
| `/admin/*`        | token + admin role   |
| `/user/*`         | token (any role)     |
| `/`               | token → auto redirect|

## ⚡ Login → Redirect

Backend `redirectTo` утгаар шийднэ:
- `admin` → `/admin`
- `user`  → `/user`

## 🌐 Backend proxy

`vite.config.js` дээр `/api` → `http://localhost:3000` proxy тохируулсан.
Backend-ыг эхлүүлсний дараа frontend-ийг ажиллуулна.
