import React, { useEffect, useState } from 'react';

import { useLocation } from "react-router-dom";

import axios from "axios";
import io from 'socket.io-client'

import styled from "styled-components"; // styled in js


const chat = styled.h3`
background-color: green
`;



function Chat() {
  let [namespace, setNamespace] = useState('');

  const [state2, setState2] = useState({message: '', nickname: ''})
  const [chat2, setChat2] = useState([]);

  let [last_chat, setLastChat] = useState(''); // 가장 마지막 채팅내용을 저장

  let [nickname, setNickname] = useState(); // 현재 로그인되어있는 유저의 닉네임
  let [logined_user_id, setLoginedUserId] = useState('coding'); // 현재 로그인되어있는 유저의 아이디

  // let nickname;
  // let logined_user_id;

  function nickname_print() {
    axios.get('http://localhost:5000/login/authentication/nickname') // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      // nickname = response.data.nickname; // 현재 로그인되어있는 닉네임 설정
      // logined_user_id = response.data.user_id; // 현재 로그인되어있는 아이디 설정
      setNickname(response.data.nickname)
      setLoginedUserId(response.data.user_id)

      console.log('닉네임값:', nickname);
      
      chat_load();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const location = useLocation();
  console.log('아이디', location.state);
  const location_state = location.state;

  let user_id = location_state.user_id; // 이 게시글을 작성한 유저의 아이디
  let content_num = String(location_state.content_num); // 현재 게시글 번호
  console.log(user_id); 
  console.log(nickname);
  console.log(typeof(content_num));




  // const socket = io.connect('http://localhost:5000',{
  //   cors: { origin: '*' }
  // });


  const userSocket = io.connect("http://localhost:5000/" + content_num, { // 네임스페이스로 방 구분
    cors: { origin: '*' }
  });


  // useEffect(() => {
  //   socket.on('message', ({name, message}) => {
  //     setChat([...chat, {name, message}])
  //   })
  // })

  useEffect(() => {
    console.log("logined_user_id:",logined_user_id )
    userSocket.on(logined_user_id, ({nickname, message}) => {
      setLastChat(message); // 가장 마지막에 보낸 채팅의 내용을 저장
      setChat2([...chat2, {nickname, message}])
      console.log(chat2)
    })
  })



  // const renderChat = () => {
  //   return chat.map(({name, message}, index) => (
  //     <div key={index}>
  //       <h3>
  //         {name}: <span>{message}</span>
  //       </h3>
  //     </div>
  //   ))
  // }

  const renderChat2 = () => {
    console.log(chat2);
    return chat2.map(({nickname, message}, index) => (
      <div key={index}>
        <h3>
          {nickname}: <span>{message}</span>
        </h3>
      </div>
    ))
  }


  const onTextChange = e => {
    setState2({...state2, nickname: nickname, message: e.target.value})
    console.log(state2);
  }


  // const onMessageSubmit = (e) => {
  //   e.preventDefault()
  //   const {name, message} = state
  //   socket.emit('message', {name, message})
  //   setState({message: '', name })
  // }

  const onMessageSubmit2 = (e) => {
    e.preventDefault()
    const {nickname, message} = state2
    userSocket.emit(logined_user_id, {nickname, message})
    setState2({message: '', nickname: nickname })
  }


  function test() { //게시글 번호에 해당하는 네임스페이스 만들기
    axios.get(`http://localhost:5000/chat_namespace`, {
      params: {
        content_num: content_num
      }   
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response);
      setNamespace(content_num);
    })
    .catch(function (error) {
      console.log(error);
    });
  }



  function chat_save() {
    console.log("채팅 저장하는 작업하기")
    let send_val = {
      seller_user_id: user_id,
      content_num: content_num, 
      participant_user_id: logined_user_id,
      chat_content: chat2,
      last_chat: last_chat
    }
    axios.post(`http://localhost:5000/chat`, {
      send_val
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  // 최초로 한 번만 실행되면 됨.
  function chat_load() {
    console.log("채팅 불러오는 작업하기")
    axios.get(`http://localhost:5000/chat`, {
      params: {
        seller_user_id: user_id,
        content_num: content_num, 
        participant_user_id: logined_user_id,
      }
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data[0].chat_content);
      let chat_content_array = JSON.parse(response.data[0].chat_content)
      setChat2(chat_content_array)
    })
    .catch(function (error) {
      console.log(error);
    });

  }





  useEffect(() => { nickname_print(); test();}, []) 
  // useEffect(() => { chat_save(); }, [chat2]) 




  return (
    <>
      <form onSubmit={onMessageSubmit2}>
        <h1>Messanger</h1>
        <div>
          <input 
            name="message" 
            onChange={e => onTextChange(e)} 
            value={state2.message} 
            label="Message" 
          />
        </div>
        <button onClick={chat_save}>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        <h3>{content_num}채팅방입니다.</h3>
        {renderChat2()}
      </div>
    </>
  );
}

export default Chat;