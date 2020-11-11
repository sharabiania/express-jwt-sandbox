'use strict'
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const jwt = require('express-jwt');
let issuerList = [];
const pathGuard = jwt({
    algorithms: ['HS256'],
    getToken: (req) => { return req.headers['x-api-key']; },
    secret: (req, payload, done) => {        
        const obj = issuerList.find(x => x.iss == payload.iss);
        done(null, obj.secret);
    }
});

(function initialize() {
    try {
        issuerList = JSON.parse(fs.readFileSync(path.resolve(__dirname, './jwt.json')));
        console.info('jwt file is loaded successfully.');
    }
    catch (err) {
        console.error('cannot read jwt file.');
    }
})();

app.get('/unprotected', (req, res) => {
    res.send('this is an unprotected path.');
});


app.get('/', pathGuard, (req, res) => {
    console.info('decoded JWT payload: ');
    console.info(req.user);
    res.send('express jwt server is running...');
});

app.listen(port, () => {
    console.info(`express-jwt app listening at http://localhost:${port}`);
});
