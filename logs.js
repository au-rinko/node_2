const fs = require('fs');
let logInfo = '';

function createLogs(req, url, params) {
    const date = new Date;
    logInfo = `[${date.toLocaleString().replace(/,/, '')}]\t`;
    logInfo += `url: ${url}\t  method: ${req.method}\t params: ${JSON.stringify(params)}\n`;
    
    fs.appendFile('./logs.txt', logInfo, (err) => {
        if(err) console.log(err);
    });
}

module.exports = {
    createLogs
}