import { useEffect, useState } from "react";
import { getStudents } from "./api";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    const data = await getStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>
      <div style={styles.background}>
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.grid} />
      </div>

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.badge}>ACADEMIC PORTAL</div>
          </div>
          <h1 style={styles.title}>
            Student<br />
            <span style={styles.titleAccent}>Management</span>
          </h1>
          <p style={styles.subtitle}>
            {loading ? "Loading..." : `${students.length} student${students.length !== 1 ? "s" : ""} enrolled`}
          </p>
        </header>

        <main style={styles.main}>
          <StudentForm refresh={loadStudents} />
          <StudentList students={students} refresh={loadStudents} loading={loading} />
        </main>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
    background: "#0a0a0f",
    color: "#f0ede8",
  },
  background: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
  orb1: {
    position: "absolute",
    top: "-20%",
    right: "-10%",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,180,50,0.12) 0%, transparent 70%)",
  },
  orb2: {
    position: "absolute",
    bottom: "-10%",
    left: "-10%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(80,120,255,0.1) 0%, transparent 70%)",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "860px",
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  header: {
    marginBottom: "56px",
  },
  headerTop: {
    marginBottom: "20px",
  },
  badge: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "3px",
    color: "#f5b93e",
    border: "1px solid rgba(245,185,62,0.3)",
    padding: "6px 14px",
    borderRadius: "2px",
    background: "rgba(245,185,62,0.05)",
  },
  title: {
    fontSize: "clamp(48px, 8vw, 84px)",
    fontWeight: "800",
    lineHeight: "1.0",
    letterSpacing: "-2px",
    margin: "0 0 16px",
    color: "#f0ede8",
  },
  titleAccent: {
    color: "#f5b93e",
  },
  subtitle: {
    fontSize: "15px",
    color: "rgba(240,237,232,0.4)",
    margin: 0,
    letterSpacing: "0.5px",
  },
  main: {
    display: "grid",
    gap: "32px",
  },
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 32px;
    backdrop-filter: blur(10px);
  }

  .input-field {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 14px 16px;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .input-field::placeholder { color: rgba(240,237,232,0.25); }
  .input-field:focus {
    border-color: rgba(245,185,62,0.5);
    background: rgba(245,185,62,0.04);
  }

  .btn-primary {
    background: #f5b93e;
    color: #0a0a0f;
    border: none;
    border-radius: 10px;
    padding: 14px 28px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s;
  }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .btn-danger {
    background: transparent;
    color: rgba(240,237,232,0.35);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 8px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-danger:hover {
    background: rgba(255,80,80,0.1);
    border-color: rgba(255,80,80,0.3);
    color: #ff6b6b;
  }

  .student-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    animation: fadeIn 0.3s ease;
  }
  .student-row:last-child { border-bottom: none; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .stat-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(240,237,232,0.6);
  }
  .stat-chip.gpa-high { color: #6ee7b7; background: rgba(110,231,183,0.08); }
  .stat-chip.gpa-mid { color: #f5b93e; background: rgba(245,185,62,0.08); }
  .stat-chip.gpa-low { color: #ff6b6b; background: rgba(255,107,107,0.08); }

  .empty-state {
    text-align: center;
    padding: 48px 0;
    color: rgba(240,237,232,0.2);
    font-size: 14px;
  }

  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    color: rgba(240,237,232,0.25);
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    .form-grid { grid-template-columns: 1fr; }
  }
`;
