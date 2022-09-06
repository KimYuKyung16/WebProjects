const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const session = require("express-session"); //세션
const MySQLStore = require('express-mysql-session')(session); //mysql 세션

const options = require('../config/session_db.js'); // session_db 모듈 불러오기
var sessionStore = new MySQLStore(options);


/* 세션 관련 미들웨어 */
router.use( 
  session({
    key: "user_cookie",
    secret: "secret_string", //쿠키를 임의로 변조하는 것을 방지하기 위한 값
    store: sessionStore,
    resave: false, //세션에 변경사항이 없어도 항상 저장할 지 설정하는 값
    saveUninitialized: false,
    // cookie: {MaxAge: 24000 * 60 * 1}
  })
);

/* 글쓰기를 할 때 로그인된 회원이 맞는지 확인 */
router.get('/authentication', function(req, res){ 
  // console.log(req.session.authenticator);
  // if (req.session.authenticator) { // 인증된 사용자라면(세션O)
  //   console.log("인증된 사용자입니다")
  //   console.log(req.session.authenticator)
  //   res.send('true');
  // } else { // 인증된 사용자가 아니라면(세션X)
  //   console.log("로그인이 되어있지 않습니다");
  //   res.send('false');
  // }
  res.send(req.cookies);
})

router.use(express.json()); 

let total_contents; // 총 게시글의 개수

/* 식물 정보 공유 게시판에 쓰여진 글 목록 출력 */
router.get('/contents', function(req, res){ 
  // sql = "SELECT count(*) as count FROM contents WHERE board = 'plant_info_share'";
  // connection.query(sql, function(error, rows){ // db에 글 저장
  //   if (error) throw error;
  //   console.log(rows[0].count);
  // });

  // console.log(typeof req.query.one_page_contents)

  let one_page_contents = parseInt(req.query.one_page_contents); // 한 페이지당 게시글 개수

  let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
  let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
  
  remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

  let current_page = req.query.current_page; // 현재 페이지
  let start_value = (current_page-1) * one_page_contents; // 시작값
  let output_num; // 출력 개수

  if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
    output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
  } else { // 현재 페이지가 마지막 페이지가 아니라면 
    output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
  }

  console.log(start_value, output_num);

  sql = "SELECT * FROM contents WHERE board = 'plant_info_share' ORDER BY num DESC limit ?, ?";
  var insertValArr = [start_value, output_num];
  connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})

/* 식물 정보 공유 게시판에 쓰여진 글 목록 출력 */
router.get('/total_contents', function(req, res){ 
  sql = "SELECT count(*) as count FROM contents WHERE board = 'plant_info_share'";

  connection.query(sql, function(error, rows){ // db에 글 저장
    if (error) throw error;
    total_contents = rows[0].count;
    res.send(rows);
  });
})


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴