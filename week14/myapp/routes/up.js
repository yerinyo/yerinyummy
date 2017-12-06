var express = require('express'); // ExpressJS ����� �߰�
var app = express();
var mongojs = require('mongojs'); // MongoDB ���� �ؾߵǴ� MongoJS ��⵵ �߰�
var db = mongojs('genie', ['images']); // ���⼭ genie�� database �̸��̰� images���̺��� ����Ҳ���� ����
var bodyParser = require('body-parser'); // json ���·� �Ľ��Ҳ��ϱ� ��� �߰�
var formidable = require('formidable'); // form �±� �����͵��� �������� ���
var fs = require('fs-extra'); // ������ �����ϰų� ���丮 �����ϴ� ���

app.use(express.static(__dirname + '/public')); //public ���� �ȿ� javascript ���ϰ� css������ ��Ƶ� ����
app.use(bodyParser.json()); // body-parser ����� ����ؼ� �Ľ� ����
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views'); // ejs ���ϵ��� �����ϱ� ���� ��� �߰�����
app.set('view engine', 'ejs'); // ejs�� html�� �ٲ��ָ� html�� ���� ����˴ϴ�.

app.get('/', function(req, res) { // ������ ������ �ּҰ� localhost:3000/ �̰��϶��� ����
    res.render('up', {items:['images']}); // index.ejs�� �ᵵ �ǰ� index�� �ᵵ ���� ������ ���ݴϴ�.
}); 

app.post('/upload',function(req,res){ 
    var name = "";
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
            //���� �����ϴ� ��ο� db�� �־��ִ� ��η� ���� �־��µ� ���߿� ���ϰ� �ҷ����� ���� ���� ���� �־���
            filePath = db_new_location + file_name;
            fs.copy(temp_path,new_location + file_name, function(err) { // �̹��� ���� �����ϴ� �κ�??
                if (err) {
                    console.error(err);
                }
            });
   }

 db.images.insert({"name":name,"filePath":filePath},function(err,doc){
  //��� ����
 });
  });
    res.redirect("/registration/{{filePath}}"); 
});


