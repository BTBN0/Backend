// ============================================================
// 🧪 LAB 1 ✅ Checkpoint: Controller дээр try/catch БАЙХГҮЙ!
// next(err) дамжуулахад GlobalErrorHandler барина
//
// 🧪 LAB 5: Controller → UseCase (service биш)
// ============================================================

const express = require("express");
const router = express.Router();

module.exports = (getStudentUseCase) => {
  // GET /students/:id
  router.get("/:id", async (req, res, next) => {
    // ✅ try/catch байхгүй — next(err)-ээр global handler руу илгээнэ
    const student = await getStudentUseCase.execute(req.params.id).catch(next);
    if (student) res.json(student);
  });

  return router;
};
