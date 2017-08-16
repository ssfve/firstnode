var express = require('express');
var router = express.Router();
var URL = require('url')
var mysql = require('mysql');
var Style = require('./style');

/* GET users listing. */
var TEST_DATABASE = 'boardgames';
var TEST_TABLE = 'style_table';

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


router.get('/getStyleInfo', function(req, res, next) {

    var style = new Style();
    var params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);

    var modSql = 'SELECT * FROM '+TEST_TABLE+' WHERE gameid = ?';
    var modSqlParams = [params.gameid];

    client.query(modSql, modSqlParams,
    function selectCb(err, results, fields) {
        if (err) {throw err;}
        //console.log(results)
        //console.log(results[0].age)
        if(results)
        {
            style = results[0]
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(JSON.stringify(style));
        //console.log(game)
        //console.log(game.age)
        //client.end();
    }
    );
    //console.log(game)
    //res.send(JSON.stringify(game));
    //console.log(response)
    //res.send(result);
    //res.send(field);


});




