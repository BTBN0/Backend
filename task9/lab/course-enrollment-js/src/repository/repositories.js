// ============================================================
// 🧪 LAB 4 — Dependency Inversion
// JS-д interface гэж байхгүй тул abstract base class ашиглана
// Service нь зөвхөн энэ "interface"-тэй л ажиллана
// MySQL эсвэл Mongo — service мэдэхгүй!
// ============================================================

class StudentRepository {
  async findById(id)     { throw new Error("Not implemented"); }
  async save(student)    { throw new Error("Not implemented"); }
}

class CourseRepository {
  async findById(id)           { throw new Error("Not implemented"); }
  async findByIdWithLock(id)   { throw new Error("Not implemented"); }
  async save(course)           { throw new Error("Not implemented"); }
}

class EnrollmentRepository {
  async findByStudentAndCourse(studentId, courseId) { throw new Error("Not implemented"); }
  async save(enrollment)                            { throw new Error("Not implemented"); }
}

module.exports = { StudentRepository, CourseRepository, EnrollmentRepository };
