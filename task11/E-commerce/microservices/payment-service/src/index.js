require('dotenv').config();
const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/payments', paymentRoutes);
app.get('/health', (_, res) => res.json({ status: 'Payment Service OK' }));

app.listen(process.env.PORT || 3004, () => {
  console.log(`Payment Service running on port ${process.env.PORT || 3004}`);
});
