require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', (_, res) => res.json({ status: 'Auth Service OK' }));

app.listen(process.env.PORT || 3001, () => {
  console.log(`Auth Service running on port ${process.env.PORT || 3001}`);
});
