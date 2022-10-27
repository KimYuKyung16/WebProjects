import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import './user_info.css';

import styled from "styled-components"; // styled in js

import cookies from 'react-cookies'; // 쿠키 저장

import Header from '../layout/header';
import { colorConfig } from "../config/color"; // 홈페이지 색감 정보

import Own_contents from "./own_contents";
import Like_contents from './like_contents';
import Plant_album from '../plant_album/plant_album';


const Profile = styled.img`
  width: 200px;
  height: 200px;
`;

const Main = styled.div`
display: flex;
padding: 50px 15vw;

@media screen and (max-width: 700px) {  
  flex-direction: column;
  padding: 0 20px;
}
`;


function User_info() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [profile, setProfile] = useState(); // 등록되어있는 내 프로필 사진

  // const [contents, setContents] = useState([]);

  // let [total_contents, setTotalcontents] = useState(); // 게시글의 총 개수
  // let one_page_contents = 10; // 한 페이지 당 게시글의 개수

  // let [total_pages, setTotalpages] = useState(1); // 총 페이지 개수
  // let [remain_contents, setRemaincontents] = useState(); // 나머지 게시글 개수



  // function each_page_contents(current_page) {
  //   axios.get('http://localhost:5000/user_info/contents', { // 서버로 post 요청
  //     params: {
  //       current_page: current_page, 
  //       one_page_contents: one_page_contents
  //     }  
  //   })
  //   .then(function (response) { // 서버에서 응답이 왔을 때
  //     const data = [...response.data];
  //     setContents(data);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // }

  // 클로저를 이용해서 가장 마지막 값만 출력되는 오류를 해결
  // function page_button_create() { // 페이지 버튼 생성
  //   let button_array = [];
  //   for (let i=1; i<total_pages+1; i++) {
  //     button_array.push(<input class="page_btn" key={i} type="button" value={i} onClick={ () => {each_page_contents(i)} } />)
  //   }
  //   return button_array;
  // }


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

    // try {
    //   cookies.remove('user_login');
    //   // navigate('/', {replace: true}); // 메인페이지로 이동 : replace를 true로 하면 뒤로가기를 할 때 '/'로 돌아온다.
    //   // window.location.replace("/"); // 뒤로가기 불가능 + 새로고침
    //   // navigation.reset({
    //   //   routes: [{
    //   //       name: 'Main'
    //   //     }]
    //   // })
    // } catch (error) {
    //   console.log(error);
    // }
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


  /* 내가 쓴 글 */

  // function total_contents_request() { // 게시글의 총 개수
  //   axios.get('http://localhost:5000/user_info/total_contents') // 서버로 get 요청
  //     .then(function (response) { // 서버에서 응답이 왔을 때
  //       setTotalcontents(response.data[0].count);
   
  //       setTotalpages(parseInt(total_contents / one_page_contents));// 총 페이지 개수 설정
  //       setRemaincontents(total_contents % one_page_contents); // 나머지 게시글 개수 설정
       
  //       if (remain_contents) { // 현재 페이지가 1페이지가 아니고 나머지 페이지가 있다면
  //         setTotalpages(total_pages => total_pages+1) // 총 페이지에 +1
  //       } 
  //       console.log(response.data[0].count);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  let [nickname, setNickname] = useState();

  function nickname_print() {
    axios.get('http://localhost:5000/login/authentication/nickname') // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      setNickname (response.data.nickname);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // 현재 menu_component의 상태를 설정하는 변수
  let [change, setChange] = useState('own_contents');

  function menu_component() {
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
          <Plant_album></Plant_album>
        </>
      )
    }
  } 



  useEffect(() => { menu_component(); }, [change])
  useEffect(() => { profile_print(); }, [setProfile])
  useEffect(() => { nickname_print(); }, [])
  // useEffect(() => { total_contents_request(); }, [total_contents, remain_contents]) // 뒤에 변수들의 값이 변할 때마다 실행


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

  return(
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
      <Main>
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
                <p onClick={ () => { setChange('own_contents') } }>내가 쓴 글</p>
              </li>
              <li>
                <p onClick={ () => { setChange('like_contents') } }>좋아요한 글</p>
              </li>
              <li>
                <p onClick={ () => { setChange('plant_album'); } }>내 식물앨범</p>
              </li>
            </ul>
          </div>

          {/* 위 메뉴 클릭에 따라 달라지는 화면 구현 */}
          <div>
            {menu_component()}
          </div>

        </div>
      </Main>
    </>
  );
}

export default User_info;