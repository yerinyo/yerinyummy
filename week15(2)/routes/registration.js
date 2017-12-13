var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var app = express();
var mongojs = require('mongojs'); // MongoDB ���� �ؾߵǴ� MongoJS ��⵵ �߰�
var db = mongojs('genie', ['images']); // ���⼭ genie�� database �̸��̰� images���̺��� ����Ҳ���� ����
var bodyParser = require('body-parser'); // json ���·� �Ľ��Ҳ��ϱ� ��� �߰�
var formidable = require('formidable'); // form �±� �����͵��� �������� ���
var fs = require('fs-extra'); // ������ �����ϰų� ���丮 �����ϴ� ���
var _id = "";

app.use(express.static(__dirname + '/public')); //public ���� �ȿ� javascript ���ϰ� css������ ��Ƶ� ����
app.use(bodyParser.json()); // body-parser ����� ����ؼ� �Ľ� ����
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views'); // ejs ���ϵ��� �����ϱ� ���� ��� �߰�����
app.set('view engine', 'ejs'); // ejs�� html�� �ٲ��ָ� html�� ���� ����˴ϴ�.



router.get('/', function(req, res) {
res.render('registration', {items:[]});
});

// GET ALL BOOKS
router.get('/get', function(req,res,next){
Book.find(function(err, books){
if(err) return res.status(500).send({error: 'database failure'});
res.render('get', {items:books});
})
});

router.get('/home', function(req,res,next){
Book.find(function(err, books){
if(err) return res.status(500).send({error: 'database failure'});
res.render('home');
})
});



// GET ALL BOOKS
router.get('/get-from-android', function(req,res){
Book.find(function(err, books){
res.send(books);
})
});



/* GET home page. */
router.get('/go/resources/images/name/:something', function(req, res) {
	var reqsomething = req.params.something;
	res.render('registration', {data:reqsomething});
});

// CREATE BOOK
router.post('/registration', function(req, res,next){
var newBook = new Book();
newBook.photo= req.body.photo;
newBook.name = req.body.name;
newBook.address= req.body.address;
newBook.phone = req.body.phone;
newBook.comments = req.body.comments;
newBook.score = req.body.score;

newBook.save(function(err){
if(err){
console.error(err);
res.redirect('/');
}
res.redirect('/get');
});
});





router.get('/get/:_id', function(req, res){
	var _id = req.params._id;
	Book.findOne({"_id" : _id}, function(err, books){
		if(err) throw err;
		res.render('getdetail',{items:books}); // db���� ������ ������ ��� ����??
    })
});



router.post('/get/:_id/reply', function(req, res){
      	var _id = req.body._id;
	var person = req.body.person;
	var memo = req.body.memo;
	addComment(_id, person, memo);
	res.redirect('/get');
});

router.post('/get/:_id/reservation', function(req, res){
      	var _id = req.body._id;
	var dbman= req.body.dbman;
	var dbmany=req.body.dbmany;
	var dbwhen=req.body.dbwhen;
	var dbtime=req.body.dbtime;
      addReservation(_id, dbman, dbmany, dbwhen, dbtime);
    res.redirect('/get');
});


module.exports = router;

function addReservation(_id, man , many, when, time) {
    Book.findOne({"_id": _id}, function(err, books){
        if(err) throw err;
        books.reservation.unshift({dbman:man, dbmany: many, dbwhen:when, dbtime:time});
        books.save(function(err){
            if(err) throw err;
        });
    });
}

function addComment(_id, writer , comment ) {
    Book.findOne({"_id": _id}, function(err, books){
        if(err) throw err;
        books.reply.unshift({person:writer, memo: comment});
        books.save(function(err){
            if(err) throw err;
        });
    });
}