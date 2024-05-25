import React from 'react'
import styled from 'styled-components'
import NavBarComponent from './components/NavBar';
//import logo from './images/logo.png';

function App() {
  return (
    <Frame>
      <NavBarComponent />
    </Frame>

  );
}


const Frame = styled.div`
  width:95vw; /* 프레임의 너비를 화면의 80%로 설정 */
  height: 50vw; 
  background-color:#F5F6FA;


`


export default App;
