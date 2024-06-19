import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavBarComponent from '../components/NavBar';
import logo from '../images/logo.png';
import feedback from '../images/feedback.png';
import { responseState, loadingState } from '../api/state.js';
import API from '../api/axios'; 
import { useRecoilState } from 'recoil';
import FormOpBtn from '../components/FormOpBtn';

function Feedback() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [draft, setDraft] = useState('');
  const [articleType, setArticleType] = useState('');  // 추가된 상태
  const [loading, setLoading] = useRecoilState(loadingState);
  const [, setResponse] = useRecoilState(responseState);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('draft', draft);
    formData.append('article_type', articleType);  // 추가된 필드

    // FormData 확인을 위한 로그 출력
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log("formData: ",formData);

    setLoading(true);
    

    try {
      navigate("/mainloading");
      const response = await API.post('api/feedback/submit-article/', formData);
      setResponse(response.data);
      navigate("/mainoutput");
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
              <FormOpBtn onOptionClick={setArticleType} /> {/* 클릭 핸들러 추가 */}
            </div>
          </div>
          <div style={{minWidth:"100%", minHeight:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", boxSizing:"border-box"}}>
            <img src={feedback} style={{width: "10vw"}}/>
            <SubmitBtn type="submit">기사 초안 제출하기 →</SubmitBtn>
          </div>
        </form>
      </MainBox>
    </Frame>
  );
}

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

export default Feedback;
