const studentRepository = require("../repositories/student.repository");

class StudentService {
  getAllStudents() {
    return studentRepository.findAll();
  }

  createStudent(data) {
    // 🔥 BUSINESS RULE
    if (data.gpa < 0 || data.gpa > 4) {
      throw new Error("GPA must be between 0 and 4");
    }

    return studentRepository.create(data);
  }

  deleteStudent(id) {
    return studentRepository.deleteById(Number(id));
  }
}

module.exports = new StudentService();