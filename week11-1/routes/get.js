var express = require('express');
var router = express.Router();
var Book = require('../models/book');


router.get('/', function(req,res,next){
Book.find(function(err, books){
if(err) return res.status(500).send({error: 'database failure'});
res.render('get', {items: books});
})
});

module.exports = router;
