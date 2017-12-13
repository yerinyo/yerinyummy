var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
	photo:String,
	name:String,
	address:String,
	phone:String,
	comments:String,
	score:String,
	reply:[{
	  person:String,
	memo:String
	}],
	reservation:[{
	dbman:String,
	dbmany:String,
	dbwhen:String
	}]
});

module.exports = mongoose.model('book',bookSchema);
