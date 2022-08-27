import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './main.css';


import Header from "../layout/header";
import { colorConfig } from "../config/color"; // 홈페이지 색감 정보

import styled from "styled-components"; // styled in js
import { text } from '@fortawesome/fontawesome-svg-core';

const LoginDiv = styled.div`
  display: block;
  `;

const UserDiv = styled.div`
  display: none;
  `;

function Main() {

  const title_setting = {
    title_backcolor: colorConfig.sub_color,
    title_textcolor: colorConfig.main_color
  }

  const navbar_setting = {
    navbar_backcolor: colorConfig.sub_color,
    navbar_textcolor: colorConfig.main_color
  }
  
  return (
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
      <div class="top_div">
        <div class="banner_div">
          <img class="banner" src="/image/banner.png" />
        </div>

        <div id="side_menu" class="side_menu">
          <LoginDiv> 
            <ul class="main_login">
                <li>
                  <h2 class="login_title">로그인</h2>
                </li>
                <li><input id="u_id" class="login_element" type="text" name="id" placeholder="아이디" /></li>
                <li><input id="u_pw" class="login_element" type="password" name="pw" placeholder="비밀번호" /></li>  
                <div id="login_signup_btn_div">
                  <li><input id="login_btn" class="login_btn_element" type="button" value="로그인" /></li>
                  <li><input id="signup_btn" class="login_btn_element" type="button" value="회원가입" /></li> 
                </div>
            </ul>
          </LoginDiv>
          <UserDiv>  
            <ul class="main_login">
              <li>
                <div id="my_profile_div">
                    <ul>
                      <li>아이디: </li>
                      <li>닉네임: </li>
                    </ul>
                </div>
              </li>
              <li id="write_btn"><input type="button" value="글쓰기" /></li>
              <li><input id="logout_btn" type="button" value="로그아웃" /></li>
            </ul>
          </UserDiv>
        </div>

        

        {/* <div id="main_div">
          <div class="content_list_div">

            <div class="popular_div">
              <div class="title">
                <h2>인기글</h2>
              </div>
              <table id="popular_content_list">
                <thead>
                  <tr>
                    <th class="num">번호</th>
                    <th class="content_title">제목</th>
                    <th class="writer">작성자</th>
                    <th class="date">날짜</th>
                    <th class="click_count">조회수</th>
                  </tr>
                </thead>
                <tbody>
                    <tr class="content_list">
                      <td class="num"></td>
                      <td class="content_title"></td>
                      <td class="writer">
                      </td>
                      <td class="date"></td>
                      <td class="click_count"></td>
                    </tr>
                </tbody>
              </table>

            </div>


            <div class="test">
              <div class="title">
                <h2>전체글</h2>
              </div>
              <table id="content_list">
                <thead>
                  <tr>
                    <th class="num">번호</th>
                    <th class="content_title">제목</th>
                    <th class="writer">작성자</th>
                    <th class="date">날짜</th>
                    <th class="click_count">조회수</th>
                  </tr>
                </thead>
                <tbody>
                    <tr class="content_list">
                      <td class="num"></td>
                      <td class="content_title"></td>
                      <td class="writer">
                      </td>
                      <td class="date"></td>
                      <td class="click_count"></td>
                    </tr>
                </tbody>
              </table>

              <div class="pager">
              </div>

            </div>
          </div>
        </div> */}
      </div>

      <div class="line_div">
        <hr class="middle_line" />
      </div>
    </>
  );
}

export default Main;
