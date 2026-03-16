const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');
const validateId = require('../middlewares/validateId');

// GET /api/todos
router.get('/', todoController.getAllTodos);

// POST /api/todos
router.post('/', todoController.createTodo);

// GET /api/todos/:id
router.get('/:id', validateId, todoController.getTodoById);

// PATCH /api/todos/:id
router.patch('/:id', validateId, todoController.updateTodo);

// DELETE /api/todos/:id
router.delete('/:id', validateId, todoController.deleteTodo);

module.exports = router;


