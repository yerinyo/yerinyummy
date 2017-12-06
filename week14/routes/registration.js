var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var app = express();
var mongojs = require('mongojs'); // MongoDB 연결 해야되니 MongoJS 모듈도 추가
var db = mongojs('genie', ['images']); // 여기서 genie는 database 이름이고 images테이블을 사용할꺼라고 선언
var bodyParser = require('body-parser'); // json 형태로 파싱할꺼니까 모듈 추가
var formidable = require('formidable'); // form 태그 데이터들을 가져오는 모듈
var fs = require('fs-extra'); // 파일을 복사하거나 디렉토리 복사하는 모듈



var token = "AAAANxMzrFlLrOlvym6zSPrEu1yZCSTacqW60A+j44qyW7v051KVu1MBO2nXs89dftL8EVd2Et/jJqK3kvMDReFLZ9Y=";
var header = "Bearer " + token; // Bearer 다음에 공백 추가
var calSum =  "[제목] 캘린더API로 추가한 일정";
var calDes =  "[상세] 회의 합니다";
var calLoc =  "[장소] 그린팩토리";
var uid = token.substring(0, 15);// UUID 생성 (임시로 일단 토큰값을 잘라서 사용)
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
scheduleIcalString += "UID:" + uid + "\n"                            // 일정 고유 아이디
scheduleIcalString += "DTSTART;TZID=Asia/Seoul:20161116T190000\n"     // 시작 일시
scheduleIcalString += "DTEND;TZID=Asia/Seoul:20161116T193000\n"      // 종료 일시
scheduleIcalString += "SUMMARY:" + calSum + " \n"                     // 일정 제목
scheduleIcalString += "DESCRIPTION:" + calDes + " \n"                 // 일정 상세 내용
scheduleIcalString += "LOCATION:" + calLoc + " \n"                   // 장소
// scheduleIcalString += "RRULE:FREQ=YEARLY;BYDAY=FR;INTERVAL=1;UNTIL=20201231\n" +  // 일정 반복시 설정
scheduleIcalString += "ORGANIZER;CN=관리자:mailto:admin@sample.com\n"  // 일정 만든 사람
scheduleIcalString += "ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=admin:mailto:user1@sample.com\n"  // 참석자
scheduleIcalString += "CREATED:20161116T160000\n"          // 일정 생성시각
scheduleIcalString += "LAST-MODIFIED:20161122T160000\n"   // 일정 수정시각
scheduleIcalString += "DTSTAMP:20161122T160000\n"          // 일정 타임스탬프
scheduleIcalString += "END:VEVENT\n"
scheduleIcalString += "END:VCALENDAR"







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
            res.render('getdetail',{items:books}); // db에서 가져온 내용을 뷰로 렌더??
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