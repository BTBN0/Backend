# Cache Strategy Demo — Docker + Redis + Node.js

```
cache-demo/
├── backend/
│   ├── server.js       ← Express + Redis server
│   └── package.json
└── frontend/
    └── index.html      ← Dashboard UI
```

## Ажиллуулах

### 1. Redis (Docker)
```bash
docker run -d --name my-redis -p 6379:6379 redis
```

### 2. Backend
```bash
cd backend
npm install
node server.js
# → http://localhost:3000
```

### 3. Frontend
```bash
# frontend/index.html-г browser-т нээнэ
# VS Code Live Server эсвэл:
cd frontend && npx serve .
# → http://localhost:5000
```

## Tasks
| Task | Хийх зүйл |
|------|-----------|
| Task 1 | User дарж Cache HIT / MISS ялгах |
| Task 2 | TTL дуусахыг Activity Log-оос ажиглах |
| Task 3 | Update хийж Cache Invalidation харах |
| Task 4 | TTL slider-ээр өөрчилж олон user тест |
