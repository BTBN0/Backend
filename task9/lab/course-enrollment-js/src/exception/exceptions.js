// ============================================================
// 🧪 LAB 1 — Task 1: Custom Exceptions
// Error-аас удамшуулна
// ============================================================

class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundException";
    this.statusCode = 404;
    this.code = "NOT_FOUND";
  }
}

class CourseFullException extends Error {
  constructor(message) {
    super(message);
    this.name = "CourseFullException";
    this.statusCode = 400;
    this.code = "COURSE_FULL";
  }
}

class AlreadyEnrolledException extends Error {
  constructor(message) {
    super(message);
    this.name = "AlreadyEnrolledException";
    this.statusCode = 409;
    this.code = "ALREADY_ENROLLED";
  }
}

module.exports = { NotFoundException, CourseFullException, AlreadyEnrolledException };
