const express = require('express');
const path = require('path');
const todoRoutes = require('./routes/todo.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from src/public
app.use(express.static(path.join(__dirname, 'public')));

// API routes (prefix)
app.use('/api/todos', todoRoutes);

// 404 for unknown API or other routes — if you want SPA fallback, uncomment below
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;