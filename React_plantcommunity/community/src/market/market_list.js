import React, { useState, useEffect } from 'react';
import { useNavigate, Link, resolvePath } from "react-router-dom";

import Header from "../layout/header";
import { colorConfig } from '../config/color';

import './market_list.css';

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


function Market() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  const [contents, setContents] = useState([]);

  let [total_contents, setTotalcontents] = useState(); // 게시글의 총 개수
  let one_page_contents = 20; // 한 페이지 당 게시글의 개수

  let [total_pages, setTotalpages] = useState(1); // 총 페이지 개수
  let [remain_contents, setRemaincontents] = useState(); // 나머지 게시글 개수

  let [search_value, setSearchvalue] = useState();


  function test(link) {
    navigate(link);
  }

  function login_confirm() {
    let authentication;

    axios.get('http://localhost:5000/login/authentication') // 서버로 post 요청
      .then(function (response) { // 서버에서 응답이 왔을 때
       if (response.data.authenticator === true) {
        console.log("인증되어있는 회원이 맞습니다.")
        authentication = true;
        // navigate('/write'); // 글쓰기 페이지로 이동
       } else {
        alert("글을 쓸 권한이 없습니다. 로그인을 먼저 해주세요.");
        authentication = false;
        navigate('/login'); // 로그인 페이지로 이동
       }
      })
      .catch(function (error) {
        console.log(error);
      });

      if (authentication) { navigate('/write'); }
      else { navigate('/login'); }


    navigate('/write'); // 글쓰기 페이지로 이동
  }


  function total_contents_request() { // 게시글의 총 개수
    axios.get('http://localhost:5000/board/plant_market/total_contents') // 서버로 post 요청
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


  function each_page_contents(current_page) {
    axios.get('http://localhost:5000/board/plant_market', { // 서버로 post 요청
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

  useEffect(() => { each_page_contents(1); }, []) // 처음에 무조건 한 번 실행
  useEffect(() => { total_contents_request(); }, [total_contents, remain_contents]) // 뒤에 변수들의 값이 변할 때마다 실행
 


  return (
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>

      {contents.map((x) => {
            let link = `/plant_market/contents/${x.num}`;

            return (
              <div onClick={() => test(link)}>
                <img src={x.thumbnail} />
                <h4>{x.title}</h4>
                {/* <td className="num">{x.num}</td>
                <td className="content_title"><Link to = {link}>{x.title}</Link></td>
                <td className="writer" id="writer1">{x.writer}</td>
                <td className="date">{x.date}</td>
                <td className="click_count">{x.clickcount}</td> */}
              </div>   
            )        
          })}

      <div className="button_div">
        <input onClick={login_confirm} id="write_button" type="button" value="글쓰기" />
      </div>

    </>
  );
}

export default Market;
