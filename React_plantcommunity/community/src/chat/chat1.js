import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'

const socket = io.connect('http://localhost:5000',{
  cors: { origin: '*' }
});

const userSocket = io("http://localhost:5000/users", {
  cors: { origin: '*' }
});


function Chat() {
  const [state, setState] = useState({message: '', name: ''})
  const [chat, setChat] = useState([]);

  const [state2, setState2] = useState({message: '', name: ''})
  const [chat2, setChat2] = useState([]);

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