import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NotationBox from "../components/NotationBox";
import NavBarComponent from "../components/NavBar";
import logo from "../images/logo.png";
import BackBtn from "../components/Backbtn";
import notationList from "../mockdata/notation_list.json";
import NotationDetailBox from "../components/NotationDetailBox";
function RegisterNotation() {
  const [isClickedDetail, setIsClickedDetail] = useState(false);
  const [detailNotation, setDetailNotation] = useState({});
  // 상태 변경 로그
  useEffect(() => {
    console.log("isClickedDetail:", isClickedDetail);
    console.log("detailNotation:", detailNotation);
  }, [isClickedDetail, detailNotation]);

  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <div class="flex justify-between">
          <BackBtn prevPath="/feedback" />
          <GuideBanner>사용자 가이드</GuideBanner>
        </div>
        <TitleBox>
          <img src={logo} alt="Main Logo" style={{ width: "15%" }} />
        </TitleBox>
        <div class="grid grid-rows-[1fr-20fr-3fr]">
          <div class="pl-[7vw] h-[3vw]">
            <div class="text-[1vw]">
              <b>어휘 표기 규칙 등록 리스트 조회</b>
              <br />
              <p>현재 x개의 리스트가 등록되어있습니다.</p>
            </div>
          </div>
          <div class="flex flex-row justify-center gap-16 text-[1vw] h-[32vw]">
            <div class="flex flex-col justify-center">
              <div class="h-[30vw] overflow-y-auto">
                {notationList.map((item, index) => (
                  <NotationBox
                    Notation={item}
                    key={index}
                    onClick={() => {
                      setIsClickedDetail(true);
                      setDetailNotation(item);
                      console.log("isClickedDetail:", isClickedDetail);
                      console.log("detailNotation: ", detailNotation);
                    }}
                  />
                ))}
              </div>
              <div class="h-[3vw]"></div>
            </div>
            <RegisterBox>
              <form class="flex flex-col px-[2vw]">
                <div class="mb-[0.2vw]">어휘표기규칙을 등록하세요. </div>
                <b>어휘 등록</b>
                <input class="bg-gray-200 rounded h-[3vw] px-[1vw]" />
                <div class="flex justify-center">▼</div>
                <b>품사 등록</b>
                <input class="bg-gray-200 rounded h-[3vw] mb-[1vw] px-[1vw]" />
                <b>설명 등록</b>
                <textarea class="bg-gray-200 rounded h-[7vw] p-[1vw]" />
              </form>
              <div class="mt-[3vw] flex flex-row text-[1.2vw] textd-center">
                <button class="w-[100%] h-[3.3vw] p-[0.8vw] bg-[#0089CF] text-white font-bold">
                  등록하기
                </button>
                <button class="w-[100%] h-[3.3vw] p-[0.8vw] bg-[#D9D9D9] text-white font-bold">
                  취소하기
                </button>
              </div>
            </RegisterBox>
          </div>
        </div>
      </MainBox>
      {isClickedDetail && <NotationDetailBox Notation={detailNotation} />}
    </Frame>
  );
}

const RegisterBox = styled.div`
  background-color: #ffffff;
  font-size: 1vw;
  width: 30vw;
  height: 30vw;
  border-radius: 1vw;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  border: none;
  padding-top: 2vw;
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
  padding-top: 10px;
  padding-right: 20px;
  box-sizing: border-box;
  font-weight: bold;
  text-align: right;
  font-size: 1vw;
  color: #0089cf;
  cursor: pointer;
`;

export default RegisterNotation;
