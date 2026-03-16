# 🏪 Монгол Shop — Mini E-Commerce Frontend

Vite + React + TailwindCSS ашиглан хийсэн mini e-commerce frontend.

## 🚀 Суулгах & Ажиллуулах

```bash
# Frontend folder руу орох
cd frontend

# Dependency суулгах
npm install

# .env файл үүсгэх
cp .env.example .env

# Development server ажиллуулах
npm run dev
```

Browser дээр: http://localhost:5173

---

## 📁 Файлын Бүтэц

```
src/
├── api/
│   └── index.js          # API calls + Mock data
├── context/
│   ├── AuthContext.jsx    # JWT auth state
│   └── CartContext.jsx    # Cart state
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── CartItem.jsx
│   └── UI.jsx             # Button, Input
└── pages/
    ├── HomePage.jsx        # Бүтээгдэхүүний жагсаалт + хайлт
    ├── ProductDetailPage.jsx
    ├── CartPage.jsx
    ├── CheckoutPage.jsx
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    └── AdminDashboard.jsx  # Бүтээгдэхүүн + захиалга удирдах
```

---

## 🔌 Backend-тэй холбох

`src/api/index.js` файлд:
- `BASE_URL` = backend-ийн URL (default: http://localhost:5000)
- Mock data-г устгаж реал API call-уудыг uncommент хийнэ

`src/context/AuthContext.jsx` файлд:
- `login()` функцийн mock хэсгийг `api.login()` call-аар солино
- `register()` функцийг мөн адил

---

## 🔐 Demo Нэвтрэх

| Имэйл | Нууц үг | Роль |
|-------|---------|------|
| admin@shop.mn | password123 | Admin |
| user@shop.mn | password123 | User |

---

## ✅ Хэрэгжүүлсэн Features

### Phase 1 ✅
- Vite + React project
- Axios-ready API layer
- Environment variables (.env)

### Phase 2 ✅
- Mock data (User, Product, Order моделиудтай нийцэж байна)

### Phase 3 ✅  
- JWT auth (login/register/logout)
- Admin middleware (role check)
- Products CRUD (Admin)
- Orders API integration ready

### Phase 4 ✅
- HomePage / Product list
- Product detail
- Cart page
- Checkout page
- Login / Register
- Admin Dashboard (Products, Orders)
- Navbar, Footer, ProductCard, CartItem, Button, Input
- Axios-ready API layer
- Context API (auth + cart state)

### Phase 5 ✅
- JWT localStorage-д хадгалах
- Protected routes (admin check)
- Search / Filter products
- Order status update (Admin)
- Skeleton loading indicator
