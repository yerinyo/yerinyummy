var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
	photo:String,
	name:String,
	address:String,
	phone:String,
	comments:String,
	score:String
});

module.exports = mongoose.model('book',bookSchema);
