const fs = require('fs');
const { jsonData, array, hello, notFound, notAllowed, isBadRequest } = require('./common');

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
    if(req.method === 'GET') {
        res.statusCode = SERVER_SUCCESS;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        const result = array.filter(item => item.id == params.id);
        if(result.length !== 0) {
            res.end(JSON.stringify(result));
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