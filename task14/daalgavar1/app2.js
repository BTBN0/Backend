const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Response from App 2');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'app2' });
});

app.listen(3002, () => {
  console.log('App 2 running on port 3002');
});