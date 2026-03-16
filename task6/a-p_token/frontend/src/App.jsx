import React, { useState, useEffect } from "react";
import api, { setAccessToken } from "./api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080b14;
    min-height: 100vh;
    font-family: 'DM Mono', monospace;
    color: #e2e8f0;
    overflow-x: hidden;
  }

  .bg-orbs {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    animation: float 8s ease-in-out infinite;
  }
  .orb-1 { width: 500px; height: 500px; background: #6366f1; top: -100px; left: -100px; animation-delay: 0s; }
  .orb-2 { width: 400px; height: 400px; background: #06b6d4; bottom: -50px; right: -50px; animation-delay: -3s; }
  .orb-3 { width: 300px; height: 300px; background: #8b5cf6; top: 50%; left: 50%; animation-delay: -6s; }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -30px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.95); }
  }

  .app {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 0;
  }

  /* SIDEBAR */
  .sidebar {
    background: rgba(255,255,255,0.03);
    border-right: 1px solid rgba(255,255,255,0.07);
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    backdrop-filter: blur(20px);
    min-height: 100vh;
  }

  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo-dot {
    width: 8px; height: 8px;
    background: #06b6d4;
    border-radius: 50%;
    -webkit-text-fill-color: initial;
    animation: pulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .section-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 12px;
  }

  .input-group { display: flex; flex-direction: column; gap: 10px; }

  .input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 12px 16px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #e2e8f0;
    outline: none;
    transition: all 0.2s;
    width: 100%;
  }
  .input::placeholder { color: rgba(255,255,255,0.25); }
  .input:focus {
    border-color: rgba(99, 102, 241, 0.6);
    background: rgba(99, 102, 241, 0.08);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .btn-group { display: flex; flex-direction: column; gap: 8px; }

  .btn {
    padding: 11px 16px;
    border-radius: 10px;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.5px;
  }
  .btn-primary {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }
  .btn-secondary {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .btn-secondary:hover {
    background: rgba(255,255,255,0.1);
    color: white;
  }
  .btn-danger {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  .btn-danger:hover {
    background: rgba(239, 68, 68, 0.25);
  }
  .btn-cyan {
    background: rgba(6, 182, 212, 0.15);
    color: #22d3ee;
    border: 1px solid rgba(6, 182, 212, 0.2);
  }
  .btn-cyan:hover { background: rgba(6, 182, 212, 0.25); }

  .user-card {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    padding: 16px;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .user-email {
    font-size: 13px;
    color: #a5b4fc;
    margin-bottom: 6px;
    word-break: break-all;
  }
  .role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1px;
  }
  .role-admin {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  .role-user {
    background: rgba(6, 182, 212, 0.15);
    color: #22d3ee;
    border: 1px solid rgba(6, 182, 212, 0.3);
  }

  /* MAIN */
  .main {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
  }

  .main-header {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: white;
    letter-spacing: -1px;
  }
  .main-header span {
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: white;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .post-form {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 10px;
    align-items: end;
  }

  .post-list { display: flex; flex-direction: column; gap: 10px; }

  .post-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    animation: slideIn 0.3s ease;
  }
  .post-item:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.12);
  }

  .post-title {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin-bottom: 4px;
  }
  .post-content { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
  .post-author { font-size: 11px; color: rgba(99, 102, 241, 0.8); }

  .post-delete {
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid rgba(239, 68, 68, 0.2);
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .post-delete:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.02);
  }

  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: rgba(15, 20, 35, 0.95);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 14px 20px;
    font-size: 13px;
    color: #e2e8f0;
    backdrop-filter: blur(20px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    animation: toastIn 0.3s ease;
    z-index: 100;
    max-width: 320px;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .toast-success { border-left: 3px solid #22c55e; }
  .toast-error { border-left: 3px solid #ef4444; }
  .toast-info { border-left: 3px solid #6366f1; }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: rgba(255,255,255,0.2);
    font-size: 13px;
  }

  .divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 4px 0;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .stat-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
  }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .stat-label { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 4px; letter-spacing: 1px; }
`;

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const register = async () => {
    try {
      const res = await api.post("/auth/register", { email, password });
      showToast(res.data.message, "success");
    } catch (e) {
      showToast(e.response?.data?.message || "Алдаа гарлаа", "error");
    }
  };

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setAccessToken(res.data.accessToken);
      showToast("Нэвтэрлээ! ✓", "success");
      await fetchMe();
    } catch (e) {
      showToast(e.response?.data?.message || "Алдаа гарлаа", "error");
    }
  };

  const fetchMe = async () => {
    try {
      const res = await api.get("/me");
      setMe(res.data);
    } catch (e) {
      showToast(e.response?.data?.message || "Алдаа", "error");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setAccessToken(null);
      setMe(null);
      setPosts([]);
      setMetrics(null);
      showToast("Гарлаа!", "info");
    } catch (e) {
      showToast("Алдаа гарлаа", "error");
    }
  };

  const getPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (e) {
      showToast(e.response?.data?.message || "Алдаа", "error");
    }
  };

  const createPost = async () => {
    if (!title || !content) return showToast("Гарчиг, агуулга оруулна уу", "error");
    try {
      await api.post("/posts", { title, content });
      setTitle(""); setContent("");
      showToast("Post үүслээ! ✓", "success");
      getPosts();
    } catch (e) {
      showToast(e.response?.data?.message || "Алдаа", "error");
    }
  };

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      showToast("Post устгагдлаа!", "success");
      getPosts();
    } catch (e) {
      showToast(e.response?.data?.message || "Эрх хүрэлцэхгүй!", "error");
    }
  };

  const getMetrics = async () => {
    try {
      const res = await api.get("/admin/metrics");
      setMetrics(res.data.data);
      showToast("Metrics ачааллаа ✓", "success");
    } catch (e) {
      showToast(e.response?.data?.message || "403 Forbidden", "error");
    }
  };

  useEffect(() => {
    if (me) getPosts();
  }, [me]);

  return (
    <>
      <style>{styles}</style>
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-dot" />
            AuthVault
          </div>

          <div>
            <div className="section-label">Нэвтрэх</div>
            <div className="input-group">
              <input
                className="input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="btn-group">
            <button className="btn btn-primary" onClick={login}>
              <span>→</span> Нэвтрэх
            </button>
            <button className="btn btn-secondary" onClick={register}>
              + Бүртгүүлэх
            </button>
            <div className="divider" />
            <button className="btn btn-secondary" onClick={fetchMe}>
              ◉ Профайл харах
            </button>
            {me?.role === "ADMIN" && (
              <button className="btn btn-cyan" onClick={getMetrics}>
                ◈ Admin Metrics
              </button>
            )}
            <button className="btn btn-danger" onClick={logout}>
              ← Гарах
            </button>
          </div>

          {me && (
            <div className="user-card">
              <div className="user-email">{me.email}</div>
              <span className={`role-badge ${me.role === "ADMIN" ? "role-admin" : "role-user"}`}>
                {me.role === "ADMIN" ? "⚡" : "◎"} {me.role}
              </span>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="main-header">
            Post <span>Manager</span>
          </div>

          {/* Admin Metrics */}
          {metrics && (
            <div className="card">
              <div className="card-title">⚡ Admin Metrics</div>
              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-num">{metrics.totalUsers}</div>
                  <div className="stat-label">НИЙТ USER</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">{metrics.activeSessions}</div>
                  <div className="stat-label">ИДЭВХТЭЙ SESSION</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">{metrics.revokedTokens}</div>
                  <div className="stat-label">REVOKED TOKEN</div>
                </div>
              </div>
            </div>
          )}

          {/* Post үүсгэх */}
          {me && (
            <div className="card">
              <div className="card-title">✦ Шинэ Post</div>
              <div className="post-form">
                <input
                  className="input"
                  placeholder="Гарчиг"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Агуулга"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button className="btn btn-primary" onClick={createPost} style={{ whiteSpace: "nowrap" }}>
                  + Нэмэх
                </button>
              </div>
            </div>
          )}

          {/* Post жагсаалт */}
          <div className="card">
            <div className="card-title" style={{ justifyContent: "space-between" }}>
              <span>◈ Posts ({posts.length})</span>
              {me && (
                <button className="btn btn-secondary" onClick={getPosts} style={{ padding: "6px 12px", fontSize: 11 }}>
                  ↻ Refresh
                </button>
              )}
            </div>
            <div className="post-list">
              {posts.length === 0 ? (
                <div className="empty-state">
                  {me ? "Post байхгүй байна. Шинэ post нэмнэ үү!" : "Нэвтэрч орно уу"}
                </div>
              ) : (
                posts.map((post) => (
                  <div className="post-item" key={post.id}>
                    <div>
                      <div className="post-title">{post.title}</div>
                      <div className="post-content">{post.content}</div>
                      <div className="post-author">✍ {post.author?.email}</div>
                    </div>
                    {me && (
                      <button className="post-delete" onClick={() => deletePost(post.id)}>
                        ✕ Устгах
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
}
