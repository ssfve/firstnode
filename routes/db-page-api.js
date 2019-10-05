let express = require('express');
let router = express.Router();
let URL = require('url');
let mysql = require('mysql');
//let Game = require('./game');
let Text = require('./text');
let db_text_api = require('./db-text-api');

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

let writePageDB = function (req, res, next) {
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

let getGuideId = function (req, res, next) {
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

let savePageAttribute = function (req, res, next) {
    let params = URL.parse(req.url, true).query;
    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'Update raw_button_table set ' + params.attribute_name + '=? where page_id =?';
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

let getPageAttribute = function (req, res, next) {
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'select ' + params.attribute_name + ' from raw_control_table where page_id = ?';
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
                console.log('there is no record of ' + params.attribute_name);
            }
            if (result === null) {
                res.send(null);
            } else {
                res.send(result.toString());
            }
        });
};

let getButtonInfoFromPage = function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    // create a default new page record with default background image of id 0
    let modSql = 'Select button1_id,button2_id,button3_id,button4_id from raw_control_table where page_id=?';
    let modSqlParams = [params.page_id];
    let result = null;
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                result = results[0];
                console.log(result);
            }
            res.send(JSON.stringify(result));
        });
};

let getValidGuides = function (req, res, next) {
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);
    let modSql = 'select guide_id,guide_name from guide_table limit 4';
    let modSqlParams = [];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.send(JSON.stringify(results));
        });
};

let getPageButtonList = function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    // create a default new page record with default background image of id 0
    let modSql = 'Select button1_id,' +
        'button2_id,' +
        'button3_id,' +
        'button4_id from raw_control_table where page_id=?';
    let modSqlParams = [params.page_id];
    let result = null;
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                result = results[0];
                console.log(result);
                res.locals.result = result;
                next();
            }
        });
};

let getButtonText = function (req, res, next) {
    //var myJson = null;
    let buttonList = res.locals.result;
    res.locals.index = 0;
    res.locals.filtered = {};
    let key_array = Object.keys(buttonList);
    for (let i = 0; i < key_array.length; i++) {
        let key = key_array[i];
        let value = buttonList[key];
        //console.log(key);
        if (value === null) {
            console.log('null detected');
            console.log('no customized button text');
            console.log('button is not shown');
            //myJson.push({"name": value, "text": '下一步'});
        } else {
            console.log('querying button text');
            let modSql = 'Select button_text,to_page_id,image_id from raw_button_table where button_id=?';
            let modSqlParams = [value];
            let result = null;
            client.query(modSql, modSqlParams,
                function selectCb(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    let count_flag = res.locals.index + 1;
                    // {} is an object
                    let emptyObj = {};
                    if (results[0] !== undefined) {
                        let button_text_name = "button_text";
                        let button_to_name = "button_to";
                        let button_to_image_name = "button_to_image";
                        emptyObj[button_text_name] = results[0]['button_text'];
                        emptyObj[button_to_name] = results[0]['to_page_id'];
                        emptyObj[button_to_image_name] = results[0]['image_id'];
                        res.locals.filtered[count_flag]=emptyObj;
                    } else {
                        let button_text_name = "button_text";
                        console.log(button_text_name);
                        emptyObj[button_text_name] = '下一步';
                    }
                    res.locals.index = res.locals.index + 1;
                });
        }
    }
    res.send(JSON.stringify(res.locals.filtered));
};

let getCheckImageNewPage = function (req, res, next) {
    //var myJson = null;
    let buttonList = res.locals.result;
    let key_array = Object.keys(buttonList);
    for (let i = 0; i < key_array.length; i++) {
        let key = key_array[i];
        let value = buttonList[key];
        //console.log(key);
        res.locals.index = i;
        if (value === null) {
            console.log('null detected');
            console.log('no customized button text');
            console.log('button is not shown');
            //myJson.push({"name": value, "text": '下一步'});
        } else {
            console.log('querying button text');
            let modSql = 'Select button_text,to_page_id from raw_button_table where button_id=?';
            let modSqlParams = [value];
            let result = null;
            client.query(modSql, modSqlParams,
                function selectCb(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    let count_flag = res.locals.index + 1;
                    // {} is an object
                    let buttonList = res.locals.result;
                    if (results[0] !== undefined) {
                        let button_text_name = "button" + count_flag + "_text";
                        let button_to_name = "button" + count_flag + "_to";
                        console.log(button_text_name);
                        buttonList[button_text_name] = results[0]['button_text'];
                        buttonList[button_to_name] = results[0]['to_page_id'];
                    } else {
                        let button_text_name = "button" + count_flag + "_text";
                        console.log(button_text_name);
                        buttonList[button_text_name] = '下一步';
                    }
                    res.locals.result = buttonList;
                });
        }
    }
    next()
};

router.get('/getButtonInfoFromPage', [getButtonInfoFromPage]);
router.get('/getPageButtonList', [getPageButtonList, getButtonText]);
router.get('/getPageAttribute', [getPageAttribute]);
router.get('/createBranchPage', [writePageDB]);
router.get('/getValidGuides', [getValidGuides]);

module.exports = {
    router,
    writePageDB,
};
