import React, { useState } from "react";
import styled from "styled-components";
const SubmitBox = ({ submitButtonClick }) => {
  return (
    <Frame>
      <Head>
        <p style={{ padding: "0 0 0 1vw", fontWeight: "bold" }}>
          만족도 조사 제출 완료
        </p>
      </Head>
      <Text>
        만족도조사가 성공적으로 완료되었습니다. <br /> 서비스 개선을 위해
        반영하겠습니다 :)
      </Text>
      <SubmitButton onClick={submitButtonClick}>확인</SubmitButton>
    </Frame>
  );
};

const Head = styled.div`
  font-size: 1vw;
  font-weigh: bold;
  background-color: rgba(148, 182, 239, 0.2);
  position: fixed;
  top: 20vw;
  left: 44vw;
  border-radius: 10px 10px 0px 0px;
  width: 25vw;
  height: 3vw;
`;

const Frame = styled.div`
  position: fixed;
  top: 20vw;
  left: 44vw;
  width: 25vw;
  height: 17vw;
  background-color: white;
  border-radius: 10px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  padding: 0.8vw 1.5vw;
  display: flex;
  justify-content: center;
  font-size: 1vw;
`;

const Text = styled.div`
  padding: 6vw 0vw;
`;

const SubmitButton = styled.button`
  position: fixed;
  top: 30vw;
  width: 13vw;
  height: 2.5vw;
  border-radius: 0.7vw;
  margin: 2vw 0 0 1vw;
  border-style: none;
  box-sizing: border-box;
  text-align: center;
  font-size: 1vw;
  font-weight: bold;
  color: white;
  background-color: #0018ec;
`;

export default SubmitBox;
