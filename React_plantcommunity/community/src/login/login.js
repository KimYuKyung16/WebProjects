import React, { useState} from 'react';
// import './App.css';

function Login() {
  return (
    <div>
      <nav class="navbar">
        <ul class="navbar_menu">
            <li><a href="#">식물 기본 정보</a></li>
            <li><a href="/plant_info_share">식물 정보 공유</a></li>
            <li><a href="/introduce_plant">내 식물 자랑</a></li>
        </ul>
        <ul class="navbar_icons">
            <li><i id="my_info" class="fas fa-user-circle fa-lg"></i></li>
            <input type="hidden" name="page_num" id="page_num" value="my_info" />
        </ul>
      </nav>

      <div class="login_list-Div">
        <h2>로그인</h2>
        <hr noshade color="#BDBDBD" />
        <div class="login-2">
          <label for="id" class="form_label">아이디</label> 
          <input id="id" class="form_control" name="id" type="text" placeholder="아이디" /> 
        </div>
        <div class="login-2">
          <label for="pw" class="form_label">비밀번호</label>
          <input id="pw" class="form_control" name="pw" type="password" placeholder="비밀번호" />
        </div>
        <button id="login_confirm_btn" type="submit" class="btn">로그인 하기</button> 
        <button type="submit" id="google_login_confirm_btn" class="btn">구글 로그인 하기</button>

      <div class="bottomText">
          <p>계정이 없다면 <a href="/signup">Sign up</a></p>
        </div>

      </div>
    </div>
  );
}

export default Login;
