const express = require('express');
const server = express();
const HyperledgerApp = require('./app.js');

const PORT = 3000;

const hyperledgerApp = new HyperledgerApp();

server.use(express.static(__dirname + '/public'));

server.get('/', (req, res) => {
    res.send();
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})