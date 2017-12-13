var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var book = require('./models/book');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var token = "AAAANxMzrFlLrOlvym6zSPrEu1yZCSTacqW60A+j44qyW7v051KVu1MBO2nXs89dftL8EVd2Et/jJqK3kvMDReFLZ9Y=";
var header = "Bearer " + token; // Bearer 다음에 공백 추가
var state = '41517383'

var client_id = 'y102OB1eCQjsIHVCcjFI';
var client_secret = '8N5QhdEyp0';
var engine = require('ejs-locals');


var registration=require('./routes/registration');

//
var mongojs = require('mongojs'); // MongoDB 연결 해야되니 MongoJS 모듈도 추가
var db = mongojs('genie', ['images']); // 여기서 genie는 database 이름이고 images테이블을 사용할꺼라고 선언
var formidable = require('formidable'); // form 태그 데이터들을 가져오는 모듈
var fs = require('fs-extra'); // 파일을 복사하거나 디렉토리 복사하는 모듈

app.use(express.static(__dirname + '/public')); //public 폴더 안에 javascript 파일과 css파일을 모아둘 예정
app.use(bodyParser.json()); // body-parser 모듈을 사용해서 파싱 해줌
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views'); // ejs 파일들을 저장하기 위해 경로 추가했음
app.set('view engine', 'ejs'); // ejs를 html로 바꿔주면 html로 파일 실행됩니다.



mongoose.connect('mongodb://localhost:27017/store', {useMongoClient: true});


app.set('views', __dirname + '/views'); // ejs 파일들을 저장하기 위해 경로 추가했음
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', registration);



app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended: false }));


var redirectURI = encodeURI("http://54.250.245.186:3000/home");
var api_url = "";

app.get('/naverlogin', function (req, res) {
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
   res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
   res.end("<style>body{background-image:url('https://fthmb.tqn.com/xHeGzut3XvyKSdN02qs8pRjti5A=/768x0/filters:no_upscale()/a0163-000111n-F-56a7f5de5f9b58b7d0efa202.jpg');background-position:top;background-repeat:no-repeat;text-align:center;}</style><h1><br><br><br>YummyYummy</h1><a href='"+api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
});
/*
app.get('/callback', function (req, res) {
    code = req.query.code;
    state = req.query.state;
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        res.end(body);
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  });
*/





app.engine('ejs', engine);






app.get('/registration', function(req, res) { // 웹에서 실행할 주소가 localhost:3000/ 이거일때를 선언
    res.render('registration'); // index.ejs로 써도 되고 index만 써도 ?컥?실행을 해줍니다.
});



//빨리퇴근

app.get('/up', function(req, res) { // 웹에서 실행할 주소가 localhost:3000/ 이거일때를 선언
    res.render('up'); // index.ejs로 써도 되고 index만 써도 파일 실행을 해줍니다.
});

app.post('/upload',function(req,res){ 
    var name = "name";
    var filePath = "";
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        name = fields.name;
    });
    form.on('end', function(fields, files) {
   for (var i = 0; i < this.openedFiles.length; i++) {
    var temp_path = this.openedFiles[i].path;
            var file_name = this.openedFiles[i].name;
            var index = file_name.indexOf('/'); 
            var new_file_name = file_name.substring(index + 1);
            var new_location = 'public/resources/images/'+name+'/';
            var db_new_location = 'resources/images/'+name+'/';
            //실제 저장하는 경로와 db에 넣어주는 경로로 나눠 주었는데 나중에 편하게 불러오기 위해 따로 나눠 주었음
            filePath = db_new_location + file_name;
            fs.copy(temp_path,new_location + file_name, function(err) { // 이미지 파일 저장하는 부분임
                if (err) {
                    console.error(err);
                }
	db.images.insert({"name":name,"filePath":filePath},function(err,doc){
  //디비에 저장
      res.redirect('/go/'+filePath);
 });
    });
   }
  });
});

app.get('/image',function(req,res){ //몽고디비에서 filePath 와 name을 불러옴
    db.images.find(function(err,doc){
        res.json(doc);
    });
});











app.listen(3000, function () {
 });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.Promise = global.Promise;
module.exports = app;