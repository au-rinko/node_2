const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const SERVER_SUCESS = 200;

const server = http.createServer((req, res) => {
    res.statusCode = SERVER_SUCESS;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello world');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})