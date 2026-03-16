# 🛒 E-Commerce Microservices

Vite React frontend + Express/Prisma/MySQL microservices backend.

## Architecture

```
Frontend (React + Vite) :5173
        |
   API Gateway :3000
        |
  ┌─────┼──────┬──────────┐
Auth  Product Order  Payment
:3001  :3002  :3003   :3004
  |      |      |       |
AuthDB ProductDB OrderDB PaymentDB
```

## Quick Start

### 1. MySQL databases create хийх
```sql
CREATE DATABASE AuthDB;
CREATE DATABASE ProductDB;
CREATE DATABASE OrderDB;
CREATE DATABASE PaymentDB;
```

### 2. Each service .env дотор DATABASE_URL тохируулах
Default: `mysql://root:password@localhost:3306/<DBName>`

### 3. Prisma migrate
```bash
cd microservices/auth-service && npx prisma db push
cd microservices/product-service && npx prisma db push
cd microservices/order-service && npx prisma db push
cd microservices/payment-service && npx prisma db push
```

### 4. Services ажиллуулах (5 terminal)
```bash
cd microservices/api-gateway    && npm run dev
cd microservices/auth-service   && npm run dev
cd microservices/product-service && npm run dev
cd microservices/order-service  && npm run dev
cd microservices/payment-service && npm run dev
```

### 5. Frontend
```bash
cd frontend && npm install && npm run dev
```
Open http://localhost:5173

## API Routes (via Gateway :3000)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | ❌ | Register |
| POST | /api/auth/login | ❌ | Login → JWT |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/products | ❌ | List products (pagination + search) |
| POST | /api/products | ✅ | Create product |
| PUT | /api/products/:id | ✅ | Update product |
| DELETE | /api/products/:id | ✅ | Delete product |
| POST | /api/orders | ✅ | Create order |
| GET | /api/orders/user/:id | ✅ | User's orders |
| PATCH | /api/orders/:id/status | ✅ | Update status |
| POST | /api/payments | ✅ | Process payment (mock) |
| GET | /api/payments/:orderId | ✅ | Get payment |
