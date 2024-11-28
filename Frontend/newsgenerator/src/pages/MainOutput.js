import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavBarComponent from "../components/NavBar";
import logo from "../images/logo.png";
import API from "../api/axios";
import LoadingComponent from "../images/LoadingComponent.gif";
import { useRecoilValue } from "recoil";
import { responseState } from "../api/state";
function MainOutput() {
  const response = useRecoilValue(responseState);
  const [seconds, setSeconds] = useState(0);
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    if (seconds >= 3) {
      setShowLinks(true); // Display links after 3 seconds
    } else {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [seconds]);

  const articleLinks = [
    {
      id: 1,
      url: "https://www.k-health.com/news/articleView.html?idxno=61975",
      title: "다가온 ‘코로나19-독감’ 동시 유행…현명한 대처법은?",
    },
    {
      id: 2,
      url: "https://example.com/article2",
      title: "백일해, 전년 동기간 대비 105배↑…설상가상 독감 유행도 지속",
    },
    {
      id: 3,
      url: "https://example.com/article3",
      title: "설상가상 독감까지…아이들은 구토·설사증상도 보여",
    },
    {
      id: 4,
      url: "https://example.com/article4",
      title: "다음주부턴 청소년도 2가백신 접종…고위험군은 접종 적극 권고",
    },
    {
      id: 5,
      url: "https://example.com/article5",
      title: "건강한 사람 안 맞아도 된다? ‘독감 예방접종’의 오해와 진실",
    },
  ];
  const hardcodedText = `
  제목: "독감 유행 시즌, 예방 접종과 생활 습관 개선으로 건강 지키기"
  
  독감 유행 시즌이 시작되면서 독감 예방에 대한 관심이 높아지고 있다. 특히 올해는 감염병 확산 가능성이 높아져,
  전문가들은 독감 예방 접종과 함께 생활 속 예방 습관을 지키는 것이 필수적이라고 강조한다. 독감은 발열, 근육통, 
  기침 등으로 시작되어 빠르게 퍼질 수 있으며, 면역력이 약한 어린이와 노년층에게는 폐렴과 같은 합병증을 유발할 수 
  있어 각별한 주의가 필요하다.

  보건당국은 매년 가을에 실시되는 독감 예방 접종이 독감으로부터 몸을 보호하는 가장 효과적인 방법이라고 권장한다.
  예방 접종을 통해 체내 면역 반응을 강화하면 감염 시에도 증상이 가볍게 지나갈 가능성이 높아진다. 또한, 독감 바이러스는 
  공기 중으로 쉽게 전염되기 때문에 사람 많은 장소를 피하거나 외출 시 마스크를 착용하는 것이 중요하다. 외출 후에는 손을 
  깨끗이 씻는 것이 기본적인 예방 수칙이다.
`;
  // JSON 데이터에서 불필요한 기호를 제거하고 알맹이만 추출
  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <GuideBanner>사용자 가이드</GuideBanner>
        <TitleBox>
          <img src={logo} alt="Main Logo" style={{ width: "15%" }} />
        </TitleBox>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SubmitForm>
            <SimilarityBox>
              <div>
                품질 검증을 위해
                <br /> 유사도가 높은 상위 k개의 기사를 제공합니다.
              </div>
              {showLinks ? (
                <LinksContainer>
                  <LoadingText>[추천 기사 링크]</LoadingText>
                  {articleLinks.map((link) => (
                    <ArticleLink
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.title.slice(0, 20)}
                    </ArticleLink>
                  ))}
                </LinksContainer>
              ) : (
                <>
                  <div
                    style={{
                      minHeight: "20vw",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src={LoadingComponent} alt="로딩중" width="30%" />
                  </div>
                </>
              )}
            </SimilarityBox>
            <div
              style={{
                display: "grid",
                gridTemplateRows: "1fr 7fr",
                minHeight: "100%",
              }}
            >
              <TextBox>기사 생성이 완료되었습니다.</TextBox>
              {response ? (
                <LLMText>{JSON.stringify(response, null, 2)}</LLMText>
              ) : (
                <LLMText>{hardcodedText}</LLMText>
              )}
            </div>
          </SubmitForm>
        </div>
      </MainBox>
    </Frame>
  );
}

// const LLMText = styled. div`
//   box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
//     max-height: 100%;
//     background-color: #F5F6FA;
//     box-sizing: border-box;
//     padding: 1vw;
//     font-size:1.5vw;
//     margin-right: 3vw;
//     margin-bottom: 2vw;
//     border-radius: 1vw;
//     overflow: scroll;

// `
const LLMText = styled.div`
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  max-height: 100%;
  max-height: 20vw; /* Set the fixed height */
  background-color: #f5f6fa;
  box-sizing: border-box;
  padding: 1vw;
  font-size: 1.5vw;
  margin-right: 3vw;
  margin-bottom: 2vw;
  border-radius: 1vw;
  overflow: auto; /* Allow the content to be scrollable */
  white-space: pre-wrap; /* Ensure text wraps properly */
`;
const SimilarityBox = styled.div`
  font-size: 1.2vw;
  font-weight: bold;
  margin-bottom: 1vw;
  min-height: 100%;
  box-sizing: border-box;
  margin-right: 2vw;
`;

const TextBox = styled.div`
  font-size: 1.2vw;
  font-weight: bold;
  margin-bottom: 1vw;

  box-sizing: border-box;
  margin-left: 1vw;
  margin-right: 1vw;
`;

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SubmitForm = styled.form`
  width: 60vw;
  height: 30vw;
  background-color: #ffffff;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 0.5vw;
  border-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
  padding: 3vw 0vw 0vw 1vw;
  box-sizing: border-box;
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

const LoadingText = styled.div`
  font-size: 1.4vw;
  font-weight: bold;
  margin-bottom: 1vw;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ArticleLink = styled.a`
  border-radius: 1vw;
  background-color: beige;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  width: 27vw;
  height: 2vw;
  text-align: center;
  font-size: 1.2vw;
  color: #0089cf;
  margin: 0.5vw 0;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default MainOutput;
