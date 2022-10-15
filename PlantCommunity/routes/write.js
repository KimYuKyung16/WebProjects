const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");
// const { nextTick } = require('process');

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

router.use(express.json()); 

router.route('/:board')
  .get((req, res) => { /* 어떤 게시판에서 글쓰기를 선택했는지 */
    fs.readFile('./views/write.ejs', "utf-8", function(error, data){
      res.writeHead(200, {'Content-Type': 'text/html' });
      res.end(ejs.render(data));
      // next();
   })

   console.log(req.params); // 어떤 게시판을 통해서 글쓰기를 들어왔는지 게시판 변수

  })
  .post((req, res) => { /* 게시판에서 글쓰고 저장할 때 */

    sql = "SELECT * FROM sessions WHERE session_id = ?";

    session_connection.query(sql, req.headers.cookies, function(error, rows) {
      if (error) throw error;

      if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
        console.log("해당 세션이 없습니다.")
      } else { // sessionstore에 해당 session값이 있을 때
        let session_obj = JSON.parse(rows[0].data);
        
        let title = req.body.contents_send_val.title;
        let content = req.body.contents_send_val.content;
        let board = req.body.contents_send_val.board;
        let writer = session_obj.nickname;
        let user_id = session_obj.user_id;
        let date = req.body.contents_send_val.date;
        let time = req.body.contents_send_val.time;
        let clickcount = req.body.contents_send_val.clickcount;
        let likestate = JSON.stringify({likecount: 0, likeUsers:[]});
        let thumbnail = req.body.contents_send_val.thumbnail_src;

        var insertValArr = [title, content, board, writer, user_id, date, time, clickcount, likestate, thumbnail]; // mysql에 넣을 배열값 : [제목, 내용]
        sql = "INSERT INTO contents (title, content, board, writer, user_id, date, time, clickcount, likestate, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      
        connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
          if (error) throw error;
          res.send({'status' : 'success'});
        });
      }
    });
   


    // let title = req.body.title;
    // let content = req.body.content;
    // let board = req.body.board;

    // let writer = req.body.contents_send_val.writer;



  })
  .put((req, res) => { /* 어떤 게시판에서 글쓰기를 선택했는지 */
    sql = "SELECT * FROM sessions WHERE session_id = ?";

    session_connection.query(sql, req.headers.cookies, function(error, rows) {
      if (error) throw error;

      if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
        console.log("해당 세션이 없습니다.")
      } else { // sessionstore에 해당 session값이 있을 때     

        let board_num = req.body.contents_send_val.board_num;
        let title = req.body.contents_send_val.title;
        let content = req.body.contents_send_val.content;
        let board = req.params.board;
        let thumbnail = req.body.contents_send_val.thumbnail_src;

        var insertValArr = [title, content, board, thumbnail, board_num]; 
        sql = "UPDATE contents SET title=?, content=?, board=?, thumbnail=? WHERE num=? ";
      
        connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
          if (error) throw error;
          res.send({'status' : 'success'});
        });
      }
    });
  })





/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴