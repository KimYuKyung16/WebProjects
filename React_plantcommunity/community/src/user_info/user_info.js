import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './user_info.css';

import cookies from 'react-cookies'; // 쿠키 저장

function User_info() {
  // const navigate = useNavigate(); // 페이지 이동을 위해 필요

  function logout() { // 서버 세션도 없애기 위해 서버에 요청하기
    try {
      cookies.remove('user_login');
      // navigate('/', {replace: true}); // 메인페이지로 이동 : replace를 true로 하면 뒤로가기를 할 때 '/'로 돌아온다.
      window.location.replace("/"); // 뒤로가기 불가능 + 새로고침
      // navigation.reset({
      //   routes: [{
      //       name: 'Main'
      //     }]
      // })
    } catch (error) {
      console.log(error);
    }
  }

  return(
    <>
      <div id="total_div">
      <div id="user_div">
        <h1>현재 유저 정보</h1>
        <table id="user_table">
          <tr>
            <td>
              <p id="user_profile">유저의 프로필 사진</p>
              {/* <image id="profile"> */}
            </td>
          </tr>
          <tr>
            <td id="user_nickname">유저의 닉네임: 유경</td> 
          </tr>
          <tr>
            <td><input id="info_revise_btn" type="button" value="내 정보 수정하기" /></td>
          </tr>
          <tr>
            <td><input onClick={logout} id="logout_btn" type="button" value="로그아웃" /></td> 
          </tr>
        </table>
      </div>

      <div id="main_div">

        <div className="content_list_div">
          <p className="tmp_title">유저가 쓴 글</p>
          <div className="test">
            <table id="content_list">
              <thead>
                <tr>
                  <th className="num">번호</th>
                  <th className="content_title">제목</th>
                  <th className="writer">작성자</th>
                  <th className="date">날짜</th>
                  <th className="click_count">조회수</th>
                </tr>
              </thead>
              <tbody>
              
              </tbody>
            </table>


            <div className="pager"> 
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

export default User_info;