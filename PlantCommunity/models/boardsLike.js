/*********** 게시판 좋아요 Model */

const mysql = require('mysql'); // mysql 모듈
const plant_dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const plant_connection = mysql.createConnection(plant_dbconfig); // plant_db 연결

const user_dbconfig = require('../config/db.js'); // user_db 모듈 불러오기
const user_connection = mysql.createConnection(user_dbconfig); // user_db 연결

// 현재 좋아요 상태가 어떤지 표시
exports.curLike = function(insertValArr, res) {
  sql = "SELECT * FROM contents WHERE board = ? and num = ?";

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

// 좋아요 기능
exports.likefunc = function(insertValArr, res) {
  sql = "UPDATE contents SET likestate = ? WHERE board = ? and num = ?";

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 likestate 변경 후 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

// 사용자의 좋아요 리스트 가져오기
exports.myLikeList = function(insertValArr, res) {
  sql = "SELECT * FROM users WHERE user_id = ?";

  user_connection.query(sql, insertValArr, function(error, rows){ // db에 likestate 변경 후 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

// 사용자의 좋아요 리스트 변경하고 저장
exports.myLikeListModify = function(user_id, res) {
  sql = "UPDATE users SET like_contents = ? WHERE user_id = ? ";

  user_connection.query(sql, user_id, function(error, rows){ // db에 likestate 변경 후 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

// 좋아요 누른 사람의 개인별 정보 가져오기
exports.likeUserInfo = function(insertValArr, res) {
  sql = "SELECT * FROM users WHERE user_id IN ( ? )";

  user_connection.query(sql, insertValArr, function(error, rows){ 
    if (error) res(error, null);
    res(null, rows);
  });
};


// 좋아요 누른 사람들 목록 출력
exports.contentLikeList = function(insertValArr, res) {
  sql = "SELECT * FROM contents WHERE board = ? and num = ?";

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};
