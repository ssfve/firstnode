let express = require('express');
let router = express.Router();
let URL = require('url');
let mysql = require('mysql');
//let Game = require('./game');
let Text = require('./text');
let db_page_api = require('./db-page-api');
let database = require('./database');
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
            if(results[0] !== undefined){
                res.locals.pageList = results[0]['page_list'];
                res.locals.result = results[0]['page_list'];
            }else{
                let result = {};
                res.send(JSON.stringify(result));
            }
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

let returnPageList = function (req, res, next) {
    // result = res.locals.result;
    let page_array = res.locals.result.split(',');
    const page_number = page_array.length;
    res.locals.index = 0;
    res.locals.list = {};
    let tempObj = {};

    // for the create new page item
    tempObj['page_id'] = 0;
    tempObj['image_id'] = 0;
    tempObj['text_content'] = '下一步';
    let counter_flag = res.locals.index;
    res.locals.list[counter_flag] = tempObj;
    res.locals.index = res.locals.index + 1;

    // for the delete switch item
    let myObj = {};
    myObj['page_id'] = 0;
    myObj['image_id'] = 1;
    myObj['text_content'] = '按钮将被删除';
    counter_flag = res.locals.index;
    res.locals.list[counter_flag] = myObj;
    res.locals.index = res.locals.index + 1;

    for(let key in page_array){
        let params = URL.parse(req.url, true).query;
        console.log(key);
        // key is just index
        console.log(page_array[key]);
        client.query("use " + TEST_DATABASE);
        let modSql = 'select a.page_id,' +
            'a.image1_id,' +
            'b.textContent ' +
            'from raw_control_table as a,' +
            'raw_text_table as b ' +
            'where a.text1_id=b.textID ' +
            'and a.page_id =?';
        let modSqlParams = [page_array[key]];

        client.query(modSql, modSqlParams,
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                let counter_flag = res.locals.index;
                console.log('counter_flag='+counter_flag);
                let tempObj = {};
                if(results[0] !== undefined){
                    tempObj['page_id'] = results[0]['page_id'];
                    tempObj['image_id']=results[0]['image1_id'];
                    tempObj['text_content']=results[0]['textContent'];
                    res.locals.list[counter_flag] = tempObj;
                }else{
                    tempObj['page_id'] = results[0]['page_id'];
                    tempObj['image_id']= results[0]['image1_id'];
                    tempObj['text_content']='请输入步骤描述';
                    res.locals.list[counter_flag] = tempObj;
                }
                res.locals.index = res.locals.index + 1;
                let pageList = res.locals.list;
                if (page_number === counter_flag-1){
                    console.log('going to send page list');
                    console.log(pageList);
                    res.send(JSON.stringify(pageList));
                }
            });
    }
};

let getUserGuideList = function (req, res, next) {
    let params = URL.parse(req.url, true).query;

    //client.connect();
    client.query("use " + TEST_DATABASE);
    let local_search_word = urlencode.decode(params.search_word);
    local_search_word = local_search_word.replace(new RegExp("\'","gm"),"\\\'");
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
    //let guide_name = Date.now();
    // user related feature later on
    let user_id = 0;
    let modSqlParams = [params.guide_name,user_id];
    client.query(modSql, modSqlParams);

    modSql = 'SELECT LAST_INSERT_ID();';
    modSqlParams = [];
    //return autoincrement
    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            let myObj = {};
            if (results[0] !== undefined) {
                myObj['guide_id'] = results[0]['LAST_INSERT_ID()'];
                myObj['guide_name'] = '我的最新一个流';
                myObj['root_page_id'] = 0;
                myObj['image1_id'] = 0;
                let guideObj = {};
                guideObj[0] = myObj;
                res.send(JSON.stringify(myObj));
            }else{
                res.send(JSON.stringify(myObj));
            }

        });

};

let getGuideList = function (req, res, next) {
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);
    //strip this search_word
    //let local_search_word = params.search_word.toString().replace('\'','');
    //console.log('search word is '+local_search_word);
    let local_search_word = urlencode.decode(params.search_word);
    // this is javascript replaceAll
    local_search_word = local_search_word.replace(new RegExp("\'","gm"),"\\\'");
    console.log('search word='+local_search_word);
    let modSql = 'select a.guide_id,' +
        'a.guide_name,' +
        'a.root_page_id,' +
        'b.image1_id from guide_table as a,raw_control_table as b ' +
        'where a.is_archived = 0 ' +
        'and a.root_page_id = b.page_id ' +
        'and a.guide_name like \'%'+local_search_word+'%\' ' +
        'limit 4';
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

let getGuideById = function (req, res, next) {
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);

    // only id
    let modSql = 'select a.guide_id,' +
        'a.guide_name,' +
        'a.root_page_id,' +
        'b.image1_id ' +
        'from guide_table as a,raw_control_table as b ' +
        'where a.is_archived = 0 ' +
        'and a.root_page_id = b.page_id ' +
        'and a.guide_id='+params.search_word;
    console.log(modSql);
    let modSqlParams = [];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if(results){
                //next()
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

let returnPageListFiltered = function (req, res, next) {
    // result = res.locals.result;
    let page_array = res.locals.result.split(',');
    const page_number = page_array.length;
    res.locals.index = 0;
    res.locals.list = {};

    for(let key in page_array){
        let params = URL.parse(req.url, true).query;
        console.log(key);
        // key is just index
        console.log(page_array[key]);
        client.query("use " + TEST_DATABASE);
        let modSql = 'select a.page_id,' +
            'a.image1_id,' +
            'b.textContent ' +
            'from raw_control_table as a,' +
            'raw_text_table as b ' +
            'where a.text1_id=b.textID ' +
            'and a.page_id =?';
        let modSqlParams = [page_array[key]];

        client.query(modSql, modSqlParams,
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                let counter_flag = res.locals.index;
                console.log('counter_flag='+counter_flag);
                let tempObj = {};
                if(results[0] !== undefined){
                    tempObj['page_id'] = results[0]['page_id'];
                    tempObj['image_id']=results[0]['image1_id'];
                    tempObj['text_content']=results[0]['textContent'];
                    res.locals.list[counter_flag] = tempObj;
                }else{
                    tempObj['page_id'] = results[0]['page_id'];
                    tempObj['image_id']= results[0]['image1_id'];
                    tempObj['text_content']='请输入步骤描述';
                    res.locals.list[counter_flag] = tempObj;
                }
                res.locals.index = res.locals.index + 1;
                let pageList = res.locals.list;
                if (page_number === counter_flag+1){
                    console.log('going to send page list');
                    console.log(pageList);
                    res.send(JSON.stringify(pageList));
                }
            });
    }
};

router.get('/writeGuideDB', [writeGuideDB]);
router.get('/checkRootPage', [checkRootPage, db_page_api.writePageDB]);
router.get('/saveRootPageId', [saveRootPageId]);
router.get('/savePageId', [getPageList, appendPageId, savePageListToGuide]);
router.get('/getPageList', [getPageList, returnPageList]);
router.get('/getPageListFiltered', [getPageList, returnPageListFiltered]);
router.get('/getUserGuideList', [getUserGuideList]);
router.get('/getGuideList', [getGuideList]);
router.get('/getGuideById', [getGuideById]);
router.get('/unlinkPageId', [getPageList, unlinkPageId, savePageListToGuide]);

module.exports = {
    router
};
