# 🎨 Nemeh Design Integration Guide

## Нэгтгэсэн файлууд (солих файлууд):

| Файл | Тайлбар |
|------|---------|
| `src/App.jsx` | ThemeProvider нэмсэн |
| `src/index.css` | Dark/light mode + шинэ animations |
| `src/context/AuthContext.jsx` | profile, saveProfile, updateProfile, updateAvatar нэмсэн |
| `src/context/ThemeContext.jsx` | **ШИНЭ** — dark/light toggle |
| `src/pages/LoginPage.jsx` | Nemeh-ийн split-panel дизайн + Google OAuth |
| `src/pages/ProfilePage.jsx` | Cover, skin, status, bio, avatar бүхий профайл |
| `src/components/ui/UserProfilePopup.jsx` | Hover popup + fade/scale animation |

## Хэрхэн ашиглах:

1. Дээрх файлуудыг таны хуучин project дотор солно уу (path яг адилхан байна)
2. `ThemeContext.jsx`-ийг `src/context/` хавтаст хуулна уу

## ThemeToggle нэмэх (sidebar эсвэл header-д):

```jsx
import { useTheme } from "../context/ThemeContext.jsx";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="p-2 rounded-lg hover:bg-surface2 transition">
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
};
```

## Hover popup-ийг message-д ашиглах:

```jsx
// MessageList.jsx эсвэл MemberList.jsx дотор
const [popup, setPopup] = useState(null);

// Хэрэглэгчийн нэр дээр click/hover хийхэд:
<span
  onClick={(e) => setPopup({ user: msg.author, position: { x: e.clientX, y: e.clientY } })}
  className="cursor-pointer hover:underline"
>
  {msg.author.username}
</span>

{popup && (
  <UserProfilePopup
    user={popup.user}
    position={popup.position}
    onClose={() => setPopup(null)}
  />
)}
```
