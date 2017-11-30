
var express = require('express');
var app = express();
var client_id = 'y102OB1eCQjsIHVCcjFI';
var client_secret = '8N5QhdEyp0';
var state = "RANDOM_STATE";
var redirectURI = encodeURI("http://54.250.245.186:3000/main");
var api_url = "";
var main = require('./routes/main');
app.get('/naverlogin', function (req, res) {
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
   res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
   res.end("<style>body{background-image:url('https://fthmb.tqn.com/xHeGzut3XvyKSdN02qs8pRjti5A=/768x0/filters:no_upscale()/a0163-000111n-F-56a7f5de5f9b58b7d0efa202.jpg');background-position:top;background-repeat:no-repeat;text-align:center;}</style><h1><br><br><br>YummyYummy</h1><a href='"+api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
});
 app.get('/callback', function (req, res) {
    code = req.query.code;
    state = req.query.state;https://54.250.245.186:1000
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
 app.listen(3000, function () {
   console.log('http://127.0.0.1:3000/naverlogin app listening on port 3000!');
 });

app.use('/main', main);
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

module.exports = app;

