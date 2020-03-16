'use strict';

var express = require('express');
var cors = require('cors');

// require and use "multer"...
var multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({storage: storage, limits: {fileSize: 30000000}});

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  // console.log(req.file.fieldname, req.file.mimetype, req.file.size);
  res.send({name: req.file.originalname, type: req.file.mimetype, size: req.file.size});
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
