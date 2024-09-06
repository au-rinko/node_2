function parseUrl(url) {
    const [parsedUrl, paramsString] = url.split('?');
    let parsedParams = null;
    
    if (paramsString) {
        const params = paramsString.split('&')
        parsedParams = params.reduce((acc, curr) => {
            const [key, value] = curr.split('=');
            acc[key] = value;
    
            return acc;
        }, {});
    }
    

    return {
        url: parsedUrl,
        params: parsedParams
    }
}

function parseBodyJson(req, cb) {
    let body = [];

    req.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();

        let params = JSON.parse(body);

        cb(null, params);
    });
}

module.exports = {
    parseUrl,
    parseBodyJson
}