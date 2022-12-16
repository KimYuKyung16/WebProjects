import React, { useState, useEffect } from 'react';
import axios from "axios";
import './header.css';
import { useNavigate, Link } from "react-router-dom"; // 라우팅

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용 위해 필요
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'; // 내 정보 아이콘
import { faBars } from '@fortawesome/free-solid-svg-icons'; // 햄버거바 아이콘

import cookies from 'react-cookies'; // 쿠키

import styled, { keyframes } from "styled-components"; // styled in js

import Own_contents from "../user_info/own_contents";
import Like_contents from '../user_info/like_contents';

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
  transform: translateX(0%);
}
100% {
  transform: translateX(-150%);
}
`

const default_disappear = keyframes`
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

@media screen and (max-width: 500px) {     
  width: 60%;
}
`;

const Test = styled.div`
display: flex;
flex-direction: column;
background-color: rgb(246, 251, 248);
position: absolute;
width: 100%;
height: 100vh;
z-index: 3;
animation: ${(props) => props.click_state} 1.5s linear forwards;
overflow: auto;
border: 2px solid rgb(186, 218, 199);
box-sizing: border-box;

-ms-overflow-style: none; /* IE and Edge */
scrollbar-width: none; /* Firefox */
::-webkit-scrollbar{
  display:none;
}
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
display: none;
position: absolute;
left: 15px;
list-style: none;
font-size: 1.5rem;
color: ${(props) => props.navbar_setting.navbar_textcolor};
// margin-right: 10vw;
// padding-left: 0;


@media screen and (max-width: 1300px) { 
  display: flex;
}
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

const Profile = styled.img`
  width: 200px;
  height: 200px;
`;

function Header(props) {

  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [click_count, setClickCount] = useState(1);
  let [active_status, setActiveStatus] = useState('none');

  let [click_state, setClickState] = useState(default_disappear);

  function clickstate() {
    if (click_state == disappear) {
      setClickState(appear);
      console.log(click_state)
    } else if (click_state == default_disappear) {
      setClickState(appear);
    }
    else {
      setClickState(disappear);
      console.log(click_state)
    }
  }

  /* 로그인이 되어있는지 확인 */
  function login_confirm() {
    axios.get('http://localhost:5000/login/authentication') 
      .then(function (response) { // 서버에서 응답이 왔을 때
        if (response.data.authenticator === true) { // 로그인이 되어있을 경우
          navigate('/user_info'); // 내 정보 페이지로 이동
        } else { // 로그인이 안되어있을 경우
          navigate('/login'); // 로그인 페이지로 이동
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  /* 로그인이 되어있는지 확인 */
  function login_confirm2() {
    axios.get('http://localhost:5000/login/authentication')
      .then(function (response) { // 서버에서 응답이 왔을 때
        if (response.data.authenticator === true) { // 로그인이 되어있을 떄
          nickname_print(); // 닉네임 춫력
          profile_print(); // 프로필 사진 출력
          clickstate(); // 햄버거바 여닫이를 위한 click횟수
        } else { // 로그인이 안되어있을 때
          navigate('/login'); // 로그인 페이지로 이동
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

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

  let [profile, setProfile] = useState(); // 등록되어있는 내 프로필 사진
  let [nickname, setNickname] = useState();

  function logout() { // 서버 세션도 없애기 위해 서버에 요청하기
    axios.delete('http://localhost:5000/logout')
    .then(function (response) { // 서버에서 응답이 왔을 때
      alert("로그아웃 되었습니다."); 
      cookies.remove('login_cookie', { path: '/' })
      // cookies.remove('user_cookie', { path: '/' })
      window.location.replace('/login'); // 메인페이지로 이동
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function profile_print() {
    axios.post(`http://localhost:5000/user_info/profile_print`)
    .then(function (response) { 
      console.log(response.data)

      if (response.data === '\\image\\default_profile.png') { // 프로필 사진이 없을 경우: 기본 프로필 사진
        // setProfile('/image/default_profile.png'); 
        setProfile(response.data); // 서버에 있는 이미지 링크주소
      } else { // 프로필 사진이 있을 경우: 본인 프로필 사진
        setProfile('http://localhost:5000/' + response.data); // 서버에 있는 이미지 링크주소
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function nickname_print() {
    axios.get('http://localhost:5000/login/authentication')
    .then(function (response) { // 서버에서 응답이 왔을 때
      setNickname (response.data.nickname);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // 현재 component의 상태를 설정하는 변수
  let [change, setChange] = useState('own_contents');

  // 내가 쓴 글
  function own_contents() {
    setChange('own_contents');
  }

  // 좋아요한 글
  function like_contents() {
    setChange('like_contents');
  }

  // 식물 앨범
  function plant_album() {
    setChange('plant_album');
  }

  function Component() {
    if ( change === 'own_contents') {
      return(
        <>
          <Own_contents></Own_contents>
        </>
      )
    } else if ( change === 'like_contents') {
      return(
        <>
          <Like_contents></Like_contents>
        </>
      )
    } else {
      return(
        <>
          <p>식물 앨범</p>
          <p>안녕3</p>
        </>
      )
    }
  } 

  return (
    <>
      <Info>
        <Test click_state={click_state}>
          <img id="close_btn" width="15" height="15" src="/image/close_btn.png" onClick={() => {setClickState(disappear);}} /> 
          <div id="user_div">
            <h1>내 정보</h1>
            <table id="user_table">
              <tr>
                <td>
                  <p id="user_profile">프로필 사진</p>
                  <Profile src={profile}></Profile>
                </td>
              </tr>
              <tr>
                <td id="user_nickname">닉네임: {nickname}</td> 
              </tr>
              <tr>
                <td><input id="info_revise_btn" type="button" value="내 정보 수정하기" onClick={() => {navigate('/user_info/profile');}}/></td>
              </tr>
              <tr>
                <td><input onClick={logout} id="logout_btn" type="button" value="로그아웃" /></td> 
              </tr>
            </table>
          </div>

          <div id="main_div">
          <div className='menu'>
            <ul className='menu_list'>
              <li>
                <p onClick={ own_contents }>내가 쓴 글</p>
              </li>
              <li>
                <p onClick={ like_contents }>좋아요한 글</p>
              </li>
              <li>
                <p onClick={ plant_album }>내 식물앨범</p>
              </li>
            </ul>
          </div>

          <div>
            {Component()}
          </div>

        </div>
        </Test>
      </Info>
      <Title_background {...props}>
        <NavbarIcon2 {...props}>
          <li><FontAwesomeIcon icon={faCircleUser} id="my_info" onClick={login_confirm2}/></li>
        </NavbarIcon2>
        <Main_title {...props} onClick={home}>Plant Community</Main_title>
        <Navbar_togglebBtn {...props} onClick={active}>
          <FontAwesomeIcon icon={faBars}/>
        </Navbar_togglebBtn>
      </Title_background>
      <Navbar {...props} active={active_status}> 
        <Navbar_menu active={active_status}>
          <Menu><StyledLink {...props} to="/plant_info">식물 기본 정보</StyledLink></Menu>
          <Menu><StyledLink {...props} to="/plant_info_share">식물 정보 공유</StyledLink></Menu> 
          <Menu><StyledLink {...props} to="/plant_introduce">내 식물 자랑</StyledLink></Menu>
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
