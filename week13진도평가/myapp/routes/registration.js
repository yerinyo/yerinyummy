var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var app = express();


/* GET home page. */
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