import React, {useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import NavBarComponent from '../components/NavBar';
import logo from '../images/logo.png';
import { responseState, loadingState } from '../api/state.js';
import API from '../api/axios'; 
import { useRecoilState } from 'recoil';
import submitBtn from '../images/submitBtn.png';
function TopicGenerator1() {
  const navigate = useNavigate();
  const textInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const factCheckRef = useRef(null);

  const [loading, setLoading] = useRecoilState(loadingState);
  const [, setResponse] = useRecoilState(responseState);

  const Bubble1 =({text}) => {
    return <BubbleOne>{text}</BubbleOne>
  }

  const Bubble2 =({text1, text2, text3}) => {
    return <BubbleTwo>
                <div style={{display:"flex", flexDirection:"column", marginRight:"2vw"}}>{text1}</div>
                <StyledLine />
                <div style={{display:"flex", flexDirection:"column", marginRight:"2vw"}}>{text2}</div>
                <StyledLine />
                <div style={{display:"flex", flexDirection:"column", marginRight:"2vw"}}>{text3}</div>
           </BubbleTwo>
  }

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
  
    formData.append('research_info', textInputRef.current.value);
    if (fileInputRef.current.files[0]) {
      formData.append('file', fileInputRef.current.files[0]);
    }
    formData.append('article_type', '스트레이트기사');
    formData.append('fact_check_highlight', factCheckRef.current.checked);
    setLoading(true);
    navigate("/mainloading");
    
    try {
      const response = await API.post('textprocessor/api/generate-article', formData);
      setResponse(response.data);
      navigate("/mainoutput")
      console.log('Server response: ', response.data);
    } catch (error) {
      console.log('Error sending data to the server: ', error);
    }finally{
      setLoading(false);
    }
  };
  




  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <GuideBanner>사용자 가이드</GuideBanner>
      <TitleBox>
        <img src={logo} alt="Main Logo"style={{width: "15%"}}/>
      </TitleBox>
      <div style={{minHeight:"100%"}}>
        <div style={{ fontSize: '1vw',maxHeight:"2vw", marginLeft:'3vw', marginTop:'1.5vw'}}>
            헬스경향 카테고리 분류별 기사작성 주제를 재안해주는 AI 서비스입니다.
        </div>
        <div style={{ fontSize: '1.5vw',minHeight:"100%", display:"flex", flexDirection:"bottom"}}>
        <TopicFrame onSubmit={handleSubmit} enctype="multipart/form-data">
        <div style={{display:"flex", minHeight: "100%"}}>
        <Bubble1 text={'첫번째 카테고리를 선택해주세요.'}/>
         <Bubble2 text1={'건강정보 →'} text2={'산업정보 →'} text3={'뷰티 →'}/>
         </div>
         <div style={{display:"flex", justifyContent:"center", height:"10vw"}}>
        <form style={{minWidth:"100%", minHeight: "5vw", display:"flex", justifyContent:"center"}}>
            <input style={{padding:"0vw 2vw", height:"60", width:"85%", margin:"0.7vw", boxSizing:"border-box", borderRadius:"5vw", border:"none", backgroundColor:"#E7E7E7"}}></input>
            <button style={{background:"transparent", border:"none"}}>
            <img src={submitBtn} alt="Submit Image" style={{width: "2vw", margin: "0vw 1vw"}} />
            </button>
        </form>
      </div>
        </TopicFrame>
        </div>
      </div>
      
      </MainBox>
    </Frame>

  );
}


const StyledLine = styled.hr`
    height: 0.1vw; // Adjust thickness
    background0-color: white; // Line color
    color:white;
    margin: 1vw 0; // Spacing around the line
`;

const BubbleOne = styled.div`   
    width: 28vw;
    height: 4vw;
    background-color: #E7E7E7;
    border-radius: 100px 100px 100px 0px;
    margin: 3vw;
    padding: 1vw 0vw 1vw 2vw;
    box-sizing: border-box;
`

const BubbleTwo = styled.div`
    text-align: right;
    width: 30vw;
    height: 15vw;
    background-color: #0089CF;
    color: #FFFFFF;
    font-weight: bold;
    border-radius: 50px 35px 0px 50px;
    margin: 11vw 3vw 3vw 3vw;
    display: flex;
    flex-direction: column;
    padding: 2vw;
    box-sizing: border-box;
    font-size: 1.8vw;
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
  grid-template-rows: 0fr 1.8fr 5fr; // 4개의 행으로 구성, 각 행의 비율 조정
  align-items: bottom; // 수직 방향으로 가운데 정렬
`


const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items:center;
  justify-content:center;
`

const TopicFrame = styled.div`
  width: 100%;
  height:32vw;
  padding: 1vw;
  border-radius: 5vw 5vw 0vw 0vw;
  border-style: none;
  background-color: #FFFFFF;
  box-sizing: border-box; 
  margin-top: 1vw;
  display:flex;
  flex-direction: column;
  
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

export default TopicGenerator1;