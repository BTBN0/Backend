import express from "express";
const app = express();
app.use(express.json());
let students = [{ id: 1, name: "Bat" }];
app.get("/students", (req, res) => {
    res.json(students);
});
app.post("/students", (req, res) => {
    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});
app.listen(4001, () => console.log("student-service 4001"));