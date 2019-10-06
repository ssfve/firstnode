let express = require('express');
let router = express.Router();
let URL = require('url');
let mysql = require('mysql');
//let Game = require('./game');
let Text = require('./text');

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

let createText=function(req, res, next) {
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);
    let modSql = 'INSERT INTO raw_text_table (textContent,pageID) values (?,?)';
    let modSqlParams = [params.text_value, params.page_id];
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
            res.locals.textid = result;
            next();
        });
};

let getTextAttribute=function(req, res, next) {
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);
    // create a default new page record with default background image of id 0
    let modSql = 'select '+params.attribute_name+' from raw_text_table where textID=?';
    let modSqlParams = [params.text_id];
    let result = null;
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                if(results[0] !== undefined){
                    result = results[0][params.attribute_name];
                    console.log(result);
                }else{
                    result = ''
                }
            }
            res.send(result.toString());
        });
};

let saveTextToPage=function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Update raw_control_table set text1_id=? where page_id =?';
    let modSqlParams = [res.locals.textid, params.page_id];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.send(res.locals.textid.toString());
        });
};

let getPageTextContent=function(req, res, next) {
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);
    // create a default new page record with default background image of id 0
    if (params.page_id === ''|| params.page_id === undefined|| params.page_id === null){
        console.log('page_id not found returning empty string');
        res.send("");
    }
    let modSql = 'select a.textContent ' +
        'from raw_text_table as a,raw_control_table as b ' +
        'where a.textID = b.text1_id ' +
        'and b.page_id='+params.page_id;
    console.log(modSql);
    let modSqlParams = [];
    let result = null;
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                if(results[0] !== undefined){
                    result = results[0]['textContent'];
                    console.log(result);
                }else{
                    result = ''
                }
            }
            res.send(result.toString());
        });
};

router.get('/getTextAttribute', [getTextAttribute]);
router.get('/writeTextDB', [createText, saveTextToPage]);
router.get('/getPageTextContent', [getPageTextContent]);

module.exports = {
    router,
    getTextAttribute
};
