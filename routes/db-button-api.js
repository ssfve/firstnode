let express = require('express');
let router = express.Router();
let URL = require('url');
let mysql = require('mysql');
//let Game = require('./game');
let Text = require('./text');
let database = require('./database');

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


let createButton=function(req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);
    let modSql = 'INSERT INTO raw_button_table (button_text,button_from_page_id,guide_id) values (?,?,?)';
    let modSqlParams = [params.input_value, params.page_id, params.guide_id];
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
                result = results[0]['LAST_INSERT_ID()'];
                console.log(result);
            }
            //res.setHeader("Access-Control-Allow-Origin", "*");
            res.locals.buttonid = result;
            res.locals.attribute_name = params.button_db_name;
            res.locals.attribute_value = result;
            res.locals.key_name = 'page_id';
            res.locals.key_value = params.page_id;
            res.locals.table_name = 'raw_control_table';
            next();
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
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(res.locals.buttonid.toString());
        });
};

router.get('/saveButtonAttribute', [saveButtonAttribute]);
router.get('/getPreviousPageId', [getPreviousPageId]);
router.get('/getGuideId', [getGuideId]);
router.get('/writeButtonDB', [createButton, database.updateAttributeInner]);

module.exports = router;
