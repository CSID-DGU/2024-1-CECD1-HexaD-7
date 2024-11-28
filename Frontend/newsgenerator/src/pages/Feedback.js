import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import NavBarComponent from "../components/NavBar";
import logo from "../images/logo.png";
import feedback from "../images/feedback.png";
import { responseState, loadingState } from "../api/state.js";
import API from "../api/axios";
import { useRecoilState } from "recoil";
import FormOpBtn from "../components/FormOpBtn";
import feedgeneration from "../images/feedgeneration.png";
import aigeneration from "../images/aigeneration.png";
import Loading2 from "../images/Loading2.gif";
import resetBtn from "../images/reset.png";
import SubmitBox from "../components/SubmitBox.js";

function Feedback() {
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

  const submitButtonClick = () => {
    setIsClosed(true);
  };

  useEffect(() => {
    if (successOneResponse) {
      const fetchFeedbackAndArticle = async () => {
        setSecondLoading(true);
        try {
          // 기사 피드백 API 호출
          const feedbackRes = await API.post(
            `/api/feedback/article-feedback/${articleId}/`
          );
          if (feedbackRes.status === 200) {
            setFeedbackResponse(feedbackRes.data.ai_feedback);
          } else {
            console.log("Feedback response: ", feedbackResponse);
          }

          // 기사 생성 API 호출
          const articleGenRes = await API.post(
            `/api/feedback/generate-article/${articleId}/`
          );
          if (articleGenRes.status === 200) {
            setGeneratedArticleResponse(articleGenRes.data.generated_article);
          } else {
            console.log(
              "Article generation response: ",
              articleGenRes.data.generated_article
            );
          }
        } catch (error) {
          console.log("Error sending data to the server: ", error);
          alert("Error sending data to the server");
        } finally {
          setSecondLoading(false);
        }
      };

      fetchFeedbackAndArticle();
    }
  }, [successOneResponse, articleId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("source_data", draft);
    formData.append("content_category", "건강정보");
    formData.append("literary", "딱딱한 문체");
    formData.append("structure", "역피라미드형");
    formData.append("style", "줄글 형식");

    setLoading(true);

    try {
      const response = await API.post(
        "/api/feedback/submit-article/",
        formData
      );
      if (response.status === 201) {
        setResponse(response.data);
        setRes(true);
        setSuccessOneResponse(true);
        setArticleId(response.data.article_id);
        alert(
          `Message: ${response.data.message}\nArticle ID: ${response.data.article_id}`
        );
      }
    } catch (error) {
      console.log("Error sending data to the server: ", error);
      alert("Error sending data to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        {isClosed ? null : <SubmitBox submitButtonClick={submitButtonClick} />}
        <div class="flex justify-between">
          <button onClick={() => setRes(false)} class="pl-[2vw] text-[2vw]">
            <img src={resetBtn} class="w-[1.5vw]" />
          </button>
          <GuideBanner>사용자 가이드</GuideBanner>
        </div>
        <TitleBox>
          <img src={logo} alt="Main Logo" style={{ width: "15%" }} />
        </TitleBox>
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
        >
          <div style={{ minWidth: "100%", minHeight: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "3vw",
                boxSizing: "border-box",
              }}
            >
              <TitleInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="기사 제목을 입력하세요"
                required
              />
              <ContentInput
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="기사 초안을 입력하세요"
                required
              />
            </div>
          </div>
          <div
            style={{
              minWidth: "100%",
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            {res ? (
              <>
                <div class="flex gap-3 mr-[9vw] mb-2">
                  <button
                    onClick={() => navigate("/spellcheck")}
                    class="w-[8vw] text-[0.9vw] border-2 bg-blue-200 p-2 hover:bg-blue-300 rounded-lg"
                  >
                    맞춤법 교정
                  </button>
                  <button
                    onClick={() => navigate("/lexicalcorrection")}
                    class="w-[8vw] text-[0.9vw] border-2 bg-blue-200 p-2 hover:bg-blue-300 rounded-lg"
                  >
                    어휘표기 교정
                  </button>
                  <button
                    onClick={() => navigate("/registernotation")}
                    class="w-[8vw] text-[0.9vw] border-2 bg-blue-200 p-2 hover:bg-blue-300 rounded-lg"
                  >
                    어휘표기 등록
                  </button>
                </div>
                <ResultFrame>
                  {selectedButton === "feedback" ? (
                    <ResultFeedbackBox>
                      <img src={feedgeneration} style={{ width: "30vw" }} />
                      <br />
                      {secondLoading ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={Loading2}
                            alt="loading"
                            style={{ width: "10vw" }}
                          />
                        </div>
                      ) : (
                        feedbackResponse
                      )}
                    </ResultFeedbackBox>
                  ) : (
                    <ResultArticleBox>
                      <img src={aigeneration} style={{ width: "26vw" }} />
                      <br />
                      {secondLoading ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={Loading2}
                            alt="loading"
                            style={{ width: "10vw" }}
                          />
                        </div>
                      ) : (
                        generatedArticleResponse
                      )}
                    </ResultArticleBox>
                  )}
                  <BtnBox>
                    <FeedbackBtn
                      color={
                        selectedButton === "feedback" ? "#0089CF" : "#F5F6FA"
                      }
                      textcolor={
                        selectedButton === "feedback" ? "white" : "black"
                      }
                      onClick={() => handleButtonClick("feedback")}
                    >
                      AI
                      <br />피<br />드<br />백<br />
                      조<br />회
                    </FeedbackBtn>
                    <FeedbackBtn
                      color={
                        selectedButton === "article" ? "#0089CF" : "#F5F6FA"
                      }
                      textcolor={
                        selectedButton === "feedback" ? "black" : "white"
                      }
                      onClick={() => handleButtonClick("article")}
                    >
                      AI
                      <br />
                      기사
                      <br />
                      생성
                      <br />
                      조회
                    </FeedbackBtn>
                  </BtnBox>
                </ResultFrame>
              </>
            ) : (
              <div>
                <img src={feedback} style={{ width: "10vw" }} />
                <SubmitBtn type="submit">기사 초안 제출하기 →</SubmitBtn>
              </div>
            )}
          </div>
        </form>
      </MainBox>
    </Frame>
  );
}

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import styled from "styled-components";
// import NavBarComponent from "../components/NavBar";
// import logo from "../images/logo.png";
// import feedback from "../images/feedback.png";
// import { responseState, loadingState } from "../api/state.js";
// import API from "../api/axios";
// import { useRecoilState } from "recoil";
// import FormOpBtn from "../components/FormOpBtn";
// import feedgeneration from "../images/feedgeneration.png";
// import aigeneration from "../images/aigeneration.png";
// import Loading2 from "../images/Loading2.gif";
// import resetBtn from "../images/reset.png";
// import SubmitBox from "../components/SubmitBox.js";
// function Feedback() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [title, setTitle] = useState("");
//   const [draft, setDraft] = useState("");
//   const [articleType, setArticleType] = useState(""); // 추가된 상태
//   const [loading, setLoading] = useRecoilState(loadingState);
//   const [response, setResponse] = useRecoilState(responseState);
//   const [selectedButton, setSelectedButton] = useState("feedback");
//   const [res, setRes] = useState(true);
//   const [feedbackResponse, setFeedbackResponse] = useState("");
//   const [generatedArticleResponse, setGeneratedArticleResponse] = useState("");
//   const [successOneResponse, setSuccessOneResponse] = useState(false);
//   const [secondLoading, setSecondLoading] = useState(false);
//   const [articleId, setArticleId] = useState("");
//   const [isClosed, setIsClosed] = useState(false);

//   const submitButtonClick = () => {
//     setIsClosed(true);
//   };
//   useEffect(() => {
//     if (successOneResponse) {
//       console.log("기사 초안 제출 완료");
//       console.log("기사 id: ", articleId);
//       const fetchFeedbackAndArticle = async () => {
//         setSecondLoading(true);
//         console.log("secondLoading을 true로 설정");
//         try {
//           const feedbackRes = await API.post(
//             `/api/feedback/article-feedback/${articleId}/`
//           );
//           setFeedbackResponse(feedbackRes.data.feedback);

//           const articleGenRes = await API.post(
//             `/api/feedback/generate-article/${articleId}/`
//           );
//           setGeneratedArticleResponse(articleGenRes.data.generated_article);
//         } catch (error) {
//           console.log("Error sending data to the server: ", error);
//           alert("Error sending data to the server");
//         } finally {
//           setSecondLoading(false);
//         }
//       };

//       fetchFeedbackAndArticle();
//     }
//   }, [successOneResponse, articleId]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("draft", draft);
//     formData.append("article_type", articleType);

//     // FormData 확인을 위한 로그 출력
//     for (let [key, value] of formData.entries()) {
//       console.log(`${key}: ${value}`);
//     }
//     console.log("formData: ", formData);

//     setLoading(true);

//     try {
//       const response = await API.post(
//         "/api/feedback/submit-article/",
//         formData
//       );
//       setResponse(response.data);
//       setRes(true);
//       console.log("Server response: ", response.data);
//       // 여기에서 API 응답을 alert 창에 표시
//       setSuccessOneResponse(true);
//       setArticleId(response.data.article_id);
//       alert(
//         `Message: ${response.data.message}\nArticle ID: ${response.data.article_id}`
//       );
//     } catch (error) {
//       console.log("Error sending data to the server: ", error);
//       alert("Error sending data to the server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleButtonClick = (buttonType) => {
//     setSelectedButton(buttonType);
//   };

//   return (
//     <Frame>
//       <NavBarComponent />
//       <MainBox>
//         {/* <CustomSurvey /> */}
//         {isClosed ? null : <SubmitBox submitButtonClick={submitButtonClick} />}
//         <div class="flex justify-between">
//           <button onClick={() => setRes(false)} class="pl-[2vw] text-[2vw]">
//             <img src={resetBtn} class="w-[1.5vw]" />
//           </button>
//           <GuideBanner>사용자 가이드</GuideBanner>
//         </div>
//         <TitleBox>
//           <img src={logo} alt="Main Logo" style={{ width: "15%" }} />
//         </TitleBox>
//         <form
//           onSubmit={handleSubmit}
//           style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
//         >
//           <div style={{ minWidth: "100%", minHeight: "100%" }}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "3vw",
//                 boxSizing: "border-box",
//               }}
//             >
//               <form onSubmit={handleSubmit}>
//                 <TitleInput
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="기사 제목을 입력하세요"
//                   required
//                 />
//                 <ContentInput
//                   value={draft}
//                   onChange={(e) => setDraft(e.target.value)}
//                   placeholder="기사 초안을 입력하세요"
//                   required
//                 />
//                 <FormOpBtn
//                   selectedOption={articleType}
//                   onOptionClick={setArticleType}
//                 />
//               </form>
//             </div>
//           </div>
//           <div
//             style={{
//               minWidth: "100%",
//               minHeight: "100%",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               boxSizing: "border-box",
//             }}
//           >
//             {res ? (
//               <>
//                 <div class="flex gap-3 mr-[9vw] mb-2">
//                   <button
//                     onClick={() => navigate("/spellcheck")}
//                     class="w-[8vw] text-[0.9vw] border-2 bg-blue-200 p-2 hover:bg-blue-300 rounded-lg"
//                   >
//                     맞춤법 교정
//                   </button>
//                   <button
//                     onClick={() => navigate("/lexicalcorrection")}
//                     class="w-[8vw] text-[0.9vw] border-2 bg-blue-200 p-2 hover:bg-blue-300 rounded-lg"
//                   >
//                     어휘표기 교정
//                   </button>
//                   <button
//                     onClick={() => navigate("/registernotation")}
//                     class="w-[8vw] text-[0.9vw] border-2 bg-blue-200 p-2 hover:bg-blue-300 rounded-lg"
//                   >
//                     어휘표기 등록
//                   </button>
//                 </div>
//                 <ResultFrame>
//                   {selectedButton === "feedback" ? (
//                     <ResultFeedbackBox>
//                       <img src={feedgeneration} style={{ width: "30vw" }} />
//                       <br />
//                       {secondLoading ? (
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <img
//                             src={Loading2}
//                             alt="loading"
//                             style={{ width: "10vw" }}
//                           />
//                         </div>
//                       ) : (
//                         feedbackResponse
//                       )}
//                     </ResultFeedbackBox>
//                   ) : (
//                     <ResultArticleBox>
//                       <img src={aigeneration} style={{ width: "26vw" }} />
//                       <br />
//                       {secondLoading ? (
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <img
//                             src={Loading2}
//                             alt="loading"
//                             style={{ width: "10vw" }}
//                           />
//                         </div>
//                       ) : (
//                         generatedArticleResponse
//                       )}
//                     </ResultArticleBox>
//                   )}
//                   {/* <ResultFeedbackBox>
//               {"response 받아올 부분"}
//             </ResultFeedbackBox> */}
//                   <BtnBox>
//                     <FeedbackBtn
//                       color={
//                         selectedButton === "feedback" ? "#0089CF" : "#F5F6FA"
//                       }
//                       textcolor={
//                         selectedButton === "feedback" ? "white" : "black"
//                       }
//                       onClick={() => handleButtonClick("feedback")}
//                     >
//                       AI
//                       <br />피<br />드<br />백<br />
//                       조<br />회
//                     </FeedbackBtn>
//                     <FeedbackBtn
//                       color={
//                         selectedButton === "article" ? "#0089CF" : "#F5F6FA"
//                       }
//                       textcolor={
//                         selectedButton === "feedback" ? "black" : "white"
//                       }
//                       onClick={() => handleButtonClick("article")}
//                     >
//                       AI
//                       <br />
//                       기사
//                       <br />
//                       생성
//                       <br />
//                       조회
//                     </FeedbackBtn>
//                   </BtnBox>
//                 </ResultFrame>
//               </>
//             ) : (
//               <div>
//                 <img src={feedback} style={{ width: "10vw" }} />
//                 <SubmitBtn type="submit">기사 초안 제출하기 →</SubmitBtn>
//               </div>
//             )}
//           </div>
//         </form>
//       </MainBox>
//     </Frame>
//   );
// }

const BtnBox = styled.div`
  display: grid;
  grid-template-rows: 1fr 3fr;
`;
const FeedbackBtn = styled.div`
  color: ${(props) => props.textcolor};
  font-size: 0.9vw;
  font-weight: bold;
  width: 3vw;
  height: 11vw;
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
  grid-template-columns: 3fr 1fr;
  margin-top: 0vw;
  max-height: 30vw;
`;
const ResultFeedbackBox = styled.div`
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
export default Feedback;
