const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.use(express.json()); 

router.post('/', function(req, res){


})


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴