const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

router.get('/', function(req, res){
  // fs.readFile('./views/plant_info_share.ejs', "utf-8", function(error, data){
  //   res.writeHead(200, {'Content-Type': 'text/html' });
  //   res.end(ejs.render(data));
  // })

  console.log(req.session.authenticator);
  console.log(req.session.u_id);

  delete req.session.authenticator;
  delete req.session.u_id;
  // res.send();
  // delete req.session.authenticator;
})


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴