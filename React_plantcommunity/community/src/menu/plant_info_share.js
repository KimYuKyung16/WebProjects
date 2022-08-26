import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용 위해 필요
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'; // 내 정보 아이콘

import styled from "styled-components"; // styled in js

/* 홈페이지 메인 타이틀 세팅값 */
const title_setting = {
  title_backcolor: "rgb(107, 164, 255)",
  title_textcolor: "rgb(255, 255, 255)",
}

/* 네비게이션바 세팅값 */
const navbar_setting = {
  navbar_backcolor: "rgb(107, 164, 255)",
  navbar_textcolor: "rgb(255, 255, 255)",
}

const Search = styled.div`

`;

function Plant_info_share() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  return (
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
      <Search>
        <p>글 검색</p>
        <input type="search"/>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Search>

      <div class="button_div">
        <input onClick={() => {navigate('/write');}} id="write_button" type="button" value="글쓰기" />
      </div>

    </>
  );
}

export default Plant_info_share;
