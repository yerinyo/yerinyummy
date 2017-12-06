var express = require('express');
var router = express.Router();
var Book = require('../models/book')


router.get('/', function(req, res, next) {
  res.render('index');
});


// GET ALL BOOKS
router.get('/get', function(req,res,next){
Book.find(function(err, books){
if(err) return res.status(500).send({error: 'database failure'});
res.render('get',  {items: []});
})
});

router.get('/registration', function(req,res,next){
Book.find(function(err, books){
if(err) return res.status(500).send({error: 'database failure'});
res.render('registration',  {items: []});
})
});


// CREATE BOOK
router.post('/insert', function(req, res,next){
var newBook = new Book();
newBook.title = req.body.title;
newBook.content = req.body.content;
newBook.author = req.body.author;

newBook.save(function(err){
if(err){
console.error(err);
res.json({result: 0});
return;
}
res.redirect('/');
});
});

// UPDATE THE BOOK

router.post('/update', function(req, res, next){
Book.update({ _id: req.body.id }, { $set: req.body }, function(err, output){
if(err) res.status(500).json({ error: "database failure" });
console.log(output);
if(!output.n) return res.status(404).json({ error: 'book not found' });
//res.json( { message: 'book updated' } );
res.redirect('/');
})
});

// DELETE BOOK

router.post('/delete', function(req, res, next){
Book.remove({ _id: req.body.id }, function(err, output){
if(err) return res.status(500).json({ error: "database failure" });
//res.status(204).end();
//res.json({ message: "book deleted" });
res.redirect('/');
})
});

module.exports = router;

