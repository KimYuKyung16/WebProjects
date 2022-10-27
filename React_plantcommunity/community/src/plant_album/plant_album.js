import React, { useState, useEffect } from 'react';
import { useNavigate, Link, resolvePath } from "react-router-dom";

import { colorConfig } from '../config/color';

import axios from "axios";

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


function Plant_album() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요


  useEffect(() => { }, []) // 처음에 무조건 한 번 실행

  return (
    <>
      <p className="tmp_title">내 식물 앨범</p>

    </>
  );
}

export default Plant_album;
