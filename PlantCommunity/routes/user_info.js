const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

var bodyParser = require('body-parser') //router.use(bodyParser.urlencoded({extended:true}));

const mysql = require('mysql'); // mysql 모듈
const users_dbconfig = require('../config/db.js'); // db 모듈 불러오기
const users_connection = mysql.createConnection(users_dbconfig); // db 연결

const plant_dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const plant_connection = mysql.createConnection(plant_dbconfig); // db 연결


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
  
      users_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
        if (error) throw error;
        res.send(rows);
      });
    } 
  });

})


/* 게시글에 있는 사진 저장 테스트 */
router.post('/picture', upload.single('uploadImage'), function(req, res){
  console.log(req.file);
  // console.log(req.body);
  console.log(req.file.path);
  console.log('헤더값', req.headers.cookies);

  res.send({url: 'http://localhost:5000/' + req.file.path});

})


/* 저장되어있는 프로필 불러오기 */
router.post('/profile_print', function(req, res){
  sql = "SELECT * FROM sessions WHERE session_id = ?";

  session_connection.query(sql, req.headers.cookies, function(error, rows) {
    if (error) throw error;

    if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
      console.log("해당 세션이 없습니다.")
    } else { // sessionstore에 해당 session값이 있을 때
      let session_obj = JSON.parse(rows[0].data);
      let nickname = session_obj.nickname;

      var insertValArr = [nickname];
      sql = "SELECT * FROM users WHERE nickname = ?"; 
  
      users_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
        if (error) throw error;
        res.send(rows[0].profile);
      });
    } 
  });

})

/* 저장되어있는 프로필 불러오기 */
router.get('/board_profile_print', function(req, res){
  let nickname = req.query.writer;

  var insertValArr = [nickname];
  sql = "SELECT * FROM users WHERE nickname = ?"; 

  users_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows[0].profile);
  });

  // sql = "SELECT * FROM sessions WHERE session_id = ?";

  // session_connection.query(sql, req.headers.cookies, function(error, rows) {
  //   if (error) throw error;

  //   if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
  //     console.log("해당 세션이 없습니다.")
  //   } else { // sessionstore에 해당 session값이 있을 때
  //     let session_obj = JSON.parse(rows[0].data);
  //     let nickname = session_obj.nickname;

  //     var insertValArr = [nickname];
  //     sql = "SELECT * FROM users WHERE nickname = ?"; 
  
  //     connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
  //       if (error) throw error;
  //       res.send(rows[0].profile);
  //     });
  //   } 
  // });

})

let total_contents; // 총 게시글의 개수
let user_id;

/* 내가 쓴 글의 총 개수 */
router.get('/total_contents', function(req, res){
  sql = "SELECT * FROM sessions WHERE session_id = ?";

  session_connection.query(sql, req.headers.cookies, function(error, rows) {
    if (error) throw error;

    // console.log(getAttribute('nickname'));
    if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
      res.send({'status': false});
    } else { // sessionstore에 해당 session값이 있을 때
      let session_obj = JSON.parse(rows[0].data);
      user_id = session_obj.user_id; // 유저의 아이디

      sql = "SELECT count(*) as count FROM contents WHERE user_id = ?";

      plant_connection.query(sql, session_obj.user_id, function(error, rows){ // db에 글 저장
        if (error) throw error;
        total_contents = rows[0].count;
        res.send(rows);
      });
    }
  });

/* 내가 쓴 글의 목록 출력 */
router.get('/contents', function(req, res){ 
  let one_page_contents = parseInt(req.query.one_page_contents); // 한 페이지당 게시글 개수

  let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
  let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
  
  remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

  let current_page = req.query.current_page; // 현재 페이지
  let start_value = (current_page-1) * one_page_contents; // 시작값
  let output_num; // 출력 개수

  if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
    if (current_page == 1) output_num = one_page_contents
    else output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
  } else { // 현재 페이지가 마지막 페이지가 아니라면 
    output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
  }

  const board = req.params.board; // 쿼리스트링으로 들어온 board 변수의 값
  console.log(req.params.board,start_value, output_num);

  sql = "SELECT * FROM contents WHERE user_id = ? ORDER BY num DESC limit ?, ?";
  var insertValArr = [user_id, start_value, output_num];
  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})

  





  // sql = "SELECT count(*) as count FROM contents WHERE board = 'plant_info_share'";

  // plant_connection.query(sql, function(error, rows){ // db에 글 저장
  //   if (error) throw error;
  //   total_contents = rows[0].count;
  //   res.send(rows);
  // });
})



/* 내가 쓴 글 메뉴 */
// router.get('/own_contents', function(req, res){

//   let html_content = ''

//   res.send(html_content);

// })


/* 내가 쓴 글 메뉴 */
// router.get('/like_contents', function(req, res){
//   let one_page_contents = parseInt(req.query.one_page_contents); // 한 페이지당 게시글 개수

//   let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
//   let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
  
//   remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

//   let current_page = req.query.current_page; // 현재 페이지
//   let start_value = (current_page-1) * one_page_contents; // 시작값
//   let output_num; // 출력 개수

//   if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
//     if (current_page == 1) output_num = one_page_contents
//     else output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
//   } else { // 현재 페이지가 마지막 페이지가 아니라면 
//     output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
//   }

//   const board = req.params.board; // 쿼리스트링으로 들어온 board 변수의 값
//   console.log(req.params.board,start_value, output_num);

//   sql = "SELECT * FROM users WHERE user_id = ?"
//   users_connection.query(sql, user_id, function(error, rows){ // db에 글 저장
//     if (error) throw error;
//     let like_contents_array = rows[0].like_contents;
    
//     sql = "SELECT * FROM contents WHERE num IN ( ? )  ORDER BY num DESC limit ?, ?";
//     var insertValArr = [like_contents_array, start_value, output_num];
//     plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
//       if (error) throw error;
//       res.send(rows);
//     });
//   });

// })









/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴