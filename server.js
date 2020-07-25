'use strict';

var express = require('express');
var cors = require('cors');

// require and use "multer"...
var multer = require("multer");
// var storage = multer.memoryStorage();
// var storage = multer.diskStorage({});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/pdfs')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Math.floor(Date.now()/100)%864000 + ".pdf")
  }
})
var upload = multer({storage: storage, limits: {fileSize: 30000000}});
// var upload = multer({ dest: 'public/' })
var fs = require('fs');

const PDF2Pic = require("pdf2pic");


var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.static('public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

//const { exec } = require('child_process');
//exec('convert -density 300 public/upfile-1595630501065.pdf -colorspace RGB public/a.png', (err, stdout, stderr) => {
//  if (err) {
//    //some err occurred
//    console.error(err)
//  } else {
//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
//  }
//});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, body) => {
  // console.log(req.file.fieldname, req.file.mimetype, req.file.size);
  // res.send(req.file.path);
    var PDFImage = require("pdf-image").PDFImage;
    //var pdfImage = new PDFImage(req.file.path);
var pdfImage = new PDFImage(req.file.path, {
	  convertOptions: {
		      "-density": "300",
		      "-alpha": "off",
		    }
});
    pdfImage.convertFile().then(function (imagePath) {
      // 0-th page (first page) of the slide.pdf is available as slide-0.png
      // fs.existsSync("/tmp/slide-0.png") // => true
      // res.send({name: req.file.originalname, type: req.file.mimetype, size: req.file.size});
      res.send("Use this code: "+req.file.filename.split("-")[1].split(".")[0])
      //res.sendFile(imagePath);
    }, function (err) {
      res.send(err, 500);
    });
//const pdf2pic = new PDF2Pic({
//  density: 200,           // output pixels per inch
//  savename: "a",   // output file name
//  savedir: "public/images",    // output file location
//  format: "png",          // output file format
//  //size: "600x600"         // output size in pixels
//});
//pdf2pic.convertBulk(req.file.path, -1).then((resolve) => {
//  console.log("image converter successfully!");
//		 
//   res.send("ok")
//  return resolve;
//});

})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
