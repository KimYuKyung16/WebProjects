import React, { useState, useEffect } from 'react';
import { useNavigate, Link, resolvePath } from "react-router-dom";

import { colorConfig } from '../config/color';

import axios from "axios";

import './plant_album.css';

import styled from "styled-components"; // styled in js

import cookies from 'react-cookies'; // 쿠키 저장


function Plant_album() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [change, setChange] = useState('default');

  let [album_name, setAlbumName] = useState(); // 앨범 이름
  let [plant_name, setPlantName] = useState(); // 식물 이름

  let [data, setData] = useState();

  const onChangeAlbumName = (e) => { // 앨범 이름을 변경할 때마다
    console.log(e.target);
    setAlbumName(e.target.value);
  }

  const onChangePlantName = (e) => { // 식물 이름을 변경할 때마다
    console.log(e.target);
    setPlantName(e.target.value);
  }


  function create_album() {
    const album_set_val = {
      album_name: album_name,
      plant_name: plant_name
    }
    axios.post(`http://localhost:5000/plant_album`, {
      album_set_val
    })
    .then(function (response) { // 앨범 생성이 완료됐을 경우
      console.log(response)
    })
    .catch(function (error) { // 앨범 생성 오류
      console.log(error);
    })
  }

  function get_album() {
    axios.get(`http://localhost:5000/plant_album/album_list`)
    .then(function (response) { // 앨범 생성이 완료됐을 경우
      const data = [...response.data];
      console.log(data[0].album_name);
      setData(data);
    })
    .catch(function (error) { // 앨범 생성 오류
      console.log(error);
    })
  }





  function component() {
    if (change === 'default') {
      return (
        <> 
          <div>
            <p>앨범이름: {data[0].album_name}</p>
          </div>

          <div className="each_album">
            <img src="/image/add_album.png" width="100" height="100" onClick={() => { setChange('create'); }}/>
          </div>
          
        </>
      );
    } else if (change === 'create') {
      return (
        <>
          <div>
            <p>앨범 이름</p>
            <input type="text" placeholder='앨범이름을 입력하세요' onChange={onChangeAlbumName}/>
            <p>키우고 있는 식물의 이름</p>
            <input type="text" placeholder='식물의 이름을 입력하세요' onChange={onChangePlantName} />
            <input type="button" value="저장" onClick={create_album}/>
          </div>
        </>
      );
    }
  }

  useEffect(() => { get_album() }, []) // 처음에 무조건 한 번 실행
  useEffect(() => { component() }, [change]) // 처음에 무조건 한 번 실행

  return (
    <>
      <p className="tmp_title">내 식물 앨범</p>

      <div>
        {component()}
      </div>
    </>
  );

}

export default Plant_album;
