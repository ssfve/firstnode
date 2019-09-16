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

module.exports = router;


router.get('/getGameInfo', function (req, res, next) {

    let game = new Game();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);

    let lang = [params.lang];

    if (lang === 'cn') {
        let modSql = 'SELECT * FROM bggdatacn WHERE gameid = ?';
    }
    if (lang === 'en') {
        let modSql = 'SELECT * FROM bggdata WHERE gameid = ?';
    }
    let modSqlParams = [params.gameid];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                game = results[0]
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(game));
        });
});

router.get('/writeTextDB', function (req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let flag = 'txt';
    let location = 0;
    let modSql = 'REPLACE INTO text_table (textID, text_content, gameid, pageType, lineNum, location) values (?,?,?,?,?,?)';
    let textID = params.gameid + '_' + params.pageType + '_' + flag + '_' + params.lineNum + '_' + location;
    let modSqlParams = [textID, params.text, params.gameid, params.pageType, params.lineNum, location];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send("Success");
        });

});

router.get('/writeImgDB', function (req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let flag = 'img';
    //let location = 0
    let modSql = 'REPLACE INTO image_table (image_id, image_path, guide_id, page_id, location) values (?,?,?,?,?,?)';
    let imageID = params.gameid + '_' + params.pageType + '_' + flag + '_' + params.lineNum + '_' + params.location;
    let modSqlParams = [imageID, params.path, params.gameid, params.pageType, params.lineNum, params.location];

    //console.log('hello');
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send("Success");
        });

});

router.get('/writeGuideDB', function (req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let modSql = 'INSERT INTO guide_table (guide_name) values (?)';
    // TODO: get guide name from user
    let guide_name = Date.now();
    let modSqlParams = [guide_name];
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
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result.toString());
        });

});

let getButtonInfo=function(req, res, next) {
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
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result.toString());
        });
};

let checkRootPage=function(req, res, next) {
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

let writePageDB=function(req, res, next){
    let text = new Text();
    let params = URL.parse(req.url, true).query;
    //client.connect();
    client.query("use " + TEST_DATABASE);
    // create a default new page record with default background image of id 0
    let modSql = 'INSERT INTO raw_control_table (image1_id) values (0);';
    let modSqlParams = [];
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

let saveRootPageId=function (req, res, next) {
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

let getPageList=function(req, res, next) {
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
            //console.log('page_list is '+res.locals.pageList);
            next();
        });

};

let appendPageId=function(req, res, next) {
    let params = URL.parse(req.url, true).query;
    if (res.locals.pageList != null){
        res.locals.pageList += ','+params.page_id;
    }else{
        res.locals.pageList = params.page_id.toString();
    }
    console.log('page list is now '+res.locals.pageList);
    next();
};

let savePageList=function (req, res, next) {
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

router.get('/checkRootPage', [checkRootPage, writePageDB]);
router.get('/writePageDB', [writePageDB]);

router.get('/saveRootPageId', [saveRootPageId]);
router.get('/savePageId', [getPageList, appendPageId, savePageList]);
router.get('/getButtonInfo', [getButtonInfo]);


router.get('/writeControlDB', function (req, res, next) {
    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    //let flag = 'txt'
    let location = 0;
    let modSql = 'REPLACE INTO control_table (segmentID, gameid, pageType, lineNum, location, flag) values (?,?,?,?,?,?)';
    let segmentID = params.gameid + '_' + params.pageType + '_' + params.lineNum + '_' + params.flag;
    let modSqlParams = [segmentID, params.gameid, params.pageType, params.lineNum, location, params.flag];

    //console.log('hello');
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send("Success");
        });

});

router.get('/delControlDB', function (req, res, next) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    //let flag = 'txt'
    let location = 0;
    let modSql = 'delete from control_table where segmentID = ? and gameid = ? and pageType = ? and lineNum = ? and location = ? and flag = ?';

    let segmentID = params.gameid + '_' + params.pageType + '_' + params.lineNum + '_' + params.flag;
    let modSqlParams = [segmentID, params.gameid, params.pageType, params.lineNum, location, params.flag];
    //let modSqlParams = ['','','','','',''];

    //console.log('hello');
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                result = results[0]
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result);
        });

});


router.get('/delImgDB', function (req, res, next) {

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
            if (err) {
                throw err;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send("Success");
        });

});

router.get('/getEntryInProgress', function (req, res, next) {
    let modSql = 'select gstone_id from upload_pdf_table where uploaded_bit = 0';
    logger.info("in getEntryInProgress");
    let modSqlParams = [];

    client.query(USE_SCHEMA);
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                result = results
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result);
            logger.info(JSON.stringify(result));
        });
});

router.get('/getSubPageUrl', function (req, res, next) {
    let modSql = 'select url from mapping_gameid_jingyan where url_id = ?';
    logger.info("in getSubPageUrl");
    let params = URL.parse(req.url, true).query;
    logger.info(params.gameid);
    logger.info(params.pageno);
    let url_id = params.gameid + "_" + params.pageno;
    let modSqlParams = [url_id];

    client.query(USE_SCHEMA);
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                result = results[0]
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(result));
            logger.info(JSON.stringify(result));
        });
});

router.get('/getIfHasSubPage', function (req, res, next) {
    let modSql = 'select count(*) from mapping_gameid_jingyan where gameid = ?';
    logger.info("in getIfHasSubPage");
    let params = URL.parse(req.url, true).query;
    logger.info(params.gameid);
    let modSqlParams = [params.gameid];

    client.query(USE_SCHEMA);
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                result = results[0];
                logger.info(result["count(*)"]);
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.send(JSON.stringify(result["count(*)"]));
            }
        });
});