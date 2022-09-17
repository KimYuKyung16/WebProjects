const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const options = require('../config/session_db.js'); // session_db 모듈 불러오기
const session_connection = mysql.createConnection(options);

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
    if (current_page == 1) output_num = one_page_contents
    else output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
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
router.route('/:board/contents/:num/comment')
  .get((req, res) => {
    let board = req.params.board;
    let content_num = req.params.num;

    sql = "SELECT * FROM comments WHERE board= ? and content_num = ?";

    var insertValArr = [board, content_num];

    connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
      if (error) throw error;

      // rows.forEach((row) => {
      //   sql = "SELECT * FROM comments_reply WHERE board= ? and comment_num = ?";
      //   var insertValArr = [board, row.num];
      //   connection.query(sql, insertValArr, function(error, rows){
      //     if (error) throw error;
      //     console.log(rows);
      //   })
      // });

      res.send(rows);
    });

  })
  .post((req, res) => { 

    sql = "SELECT * FROM sessions WHERE session_id = ?";

    session_connection.query(sql, req.headers.cookies, function(error, rows) {
      if (error) throw error;

      if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
        console.log("해당 세션이 없습니다.")
      } else { // sessionstore에 해당 session값이 있을 때
        let session_obj = JSON.parse(rows[0].data);
        let board = req.params.board;
        let content_num = req.params.num;
        let comment = req.body.comments_send_val.comment;
        let writer = session_obj.nickname;
        let date = req.body.comments_send_val.date;
        let time = req.body.comments_send_val.time;

        var insertValArr = [board, content_num, comment, writer, date, time];
        sql = "INSERT INTO comments (board, content_num, comment, writer, date, time) VALUES (?, ?, ?, ?, ?, ?)";
    
        connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
          if (error) throw error;
          res.send(rows);
        });
      } 
    });
  });



  /* 댓글의 답글 작성 */
router.route('/:board/contents/:num/comment/reply/:comment_num')
.get((req, res) => {
  let board = req.params.board;
  let content_num = req.params.num;
  let comment_num = req.params.comment_num;

  // sql = `SELECT b.num
  // , b.board
  // , b.comment_num
  // , b.comment
  // , b.writer
  // , b.date
  // , b.time
  // FROM comments AS a
  // INNER JOIN comments_reply AS b
  // ON a.num = b.comment_num and a.board = b.board`;

  sql = "SELECT * from comments_reply WHERE content_num = ?";


  connection.query(sql,content_num, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})
.post((req, res) => { 
  sql = "SELECT * FROM sessions WHERE session_id = ?";

  session_connection.query(sql, req.headers.cookies, function(error, rows) {
    if (error) throw error;

    if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
      console.log("해당 세션이 없습니다.")
    } else { // sessionstore에 해당 session값이 있을 때
      let session_obj = JSON.parse(rows[0].data);
      let board = req.params.board;
      let comment_num = req.params.comment_num;
      let comment = req.body.comments_send_val2.comment;
      let writer = session_obj.nickname;
      let date = req.body.comments_send_val2.date;
      let time = req.body.comments_send_val2.time;
      let content_num = req.params.num;

      var insertValArr = [board, comment_num, comment, writer, date, time, content_num];
      sql = "INSERT INTO comments_reply (board, comment_num, comment, writer, date, time, content_num) VALUES (?, ?, ?, ?, ?, ?, ?)";
  
      connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
        if (error) throw error;
        res.send(rows);
      });
    } 
  });

  
});




router.get('/:board/search', function(req, res){ 
  const board = req.params.board; // 쿼리스트링으로 들어온 board 변수의 값
  const search_val = `%${req.query.search_val}%`;


  console.log(board, search_val);

  sql = "SELECT * FROM contents WHERE board = ? and title LIKE ? ORDER BY num DESC";
  var insertValArr = [board, search_val];
  connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) throw error;
    res.send(rows);
  });
})






/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴