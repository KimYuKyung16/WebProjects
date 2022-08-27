import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Header from "../layout/header";
import { colorConfig } from '../config/color';

import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용 위해 필요
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'; // 내 정보 아이콘

import styled from "styled-components"; // styled in js

import cookies from 'react-cookies'; // 쿠키 저장

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

const Search = styled.div`

`;

function Plant_info_share() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  const [contents, setContents] = useState([]);

  Contents_request();
  login_confirm();


  function Contents_request() {
    axios.get('http://localhost:5000/plant_info_share/contents', { // 서버로 post 요청
        num: 1
      })
      .then(function (response) { // 서버에서 응답이 왔을 때
        const data = [...response.data];
        setContents(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function login_confirm() {
    console.log(cookies.load('user_login'));
  }


  return (
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
      <Search>
        <p>글 검색</p>
        <input type="search"/>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Search>
      <table>
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
          {contents.map((x) => (
            <tr>
              <td class="num">{x.num}</td>
              <td class="content_title">{x.title}</td>
              <td class="writer" id="writer1"></td>
              <td class="date"></td>
              <td class="click_count"></td>
            </tr>
          ))
          }
        </tbody>
      </table>

     
      <div class="button_div">
        <input onClick={() => {navigate('/write');}} id="write_button" type="button" value="글쓰기" />
      </div>

    </>
  );
}

export default Plant_info_share;
