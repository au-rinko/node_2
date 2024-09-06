const http = require('http');
const fs = require('fs');
const { parseUrl, parseBodyJson } = require('./parsers');
const { hello, readAll, read, create, update, deleteArt, createComment, notFound } = require('./controllers');

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
    '/': hello,
    '/articles/readall': readAll,
    '/articles/read': read,
    '/articles/create': create,
    '/articles/update': update,
    '/articles/delete': deleteArt,
    '/comments/create': createComment,
};

const server = http.createServer(handler);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function handler(req, res) {
    const { url, params } = parseUrl(req.url);
    const handler = getHandler(url);
    handler(req, res, params);
}

function getHandler(url) {
    return handlers[url] || notFound;
}