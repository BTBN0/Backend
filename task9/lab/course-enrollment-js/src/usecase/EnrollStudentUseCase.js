// ============================================================
// 🧪 LAB 5 — Clean Architecture: UseCase layer
// Controller → UseCase → Repository Interface → Infrastructure
//
// 🧪 LAB 2 — Transaction:
//   JS-д @Transactional байхгүй тол rollback механизм өөрөө хийнэ
//   Алдаа гарвал: enrollment хадгалагдахгүй, seat өөрчлөгдөхгүй
// ============================================================

const { NotFoundException, CourseFullException, AlreadyEnrolledException } = require("../exception/exceptions");
const { Enrollment } = require("../domain/entities");

class EnrollStudentUseCase {
  constructor(studentRepo, courseRepo, enrollmentRepo, notificationService) {
    this.studentRepo = studentRepo;
    this.courseRepo = courseRepo;
    this.enrollmentRepo = enrollmentRepo;
    this.notificationService = notificationService;
  }

  async enroll(studentId, courseId) {
    // ============================================================
    // 🧪 LAB 2 — Transaction simulation
    // Snapshot хадгална → алдаа гарвал rollback хийнэ
    // ============================================================
    let courseSnapshot = null; // rollback-д хэрэглэнэ

    try {
      // Step 1 — Student exists?
      const student = await this.studentRepo.findById(studentId);
      if (!student) {
        throw new NotFoundException(`Student not found with id: ${studentId}`);
      }

      // Step 2 — Course exists? (with lock for concurrency)
      const course = await this.courseRepo.findByIdWithLock(courseId);
      if (!course) {
        throw new NotFoundException(`Course not found with id: ${courseId}`);
      }

      // Snapshot — rollback хийхэд ашиглана
      courseSnapshot = { ...course, remainingSeats: course.remainingSeats };

      // Step 3 — Course full?
      if (course.isFull()) {
        throw new CourseFullException(`Course "${course.name}" is full`);
      }

      // Step 4 — Already enrolled?
      const existing = await this.enrollmentRepo.findByStudentAndCourse(studentId, courseId);
      if (existing) {
        throw new AlreadyEnrolledException("Student already enrolled in this course");
      }

      // Step 5 — Save enrollment
      const enrollment = new Enrollment(null, Number(studentId), Number(courseId));
      await this.enrollmentRepo.save(enrollment);

      // Step 6 — Decrease seat
      course.decreaseSeat();
      await this.courseRepo.save(course);

      // Step 7 — Notify (LAB 3)
      this.notificationService.notify("EMAIL", student.email, `You enrolled in: ${course.name}`);

      return { success: true };

    } catch (err) {
      // 🧪 LAB 2 — Rollback: seat count буцаана
      if (courseSnapshot && !(err instanceof NotFoundException)) {
        try {
          const course = await this.courseRepo.findById(courseId);
          if (course) {
            course.remainingSeats = courseSnapshot.remainingSeats;
            await this.courseRepo.save(course);
            console.log(`[ROLLBACK] Course ${courseId} seats restored`);
          }
        } catch (_) {}
      }
      throw err; // дээш дамжуулна → GlobalErrorHandler барина
    }
  }
}

module.exports = EnrollStudentUseCase;
