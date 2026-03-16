class StudentResponseDTO {
  constructor(student) {
    this.id = student.id;
    this.name = student.name;
    this.age = student.age;
    this.gpa = student.gpa;
  }
}

module.exports = StudentResponseDTO;