let express = require('express');
let router = express.Router();
let URL = require('url');
let mysql = require('mysql');
//let Game = require('./game');
let Text = require('./text');
let db_page_api = require('./db-page-api');
const urlencode = require('urlencode');

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
            res.send("Success");
        });

};

let returnAnyResult = function (req, res, next) {
    result = res.locals.result;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify(result));
};

let getUserGuideList = function (req, res, next) {
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let local_search_word = urlencode.decode(params.search_word).replace("\'","\\\'");
    console.log('search word='+local_search_word);
    let modSql = 'select guide_id,guide_name from guide_table where is_archived = 0 and creator=? and guide_name like \'%'+local_search_word+'%\' limit 4';
    let modSqlParams = [params.user_id];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if(results){
                res.send(JSON.stringify(results));
            }
        });

};


let writeGuideDB = function (req, res, next) {
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);
    let modSql = 'INSERT INTO guide_table (guide_name,creator) values (?,?)';
    // TODO: get guide name from user
    let guide_name = Date.now();
    let modSqlParams = [guide_name,params.user_id];
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
            res.send(result.toString());
        });

};

let getGuideList = function (req, res, next) {
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);
    //strip this search_word
    //let local_search_word = params.search_word.toString().replace('\'','');
    //console.log('search word is '+local_search_word);
    let local_search_word = urlencode.decode(params.search_word).replace("\'","\\\'");
    console.log('search word='+local_search_word);
    let modSql = 'select guide_id,guide_name from guide_table where is_archived = 0 and guide_name like \'%'+local_search_word+'%\' limit 4';
    console.log(modSql);
    let modSqlParams = [];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if(results){
                res.send(JSON.stringify(results));
            }
        });

};

let unlinkPageId = function (req, res, next) {
    let params = URL.parse(req.url, true).query;
    let pageList = res.locals.pageList;
    if (pageList != null) {
        pageList += ',';
        pageList = pageList.replace(params.page_id.toString(),'');
        let length = pageList.length;
        if (pageList.substr(pageList.length-1, 1) === ','){
            pageList = pageList.substr(0,pageList.length-2)
        }
        console.log('page list is now ' + pageList);
        // save back new page list
        res.locals.pageList = pageList;
    } else {
        console.log('fatal error: page_list shall not be null in this situation');
    }
    next();
};

router.get('/writeGuideDB', [writeGuideDB]);
router.get('/checkRootPage', [checkRootPage, db_page_api.writePageDB]);
router.get('/saveRootPageId', [saveRootPageId]);
router.get('/savePageId', [getPageList, appendPageId, savePageListToGuide]);
router.get('/getPageList', [getPageList, returnAnyResult]);
router.get('/getUserGuideList', [getUserGuideList]);
router.get('/getGuideList', [getGuideList]);
router.get('/unlinkPageId', [getPageList, unlinkPageId, savePageListToGuide]);

module.exports = {
    router
};
