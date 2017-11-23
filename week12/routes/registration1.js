var express = require('express');
var router = express.Router();
var Book = require('../models/book');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('registration', {items:[]});
});



// CREATE BOOK
router.post('/insert', function(req, res,next){
var newBook = new Book();
newBook.name= req.body.name;
newBook.address = req.body.address;
newBook.phone = req.body.phone;
newBook.comments= req.body.comments;
newBook.score = req.body.score;

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
