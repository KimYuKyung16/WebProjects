import React, { useEffect, useState } from 'react';
import axios from "axios";
import './read.css';
import { useNavigate, useParams } from "react-router-dom";

import Header from '../layout/header';
import { colorConfig } from "../config/color"; // 홈페이지 색감 정보

import cookies from 'react-cookies'; // 쿠키

import styled from "styled-components"; // styled in js



const Reply_div = styled.div`
display: ${(props) => props.display_val || 'none'};
border: 1px solid rgb(107, 164, 255);
border-radius: 3px;
margin: 10px 0 10px 100px;
`;



axios.defaults.headers.common['cookies'] = encodeURIComponent(cookies.load('login_cookie')); // for all requests


function Read() {

  // const navigate = useNavigate(); // 페이지 이동을 위해 필요
  let params = useParams();
  let board = params.board;
  let board_num = params.num;

  let [content, setContent] = useState([]);
  let [comments, setComments] = useState([]); // 댓글 목록
  // content_request();

  let [div_display, setDisplay] = useState('none');

  let [comment_display, setCommentDisplay] = useState(Array(comments.length).fill('none')) // none인지 block인지 확인하는 배열

  console.log(div_display)


  
  function date(){ //날짜를 구해주는 함수
    var today = new Date();

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + '.' + month  + '.' + day;
    return dateString
}

  function time(){ //시간을 구해주는 함수
      var today = new Date();   

      var hours = ('0' + today.getHours()).slice(-2); 
      var minutes = ('0' + today.getMinutes()).slice(-2);
      var seconds = ('0' + today.getSeconds()).slice(-2); 
      
      var timeString = hours + ':' + minutes  + ':' + seconds;
      return timeString
  }


  function content_request() { // 해당 번호에 해당하는 게시글
    axios.get(`http://localhost:5000/board/${board}/contents/${board_num}`, { // 서버로 post 요청
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


  function test() {
    let html_content = document.getElementById("content");

    var strHtml = "<div>";
    strHtml += content.content;
    strHtml += "</div>";
    
    html_content.innerHTML = strHtml;
  }

  let [comment, setComment] = useState(); // 댓글 내용

  const onChangeComment = (e) => { // 글 저장 게시판을 변경할 때마다
    setComment(e.target.value);
  }

  function comment_request() {
    const comments_send_val = {
      comment: comment,
      // writer: cookies.load('nickname'),
      date: date(),
      time: time(),
    }
    // 댓글 내용 입력됐는지 안됐는지 확인하는 작업 넣기
    axios.post(`http://localhost:5000/board/${board}/contents/${board_num}/comment`, {
      comments_send_val
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data);
      // const data = [...response.data];

      // setComments(data);


    })
    .catch(function (error) {
      console.log(error);
    });

  }

  function reply_click(index) {
    setDisplay('block');
    console.log(index)
  }

  function what_index(index) {
    let comment_display_copy = [...comment_display];
    if (comment_display_copy[index] == 'block') {
      comment_display_copy[index] = 'none';
    } else {
      comment_display_copy[index] = 'block';
    }
    setCommentDisplay(comment_display_copy);
  }




  function comment_print() {
    axios.get(`http://localhost:5000/board/${board}/contents/${board_num}/comment`) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data);
      const data = [...response.data];
      setComments(data);


    })
    .catch(function (error) {
      console.log(error);
    });
  }

 
  useEffect(() => { content_request(); comment_print(); }, [])
  useEffect(() => { test(); }, [content])




  /* 홈페이지 메인 타이틀 세팅값 */
  const title_setting = {
    title_backcolor: colorConfig.main_color,
    title_textcolor: colorConfig.sub_color
  }

  /* 네비게이션바 세팅값 */
  const navbar_setting = {
    navbar_backcolor: colorConfig.main_color,
    navbar_textcolor: colorConfig.sub_color
  }

  return (
      <>  
        <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
        <div id="test">
          <div id="board_title">
            <h2>＞게시판</h2>
          </div>

          <ul id="write_list">
            <li id="title-li1">
              <h2 id="title">{content.title}</h2>
            </li>
            <li id="board-li2">
              <ul id="user_info_list">
                <li>작성자:{content.writer}</li>
                <li>날짜/시간:{content.date + ' ' + content.time}</li>
                <li>조회수:{content.clickcount}</li>
              </ul>
              <div id="action_div">
                <input id="revise_btn" type="button" value="수정" />
                <input id="delete_btn" type="button" value="삭제" />
              </div>
            </li>
            <li id="content-li3">
              <div id="content"></div>
            </li>
          </ul>
        </div>

        <div id="line_div">
          <hr></hr>
        </div>
        

        <div id="total_comment_div"> {/* 댓글 */}
          <h3>댓글</h3>
          <div className='input_div'>
            <p>닉네임: {cookies.load('nickname')}</p>
            <input className="comment_input" onChange={onChangeComment} type="text" placeholder='댓글 내용을 입력하세요'/>
            <input className="comment_input_btn" onClick={comment_request} type="button" value="등록"/>
          </div>
          <div class="comment_div"> {/* 댓글 목록 div */}
            {

              comments.map((x, index) => (
                <div id="total_div">
                  <div id="writer_date_div">
                    <p>{x.writer}</p>
                    <p>{x.date + ' ' + x.time}</p>
                    <p onClick={() => what_index(index)}>답글쓰기</p>
                  </div>
                  <div id="comment_div">
                    <div>{x.comment}</div>
                  </div>

                  <Reply_div display_val={[...comment_display][index]}>
                    <div className='input_div2'>
                      <p>닉네임: {cookies.load('nickname')}</p>
                      <input className="comment_input" onChange={onChangeComment} type="text" placeholder='댓글 내용을 입력하세요'/>
                      <input className="comment_input_btn" onClick={comment_request} type="button" value="등록"/>
                    </div>
                  </Reply_div>
                </div>
              ))
            }
          </div>

        </div>
      </>
  );

}

export default Read;
