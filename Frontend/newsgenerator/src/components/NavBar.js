import React, { useState } from 'react';
import styled from 'styled-components';
import pencil from '../images/pencil.png';
import document from '../images/document.png';
import corpus from '../images/corpus.png';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';

const NavBarComponent = () => {
  const [activeBtn, setActiveBtn] = useState('');
  const navigate = useNavigate();

  const handleNavigate = (path, btnKey) => {
    setActiveBtn(btnKey);
    navigate(path);
  }

  return (
    <NavBar>
      <LogoImg src={logo} />
      <div style={{textAlign: 'left', width: '100%'}}>
        <p style={{fontSize: '1vw'}}>Menu</p>
      </div>
      <BtnComponent>
        <NavBarBtn 
          text="기사 생성" 
          icon={pencil} 
          isActive={activeBtn === 'generatearticle'}
          onClick={() => handleNavigate('/main', 'generatearticle')}
        />
        <NavBarBtn 
          text="기사작성 피드백" 
          icon={document} 
          isActive={activeBtn === 'feedback'}
          onClick={() => handleNavigate('/feedback', 'feedback')}
        />
        <NavBarBtn 
          text="주제 제안 기능" 
          icon={corpus} 
          isActive={activeBtn === 'topicgenerator'}
          onClick={() => handleNavigate('/topicgenerator1', 'topicgenerator')}
        />
      </BtnComponent>
    </NavBar>
  );
}


const NavBarBtn = ({ text, icon, onClick, isActive }) => {
  return (
    <NavBarBtnStyle onClick={onClick} isActive={isActive}>
      {icon && <img src={icon} alt={text} style={{ marginRight: '10px', width: '18%' }} />}
      {text}
    </NavBarBtnStyle>
  );
}

const NavBarBtnStyle = styled.button`
  margin: 1vw 0vw;
  color: ${props => props.isActive ? 'white' : 'black'};
  background-color: ${props => props.isActive ? '#0089CF' : '#FFFFFF'};
  text-align: left;
  font-weight: bold;
  font-size: 1vw;
  display: flex;
  align-items: center;
  width: 15vw;
  height: 2.3vw;
  padding: 1.7vw;
  border-radius: 0.5vw;
  border-style: none;
  &:hover {
    background-color: #0089CF;
    color: white;
  }
    &:click {
    background-color: #0089CF;
    color: white;
  }
`;

const BtnComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LogoImg = styled.img`
  margin: 20px;
  width: 70%;
`;

const NavBar = styled.div`
  padding: 10px 30px;
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  width: 18vw;
  height: 60vw;
  box-sizing: border-box;
`;


export default NavBarComponent;