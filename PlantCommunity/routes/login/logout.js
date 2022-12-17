/**
 *
 * 1. 로그아웃
 * 
 */

const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.delete('/', function(req, res){
  req.session.destroy();  // 세션 삭제
  res.clearCookie('user_cookie'); // 쿠키 삭제
  res.send();
})

module.exports = router // 모듈로 리턴