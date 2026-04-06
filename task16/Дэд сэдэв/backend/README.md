# Security Backend — ЧЭ10

## Суулгах & ажиллуулах

```bash
npm install
node server.js
```

Сервер `http://localhost:3000` дээр ажиллана.

## Endpoints

| Method | Path | Task | Тайлбар |
|--------|------|------|---------|
| GET | /api/test | Task 1 | Rate limit шалгах (5 req/min) |
| GET | /api/info | Task 2 | Security header мэдээлэл |
| GET | /api/nginx-config | Task 3 | Nginx config текст |
| POST | /api/login | Task 4 | Brute-force хамгаалалттай login |
| GET | /api/health | Task 5 | Production health check |

## Туршилтын хэрэглэгчид (Task 4)

| Username | Password |
|----------|----------|
| alice | password123 |
| bob | securepass456 |
