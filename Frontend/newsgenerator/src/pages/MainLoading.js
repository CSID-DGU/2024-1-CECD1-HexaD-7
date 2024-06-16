import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import NavBarComponent from '../components/NavBar';
import logo from '../images/logo.png';
import API from '../api/axios';
import Loading from '../components/Loading'; 
import LoadingComponent from '../images/LoadingComponent.gif'
function MainLoading() {
  const [seconds, setSeconds] = useState(0);

  
  useEffect(() => {

      const timer = setInterval(() => {
        setSeconds(seconds + 1);
      }, 1000);
      return () => clearInterval(timer);
    
  }, [seconds]);


  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
      <GuideBanner>사용자 가이드</GuideBanner>
      <TitleBox>
        <img src={logo} alt="Main Logo"style={{width: "15%"}}/>
      </TitleBox>
      <div style={{display:"flex", justifyContent:"center"}}>
        <SubmitForm>
        <LoadingText>LLM 출력을 불러오는 중입니다 ...</LoadingText>
          <LoadingText>잠시만 기다려 주세요. {seconds}sec</LoadingText>
          <img src={LoadingComponent} alt="로딩중" width="30%" />
        </SubmitForm>
        </div>
      </MainBox>
    </Frame>

  );
}

const LoadingText = styled.div`
  font-size:1.4vw;
  font-weight:bold;
  margin-bottom: 1vw;
`

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items:center;
  justify-content:center;
`
const SubmitForm = styled.form`
width: 60vw;
height: 30vw;
background-color:#FFFFFF;
box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);
border-radius: 0.5vw;
border-style: none;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
padding: 3vw 0vw 0vw 1vw;
box-sizing: border-box; 
`



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
`;



export default MainLoading;