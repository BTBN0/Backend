import { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(localStorage.getItem("token"));
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aura-profile")) || {}; } catch { return {}; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get("/auth/me")
        .then((res) => setUser(res.data.data))
        .catch(() => { localStorage.removeItem("token"); setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Хуучин Google OAuth login (LoginPage-д хэрэглэдэг)
  const login = (tokenVal, userData) => {
    localStorage.setItem("token", tokenVal);
    setToken(tokenVal);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("aura-profile");
    setToken(null);
    setUser(null);
  };

  // Profile local preferences хадгалах (cover, bio, status, skinIdx)
  const saveProfile = useCallback((updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem("aura-profile", JSON.stringify(next));
      return next;
    });
  }, []);

  // Username etc сервер дээр шинэчлэх
  const updateProfile = useCallback(async (data) => {
    try {
      const res = await api.patch("/auth/profile", data);
      const updated = res.data.data;
      if (updated?.id) { setUser(updated); }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || "Алдаа гарлаа" };
    }
  }, []);

  // Avatar upload
  const updateAvatar = useCallback(async (file) => {
    try {
      const form = new FormData();
      form.append("avatar", file);
      const res = await api.post("/auth/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = res.data.data;
      if (updated?.id) setUser(updated);
      return { ok: true, avatarUrl: updated?.avatar };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || "Алдаа гарлаа" };
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, login, logout, loading,
      profile, saveProfile, updateProfile, updateAvatar,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
