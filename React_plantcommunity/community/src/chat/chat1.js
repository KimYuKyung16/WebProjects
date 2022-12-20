import React, { useEffect, useState } from 'react';

import { useLocation } from "react-router-dom";

import axios from "axios";
import io, { Socket } from 'socket.io-client'

import styled from "styled-components"; // styled in js

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용 위해 필요
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'; // 내 정보 아이콘

import './chat.css';

import { useDidMountEffect } from './useDidMountEffect';


const Chat_content = styled.div`
display: flex;
justify-content: ${(props) => props.location};
width: 500px;
/* background-color: aqua; */
`;

const SubmitList = styled.form`
display: flex;
justify-content: space-between;
flex-direction: row;
position: absolute;
bottom: 30px;
width: 500px;
`;

const SubmitInput = styled.input`
display: flex;
width: 88%;
height: 40px;
`;

const SubmitBtn = styled.button`
display: flex;
justify-content: center;
align-items: center;
width: 10%;
background-color: rgb(51, 131, 201);
color: white;
border-radius: 10px;
border: none;
font-size: 1rem;
`;


const Message = styled.div`
background-color: ${(props) => props.backgroundcolor};
/* text-align: ${(props) => props.location}; */
/* display: flex; */
/* justify-content: ${(props) => props.location}; */
width: 300px;
padding: 10px;
margin: 5px 0px;
border-radius: 10px;
`;



function Chat(props) {
  let [namespace, setNamespace] = useState('');

  const [state2, setState2] = useState({logined_user_id: '', message: '', nickname: ''})
  const [chat2, setChat2] = useState([]);

  // const [current_chat, setCurrentChat] = useState([]);

  let [last_chat, setLastChat] = useState(''); // 가장 마지막 채팅내용을 저장

  let [nickname, setNickname] = useState(); // 현재 로그인되어있는 유저의 닉네임
  let [logined_user_id, setLoginedUserId] = useState(''); // 현재 로그인되어있는 유저의 아이디

  let user_id;
  let content_num;
  let participant_user_id;
  // let nickname;
  // let logined_user_id;

  const location = useLocation();
  let location_state;
  // console.log('아이디', location.state);
  // const location_state = location.state;

  // let user_id = location_state.user_id; // 이 게시글을 작성한 유저의 아이디
  // let content_num = String(location_state.content_num); // 현재 게시글 번호

  // let participant_user_id = location_state.participant_user_id;

  if (props.user_id === undefined) {
    location_state = location.state;

    user_id = location_state.user_id; // 이 게시글을 작성한 유저의 아이디
    content_num = String(location_state.content_num); // 현재 게시글 번호
    participant_user_id = location_state.participant_user_id;
  } else {
    user_id = props.user_id;
    content_num = String(props.content_num);
    participant_user_id = props.participant_user_id;
  }

  


  console.log(user_id); 
  console.log(nickname);
  console.log(typeof(content_num));
  console.log(participant_user_id); // 값이 없으면 undefined가 뜬다.

  function nickname_print() {
    axios.get('http://localhost:5000/login/authentication') // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data);
      if (response.data.authenticator === true) {
        setNickname(response.data.nickname)
        setLoginedUserId(response.data.user_id)
      } 
      
      if (user_id === response.data.user_id) { // 동일 아이디면
        // setLoginedUserId(participant_user_id)
        setNamespace(participant_user_id)
      } else {
        // setLoginedUserId(response.data.user_id)
        setNamespace(response.data.user_id)
      }
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }


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
    console.log(namespace)
    userSocket.on(namespace, ({logined_user_id, nickname, message}) => {
      console.log(message);
      setLastChat(message); // 가장 마지막에 보낸 채팅의 내용을 저장
      setChat2([...chat2, {id: logined_user_id, nickname: nickname, message: message}])
      // setCurrentChat([...current_chat, {user_id, nickname, message}]) // 현재 채팅만 저장
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

  // const renderChat2 = () => {
  //   console.log(chat2);
  //   return chat2.map(({nickname, message}, index) => (
  //     <div key={index}>
  //       <h3>
  //         {nickname}: <span>{message}</span>
  //       </h3>
  //     </div>
  //   ))
  // }


  const renderChat = () => {
    console.log(chat2);
    return chat2.map(({logined_user_id, nickname, message}, index) => (
      <div key={index}>
        <current_chat location={user_id}>
          <h3>
            {nickname}: <span>{message}</span>
          </h3>
         </current_chat>
       </div>

    ))
  }

  // const renderCurrentChat = () => {
  //   console.log(current_chat);
  //   return current_chat.map(({nickname, message}, index) => (
  //     <div key={index}>
  //        <h3>
  //          {nickname}: <span>{message}</span>
  //        </h3>
  //      </div>

  //   ))
  // }



  const onTextChange = e => {
    setState2({...state2, logined_user_id: logined_user_id, nickname: nickname, message: e.target.value})
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
    const {logined_user_id, nickname, message} = state2
    userSocket.emit(namespace, {logined_user_id, nickname, message})
    console.log(state2)
    setState2({message: '', nickname: nickname, logined_user_id: logined_user_id })
  }


  function test() { //게시글 번호에 해당하는 네임스페이스 만들기
    console.log(namespace)
    axios.get(`http://localhost:5000/chat_namespace`, {
      params: {
        content_num: content_num,
        user_id: namespace
      }   
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response);
      // setNamespace(content_num);
    
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  let [chatsave, setChatSave] = useState();

  function chat_save() {
    console.log("채팅 저장하는 작업하기")
    let send_val = {
      seller_user_id: user_id,
      content_num: content_num, 
      participant_user_id: namespace,
      chat_content: chat2,
      last_chat: last_chat
    }
    axios.post(`http://localhost:5000/chat`, {
      send_val
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      setChatSave(true);
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  }

    useEffect(() => {
    if (userSocket) {userSocket.disconnect()};
  }, [chatsave])


  // 최초로 한 번만 실행되면 됨.
  function chat_load() {
    console.log("채팅 불러오는 작업하기")

    console.log(logined_user_id)

    axios.get(`http://localhost:5000/chat`, {
      params: {
        seller_user_id: user_id,
        content_num: content_num, 
        participant_user_id: namespace,
      }
    }) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data[0]);
      let chat_content_array = JSON.parse(response.data[0].chat_content)
      // console.log(chat_content_array)
      
      // const result = chat_content_array.filter(x => x['nickname'] === '코딩하는김갱갱')
      // console.log(result)

      setChat2(chat_content_array)
      console.log(response.data[0].last_chat)
      setLastChat(response.data[0].last_chat);
    })
    .catch(function (error) {
      console.log(error);
    });

  }









  useEffect(() => { nickname_print();}, [participant_user_id]) 
  useEffect( 
    () => { chat_load(); test(); }
    , [namespace]
  );

  // useEffect( 
  //   () => { chat_save(); }
  //   , [chat2]
  // );

  useDidMountEffect(() => {
    chat_save(); 
  }, [chat2]);





  return (
    <>
    <div>
      <div className="render-chat">
        {/* <h1>Chat Log</h1> */}
        {/* <h3>{content_num}채팅방입니다.</h3> */}
        <>
        {
          chat2.map(({id, nickname, message}, index) => {
            console.log(id)
            return(
              <div key={index}>
                <Chat_content location={logined_user_id === id ? "right": "left" }>
                  {/* <p>{nickname}</p> */}
                  <Message location={logined_user_id === id ? "right": "left" } backgroundcolor={logined_user_id === id ? "rgb(186, 218, 199)": "rgb(205, 205, 205)"}>
                    <p>{message}</p>
                  </Message>               
                </Chat_content>
              </div>
            )
          })
        }
        </>       
      </div>
      <SubmitList onSubmit={onMessageSubmit2}>
        {/* <h1>Messanger</h1> */}
          <SubmitInput 
            name="message" 
            onChange={e => onTextChange(e)} 
            value={state2.message} 
            label="Message" 
          />
          <SubmitBtn onClick={chat_save}><FontAwesomeIcon icon={faPaperPlane}/></SubmitBtn>
      </SubmitList>
    </div>
    </>
  );
}

export default Chat;