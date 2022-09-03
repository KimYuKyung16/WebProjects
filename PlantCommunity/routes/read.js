const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");
// const { nextTick } = require('process');

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

router.use(express.json()); 

router.get('/:board',function(req, res){ /* 어떤 게시판에서 글쓰기를 선택했는지 */
    fs.readFile('./views/write.ejs', "utf-8", function(error, data){
      res.writeHead(200, {'Content-Type': 'text/html' });
      res.end(ejs.render(data));
      // next();
   })

   console.log(req.query); // 어떤 게시판을 통해서 글쓰기를 들어왔는지 게시판 변수
  });





/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴