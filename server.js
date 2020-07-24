'use strict';

var express = require('express');
var cors = require('cors');

// require and use "multer"...
var multer = require("multer");
// var storage = multer.memoryStorage();
// var storage = multer.diskStorage({});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".pdf")
  }
})
var upload = multer({storage: storage, limits: {fileSize: 30000000}});
// var upload = multer({ dest: 'public/' })
var fs = require('fs');

// const PDF2Pic = require("pdf2pic");
 
// const pdf2pic = new PDF2Pic({
//   density: 100,           // output pixels per inch
//   savename: "untitled",   // output file name
//   savedir: "./images",    // output file location
//   format: "png",          // output file format
//   size: "600x600"         // output size in pixels
// });

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, body) => {
  // console.log(req.file.fieldname, req.file.mimetype, req.file.size);
  // res.send(req.file.path);
    var PDFImage = require("pdf-image").PDFImage;
    var pdfImage = new PDFImage(req.file.path);
    pdfImage.convertPage(0).then(function (imagePath) {
      // 0-th page (first page) of the slide.pdf is available as slide-0.png
      // fs.existsSync("/tmp/slide-0.png") // => true
      // res.send({name: req.file.originalname, type: req.file.mimetype, size: req.file.size});
      // res.send("Ok")
      res.sendFile(imagePath);
    });
//   pdf2pic.convert(req.file.path).then((resolve) => {
//   console.log("image converter successfully!");
 
//   return resolve;
//   res.send("ok")
  // });

})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
