import { useState } from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  const [page,   setPage]   = useState("home");
  const [params, setParams] = useState({});

  const nav = (p, args = {}) => {
    setPage(p); setParams(args);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = {
    home:     <HomePage nav={nav} />,
    product:  <ProductDetailPage nav={nav} productId={params.id} />,
    cart:     <CartPage nav={nav} />,
    checkout: <CheckoutPage nav={nav} />,
    login:    <LoginPage nav={nav} />,
    register: <RegisterPage nav={nav} />,
    admin:    <AdminDashboard nav={nav} />,
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar nav={nav} page={page} />
          <main style={{ flex: 1 }}>
            {pages[page] || <HomePage nav={nav} />}
          </main>
          <footer style={{
            borderTop: "1px solid var(--border)",
            background: "var(--bg2)",
            padding: "24px 32px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 20, letterSpacing: "0.1em", color: "var(--gold)",
            }}>BTBN</span>
            <span style={{
              fontFamily: "'Barlow Condensed'", fontSize: 10,
              color: "var(--muted)", letterSpacing: "0.2em", textTransform: "uppercase",
            }}>
              © 2024 BTBN — МОНГОЛ ДЭЛГҮҮР
            </span>
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
