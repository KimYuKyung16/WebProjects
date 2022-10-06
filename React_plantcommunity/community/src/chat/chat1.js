import React, { useEffect, useState } from 'react';
import axios from "axios";
import io from 'socket.io-client'





function Chat() {
  let [namespace, setNamespace] = useState();

  const [state, setState] = useState({message: '', name: ''})
  const [chat, setChat] = useState([]);

  const [state2, setState2] = useState({message: '', name: ''})
  const [chat2, setChat2] = useState([]);

  let nickname = '김유경';

  const socket = io.connect('http://localhost:5000',{
    cors: { origin: '*' }
  });

  console.log(namespace);

  const userSocket = io("http://localhost:5000/" + namespace, {
    cors: { origin: '*' }
  });


  useEffect(() => {
    socket.on('message', ({name, message}) => {
      setChat([...chat, {name, message}])
    })
  })

  useEffect(() => {
    userSocket.on('message', ({name, message}) => {
      setChat2([...chat2, {name, message}])
    })
  })



  const renderChat = () => {
    return chat.map(({name, message}, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ))
  }

  const renderChat2 = () => {
    return chat2.map(({name, message}, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ))
  }


  const onTextChange = e => {
    setState({...state, [e.target.name]: e.target.value})
  }

  const onTextChange2 = e => {
    setState2({...state2, [e.target.name]: e.target.value})
  }

  const onMessageSubmit = (e) => {
    e.preventDefault()
    const {name, message} = state
    socket.emit('message', {name, message})
    setState({message: '', name })
  }

  const onMessageSubmit2 = (e) => {
    e.preventDefault()
    const {name, message} = state2
    userSocket.emit('message', {name, message})
    setState2({message: '', name })
  }


  function test() {
    axios.get(`http://localhost:5000/chat_namespace`) // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      setNamespace(response.data.namespace);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => { test(); }, []) 



  return (
    <>
      <form onSubmit={onMessageSubmit}>
        <h1>Messanger</h1>
        <div className='name-field'>
          <input 
            name="name" 
            onChange={e => onTextChange(e)} 
            value={state.name} 
            label="Name" 
          />
        </div>
        <div>
          <input 
            name="message" 
            onChange={e => onTextChange(e)} 
            value={state.message} 
            label="Message" 
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>





      <form onSubmit={onMessageSubmit2}>
        <h1>Messanger</h1>
        <div className='name-field'>
          <input 
            name="name" 
            onChange={e => onTextChange2(e)} 
            value={state2.name} 
            label="Name" 
          />
        </div>
        <div>
          <input 
            name="message" 
            onChange={e => onTextChange2(e)} 
            value={state2.message} 
            label="Message" 
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat2()}
      </div>
    </>
  );
}

export default Chat;