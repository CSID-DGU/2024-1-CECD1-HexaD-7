import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavBarComponent from "../components/NavBar";
import logo from "../images/logo.png";
import lexicalCheckData from "../mockdata/lexical_check.json";

function LexicalCorrection() {
  const navigate = useNavigate();

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
    lexicalCheckData.input_text,
    Object.keys(lexicalCheckData.corrected_words),
    "red"
  );

  const correctedTextHighlighted = highlightText(
    lexicalCheckData.corrected_text,
    Object.values(lexicalCheckData.corrected_words),
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
            헬스경향 맞춤 어휘표기규칙 교정 페이지입니다.
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
                기사 초안에 대한 어휘표기규칙 교정본 입니다.
              </div>
              <div
                dangerouslySetInnerHTML={createMarkup(correctedTextHighlighted)}
              ></div>
            </RegisterBox>
          </div>
          <div class="text-right text-[1.2vw] pr-[7vw] h-[1vw] font-bold">
            교정된 어휘표기 단어의 총 수는{" "}
            <b class="text-red-500 text-[1.3vw]">
              {Object.keys(lexicalCheckData.corrected_words).length}
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

export default LexicalCorrection;
