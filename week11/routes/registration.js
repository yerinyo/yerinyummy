var express = require('express');
var router = express.Router();
var Book = require('../models/book');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('registration');
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








module.exports = router;
