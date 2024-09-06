const fs = require('fs');
const { parseUrl, parseBodyJson } = require('./parsers');

const SERVER_SUCESS = 200;

const jsonData = fs.readFileSync('articles.json', 'utf8');
const array = JSON.parse(jsonData);

function hello(req, res) {
    res.statusCode = SERVER_SUCESS;
    res.setHeader('Content-Type', 'text/html');
    res.write('<h1>Hello</h1>');
    res.write('<a href="/articles/readall">read articles</a>');
    res.end();
}

function readAll(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(jsonData);
}

function read(req, res, params) {
    res.statusCode = 200;
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
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        const obj = Object.assign({ id: array.length + 1}, result);
        array.push(obj);
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
    notFound
}