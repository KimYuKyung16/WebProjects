
// router.use(express.json()); 

let total_contents; // 총 게시글의 개수

const { contentsCount, listDefault, listSearch } = require("../models/boards.js");
const { contentRead, clickCount, contentDelete } = require("../models/boards.js");

/* 2. 게시판에 쓰여진 글 목록 출력 */
exports.listGetMid = (req, res) => { 
  // 1) 게시판에 쓰여진 글 총 개수 출력
  contentsCount(req.params.board, function (err, result) {
    if (err) throw err;
    total_contents = result;
  });

  // 2) 게시판에 쓰여진 글 목록 출력
  let whatfunction = req.query.function; // 기본 출력인지 검색 출력인지
  let search_val = `%${req.query.search_val}%`; // 검색 단어

  let one_page_contents = parseInt(req.query.one_page_contents); // 한 페이지당 게시글 개수

  let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
  let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
  remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

  let current_page = parseInt(req.query.current_page); // 현재 페이지
  let start_value = (current_page-1) * one_page_contents; // 시작값
  let output_num; // 출력 개수

  if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
    output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
  } else { // 현재 페이지가 마지막 페이지가 아니라면 
    output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
  }

  const board = req.params.board; // 쿼리스트링으로 들어온 board 변수의 값

  if (whatfunction === 'default') { // 기본 리스트 출력일 경우
    let insertValArr = [board, start_value, output_num];
    listDefault(insertValArr, function (err, rows) {
      if (err) throw err;
      console.log(rows);
      res.send(rows);
    });
  } else { // 검색 리스트 출력일 경우
    let insertValArr = [board, search_val, start_value, output_num];
    listSearch(insertValArr, function (err, rows) {
      if (err) throw err;
      console.log(rows);
      res.send(rows);
    });
  } 
}

/* 3. 게시글 읽기, 조회수 올리기, 게시글 삭제 */
exports.contentGetMid = (req, res) => { // 게시글 읽기
  let insertValArr = [req.params.board, req.params.num];
  contentRead(insertValArr, function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
}
exports.clickcountPostMid = (req, res) => { // 조회수 올리기
  let clickcount = req.body.params.clickcount;
  let insertValArr = [clickcount, req.params.board, req.params.num];

  clickCount(insertValArr, function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
}
exports.contentDeleteMid = (req, res) => { // 게시글 삭제
  let insertValArr = [req.params.board, req.params.num];

  contentDelete(insertValArr, function (err, rows) {
    if (err) throw err;
    res.send({status: 'success'});
  });
}

