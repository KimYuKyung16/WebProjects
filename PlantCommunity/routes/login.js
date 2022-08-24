const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const session = require("express-session"); //세션
const MySQLStore = require('express-mysql-session')(session); //mysql 세션

const options = require('../config/session_db.js'); // session_db 모듈 불러오기
var sessionStore = new MySQLStore(options);

const bcrypt = require('bcrypt');
const { cookie } = require('request');

/* 세션 관련 미들웨어 */
router.use( 
  session({
    key: "user_cookie",
    secret: "session_cookie_secret", //쿠키를 임의로 변조하는 것을 방지하기 위한 값
    store: sessionStore,
    resave: false, //세션에 변경사항이 없어도 항상 저장할 지 설정하는 값
    saveUninitialized: false,
    // cookie: {MaxAge: 24000 * 60 * 1}
  })
);

router.get('/', function(req, res){
  // fs.readFile('./views/login.ejs', "utf-8", function(error, data){
  //   res.writeHead(200, {'Content-Type': 'text/html' });
  //   res.end(ejs.render(data));
  // })

  if (req.session.authenticator) { // 세션이 있을 경우
    // res.redirect('/user_info') //로 이동
    res.send({'session': 'yes'});
  } else { // 세션이 없을 경우
    // fs.readFile('./views/login.ejs', "utf-8", function(error, data){
    //   res.writeHead(200, {'Content-Type': 'text/html' });
    //   res.end(ejs.render(data));
    // })
    res.send({'session': 'no'});
  }

})

router.use(express.json()); 

router.post('/process', function(req, res){ // 클라이언트에서 요청한 값
  input_id = req.body.id;
  input_pw = req.body.pw;

  sql = "SELECT * FROM users WHERE user_id = ?";

  connection.query(sql, input_id, function(error, rows){
    if (error) throw error;

    if (rows.length == 0) { // 아이디가 없을 때
      console.log("존재하지않는 회원입니다");
      res.send({'login_status' : 'fail'});
    } else { // 아이디가 존재할 때
      const same = bcrypt.compareSync(input_pw, rows[0].user_pw); // 패스워드 비교값
      if (same == true) { // 입력받은 패스워드와 db에 저장된 패스워드가 일치할 때
        console.log("회원입니다. 로그인에 성공하셨습니다");
        req.session.cookie.maxAge = 1000 * 60 * 60; // 세션 만료 시간을 1시간으로 설정 (단위: ms, 1000은 1초)
        req.session.user_cookie = req.sessionID; // 세션id 저장
        req.session.u_id = input_id; // 세션을 위해 추가
        req.session.authenticator = 'yes'; // 세션을 위해 추가
        res.send({'login_status' : 'success', 'cookie': req.session.user_cookie});
      } else {
        console.log("패스워드가 틀렸습니다");
        res.send({'login_status' : 'fail'});
      }
    }
 
  });

})

// req.session.cookie.maxAge = 1000 * 60 * 60;
    

//     res.send({'cookie': req.sessionID});





/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴