// Simple in-memory store (array)
let todos = [
    { id: 1, title: 'Жишээ todo: server-ээ асаа', done: false },
    { id: 2, title: 'Postman-ээр шалга', done: false }
];

let nextId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;

exports.getAll = () => todos.slice(); // copy
exports.getById = (id) => todos.find(t => t.id === id) || null;

exports.create = ({ title }) => {
    const todo = { id: nextId++, title, done: false };
    todos.push(todo);
    return todo;
};

exports.update = (id, { title, done }) => {
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return null;
    if (title !== undefined) todos[idx].title = title;
    if (done !== undefined) todos[idx].done = done;
    return todos[idx];
};

exports.remove = (id) => {
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return false;
    todos.splice(idx, 1);
    return true;
};