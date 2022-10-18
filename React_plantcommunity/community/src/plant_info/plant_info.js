import React, { useState, useEffect } from 'react';
import { useNavigate, Link, resolvePath } from "react-router-dom";

import Header from "../layout/header";
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


function Plant_info() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  function test() {
    axios.get(`http://localhost:5000/plant_info`)
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => { test(); }, []) // 처음에 무조건 한 번 실행

  return (
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>

    </>
  );
}

export default Plant_info;
