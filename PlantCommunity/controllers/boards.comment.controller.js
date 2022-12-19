/*********  게시판 댓글 관련 Controller */

const boardCommentModel = require("../models/boardsComment.js");


/* 1. 댓글 불러오기 */
exports.commentGetMid = (req, res) => { 
  let board = req.params.board;
  let content_num = req.params.num;

  sql = "SELECT * FROM comments WHERE board= ? and content_num = ?";

  var insertValArr = [board, content_num];

  boardCommentModel.commentListGet(insertValArr, function (err, rows) {
    if (err) throw err;
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
}

/* 2. 댓글 저장하기 */
exports.commentPostMid = (req, res) => { 
  if (req.session.authenticator) {
    let board = req.params.board;
    let content_num = req.params.num;
    let comment = req.body.comments_send_val.comment;
    let writer = req.session.nickname;
    let date = req.body.comments_send_val.date;
    let time = req.body.comments_send_val.time;

    var insertValArr = [board, content_num, comment, writer, date, time];

    boardCommentModel.commentPost(insertValArr, function (err, rows) {
      if (err) throw err;
      res.send(rows);
    });
  } else {
    console.log("세션이 없습니다. 로그인을 해주세요.");
  }
}

/* 3. 댓글의 답글 불러오기 */
exports.replyGetMid = (req, res) => { 
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

  boardCommentModel.replyListGet(content_num, function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
}

/* 4. 댓글의 답글 저장하기 */
exports.replyPostMid = (req, res) => { 
  if (req.session.authenticator) {
    let board = req.params.board;
    let comment_num = req.params.comment_num;
    let comment = req.body.comments_send_val2.comment;
    let writer = req.session.nickname;
    let date = req.body.comments_send_val2.date;
    let time = req.body.comments_send_val2.time;
    let content_num = req.params.num;

    var insertValArr = [board, comment_num, comment, writer, date, time, content_num];

    boardCommentModel.replyPost(insertValArr, function (err, rows) {
      if (err) throw err;
      res.send(rows);
    });
  } else {
    console.log("세션이 없습니다. 로그인을 해주세요.");
  }
}