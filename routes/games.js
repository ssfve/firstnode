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
    res.send('respond with a resource');
});

module.exports = router;


router.get('/getGameInfo', function (req, res, next) {

    let game = new Game();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);

    let lang = [params.lang];

    if (lang == 'cn') {
        let modSql = 'SELECT * FROM bggdatacn WHERE gameid = ?';
    }
    if (lang == 'en') {
        let modSql = 'SELECT * FROM bggdata WHERE gameid = ?';
    }
    let modSqlParams = [params.gameid];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            //console.log(results)
            //console.log(results[0].age)
            if (results) {
                game = results[0]
            }

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(game));
            //console.log(game)
            //console.log(game.age)
            //client.end();
        });
});

router.get('/getStyleInfo', function (req, res, next) {

    let style = new Style();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT * FROM style_table WHERE gameid = ?';
    let modSqlParams = [params.gameid];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            //console.log(results)
            //console.log(results[0].age)
            if (results) {
                style = results[0]
            }

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(style));
            //console.log(game)
            //console.log(game.age)
            //client.end();
        });

});


router.get('/getImageInfo', function (req, res, next) {

    let image = new Image();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT * FROM image_table WHERE gameid = ? and pageType = ? and lineNum = ?';
    let modSqlParams = [params.gameid, params.pageType, params.lineNum];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            //console.log(results)
            //console.log(results[0].age)
            if (results) {
                image = results
            }

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(image));
            //console.log(game)
            //console.log(game.age)
            //client.end();
        });

});

router.get('/getTextInfo', function (req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT * FROM text_table WHERE gameid = ? and pageType = ? and lineNum = ?';
    let modSqlParams = [params.gameid, params.pageType, params.lineNum];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            //console.log(results)
            //console.log(results[0].age)
            if (results) {
                text = results[0]
            }

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(text));
            //console.log(game)
            //console.log(game.age)
            //client.end();
        });

});

router.get('/getPageLineNum', function (req, res, next) {

    let control = new Control();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT lineNum,location,flag FROM control_table WHERE gameid = ? and pageType = ? order by lineNum';
    let modSqlParams = [params.gameid, params.pageType];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            //console.log(results)
            //console.log(results[0].age)
            if (results) {
                control = results
            }

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(control));
            //console.log(game)
            //console.log(game.age)
            //client.end();
        });

});

router.get('/savePDF', {encoding: 'binary'}, function (req, res) {

    let form = new formidable.IncomingForm();
    form.uploadDir = "/var/tmp/pdf";
    form.keepExtensions = true;
    form.maxFileSize = 100 * 1024 * 1024;
    form.parse(req, function(err, fields, files){
        res.writeHead(200,{'content-type':'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields:fields,files:files}));
    });

});

router.get('/savePDFinfo', function (req, res, next) {

    let control = new Control();
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);
    let modSql = 'SELECT lineNum,location,flag FROM control_table WHERE gameid = ? and pageType = ? order by lineNum';
    let modSqlParams = [params.gameid, params.pageType];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                control = results
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(control));
        });

});