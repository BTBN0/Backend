require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.get('/health', (_, res) => res.json({ status: 'Product Service OK' }));

app.listen(process.env.PORT || 3002, () => {
  console.log(`Product Service running on port ${process.env.PORT || 3002}`);
});
