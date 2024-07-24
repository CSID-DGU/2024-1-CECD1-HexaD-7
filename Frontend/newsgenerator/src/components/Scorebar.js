import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Scorebar = ({ onScoreSelect }) => {
  const [selectedScore, setSelectedScore] = useState(null);

  const handleScoreClick = (score) => {
    setSelectedScore(score);
    onScoreSelect(score);
    console.log("score:", score);
  };

  return (
    <>
      <div>
        <ButtonBox>
          {[1, 2, 3, 4, 5].map((score) => (
            <SelectBox
              key={score}
              onClick={() => handleScoreClick(score)}
              isSelected={selectedScore === score}
            >
              {score}
            </SelectBox>
          ))}
        </ButtonBox>
      </div>
      <TextBox>
        <p style={{ color: "#FB0000" }}>매우불만족</p>
        <p>불만족</p>
        <p style={{ padding: "0 0 0 0.6vw" }}>보통</p>
        <p style={{ padding: "0 0vw 0 1.3vw" }}>만족</p>
        <p style={{ color: "#1044FA" }}>매우만족</p>
      </TextBox>
    </>
  );
};

const ButtonBox = styled.div`
  width: 26vw;
  height: 2.3vw;
  display: flex;
  padding: 0.2vw 0vw;
  margin: 0vw 1.5vw;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 0.7vw;
  box-sizing: border-box;
`;

const TextBox = styled.div`
  width: 26vw;
  height: 0vw;
  margin: 0vw 1.2vw;
  display: flex;
  padding: 0vw 1vw;
  justify-content: space-between;
  box-sizing: border-box;
`;

const SelectBox = styled.span`
  cursor: mouse;
  border-radius: 2vw;
  width: 100%;
  height: 80%;
  background-color: #ffffff;
  font-weight: bold;
  display: flex;
  justify-content: center;
  color: black;
  margin: 0.2vw 0.5vw;
  box-sizing: border-box;

  &:hover,
  &:focus {
    background-color: #3347e6;
    color: white;
  }
  &: active {
    background-color: #3347e6;
    color: white;
  }
`;

export default Scorebar;
