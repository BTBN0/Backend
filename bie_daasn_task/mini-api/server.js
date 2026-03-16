// server.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Root тест
app.get('/', (req, res) => {
  res.send('Server ajillaj baina');
});

// Fake "database"
let users = [
      
  { id: 1, name: "Bat" },
  { id: 2, name: "Neo" }
];

// GET /users - бүх хэрэглэгч авах
app.get('/users', (req, res) => {
  res.json(users);
});

// POST /users - шинэ хэрэглэгч нэмэх
app.post('/users', (req, res) => {
  console.log('POST /users body:', req.body);
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name field required' });
  }
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name
  };
  users.push(newUser);
  console.log('Users now:', users);
  res.status(201).json(newUser);
});

// GET /users/:id - нэг хэрэглэгч авах
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log('GET /users/:id ->', id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// DELETE /users/:id - хэрэглэгч устгах
app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log('DELETE /users/:id ->', id);
  const exists = users.some(u => u.id === id);
  if (!exists) return res.status(404).json({ error: 'User not found' });

  users = users.filter(u => u.id !== id);
  console.log('Users now after delete:', users);
  res.json({ message: 'User deleted' });
});

app.listen(PORT, () => {
  console.log(`SERVER STARTED http://localhost:${PORT}`);
});