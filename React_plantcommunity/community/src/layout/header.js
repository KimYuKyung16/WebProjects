import React, { useState } from 'react';
import './header.css';
import axios from "axios";
import { useNavigate, Link, NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import cookies from 'react-cookies'; // 쿠키

import styled from "styled-components"; // styled in js


const Title_background = styled.header`
background-color: ${(props) => props.title_setting.title_backcolor};
display: flex;
justify-content: center;
padding: 40px 0px;
`;

const Main_title = styled.h1`
color: ${(props) => props.title_setting.title_textcolor};
font-family: 'Cairo';
font-size: 2.5rem;
`;

const Navbar = styled.nav`
display: flex;
position: sticky;
top: 0;
justify-content: space-between;
background-color: ${(props) => props.navbar_setting.navbar_backcolor};
padding: 10px 0px;
`;

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
          {/* <li><Link style={{textDecoration: 'none', color: props.title_setting.title_textcolor}} to="/plant_info_share">식물 기본 정보</Link></li>
          <li><Link style={{textDecoration: 'none', color: props.title_setting.title_textcolor}} to="/plant_info_share">식물 정보 공유</Link></li> 
          <li><Link style={{textDecoration: 'none', color: props.title_setting.title_textcolor}} to="/plant_info_share">내 식물 자랑</Link></li> */}
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
