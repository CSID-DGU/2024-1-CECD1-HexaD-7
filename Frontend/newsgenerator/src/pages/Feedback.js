import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NavBarComponent from '../components/NavBar';
import logo from '../images/logo.png';
import feedback from '../images/feedback.png';
import { responseState, loadingState } from '../api/state.js';
import API from '../api/axios'; 
import { useRecoilState } from 'recoil';
import FormOpBtn from '../components/FormOpBtn';
import feedgeneration from '../images/feedgeneration.png';
import aigeneration from '../images/aigeneration.png';

function Feedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [draft, setDraft] = useState('');
  const [articleType, setArticleType] = useState('');  // 추가된 상태
  const [loading, setLoading] = useRecoilState(loadingState);
  const [, setResponse] = useRecoilState(responseState);
  const [selectedButton, setSelectedButton] = useState('feedback');
  const [res, setRes] = useState(true);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('draft', draft);
    formData.append('article_type', articleType);  

    // FormData 확인을 위한 로그 출력
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log("formData: ",formData);

    setLoading(true);
    

    try {
      const response = await API.post('api/feedback/submit-article/', formData);
      setResponse(response.data);
      navigate("/feedbackoutput");
      console.log('Server response: ', response.data);
      // 여기에서 API 응답을 alert 창에 표시
      alert(`Message: ${response.data.message}\nArticle ID: ${response.data.article_id}`);
    } catch (error) {
      console.log('Error sending data to the server: ', error);
      alert('Error sending data to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <GuideBanner>사용자 가이드</GuideBanner>
        <TitleBox>
          <img src={logo} alt="Main Logo" style={{width: "15%"}}/>
        </TitleBox>
        <form onSubmit={handleSubmit} style={{display:"grid", gridTemplateColumns:"1fr 1fr"}}>
          <div style={{minWidth:"100%", minHeight:"100%"}}>
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin: "3vw", boxSizing:"border-box"}}>
              <form onSubmit={handleSubmit}>
              <TitleInput 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="기사 제목을 입력하세요" 
                required 
              />
              <ContentInput 
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="기사 초안을 입력하세요" 
                required 
              />
              <FormOpBtn selectedOption={articleType} onOptionClick={setArticleType} /> 
              </form>
            </div>
          </div>
          <div style={{minWidth:"100%", minHeight:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", boxSizing:"border-box"}}>
            {res? 
            <ResultFrame>
              {selectedButton === 'feedback' ? (
                  <ResultFeedbackBox>
                    <img src={feedgeneration} style={{width: "30vw"}}/>
                    <br />
                    {"response 받아올 부분"}
                  </ResultFeedbackBox>
                ) : (
                  <ResultArticleBox>
                    <img src={aigeneration} style={{width: "26vw"}}/>
                    {"article response 받아올 부분"}
                  </ResultArticleBox>
                )}
            {/* <ResultFeedbackBox>
              {"response 받아올 부분"}
            </ResultFeedbackBox> */}
            <BtnBox>
            <FeedbackBtn 
                color={selectedButton === 'feedback' ? "#0089CF" : "#F5F6FA"}
                textcolor={selectedButton === 'feedback' ? "white" : "black"} 
                onClick={() => handleButtonClick('feedback')}
              >
                AI<br/>피<br/>드<br/>백
              </FeedbackBtn>
              <FeedbackBtn 
                color={selectedButton === 'article' ? "#0089CF" : "#F5F6FA"}
                textcolor={selectedButton === 'feedback' ? "black" : "white"}
                onClick={() => handleButtonClick('article')}
              >
                AI<br/>기사<br/>생성<br/>조회
              </FeedbackBtn>
            </BtnBox>
            </ResultFrame>
            :<div>
              <img src={feedback} style={{width: "10vw"}}/>
              <SubmitBtn type="submit">기사 초안 제출하기 →</SubmitBtn>
            </div>
            }
          </div>
        </form>
      </MainBox>
    </Frame>
  );
}

const BtnBox = styled.div`
  display: grid;
  grid-template-rows: 1fr 3fr;
`

const FeedbackBtn = styled.div`
  color: ${props => props.textcolor};;
  font-size: 1vw;
  font-weight: bold;
  width: 2vw;
  height: 5vw;
  border-radius: 0vw 1vw 1vw 0vw;
  background-color: ${props => props.color};
  border: none;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  padding: 1vw;
  box-sizing: borer-box;
  &:hover{
  background-color:#0089CF;
  color:white;
  }
`
const ResultFrame =styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr
`
const ResultFeedbackBox = styled.div`
  background-color: #FFFFFF;
  font-size: 1.2vw;
  width: 28vw;
  height: 25vw;
  border-radius: 2vw 0vw 2vw 2vw;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  border:none;
  padding: 2vw;
  overflow-y: auto; 
  overflow-x: hidden; 
  word-wrap: break-word; /* 긴 단어 다음라인으로 보내버리기 */
  word-break: break-word; 
`

const ResultArticleBox = styled.div`
  background-color: #FFFFFF;
  font-size: 1.2vw;
  width: 28vw;
  height: 25vw;
  border-radius: 2vw 0vw 2vw 2vw;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  border:none;
  padding: 2vw;
  overflow-y: auto; 
  overflow-x: hidden; 
  word-wrap: break-word; /* 긴 단어 다음라인으로 보내버리기 */
  word-break: break-word; 
`



const TitleInput = styled.input`
    border-radius: 1vw;
    border:none;
    background-color: #D9D9D9;
    height: 3vw;
    width: 30vw;
    box-sizing: border-box;
    padding: 0vw 2vw;
`;

const ContentInput = styled.textarea`
    box-sizing: border-box;
    padding: 2vw 2vw;
    border-radius: 1vw;
    border:none;
    background-color: #D9D9D9;
    margin: 2vw 0vw;
    width: 30vw;
    height: 20vw;
`;

const Frame = styled.div`
width:95vw;
height: 50vw; 
background-color:#F5F6FA;
display: flex;
flex-directon: column;
align-items: stretch;
`;

const MainBox = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: 0.5fr 1.5fr 5fr; // 4개의 행으로 구성, 각 행의 비율 조정
  align-items: stretch; // 수직 방향으로 가운데 정렬
`;

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items:center;
  justify-content:center;
`;

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

const SubmitBtn = styled.button`
    width: 30vw;
    height: 4vw;
    border:none;
    border-radius: 1vw;
    font-weight: bold;
    font-size: 1.5vw;
    color: white;
    background-color:#0089CF;
    box-sizing: border-box;
    margin-top: 1vw;
    margin-bottom: 7vw;
`;

export default Feedback;
