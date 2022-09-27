import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './user_info.css';

import styled from "styled-components"; // styled in js

import cookies from 'react-cookies'; // 쿠키 저장


const Profile = styled.img`
  width: 200px;
  height: 200px;
`;



function User_info() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [profile, setProfile] = useState(); // 등록되어있는 내 프로필 사진

  function logout() { // 서버 세션도 없애기 위해 서버에 요청하기
    axios.delete('http://localhost:5000/logout')
    .then(function (response) { // 서버에서 응답이 왔을 때
      alert("로그아웃 되었습니다."); 
      cookies.remove('login_cookie', { path: '/' })
      navigate('/login'); // 메인페이지로 이동
    })
    .catch(function (error) {
      console.log(error);
    });

    // try {
    //   cookies.remove('user_login');
    //   // navigate('/', {replace: true}); // 메인페이지로 이동 : replace를 true로 하면 뒤로가기를 할 때 '/'로 돌아온다.
    //   // window.location.replace("/"); // 뒤로가기 불가능 + 새로고침
    //   // navigation.reset({
    //   //   routes: [{
    //   //       name: 'Main'
    //   //     }]
    //   // })
    // } catch (error) {
    //   console.log(error);
    // }
  }

  function profile_print() {
    axios.post(`http://localhost:5000/user_info/profile_print`)
    .then(function (response) { 
      console.log(response.data)
      setProfile('http://localhost:5000/' + response.data); // 서버에 있는 이미지 링크주소
    })
    .catch(function (error) {
      console.log(error);
    });
  }





  useEffect(() => { profile_print(); }, [setProfile])

  return(
    <>
      <div id="total_div">
      <div id="user_div">
        <h1>현재 유저 정보</h1>
        <table id="user_table">
          <tr>
            <td>
              <p id="user_profile">유저의 프로필 사진</p>
              <Profile src={profile}></Profile>
            </td>
          </tr>
          <tr>
            <td id="user_nickname">유저의 닉네임: 유경</td> 
          </tr>
          <tr>
            <td><input id="info_revise_btn" type="button" value="내 정보 수정하기" onClick={() => {navigate('/user_info/profile');}}/></td>
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