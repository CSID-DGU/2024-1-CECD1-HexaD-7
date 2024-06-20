import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import NavBarComponent from '../components/NavBar';
import logo from '../images/logo.png';
import API from '../api/axios'; 
import { useRecoilState } from 'recoil';
import {categoryState} from '../api/state';
import submitBtn from '../images/submitBtn.png';
import LoadingComponent from '../images/LoadingComponent.gif'
function TopicGenerator1() {
  const navigate = useNavigate();
  const [categories, setCategories] = useRecoilState(categoryState);
  const [loading, setLoading] = useState(false);
  function getOption2BasedOnFirstCategory(first_category){
    if (first_category === '건강정보'){
      return ['건강 일반', '먹거리 건강', '한방'];
      
    } else if (first_category === '산업정보'){
      return ['제약바이오', '식품/건강기능식품', '의료기기'];
    } else {
      return ['성형', '피부미용', '화장품'];
    }
  }
  

  const handleFirstCategorySelect = (option) => {
    const newOptions2 = getOption2BasedOnFirstCategory(option);
    console.log("New options2 prepared:", newOptions2);
  
    setCategories(prev => ({
      ...prev,
      first_category: option,
      options2: newOptions2
    }));
  }



  useEffect( ()=> {
    if (categories.first_category && categories.second_category){
      async function sendData(){
        setLoading(true);
        try {
          const response = await API.post('topicsuggestion/select-second-category',{
            first_category: categories.first_category,
            second_category: categories.second_category,

          });
          console.log("server response: ",response.data);
          navigate("/topicgenerator2", { state: { data: response.data } });
        }catch(error){
          console.log("categoreis: ", categories);
          console.error("Error sending data to the server", error);
        }
      }
      sendData();
    }
  }, [categories, navigate]);


    

  useEffect(() => {
    console.log("Updated options2:", categories.options2);
  }, [categories.options2]);  // options2가 변경될 때마다 이 useEffect가 실행됩니다.
  
  

  const handleSecondCategorySelect = async (option) => {
    setCategories(prev => ({ ...prev, second_category: option }));

    // 서버에 요청 보내기
    try {
      const response = await API.post('topicsuggestion/select-second-category', {
        first_category: categories.first_category,
        second_category: option,
      });
      console.log("Server response:", response.data);

    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  };

  


  const Bubble1 =({text}) => {
    return <BubbleOne>{text}</BubbleOne>
  }

  const Bubble2 = ({ onSelectCategory, options }) => {
    //const options = ['건강정보', '산업정보', '뷰티'];
    return (
      <BubbleTwo>
        {options.map((option, index) => (
          <div key={index} onClick={() => onSelectCategory(option)}
               style={{ padding: "0vw 2vw", boxSizing: 'border-box' }}>
            {option}{' →'}<br />
            {index < options.length - 1 && <StyledLine />}
          </div>
        ))}
      </BubbleTwo>
    );
  }


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
        {loading?(
          <LoadingBox>
            <img src={LoadingComponent} style={{width: "15vw"}}/>
          </LoadingBox>
        ):(
          <TopicFrame enctype="multipart/form-data">
        <div>

        <div style={{display:"flex", minHeight: "75%"}}>
        <Bubble1 text={categories.first_category ? "두번째 카테고리를 선택해주세요." : "첫번째 카테고리를 선택해주세요."} />

        {categories.first_category ? (
                    <Bubble2 options={categories.options2} onSelectCategory={handleSecondCategorySelect} />
                  ) : (
                    <Bubble2 options={['건강정보', '산업정보', '뷰티']} onSelectCategory={handleFirstCategorySelect} />
                  )}
                  </div>
        <div style={{display:"flex", justifyContent:"center", height:"10vw"}}>
        <form style={{minWidth:"100%", height: "4.5vw", display:"flex", justifyContent:"center"}}>
            <input style={{padding:"0vw 2vw", height:"60", width:"85%", margin:"0.7vw", boxSizing:"border-box", borderRadius:"5vw", border:"none", backgroundColor:"#E7E7E7"}}></input>
            <button style={{background:"transparent", border:"none"}}>
            <img src={submitBtn} alt="Submit Image" style={{width: "2vw", margin: "0vw 1vw"}} />
            </button>
        </form>
      </div>
         </div>
        </TopicFrame>
        )}
        </div>
      </div>
      
      </MainBox>
    </Frame>

  );
}

const LoadingBox = styled.div`
  width: 100%;
  min-height: 100%;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  padding: 0vw 0vw 10vw 0vw;
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

export default TopicGenerator1;