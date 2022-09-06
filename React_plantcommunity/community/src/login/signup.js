import React, { useState } from 'react';
import axios from "axios";
import './signup.css';
import { useNavigate } from "react-router-dom";

import Header from '../layout/header';
import { colorConfig } from "../config/color"; // 홈페이지 색감 정보

function Signup() {

  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [id, setId] = useState(""); // 아이디 
  let [pw, setPw] = useState(""); // 패스워드
  let [compare_pw, setComparePw] = useState(""); // 패스워드 확인
  let [nickname, setNickname] = useState(""); // 닉네임

  let onChangeId = (e) => { setId(e.target.value) }; // 변경된 아이디 저장
  let onChangePw = (e) => { setPw(e.target.value) }; // 변경된 패스워드 저장
  let onChangeComparePw = (e) => { setComparePw(e.target.value) }; // 변경된 패스워드 저장
  let onChangeNickname = (e) => { setNickname(e.target.value) }; // 변경된 패스워드 저장

 
   
  function login_response(){
    axios.post('http://localhost:5000/signup/process', { // 서버로 post 요청
      id: id,
      pw: pw,
      nickname: nickname
    })
    .then(function (response) { // 서버에서 응답이 왔을 때
      alert("회원가입에 성공하셨습니다."); 
      navigate('/login'); // 메인페이지로 이동
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function signup_component_confirm() {
    if (id != '' && pw != '' && compare_pw != '' && nickname != '') {
      pw_compare_process();
    } else {
      alert("입력되지 않은 값이 있습니다.");
    }
  }


  function pw_compare_process() {
    if (pw === compare_pw) {
      login_response();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  }

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
        <div className="signup_list_div">
          <h2>회원가입</h2>
          <hr class="line" noshade color="#BDBDBD" />
          <div className="mb_3">
            <label for="nickname" className="form_label">닉네임</label>
            <input onChange={onChangeNickname} id="nickname" className="form_control" type="text" placeholder="닉네임" />
          </div>
          <div className="mb_3">
            <label for="id" className="form_label">아이디</label>
            <input onChange={onChangeId} id="id" className="form_control" name="id" type="text" placeholder="아이디 입력" />
          </div>
          <div className="mb_3">
            <label for="pw" className="form_label">비밀번호</label> 
            <input onChange={onChangePw} id="pw" className="form_control" name="pw" type="password" placeholder="비밀번호 입력" />
          </div>
          <div className="mb_3">
            <label for="pw_check" className="form_label">비밀번호 확인</label>
            <input onChange={onChangeComparePw} id="pw_check" className="form_control" name="pw_check" type="password" placeholder="비밀번호 확인" />
          </div>
          <button onClick={signup_component_confirm} id="signup_confirm_btn" className="signup_confirm_btn" type="button">회원가입</button>

          <div className="bottomText"> 
            <p>계정이 있다면 <a href="./login">로그인</a> 해주세요</p>
          </div>

        </div>
      </>
  );

}

export default Signup;
