import express from "express";
import axios from "axios";
const app = express();
app.use(express.json());
app.get("/students", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:4003/students");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Query service error" });
    }
});
app.post("/students", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:4001/students", req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Command service error" });
    }
});
app.get("/courses", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:4002/courses");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Course service error" });
    }
});
app.post("/courses", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:4002/courses", req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Course service error" });
    }
});
app.listen(3000, () => console.log("api-gateway 3000"));