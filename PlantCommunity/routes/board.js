const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const user_dbconfig = require('../config/db.js'); // user_db 모듈 불러오기
const user_connection = mysql.createConnection(user_dbconfig); // user_db 연결

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


router.get('/popular_contents', function(req, res){ 
  sql = "SELECT * FROM contents ORDER BY clickcount DESC LIMIT 5";
  // var insertValArr = [board, search_val];
  connection.query(sql, function(error, rows){ // db에 글 저장
    if (error) throw error;
    console.log(rows)
    res.send(rows);
  });
})






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

router.route('/:board/contents/:num')
  .get((req, res) => {
    sql = "SELECT * FROM contents WHERE board = ? and num = ?";

    var insertValArr = [req.params.board, req.params.num];
  
    connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
      if (error) throw error;
      res.send(rows);
    });
  })
  .post((req, res) => { /* 조회수 */
    sql = "UPDATE contents SET clickcount = ? WHERE board = ? and num = ?";

    let clickcount = req.body.params.clickcount;
    var insertValArr = [clickcount, req.params.board, req.params.num];

    connection.query(sql, insertValArr, function(error, rows){ // db에 조회수 저장
      if (error) throw error;
      res.send(rows);
    });
  })
  .delete((req, res) => { /* 게시글 삭제 */
  sql = "DELETE FROM contents WHERE board = ? and num = ?";

  var insertValArr = [req.params.board, req.params.num];

  connection.query(sql, insertValArr, function(error, rows){ // db에 조회수 저장
    if (error) throw error;
    res.send({status: 'success'});
  });
})


/* 좋아요 기능*/
router.post('/:board/contents/:num/like', function(req, res){ 
  let user_id = req.body.user_id; // 현재 로그인된 유저 아이디
  let like_state = req.body.like_state; // 현재 좋아요 상태

  user_id = user_id || false; // 아이디가 없으면 false

  // plant_db의 contents를 업데이트
  function update_sql(likecount, likeUsers) {
    let modified_like_state = {
      likecount: likecount,
      likeUsers: likeUsers
    }        
    
    let s_modified_like_state = JSON.stringify(modified_like_state);

    var insertValArr = [s_modified_like_state, req.params.board, req.params.num];
    sql = "UPDATE contents SET likestate = ? WHERE board = ? and num = ?";
    connection.query(sql, insertValArr, function(error, rows){ // db에 likestate 변경 후 저장
      if (error) throw error;
      res.send(rows);
    });
  }

  // users_db의 users -> like_contents를 업데이트 (게시글 번호 추가/삭제)
  function update_sql_users(state) {
    sql = "SELECT * FROM sessions WHERE session_id = ?";
    session_connection.query(sql, req.headers.cookies, function(error, rows) {
      if (error) throw error;

      let session_obj = JSON.parse(rows[0].data);
      let user_id = session_obj.user_id;

      sql = "SELECT * FROM users WHERE user_id = ?";
      user_connection.query(sql, user_id, function(error, rows){
        if (error) throw error;

        console.log(rows[0].like_contents)
        let object;
        let exist_like_contents = rows[0].like_contents; 
        let modified_like_contents;

        let likecontents_obj = JSON.parse(exist_like_contents); 

        let s_object

        console.log('whatobject:', likecontents_obj)

        
        console.log('기존like값',exist_like_contents);
        console.log('user_id', user_id);

        if (state === 'add') { // 게시글 번호를 추가할 때
          if (exist_like_contents === null) { // 기존 like_contents에 아무 값도 없을 때
            console.log('undefined입니다')
            modified_like_contents = [];
            modified_like_contents.push(req.params.num); // 현재 게시글의 번호를 추가
            console.log(modified_like_contents);
            object = {likecontents: modified_like_contents}
            s_object = JSON.stringify(object)
    
          } else { // 기존 like_contents에 값이 있을 때
            console.log('다른 값이 있습니다.')
            modified_like_contents = likecontents_obj.likecontents;
            modified_like_contents.push(req.params.num); // 현재 게시글의 번호를 추가
            console.log(modified_like_contents);
            object = {likecontents: modified_like_contents}
            s_object = JSON.stringify(object);
          }

          console.log(s_object);
    
          var insertValArr = [s_object, user_id];
          sql = "UPDATE users SET like_contents = ? WHERE user_id = ? ";
          user_connection.query(sql, insertValArr, function(error, rows) {
            if (error) throw error;
          });

        } else { // state === 'remove' : 게시글 번호를 삭제할 때
          let likecontents = likecontents_obj.likecontents;
          let content_index = likecontents.indexOf(req.params.num); // 좋아요한 게시글 목록에서 해당 게시글의 인덱스 구하기
          likecontents.splice(content_index, 1); // 인덱스에 해당하는 값을 좋아요한 게시글 목록에서 삭제
          modified_like_contents = likecontents;
          object = {likecontents: modified_like_contents}
          s_object = JSON.stringify(object)

          var insertValArr = [s_object, user_id];
          sql = "UPDATE users SET like_contents = ? WHERE user_id = ? ";
          user_connection.query(sql, insertValArr, function(error, rows) {
            if (error) throw error;
          });
        }

      })

    });

  }

  if (user_id && like_state === false) { // 로그인된 아이디가 있고 좋아요가 안눌러져있을 경우
    var insertValArr = [req.params.board, req.params.num];
    sql = "SELECT * FROM contents WHERE board = ? and num = ?";

    connection.query(sql, insertValArr, function(error, rows){ // db에 likestate 컬럼 변경 후 저장
      if (error) throw error;
      let db_likestate = rows[0].likestate; // db의 likestate 값

      if (db_likestate == '0') { // db의 likestate에 값이 없을 경우
        console.log('db에 likestate 값이 없습니다.');

        let likecount = 0 // 좋아요수
        let likeUsers = [] // 좋아요를 누른 사람들 목록

        likecount += 1; // 좋아요수 +1
        likeUsers.push(user_id); // 좋아요를 누른 사람들 목록에 현재 로그인된 아이디 추가

        update_sql(likecount, likeUsers);
        update_sql_users('add');

      } else { // db의 likestate에 값이 있을 경우
        console.log("db에 likestate 값이 있습니다.");

        let likestate_obj = JSON.parse(db_likestate); // db의 likestate값을 뽑아내기 위해서 obj형태로 바꾸기

        let likecount = likestate_obj.likecount; // 좋아요수
        let likeUsers = likestate_obj.likeUsers; // 좋아요를 누른 사람들 목록

        likecount += 1; // 좋아요수 +1
        likeUsers.push(user_id); // 좋아요를 누른 사람들 목록에 현재 로그인된 아이디 추가

        update_sql(likecount, likeUsers);
        update_sql_users('add');
      }
    });

  } else if (user_id && like_state === true) { // 로그인된 아이디가 있고 좋아요가 눌러져있을 경우 : 좋아요수 -, 좋아요목록 - 
    var insertValArr = [req.params.board, req.params.num];
    sql = "SELECT * FROM contents WHERE board = ? and num = ?";

    connection.query(sql, insertValArr, function(error, rows){ // db에 likestate 컬럼 변경 후 저장
      if (error) throw error;
      let db_likestate = rows[0].likestate; // db의 likestate 값

      let likestate_obj = JSON.parse(db_likestate); // db의 likestate값을 뽑아내기 위해서 obj형태로 바꾸기

      let likecount = likestate_obj.likecount; // 좋아요수
      let likeUsers = likestate_obj.likeUsers; // 좋아요를 누른 사람들 목록

      likecount -= 1; // 좋아요수 -1
      let id_index = likeUsers.indexOf(user_id); // 좋아요목록에서 현재 로그인된 아이디의 인덱스 구하기
      likeUsers.splice(id_index, 1); // 인덱스에 해당하는 값을 좋아요목록에서 삭제
      console.log(likeUsers);

      update_sql(likecount, likeUsers);
      update_sql_users('remove');
    });
  } else { // 로그인이 되어있지 않을 경우
    console.log("로그인이 되어있지 않습니다.");
    res.send({state: false});
  }

})



// 현재 좋아요 상태가 어떤지 표시
router.get('/:board/contents/:num/like', function(req, res){ 
  sql = "SELECT * FROM contents WHERE board = ? and num = ?";
  var insertValArr = [req.params.board, req.params.num];

  connection.query(sql, insertValArr, function(error, rows){ // db에 조회수 저장
    if (error) throw error;
    res.send(rows);
  });
})



// 좋아요 누른 사람들 목록 출력
router.get('/:board/contents/:num/like_list', function(req, res){ 
  sql = "SELECT * FROM contents WHERE board = ? and num = ?";
  var insertValArr = [req.params.board, req.params.num];

  connection.query(sql, insertValArr, function(error, rows){ // db에 조회수 저장
    if (error) throw error;

    let db_likestate = rows[0].likestate; // db의 likestate 값

    let likestate_obj = JSON.parse(db_likestate); // db의 likestate값을 뽑아내기 위해서 obj형태로 바꾸기
    let likeUsers = likestate_obj.likeUsers; // 좋아요를 누른 사람들 목록

    console.log(likeUsers);

    var insertValArr = [likeUsers];
    sql = "SELECT * FROM users WHERE user_id IN ( ? )";

    user_connection.query(sql, insertValArr, function(error, rows){
      console.log(rows);
      res.send(rows);
    });

    
    // console.log(likeUsers);
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