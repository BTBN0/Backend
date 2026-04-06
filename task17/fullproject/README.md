# Logging Assignment — Task 1–5

## Бүтэц

```
project/
├── backend/                  ← Node.js Express API
│   ├── app.js                 Үндсэн сервер
│   ├── src/
│   │   ├── logger.js          Task 2: JSON structured log
│   │   ├── requestId.js       Task 3: Request ID middleware
│   │   ├── logMiddleware.js   Task 1: Request + Error log
│   │   ├── monitor.js         Task 4: CPU + Memory monitoring
│   │   └── alertRules.js      Task 5: Alert rules (6 дүрэм)
│   └── package.json
│
└── frontend/                 ← React + Vite Dashboard
    ├── src/
    │   ├── hooks/useApi.js    API fetch + auto-refresh
    │   ├── components/
    │   │   ├── Header.jsx     Холболтын байдал
    │   │   ├── MetricsGrid.jsx  Task 4: CPU/Memory карт
    │   │   ├── MemoryBars.jsx   Memory breakdown
    │   │   ├── AlertRules.jsx   Task 5: Alert жагсаалт
    │   │   ├── LogStream.jsx    Task 1+2+3: Live logs
    │   │   ├── TestPanel.jsx    API тест товчлуурууд
    │   │   └── Card.jsx         Wrapper
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js
    └── package.json
```

## Ажиллуулах

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:3000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Browser-т **http://localhost:5173** нээнэ.

## Task хамрах хүрээ

| Task | Файл | Дэлгэрэнгүй |
|------|------|-------------|
| Task 1 | `logMiddleware.js` | `request_received`, `request_completed`, `auth_failed`, `validation_failed`, `db_query_failed`, `unhandled_error` |
| Task 2 | `logger.js` | `{ timestamp, level, service, event, requestId, … }` JSON бүтэц |
| Task 3 | `requestId.js` | `X-Request-ID` header → `req.requestId` → бүх log |
| Task 4 | `monitor.js` | CPU%, heapUsedMB, heapTotalMB, rssMB, load — 10s тутамд |
| Task 5 | `alertRules.js` | high_cpu(>80%), critical_cpu(>95%), high_memory(>85%), critical_memory(>95%), high_rss(>512MB), high_load(>2.0) |

## API Endpoints

| Method | Path | Тайлбар |
|--------|------|---------|
| POST | `/api/login` | Login — auth/validation log |
| GET  | `/api/users` | DB error симуляци |
| GET  | `/api/metrics` | CPU + Memory snapshot |
| GET  | `/api/logs` | Log history (`?level=warn&limit=50`) |
| GET  | `/api/alerts` | Alert rules жагсаалт |
| GET  | `/health` | Health check |
