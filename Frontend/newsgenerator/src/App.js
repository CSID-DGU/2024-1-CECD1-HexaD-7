import React from 'react'
import styled from 'styled-components'
import NavBarComponent from './components/NavBar';
import logo from './images/logo.png';
import inputFile from './images/inputFile.png';
import FormOpBtn from './components/FormOpBtn';

function App() {
  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <GuideBanner>사용자 가이드</GuideBanner>
      <TitleBox>
        <img src={logo} alt="Main Logo"style={{width: "15%"}}/>
      </TitleBox>
      <div style={{display:"flex", justifyContent:"center"}}>
      <SubmitForm 
      action="/dummy" 
      method="POST" 
      enctype="multipart/form-data">
        <TextBox>
          <TextLabel for="coverage info">기사 작성에 필요한 취재정보를 입력하세요.</TextLabel>
          <TextForm type="text" id="coverage info" required/>
        </TextBox>
        <BtnBox>
        <label for="fileInput">
              <img 
                src={inputFile}
                alt="Upload File" 
                style={{ cursor: 'pointer', width: "30vw" }}
              />
          <InputFile type="file" id="fileInput" name="userFile" accept=".jpg, .jpeg, .png" />
          </label>
          <FormOpBtn />
          <SubmitBtn type="submit">기사 생성</SubmitBtn>
        </BtnBox>

        
      </SubmitForm>
      </div>
      </MainBox>
    </Frame>

  );
}

const SubmitBtn = styled.button`
  width: 7vw;
  height: 3vw;
  background-color: #0089CF;
  color: white;
  font-weight:bold;
  border-radius: 2vw;
  border-style:none;
  font-size: 1vw;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
  margin: 1vw 0vw 0vw 0vw;
  box-sizing: border-box;
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
const InputFile = styled.input`
  display:none;
`

const TextLabel = styled.label`
  font-size: 1vw;
  margin: 0vw 0vw 1vw 0vw;
  selfAlign: left;
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

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items:center;
  justify-content:center;
`

const TextBox = styled.div`
display:flex;
flex-direction: column;
align-items:left;
justify-content:center;
box-sizing: border-box; 
width: 45vw;
height: 30vw;
`
const TextForm = styled.textarea`
  width: 100%;
  height: 12vw;
  padding: 1vw;
  border-radius: 10px;
  border-style: none;
  background-color: #F5F6FA;
  box-sizing: border-box; 
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

const BtnBox = styled.div`
width: 50vw;
display: flex;
flex-direction: column;
align-items:flex-end;
padding: 3vw;
box-sizing: border-box; 
margin: 0 auto; // 자동 마진을 사용하여 좌우 중앙 정렬
`

export default App;
