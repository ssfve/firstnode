let express = require('express');
let router = express();
let URL = require('url');
let mysql = require('mysql');
let Game = require('./game');
let Style = require('./style');
let Image = require('./image');
let Text = require('./text');
let Control = require('./control');
let formidable = require('formidable');
let util = require('util');

//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

/* GET users listing. */
let TEST_DATABASE = 'boardgames';
let TEST_TABLE = 'bggdatacn';

/*
let client = mysql.createConnection({
    host: '127.0.0.1',
    user:'root',
    password:'b0@rdg@merule5',
    port: '3306',
});
*/
let client = mysql.createConnection({
    host: '127.0.0.1',
    user: 'mysql',
    password: 'MyNewPass4!',
    port: '3306',
});

router.get('/', function (req, res, next) {
    res.send('respond with games resource');
});

router.get('/getFolderFileList', function (req, res) {

    let params = URL.parse(req.url, true).query;

    //joining path of directory
    console.log(params.uploadFolder);
    const directoryPath = path.join(params.uploadFolder);
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(JSON.stringify(files));
    });

});

module.exports = router;
