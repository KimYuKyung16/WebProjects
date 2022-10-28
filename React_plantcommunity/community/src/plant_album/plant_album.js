import React, { useState, useEffect } from 'react';
import { useNavigate, Link, resolvePath } from "react-router-dom";

import { colorConfig } from '../config/color';

import axios from "axios";

import './plant_album.css';

import styled from "styled-components"; // styled in js

import cookies from 'react-cookies'; // 쿠키 저장


function Plant_album() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [change, setChange] = useState('default');

  function create_album() {
    console.log("앨범 생성");
    axios.post(`http://localhost:5000/plant_album`)
    .then(function (response) { // 앨범 생성이 완료됐을 경우
      console.log(response)
    })
    .catch(function (error) { // 앨범 생성 오류
      console.log(error);
    })
  }

  function component() {
    if (change === 'default') {

    }
  }

  useEffect(() => { }, []) // 처음에 무조건 한 번 실행

  return (
    <>
      <p className="tmp_title">내 식물 앨범</p>

      <div className="each_album">
        <img src="/image/add_album.png" width="100" height="100" onClick={create_album}/>
      </div>
      
    </>
  );
  
}

export default Plant_album;
