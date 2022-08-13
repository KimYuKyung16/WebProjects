const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

// router.get('/', (req, res) => {
//   res.render('../views/plant_info_share.ejs');
// });

router.get('/', function(req, res){
  fs.readFile('./views/plant_info_share.ejs', "utf-8", function(error, data){
    res.writeHead(200, {'Content-Type': 'text/html' });
    res.end(ejs.render(data));
  })
  // req.session.test = 'session_ok'; // 세션을 위해 추가
})


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴