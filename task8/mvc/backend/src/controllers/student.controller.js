const studentService = require("../services/student.service");
const CreateStudentDTO = require("../dtos/create-student.dto");
const StudentResponseDTO = require("../dtos/student-response.dto");

class StudentController {
  getStudents(req, res) {
    const students = studentService.getAllStudents();
    const response = students.map(s => new StudentResponseDTO(s));
    res.json(response);
  }

  createStudent(req, res) {
    try {
      const dto = new CreateStudentDTO(req.body);
      const student = studentService.createStudent(dto);
      const response = new StudentResponseDTO(student);

      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  deleteStudent(req, res) {
    const deleted = studentService.deleteStudent(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted" });
  }
}

module.exports = new StudentController();