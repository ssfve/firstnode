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

let writePageDB=function(req, res, next){
    let text = new Text();
    let params = URL.parse(req.url, true).query;
    //client.connect();
    client.query("use " + TEST_DATABASE);
    // create a default new page record with default background image of id 0
    let modSql = 'INSERT INTO raw_control_table (image1_id,guide_id) values (0,?);';
    let modSqlParams = [params.guide_id];
    client.query(modSql, modSqlParams);

    // if there are multiple processes inserting , this will still be thread-safe
    modSql = 'SELECT LAST_INSERT_ID();';
    modSqlParams = [];
    //return autoincrement
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                result = results[0]['LAST_INSERT_ID()']
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result.toString());
        });
};

let getGuideId=function(req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Select guide_id from raw_control_table where page_id = ?';
    let modSqlParams = [params.page_id];
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
                console.log('there is no record of this page_id');
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result.toString());
        });

};

let savePageAttribute=function (req, res, next) {
    let params = URL.parse(req.url, true).query;
    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Update raw_button_table set '+params.attribute_name+'=? where page_id =?';
    let modSqlParams = [params.page_id, params.attribute_value];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send("Success");
        });
};

let getPageAttribute=function(req, res, next) {
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'select '+params.attribute_name+' from raw_control_table where page_id = ?';
    let modSqlParams = [params.page_id];
    let result = '';
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results[0] !== undefined) {
                console.log(results);
                result = results[0][params.attribute_name]
            } else {
                console.log('there is no record of '+params.attribute_name);
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result.toString());
        });
};

router.get('/getPageAttribute', [getPageAttribute]);
router.get('/createBranchPage', [writePageDB]);

module.exports = {
    router,
    writePageDB
};
