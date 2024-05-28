import React from 'react';
import styled from 'styled-components';
import BigLogo from '../images/BigLogo.png'
const UserLogin =() => {
    return (
    <Frame>
        <LoginBanner>
        <img 
        style={{width: "20vw"}}
        src={BigLogo} alt = "main logo" />
        </LoginBanner>
        
    </Frame>
    )
    

}

const Frame = styled.div`
width:95vw;
height: 50vw; 
background-color:#F5F6FA;
display: flex;
flex-directon: column;
align-items: stretch;
`
const LoginBanner = styled.div`
padding: 10vw 30px;
align-items: center;
display:flex;
flex-direction: column;
background-color: #0089CF;
width: 25vw;
box-sizing: border-box; 
`
export default UserLogin;