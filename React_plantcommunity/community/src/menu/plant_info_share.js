import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";

import styled from "styled-components"; // styled in js

function Plant_info_share() {

  const title_setting = {
    title_backcolor: "rgb(107, 164, 255)",
    title_textcolor: "rgb(255, 255, 255)",
  }

  const navbar_setting = {
    navbar_backcolor: "rgb(107, 164, 255)",
    navbar_textcolor: "rgb(255, 255, 255)",
  }
  
  return (
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
    </>
  );
}

export default Plant_info_share;
