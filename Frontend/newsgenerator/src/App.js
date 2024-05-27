import React from 'react'
import styled from 'styled-components'
import NavBarComponent from './components/NavBar';
import logo from './images/logo.png';
//import logo from './images/logo.png';

function App() {
  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
      <TitleBox src={logo}/>
      <TextBox>
        안녕
      </TextBox>
      </MainBox>
    </Frame>

  );
}


const Frame = styled.div`
  width:95vw;
  height: 50vw; 
  background-color:#F5F6FA;
  display: flex;
`

const MainBox = styled.div`
width: 100%;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
`

const TitleBox = styled.img`
  width: 20%;
  margin: 5%;
  
`

const TextBox = styled.textarea`
display:flex;
flex-direction: column;
border-radius: 10px;
border-style: none;
box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);
width: 45vw;
height: 25vw;
padding: 2vw;
box-sizing: border-box; 
`




export default App;
