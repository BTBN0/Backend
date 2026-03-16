const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

router.get("/students", (req, res) =>
  studentController.getStudents(req, res)
);

router.post("/students", (req, res) =>
  studentController.createStudent(req, res)
);

router.delete("/students/:id", (req, res) =>
  studentController.deleteStudent(req, res)
);

module.exports = router;