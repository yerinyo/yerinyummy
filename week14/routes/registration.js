var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var app = express();
var mongojs = require('mongojs'); // MongoDB ���� �ؾߵǴ� MongoJS ��⵵ �߰�
var db = mongojs('genie', ['images']); // ���⼭ genie�� database �̸��̰� images���̺��� ����Ҳ���� ����
var bodyParser = require('body-parser'); // json ���·� �Ľ��Ҳ��ϱ� ��� �߰�
var formidable = require('formidable'); // form �±� �����͵��� �������� ���
var fs = require('fs-extra'); // ������ �����ϰų� ���丮 �����ϴ� ���

app.use(express.static(__dirname + '/public')); //public ���� �ȿ� javascript ���ϰ� css������ ��Ƶ� ����
app.use(bodyParser.json()); // body-parser ����� ����ؼ� �Ľ� ����
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views'); // ejs ���ϵ��� �����ϱ� ���� ��� �߰�����
app.set('view engine', 'ejs'); // ejs�� html�� �ٲ��ָ� html�� ���� ����˴ϴ�.











// GET ALL BOOKS
router.get('/get', function(req,res,next){
Book.find(function(err, books){
if(err) return res.status(500).send({error: 'database failure'});
res.render('get', {items:books});
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
            res.render('getdetail',{items:books}); // db���� ������ ������ ��� ������
    })
});





 //UPDATE THE BOOK
router.post('/get/:_id', function(req, res){
      	var _id = req.body._id;
	var person = req.body.person;
	var memo = req.body.memo;
      addComment(_id, person, memo);
    res.redirect('/get');
});



// DELETE BOOK

//router.post('/delete', function(req, res, next){
//Book.remove({ _id: req.body.id }, function(err, output){
//if(err) return res.status(500).json({ error: "database failure" });
////res.status(204).end();
////res.json({ message: "book deleted" });
//res.redirect('/');
//})
//});

module.exports = router;



function addComment(_id, writer , comment) {
    Book.findOne({"_id": _id}, function(err, books){
        if(err) throw err;
        books.reply.unshift({person:writer, memo: comment});
        books.save(function(err){
            if(err) throw err;
        });
    });
}