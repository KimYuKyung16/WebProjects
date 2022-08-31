const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

router.get('/', function(req, res){
  fs.readFile('./views/plant_info_share.ejs', "utf-8", function(error, data){
    res.writeHead(200, {'Content-Type': 'text/html' });
    res.end(ejs.render(data));
  })
})

/* 글쓰기를 할 때 로그인된 회원이 맞는지 확인 */
router.get('/authentication', function(req, res){ 
  if (req.session.authenticator) { // 인증된 사용자라면(세션O)
    console.log("인증된 사용자입니다")
    res.send('true');
  } else { // 인증된 사용자가 아니라면(세션X)
    console.log("로그인이 되어있지 않습니다");
    res.send('false');
  }
})

router.use(express.json()); 

/* 식물 정보 공유 게시판에 쓰여진 글 목록 출력 */
router.get('/contents', function(req, res){ 
  console.log(req.query.current_page);
  console.log("테스트중")
  sql = "SELECT * FROM contents WHERE board = 'plant_info_share' ORDER BY num DESC";

  connection.query(sql, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})

/* 식물 정보 공유 게시판에 쓰여진 글 목록 출력 */
router.get('/total_contents', function(req, res){ 
  sql = "SELECT count(*) as count FROM contents WHERE board = 'plant_info_share'";

  connection.query(sql, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴