import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Header from '../layout/header';
import { colorConfig } from "../config/color"; // 홈페이지 색감 정보

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용 위해 필요
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'; // 내 정보 아이콘
import { faBars } from '@fortawesome/free-solid-svg-icons'; // 햄버거바 아이콘
import { faComment } from '@fortawesome/free-solid-svg-icons'; // 채팅 아이콘

import cookies from 'react-cookies'; // 쿠키

import styled from "styled-components"; // styled in js



const Reply_div = styled.div`
display: ${(props) => props.display_val || 'none'};
border: 1px solid rgb(107, 164, 255);
border-radius: 3px;
margin: 10px 0 10px 60px;
`;

const ChatBtn = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
font-size: 30px;
position: fixed;
bottom: 20px;
right: 10px;
background-color: rgb(145, 170, 155);
border: 1px solid white;
color: white;
width: 80px;
height: 80px;
border-radius: 100px;
cursor: pointer;

* {
  &:nth-child(2) { // 닉네임
    color: white;
    font-weight: bold;
    font-size: 0.7rem;
  }

}
`;


axios.defaults.headers.common['cookies'] = encodeURIComponent(cookies.load('login_cookie')); // for all requests


function MarketRead() {

  const navigate = useNavigate(); // 페이지 이동을 위해 필요
  let params = useParams();
  // let board = params.board;
  let board_num = params.num;

  let [content, setContent] = useState([]);
  let [comments, setComments] = useState([]); // 댓글 목록
  let [reply, setReply] = useState([]); // 댓글 목록
  // content_request();

  let [div_display, setDisplay] = useState('none');

  let [comment_display, setCommentDisplay] = useState(Array(comments.length).fill('none')) // none인지 block인지 확인하는 배열

  console.log(div_display)



  let [comment_count, setCommentCount] = useState(0); 
  let [reply_count, setReplyCount] = useState(0); 


  
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
    axios.get(`http://localhost:5000/board/plant_market/contents/${board_num}`, { // 서버로 post 요청
      params: {
        // current_page: current_page, 
        // one_page_contents: one_page_contents
      }  
    })
    .then(function (response) { // 서버에서 응답이 왔을 때
      setContent(response.data[0]);

      //조회수
      let clickcount = response.data[0].clickcount;
      clickcount = clickcount + 1;
      console.log(clickcount)

      axios.post(`http://localhost:5000/board/plant_market/contents/${board_num}`, {
        params: {
          clickcount: clickcount
        }
      }) // 서버로 post 요청
      .then(function (response) { // 서버에서 응답이 왔을 때
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });


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
  let [comment2, setComment2] = useState(); // 댓글의 답글 내용

  let comment_input = document.getElementById("comment_input"); // 댓글 작성칸 value값을 구하기 위해 추가
  let reply_input = document.getElementById("reply_input"); // 답글 작성칸 value값을 구하기 위해 추가

  const onChangeComment = (e) => { // 댓글을 바꿀 때마다
    setComment(e.target.value);
  }

  const onChangeComment2 = (e) => { // 댓글의 답글을 바꿀 때마다
    setComment2(e.target.value);
  }


  function comment_request() {
    const comments_send_val = {
      comment: comment,
      // writer: cookies.load('nickname'),
      date: date(),
      time: time(),
    }
    // 댓글 내용 입력됐는지 안됐는지 확인하는 작업 넣기
    axios.post(`http://localhost:5000/board/plant_market/contents/${board_num}/comment`, {
      comments_send_val
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data);

      // 제대로 저장이 됐으면 댓글 쓰는 칸에 있는 값 초기화
      setComment('');
      comment_input.value = '';


      // const data = [...response.data];

      // setComments(data);

      // 댓글을 저장하면 count + 1해서 댓글 개수가 바뀐 것을 알려줌.
      setCommentCount((comment_count) => comment_count+1);

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  let [comment_num, setCommentnum] = useState();

  function comment_reply_request() {
    const comments_send_val2 = {
      comment: comment2,
      date: date(),
      time: time(),
    }
    // 댓글 내용 입력됐는지 안됐는지 확인하는 작업 넣기
    axios.post(`http://localhost:5000/board/plant_market/contents/${board_num}/comment/reply/${comment_num}`, {
      comments_send_val2
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data);

      setComment2('');
      reply_input.value = '';

      // const data = [...response.data];

      // setComments(data);

      setReplyCount((reply_count) => reply_count+1);

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
    // setCommentnum(index); // 현재 선택된 댓글의 번호 설정
  }


  /* comment의 개수 구하는 함수 생성
  comment의 개수가 바뀌면 comment_print 실행
  comment_print 내에서 comment의 개수 구하는 함수 실행
  */

  

  function comment_print() {
    axios.get(`http://localhost:5000/board/plant_market/contents/${board_num}/comment`) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data);
      console.log(response.data[0]);  

      const data = [...response.data];
      setComments(data);


    })
    .catch(function (error) {
      console.log(error);
    });
  }


  function comment_reply_print(req_comment_num) {
    console.log("실행됨");
    axios.get(`http://localhost:5000/board/plant_market/contents/${board_num}/comment/reply/${req_comment_num}`)
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data); 


      const data = [...response.data];
      setReply(data);
      test2();

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  let what_num;

  function test2(num) {
    what_num = num;
    let filtered = reply.filter(reply_division);
    console.log(filtered);
    return filtered;
  }


  function reply_division(value) {
    console.log(value);
    return value.comment_num == what_num;
  }

  let [nickname, setNickname] = useState();
  let [logined_user_id, setLoginedUserId] = useState(''); // 현재 로그인되어있는 유저의 아이디


  function nickname_print() {
    axios.get('http://localhost:5000/login/authentication/nickname') // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      setNickname (response.data.nickname);
      setLoginedUserId(response.data.user_id)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function chat_navigate_option() {
    if (content.user_id === logined_user_id) { // 게시글 글쓴 사람과 로그인 된 아이디가 같으면
      navigate('/own_chat_list', {state:{ user_id: content.user_id, content_num: content.num }});
    } else {
      navigate('/chat', {state:{ user_id: content.user_id, content_num: content.num }})
    }
  }

 
  useEffect(() => { content_request(); comment_print(); comment_reply_print(); nickname_print();}, [])
  useEffect(() => { comment_print(); }, [comment_count])
  useEffect(() => { comment_reply_print(); }, [reply_count])

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
        <div id="total">
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
                <ChatBtn onClick={chat_navigate_option}>
                  <FontAwesomeIcon icon={faComment}/>
                  <p>채팅</p>
                </ChatBtn>
                
                {/* <FontAwesomeIcon icon="fa-solid fa-comment" /> */}
                  {/* <input id="revise_btn" type="button" value="수정" />
                  <input id="delete_btn" type="button" value="삭제" /> */}
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
              <p>{ nickname }</p>
              <input id="comment_input" className="comment_input" onChange={onChangeComment} type="text" placeholder='댓글 내용을 입력하세요'/>
              <input className="comment_input_btn" onClick={comment_request} type="button" value="등록"/>
            </div>
            <div class="comment_div"> {/* 댓글 목록 div */}
              {

                comments.map((x, index) => {
                  return(
                    <div id="total_div">
                      <div id="writer_date_div">
                        <p>{x.writer}</p>
                        <p>{x.date + ' ' + x.time}</p>
                        <p onClick={() => { what_index(index); setCommentnum(x.num) }}>답글쓰기</p>
                      </div>
                      <div id="comment_div">
                        <div>{x.comment}</div>
                      </div>

                      <Reply_div display_val={[...comment_display][index]}>
                        <div className='input_div2'>
                          <p>{nickname}</p>
                          <input id="reply_input" className="comment_input" onChange={onChangeComment2} type="text" placeholder='댓글 내용을 입력하세요'/>
                          <input className="comment_input_btn" onClick={comment_reply_request} type="button" value="등록"/>
                        </div>
                      </Reply_div>

                      <div class="reply">
                        {
                          test2(x.num).map((y) => {
                            return(
                              <>
                                <div class="reply_div">
                                  <div class="reply_writer_div">
                                    <p>{y.writer}</p>
                                    <p>{y.date + ' ' + y.time}</p>
                                  </div>
                                  <div class="reply_content">
                                    <div>{y.comment}</div>
                                  </div>
                                </div>
                              </>
                            )
                          })
                        }
                        
                        
                      </div>

                    </div>
                  )
                  
                })
              }
            </div>

          </div>
        </div> 
        {/* <ChatBtn type="button" value="채팅하기" onClick={chat_navigate_option}/> */}
        {/* <p>{content.user_id}</p> */}
      </>
  );

}

export default MarketRead;
