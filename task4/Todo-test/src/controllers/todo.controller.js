const store = require('../data/todo.store');

// Helper for throwing App error objects
function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// GET /api/todos
exports.getAllTodos = (req, res) => {
  const todos = store.getAll();
  return res.json({ success: true, todos });
};

// GET /api/todos/:id
exports.getTodoById = (req, res, next) => {
  const id = Number(req.params.id);
  const todo = store.getById(id);
  if (!todo) return next(createError(404, 'Todo олдсонгүй'));
  return res.json({ success: true, todo });
};

// POST /api/todos
exports.createTodo = (req, res, next) => {
  const { title } = req.body ?? {};

  if (typeof title !== 'string') {
    return next(createError(400, 'title нь string байх ёстой'));
  }

  const trimmed = title.trim();
  if (!trimmed) {
    return next(createError(400, 'title хоосон байж болохгүй'));
  }

  const newTodo = store.create({ title: trimmed });
  return res.status(201).json({ success: true, todo: newTodo });
};

// PATCH /api/todos/:id
exports.updateTodo = (req, res, next) => {
  const id = Number(req.params.id);
  const existing = store.getById(id);
  if (!existing) return next(createError(404, 'Todo олдсонгүй'));

  const { title, done } = req.body ?? {};

  // title validation if present
  if (title !== undefined) {
    if (typeof title !== 'string') return next(createError(400, 'title нь string байх ёстой'));
    if (title.trim() === '') return next(createError(400, 'title хоосон байж болохгүй'));
  }

  // done validation if present
  if (done !== undefined) {
    if (typeof done !== 'boolean') return next(createError(400, 'done нь boolean байх ёстой'));
  }

  const updated = store.update(id, { title: title !== undefined ? title.trim() : undefined, done });
  return res.json({ success: true, todo: updated });
};

// DELETE /api/todos/:id
exports.deleteTodo = (req, res, next) => {
  const id = Number(req.params.id);
  const deleted = store.remove(id);
  if (!deleted) return next(createError(404, 'Todo олдсонгүй'));
  return res.json({ success: true, message: 'Deleted' });
};