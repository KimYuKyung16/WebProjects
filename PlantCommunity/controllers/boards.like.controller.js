/*********  게시판 좋아요 관련 Controller */

const boardLikeModel = require("../models/boardsLike.js");

/* 1. 현재 좋아요 상태가 어떤지 표시 */
exports.curLikeGetMid = (req, res) => { 
  let insertValArr = [req.params.board, req.params.num];

  boardLikeModel.curLike(insertValArr, function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
}


/* 2. 좋아요 기능 */
exports.likePostMid = (req, res) => {  
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
    boardLikeModel.likefunc(insertValArr, function (err, rows) { // db에 likestate 변경 후 저장
      if (err) throw err;
      res.send(rows);
    });
  }

  // users_db의 users -> like_contents를 업데이트 (게시글 번호 추가/삭제)
  function update_sql_users(state) {;
    if (req.session.user_id) {
      let user_id = req.session.user_id; // 사용자의 user_id

      boardLikeModel.myLikeList(user_id, function (err, rows) { // db에 likestate 변경 후 저장
        if (err) throw err;

        console.log(rows[0].like_contents)
        let object;
        let exist_like_contents = rows[0].like_contents; 
        let modified_like_contents;

        let likecontents_obj = JSON.parse(exist_like_contents); 
        let s_object;

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
    
          let insertValArr = [s_object, user_id]; 
          boardLikeModel.myLikeListModify(insertValArr, function (err, rows) { // db에 likestate 변경 후 저장
            if (err) throw err;
          });
        } else { // state === 'remove' : 게시글 번호를 삭제할 때
          let likecontents = likecontents_obj.likecontents;
          let content_index = likecontents.indexOf(req.params.num); // 좋아요한 게시글 목록에서 해당 게시글의 인덱스 구하기
          likecontents.splice(content_index, 1); // 인덱스에 해당하는 값을 좋아요한 게시글 목록에서 삭제
          modified_like_contents = likecontents;
          object = {likecontents: modified_like_contents}
          s_object = JSON.stringify(object)

          let insertValArr = [s_object, user_id];
          boardLikeModel.myLikeListModify(insertValArr, function (err, rows) { // db에 likestate 변경 후 저장
            if (err) throw err;
          });
        }
      });
    }
  }

  if (user_id && like_state === false) { // 로그인된 아이디가 있고 좋아요가 안눌러져있을 경우
    let insertValArr = [req.params.board, req.params.num];

    boardLikeModel.contentLikeList(insertValArr, function (err, rows) { // db에 likestate 변경 후 저장
      if (err) throw err;
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

    boardLikeModel.contentLikeList(insertValArr, function (err, rows) { // db에 likestate 변경 후 저장
      if (err) throw err;
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
}


/* 3. 좋아요 누른 사람들 목록 출력 */
exports.likeListGetMid = (req, res) => { 
  let insertValArr = [req.params.board, req.params.num];

  boardLikeModel.contentLikeList(insertValArr, function (err, rows) { // db에 likestate 변경 후 저장
    if (err) throw err;
    console.log(rows);
    let db_likestate = rows[0].likestate; // db의 likestate 값

    let likestate_obj = JSON.parse(db_likestate); // db의 likestate값을 뽑아내기 위해서 obj형태로 바꾸기
    let likeUsers = likestate_obj.likeUsers; // 좋아요를 누른 사람들 목록

    console.log('likeUser값:',likeUsers.length);

    if (likeUsers.length) {
      console.log("likeUsers값이 있습니다.")
      let insertValArr = [likeUsers];
      boardLikeModel.likeUserInfo(insertValArr, function (err, rows) { // db에 likestate 변경 후 저장
        if (err) throw err;
        res.send(rows);
      });
    } else {
      console.log("likeUsers값이 없습니다.")
      res.send();
    }
  });
}
