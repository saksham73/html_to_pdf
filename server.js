'use strict';
const puppeteer = require('puppeteer');
var express =   require("express");
var multer  =   require('multer');
var app         =   express();
const fs=require("fs");
app.set('view engine', 'ejs');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null,'./uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname);
  }
});
var upload = multer({ storage : storage}).single('file.html');

app.get('/',function(req,res){
      res.render(__dirname + "/views/index");
});
app.post('/api/file',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        (async() => {   
          try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();    
          //await page.goto('file:${path.join(__dirname, + "/uploads/file.html")}');    
          const html = fs.readFileSync("./uploads/file.html","utf-8");
          await page.setContent(html);
          await page.pdf({
            path: 'resultant.pdf',
            format: 'A4',
            /*margin: {
                  top: "20px",
                  left: "20px",
                  right: "20px",
                  bottom: "20px"
            } */   
          });    
          await browser.close();    
        } catch (err) {
          next(err);
        } 
        })();
        res.render(__dirname + "/views/uploaded");
    });
});

app.get('/download',function(req,res){
  //const filep='__dirname + "/resultant.pdf"'
  const filep = './resultant.pdf';
  
  setTimeout(function(){ 
    res.download(filep);
   }, 4000);
  
});

app.get('/redirect',function(req,res){
  res.redirect('/')
  
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});