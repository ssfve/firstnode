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
let fs = require('fs');
const { exec } = require('child_process');

const config = require('../config.json');
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
    res.send('respond with games resource');
});

module.exports = router;

router.get('/getGameInfo', function (req, res) {

    let game = new Game();
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT * FROM bggdatacn WHERE gameid = ?';
    if (params.lang === 'en') {
        modSql = 'SELECT * FROM bggdata WHERE gameid = ?';
    }
    let modSqlParams = [params.gameid];

    client.query(modSql, modSqlParams,
        function selectCb(err, results) {
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

router.get('/getStyleInfo', function (req, res, next) {

    let style = new Style();
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT * FROM style_table WHERE gameid = ?';
    let modSqlParams = [params.gameid];

    client.query(modSql, modSqlParams,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                style = results[0]
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(style));
        });
});


router.get('/getImageInfo', function (req, res) {

    let image = new Image();
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT * FROM image_table WHERE gameid = ? and pageType = ? and lineNum = ?';
    let modSqlParams = [params.gameid, params.pageType, params.lineNum];

    client.query(modSql, modSqlParams,
        function selectCb(err, results) {
            if (err) {
                throw err;
            }
            if (results) {
                image = results
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(image));
        });

});

router.get('/getTextInfo', function (req, res) {

    let text = new Text();
    let params = URL.parse(req.url, true).query;

    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT * FROM text_table WHERE gameid = ? and pageType = ? and lineNum = ?';
    let modSqlParams = [params.gameid, params.pageType, params.lineNum];

    client.query(modSql, modSqlParams,
        function selectCb(err, results) {
            if (err) {
                throw err;
            }
            if (results) {
                text = results[0]
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(text));
        });

});

router.get('/getPageLineNum', function (req, res) {

    let control = new Control();
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT lineNum,location,flag FROM control_table WHERE gameid = ? and pageType = ? order by lineNum';
    let modSqlParams = [params.gameid, params.pageType];

    client.query(modSql, modSqlParams,
        function selectCb(err, results) {
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

router.get('/selectPDFInfo', function (req, res) {

    let control = new Control();
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);

    let modSql = 'SELECT id_upload_data,search_name FROM upload_data WHERE approve_bit = 1 and uploaded_bit = 0 order by id_upload_data';
    let modSqlParams = [];

    client.query(modSql, modSqlParams,
        function selectCb(err, results) {
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

router.post('/savePDF', function (req, res) {
    console.log("upload started");
    let form = new formidable.IncomingForm();
    form.uploadDir = config.uploadDir;
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send({status: "200", responseType: "String", response: "success"})
    });

    form.on('file', function (field, file) {
        fs.rename(file.path, form.uploadDir + "/" + file.name)
    });

    form.on('progress', function (bytesReceived, bytesExpected) {
        //console.log(bytesReceived + '/' + bytesExpected + ' bytes')
    });
});

router.post('/saveTranslatePDF', function (req, res) {
    console.log("translate pdf upload started");
    let form = new formidable.IncomingForm();
    form.uploadDir = config.translateDir;
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send({status: "200", responseType: "String", response: "success"})
    });

    form.on('file', function (field, file) {
        fs.rename(file.path, form.uploadDir + "/" + file.name)
    });

    form.on('progress', function (bytesReceived, bytesExpected) {
        //console.log(bytesReceived + '/' + bytesExpected + ' bytes')
    });
});

router.post('/saveBackgroundImage', function (req, res) {
    console.log("upload started");
    let form = new formidable.IncomingForm();
    form.uploadDir = "/var/tmp/img";
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send({status: "200", responseType: "String", response: "success"})
    });

    form.on('fileBegin', function (field, file) {
        console.log(file.path);
    });

    form.on('file', function (field, file) {
        console.log(file.path);
        fs.rename(file.path, form.uploadDir + "/" + file.name);
        let command = 'python3 /home/ssfve/upload-linux/autoBlur.py ' + file.name;
        console.log(command);
        exec(command,
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    });

    form.on('progress', function (bytesReceived, bytesExpected) {
        //console.log("progress started");
        //console.log(bytesReceived + '/' + bytesExpected + ' bytes')
    });

    form.on('end',function() {});

});

router.get('/loadPDF', function (req, res) {
    let params = URL.parse(req.url, true).query;
    console.log("request to download " + params.name);
    res.download("/var/tmp/pdf/" + params.name);
});

router.delete('/deletePDF', function (req, res) {
    let params = URL.parse(req.url, true).query;
    console.log("request to delete " + params.name);
    fs.unlink("/var/tmp/pdf/" + params.name, function () {
        res.send({status: "200", responseType: "String", response: "success"})
    })
});

router.get('/savePDFInfo', function (req, res) {
    let control = new Control();
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);
    console.log(params.gstone_id);
    let modSql = 'INSERT INTO upload_pdf_table (mode_no,source_detail,gstone_id)' +
        ' values (?,?,?)';
    let modSqlParams = [params.mod_name, params.source_detail, params.gstone_id];

    client.query(modSql, modSqlParams,
        function selectCb(err, results) {
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

router.get('/approvePDFInfo', function (req, res) {
    let control = new Control();
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);
    let modSql = 'REPLACE INTO upload_data (id_upload_data,approve_bit,uploaded_bit,pdf_name,crop_len,rulebook_name,search_name,lang_name,source_name,source_detail)' +
        ' values (?,?,?,?,?,?,?,?,?,?)';
    let modSqlParams = [params.id, 1, 0, params.pdf_name, params.crop_len, params.rulebook_name, params.search_name, params.lang_name, params.source_name, params.source_detail];

    client.query(modSql, modSqlParams,
        function selectCb(err, results) {
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

router.get('/saveTranslateInfo', function (req, res) {
    let control = new Control();
    let params = URL.parse(req.url, true).query;
    client.query("use " + TEST_DATABASE);

    let modSql = 'INSERT INTO translate_data (translated_bit,pdf_name,receiver_email,upload_time)' +
        ' values (?,?,?,?)';
    let modSqlParams = [0, params.pdf_name, params.receiver_email, params.upload_time];

    client.query(modSql, modSqlParams,
        function selectCb(err, results) {
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