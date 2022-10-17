import React, { useEffect, useState } from 'react';
import axios from "axios";
import './read.css';
import { useNavigate, useParams } from "react-router-dom";

import Header from '../layout/header';
import { colorConfig } from "../config/color"; // 홈페이지 색감 정보

import cookies from 'react-cookies'; // 쿠키

import styled from "styled-components"; // styled in js


const Write_Comment = styled.div`
display: flex;
flex-direction: column;
border: 2px solid rgb(164, 200, 165);
border-radius: 3px;
padding: 10px;
margin-bottom: 20px;

* {

  &:nth-child(1) { // 닉네임
    color: rgb(100, 100, 100);
    font-weight: bold;
    font-size: 1rem;
  }

  &:nth-child(2) { // 댓글 내용
    // width: 70%;
    // outline: none;
  }

  // &:nth-child(3) { // 등록 버튼
  //   font-size: 1.2rem;
  //   color: rgb(186, 218, 199);
  // }

}
`;



const LikePeople = styled.div`
display: ${(props) => props.active || 'flex'};
position: absolute;
top: 30px;
right: 0;
background-color: rgb(227, 227, 227);
width: 40%;
z-index: 1;
padding: 20px;
border: 1px solid rgb(171, 171, 171);
border-radius: 5px;
`;


const Reply_div = styled.div`
display: ${(props) => props.display_val || 'none'};
border: 1px solid rgb(107, 164, 255);
border-radius: 3px;
margin: 10px 0 10px 60px;
`;

const Logined_user = styled.div`
display: ${(props) => props.div_state.logined_user_div || 'none'};
`;

const Like = styled.div`
display: ${(props) => props.div_state.like_div || 'flex'};
flex-direction: row;
`;

const Other = styled.div`
display: block;
width: 20px;
height: 20px;
background: #ea2027;
transform: rotate(45deg);

&:before,
&:after {
  content: "";
  width: 20px;
  height: 20px;
  position: absolute;
  border-radius: 50%;
  background: #ea2027;
}

&:before {
  left: -50%;
}

&:after {
  top: -50%;
}

`;

const Heart = styled.img`
width: 30px;
height: 30px;
`;


axios.defaults.headers.common['cookies'] = encodeURIComponent(cookies.load('login_cookie')); // for all requests


function Read() {

  const navigate = useNavigate(); // 페이지 이동을 위해 필요
  let params = useParams();
  let board = params.board;
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


  // let [like, setLike] = useState(); // 좋아요 표시
  let [likecount, setLikecount] = useState(); // 좋아요 개수
  let [like_state, setLikeState] = useState(); // 현재 좋아요 상태
  let [heart_src, setHeartSrc] = useState("/image/empty_heart.png"); // 하트 이미지 경로
  let [like_list, setLikelist] = useState([]);

  let [like_display, setLikeDisplay] = useState('none');
  let [click_count, setClickCount] = useState(1);

  let [div_state, setDivState] = useState({logined_user_div: 'none', like_div: 'none'});


  let [user_id, setUserID] = useState(); // 현재 로그인된 사용자의 아이디

  // 좋아요 표시를 눌렀을 때 : 현재 user_id 값을 db의 like_people 배열에 저장, likecount +1
  function like_request() {
    axios.post(`http://localhost:5000/board/${board}/contents/${board_num}/like`, {
      user_id: user_id,
      like_state: like_state
    })
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response);
      like_state_request();
      like_list_request();
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  // 좋아요 표시의 상태 : 
  function like_state_request() {
    axios.get(`http://localhost:5000/board/${board}/contents/${board_num}/like`)
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data[0].likestate);
      let likestate_object = JSON.parse(response.data[0].likestate);
      setLikecount(likestate_object.likecount);

      let likeUsers = likestate_object.likeUsers;

      if (response.data[0].likestate === '0') { // db의 likestate값이 없을 경우
        setHeartSrc("/image/empty_heart.png");
        setLikeState(false)
      } 


      if (likeUsers.includes(user_id)) { // 좋아요를 표시한 사람들 중에 해당 아이디가 존재할 경우
        console.log("해당 아이디가 존재")
        setHeartSrc("/image/full_heart.png");
        setLikeState(true)
      } else {
        console.log("해당 아이디가 존재하지않음")
        setHeartSrc("/image/empty_heart.png");
        setLikeState(false)
      }

     

    })
    .catch(function (error) {
      console.log(error);
    });
  }


  function like_list_request() {
    axios.get(`http://localhost:5000/board/${board}/contents/${board_num}/like_list`)
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response);
      const data = [...response.data];
      console.log(data);

      if (data.length === 0) { // 리스트에 아무도 없을 경우    
        setLikelist(['좋아요를 누른 사람이 없습니다.'])
      } else {
        setLikelist(data)
      }
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function like_div_display() {
    setClickCount(click_count + 1);

    if (click_count % 2 == 1) {
      console.log('보임');
      setLikeDisplay('flex');
    } else {
      console.log('안보임');
      setLikeDisplay('none');
    }
  }


  
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
      setContent(response.data[0]);
      // setLike(response.data[0].likecount); // 좋아요 수 반영


      //조회수
      let clickcount = response.data[0].clickcount;
      clickcount = clickcount + 1;
      console.log(clickcount)

      axios.post(`http://localhost:5000/board/${board}/contents/${board_num}`, {
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
    axios.post(`http://localhost:5000/board/${board}/contents/${board_num}/comment`, {
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
    axios.post(`http://localhost:5000/board/${board}/contents/${board_num}/comment/reply/${comment_num}`, {
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
    axios.get(`http://localhost:5000/board/${board}/contents/${board_num}/comment`) // 서버로 post 요청
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
    axios.get(`http://localhost:5000/board/${board}/contents/${board_num}/comment/reply/${req_comment_num}`)
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

  // 이 함수에서 현재 로그인된 유저의 아이디 값과 닉네임값을 가져올 수 있다.
  function nickname_print() {
    axios.get('http://localhost:5000/login/authentication/nickname') // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      setNickname(response.data.nickname);
      setUserID(response.data.user_id);
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  
  function div_change() {
    // 현재 로그인된 아이디와 이 글 작성자의 아이디가 같다면
    if (user_id === content.user_id) {
      setDivState({logined_user_div: 'flex', like_div: 'none'});
    } else {
      setDivState({logined_user_div: 'none', like_div: 'flex'});
    }

    console.log(div_state);
  }

  function delete_content() {
    axios.delete(`http://localhost:5000/board/${board}/contents/${board_num}`)
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data);
      if (response.data.status === 'success') {
        console.log("게시글이 성공적으로 삭제되었습니다.")
        alert("게시글이 성공적으로 삭제되었습니다.")
        navigate('/plant_info_share')
      } else {
        console.log("게시글 삭제에 실패했습니다.")
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  

 
  useEffect(() => { content_request(); comment_print(); comment_reply_print(); nickname_print(); like_list_request(); }, [])
  useEffect(() => { comment_print(); }, [comment_count])
  useEffect(() => { comment_reply_print(); }, [reply_count])

  useEffect(() => { test(); }, [content])
  useEffect(() => { like_state_request(); div_change();}, [user_id])




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



                <LikePeople active={like_display}>
                  <table>
                    {              
                      like_list.map((x, index) => {
                        if (typeof(x) == 'string') { 
                          console.log(like_list.length)
                          return(
                            <tr>
                              <p>좋아요를 누른 사람이 없습니다.</p>
                            </tr>
                          )
                        } else {
                          console.log(like_list.length)
                          return(
                            <>
                              <tr className='like_list_row'>
                                <td class="tr"><img class="profile_list" src={'http://localhost:5000/' + x.profile} /></td>
                                <td>{x.nickname}</td>
                              </tr>
                            </>
                          )
                        }
                        
                      })
                    }
                  </table>
                </LikePeople>


                <Logined_user div_state={div_state}>
                  <div class="like_div">
                    <Heart src="/image/full_heart.png" />
                    <p onClick={like_div_display}>{likecount}</p>
                  </div>
                  <input id="revise_btn" type="button" value="수정" onClick={
                    () => {
                      navigate(`/${board}/contents/${board_num}/revise`)
                    }
                  }/>
                  <input id="delete_btn" type="button" value="삭제" onClick={
                    () => {
                      if (window.confirm("정말 게시글을 삭제하겠습니까?")) {                
                        delete_content();                
                      } else {  }              
                    }
                  }/>
                </Logined_user>
                <Like div_state={div_state}>
                  <Heart src={heart_src} onClick={like_request} />
                  <p onClick={like_div_display}>{likecount}</p>
                </Like>

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
            <Write_Comment> {/* 댓글 작성 칸 */}
              <p>{ nickname }</p>
              <input id="comment_input" className="comment_input" onChange={onChangeComment} type="text" placeholder='댓글 내용을 입력하세요'/>
              <input className="comment_input_btn" onClick={comment_request} type="button" value="등록"/>
            </Write_Comment>
            <div class="comment_div"> {/* 댓글 목록 div */}
              {
                comments.map((x, index) => {
                  return(
                    <div id="total_div">
                      <div id="writer_date_div"> {/* 작성자, 날짜 등 댓글의 상세사항*/}
                        <p>{x.writer}</p>
                        <p>{x.date + ' ' + x.time}</p>
                        <p onClick={() => { what_index(index); setCommentnum(x.num) }}>답글쓰기</p>
                      </div>
                      <div id="comment_div"> {/* 현재 댓글 내용 */}
                        <div>{x.comment}</div>
                      </div>

                      <Reply_div display_val={[...comment_display][index]}> {/* 답글 작성 칸 div */}
                        <div className='input_div2'>
                          <p>{nickname}</p>
                          <input id="reply_input" className="comment_input" onChange={onChangeComment2} type="text" placeholder='댓글 내용을 입력하세요'/>
                          <input className="comment_input_btn" onClick={comment_reply_request} type="button" value="등록"/>
                        </div>
                      </Reply_div>

                      <div class="reply"> {/* 답글 목록 div */}
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
      </>
  );

}

export default Read;
