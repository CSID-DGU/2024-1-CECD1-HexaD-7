import React from 'react'
import styled from 'styled-components'
import pencil from '../images/pencil.png'
import document from '../images/document.png'
import corpus from '../images/corpus.png'
import logo from '../images/logo.png'
const NavBarComponent = () => {
    return (
        <NavBar>
        <LogoImg src={logo} />
        <div style={{textAlign: 'left', width: '100%'}}>
        <p style={{fontSize: '1vw'}}>Menu</p>
        </div>
        <BtnComponent>
        <NavBarBtn text="기사 생성" icon={pencil}/>
        <NavBarBtn text="기사작성 피드백" icon={document}/>
        <NavBarBtn text="주제 제안 기능" icon={corpus}/>
        </BtnComponent>
      </NavBar>

    )

}
export default NavBarComponent;

const NavBarBtn = ({text, icon}) => {
    return (
      <NavBarBtnStyle>
        {icon && <img src={icon} alt={text} style={{ marginRight: '10px', width: '18%'}} />}
        {text}
      </NavBarBtnStyle>
    )
  }
  
  const BtnComponent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  `
  
  
  const LogoImg = styled.img`
    margin: 20px;
    width: 70%;
  `

  
const NavBar = styled.div`
padding: 10px 30px;
align-items: center;
display:flex;
flex-direction: column;
background-color: #FFFFFF;
width: 18vw;
height: 60vw;
box-sizing: border-box; 
grid-auto-rows: minmax(1fr, 3fr, 2fr);

`

const NavBarBtnStyle = styled.button`
margin: 1vw 0vw;
color: black;
text-align:left;
font-weight: bold;
font-size: 1vw;
display:flex;
align-items: center;
width: 15vw;
height: 2.3vw;
padding: 1.7vw;
border-radius: 0.5vw;
border-style: none;
background-color: #FFFFFF;
&:hover{
  color:white;
  background-color: #0089CF;
}

`
  