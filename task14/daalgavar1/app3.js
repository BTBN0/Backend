const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Response from App 3');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', app: 'app3' });
});

app.listen(3003, () => {
    console.log('App 3 running on port 3003');
});