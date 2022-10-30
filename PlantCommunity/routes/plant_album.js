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

router.post('/', function(req, res){
  sql = "SELECT * FROM sessions WHERE session_id = ?";

  session_connection.query(sql, req.headers.cookies, function(error, rows) {
    if (error) throw error;

    if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
      console.log("해당 세션이 없습니다.")
    } else { // sessionstore에 해당 session값이 있을 때
      let session_obj = JSON.parse(rows[0].data);

      let user_id = session_obj.user_id;
      let album_name = req.body.album_set_val.album_name;
      let plant_name = req.body.album_set_val.plant_name;

      var insertValArr = [user_id, album_name, null, plant_name, null]; 
      sql = "INSERT INTO plant_album (user_id, album_name, plantimage, plantname, coverimage) VALUES (?, ?, ?, ?, ?)";
    
      user_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
        if (error) throw error;
        res.send({'status' : 'success'});
      });

    }

  });

})

router.get('/album_list', function(req, res){
  sql = "SELECT * FROM sessions WHERE session_id = ?";

  session_connection.query(sql, req.headers.cookies, function(error, rows) {
    if (error) throw error;

    if (rows.length == 0) { // sessionstore에 해당 session값이 없을 때
      console.log("해당 세션이 없습니다.")
    } else { // sessionstore에 해당 session값이 있을 때
      let session_obj = JSON.parse(rows[0].data);

      let user_id = session_obj.user_id;
      
      sql = "SELECT * FROM plant_album WHERE user_id = ?"; 

      user_connection.query(sql, user_id, function(error, rows){ // db에 글 저장
        if (error) throw error;
        res.send(rows);
      });


    }

  });

})


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴