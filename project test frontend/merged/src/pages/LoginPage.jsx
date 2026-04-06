import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setLoading(true);
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      login(res.data.data.token, res.data.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Google login амжилтгүй боллоо");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => setError("Google login амжилтгүй боллоо");

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 dark:bg-black p-4 relative">

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full
                   bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10
                   text-gray-600 dark:text-gray-300 text-xs font-medium
                   hover:border-[#a855f7] hover:text-[#a855f7] transition-all duration-200"
      >
        {theme === "dark" ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            Light
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            Dark
          </>
        )}
      </button>

      {/* Card */}
      <div
        className="w-full max-w-[860px] flex rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/8"
        style={{ animation: "fadeUp .4s cubic-bezier(0.22,1,0.36,1)" }}
      >

        {/* Left — branding */}
        <div
          className="hidden md:flex flex-col justify-between flex-1 p-12 relative overflow-hidden"
          style={{ background: "linear-gradient(145deg,#0d0d1a 0%,#0f0a1e 40%,#0a1628 100%)" }}
        >
          {/* Glow blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ position:"absolute", top:"15%", left:"20%", width:320, height:320, borderRadius:"50%",
              background:"radial-gradient(circle,rgba(168,85,247,0.18) 0%,transparent 70%)" }}/>
            <div style={{ position:"absolute", bottom:"20%", right:"10%", width:240, height:240, borderRadius:"50%",
              background:"radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)" }}/>
            <div style={{ position:"absolute", top:"50%", left:"50%", width:180, height:180, borderRadius:"50%",
              background:"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)" }}/>
          </div>

          {/* Logo + title */}
          <div className="relative z-10">
            <div
              className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#a855f7,#6366f1,#3b82f6)" }}
            >
              <svg viewBox="0 0 56 56" width="56" height="56" fill="none">
                <circle cx="28" cy="28" r="11" fill="rgba(255,255,255,0.22)"/>
                <circle cx="28" cy="28" r="5.5" fill="rgba(255,255,255,0.92)"/>
                <circle cx="28" cy="13" r="3" fill="rgba(255,255,255,0.5)"/>
                <circle cx="28" cy="43" r="3" fill="rgba(255,255,255,0.5)"/>
                <circle cx="13" cy="28" r="3" fill="rgba(255,255,255,0.5)"/>
                <circle cx="43" cy="28" r="3" fill="rgba(255,255,255,0.5)"/>
                <circle cx="17.5" cy="17.5" r="2" fill="rgba(255,255,255,0.3)"/>
                <circle cx="38.5" cy="38.5" r="2" fill="rgba(255,255,255,0.3)"/>
                <circle cx="38.5" cy="17.5" r="2" fill="rgba(255,255,255,0.3)"/>
                <circle cx="17.5" cy="38.5" r="2" fill="rgba(255,255,255,0.3)"/>
              </svg>
            </div>

            <h1
              className="font-black text-white mb-1"
              style={{ fontFamily:"'Syne',sans-serif", fontSize:"48px", letterSpacing:"0.22em", lineHeight:1 }}
            >
              AURA
            </h1>
            <p className="text-sm mb-8" style={{ color:"rgba(255,255,255,0.4)" }}>
              Таны дотоод харилцааны орон зай
            </p>
          </div>

          {/* Chat preview */}
          <div className="relative z-10">
            <div className="relative flex items-end justify-center gap-6 mb-4" style={{ height:120 }}>
              {/* User A */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background:"linear-gradient(135deg,#a855f7,#7c3aed)", color:"white" }}>A</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2"
                    style={{ borderColor:"#0d0d1a" }}/>
                </div>
                <div className="w-14 h-16 rounded-t-2xl flex items-center justify-center"
                  style={{ background:"linear-gradient(180deg,rgba(168,85,247,0.3),rgba(168,85,247,0.1))" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
              </div>

              {/* Messages */}
              <div className="flex flex-col gap-2 flex-1 max-w-[140px]">
                <div className="self-start px-3 py-1.5 rounded-2xl rounded-bl-sm text-xs"
                  style={{ background:"rgba(168,85,247,0.25)", color:"rgba(255,255,255,0.85)",
                    animation:"fadeUp .4s ease .8s both" }}>
                  Сайн байна уу! 👋
                </div>
                <div className="self-end px-3 py-1.5 rounded-2xl rounded-br-sm text-xs"
                  style={{ background:"rgba(99,102,241,0.3)", color:"rgba(255,255,255,0.85)",
                    animation:"fadeUp .4s ease 1s both" }}>
                  Сайн! Та яаж байна? 😊
                </div>
                <div className="self-start flex gap-1 pl-2" style={{ animation:"fadeUp .4s ease 1.2s both" }}>
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full"
                      style={{ background:"rgba(168,85,247,0.6)", animation:`bounce 1s ${i*0.15}s infinite` }}/>
                  ))}
                </div>
              </div>

              {/* User B */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background:"linear-gradient(135deg,#3b82f6,#6366f1)", color:"white" }}>B</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2"
                    style={{ borderColor:"#0d0d1a" }}/>
                </div>
                <div className="w-14 h-16 rounded-t-2xl flex items-center justify-center"
                  style={{ background:"linear-gradient(180deg,rgba(99,102,241,0.3),rgba(99,102,241,0.1))" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-center text-xs" style={{ color:"rgba(255,255,255,0.2)" }}>
              AuraSync — Хаана ч, хэзээ ч холбогдоорой
            </p>
          </div>
        </div>

        {/* Right — login form */}
        <div className="w-full md:w-[400px] flex-shrink-0 bg-white dark:bg-[#1c1c1e] flex items-center p-8 md:p-10">
          <div className="w-full">

            {/* macOS dots (mobile-д харагдахгүй) */}
            <div className="hidden md:flex items-center gap-1.5 mb-8">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"/>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"/>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"/>
            </div>

            <div className="mb-7">
              <h2
                className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1"
                style={{ fontFamily:"'Syne',sans-serif" }}
              >
                Тавтай морил 👋
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Google-ээр нэвтэрч workspace руугаа орно уу
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-5
                              bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40
                              text-red-600 dark:text-red-400 text-sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Google Login */}
            <div className="flex justify-center">
              {loading ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                             border-2 border-gray-200 dark:border-white/10
                             bg-gray-50 dark:bg-[#2c2c2e] text-gray-400 text-sm font-semibold"
                >
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity=".3"/>
                    <path d="M12 2a10 10 0 0110 10"/>
                  </svg>
                  Нэвтэрч байна…
                </button>
              ) : (
                <div className="w-full flex justify-center [&>div]:w-full [&>div>div]:w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    width="100%"
                    theme={theme === "dark" ? "filled_black" : "outline"}
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                  />
                </div>
              )}
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
              Нэвтэрснээр та манай{" "}
              <span className="text-[#a855f7] cursor-pointer hover:underline">Үйлчилгээний нөхцөл</span>-ийг зөвшөөрч байна
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
