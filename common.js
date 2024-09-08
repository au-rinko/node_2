const fs = require('fs');

const SERVER_SUCCESS = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const METHOD_NOT_ALLOWED = 405;

const jsonData = fs.readFileSync('articles.json', 'utf8');
let array = JSON.parse(jsonData);

function hello(req, res) {
    if (req.method === 'GET') {
        res.statusCode = SERVER_SUCCESS;
        res.setHeader('Content-Type', 'text/html');
        res.write('<h1>Hello</h1>');
        res.write('<a href="/articles/readall">read articles</a>');
        res.end();
    } else {
        notAllowed(req, res);
    }
}

function notFound(req, res) {
    res.statusCode = NOT_FOUND;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end('Not found');
}

function notAllowed(req, res) {
    res.statusCode = METHOD_NOT_ALLOWED;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end('Method Not Allowed');
}

function isBadRequest(req, res) {
    res.statusCode = BAD_REQUEST;
    const errorObj = {
        code: res.statusCode,
        message: 'Request invalid'
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(errorObj));
}

module.exports = {
    jsonData,
    array,
    hello,
    notFound,
    notAllowed,
    isBadRequest
}