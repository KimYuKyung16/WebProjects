const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

var bodyParser = require('body-parser') //router.use(bodyParser.urlencoded({extended:true}));

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const options = require('../config/session_db.js'); // session_db 모듈 불러오기
const session_connection = mysql.createConnection(options);

const path = require("path");
var multer = require('multer');

try {
	fs.readdirSync('uploads'); // 폴더 확인
} catch(err) {
	console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); // 폴더 생성
}
 
const upload = multer({
    storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
        destination(req, file, done) { // 저장 위치
            done(null, 'uploads/'); // uploads라는 폴더 안에 저장
        },
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname); // 파일의 확장자 (originalname, fieldname)
            done(null, path.basename(file.fieldname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
});


// router.get('/', function(req, res){
//   fs.readFile('./views/user_info.ejs', "utf-8", function(error, data){
//     res.writeHead(200, {'Content-Type': 'text/html' });
//     res.end(ejs.render(data));
//   })
// })

// router.use(bodyParser.urlencoded({extended:true}));
// router.use(express.json()); 

/* 프로필 설정 */
router.post('/profile', upload.single('uploadImage'), function(req, res){
  console.log(req.file);
  // console.log(req.body);
  console.log(req.file.path);

  sql = "SELECT * FROM sessions WHERE session_id = ?";

  session_connection.query(sql, req.headers.cookies, function(error, rows) {
    if (error) throw error;

    if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
      console.log("해당 세션이 없습니다.")
    } else { // sessionstore에 해당 session값이 있을 때
      let profile_file = req.file.path;
      let session_obj = JSON.parse(rows[0].data);
      let nickname = session_obj.nickname;

      var insertValArr = [profile_file, nickname];
      sql = "UPDATE users SET profile = ? WHERE nickname = ?"; 
  
      connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
        if (error) throw error;
        res.send(rows);
      });
    } 
  });

})




/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴