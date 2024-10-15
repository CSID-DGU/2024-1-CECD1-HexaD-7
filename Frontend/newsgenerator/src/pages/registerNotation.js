import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import NavBarComponent from "../components/NavBar";
import logo from "../images/logo.png";
import { responseState, loadingState } from "../api/state.js";
import API from "../api/axios";
import { useRecoilState } from "recoil";
import spellCheckData from "../mockdata/spell_ckeck.json";

function registerNotation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [draft, setDraft] = useState("");
  const [articleType, setArticleType] = useState(""); // 추가된 상태
  const [loading, setLoading] = useRecoilState(loadingState);
  const [, setResponse] = useRecoilState(responseState);
  const [selectedButton, setSelectedButton] = useState("feedback");
  const [res, setRes] = useState(false);
  const [feedbackResponse, setFeedbackResponse] = useState("");
  const [generatedArticleResponse, setGeneratedArticleResponse] = useState("");
  const [successOneResponse, setSuccessOneResponse] = useState(false);
  const [secondLoading, setSecondLoading] = useState(false);
  const [articleId, setArticleId] = useState("");
  const [isClosed, setIsClosed] = useState(false);

  // 교정된 텍스트에서 수정된 단어를 파란색으로 표시
  const highlightText = (text, wordsToHighlight, color) => {
    let highlightedText = text;
    Object.values(wordsToHighlight).forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<b><span style="color: ${color};>$1</span></b>`
      );
    });
    return highlightedText;
  };

  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  const inputTextHighlighted = highlightText(
    spellCheckData.input_text,
    Object.keys(spellCheckData.corrected_words),
    "red"
  );

  const correctedTextHighlighted = highlightText(
    spellCheckData.corrected_text,
    Object.values(spellCheckData.corrected_words),
    "blue"
  );

  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <GuideBanner>사용자 가이드</GuideBanner>
        <TitleBox>
          <img src={logo} alt="Main Logo" style={{ width: "15%" }} />
        </TitleBox>
        <div class="grid grid-rows-[1fr-20fr-3fr]">
          <div class="text-[1vw] pl-[7vw] h-[1vw]">
            맞춤법 교정 페이지입니다.
          </div>
          <div class="flex flex-row justify-center bg-red gap-14">
            <RegisterBox>
              <div class="text-[1.1vw] font-bold pb-2">
                기사 초안 원문입니다.
              </div>
              <div
                dangerouslySetInnerHTML={createMarkup(inputTextHighlighted)}
              ></div>
            </RegisterBox>
            <RegisterBox>
              <div class="text-[1.1vw] font-bold pb-2">
                기사 초안에 대한 맞춤법 교정본 입니다.
              </div>
              <div
                dangerouslySetInnerHTML={createMarkup(correctedTextHighlighted)}
              ></div>
            </RegisterBox>
          </div>
          <div class="text-right text-[1.2vw] pr-[7vw] h-[1vw] font-bold">
            교정된 맞춤법 단어의 총 수는{" "}
            <b class="text-red-500 text-[1.3vw]">
              {Object.keys(spellCheckData.corrected_words).length}
            </b>
            개입니다.
          </div>
        </div>
      </MainBox>
    </Frame>
  );
}

const RegisterBox = styled.div`
  background-color: #ffffff;
  font-size: 1vw;
  width: 30vw;
  height: 25vw;
  border-radius: 1vw;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 2vw;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word; /* 긴 단어 다음라인으로 보내버리기 */
  word-break: break-word;
`;

const BtnBox = styled.div`
  display: grid;
  grid-template-rows: 1fr 3fr;
`;
const FeedbackBtn = styled.div`
  color: ${(props) => props.textcolor};
  font-size: 1vw;
  font-weight: bold;
  width: 2vw;
  height: 5vw;
  border-radius: 0vw 1vw 1vw 0vw;
  background-color: ${(props) => props.color};
  border: none;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  padding: 1vw;
  box-sizing: borer-box;
  &:hover {
    background-color: #0089cf;
    color: white;
  }
`;
const ResultFrame = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
`;
const WhiteBox = styled.div`
  background-color: #ffffff;
  font-size: 1.2vw;
  width: 28vw;
  height: 30vw;
  border-radius: 1vw;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 2vw;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word; /* 긴 단어 다음라인으로 보내버리기 */
  word-break: break-word;
`;

const mainBoard = styled.div`
  width: 60vw;
  height: 30vw;
  background-color: #ffffff;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 0.5vw;
  border-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3vw 0vw 0vw 1vw;
  box-sizing: border-box;
`;
const ResultArticleBox = styled.div`
  background-color: #ffffff;
  font-size: 1.2vw;
  width: 28vw;
  height: 25vw;
  border-radius: 2vw 0vw 2vw 2vw;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 2vw;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word; /* 긴 단어 다음라인으로 보내버리기 */
  word-break: break-word;
`;
const TitleInput = styled.input`
  border-radius: 1vw;
  border: none;
  background-color: #d9d9d9;
  height: 3vw;
  width: 30vw;
  box-sizing: border-box;
  padding: 0vw 2vw;
`;
const ContentInput = styled.textarea`
  box-sizing: border-box;
  padding: 2vw 2vw;
  border-radius: 1vw;
  border: none;
  background-color: #d9d9d9;
  margin: 2vw 0vw;
  width: 30vw;
  height: 20vw;
`;
const Frame = styled.div`
  width: 95vw;
  height: 50vw;
  background-color: #f5f6fa;
  display: flex;
  flex-directon: column;
  align-items: stretch;
`;
const MainBox = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: 0.5fr 1.5fr 5fr; // 4개의 행으로 구성, 각 행의 비율 조정
  align-items: stretch; // 수직 방향으로 가운데 정렬
`;
const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const GuideBanner = styled.a`
  width: 100%;
  background-color: transparent; // 배경색 변경
  align-items: right;
  padding: 20px;
  box-sizing: border-box;
  font-weight: bold;
  text-align: right;
  font-size: 1vw;
  color: #0089cf;
  cursor: pointer;
`;
const SubmitBtn = styled.button`
  width: 30vw;
  height: 4vw;
  border: none;
  border-radius: 1vw;
  font-weight: bold;
  font-size: 1.5vw;
  color: white;
  background-color: #0089cf;
  box-sizing: border-box;
  margin-top: 1vw;
  margin-bottom: 7vw;
`;
export default registerNotation;
