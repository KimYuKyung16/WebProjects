import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

import './main.css';

import Header from "../layout/header";
import { colorConfig } from "../config/color"; // 홈페이지 색감 정보

import axios from "axios";

import styled from "styled-components"; // styled in js
import { text } from '@fortawesome/fontawesome-svg-core';

const LoginDiv = styled.div`
  display: block;
  `;

const UserDiv = styled.div`
  display: none;
  `;

const Profile = styled.img`
width: 30px;
height: 30px;
border-radius: 70%;
`;

function Main() {

  const title_setting = {
    title_backcolor: colorConfig.sub_color,
    title_textcolor: colorConfig.main_color
  }

  const navbar_setting = {
    navbar_backcolor: colorConfig.sub_color,
    navbar_textcolor: colorConfig.main_color
  }

  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  const [contents, setContents] = useState([]);
  const [popularcontents, setPopularContents] = useState([]);


  let [total_contents, setTotalcontents] = useState(); // 게시글의 총 개수
  let one_page_contents = 20; // 한 페이지 당 게시글의 개수

  let [total_pages, setTotalpages] = useState(1); // 총 페이지 개수
  let [remain_contents, setRemaincontents] = useState(); // 나머지 게시글 개수

  function each_page_contents(current_page) {
    axios.get('http://localhost:5000/board/plant_info_share', { // 서버로 post 요청
      params: {
        current_page: current_page, 
        one_page_contents: one_page_contents
      }  
    })
    .then(function (response) { // 서버에서 응답이 왔을 때
      const data = [...response.data];
      setContents(data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

    // 클로저를 이용해서 가장 마지막 값만 출력되는 오류를 해결
  function page_button_create() { // 페이지 버튼 생성
    let button_array = [];
    for (let i=1; i<total_pages+1; i++) {
      button_array.push(<input class="page_btn" key={i} type="button" value={i} onClick={ () => {each_page_contents(i)} } />)
    }
    return button_array;
  }
  

  
  function total_contents_request() { // 게시글의 총 개수
    axios.get('http://localhost:5000/board/plant_info_share/total_contents') // 서버로 post 요청
      .then(function (response) { // 서버에서 응답이 왔을 때
        setTotalcontents(response.data[0].count);
   
        setTotalpages(parseInt(total_contents / one_page_contents));// 총 페이지 개수 설정
        setRemaincontents(total_contents % one_page_contents); // 나머지 게시글 개수 설정
       
        if (remain_contents) { // 현재 페이지가 1페이지가 아니고 나머지 페이지가 있다면
          setTotalpages(total_pages => total_pages+1) // 총 페이지에 +1
        } 
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  function popular_contents() {
    axios.get('http://localhost:5000/board/popular_contents') // 서버로 post 요청
    .then(function (response) { // 서버에서 응답이 왔을 때
      const data = [...response.data];
      setPopularContents(data);
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // Effect가 수행되는 시점에 이미 DOM이 업데이트 되어있음을 보장함.
  useEffect(() => { each_page_contents(1); popular_contents(); }, []) // 처음에 무조건 한 번 실행
  useEffect(() => { total_contents_request(); }, [total_contents, remain_contents]) // 뒤에 변수들의 값이 변할 때마다 실행
 

  
  return (
    <div class="table_div">
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
      {/* <div class="top_div">
        <div class="banner_div">
          <img class="banner" src="/image/banner.png" />
        </div>

        <div id="side_menu" class="side_menu">
          <LoginDiv> 
            <ul class="main_login">
                <li>
                  <h2 class="login_title">로그인</h2>
                </li>
                <li><input id="u_id" class="login_element" type="text" name="id" placeholder="아이디" /></li>
                <li><input id="u_pw" class="login_element" type="password" name="pw" placeholder="비밀번호" /></li>  
                <div id="login_signup_btn_div">
                  <li><input id="login_btn" class="login_btn_element" type="button" value="로그인" /></li>
                  <li><input id="signup_btn" class="login_btn_element" type="button" value="회원가입" /></li> 
                </div>
            </ul>
          </LoginDiv>
          <UserDiv>  
            <ul class="main_login">
              <li>
                <div id="my_profile_div">
                    <ul>
                      <li>아이디: </li>
                      <li>닉네임: </li>
                    </ul>
                </div>
              </li>
              <li id="write_btn"><input type="button" value="글쓰기" /></li>
              <li><input id="logout_btn" type="button" value="로그아웃" /></li>
            </ul>
          </UserDiv>
        </div>

        

        <div id="main_div">
          <div class="content_list_div">

            <div class="popular_div">
              <div class="title">
                <h2>인기글</h2>
              </div>
              <table id="popular_content_list">
                <thead>
                  <tr>
                    <th class="num">번호</th>
                    <th class="content_title">제목</th>
                    <th class="writer">작성자</th>
                    <th class="date">날짜</th>
                    <th class="click_count">조회수</th>
                  </tr>
                </thead>
                <tbody>
                    <tr class="content_list">
                      <td class="num"></td>
                      <td class="content_title"></td>
                      <td class="writer">
                      </td>
                      <td class="date"></td>
                      <td class="click_count"></td>
                    </tr>
                </tbody>
              </table>

            </div>


            <div class="test">
              <div class="title">
                <h2>전체글</h2>
              </div>
              <table id="content_list">
                <thead>
                  <tr>
                    <th class="num">번호</th>
                    <th class="content_title">제목</th>
                    <th class="writer">작성자</th>
                    <th class="date">날짜</th>
                    <th class="click_count">조회수</th>
                  </tr>
                </thead>
                <tbody>
                    <tr class="content_list">
                      <td class="num"></td>
                      <td class="content_title"></td>
                      <td class="writer">
                      </td>
                      <td class="date"></td>
                      <td class="click_count"></td>
                    </tr>
                </tbody>
              </table>

              <div class="pager">
              </div>

            </div>
          </div>
        </div>
      </div> */}

      <div class="line_div">
        <hr class="middle_line" />
      </div>

      {/* 인기글 */}
      <div class="popular_contents">
        <h2 className="subject">인기글</h2>
        <table>
          <thead>
            <tr>
              <th className="num">순위</th>
              <th className="content_title">제목</th>
              <th className="date">날짜</th>
              <th className="click_count">조회수</th>
            </tr>
          </thead>
          <tbody>
            {popularcontents.map((x, index) => {
              let link = `/plant_info_share/contents/${x.num}`;
              // let personal_profile = board_profile_print(x.writer);

              // personal_profile.then((val) => {
              //   setTest1(val);
              // })

            
              // let test3 = test1;
              // console.log(test3);

              return (
                <tr>
                  <td className="num">{index + 1}</td>
                  <td className="content_title"><Link to = {link}>{x.title}</Link></td>
                  <td className="date">{x.date}</td>
                  <td className="click_count">{x.clickcount}</td>
                </tr>   
              )        
            })}
          </tbody>
        </table>
      </div>

      <div class="main_table">
      <h2 className="subject">전체글</h2>
        <table>
          <thead>
            <tr>
              <th className="num">번호</th>
              <th className="content_title">제목</th>
              <th className="writer">작성자</th>
              <th className="date">날짜</th>
              <th className="click_count">조회수</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((x) => {
              let link = `/plant_info_share/contents/${x.num}`;
              // let personal_profile = board_profile_print(x.writer);

              // personal_profile.then((val) => {
              //   setTest1(val);
              // })

            
              // let test3 = test1;
              // console.log(test3);

              return (
                <tr>
                  <td className="num">{x.num}</td>
                  <td className="content_title"><Link to = {link}>{x.title}</Link></td>
                  <td className="writer" id="writer1"><Profile src={x.profile === "\\image\\default_profile.png" ? x.profile : "http://localhost:5000/" + x.profile}></Profile>{x.writer}</td>
                  <td className="date">{x.date}</td>
                  <td className="click_count">{x.clickcount}</td>
                </tr>   
              )        
            })}
          </tbody>
        </table>
        <div className='page_button_div'>
          {page_button_create() /* 페이지 출력*/ } 
        </div>
      </div>
    </div>
  );
}

export default Main;
