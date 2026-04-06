const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Response from App 1');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', app: 'app1' });
});

app.listen(3001, () => {
    console.log('App 1 running on port 3001');
});