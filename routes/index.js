var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const fileUpload = require('express-fileupload');
router.use(fileUpload());
var Tesseract = require('tesseract.js');
const { request } = require('express');
var dateFormat = require('dateformat');
var JSAlert = require("js-alert");
var xyz;
var xyz1;
var xyz2;
var xyz3;
var xyz4;
var xyz5;
var kitap2;
var kitap3;
var kitapekle;
var kitapekle1;

/* GET home page. */
router.get('/', function(req, res, next) {



    res.render('index', { title: 'Express' });
});


var namex;
router.post('/', (req, res) => {
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "yazlab21"
    });
    var name = req.body.name;
    namex = name;
    var pass = req.body.pass;
    console.log('out=============' + name + ' ' + pass);
    let i = 0;

    if (name === undefined || name == '' || pass === undefined || pass === '') {
        res.render('yanlis');
    } else
        con.connect(function(err) {

            if (err) throw err;
            con.query(`SELECT * FROM users where name= '${name}' and password= '${pass}'`,
                function(err, result, fields) {
                    if (result.length > 0) {


                        console.log('result yeniiii ----------------->' + result[0].name);



                        console.log('name = ' + result[i].name);
                        if (result[0].rol === 'admin') {

                            res.render('admin');


                        } else
                        if (result[0].rol === 'user') {
                            res.render('user');

                        }

                    } else {
                        res.render('yanlis');
                    }
                });
        });

});
router.post('/upload', function(req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "yazlab21"
    });
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`../insertion1/public/images/${sampleFile.name}`, function(err) {
        if (err)
            return res.status(500).send(err);

    });
    //let src = cv.imread(`../insertion1/public/images/${sampleFile.name}`);
    //let dst = new cv.Mat();
    //cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    // You can try more different parameters
    //cv.adaptiveThreshold(src, dst, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 3, 2);
    //cv.imshow(`../insertion1/public/images/${sampleFile.name}`, dst);


    var txt = '';
    Tesseract.recognize(
        `http://localhost:3000/images/${sampleFile.name }`,
        'eng', { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log(text);
        kitapekle = text.substr(0, text.indexOf("\n"));
        kitapekle = kitapekle.substr(5);
        console.log(kitapekle);
        module.txt = text;


    });


    let sqlSorgusu = `INSERT INTO book_list(books) VALUES ('${kitapekle}')`;

    con.connect(function(err) {
        if (err) throw err;
        con.query(sqlSorgusu, function(err, results) {
            if (err) throw err.message;
            console.log('eklendi');


        });

    });

});
router.post('/changeDate', function(req, res, next) {
    var number = req.body.quantity;
    console.log(number);
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "yazlab21"
    });

    con.connect(function(err) {


        if (err) throw err;
        var sql =
            `update books set simdi_tarih = (SELECT INTERVAL ${number} DAY + simdi_tarih)`;

        con.query(sql, function(err, result, fields) {
            if (err) throw err;

        });
    });

});
router.post('/search', function(req, res, next) {

    var kitap = req.body.kitaparama;

    console.log(kitap);
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "yazlab21"
    });
    con.connect(function(err) {


        if (err) throw err;
        var sql1 =
            `SELECT books FROM book_list where books = '${kitap}'`;

        con.query(sql1, function(err, result, fields) {

            if (result.length > 0) {
                JSAlert.alert("kitap var");




            }


        });
    });





});
router.post('/kitap', function(req, res, next) {
    console.log(namex);
    var kitap1 = req.body.kitap;
    console.log(kitap1);
    var now = new Date();
    var c = dateFormat(now, "isoDate");

    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "yazlab21",
        multipleStatements: true
    });

    var sql1 =
        `SELECT books FROM book_list where books = '${kitap1}'`;

    con.query(sql1, function(err, result, fields) {

        if (result.length > 0) {
            JSAlert.alert("kitap var");
            xyz = true;


        } else
            xyz = false;

    });


    var sql2 =
        `SELECT kitap_adi FROM books where kitap_adi = '${kitap1}'`;

    con.query(sql2, function(err, result, fields) {

        if (result.length > 0) {
            JSAlert.alert("kitap var1");
            xyz1 = false;


        } else
            xyz1 = true;

    });


    var sql3 =
        `SELECT kitap_alan FROM books where kitap_alan = '${namex}'`;
    con.query(sql3, function(err, result, fields) {

        if (result.length < 3) {
            JSAlert.alert("kitap sayisi gecilmemis");
            xyz2 = true;

        } else
            xyz2 = false;

    });


    var sql4 =
        `SELECT aldigi_tarih,simdi_tarih FROM books WHERE (datediff(aldigi_tarih,simdi_tarih) > 7) `;

    con.query(sql4, function(err, result, fields) {

        if (result.length > 0) {
            JSAlert.alert("zaman gecmesi");
            xyz3 = false;

        } else
            xyz3 = true;

    });
    console.log(namex, kitap1, c, c);
    console.log(xyz, xyz1, xyz2, xyz3);


    if (xyz == true && xyz1 == true && xyz2 == true && xyz3 == true) {
        var sql6 = `INSERT INTO books(kitap_alan,kitap_adi,aldigi_tarih,simdi_tarih ) VALUES ('${namex}','${kitap1}','${c}','${c}')`;
        con.query(sql6, function(err, result, fields) {
            console.log("kitap alindi");

        });
        con.end();
    }

});

router.post('/kitapver', function(req, res, next) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "yazlab21"
    });
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`../insertion1/public/images/${sampleFile.name}`, function(err) {
        if (err)
            return res.status(500).send(err);

    });
    //let src = cv.imread(`../insertion1/public/images/${sampleFile.name}`);
    //let dst = new cv.Mat();
    //cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    // You can try more different parameters
    //cv.adaptiveThreshold(src, dst, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 3, 2);
    //cv.imshow(`../insertion1/public/images/${sampleFile.name}`, dst);


    var txt1 = '';
    Tesseract.recognize(
        `http://localhost:3000/images/${sampleFile.name }`,
        'eng', { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log(text);
        kitapekle1 = text.substr(0, text.indexOf("\n"));
        kitapekle1 = kitapekle1.substr(5);
        console.log(kitapekle1);
        module.txt1 = text;


    });
    var ss2 = `DELETE FROM books where kitap_adi = '${kitapekle1}' and kitap_alan = '${namex}'`;
    console.log(kitapekle1, namex);
    con.query(ss2, function(err, result, fields) {
        console.log("geri verildi");

    });


});

router.post('/list', function(req, res, next) {
    var isim = req.body.isim;
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "yazlab21",
        multipleStatements: true
    });
    let sql7 = `SELECT * FROM books where kitap_alan = '${isim}' `;
    con.query(sql7, function(err, result, fields) {

        if (result.length > 0) {
            console.log("control", result)
                //usersRows = JSON.parse(JSON.stringify(result));
                // console.log(usersRows);
            res.render('list_sonuc', { result: result })
        } else
            JSAlert.alert("sonuc yok");

    });

});




module.exports = router;