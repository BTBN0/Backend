# Czilla Pro — Team Chat Frontend

React + Vite + Tailwind CSS + Socket.IO + Axios

## Эхлүүлэх

```bash
npm install
npm run dev
```

`http://localhost:5173` нээнэ.

## Орчны тохиргоо (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Бүтэц

```
src/
  components/
    auth/         AuthPage.jsx          — Login / Register
    chat/         ChatArea.jsx          — Мессеж жагсаалт + compose
                  MessageBubble.jsx     — Message компонент
    sidebar/      Sidebar.jsx           — Channel list, DMs, search
    notifications/NotificationToast.jsx — Real-time notification
    profile/      UserProfile.jsx       — Profile edit, avatar
    ui/           Avatar.jsx            — Avatar компонент
  context/
    AuthContext.jsx   — Login/register/logout + localStorage persist
    ChatContext.jsx   — Channels, messages, socket events
    ThemeContext.jsx  — Dark/light + localStorage persist
  hooks/
    useCursor.js     — Custom cursor trail canvas
    useSocket.js     — Socket event helper
  lib/
    api.js           — Axios instance + всех API endpoint
    socket.js        — Socket.IO client + event constants
```

## Backend холболт

### REST API (Axios)
```js
import { authApi, messageApi, channelApi, fileApi } from './lib/api'
// authApi.login({ email, password })
// messageApi.list(channelId)
// fileApi.upload(channelId, file, onProgress)
```

### Socket.IO
```js
import { connectSocket, EVENTS } from './lib/socket'
connectSocket(token)
socket.emit(EVENTS.SEND_MESSAGE, { channelId, text })
socket.on(EVENTS.NEW_MESSAGE, handler)
```

### Mock → Real солих
`AuthContext.jsx` болон `ChatContext.jsx`-д mock comment-ийг тайлж real API дуудах хэсгийг идэвхжүүлнэ.

## Технологи

| Stack | Version |
|---|---|
| React | 18 |
| Vite | 5 |
| Tailwind CSS | 3 |
| Socket.IO Client | 4 |
| Axios | 1 |
