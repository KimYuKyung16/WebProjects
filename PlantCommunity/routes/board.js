const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

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

router.use(express.json()); 

let total_contents; // 총 게시글의 개수

/* 식물 정보 공유 게시판에 쓰여진 글 목록 출력 */
router.get('/:board', function(req, res){ 
  let one_page_contents = parseInt(req.query.one_page_contents); // 한 페이지당 게시글 개수

  let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
  let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
  
  remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

  let current_page = req.query.current_page; // 현재 페이지
  let start_value = (current_page-1) * one_page_contents; // 시작값
  let output_num; // 출력 개수

  if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
    output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
  } else { // 현재 페이지가 마지막 페이지가 아니라면 
    output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
  }

  const board = req.params.board; // 쿼리스트링으로 들어온 board 변수의 값
  console.log(req.params.board,start_value, output_num);

  sql = "SELECT * FROM contents WHERE board = ? ORDER BY num DESC limit ?, ?";
  var insertValArr = [board, start_value, output_num];
  connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})

/* 식물 정보 공유 게시판에 쓰여진 글 총 개수 출력 */
router.get('/:board/total_contents', function(req, res){ 
  sql = "SELECT count(*) as count FROM contents WHERE board = ?";

  connection.query(sql, req.params.board, function(error, rows){ // db에 글 저장
    if (error) throw error;
    total_contents = rows[0].count;
    res.send(rows);
  });
})


router.get('/:board/contents/:num', function(req, res){ 
  sql = "SELECT * FROM contents WHERE board = ? and num = ?";

  var insertValArr = [req.params.board, req.params.num];

  connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})

/* 총 댓글 출력 */
router.get('/:board/contents/:num/total_commtents', function(req, res){ 
  sql = "SELECT * FROM contents WHERE board = ? and num = ?";

  var insertValArr = [req.params.board, req.params.num];

  connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})

/* 댓글 작성 */
router.post('/:board/contents/:num/comment', function(req, res){ 
  let board = req.params.board;
  let content_num = req.params.num;
  let comment = req.body.comments_send_val.comment;
  let writer = req.body.comments_send_val.writer;
  let date = req.body.comments_send_val.date;
  let time = req.body.comments_send_val.time;

  sql = "INSERT INTO comments (board, content_num, comment, writer, date, time) VALUES (?, ?, ?, ?, ?, ?)";

  var insertValArr = [board, content_num, comment, writer, date, time];

  connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})





/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴