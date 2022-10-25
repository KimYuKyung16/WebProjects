import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './profile.css';

import styled from "styled-components"; // styled in js

import Header from '../layout/header';
import { colorConfig } from "../config/color"; // 홈페이지 색감 정보



import cookies from 'react-cookies'; // 쿠키 저장

const FormData = require('form-data');

const Exist_Profile = styled.img`
width: 300px;
height: 300px;
`;

// const Exist_profile_div = styled.div`
//   width: 200px;
//   height: 200px;
// `;

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


function Profile() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  axios.defaults.headers.common['cookies'] = encodeURIComponent(cookies.load('login_cookie')); // for all requests
  
  let [profile_src, setProfileSrc] = useState('/image/default_file.png');
  let [file, setFile] = useState();

  let [profile, setProfile] = useState(); // 등록되어있는 내 프로필 사진

  const fileInput = useRef();

  function profile_print() {
    axios.post(`http://localhost:5000/user_info/profile_print`)
    .then(function (response) { 
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


  async function profile_upload(e) {

    const upload_file = e.target.files[0];
    await setFile(upload_file);
    await setProfileSrc(URL.createObjectURL(upload_file)); // blob:http://localhost:3001/a562757f-b737-4b3a-97f0-2461c9e9c611 이런 형태로 출력
    
  }

  function profile_save() {
    const fd = new FormData();
    fd.append("uploadImage", file);

    console.log(fd)

    axios.post(`http://localhost:5000/user_info/profile`, fd,
    { headers: {
      'Content-Type': 'multipart/form-data; charset: UTF-8;'
    }})
    .then(function (response) { 
      console.log(response.data)
      navigate('/user_info')
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => { profile_print(); }, [setProfile])



  return(
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>

      <div className='total_profile_div'>
        <div className='exist_profile_div'>
          <h3>기존 프로필</h3>
          <Exist_Profile src={profile} />
        </div>

        <div className='modified_profile_div'>
          <h3>바꿀 프로필</h3>
          <img action="http://localhost:5000/user_info/profile" encType="multipart/form-data" id="profile" className="profile_image" alt="profile" src={profile_src}/>
          <div className='save_div'>
            <input type="file" className="inputfile" accept=".jpg, .jpeg, .png" onChange={profile_upload} />
            <input id="save_btn2" onClick={profile_save} type="button" value="저장" />
          </div>
        </div>

       
      </div>

     
    </>
  );
}

export default Profile;