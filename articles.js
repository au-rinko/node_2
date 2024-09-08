const fs = require('fs');
const { parseUrl, parseBodyJson } = require('./parsers');
let { jsonData, array, sayHello, notFound, notAllowed, isBadRequest, writeToFile } = require('./common');

const SERVER_SUCCESS = 200;
const CREATED = 201;

function create(req, res) {
    if(req.method === "POST"){
        parseBodyJson(req, (err, result) => {
            if (err) {
                res.statusCode = err.code;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end( JSON.stringify(err) );
                return;
            }
            
            if (result.title && result.text && result.author) {
                res.statusCode = CREATED;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                const obj = { 
                    id: array.length + 1, 
                    title: result.title, 
                    text: result.text, 
                    date: Date.now(), 
                    author: result.author, 
                    comments: []
                };
                array.push(obj);
                writeToFile(array);
                res.end( JSON.stringify(obj) );
            } else {
                isBadRequest(req, res);
            }
        });
    } else {
        notAllowed(req, res);
    }
}

function update(req, res, params) {
    if(req.method === "PUT"){
        parseBodyJson(req, (err, result) => {
            if (err) {
                res.statusCode = err.code;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end( JSON.stringify(err) );
                return;
            }
            
            if ((result.title || result.text || result.author) && params && params.id <= array.length && params.id > 0) {
                res.statusCode = SERVER_SUCCESS;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                array = array.map(item => item.id !== +params.id ? item: {
                            id: item.id,
                            title: result.title || item.title,
                            text: result.text || item.text,
                            date: result.date || item.date,
                            author: result.author || item.author,
                            comments: item.comments
                        }
                );
                writeToFile(array);
                res.end('Article updated');
            } else {
                isBadRequest(req, res);
            }
        });
    } else {
        notAllowed(req, res);
    }
}

function deleteArt(req, res, params) {
    if (req.method === 'DELETE') {
        res.statusCode = SERVER_SUCCESS;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        if (+params.id > array.length || !params || isNaN(+params.id) || +params.id < 0) {
            isBadRequest(req, res);
        } else {
            array = array.filter(item => item.id !== +params.id).map((item, index) => item = {
                id: index + 1,
                title: item.title,
                text: item.text,
                date: item.date,
                author: item.author,
                comments: item.comments
            });
            writeToFile(array);
            res.end('Article deleted');
        }
    } else {
        notAllowed(req, res);
    }
}

module.exports = {
    create,
    update,
    deleteArt,
    writeToFile
}