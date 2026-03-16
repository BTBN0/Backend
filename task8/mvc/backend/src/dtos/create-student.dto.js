class CreateStudentDTO {
  constructor(body) {
    this.name = body.name;
    this.age = Number(body.age);
    this.gpa = Number(body.gpa);
  }
}

module.exports = CreateStudentDTO;