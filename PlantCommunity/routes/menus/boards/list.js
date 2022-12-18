/**
 * 1. 게시판에 쓰여진 글 총 개수 출력
 * 2. 게시판에 쓰여진 글 목록 출력
 */


const express = require('express');
const router = express.Router();
const boardsMid = require('../../../controllers/boards.controller.js'); // 컨트롤러

router.use(express.json()); 

/* 2. 게시판에 쓰여진 글 목록 출력 */
router.get('/:board', boardsMid.listGetMid);

/* 3. 게시글 읽기, 조회수 올리기, 게시글 삭제 */
router.route('/:board/contents/:num') 
  .get(boardsMid.contentGetMid) // 1) 게시글 읽기
  .post(boardsMid.clickcountPostMid) // 2) 조회수 올리기
  .delete(boardsMid.contentDeleteMid) // 3) 게시글 삭제

module.exports = router // 모듈로 리턴