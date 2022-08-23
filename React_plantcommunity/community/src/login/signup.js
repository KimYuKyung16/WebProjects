import React, { useState } from 'react';
import axios from "axios";
import './signup.css';
import { useNavigate } from "react-router-dom";

function Signup(location) {

  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [id, setId] = useState(""); // 아이디 
  let [pw, setPw] = useState(""); // 패스워드

  let onChangeId = (e) => { setId(e.target.value) }; // 변경된 아이디 저장
  let onChangePw = (e) => { setPw(e.target.value) }; // 변경된 패스워드 저장
   
  function login_response(){
    axios.post('http://localhost:5000/login/process', { // 서버로 post 요청
      id: id,
      pw: pw
    })
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data.login_status)
      if (response.data.login_status === 'success') {
        navigate('/'); // 메인페이지로 이동
      } else {
        alert("로그인에 실패하셨습니다.");
      }  
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
      <div>  
        <div class="signup_list_div">
          <h2>회원가입</h2>
          <hr noshade color="#BDBDBD" />
          <div class="mb_3">
            <label for="id" class="form_label">아이디</label>
            <input id="id" class="form_control" name="id" type="text" placeholder="아이디 입력" />
          </div>
          <div class="mb_3">
            <label for="pw" class="form_label">비밀번호</label> 
            <input id="pw" class="form_control" name="pw" type="password" placeholder="비밀번호 입력" />
          </div>
          <div class="mb_3">
            <label for="pw_check" class="form_label">비밀번호 확인</label>
            <input id="pw_check" class="form_control" name="pw_check" type="password" placeholder="비밀번호 확인" />
          </div>
          <button id="signup_confirm_btn" class="signup_confirm_btn" type="button">회원가입</button>

          <div class="bottomText"> 
            <p>계정이 있다면 <a href="./login">로그인</a> 해주세요</p>
          </div>

        </div>
      </div>
  );

}

export default Signup;
