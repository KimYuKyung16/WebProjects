import React, { useState } from 'react';
import axios from "axios";
import './login.css';
import { useNavigate } from 'react-router-dom';

import Header from '../layout/header';
import { colorConfig } from "../config/color"; // 홈페이지 색감 정보

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

import { fbConfig } from '../config/firebase';

import cookies from 'react-cookies'; // 쿠키 저장

const firebaseConfig = fbConfig;
const app = initializeApp(firebaseConfig); // Initialize Firebase
// const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();

function authpopup(){
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      console.log(user.email);

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log(credential);
    });
}


function Login(location) {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [id, setId] = useState(""); // 아이디 
  let [pw, setPw] = useState(""); // 패스워드

  let onChangeId = (e) => { setId(e.target.value) }; // 변경된 아이디 저장
  let onChangePw = (e) => { setPw(e.target.value) }; // 변경된 패스워드 저장

  var login_cookie = cookies.load('user_login');
   
  function login_response(){
    axios.post('http://localhost:5000/login/process', { // 서버로 post 요청
      id: id,
      pw: pw
    })
    .then(function (response) { // 서버에서 응답이 왔을 때
      if (response.data.login_status === 'success') { // 로그인에 성공했다면
        if (login_cookie == undefined) { // 로그인 쿠키가 없다면 쿠키 생성
          const expires = new Date();
          expires.setFullYear(expires.getFullYear() + 10);
          cookies.save('user_login', response.data.cookie, //쿠키 생성하기
            {
              path: '/', // 모든 페이지에서 쿠키 사용 가능
              expires, 
              secure: true
            }   
          )
          cookies.save('nickname', response.data.nickname, //쿠키 생성하기
          {
            path: '/', // 모든 페이지에서 쿠키 사용 가능
            expires, 
            secure: true
          }   
        )
        } else { // 로그인 쿠키가 있다면 쿠키 생성X
          console.log("쿠키 존재");
        }
        navigate('/'); // 메인페이지로 이동
      } else {
        alert("로그인에 실패하셨습니다.");
      }  
    })
    .catch(function (error) {
      console.log(error);
    });
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
      <div>  
        <div className="login_list-Div">
          <h2>로그인</h2>
          <hr noshade color="#BDBDBD" />
          <div className="login-2">
            <label for="id" className="form_label">아이디</label> 
            <input onChange={onChangeId} value={id} id="id" className="form_control" name="id" type="text" placeholder="아이디" /> 
          </div>
          <div className="login-2">
            <label for="pw" className="form_label">비밀번호</label>
            <input onChange={onChangePw} value={pw} id="pw" className="form_control" name="pw" type="password" placeholder="비밀번호" />
          </div>
          <button onClick={login_response} id="login_confirm_btn" type="submit" className="btn">로그인 하기</button> 
          <button onClick={authpopup} type="submit" id="google_login_confirm_btn" className="btn">구글 로그인 하기</button>
          
          <div className="bottomText">
            <p>계정이 없다면 <a href="/signup">Sign up</a></p>
          </div>
        </div>
      </div>
    </>
  );

}

export default Login;
