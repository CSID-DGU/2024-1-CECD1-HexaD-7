import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import NavBarComponent from '../components/NavBar';
import logo from '../images/logo.png';
import API from '../api/axios';
import LoadingComponent from '../images/LoadingComponent.gif'
import { useRecoilValue } from 'recoil';
import { responseState } from '../api/state';
function MainOutput() {
  const response = useRecoilValue(responseState);
  // JSON 데이터에서 불필요한 기호를 제거하고 알맹이만 추출
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
        <SimilarityBox>
            <div>품질 검증을 위해<br/> 유사도가 높은 상위 k개의 기사를 제공합니다.</div>
            <div style={{minHeight:"20vw",display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                <img src={LoadingComponent} alt="로딩중" width="30%" />
            </div>
        </SimilarityBox>
        <div style={{ display: "grid", gridTemplateRows: "1fr 7fr", minHeight:"100%" }}>
        <TextBox>기사 생성이 완료되었습니다.</TextBox>
        {response ? (
          <LLMText>{JSON.stringify(response, null, 2)}</LLMText>
        ) : (
          <LLMText>No response received.</LLMText>
        )}
        </div>
        </SubmitForm>
        </div>
      </MainBox>
    </Frame>

  );
}

// const LLMText = styled. div`
//   box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
//     max-height: 100%;
//     background-color: #F5F6FA;
//     box-sizing: border-box;
//     padding: 1vw;
//     font-size:1.5vw;
//     margin-right: 3vw;
//     margin-bottom: 2vw;
//     border-radius: 1vw;
//     overflow: scroll;

// `
const LLMText = styled.div`
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  max-height: 100%;
  max-height: 20vw; /* Set the fixed height */
  background-color: #F5F6FA;
  box-sizing: border-box;
  padding: 1vw;
  font-size: 1.5vw;
  margin-right: 3vw;
  margin-bottom: 2vw;
  border-radius: 1vw;
  overflow: auto; /* Allow the content to be scrollable */
  white-space: pre-wrap; /* Ensure text wraps properly */
`
const SimilarityBox = styled.div`
  font-size:1.2vw;
  font-weight:bold;
  margin-bottom: 1vw;
  min-height: 100%;
  box-sizing:border-box;
  margin-right: 2vw;
`

const TextBox = styled.div`
  font-size:1.2vw;
  font-weight:bold;
  margin-bottom: 1vw;
 
  box-sizing:border-box;
  margin-left:1vw;
  margin-right:1vw;
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
display: grid;
grid-template-columns: 1fr 1fr;
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



export default MainOutput;