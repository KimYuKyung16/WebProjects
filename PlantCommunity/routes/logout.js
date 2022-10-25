const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.use(express.json()); 

router.delete('/', function(req, res){
  // fs.readFile('./views/plant_info_share.ejs', "utf-8", function(error, data){
  //   res.writeHead(200, {'Content-Type': 'text/html' });
  //   res.end(ejs.render(data));
  // })

  req.session.destroy();  // 세션 삭제

  // console.log(req.session.authenticator);
  // console.log(req.session.nickname);

  // delete req.session.authenticator;
  // delete req.session.nickname;
  res.send();
  // delete req.session.authenticator;

})


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴