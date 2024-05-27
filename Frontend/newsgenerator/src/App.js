import React, {useState} from 'react'
import styled from 'styled-components'
import NavBarComponent from './components/NavBar';
import logo from './images/logo.png';
import check from './images/check.png';
import nocheck from './images/nocheck.png';
import clip from './images/clip.png';
import FormOpBtn from './components/FormOpBtn';

function App() {

  const [imagePath, setImagePath] = useState(nocheck);
  const[fileName, setFileName] = useState('파일을 선택해주세요.')


  const handleCheckboxChange = (event) => {
    setImagePath(event.target.checked ? check:nocheck); 
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if(file){
      setFileName(file.name);
    }else{
      setFileName('파일을 선택해주세요.');
    }
  }


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
          <Filename>
            {fileName}<span><img src={clip} style={{width: "1.2vw", margin: "0vw 0.5vw"}}/></span>
            </Filename>
          <InputFile 
          type="file" 
          id="fileInput" 
          name="userFile" 
          accept=".jpg, .jpeg, .png"
          onChange={handleFileChange} />
          </label>
          <FormOpBtn />
        </BtnBox>      
        <BottomBox>
        <div style={{display: "flex", alignItems:"center"}}>
          <TextLabel for="factcheck">팩트체크 하이라이팅 여부</TextLabel>
            <input type="checkbox" 
            id='factcheck' name='factcheck' 
            style={{display:"none"}}
            onChange={handleCheckboxChange}
            />
            <label htmlFor="factcheck">
              <img src={imagePath} alt="Checkbox Image" style={{width: "2vw", margin: "0vw 1vw"}} />
            </label>
        </div>
        <SubmitBtn type="submit">기사 생성</SubmitBtn>  
        </BottomBox>
      </SubmitForm>
      </div>
      </MainBox>
    </Frame>

  );
}

const Filename = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content:flex-end;
  background-color: #F5F6FA;
  border-style: solid;
  border-color: #D9D9D9;
  border-width: 0.5px;
  font-size:1vw;
  border-radius:0.5vw;
  padding: 0.2vw 3vw;
  margin: 0vw 0vw 1vw 0vw;
  box-sizing: border-box; 
`

const BottomBox = styled.div`
width: 50vw;
display: flex;
flex-direction: row;
//align-items:flex-end;
justify-content: space-between;
padding: 0vw 2vw 1vw 2vw;
box-sizing: border-box; 
margin: 2vw auto; 
`
const SubmitBtn = styled.button`
  width: 6vw;
  height: 2.7vw;
  background-color: #0089CF;
  color: white;
  font-weight:bold;
  font-size: 0.9vw;
  border-radius: 2vw;
  border-style:none;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
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
  margin: 0vw 0vw 0.5vw 0vw;
`

const TextLabel = styled.label`
  font-size: 1vw;
  font-weight: bold;
  margin: 0.5vw 0vw 1vw 0vw;
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
padding: 2vw 2vw 0vw 2vw;
box-sizing: border-box; 
margin: 0 auto; // 자동 마진을 사용하여 좌우 중앙 정렬
`

export default App;
