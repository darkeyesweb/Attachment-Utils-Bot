const express = require('express');
const path = require('path');

const app = express();

app.arguments('/api/discord', require('./api/discord'));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8000, () => {
    console.info('Running on port 8000');
});