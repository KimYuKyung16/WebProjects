import React, { useState } from 'react';
import axios from "axios";
import './header.css';
import { useNavigate, Link } from "react-router-dom"; // 라우팅

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용 위해 필요
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'; // 내 정보 아이콘
import { faBars } from '@fortawesome/free-solid-svg-icons'; // 햄버거바 아이콘

import cookies from 'react-cookies'; // 쿠키

import styled, { keyframes } from "styled-components"; // styled in js


/* 홈페이지 메인 타이틀 배경 */
const Title_background = styled.header`
background-color: ${(props) => props.title_setting.title_backcolor};
display: flex;
justify-content: center;
padding: 40px 0px;

@media screen and (max-width: 1300px) { 
  padding: 10px 0px;
  width: 100%;
}
`;

/* 홈페이지 메인 타이틀 */
const Main_title = styled.h1`
color: ${(props) => props.title_setting.title_textcolor};
font-family: 'Cairo';
font-size: 2.5rem;

@media screen and (max-width: 1300px) { 
  font-size: 1.5rem;
  padding: 0px;
}
`;

const appear = keyframes`
0% {
  transform: translateX(-150%);
}
100% {
  transform: translateX(0%);
}
`

const disappear = keyframes`
0% {
  transform: translateX(-150%);
}
100% {
  transform: translateX(-150%);
}
`

const Info = styled.div`
position: relative;
width: 40%;
// height: 100vh;
`;

const Test = styled.div`
background-color: rgb(255, 255, 255);
position: absolute;
width: 100%;
height: 1000px;
z-index: 3;
animation: ${(props) => props.click_state} 1.5s linear forwards;
`;




/* 네비게이션바  */
const Navbar = styled.nav`
display: flex;
position: sticky;
top: 0;
justify-content: space-between;
background-color: ${(props) => props.navbar_setting.navbar_backcolor};
padding: 10px 0px;


@media screen and (max-width: 1300px) { 
  display: ${(props) => props.active || 'flex'};
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 14px;
}
`;

/* 네비게이션바 메뉴들  */
const Navbar_menu = styled.ul`
display: flex;
justify-content: center;
list-style: none;
padding-left: 0;
width: 100%;
margin-left: 12vw;

@media screen and (max-width: 1300px) { 
  display: ${(props) => props.active || 'flex'};
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin: 0;
}
`;

/* 네비게이션바 메뉴들  */
const Menu = styled.li`
padding: 8px 12px;

@media screen and (max-width: 1300px) { 
  width: 100%;
  text-align: center;
}
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

@media screen and (max-width: 1300px) { 
  display: ${(props) => props.active};
  justify-content: center;
  width: 100%;
}
`;

/* 네비게이션바 아이콘 (내정보) */
const NavbarIcon2 = styled.ul`
display: flex;
list-style: none;
font-size: 1.5rem;
color: black;
margin-right: 10vw;
// padding-left: 0;
`;

/* 네비게이션바 햄버거바 */
const Navbar_togglebBtn = styled.div`
display: none;
position: absolute;
right: 15px;
font-size: 24px;
color: ${(props) => props.navbar_setting.navbar_textcolor};

@media screen and (max-width: 1300px) { 
  display: block;
}
`;

function Header(props) {

  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [click_count, setClickCount] = useState(1);
  let [active_status, setActiveStatus] = useState('none');

  let [click_state, setClickState] = useState(disappear);

  function clickstate() {
    if (click_state == disappear) {
      setClickState(appear);
      console.log(click_state)
    } else {
      setClickState(disappear);
      console.log(click_state)
    }
  }

  /* 로그인이 되어있는지 확인 */
  function login_confirm() {
    let authentication;

    axios.get('http://localhost:5000/login/authentication') // 서버로 post 요청
      .then(function (response) { // 서버에서 응답이 왔을 때
       if (response.data.authenticator === true) { // 로그인이 되어있을 떄
        authentication = true;
        navigate('/user_info'); // 내 정보 페이지로 이동
       } else { // 로그인이 안되어있을 때
        // authentication = false;
        navigate('/login'); // 로그인 페이지로 이동
       }
      })
      .catch(function (error) {
        console.log(error);
      });

      // if (authentication) { navigate('/write'); }
      // else { navigate('/login'); }

  }
  // function login_confirm() {
  //   var login_cookie = cookies.load('user_login');

  //       if (login_cookie !== undefined) { // 로그인이 되어있을 때
  //         navigate('/user_info'); // 내 정보 페이지로 이동
  //       } else { // 로그인이 되어있지 않을 때
  //         navigate('/login'); // 로그인 페이지로 이동
  //       }  
  // }

  function active() {
    console.log('실행');
    setClickCount(click_count + 1);

    if (click_count % 2 == 1) {
      console.log('보임');
      setActiveStatus('flex');
      console.log(active_status)
    } else {
      console.log('안보임');
      setActiveStatus('none');
      console.log(active_status)
    }
    
  }

  function home() {
    navigate('/');
  }

  return (
    <>
      <Info>
        <Test click_state={click_state}>
          <p>안녕</p>
        </Test>
      </Info>
      <Title_background {...props}>
        <NavbarIcon2>
          <li><FontAwesomeIcon icon={faCircleUser} id="my_info" onClick={clickstate}/></li>
        </NavbarIcon2>
        <Main_title {...props} onClick={home}>Plant Community</Main_title>
        <Navbar_togglebBtn {...props} onClick={active}>
          <FontAwesomeIcon icon={faBars}/>
        </Navbar_togglebBtn>
      </Title_background>
      <Navbar {...props} active={active_status}> 
        <Navbar_menu active={active_status}>
          <Menu><StyledLink {...props} to="/plant_info_share">식물 기본 정보</StyledLink></Menu>
          <Menu><StyledLink {...props} to="/plant_info_share">식물 정보 공유</StyledLink></Menu> 
          <Menu><StyledLink {...props} to="/plant_info_share">내 식물 자랑</StyledLink></Menu>
          <Menu><StyledLink {...props} to="/plant_market">식물 마켓</StyledLink></Menu>
        </Navbar_menu>
        <NavbarIcon {...props} active={active_status}>
          <li><FontAwesomeIcon icon={faCircleUser} id="my_info" onClick={login_confirm}/></li>
        </NavbarIcon>
      </Navbar>
    </>
  );
}

export default Header;
