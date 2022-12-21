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

router.use(express.json()); 

router.route('/:board')
  .post((req, res) => { /* 게시판에서 글 저장 */
    if (req.session) {
      let title = req.body.contents_send_val.title;
      let content = req.body.contents_send_val.content;
      let board = req.body.contents_send_val.board;
      let writer = req.session.nickname;
      let user_id = req.session.user_id;
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
    } else {
      console.log("해당 세션이 없습니다.")
    }
  })
  .put((req, res) => { /* 게시글 수정 */
    if (req.session) {
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
    } else {
      console.log("해당 세션이 없습니다.")
    }
  });





/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴