const http = require('http');
const fs = require('fs');
const { jsonData, array, sayHello, notFound, notAllowed, isBadRequest, writeToFile } = require('./common');
const { readAll, read } = require('./read');
const { create, update, deleteArt } = require('./articles');
const { createComment, deleteComment } = require('./comments');
const { parseUrl, parseBodyJson } = require('./parsers');
const { createLogs } = require('./logs');

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
    '/': sayHello,
    '/articles/readall': readAll,
    '/articles/read': read,
    '/articles/create': create,
    '/articles/update': update,
    '/articles/delete': deleteArt,
    '/comments/create': createComment,
    '/comments/delete': deleteComment
};

const server = http.createServer(handler);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function handler(req, res) {
    const { url, params } = parseUrl(req.url);
    const handler = getHandler(url);
    createLogs(req, url, params);
    handler(req, res, params);
}

function getHandler(url) {
    return handlers[url] || notFound;
}
