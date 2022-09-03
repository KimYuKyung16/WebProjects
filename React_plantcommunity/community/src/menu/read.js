import React, { useEffect, useState } from 'react';
import axios from "axios";
// import './signup.css';
import { useNavigate, useParams } from "react-router-dom";

function Read() {

  // const navigate = useNavigate(); // 페이지 이동을 위해 필요
  let params = useParams();
  let board = params.board;
  let num = params.num;

  let [content, setContent] = useState([]);
  // content_request();
  

  function content_request() { // 해당 번호에 해당하는 게시글
    axios.get(`http://localhost:5000/board/${board}/contents/${num}`, { // 서버로 post 요청
      params: {
        // current_page: current_page, 
        // one_page_contents: one_page_contents
      }  
    })
    .then(function (response) { // 서버에서 응답이 왔을 때
      // console.log(response.data)
      setContent(response.data[0]);
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  useEffect(() => { content_request() }, [content])

  return (
      <>  
        <div id="board_title">
          <h2>
            게시판
          </h2>
        </div>

        <ul id="write_list">
          <li id="title-li1">
            <p>제목</p>
            <input name="title" id="title" type="text" value={content.title}/>
          </li>
          <li id="board-li2">
            <ul id="user_info_list">
              <li>작성자:{content.writer}</li>
              <li>날짜/시간:{content.date + ' ' + content.time}</li>
              <li>조회수:{content.clickcount}</li>
                <div id="action_div">
                  <li><input id="revise_btn" type="button" value="수정" /></li>
                  <li><input id="delete_btn" type="button" value="삭제" /></li>
                </div>
            </ul>
          </li>
          <li id="content-li3">
            <p>내용</p>
            <textarea name="codntent" id="content" value={content.content}></textarea>

            <input type="hidden" name="num" />

            <input type="hidden" name="num" />

          </li>
        </ul>
      </>
  );

}

export default Read;
