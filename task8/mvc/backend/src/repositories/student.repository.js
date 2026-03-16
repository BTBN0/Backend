let students = [];
let idCounter = 1;

class StudentRepository {
  findAll() {
    return students;
  }

  create(studentData) {
    const newStudent = {
      id: idCounter++,
      ...studentData,
    };
    students.push(newStudent);
    return newStudent;
  }

  deleteById(id) {
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;

    const deleted = students[index];
    students.splice(index, 1);
    return deleted;
  }
}

module.exports = new StudentRepository();