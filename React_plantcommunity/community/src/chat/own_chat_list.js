import React, { useEffect, useState } from 'react';

import { useLocation, Link, useNavigate } from "react-router-dom";

import axios from "axios";
import io, { Socket } from 'socket.io-client'

import styled from "styled-components"; // styled in js

import './own_chat_list.css';

import ChatContents1 from "./chat1";

const Profile = styled.img`
  width: 50px;
  height: 50px;
  /* border-radius: 70%; */
  border-radius: 10px;
`;

const Test = styled.div`
display: flex;
flex-direction: row;
height: 100%;
/* background-color: aqua; */
`;

const ChatList = styled.div`
width: 30%;
height: 100%;
`;

const ChatContents = styled.div`
width:70%;
height: 100vh;
background-color: rgb(231, 231, 231);
padding: 30px;
box-sizing: border-box;
`;



function Own_chat_list() {
  
  const location = useLocation();
  const location_state = location.state;

  let user_id = location_state.user_id; // 이 게시글을 작성한 유저의 아이디
  let content_num = String(location_state.content_num); // 현재 게시글 번호

  let [chat_list, setChatList] = useState([]);

  let [participant, setParticipant] = useState('');
  
  console.log(content_num)

  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  function chat_list_print() {
    axios.get('http://localhost:5000/chat/list', {
      params: {
        seller_user_id: user_id,
        content_num: content_num
      }
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      const data = [...response.data];
      setChatList(data)
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => { chat_list_print(); }, []) 
  useEffect(() => { each_chat_load(); }, [participant]) 

  function each_chat_load() {
    if (participant === '') {
      return(
        <>
          <p>채팅이 없습니다.</p>
        </>
      )
    } else {
      return(
        <>
          <ChatContents1 user_id={user_id} content_num={content_num} participant_user_id={participant}></ChatContents1>
        </>
      )
    } 
  } 

  return (
    <>
      <Test>
        <ChatList>
          <table>
              <thead>
                <tr>
                  {/* <th className="num">번호</th> */}
                  {/* <th className="writer">작성자</th> */}
                  <th className="content_title" colSpan="2">채팅 내용</th>       
                  {/* <th className="date">날짜</th>> */}
                </tr>
              </thead>
              <tbody>
                {chat_list.map((x) => {
                      // let link = `/plant_info_share/contents/${x.num}`;

                      return (
                        <tr>
                          {/* <td className="num">{x.num}</td> */}
                          <td className="participant" id="participant">
                            <Profile src={x.profile === "\\image\\default_profile.png" ? x.profile : "image/default_profile.png"}></Profile>
                            {x.participant_user_id}
                          </td>
                          <td className="last_chat" onClick={() => {setParticipant(x.participant_user_id); console.log(participant)}}>{x.last_chat}</td>
                          {/* onClick={ () => {navigate('/chat', {state:{ user_id: user_id, content_num: content_num, participant_user_id: x.participant_user_id }})} } */}
                          {/* <td><input type="button" value="채팅하기" /></td> */}
                          {/* <td className="date">{x.date}</td> */}
                        </tr>   
                      )        
                  })}
            </tbody>
          </table>
        </ChatList>
        <ChatContents>
          {each_chat_load()}
          {/* <ChatContents1 user_id={user_id} content_num={content_num} participant_user_id={participant}></ChatContents1> */}
        </ChatContents>
      </Test>
    </>
  );
}

export default Own_chat_list;