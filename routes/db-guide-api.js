let express = require('express');
let router = express.Router();
let URL = require('url');
let mysql = require('mysql');
//let Game = require('./game');
let Text = require('./text');
let db_page_api = require('./db-page-api');

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

let checkRootPage = function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    // create a default new page record with default background image of id 0
    let modSql = 'Select root_page_id from guide_table where guide_id=?';
    let modSqlParams = [params.guide_id];
    let result = null;
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                result = results[0]['root_page_id'];
                console.log('root_page_id is ' + result);
            }
            if (result != null) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.send(result.toString());
            } else {
                next();
            }
        });
};

let saveRootPageId = function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Update guide_table set root_page_id=? where guide_id =?';
    let modSqlParams = [params.page_id, params.guide_id];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send("Success");
        });

};

let getPageList = function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Select page_list from guide_table where guide_id = ?';
    let modSqlParams = [params.guide_id];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.locals.pageList = results[0]['page_list'];
            res.locals.result = results[0]['page_list'];
            //console.log('page_list is '+res.locals.pageList);
            next();
        });

};

let appendPageId = function (req, res, next) {
    let params = URL.parse(req.url, true).query;
    if (res.locals.pageList != null) {
        res.locals.pageList += ',' + params.page_id;
    } else {
        res.locals.pageList = params.page_id.toString();
    }
    console.log('page list is now ' + res.locals.pageList);
    next();
};

let savePageListToGuide = function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Update guide_table set page_list=? where guide_id =?';
    let modSqlParams = [res.locals.pageList, params.guide_id];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send("Success");
        });

};

let returnAnyResult = function (req, res, next) {
    result = res.locals.result;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify(result));
};

router.get('/checkRootPage', [checkRootPage, db_page_api.writePageDB]);
router.get('/saveRootPageId', [saveRootPageId]);
router.get('/savePageId', [getPageList, appendPageId, savePageListToGuide]);
router.get('/getPageList', [getPageList, returnAnyResult]);

module.exports = {
    router
};
