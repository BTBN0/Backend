import { useState, useEffect } from "react";
import { productApi } from "../api/index.js";
import ProductCard from "../components/ProductCard.jsx";
import { Spinner } from "../components/UI.jsx";

export default function HomePage({ nav }) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("БҮГД");
  const [error,    setError]    = useState("");

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await productApi.getAll();
      setProducts(data);
    } catch {
      setError("Backend ажиллаж байгааг шалгана уу.");
    } finally {
      setLoading(false);
    }
  };

  const cats = ["БҮГД", ...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchS = !search || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchC = category === "БҮГД" || p.category === category;
    return matchS && matchC;
  });

  return (
    <div>
      {/* HERO */}
      <div style={{
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid var(--border)",
        minHeight: 420,
        background: "var(--bg2)",
        display: "flex", alignItems: "center",
      }}>
        {/* BG text */}
        <div style={{
          position: "absolute", right: -20, top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "clamp(120px, 18vw, 260px)",
          color: "rgba(255,255,255,0.03)",
          letterSpacing: "-0.02em",
          userSelect: "none", lineHeight: 1,
          pointerEvents: "none",
        }}>
          BTBN
        </div>

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 32px", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 20,
          }}>
            <div style={{ width: 32, height: 2, background: "var(--gold)" }} />
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.3em",
              color: "var(--gold)", textTransform: "uppercase",
            }}>
              МОНГОЛ ГАР УРЛАЛ
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "clamp(64px, 10vw, 130px)",
            lineHeight: 0.9, color: "var(--text)",
            letterSpacing: "0.02em",
            marginBottom: 24,
          }}>
            МОНГОЛ<br />
            <span style={{ color: "var(--gold)" }}>БҮТЭЭГДЭХҮҮН</span>
          </h1>

          <p style={{
            color: "var(--muted)", fontSize: 15,
            fontWeight: 300, lineHeight: 1.8,
            maxWidth: 480, marginBottom: 32,
          }}>
            Монгол гарын урчуудын бүтээсэн эд зүйлс.<br />
            Өвөрмөц. Чанартай. Уламжлалт.
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <a href="#products" style={{
              background: "var(--gold)", color: "#0a0a0a",
              padding: "14px 32px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 13, letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}>
              ДЭЛГҮҮР ҮЗЭХ →
            </a>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div id="products" style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 32px" }}>

        {/* Section header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32, paddingBottom: 20,
          borderBottom: "1px solid var(--border)",
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 36, letterSpacing: "0.05em", color: "var(--text)",
          }}>
            БҮТЭЭГДЭХҮҮН
            <span style={{ color: "var(--gold)", marginLeft: 12, fontSize: 24 }}>
              {filtered.length > 0 && `(${filtered.length})`}
            </span>
          </h2>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ХАЙХ..."
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                color: "var(--text)", padding: "10px 16px 10px 36px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
                outline: "none", width: 240,
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = "var(--gold)"}
              onBlur={e  => e.target.style.borderColor = "var(--border)"}
            />
          </div>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 2, marginBottom: 36, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "8px 18px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.15em",
              textTransform: "uppercase", cursor: "crosshair",
              border: "1px solid",
              borderColor: category === c ? "var(--gold)" : "var(--border)",
              background: category === c ? "var(--gold)" : "transparent",
              color: category === c ? "#0a0a0a" : "var(--muted)",
              transition: "all 0.12s",
            }}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? <Spinner /> : error ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <p style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 28, color: "var(--red)", letterSpacing: "0.1em", marginBottom: 16,
            }}>
              ХОЛБОЛТЫН АЛДАА
            </p>
            <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: 14 }}>{error}</p>
            <button onClick={fetch} style={{
              background: "var(--gold)", color: "#0a0a0a", border: "none",
              padding: "12px 28px", fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 12, letterSpacing: "0.15em", cursor: "crosshair",
            }}>
              ДАХИН ОРОЛДОХ
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: "var(--muted)", letterSpacing: "0.1em" }}>
              ОЛДСОНГҮЙ
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 1,
            background: "var(--border)",
          }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background: "var(--bg)" }}>
                <ProductCard product={p} nav={nav} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
