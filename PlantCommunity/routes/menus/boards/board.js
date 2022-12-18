const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../../../config/plant_db'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const user_dbconfig = require('../../../config/db'); // user_db 모듈 불러오기
const user_connection = mysql.createConnection(user_dbconfig); // user_db 연결

const options = require('../../../config/session_db'); // session_db 모듈 불러오기
const session_connection = mysql.createConnection(options);

/* 글쓰기를 할 때 로그인된 회원이 맞는지 확인 */
// router.get('/authentication', function(req, res){ 
//   if (req.session.authenticator) { // 인증된 사용자라면(세션O)
//     console.log("인증된 사용자입니다")
//     res.send('true');
//   } else { // 인증된 사용자가 아니라면(세션X)
//     console.log("로그인이 되어있지 않습니다");
//     res.send('false');
//   }
// })

router.use(express.json()); 


router.get('/popular_contents', function(req, res){ 
  sql = "SELECT * FROM contents ORDER BY clickcount DESC LIMIT 5";
  // var insertValArr = [board, search_val];
  connection.query(sql, function(error, rows){ // db에 글 저장
    if (error) throw error;
    console.log(rows)
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

  sql = `SELECT *
  FROM plant_db.contents AS C
  INNER JOIN users.users AS U
  ON C.user_id = U.user_id
  WHERE board = ? and title LIKE ? 
  ORDER BY num DESC`;

  // sql = "SELECT * FROM contents WHERE board = ? and title LIKE ? ORDER BY num DESC";
  var insertValArr = [board, search_val];
  connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) throw error;
    console.log(rows);
    console.log(rows.length);
    total_contents = rows.length;
    res.send({rows: rows, count: rows.length});
  });
})















/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴