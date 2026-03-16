// 🧪 LAB 5 — UseCase per action (Single Responsibility)

const { NotFoundException } = require("../exception/exceptions");

class GetStudentUseCase {
  constructor(studentRepo) {
    this.studentRepo = studentRepo;
  }

  async execute(id) {
    const student = await this.studentRepo.findById(id);
    if (!student) {
      throw new NotFoundException("Student not found");
    }
    return student;
  }
}

module.exports = GetStudentUseCase;
