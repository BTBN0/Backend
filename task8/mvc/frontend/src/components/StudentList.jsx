import { deleteStudent } from "../api";

export default function StudentList({ students, refresh, loading }) {
    const handleDelete = async (id) => {
        await deleteStudent(id);
        refresh();
    };

    const getGpaClass = (gpa) => {
        if (gpa >= 3.5) return "gpa-high";
        if (gpa >= 2.5) return "gpa-mid";
        return "gpa-low";
    };

    const getInitials = (name) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (
        <div className="card">
            <div style={styles.header}>
                <p className="section-label" style={{ margin: 0 }}>Enrolled Students</p>
                <span style={styles.count}>{students.length}</span>
            </div>

            {loading ? (
                <div className="empty-state">Loading students...</div>
            ) : students.length === 0 ? (
                <div className="empty-state">
                    <div style={styles.emptyIcon}>◎</div>
                    No students yet. Add one above.
                </div>
            ) : (
                <div>
                    {students.map((student, i) => (
                        <div className="student-row" key={student.id} style={{ animationDelay: `${i * 0.05}s` }}>
                            <div style={styles.left}>
                                <div style={styles.avatar}>
                                    {getInitials(student.name)}
                                </div>
                                <div>
                                    <p style={styles.name}>{student.name}</p>
                                    <div style={styles.chips}>
                                        <span className="stat-chip">
                                            🎂 {student.age}y
                                        </span>
                                        <span className={`stat-chip ${getGpaClass(student.gpa)}`}>
                                            ★ {student.gpa.toFixed(1)} GPA
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="btn-danger"
                                onClick={() => handleDelete(student.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "8px",
    },
    count: {
        background: "rgba(245,185,62,0.12)",
        color: "#f5b93e",
        border: "1px solid rgba(245,185,62,0.2)",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        padding: "2px 10px",
        letterSpacing: "0.5px",
    },
    left: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },
    avatar: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "rgba(245,185,62,0.1)",
        border: "1px solid rgba(245,185,62,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "700",
        color: "#f5b93e",
        flexShrink: 0,
    },
    name: {
        fontSize: "15px",
        fontWeight: "600",
        color: "#f0ede8",
        marginBottom: "6px",
    },
    chips: {
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
    },
    emptyIcon: {
        fontSize: "32px",
        marginBottom: "12px",
        opacity: 0.3,
    },
};
