import express from "express";
const app = express();
app.use(express.json());
let courses = [{ id: 1, title: "Backend Development" }];
app.get("/courses", (req, res) => {
    res.json(courses);
});
app.post("/courses", (req, res) => {
    const newCourse = {
        id: courses.length + 1,
        title: req.body.title,
    };
    courses.push(newCourse);
    res.status(201).json(newCourse);
});
app.listen(4002, () => console.log("course-service 4002"));