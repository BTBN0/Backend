# 🎓 Course Enrollment System — Node.js + Express

## 📁 Folder Structure

```
course-enrollment-js/
├── package.json
└── src/
    ├── app.js                        ← Entry point, Dependency Injection
    │
    ├── domain/
    │   └── entities.js               ← Student, Course, Enrollment (LAB 5)
    │
    ├── exception/
    │   └── exceptions.js             ← NotFoundException, CourseFullException (LAB 1)
    │
    ├── middleware/
    │   └── globalErrorHandler.js     ← @RestControllerAdvice equivalent (LAB 1)
    │
    ├── repository/
    │   └── repositories.js           ← Abstract interfaces (LAB 4)
    │
    ├── infrastructure/
    │   └── inMemoryRepositories.js   ← Concrete implementations (LAB 4)
    │
    ├── notification/
    │   └── notification.js           ← SOLID: Interface + EmailSender/SmsSender/PushSender (LAB 3)
    │
    ├── usecase/
    │   ├── EnrollStudentUseCase.js   ← Transaction + Business logic (LAB 2 + 5)
    │   └── GetStudentUseCase.js      ← (LAB 5)
    │
    └── controller/
        ├── studentController.js      ← No try/catch! (LAB 1 + 5)
        └── enrollmentController.js   ← Final Challenge
```

---

## 🚀 Run

```bash
npm install
npm start

# Dev mode (auto-restart):
npm run dev
```

---

## 🧪 Test Commands (curl)

### LAB 1 — Exception Handling

```bash
# ✅ Student found
curl http://localhost:3000/students/1

# ❌ 404 NOT_FOUND
curl http://localhost:3000/students/999
```

### Final Challenge — Enrollment

```bash
# ✅ Successful enrollment
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "courseId": 1}'

# ❌ 400 COURSE_FULL (course 3 has 0 seats)
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "courseId": 3}'

# ❌ 404 NOT_FOUND (student 999 doesn't exist)
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId": 999, "courseId": 1}'

# ❌ 409 ALREADY_ENROLLED (enroll twice)
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "courseId": 1}'
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "courseId": 1}'
```

### 🧠 Bonus — Concurrency Test (Course 2 has only 1 seat)

```bash
# 2 request зэрэг илгээнэ — зөвхөн 1 амжилттай!
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "courseId": 2}' &

curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId": 2, "courseId": 2}' &

wait
```

---

## 📊 Error Response Format

```json
{
  "timestamp": "2024-03-06T10:30:00.000Z",
  "status": 404,
  "code": "NOT_FOUND",
  "message": "Student not found",
  "path": "/students/999"
}
```

## ✅ Lab Checkpoints

| Lab | Шалгах зүйл | Байршил |
|-----|-------------|---------|
| LAB 1 | Controller-д try/catch байхгүй | `studentController.js` |
| LAB 1 | Global handler exception барина | `globalErrorHandler.js` |
| LAB 1 | JSON error response | `globalErrorHandler.js` |
| LAB 2 | Transaction rollback | `EnrollStudentUseCase.js` |
| LAB 2 | Seat count өөрчлөгдөхгүй | `EnrollStudentUseCase.js` |
| LAB 3 | Interface ашигласан | `notification.js` |
| LAB 3 | Шинэ sender нэмэхэд code өөрчлөгдөхгүй | `NotificationService` |
| LAB 4 | DB солиход service өөрчлөгдөхгүй | `repositories.js` |
| LAB 5 | Controller → UseCase → Repository | `app.js` |
| LAB 5 | Domain framework мэдэхгүй | `entities.js` |
