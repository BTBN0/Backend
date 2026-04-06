# Conceptzilla Chat — React + Vite

Conceptzilla хэв маягийн team chat UI. Dark/Light mode дэмжинэ.

## Эхлүүлэх

```bash
npm install
npm run dev
```

`http://localhost:5173` хаяг нээнэ.

## Онцлог

- **Dark / Light mode** — sidebar дээрх ☾/☀ товчоор солино
- **Channel tree** — nested channels collapse/expand хийнэ
- **Live messaging** — Enter дарж мессеж илгээнэ
- **Reactions** — toggle хийнэ
- **Right panel** — thread info, members, activity bars
- **CSS variables** — `src/index.css`-д бүх өнгийг тохируулна

## Бүтэц

```
src/
  components/
    Sidebar.jsx / .module.css
    ChatArea.jsx / .module.css
    RightPanel.jsx / .module.css
  data/
    mockData.js
  App.jsx / App.module.css
  index.css   ← CSS variables (light + dark)
  main.jsx
```
