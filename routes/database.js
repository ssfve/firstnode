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

let log = require('../log4js.js');
console.log(typeof log);
//let client = mysql.createConnection({
//    host: '127.0.0.1',
//    user:'root',
//    password:'b0@rdg@merule5',
//    port: '3306',
//});
let client = mysql.createConnection({
    host: '127.0.0.1',
    user:'mysql',
    password:'MyNewPass4!',
    port: '3306',
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;


router.get('/getGameInfo', function(req, res, next) {

    let game = new Game();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);

    let lang = [params.lang];

    if (lang === 'cn'){
        let modSql = 'SELECT * FROM bggdatacn WHERE gameid = ?';
    }
    if (lang === 'en'){
        let modSql = 'SELECT * FROM bggdata WHERE gameid = ?';
    }
    let modSqlParams = [params.gameid];

    client.query(modSql, modSqlParams,
    function selectCb(err, results, fields) {
        if (err) {throw err;}
        //console.log(results)
        //console.log(results[0].age)
        if(results)
        {
            game = results[0]
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(JSON.stringify(game));
        //console.log(game)
        //console.log(game.age)
        //client.end();
    });
});

router.get('/writeTextDB', function(req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let flag = 'txt';
    let location = 0;
    let modSql = 'REPLACE INTO text_table (textID, text_content, gameid, pageType, lineNum, location) values (?,?,?,?,?,?)';

    let textID = params.gameid + '_' + params.pageType + '_' + flag + '_' + params.lineNum + '_' + location;

    //console.log(textID);
    //console.log(params.text);
    //console.log(params.gameid);
    //console.log(params.pageType);
    //console.log(params.location);

    let modSqlParams = [textID, params.text, params.gameid, params.pageType, params.lineNum, location];

    //console.log('hello');
    client.query(modSql, modSqlParams,
    function selectCb(err, results, fields) {
        if (err) {throw err;}
        //console.log(results)
        //console.log(results[0].age)
        //if(results){style = results[0]}

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send("Success");
        //console.log(game)
        //console.log(game.age)
        //client.end();
    });

});

router.get('/writeImgDB', function(req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let flag = 'img';
    //let location = 0
    let modSql = 'REPLACE INTO image_table (imageID, image_path, gameid, pageType, lineNum, location) values (?,?,?,?,?,?)';

    let imageID = params.gameid + '_' + params.pageType + '_' + flag + '_' + params.lineNum + '_' + params.location;

    //console.log(textID);
    //console.log(params.text);
    //console.log(params.gameid);
    //console.log(params.pageType);
    //console.log(params.location);

    let modSqlParams = [imageID, params.path, params.gameid, params.pageType, params.lineNum, params.location];

    //console.log('hello');
    client.query(modSql, modSqlParams,
    function selectCb(err, results, fields) {
        if (err) {throw err;}
        //console.log(results)
        //console.log(results[0].age)
        //if(results){style = results[0]}

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send("Success");
        //console.log(game)
        //console.log(game.age)
        //client.end();
    });

});

router.get('/writeControlDB', function(req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    //let flag = 'txt'
    let location = 0;
    let modSql = 'REPLACE INTO control_table (segmentID, gameid, pageType, lineNum, location, flag) values (?,?,?,?,?,?)';

    let segmentID = params.gameid + '_' + params.pageType + '_' + params.lineNum + '_' + params.flag

    //console.log(textID);
    //console.log(params.text);
    //console.log(params.gameid);
    //console.log(params.pageType);
    //console.log(params.location);

    let modSqlParams = [segmentID, params.gameid, params.pageType, params.lineNum, location, params.flag];

    //console.log('hello');
    client.query(modSql, modSqlParams,
    function selectCb(err, results, fields) {
        if (err) {throw err;}
        //console.log(results)
        //console.log(results[0].age)
        //if(results){style = results[0]}

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send("Success");
        //console.log(game)
        //console.log(game.age)
        //client.end();
    });

});

router.get('/delControlDB', function(req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    //let flag = 'txt'
    let location = 0;
    let modSql = 'delete from control_table where segmentID = ? and gameid = ? and pageType = ? and lineNum = ? and location = ? and flag = ?';

    let segmentID = params.gameid + '_' + params.pageType + '_' + params.lineNum + '_' + params.flag;

    //console.log(textID);
    //console.log(params.text);
    //console.log(params.gameid);
    //console.log(params.pageType);
    //console.log(params.location);

    let modSqlParams = [segmentID, params.gameid, params.pageType, params.lineNum, location, params.flag];
    //let modSqlParams = ['','','','','',''];

    //console.log('hello');
    client.query(modSql, modSqlParams,
    function selectCb(err, results, fields) {
        if (err) {throw err;}
        //console.log(results)
        //console.log(results[0].age)
        //if(results){style = results[0]}

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send("Success");
        //console.log(game)
        //console.log(game.age)
        //client.end();
    });

});


router.get('/delImgDB', function(req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    //let flag = 'txt'
    let location = 0;
    let modSql = 'delete from image_table where gameid = ? and pageType = ?';

    //let segmentID = params.gameid + '_' + params.pageType + '_' + params.lineNum + '_' + params.flag;
    let modSqlParams = [params.gameid, params.pageType];
    //let modSqlParams = ['','','','','',''];
    //console.log('hello');
    client.query(modSql, modSqlParams,
    function selectCb(err, results, fields) {
        if (err) {throw err;}
        //console.log(results)
        //console.log(results[0].age)
        //if(results){style = results[0]}
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send("Success");
        //console.log(game)
        //console.log(game.age)
        //client.end();
    });

});

router.get('/getSubPageUrl', function(req, res, next) {
    let modSql = 'select url from mapping_gameid_jingyan where url_id = ?';
    console.log("in getSubPageUrl");
    let params = URL.parse(req.url, true).query;
    //console.log(params.gameid);
    //console.log(params.pageno);
    var logger = log('ruleFile');
    //log.info
    logger.info(params.pageid);
    logger.info(params.pageno);
    let url_id = params.gameid+"_"+params.pageno;
    let modSqlParams = [url_id];

    client.query(USE_SCHEMA);
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {throw err;}
            if(results) {result = results[0]}
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(result));
        });

});