const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

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


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴