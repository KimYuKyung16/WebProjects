import React, { useState } from 'react';
import './header.css';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';



function Header({ location, history }) {

  console.log(history);

  return (
    <>
      <header class="main_title">
        <h1 id="main_title">Plant Community</h1>
        <div class="navbar_togglebBtn">
          <i class="fas fa-bars"></i>
        </div>
      </header>
      
      <nav class="navbar"> 
        <ul class="navbar_menu">
          <li><a href="#">식물 기본 정보</a></li>
          <li><a href="plant_info_share.php">식물 정보 공유</a></li> 
          <li><a href="introduce_plant.php">내 식물 자랑</a></li>
        </ul>
        <ul class="navbar_icons">
          <li><FontAwesomeIcon icon={faCircleUser} id="my_info" onClick={()=> {history.push('/login')}}/></li>
          <input type="hidden" name="page_num" id="page_num" value="my_info" />
        </ul>
      </nav>
    </>
  );
}

export default Header;
