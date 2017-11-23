var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var index = require('./routes/index');



/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home');
});

module.exports = router;
