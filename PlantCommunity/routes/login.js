const express = require('express');
const router = express.Router();

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const session = require("express-session"); //세션
const MySQLStore = require('express-mysql-session')(session); //mysql 세션

const bcrypt = require('bcrypt'); // 비밀번호 암호화를 위해 필요


router.use(express.json()); // post나 get 등으로 요청을 받아들일 때 파싱을 위해 필요

const parseCookies = (cookie = '' ) => // 쿠키 key:value 형태로 파싱하기
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k,v]) => {
        acc[k.trim()] = decodeURIComponent(v).split(':')[1].split('.')[0]
        return acc;
    }, {});


/* 로그인 과정 */
router.post('/process', function(req, res) { // 클라이언트에서 요청한 값
  input_id = req.body.id; // 아이디
  input_pw = req.body.pw; // 비밀번호

  sql = "SELECT * FROM users WHERE user_id = ?";

  connection.query(sql, input_id, function(error, rows) {
    if (error) throw error;

    if (rows.length == 0) { // 아이디가 없을 경우
      console.log("존재하지않는 회원입니다");
      res.send({'login_status' : 'fail'});
    } else { // 아이디가 존재할 경우
      const same = bcrypt.compareSync(input_pw, rows[0].user_pw); // 패스워드 비교값
      if (same == true) { // 입력받은 패스워드와 db에 저장된 패스워드가 일치할 경우
        console.log("회원입니다. 로그인에 성공하셨습니다");
        
        /* expire 설정하기 */
        // const expires = new Date(); 
        // expires.setFullYear(expires.getFullYear() + 10);

        req.session.authenticator = 'true'; // 인증된 사용자 여부 저장
        req.session.nickname = rows[0].nickname; // 세션에 닉네임 저장
        req.session.user_id = rows[0].user_id; // 세션에 아이디 저장
        req.session.cookie.maxAge = 1000 * 60 * 60; // 세션 만료 시간을 1시간으로 설정 (단위: ms, 1000은 1초)
        // req.session.cookie.expires = expires;

        req.session.save(() => { // 세션이 저장되면
          res.send({'login_status' : 'success'});
        });
      } else { // 패스워드가 틀렸을 경우
        console.log("패스워드가 틀렸습니다");
        res.send({'login_status' : 'fail'});
      }
    } 
  });
})


/* 로그인된 회원이 맞는지 확인 */
router.get('/authentication', function(req, res){ 
  let cookies; // 쿠키값

  if (req.headers.cookie) { // 헤더에 cookie가 있으면 cookie 파싱
    cookies = parseCookies(req.headers.cookie);
  } else {
    console.log("쿠키가 없습니다.");
  }

  if (req.session.authenticator && req.sessionID === cookies.user_cookie) { // 세션이 있다면 인증O, 로그인 상태O
    res.send({'authenticator': true, 'nickname': req.session.nickname, 'user_id':req.session.user_id});
  } else {
    res.send({'authenticator': false, 'state':false});
  }
})


// /* 닉네임 출력을 위해 user_id 제공 */
// router.get('/authentication/nickname', function(req, res){ 
//   let cookies; // 쿠키값

//   if (req.headers.cookie) { // 헤더에 cookie가 있으면 cookie 파싱
//     cookies = parseCookies(req.headers.cookie);
//   } else {
//     console.log("쿠키가 없습니다.");
//   }

//   if (req.sessionID === cookies.user_cookie) { // 세션과 쿠키값이 같다면
//     res.send({'authenticator': true, 'nickname':session_obj.nickname, 'user_id':session_obj.user_id});
//   } else {
//     res.send({'authenticator': false, 'state':false});
//   }
// })


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴