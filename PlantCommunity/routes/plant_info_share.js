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


// /* 세션 관련 미들웨어 */
// router.use( 
//   session({
//     key: "user_cookie",
//     secret: "secret_string", //쿠키를 임의로 변조하는 것을 방지하기 위한 값
//     store: sessionStore,
//     resave: false, //세션에 변경사항이 없어도 항상 저장할 지 설정하는 값
//     saveUninitialized: false,
//     // cookie: {MaxAge: 24000 * 60 * 1}
//   })
// );

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

  console.log(req.headers.cookies);
  console.log(req.session); // 새로고침을 하면 이 값이 바뀜.

  

  if (req.headers.cookies === req.sessionID) { // 클라이언트에서 헤더에 보낸 세션 쿠키값이 세션ID와 같다면 
    res.send({'authenticator': true});
  } else {
    res.send({'authenticator': false});
  }


  // /* 헤더에 있는 쿠키들 정제 과정 */
  // let cookie_values = {}; // 쿠키 값들이 정제된 후 저장될 객체
  // let temp;

  // console.log('req.headers.cookie:', req.headers.cookie);

  // temp = (req.headers.cookie).split(';') // 먼저 쿠키들을 ;을 기준으로 나눈다.
  // .map((x) => ( x.trim() )) // 나눈 값에서 공백은 제거한다.
  // .map((y) => ( y.split('=') )) // 공백을 제거한 후 =을 기준으로 쿠키값을 다시 나눈다.

  // temp.forEach(([k, v]) => { // k는 key값, v는 value값
  //   // 디코딩을 하면 이런 형태로 출력 -> s:2dwrVKhgPXH7Dj_biUkDBrp8VkX5QfEr.4Ez3SaieWSY0gYdmvUltEFEYON7bRbcvlBEh5hg9Kfo 
  //   v = ((decodeURIComponent(v).split(':'))[1]) // 디코딩을 한 후에 : 을 기준으로 나눈다.
  //   if (v !== undefined) { v = (v.split('.'))[0]; }// value에 해당하는 값이 있을 때는 .을 기준으로 나눈 후에 인덱스 0에 해당하는 값을 뽑는다.
  //   cookie_values[k] = v; // 쿠키값들 객체에 key:value 형태로 넣는다.
  // })

  // if (cookie_values.user_cookie) { // 클라이언트에서 보낸 요청 헤더에 user_cookie 쿠키 값이 있다면
  //   if (cookie_values.user_cookie == req.sessionID) { // 클라이언트에서 헤더로 보낸 세션 쿠키값과 세션ID 값이 같다면 
  //     console.log(req.session.nickname);
  //   }
  // }

  
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