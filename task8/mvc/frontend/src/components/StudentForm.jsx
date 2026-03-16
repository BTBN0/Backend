import { useState } from "react";
import { createStudent } from "../api";

export default function StudentForm({ refresh }) {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gpa, setGpa] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !age || !gpa) return;
        setLoading(true);
        await createStudent({ name, age: Number(age), gpa: Number(gpa) });
        setName("");
        setAge("");
        setGpa("");
        setLoading(false);
        refresh();
    };

    return (
        <div className="card">
            <p className="section-label">Add New Student</p>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            className="input-field"
                            placeholder="e.g. Bat-Erdene"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Age</label>
                        <input
                            className="input-field"
                            placeholder="e.g. 20"
                            type="number"
                            min="10"
                            max="99"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>GPA</label>
                        <input
                            className="input-field"
                            placeholder="e.g. 3.8"
                            type="number"
                            step="0.1"
                            min="0"
                            max="4"
                            value={gpa}
                            onChange={(e) => setGpa(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? "Adding..." : "+ Add Student"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "0.5px",
        color: "rgba(240,237,232,0.35)",
        textTransform: "uppercase",
    },
};
