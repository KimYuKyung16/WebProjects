/**
 *
 * 1. 회원가입 과정
 * 
 */

const express = require('express');
const router = express.Router();

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../../config/db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const bcrypt = require('bcrypt'); // 단방향 암호화를 위한 bcrypt 모듈

router.use(express.json()); // body parser

/* 회원가입 후 회원을 저장하는 과정 페이지 */
router.post('/process', function(req, res){ // 클라이언트에서 요청한 값
  u_id = req.body.id;
  u_pw = req.body.pw;
  u_nickname = req.body.nickname;

  const encryptedPw = bcrypt.hashSync(u_pw, 10); // 암호화된 비밀번호: 솔트를 10번 돌림, Sync가 붙어서 동기 방식

  var insertValArr = [u_id, encryptedPw, u_nickname]; // mysql에 넣을 배열값 : [암호화되지 않은 아이디, 암호화된 비밀번호, 닉네임]
  sql = "INSERT INTO users (user_id, user_pw, nickname) VALUES (?, ?, ?)";

  /* db에 암호화해서 아이디와 비밀번호 저장하는 작업 : mysql 사용 */
  connection.query(sql, insertValArr, function(error, rows){
    if (error) throw error;
    res.send(rows);
  });
})

module.exports = router // 모듈로 리턴