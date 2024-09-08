const fs = require('fs');
const { jsonData, array, sayHello, notFound, notAllowed, isBadRequest } = require('./common');

const SERVER_SUCCESS = 200;

function readAll(req, res) {
    if (req.method === 'GET') {
        res.statusCode = SERVER_SUCCESS;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(jsonData);
    } else {
        notAllowed(req, res);
    }
}

function read(req, res, params) {
    if (req.method === 'GET') {
        if (params && !isNaN(+params.id) && +params.id <= array.length && +params.id >= 0) {
            res.statusCode = SERVER_SUCCESS;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            const result = array.filter(item => item.id == params.id);
            res.end( JSON.stringify(result) );
        } else {
            isBadRequest(req, res);
        }
    } else {
        notAllowed(req, res);
    }
}

module.exports = {
    readAll,
    read
}