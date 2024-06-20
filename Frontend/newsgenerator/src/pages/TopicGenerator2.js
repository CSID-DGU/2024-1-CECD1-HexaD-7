import React, {useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import NavBarComponent from '../components/NavBar';
import logo from '../images/logo.png';
import { useRecoilState } from 'recoil';
import {categoryState} from '../api/state';



function TopicGenerator2() {
  // const location = useLocation();
  // const { data } = location.state || { data: { message: '', suggested_topics: [] } };
  // const topics = data.suggested_topics[0].split('\n');
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || { data: { message: '', suggested_topics: [] } };
  const topics = data.suggested_topics[0].split('\n');
  const [, setCategories] = useRecoilState(categoryState);

  useEffect(() => {
    return () => {
      // 페이지를 나갈 때 categoryState를 초기화
      setCategories({
        first_category: '',
        second_category: '',
        options2: [],
      });
    };
  }, [setCategories]);

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
        <b>{data.message}</b>
        </div>
        
        <div style={{ fontSize: '1.5vw',minHeight:"90%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
        {topics.map((topic, index) => (
              <TopicBox key={index}>{topic}</TopicBox>
            ))}
        </div>
      </div>
      
      </MainBox>
    </Frame>

  );
}

const TopicBox  =    styled.div`
    font-size: 1.2vw;
    font-weight: bold;
    //text-align: center;
    border: none;
    border-radius:100px;
    width: 60vw;
    height: 4vw; 
    background-color: rgba(0, 137, 207, 0.12);
    padding: 1.2vw 2.5vw;
    margin: 0vw 0vw 2.7vw 0vw;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

`

const StyledLine = styled.hr`
    height: 0.05vw; 
    background0-color: white; 
    color:white;
    min-width: 100%;
    margin: 0.5vw 0vw;
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
    height: 12vw;
    background-color: #0089CF;
    color: #FFFFFF;
    font-weight: bold;
    border-radius: 35px 35px 0px 35px;
    margin: 7vw 3vw 0vw 3vw;
    display: flex;
    flex-direction: column;
    padding: 1.8vw;
    box-sizing: border-box;
    font-size: 1.5vw;
    & > div{
      cursor:pointer;
    }
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

export default TopicGenerator2;