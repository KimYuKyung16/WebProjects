import React, { useState } from 'react';
import './header.css';
import { useNavigate, Link } from "react-router-dom"; // 라우팅

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용 위해 필요
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'; // 내 정보 아이콘
import { faBars } from '@fortawesome/free-solid-svg-icons'; // 햄버거바 아이콘

import cookies from 'react-cookies'; // 쿠키

import styled from "styled-components"; // styled in js

/* 홈페이지 메인 타이틀 배경 */
const Title_background = styled.header`
background-color: ${(props) => props.title_setting.title_backcolor};
display: flex;
justify-content: center;
padding: 40px 0px;
`;

/* 홈페이지 메인 타이틀 */
const Main_title = styled.h1`
color: ${(props) => props.title_setting.title_textcolor};
font-family: 'Cairo';
font-size: 2.5rem;
`;

/* 네비게이션바  */
const Navbar = styled.nav`
display: flex;
position: sticky;
top: 0;
justify-content: space-between;
background-color: ${(props) => props.navbar_setting.navbar_backcolor};
padding: 10px 0px;
`;

/* 네비게이션바 메뉴들  */
const StyledLink = styled(Link)`
padding: 5px 20px;
color: ${(props) => props.navbar_setting.navbar_textcolor};
font-weight: 700;
text-decoration-line: none;

&:hover{  
  border-radius: 4px;
  background-color : ${(props) => props.navbar_setting.navbar_textcolor};
  color : ${(props) => props.navbar_setting.navbar_backcolor};
}
`;

/* 네비게이션바 아이콘 (내정보) */
const NavbarIcon = styled.ul`
display: flex;
list-style: none;
font-size: 1.5rem;
color: ${(props) => props.navbar_setting.navbar_textcolor};
margin-right: 10vw;
padding-left: 0;
`;

function Header(props) {

  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  /* 로그인이 되어있는지 확인 */
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
      <Title_background {...props}>
        <Main_title {...props} >Plant Community</Main_title>
        <div class="navbar_togglebBtn">
          <FontAwesomeIcon icon={faBars}/>
        </div>
      </Title_background>
      
      <Navbar {...props}> 
        <ul class="navbar_menu">
          <li><StyledLink {...props} to="/plant_info_share">식물 기본 정보</StyledLink></li>
          <li><StyledLink {...props} to="/plant_info_share">식물 정보 공유</StyledLink></li> 
          <li><StyledLink {...props} to="/plant_info_share">내 식물 자랑</StyledLink></li>
        </ul>
        <NavbarIcon {...props}>
          <li><FontAwesomeIcon icon={faCircleUser} id="my_info" onClick={login_confirm}/></li>
        </NavbarIcon>
      </Navbar>
    </>
  );
}

export default Header;
