const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const bcrypt = require('bcrypt'); // 단방향 암호화를 위한 bcrypt 모듈

/* 회원가입 기본 페이지 */
router.get('/', function(req, res){ 
  fs.readFile('./views/signup.ejs', "utf-8", function(error, data){
    res.writeHead(200, {'Content-Type': 'text/html' });
    res.end(ejs.render(data));
  })
})

/* body parser의 첫 번째 방법 */
// req.body 데이터를 사용자가 원하는 형태로 parsing하여 문제를 해결할 수 있다.
// var bodyParser = require('body-parser')
// router.use(bodyParser.json()) // json 형태로 parsing한다는 뜻
// router.use(bodyParser.urlencoded({extended:true})) // true: 따로 설치가 필요한 qs 모듈 사용하여 쿼리 스트링, false: 기본으로 내장된 querystring 모듈 사용

/* body parser의 두 번째 방법 */
router.use(express.json()); 

/* 회원가입 후 회원을 저장하는 과정 페이지 */
router.post('/process', function(req, res){ // 클라이언트에서 요청한 값
  u_id = req.body.id;
  u_pw = req.body.pw;

  // const encryptedId = bcrypt.hashSync(u_id, 10); // 암호화된 아이디
  const encryptedPw = bcrypt.hashSync(u_pw, 10); // 암호화된 비밀번호: 솔트를 10번 돌림, Sync가 붙어서 동기 방식
 
  // res.json(); 
  // res.json의 인자: obj -> obj는 문자열로 변환되서 body라는 변수에 저장 -> 마지막으로 res.send(body)를 실행하면서 그 결과를 반환

  var insertValArr = [u_id, encryptedPw]; // mysql에 넣을 배열값 : [암호화되지 않은 아이디, 암호화된 비밀번호]
  sql = "INSERT INTO users (user_id, user_pw) VALUES (?, ?)";

  /* db에 암호화해서 아이디와 비밀번호 저장하는 작업 : mysql 사용 */
  connection.query(sql, insertValArr, function(error, rows){
    if (error) throw error;
    res.send(rows);
  });

})


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));

module.exports = router // 모듈로 리턴