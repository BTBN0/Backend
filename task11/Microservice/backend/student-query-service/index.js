import express from "express";
const app = express();
let studentsReadModel = [
    { id: 1, name: "Bat" },
    { id: 2, name: "Naraa" },
];
app.get("/students", (req, res) => {
    res.json(studentsReadModel);
});
app.listen(4003, () => console.log("student-query-service 4003"));