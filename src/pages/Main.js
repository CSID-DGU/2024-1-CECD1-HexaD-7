import React from 'react'
import styled from 'styled-components'

const Main = () =>{
    return (
        <Frame>
            안녕하세요
        </Frame>
    )
}



const Frame = styled.div`
height: 100vh;
weight: 100vw;
background-color: #F5F6FA;
padding: 20px; // 패딩 추가
`;

export default Main;