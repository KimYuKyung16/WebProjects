const mysql = require('mysql'); // mysql 모듈
const plant_dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const plant_connection = mysql.createConnection(plant_dbconfig); // db 연결

const contentsCount = function(board, res) {
  sql = "SELECT count(*) as count FROM contents WHERE board = ?";

  plant_connection.query(sql, board, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    // total_contents = rows[0].count;
    // res.send(rows);
    res(null, rows[0].count);
  });
};

const listDefault = function(insertValArr, res) {
  sql = `SELECT *
  FROM plant_db.contents AS C
  INNER JOIN users.users AS U
  ON C.user_id = U.user_id
  WHERE board = ?
  ORDER BY num DESC limit ?, ?`;

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

const listSearch = function(insertValArr, res) {
  sql = `SELECT *
  FROM plant_db.contents AS C
  INNER JOIN users.users AS U
  ON C.user_id = U.user_id
  WHERE board = ? and title LIKE ? 
  ORDER BY num DESC limit ?, ?`;

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

const contentRead = function(insertValArr, res) {
  sql = "SELECT * FROM contents WHERE board = ? and num = ?";

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};

const clickCount = function(insertValArr, res) {
  sql = "UPDATE contents SET clickcount = ? WHERE board = ? and num = ?";

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};


const contentDelete = function(insertValArr, res) {
  sql = "DELETE FROM contents WHERE board = ? and num = ?";

  plant_connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
    if (error) res(error, null);
    res(null, rows);
  });
};





module.exports = {
  contentsCount: contentsCount,
  listDefault: listDefault,
  listSearch: listSearch,
  contentRead: contentRead,
  clickCount: clickCount,
  contentDelete: contentDelete
};