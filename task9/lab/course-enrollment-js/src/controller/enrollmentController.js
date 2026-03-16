// ============================================================
// 🎯 FINAL CHALLENGE
// POST /enrollments
// Body:    { "studentId": 1, "courseId": 2 }
// Success: { "message": "Enrollment successful" }
// Error:   { "status": 400, "code": "COURSE_FULL", ... }
// ============================================================

const express = require("express");
const router = express.Router();

module.exports = (enrollStudentUseCase) => {
  router.post("/", async (req, res, next) => {
    const { studentId, courseId } = req.body;

    await enrollStudentUseCase.enroll(studentId, courseId).catch(next);

    // catch(next) алдаа барьсан тул энд хүрвэл амжилттай
    if (!res.headersSent) {
      res.json({ message: "Enrollment successful" });
    }
  });

  return router;
};
