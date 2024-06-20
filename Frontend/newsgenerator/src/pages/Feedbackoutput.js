import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavBarComponent from '../components/NavBar';
import logo from '../images/logo.png';
import { responseState, loadingState } from '../api/state.js';
import API from '../api/axios'; 
import { useRecoilState } from 'recoil';
import LoadingComponent from '../images/LoadingComponent.gif'

function Feedbackoutput() {
  const [loading, setLoading] = useRecoilState(loadingState);
  const [, setResponse] = useRecoilState(responseState);


  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <GuideBanner>사용자 가이드</GuideBanner>
        <TitleBox>
          <img src={logo} alt="Main Logo" style={{width: "15%"}}/>
        </TitleBox>
        <img src={LoadingComponent} alt="로딩중" width="30%" height="30%" style={{marginLeft:"28vw", marginTop:"10vw"}} />
      </MainBox>
    </Frame>
  );``
}



const Frame = styled.div`
width:95vw;
height: 50vw; 
background-color:#F5F6FA;
display: flex;
flex-directon: column;
align-items: stretch;
`

const MainBox = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: 0.5fr 1.5fr 5fr; // 4개의 행으로 구성, 각 행의 비율 조정
  align-items: stretch; // 수직 방향으로 가운데 정렬
`

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items:center;
  justify-content:center;
`

const GuideBanner = styled.a`
  width: 100%;
  background-color: transparent;  // 배경색 변경
  align-items: right;
  padding: 20px;
  box-sizing: border-box; 
  font-weight: bold;
  text-align: right;
  font-size: 1vw;
  color: #0089CF; 
  cursor: pointer;
`

export default Feedbackoutput;