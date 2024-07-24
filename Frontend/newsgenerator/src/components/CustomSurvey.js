import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Scorebar from "./Scorebar";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  surveyState,
  isSurveyCompleteState,
  surveyCntState,
} from "../status/atom.js";
import API from "../api/axios.js";
import { setSelectionRange } from "@testing-library/user-event/dist/utils/index.js";
const CustomSurvey = () => {
  const [scores, setScores] = useRecoilState(surveyState);
  const isSurveyComplete = useRecoilValue(isSurveyCompleteState);
  const [selectedScore, setSelectedScore] = useState(null);
  const [surveyCnt, setSurveyCnt] = useRecoilState(surveyCntState);

  //클릭시 숫자 저장하는 배열
  const handleScoreSelect = (score) => {
    setSelectedScore(score);
  };
  useEffect(() => {
    console.log(surveyCnt, "번째 점수 저장 성공!");
  }, [surveyCnt]); // surveyCnt 변화시 로그 출력

  //버튼 클릭시 recoil 변수에 값 할당하는 함수
  const handleButtonClick = () => {
    if (selectedScore !== null) {
      setSurveyCnt((prevCnt) => prevCnt + 1);
      setScores((prevScores) => [...prevScores, selectedScore]);
      setSelectedScore(null);
    }
  };

  useEffect(() => {
    if (isSurveyComplete) {
      sendSurveyData(scores);
    }
  }, [isSurveyComplete, scores]);

  const sendSurveyData = async (scores) => {
    try {
      const response = await API.post("api/endpoint/", { scores });
      console.log("Survey data 전송 완료!", response.data);
    } catch (e) {
      console.log("survey data 전송 실패: ", e);
    }
  };

  return (
    <>
      <Frame>
        <p style={{ fontWeight: "bold", fontSize: "1.2vw" }}>
          서비스 만족도 조사
        </p>
        <br />더 나은 서비스 품질 개선을 위한 사용자 만족도 조사입니다.
        <p style={{ maxHeight: "0px" }}>
          ⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻
        </p>
        <p>
          {surveyCnt == 0
            ? "헬스경향 어휘 표기의 정확성에 대한 피드백이 적절히 이루어졌다고 생각하시나요?"
            : surveyCnt == 1
            ? "문법준수의 정확성에 대한 피드백이 적절히 이루어졌다고 생각하시나요?"
            : "기사 형식별 분류에 대한 구성 형식 관련 보완사항에 대한 피드백이 적절히 이루어졌다고 생각하시나요?"}
        </p>
        <Scorebar onScoreSelect={handleScoreSelect} />
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "flex-end",
          }}
        >
          <div>
            <SubmitButton onClick={handleButtonClick}>이동하기 👉</SubmitButton>
            <span
              style={{
                margin: "0 0 0 1vw",
                color: "grey",
                fontSize: "0.8vw",
              }}
            >
              만족도 조사 진행도 {surveyCnt + 1}/3
            </span>
          </div>
        </div>
      </Frame>
    </>
  );
};

const SubmitButton = styled.button`
  width: 10vw;
  height: 2.5vw;
  border-radius: 0.7vw;
  margin: 2vw 0 0 1vw;
  border-style: none;
  box-sizing: border-box;
  text-align: center;
  font-size: 1vw;
  font-weight: bold;
  color: white;
  background: linear-gradient(to right, #0018ec 0%, #4f9ef8 46%, #0018ec 100%);
  //background-color: #0018ec;
`;

const Frame = styled.div`
  position: fixed;
  top: 20vw;
  left: 40vw;
  width: 33vw;
  height: 22vw;
  background-color: white;
  border-radius: 10px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  padding: 0.8vw 1.5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  font-size: 1vw;
  & p:first-of-type {
    height: 0vw;
  }
`;

export default CustomSurvey;
