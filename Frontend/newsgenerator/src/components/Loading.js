import React from 'react';
import styled from 'styled-components'
import LoadingComponent from '../images/LoadingComponent.gif'
export const Loading = () => {
    <Background>
        <LoadingText>LLM 출력을 불러오는 중입니다.</LoadingText>
        <LoadingText>잠시만 기다려 주세요...</LoadingText>
        <img src={LoadingComponent} alt="로딩중" width="5%" />
    </Background>
};

const Background = styled.div`
    position: absolute;
    width: 30vw;
    height: 30vw;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const LoadingText = styled.div`
    text-align: center;
`

export default Loading;
