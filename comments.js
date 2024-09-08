const fs = require('fs');
const { parseUrl, parseBodyJson } = require('./parsers');
let { jsonData, array, sayHello, notFound, notAllowed, isBadRequest, writeToFile } = require('./common');

const SERVER_SUCCESS = 200;
const CREATED = 201;

function createComment(req, res, params) {
    if (req.method === 'POST'){
        parseBodyJson(req, (err, result) => {
            if (err) {
                res.statusCode = err.code;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end( JSON.stringify(err) );
        
                return;
            }
            
            if (params && result.author && result.text) {
                res.statusCode = CREATED;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                const obj = { 
                    id: array[+params.articleId - 1].comments.length + 1, 
                    articleId: params.articleId, 
                    text: result.text, 
                    date: Date.now(), 
                    author: result.author
                };
                array[+params.articleId - 1].comments.push(obj);
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

function deleteComment(req, res, params) {
    if (req.method === 'DELETE'){
        res.statusCode = SERVER_SUCCESS;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        if (!params.articleId || !params.id || isNaN(+params.id) || isNaN(+params.articleId) || +params.articleId > array.length || +params.id > array[+params.articleId - 1].comments.length) {
            isBadRequest(req, res);
        } else {
            array[+params.articleId - 1].comments = array[+params.articleId - 1].comments.filter(item => item.id !== +params.id).map((item, index) => item = {
                id: index + 1,
                articleId: +params.articleId,
                text: item.text,
                date: item.date,
                author: item.author
                });        
            writeToFile(array);
            res.end('Comment deleted');
        }
    } else {
        notAllowed(req, res);
    }
}

module.exports = {
    createComment,
    deleteComment,
}