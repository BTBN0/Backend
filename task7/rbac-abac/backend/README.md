# 🔐 RBAC + ABAC Backend (Prisma + Express)

Prisma ORM, Express.js, JWT ашиглан **Role-Based** болон **Attribute-Based** хандалтын удирдлага хийсэн бэлэн backend.

---

## 📁 Бүтэц

```
rbac-backend/
├── prisma/
│   ├── schema.prisma     ← User, Role, Permission, AbacPolicy загварууд
│   └── seed.js           ← Demo өгөгдөл (admin, user, roles, permissions)
├── src/
│   ├── app.js            ← Express сервер эхлэл
│   ├── lib/
│   │   └── prisma.js     ← Prisma client singleton
│   ├── middleware/
│   │   ├── auth.js       ← JWT шалгах (authenticate)
│   │   └── authorize.js  ← RBAC + ABAC шалгах (requireRole, requirePermission, requireAbac)
│   ├── controllers/
│   │   ├── authController.js   ← login, register, me
│   │   ├── adminController.js  ← admin CRUD
│   │   └── userController.js   ← user dashboard/profile
│   └── routes/
│       └── index.js      ← Бүх route-ууд
├── .env.example
└── package.json
```

---

## 🚀 Суурилуулах (Setup)

### 1. Шаардлага
- Node.js 18+
- PostgreSQL (local эсвэл cloud: Neon, Supabase, Railway)

### 2. Татаж авч, хамаарлуудыг суулгах
```bash
git clone <repo>
cd rbac-backend
npm install
```

### 3. `.env` тохиргоо
```bash
cp .env.example .env
# .env файлыг засаж DATABASE_URL болон JWT_SECRET тохируул
```

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/rbac_db"
JWT_SECRET="your-secret-key-at-least-32-chars"
JWT_EXPIRES_IN="7d"
PORT=3000
```

### 4. Database тохируулах + seed
```bash
# Бүгдийг нэг командаар:
npm run setup

# Эсвэл алхам алхмаар:
npx prisma generate          # Prisma client үүсгэх
npx prisma db push           # DB schema үүсгэх
node prisma/seed.js          # Demo өгөгдөл оруулах
```

### 5. Сервер эхлүүлэх
```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

---

## 👥 Demo хэрэглэгчид

| И-мэйл | Нууц үг | Role | Redirect |
|--------|---------|------|----------|
| admin@example.com | Admin@1234 | admin | `/admin/dashboard` |
| user@example.com | User@1234 | user | `/user/dashboard` |

---

## 📡 API Endpoints

### 🔓 Public (токен шаардахгүй)
```
POST /api/auth/register    ← Бүртгэл
POST /api/auth/login       ← Нэвтрэх → redirectTo буцаана
```

**Login response:**
```json
{
  "token": "eyJ...",
  "redirectTo": "/admin/dashboard",   ← admin бол
  "redirectTo": "/user/dashboard",    ← user бол
  "user": { "id": "...", "roles": ["admin"] }
}
```

### 🔐 Authenticated
```
GET /api/auth/me           ← Өөрийн мэдээлэл + permissions
```

### 👑 Admin (admin role шаардлагатай)
```
GET    /api/admin/dashboard
GET    /api/admin/users
GET    /api/admin/users/:id
POST   /api/admin/users
PUT    /api/admin/users/:id
POST   /api/admin/users/:id/role    ← Role өгөх { "roleName": "manager" }
DELETE /api/admin/users/:id/role    ← Role авах
GET    /api/admin/audit-logs
GET    /api/admin/roles
GET    /api/admin/abac-policies
```

### 👤 User (хэрэглэгч өөрөө)
```
GET /api/user/dashboard
GET /api/user/profile
PUT /api/user/profile
GET /api/user/posts        ← RBAC: read:posts permission
GET /api/user/reports      ← ABAC: finance + level≥3 шаардлагатай
```

---

## 🏗️ RBAC vs ABAC тайлбар

### RBAC (Role-Based Access Control)
```
Хэрэглэгч → Role → Permission

admin  → read:users, write:users, delete:users, manage:users, ...бүгд
user   → read:users, read:posts, write:posts
manager→ read:users, write:users, read:posts, write:posts, read:reports
```

**Middleware:**
```js
// Role шалгах
router.get("/admin/...", authenticate, requireRole("admin"), ...)

// Permission шалгах
router.get("/users", authenticate, requirePermission("read", "users"), ...)
```

### ABAC (Attribute-Based Access Control)
```
Policy нөхцөл: subject + resource attributes хоёулаа тохирвол ALLOW/DENY

Policy 1: finance хэлтэс + level≥3  → reports read ALLOW  (priority: 10)
Policy 2: MN бүс                     → settings read ALLOW  (priority: 5)
Policy 3: isActive=false             → write DENY           (priority: 100)
```

**Middleware:**
```js
// ABAC + RBAC fallback хамт
router.get("/reports", authenticate, requireAbac("read", "reports"), ...)
```

---

## 🗄️ Prisma Studio
```bash
npm run db:studio
# http://localhost:5555 дээр нэвтэрч DB харна
```

---

## 🔄 Frontend redirect жишээ (React)

```js
const response = await fetch("/api/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password })
});
const { token, redirectTo } = await response.json();

localStorage.setItem("token", token);
navigate(redirectTo); // admin → /admin/dashboard, user → /user/dashboard
```

---

## 📊 Database схем

```
User ──── UserRole ──── Role ──── RolePermission ──── Permission
                                                            ↑
                                              ABAC Policy (JSON conditions)
                                                            
AuditLog ← хандалт бүрийг бүртгэнэ
```
