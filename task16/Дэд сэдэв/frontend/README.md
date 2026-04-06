# Security Frontend — ЧЭ10

React + Vite frontend. Backend (`localhost:3000`) ажиллаж байх ёстой.

## Суулгах & ажиллуулах

```bash
npm install
npm run dev
```

`http://localhost:5173` дээр нээгдэнэ.

## Файлын бүтэц

```
src/
├── App.jsx                  # Үндсэн app, бүх task card-уудыг агуулна
├── index.css                # Global styles (cyberpunk theme)
├── main.jsx                 # React entry point
├── components/
│   ├── Task1.jsx            # Rate limiting demo
│   ├── Task2.jsx            # Security headers demo
│   ├── Task3.jsx            # Nginx config viewer
│   ├── Task4.jsx            # Brute-force login demo
│   ├── Task5.jsx            # Production health check
│   ├── TaskCard.jsx         # Collapsible card wrapper
│   ├── LogPanel.jsx         # Response log display
│   └── UI.jsx               # Shared: Btn, StatBox, Input, Chip
└── hooks/
    └── useLog.js            # Log entries state management
```
