import React, { useState } from 'react';
import './header.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

import cookies from 'react-cookies'; // 쿠키


function Header() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  function login_confirm() {
    var login_cookie = cookies.load('user_login');

        if (login_cookie !== undefined) { // 로그인이 되어있을 때
          navigate('/user_info'); // 내 정보 페이지로 이동
        } else { // 로그인이 되어있지 않을 때
          navigate('/login'); // 로그인 페이지로 이동
        }  
  }

  return (
    <>
      <header class="main_title">
        <h1 id="main_title">Plant Community</h1>
        <div class="navbar_togglebBtn">
          <i class="fas fa-bars"></i>
        </div>
      </header>
      
      <nav class="navbar"> 
        <ul class="navbar_menu">
          <li><a href="#">식물 기본 정보</a></li>
          <li><a href="plant_info_share.php">식물 정보 공유</a></li> 
          <li><a href="introduce_plant.php">내 식물 자랑</a></li>
        </ul>
        <ul class="navbar_icons">
          <li><FontAwesomeIcon icon={faCircleUser} id="my_info" onClick={login_confirm}/></li>
          <input type="hidden" name="page_num" id="page_num" value="my_info" />
        </ul>
      </nav>
    </>
  );
}

export default Header;
