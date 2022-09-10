import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './profile.css';

import cookies from 'react-cookies'; // 쿠키 저장

function Profile() {

  let [profile_src, setProfileSrc] = useState('/image/sky.JPG');

  function profile_upload(e) {
    let currentFiles = e.target.files[0];
    
    setProfileSrc(URL.createObjectURL(currentFiles));
  }

  return(
    <>
      <img className="profile_image" alt="profile" src={profile_src}/>
      <input type="file" className="inputfile" accept=".jpg, .jpeg, .png" name="profile_file" onChange={profile_upload} />

      <input type="button" className="inputfile" value="저장"/>
    </>
  );
}

export default Profile;