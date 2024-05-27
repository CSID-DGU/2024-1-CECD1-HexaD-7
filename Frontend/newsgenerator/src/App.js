import React from 'react'
import styled from 'styled-components'
import NavBarComponent from './components/NavBar';
import logo from './images/logo.png';
import FormOpBtn from './components/FormOpBtn';
//import logo from './images/logo.png';

function App() {
  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <GuideBanner>사용자 가이드</GuideBanner>
      <TitleBox>
        <img src={logo} alt="Main Logo"style={{width: "15%"}}/>
      </TitleBox>
      <TextBox>
        <TextForm />
      </TextBox>
      </MainBox>
      <FormOpBtn />
    </Frame>

  );
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
  grid-template-rows: 0.5fr 1.5fr 5fr 3fr; // 4개의 행으로 구성, 각 행의 비율 조정
  align-items: stretch; // 수직 방향으로 가운데 정렬
`

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items:center;
  justify-content:center;
`

const TextBox = styled.div`
display:flex;
flex-direction: column;
align-items:center;
justify-content:center;

box-sizing: border-box; 
`
const TextForm = styled.textarea`
  width: 60%;
  height: 90%;
  padding: 2vw;
  border-radius: 10px;
  border-style: none;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);

`
const GuideBanner = styled.div`
  width: 100%;
  background-color: transparent;  // 배경색 변경
  align-items: right;
  padding: 20px;
  box-sizing: border-box; 
  font-weight: bold;
  text-align: right;
  font-size: 1vw;
  color: #0089CF;
  
`;


export default App;
