require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const services = {
  auth: { host: 'localhost', port: 3001 },
  products: { host: 'localhost', port: 3002 },
  orders: { host: 'localhost', port: 3003 },
  payments: { host: 'localhost', port: 3004 },
};

function forward(serviceName, pathPrefix) {
  return (req, res) => {
    const svc = services[serviceName];
    const targetPath = '/' + pathPrefix + req.path;
    const body = JSON.stringify(req.body);

    const options = {
      hostname: svc.host,
      port: svc.port,
      path: targetPath,
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...(req.headers.authorization ? { authorization: req.headers.authorization } : {}),
      },
    };

    const proxy = http.request(options, (svcRes) => {
      res.status(svcRes.statusCode);
      svcRes.pipe(res);
    });

    proxy.on('error', (err) => {
      res.status(502).json({ error: 'Service unavailable', detail: err.message });
    });

    proxy.write(body);
    proxy.end();
  };
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/health', (_, res) => res.json({ status: 'API Gateway OK' }));

app.use('/api/auth', forward('auth', 'auth'));
app.use('/api/products', forward('products', 'products'));
app.use('/api/orders', verifyToken, forward('orders', 'orders'));
app.use('/api/payments', verifyToken, forward('payments', 'payments'));

app.listen(3000, () => console.log('API Gateway running on port 3000'));