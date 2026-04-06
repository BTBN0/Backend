# Team Chat — React + Vite

Бүрэн ажиллагаатай team chat SaaS frontend тест төсөл.

## Эхлүүлэх

```bash
npm install
npm run dev
```

Браузерт `http://localhost:5173` хаяг нээнэ.

## Бүтэц

```
src/
  components/
    Sidebar.jsx         # Sidebar: channels, DMs
    Sidebar.module.css
    Message.jsx         # Мессеж бүрийн компонент (reactions, threads, attachments)
    Message.module.css
    RightPanel.jsx      # Гишүүд, pinned, файлууд
    RightPanel.module.css
    ComposeBar.jsx      # Мессеж бичих хэсэг
    ComposeBar.module.css
  data/
    mockData.js         # Бүх mock өгөгдөл
  App.jsx               # Үндсэн layout + state
  App.module.css
  index.css             # CSS variables, global reset
  main.jsx
```

## Онцлог

- **Channel switching** — sidebar-аас channel сонгоно
- **Live messaging** — Enter дарж мессеж илгээнэ, жагсаалтын төгсгөлд автоматаар scroll хийнэ
- **Reactions** — emoji дээр дарж toggle хийнэ
- **Thread preview** — thread reply тоо харагдана
- **File attachments** — attachment preview
- **Member presence** — online/away статус
- **Pinned messages** — right panel дотор

## Технологи

- React 18
- Vite 5
- CSS Modules
- DM Sans + DM Mono (Google Fonts)
