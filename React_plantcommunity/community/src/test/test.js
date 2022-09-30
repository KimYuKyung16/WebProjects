import React, { useEffect, useState } from 'react';
import './test.css'


function Test() {

  let [text, setText] = useState('');

  function test() {
    let html_content = document.getElementById("content");

    var strHtml = "<div contentEditable>";
    strHtml += text;
    strHtml += "</div>";

    console.log(strHtml);
    
    html_content.innerHTML = strHtml;
  }

  const keyevent = (e) => { 
    const selection = window.getSelection()
    console.log(selection);

    // if(e.key == 'Enter') { // 누른 키가 엔터키일 경우
    //   console.log('엔터키를 눌렀습니다.')
    //   setText((text) => text + '<p>&nbsp</p>' );
    // } 
  }

  function test2() {
    const selection = window.getSelection()
    console.log(selection);
  }


  useEffect(() => { test(); }, [text])

  return (
    <>
      <div id="content" onKeyDown={keyevent} onFocus={test2}></div> {/* onKeyDown 어떤키를 눌렀는지 확인할 수 있음. */}
      <p><img class="banner" src="/image/banner.png" /></p>
    </>
  );
}

export default Test;