import React, { useEffect, useState } from 'react';

import { useLocation, Link, useNavigate } from "react-router-dom";

import axios from "axios";
import io, { Socket } from 'socket.io-client'

import styled from "styled-components"; // styled in js

const Profile = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 70%;
`;

function Own_chat_list() {
  
  const location = useLocation();
  const location_state = location.state;

  let user_id = location_state.user_id; // 이 게시글을 작성한 유저의 아이디
  let content_num = String(location_state.content_num); // 현재 게시글 번호

  let [chat_list, setChatList] = useState([]);
  
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

  // content_num == 2 인 경우

  return (
    <>
      <h2>채팅 리스트 확인</h2>
      <table>
          <thead>
            <tr>
              {/* <th className="num">번호</th> */}
              <th className="writer">작성자</th>
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
                      <td className="participant" id="participant"><Profile src={x.profile === "\\image\\default_profile.png" ? x.profile : "http://localhost:5000/" + x.profile}></Profile>{x.participant_user_id}</td>
                      <td className="last_chat">{x.last_chat}</td>
                      <td><input type="button" value="채팅하기" onClick={ () => {navigate('/chat', {state:{ user_id: user_id, content_num: content_num, participant_user_id: x.participant_user_id }})} } /></td>
                      {/* <td className="date">{x.date}</td> */}
                    </tr>   
                  )        
              })}
        </tbody>
      </table>
    </>
  );
}

export default Own_chat_list;