let express = require('express');
let router = express.Router();
let URL = require('url');
let mysql = require('mysql');
//let Game = require('./game');
let Text = require('./text');
let database = require('./database');
const fs = require('fs');
let formidable = require('formidable');
const { exec } = require('child_process');

/* GET users listing. */
let TEST_DATABASE = 'boardgames';
let USE_SCHEMA = 'use boardgames';
let TEST_TABLE = 'bggdatacn';

let getlogger = require('../log4js.js');
let logger = getlogger('ruleFile');
//let client = mysql.createConnection({
//    host: '127.0.0.1',
//    user:'root',
//    password:'b0@rdg@merule5',
//    port: '3306',
//});
let client = mysql.createConnection({
    host: '127.0.0.1',
    user: 'mysql',
    password: 'MyNewPass4!',
    port: '3306',
});

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

let createImage=function(req, res, next) {
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);
    let modSql = 'INSERT INTO raw_image_table (image_path) values ("fakepath")';
    let modSqlParams = [];
    client.query(modSql, modSqlParams);

    modSql = 'SELECT LAST_INSERT_ID();';
    modSqlParams = [];
    //return autoincrement
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                let result = results[0]['LAST_INSERT_ID()'];
                res.send(result.toString());
                console.log("generated image_id="+result);
                let file_name = result+".jpg";
                fs.rename(res.locals.filepath, "/var/tmp/img/" + file_name);
                // going to do blur
                let command = 'python3 /home/ssfve/upload-linux/autoBlur.py ' + file_name;
                console.log(command);
                exec(command,
                    function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                    });
            }else{
                res.send("0")
            }
        });
};

let saveButtonToPage=function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Update raw_control_table set '+params.button_db_name+'=? where page_id =?';
    let modSqlParams = [res.locals.buttonid, params.page_id];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(res.locals.buttonid.toString());
        });
};

let getGuideId=function(req, res, next) {
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Select guide_id from raw_button_table where button_id = ?';
    let modSqlParams = [params.button_id];
    let result = '';
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results[0] !== undefined) {
                console.log(results);
                result = results[0]['guide_id']
            } else {
                console.log('there is no record of this guide_id');
            }
            res.send(result.toString());
        });

};

let getPreviousPageId=function(req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Select button_from_page_id from raw_button_table where button_id = ?';
    let modSqlParams = [params.button_id];
    let result = '';
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results[0] !== undefined) {
                console.log(results);
                result = results[0]['button_from_page_id']
            } else {
                console.log('there is no record of this page_id');
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result.toString());
        });

};

let saveButtonAttribute=function (req, res, next) {
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);
    let modSql = 'update raw_button_table set '+params.attribute_name+'=? where button_id =?';
    let modSqlParams = [params.attribute_value, params.button_id];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.send("Success");
        });
};

let saveButtonInfo=function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Update raw_control_table set '+params.button_db_name+'=? where page_id =?';
    let modSqlParams = [res.locals.buttonid, params.page_id];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.send(res.locals.buttonid.toString());
        });
};

let getImageStream=function(req, res, next){
    let params = URL.parse(req.url, true).query;
    let filePath = '/var/tmp/img/'+params.file_name;
    console.log('file path='+filePath);
    let size = fs.statSync(filePath).size;
    console.log('file size='+size);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", 'attachment; filename=' + params.fileName);
    res.setHeader("Content-Length", size);
    res.setHeader("Accept-Ranges", 'bytes');
    fs.createReadStream(filePath).pipe(res);
};

let saveBackground= function (req, res, next) {
    console.log("upload started");
    let form = new formidable.IncomingForm();
    let params = URL.parse(req.url, true).query;

    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        next()
    });

    form.on('fileBegin', function (field, file) {
        console.log(file.path);
    });

    form.on('file', function (field, file) {
        res.locals.filepath = file.path
    });

    form.on('progress', function (bytesReceived, bytesExpected) {
        //console.log("progress started");
        //console.log(bytesReceived + '/' + bytesExpected + ' bytes')
    });

    form.on('end',function() {});

};
router.post('/saveBackgroundImage', [saveBackground, createImage]);
router.get('/saveButtonAttribute', [saveButtonAttribute]);
router.get('/getPreviousPageId', [getPreviousPageId]);
router.get('/getGuideId', [getGuideId]);
router.get('/writeImageDB', []);
router.get('/getImageStream', [getImageStream]);


module.exports = {
    router
};