const fs = require('fs');
const { parseUrl, parseBodyJson } = require('./parsers');

const SERVER_SUCCESS = 200;

const jsonData = fs.readFileSync('articles.json', 'utf8');
let array = JSON.parse(jsonData);

function hello(req, res) {
    res.statusCode = SERVER_SUCESS;
    res.setHeader('Content-Type', 'text/html');
    res.write('<h1>Hello</h1>');
    res.write('<a href="/articles/readall">read articles</a>');
    res.end();
}

function readAll(req, res) {
    res.statusCode = SERVER_SUCCESS;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(jsonData);
}

function read(req, res, params) {
    res.statusCode = SERVER_SUCCESS;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const result = array.filter(item => item.id == params.id);
    if(result.length !== 0) {
        res.end(JSON.stringify(result));
    } else {
        res.end(`There is no such article`);
    }
}

function create(req, res) {
    parseBodyJson(req, (err, result) => {
        if (err) {
            res.statusCode = err.code;
            res.setHeader('Content-Type', 'application/json');
            res.end( JSON.stringify(err) );
    
            return;
        }
        
        res.statusCode = SERVER_SUCCESS;
        res.setHeader('Content-Type', 'application/json');
        const obj = Object.assign({ id: array.length + 1}, result);
        array.push(obj);
        writeToFile(array);
        res.end( JSON.stringify( obj ) );
    });
}

function update(req, res, params) {
    parseBodyJson(req, (err, result) => {
        if (err) {
            res.statusCode = err.code;
            res.setHeader('Content-Type', 'application/json');
            res.end( JSON.stringify(err) );
    
            return;
        }
        
        res.statusCode = SERVER_SUCCESS;
        res.setHeader('Content-Type', 'application/json');
        console.log(params.id);
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
        res.end( 'Updated' );
    });
}

function deleteArt(req, res, params) {
    res.statusCode = SERVER_SUCCESS;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    console.log(params.id);
    if(+params.id > array.length){
        res.end(`There is no such article`);
    } else {
        array = array.filter(item => item.id !== +params.id).map((item, index) => item.id = {
            id: index + 1,
            title: item.title,
            text: item.text,
            date: item.date,
            author: item.author,
            comments: item.comments
        });
        writeToFile(array);
        res.end('Deleted');
    }
}

function createComment(req, res, params) {
    parseBodyJson(req, (err, result) => {
        if (err) {
            res.statusCode = err.code;
            res.setHeader('Content-Type', 'application/json');
            res.end( JSON.stringify(err) );
    
            return;
        }
        
        res.statusCode = SERVER_SUCCESS;
        res.setHeader('Content-Type', 'application/json');
        const obj = Object.assign({ id: array[+params.id - 1].comments.length + 1}, {articleId: params.id}, result);
        array[+params.id - 1].comments.push(obj);
        writeToFile(array);
        res.end( JSON.stringify( obj ) );
    });
}

function notFound(req, res) {
    res.statusCode = 404;
    res.end('Not found');
}

function writeToFile(data) {
    fs.writeFile('./articles.json', JSON.stringify(data), (err) => {
        if(err) console.log(err);
    });
}

module.exports = {
    hello,
    readAll,
    read,
    create,
    update,
    deleteArt,
    createComment,
    notFound
}