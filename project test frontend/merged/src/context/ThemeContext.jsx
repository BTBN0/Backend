import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const init = () => {
  const t = localStorage.getItem("aura-theme") || "dark";
  document.documentElement.classList.toggle("dark", t === "dark");
  return t;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(init);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("aura-theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
