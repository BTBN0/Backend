# JWT Auth Project (Access Token + Refresh Token + RBAC)

## Суулгах заавар

```bash
# 1. Package суулгах
npm install

# 2. .env файл тохируулах (аль хэдийн үүссэн байгаа)

# 3. DB migrate хийх
npx prisma migrate dev --name init

# 4. Prisma client үүсгэх
npx prisma generate

# 5. Сервер ажиллуулах
npm run dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| POST | `/auth/register` | Бүртгэл |
| POST | `/auth/login` | Нэвтрэх → accessToken + cookie |
| POST | `/auth/refresh` | Шинэ access token авах |
| POST | `/auth/logout` | Гарах, cookie цэвэрлэх |

### Protected
| Method | Endpoint | Шаардлага |
|--------|----------|-----------|
| GET | `/me` | Bearer token |
| GET | `/admin/metrics` | Bearer token + ADMIN role |

---

## Postman тест сценари

### A) Register → Login
```
POST /auth/register
{ "email": "user@test.com", "password": "password123" }

POST /auth/login
{ "email": "user@test.com", "password": "password123" }
→ accessToken авна, cookie-д refreshToken суусан
```

### B) Protected endpoint
```
GET /me
Header: Authorization: Bearer <accessToken>
→ 200 OK: { id, email, role }
```

### C) Token refresh
```
# Access token буруу болгоод
GET /me → 401 Unauthorized

POST /auth/refresh  (cookie автоматаар илгээгдэнэ)
→ 200: { accessToken: "шинэ token" }

GET /me (шинэ token-оор) → 200 OK
```

### D) Admin test
```
# ADMIN хэрэглэгч үүсгэх (Prisma studio эсвэл DB-д role шинэчлэх)
GET /admin/metrics
Authorization: Bearer <adminAccessToken>
→ 200: { totalUsers, activeSessions, revokedTokens }

# USER-ээр орвол
→ 403 Forbidden
```

### E) Logout
```
POST /auth/logout
→ cookie цэвэрлэгдэнэ, DB дээр revoked=true

POST /auth/refresh
→ 401 Unauthorized (token хүчингүй)
```

---

## Admin хэрэглэгч үүсгэх

```bash
npx prisma studio
```
Browser дээр нээгдэнэ → User table → role-г "ADMIN" болгох

---

## Security онцлогууд
- ✅ Access Token: 15 минут
- ✅ Refresh Token: 7 өдөр, HttpOnly Cookie
- ✅ Token Rotation: refresh хийх бүрт шинэ refresh token
- ✅ DB revoke: logout болон rotation-д revoked=true
- ✅ RBAC: authenticate + authorize middleware
