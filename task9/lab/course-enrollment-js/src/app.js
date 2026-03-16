// ============================================================
// app.js — Dependency Injection (бүгдийг холбоно)
// ============================================================

const express = require("express");

// Infrastructure (LAB 4)
const {
  InMemoryStudentRepository,
  InMemoryCourseRepository,
  InMemoryEnrollmentRepository,
} = require("./infrastructure/inMemoryRepositories");

// Notification (LAB 3)
const { NotificationService, EmailSender, SmsSender, PushSender } =
  require("./notification/notification");

// UseCases (LAB 5)
const GetStudentUseCase    = require("./usecase/GetStudentUseCase");
const EnrollStudentUseCase = require("./usecase/EnrollStudentUseCase");

// Controllers (LAB 1 + 5)
const studentController    = require("./controller/studentController");
const enrollmentController = require("./controller/enrollmentController");

// Global Error Handler (LAB 1)
const globalErrorHandler = require("./middleware/globalErrorHandler");

// ---- Dependency Injection ----
const studentRepo    = new InMemoryStudentRepository();
const courseRepo     = new InMemoryCourseRepository();
const enrollmentRepo = new InMemoryEnrollmentRepository();

const notificationService = new NotificationService([
  new EmailSender(),
  new SmsSender(),
  new PushSender(),
]);

const getStudentUseCase    = new GetStudentUseCase(studentRepo);
const enrollStudentUseCase = new EnrollStudentUseCase(
  studentRepo, courseRepo, enrollmentRepo, notificationService
);

// ---- Express App ----
const app = express();
app.use(express.json());

// Routes
app.use("/students",    studentController(getStudentUseCase));
app.use("/enrollments", enrollmentController(enrollStudentUseCase));

// ✅ Global Error Handler — хамгийн сүүлд байх ёстой!
app.use(globalErrorHandler);

// ---- Start ----
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log("\n📋 Test endpoints:");
  console.log("  GET  /students/1          → Student info");
  console.log("  GET  /students/999        → 404 NOT_FOUND");
  console.log("  POST /enrollments         → Enroll student");
  console.log("\n📦 Seed data:");
  console.log("  Students: id 1,2,3");
  console.log("  Course 1: 30 seats (open)");
  console.log("  Course 2: 1 seat  (concurrency test)");
  console.log("  Course 3: 0 seats (full)\n");
});

module.exports = app;
