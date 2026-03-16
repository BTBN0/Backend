// ============================================================
// 🧪 LAB 5 — Domain layer
// Framework-аас хамаарахгүй — цэвэр JS объект
// Business logic domain дотор байна
// ============================================================

class Student {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

class Course {
  constructor(id, name, totalSeats, remainingSeats) {
    this.id = id;
    this.name = name;
    this.totalSeats = totalSeats;
    this.remainingSeats = remainingSeats;
  }

  // ✅ Business logic — domain дотор байна
  isFull() {
    return this.remainingSeats <= 0;
  }

  decreaseSeat() {
    if (this.isFull()) throw new Error("Course is already full");
    this.remainingSeats--;
  }
}

class Enrollment {
  constructor(id, studentId, courseId) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.enrolledAt = new Date().toISOString();
  }
}

module.exports = { Student, Course, Enrollment };
