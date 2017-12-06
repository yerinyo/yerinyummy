var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var app = express();
var mongojs = require('mongojs'); // MongoDB 연결 해야되니 MongoJS 모듈도 추가
var db = mongojs('genie', ['images']); // 여기서 genie는 database 이름이고 images테이블을 사용할꺼라고 선언
var bodyParser = require('body-parser'); // json 형태로 파싱할꺼니까 모듈 추가
var formidable = require('formidable'); // form 태그 데이터들을 가져오는 모듈
var fs = require('fs-extra'); // 파일을 복사하거나 디렉토리 복사하는 모듈

app.use(express.static(__dirname + '/public')); //public 폴더 안에 javascript 파일과 css파일을 모아둘 예정
app.use(bodyParser.json()); // body-parser 모듈을 사용해서 파싱 해줌
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views'); // ejs 파일들을 저장하기 위해 경로 추가했음
app.set('view engine', 'ejs'); // ejs를 html로 바꿔주면 html로 파일 실행됩니다.











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
            res.render('getdetail',{items:books}); // db에서 가져온 내용을 뷰로 렌더링
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