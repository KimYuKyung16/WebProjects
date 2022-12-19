/*********** 게시판 댓글 Model */

const mysql = require('mysql'); // mysql 모듈
const plant_dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const plant_connection = mysql.createConnection(plant_dbconfig); // plant_db 연결

const user_dbconfig = require('../config/db.js'); // user_db 모듈 불러오기
const user_connection = mysql.createConnection(user_dbconfig); // user_db 연결

// 댓글 불러오기
exports.commentListGet = function(insertValArr, res) {
  sql = "SELECT * FROM comments WHERE board= ? and content_num = ?";

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

// 댓글 저장하기
exports.commentPost = function(insertValArr, res) {
  sql = "INSERT INTO comments (board, content_num, comment, writer, date, time) VALUES (?, ?, ?, ?, ?, ?)";

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

// 댓글의 답글 불러오기
exports.replyListGet = function(content_num, res) {
  sql = "SELECT * from comments_reply WHERE content_num = ?";

  plant_connection.query(sql, content_num, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

// 댓글의 답글 저장하기
exports.replyPost = function(insertValArr, res) {
  sql = "INSERT INTO comments_reply (board, comment_num, comment, writer, date, time, content_num) VALUES (?, ?, ?, ?, ?, ?, ?)";

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};