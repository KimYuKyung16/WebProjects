import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './profile.css';

import cookies from 'react-cookies'; // 쿠키 저장

const FormData = require('form-data');

function Profile() {

  axios.defaults.headers.common['cookies'] = encodeURIComponent(cookies.load('login_cookie')); // for all requests
  
  let [profile_src, setProfileSrc] = useState('/image/sky.JPG');
  let [file, setFile] = useState();

  let [profile, setProfile] = useState(); // 등록되어있는 내 프로필 사진

  const fileInput = useRef();

  function profile_print() {
    axios.post(`http://localhost:5000/user_info/profile_print`, {

    })
    .then(function (response) { 
      console.log(response.data)
      setProfile('http://localhost:5000/' + response.data);
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
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => { profile_print(); }, [setProfile])



  return(
    <>
        <img action="http://localhost:5000/user_info/profile" encType="multipart/form-data" id="profile" className="profile_image" alt="profile" src={profile_src}/>
        <img src={profile} />
        <input type="file" className="inputfile" accept=".jpg, .jpeg, .png" onChange={profile_upload} />
        <input onClick={profile_save} type="button" value="저장" />
      {/* <input onClick={profile_save} type="button" className="inputfile" value="저장"/> */}
      
    </>
  );
}

export default Profile;