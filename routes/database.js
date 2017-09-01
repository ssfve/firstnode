var express = require('express');
var router = express.Router();
var URL = require('url')
var mysql = require('mysql');
//var Game = require('./game');
var Text = require('./text');

/* GET users listing. */
var TEST_DATABASE = 'boardgames';
var TEST_TABLE = 'bggdatacn';

/*
var client = mysql.createConnection({
    host: '127.0.0.1',
    user:'root',
    password:'b0@rdg@merule5',
    port: '3306',
});
*/
var client = mysql.createConnection({
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

    var game = new Game();
    var params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);

    var lang = [params.lang];

    if (lang == 'cn'){
        var modSql = 'SELECT * FROM bggdatacn WHERE gameid = ?';
    }
    if (lang == 'en'){
        var modSql = 'SELECT * FROM bggdata WHERE gameid = ?';
    }
    var modSqlParams = [params.gameid];

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

    var text = new Text();
    var params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    var flag = 'txt'
    var location = 0
    var modSql = 'REPLACE INTO text_table (textID, text_content, gameid, pageType, lineNum, location) values (?,?,?,?,?,?)';

    var textID = params.gameid + '_' + params.pageType + '_' + flag + '_' + params.lineNum + '_' + location;

    //console.log(textID);
    //console.log(params.text);
    //console.log(params.gameid);
    //console.log(params.pageType);
    //console.log(params.location);

    var modSqlParams = [textID, params.text, params.gameid, params.pageType, params.lineNum, location];

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

    var text = new Text();
    var params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    var flag = 'img'
    //var location = 0
    var modSql = 'REPLACE INTO img_table (textID, text_content, gameid, pageType, lineNum, location) values (?,?,?,?,?,?)';

    var textID = params.gameid + '_' + params.pageType + '_' + flag + '_' + params.lineNum + '_' + params.location;

    //console.log(textID);
    //console.log(params.text);
    //console.log(params.gameid);
    //console.log(params.pageType);
    //console.log(params.location);

    var modSqlParams = [textID, params.text, params.gameid, params.pageType, params.lineNum, location];

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

    var text = new Text();
    var params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    var flag = 'txt'
    var location = 0
    var modSql = 'REPLACE INTO control_table (textID, text_content, gameid, pageType, lineNum, location) values (?,?,?,?,?,?)';

    var textID = params.gameid + '_' + params.pageType + '_' + flag + '_' + params.lineNum + '_' + location;

    //console.log(textID);
    //console.log(params.text);
    //console.log(params.gameid);
    //console.log(params.pageType);
    //console.log(params.location);

    var modSqlParams = [textID, params.text, params.gameid, params.pageType, params.lineNum, location];

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

    var text = new Text();
    var params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    var flag = 'txt'
    var location = 0
    var modSql = 'REPLACE INTO control_table (textID, text_content, gameid, pageType, lineNum, location) values (?,?,?,?,?,?)';

    var textID = params.gameid + '_' + params.pageType + '_' + flag + '_' + params.lineNum + '_' + location;

    //console.log(textID);
    //console.log(params.text);
    //console.log(params.gameid);
    //console.log(params.pageType);
    //console.log(params.location);

    //var modSqlParams = ['''', params.text, params.gameid, params.pageType, params.lineNum, location];
    var modSqlParams = ['','','','','',''];

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