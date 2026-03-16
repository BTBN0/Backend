// ============================================================
// 🧪 LAB 4 — Infrastructure (Concrete implementations)
// StudentService → StudentRepository (interface)
//                      ↓
//               InMemoryStudentRepository  ← солих боломжтой
//               MySQLStudentRepository     ← service өөрчлөхгүйгээр!
//               MongoStudentRepository
// ============================================================

const { StudentRepository, CourseRepository, EnrollmentRepository } = require("../repository/repositories");
const { Student, Course, Enrollment } = require("../domain/entities");

// ---- Student ----
class InMemoryStudentRepository extends StudentRepository {
  constructor() {
    super();
    // Seed data
    this.store = new Map([
      [1, new Student(1, "Bat-Erdene",   "bat@school.mn")],
      [2, new Student(2, "Narantsetseg", "naran@school.mn")],
      [3, new Student(3, "Gantulga",     "gan@school.mn")],
    ]);
    this.seq = 4;
  }

  async findById(id) {
    return this.store.get(Number(id)) || null;
  }

  async save(student) {
    if (!student.id) student.id = this.seq++;
    this.store.set(student.id, student);
    return student;
  }
}

// ---- Course ----
class InMemoryCourseRepository extends CourseRepository {
  constructor() {
    super();
    this.store = new Map([
      [1, new Course(1, "Spring Boot Fundamentals", 30, 30)],
      [2, new Course(2, "Clean Architecture",       20,  1)], // ← 1 seat (concurrency test)
      [3, new Course(3, "Full Course",              10,  0)], // ← already full
    ]);
    this.locks = new Map(); // 🔒 Bonus: concurrency lock
  }

  async findById(id) {
    return this.store.get(Number(id)) || null;
  }

  // 🔒 Bonus: Pessimistic lock simulation
  async findByIdWithLock(id) {
    const numId = Number(id);

    // Lock хүлээх (өөр transaction барьж байвал)
    while (this.locks.get(numId)) {
      await new Promise((r) => setTimeout(r, 10));
    }
    this.locks.set(numId, true);

    return this.store.get(numId) || null;
  }

  releaseLock(id) {
    this.locks.delete(Number(id));
  }

  async save(course) {
    this.store.set(course.id, course);
    this.releaseLock(course.id); // Lock суллана
    return course;
  }
}

// ---- Enrollment ----
class InMemoryEnrollmentRepository extends EnrollmentRepository {
  constructor() {
    super();
    this.store = new Map();
    this.seq = 1;
  }

  async findByStudentAndCourse(studentId, courseId) {
    for (const e of this.store.values()) {
      if (e.studentId === Number(studentId) && e.courseId === Number(courseId)) {
        return e;
      }
    }
    return null;
  }

  async save(enrollment) {
    if (!enrollment.id) enrollment.id = this.seq++;
    this.store.set(enrollment.id, enrollment);
    return enrollment;
  }
}

module.exports = {
  InMemoryStudentRepository,
  InMemoryCourseRepository,
  InMemoryEnrollmentRepository,
};
