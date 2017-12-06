var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var app = express();
var mongojs = require('mongojs'); // MongoDB ���� �ؾߵǴ� MongoJS ��⵵ �߰�
var db = mongojs('genie', ['images']); // ���⼭ genie�� database �̸��̰� images���̺��� ����Ҳ���� ����
var bodyParser = require('body-parser'); // json ���·� �Ľ��Ҳ��ϱ� ��� �߰�
var formidable = require('formidable'); // form �±� �����͵��� �������� ���
var fs = require('fs-extra'); // ������ �����ϰų� ���丮 �����ϴ� ���



var token = "AAAANxMzrFlLrOlvym6zSPrEu1yZCSTacqW60A+j44qyW7v051KVu1MBO2nXs89dftL8EVd2Et/jJqK3kvMDReFLZ9Y=";
var header = "Bearer " + token; // Bearer ������ ���� �߰�
var calSum =  "[����] Ķ����API�� �߰��� ����";
var calDes =  "[��] ȸ�� �մϴ�";
var calLoc =  "[���] �׸����丮";
var uid = token.substring(0, 15);// UUID ���� (�ӽ÷� �ϴ� ��ū���� �߶� ���)
var scheduleIcalString = "BEGIN:VCALENDAR\n"
scheduleIcalString += "VERSION:2.0\n"
scheduleIcalString += "PRODID:Naver Calendar\n"
scheduleIcalString += "CALSCALE:GREGORIAN\n"
scheduleIcalString += "BEGIN:VTIMEZONE\n"
scheduleIcalString += "TZID:Asia/Seoul\n"
scheduleIcalString += "BEGIN:STANDARD\n"
scheduleIcalString += "DTSTART:19700101T000000\n"
scheduleIcalString += "TZNAME:GMT+:00\n"
scheduleIcalString += "TZOFFSETFROM:+0900\n"
scheduleIcalString += "TZOFFSETTO:+0900\n"
scheduleIcalString += "END:STANDARD\n"
scheduleIcalString += "END:VTIMEZONE\n"
scheduleIcalString += "BEGIN:VEVENT\n"
scheduleIcalString += "SEQUENCE:0\n"
scheduleIcalString += "CLASS:PUBLIC\n"
scheduleIcalString += "TRANSP:OPAQUE\n"
scheduleIcalString += "UID:" + uid + "\n"                            // ���� ���� ���̵�
scheduleIcalString += "DTSTART;TZID=Asia/Seoul:20161116T190000\n"     // ���� �Ͻ�
scheduleIcalString += "DTEND;TZID=Asia/Seoul:20161116T193000\n"      // ���� �Ͻ�
scheduleIcalString += "SUMMARY:" + calSum + " \n"                     // ���� ����
scheduleIcalString += "DESCRIPTION:" + calDes + " \n"                 // ���� �� ����
scheduleIcalString += "LOCATION:" + calLoc + " \n"                   // ���
// scheduleIcalString += "RRULE:FREQ=YEARLY;BYDAY=FR;INTERVAL=1;UNTIL=20201231\n" +  // ���� �ݺ��� ����
scheduleIcalString += "ORGANIZER;CN=������:mailto:admin@sample.com\n"  // ���� ���� ���
scheduleIcalString += "ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=admin:mailto:user1@sample.com\n"  // ������
scheduleIcalString += "CREATED:20161116T160000\n"          // ���� �����ð�
scheduleIcalString += "LAST-MODIFIED:20161122T160000\n"   // ���� �����ð�
scheduleIcalString += "DTSTAMP:20161122T160000\n"          // ���� Ÿ�ӽ�����
scheduleIcalString += "END:VEVENT\n"
scheduleIcalString += "END:VCALENDAR"







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
            res.render('getdetail',{items:books}); // db���� ������ ������ ��� ����??
    })
});










router.get('/calendar', function (req, res) {
   var api_url = 'https://openapi.naver.com/calendar/createSchedule.json';
   var request = require('request');
   var options = {
       url: api_url,
       form: {'calendarId':'defaultCalendarId', 'scheduleIcalString':scheduleIcalString},
       headers: {'Authorization': header}
    };
   request.post(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
       res.redirect('/');
     } else {
       console.log('error');
       if(response != null) {
         res.status(response.statusCode).end();
         console.log('error = ' + response.statusCode);
       }
     }
   });
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