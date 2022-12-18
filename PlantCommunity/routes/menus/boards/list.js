/**
 * 1. 게시판에 쓰여진 글 총 개수 출력
 * 2. 게시판에 쓰여진 글 목록 출력
 */


const express = require('express');
const router = express.Router();
const boardsMid = require('../../../controllers/boards.controller.js'); // 게시판 컨트롤러
const boardsLikeMid = require('../../../controllers/boards.like.controller.js'); // 게시판 좋아요 컨트롤러

router.use(express.json()); 

/* 1. 게시판에 쓰여진 글 총 개수 출력 */
router.get('/:board/total_contents', boardsMid.contentsCountMid);

/* 2. 게시판에 쓰여진 글 목록 출력 */
router.get('/:board', boardsMid.listGetMid);

/* 3. 게시글 읽기, 조회수 올리기, 게시글 삭제 */
router.route('/:board/contents/:num') 
  .get(boardsMid.contentGetMid) // 1) 게시글 읽기
  .post(boardsMid.clickcountPostMid) // 2) 조회수 올리기
  .delete(boardsMid.contentDeleteMid) // 3) 게시글 삭제


/************ 좋아요와 관련 */  

/* 좋아요 기능*/
router.route('/:board/contents/:num/like') 
  .get(boardsLikeMid.curLikeGetMid) // 1) 현재 좋아요 상태가 어떤지 표시
  .post(boardsLikeMid.likePostMid) // 2) 좋아요 기능

// 3) 좋아요 누른 사람들 목록 출력
router.get('/:board/contents/:num/like_list', boardsMid.listGetMid);










module.exports = router // 모듈로 리턴