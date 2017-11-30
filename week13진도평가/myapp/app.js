
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var book = require('./models/book');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var token = "AAAAN/BithUCnhi8YJUiCDLqs5W1SH6pkENZq2qT9nTDRUAL5TxzQUvYQJceBAUBXQjz6awrqqrYQGoU8uFx/gs8ROo=";
var header = "Bearer " + token; // Bearer 다음에 공백 추가
var state = '41517383'

var client_id = 'y102OB1eCQjsIHVCcjFI';
var client_secret = '8N5QhdEyp0';
var engine = require('ejs-locals');

var home=require('./routes/home');
var registration=require('./routes/registration');

mongoose.connect('mongodb://localhost:27017/store', {useMongoClient: true});


app.set('views', __dirname + '/views'); // ejs 파일들을 저장하기 위해 경로 추가했음
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.use('/home', home);
app.use('/', registration);


app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));


app.engine('html', require('ejs').__express);

var redirectURI = encodeURI("http://54.250.245.186:3000/home");
var api_url = "";

app.get('/naverlogin', function (req, res) {
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
   res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
   res.end("<style>body{background-image:url('https://fthmb.tqn.com/xHeGzut3XvyKSdN02qs8pRjti5A=/768x0/filters:no_upscale()/a0163-000111n-F-56a7f5de5f9b58b7d0efa202.jpg');background-position:top;background-repeat:no-repeat;text-align:center;}</style><h1><br><br><br>YummyYummy</h1><a href='"+api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
});
<!--
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
-->

app.get('/member', function (req, res) {
   var api_url = 'https://openapi.naver.com/v1/nid/me';
   var request = require('request');
   var options = {
       url: api_url,
       headers: {'Authorization': header}
    };
   request.get(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
       res.end(body);
     } else {
       console.log('error');
       if(response != null) {
         res.status(response.statusCode).end();
         console.log('error = ' + response.statusCode);
       }
     }
   });
 });




app.engine('ejs', engine);





app.get('/get', function(req, res) { // 웹에서 실행할 주소가 localhost:3000/ 이거일때를 선언
    res.render('get'); // index.ejs로 써도 되고 index만 써도 파일 실행을 해줍니다.
});

app.get('/registration', function(req, res) { // 웹에서 실행할 주소가 localhost:3000/ 이거일때를 선언
    res.render('registration'); // index.ejs로 써도 되고 index만 써도 파일 실행을 해줍니다.
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