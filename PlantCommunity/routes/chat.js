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

const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.use(express.json()); 




router.route('/')
  .get((req, res) => {
    console.log(req.query);

    let seller_user_id = req.query.seller_user_id;
    let content_num = parseInt(req.query.content_num);
    let participant_user_id = req.query.participant_user_id;

    console.log('seller_user_id:',seller_user_id, 'content_num:',content_num, 'participant_user_id:',participant_user_id);

    if (content_num && seller_user_id && participant_user_id) { // 변수들에 값이 모두 있다면
      sql = "SELECT * FROM chat WHERE content_num = ? and seller_user_id = ? and participant_user_id = ?";
    
      var insertValArr = [content_num, seller_user_id, participant_user_id];
      connection.query(sql, insertValArr, function(error, rows){ // 
        if (error) throw error;
        res.send(rows);
      })
    } else {
      console.log("읽어오기위한 변수 값이 없습니다.")
      res.send();
    }


  })
  .post((req, res) => { /* 채팅 저장 */
    console.log(req.body.send_val);

    let seller_user_id = req.body.send_val.seller_user_id;
    let content_num = parseInt(req.body.send_val.content_num);
    let participant_user_id = req.body.send_val.participant_user_id;
    let chat_content = req.body.send_val.chat_content
    let last_chat = req.body.send_val.last_chat;

    let s_chat_content = JSON.stringify(chat_content);

    console.log(content_num, seller_user_id, participant_user_id)
    if (content_num && seller_user_id && participant_user_id) { // 변수들에 값이 모두 있다면
      sql = "SELECT * FROM chat WHERE content_num = ? and seller_user_id = ? and participant_user_id = ?";
    
      var insertValArr = [content_num, seller_user_id, participant_user_id];
      connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
        if (error) throw error;

        if (rows.length !== 0) { // db에 값이 있다면
          console.log("db에 값이 있습니다.")
          
          sql = "UPDATE chat SET chat_content = ?, last_chat = ? WHERE content_num = ? and seller_user_id = ? and participant_user_id = ?";

          var insertValArr = [s_chat_content, last_chat, content_num, seller_user_id, participant_user_id];
          connection.query(sql, insertValArr, function(error, rows){ 
            if (error) throw error;
            res.send(rows);
          });

        } else {
          console.log("db에 값이 없습니다.")

          sql = "INSERT INTO chat (seller_user_id, content_num, participant_user_id, chat_content, last_chat) VALUES (?, ?, ?, ?, ?)";
  
          var insertValArr = [seller_user_id, content_num, participant_user_id, s_chat_content, last_chat];
          connection.query(sql, insertValArr, function(error, rows){ 
            if (error) throw error;
            res.send(rows);
          });

        }
      });
    } else {
      console.log("값이 없습니다.");
    }

   

  })  
  .delete((req, res) => { 

  })




router.route('/list')
  .get((req, res) => {
    let content_num = parseInt(req.query.content_num);

    sql = "SELECT * FROM chat WHERE content_num = ?";
    
    connection.query(sql, content_num, function(error, rows){ // db에 글 저장
      if (error) throw error;

      res.send(rows);
    })

  })




/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴