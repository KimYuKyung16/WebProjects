import React, { useState } from 'react';
import axios from "axios";
// import './App.css';


function Login() {
  let [id, setId] = useState(""); // 아이디 
  let [pw, setPw] = useState(""); // 패스워드

  let onChangeId = (e) => { setId(e.target.value) }; // 변경된 아이디 저장
  let onChangePw = (e) => { setPw(e.target.value) }; // 변경된 패스워드 저장

  function id_pw_respond(){
    axios.post('http://localhost:5000/login/process', {
      id: id,
      pw: pw
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
      <div>  
        <div class="login_list-Div">
          <h2>로그인</h2>
          <hr noshade color="#BDBDBD" />
          <div class="login-2">
            <label for="id" class="form_label">아이디</label> 
            <input onChange={onChangeId} value={id} id="id" class="form_control" name="id" type="text" placeholder="아이디" /> 
          </div>
          <div class="login-2">
            <label for="pw" class="form_label">비밀번호</label>
            <input onChange={onChangePw} value={pw} id="pw" class="form_control" name="pw" type="password" placeholder="비밀번호" />
          </div>
          <button onClick={() => {id_pw_respond(); console.log("클릭");}} id="login_confirm_btn" type="submit" class="btn">로그인 하기</button> 
          <button type="submit" id="google_login_confirm_btn" class="btn">구글 로그인 하기</button>

        <div class="bottomText">
            <p>계정이 없다면 <a href="/signup">Sign up</a></p>
          </div>

        </div>
      </div>
  );
}

export default Login;
