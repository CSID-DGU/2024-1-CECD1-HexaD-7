import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavBarComponent from "../components/NavBar";
import logo from "../images/logo.png";
import check from "../images/check.png";
import nocheck from "../images/nocheck.png";
import CategoryTable from "../components/ContentCategoryTable.js";
import FormatTable from "../components/FormatTable.js";
import API from "../api/axios";
import { useRecoilState } from "recoil";
import { responseState, loadingState } from "../api/state.js";

function Main() {
  const navigate = useNavigate();
  const [imagePath, setImagePath] = useState(nocheck);
  const textInputRef = useRef(null);
  const factCheckRef = useRef(null);
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useRecoilState(loadingState);
  const [, setResponse] = useRecoilState(responseState);
  const [title, setTitle] = useState("");

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1)); // 최소값 1로 제한
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 2)); // 최대값 2로 제한
  };

  const handleCheckboxChange = (event) => {
    setImagePath(event.target.checked ? check : nocheck);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    navigate("/mainloading");

    try {
      const response = await API.post(
        "http://127.0.0.1:8000/textprocessor/generate/step1/",
        {
          title: title,
          source_data: textInputRef.current.value,
          content_category: "Health",
          fact_check_highlight: factCheckRef.current.checked,
          format_category: {
            literary: "Informative",
            structure: "Standard",
            style: "Formal",
          },
        }
      );

      const articleId = response.data.article_id;
      setResponse({ status: response.data.status, article_id: articleId });
      navigate("/mainoutput");
      console.log("Server response: ", response.data);
    } catch (error) {
      console.log("Error sending data to the server: ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="flex flex-col gap-2 w-[25vw] h-[30vw]">
          <p className="text-[1vw]">
            <b>내용 카테고리 택1</b>
          </p>
          <CategoryTable />
        </div>
      );
    } else if (step === 2) {
      return (
        <div className="flex flex-col gap-2 w-[25vw] h-[30vw]">
          <p className="text-[1vw]">
            <b>형식 카테고리 택1</b>
          </p>
          <FormatTable />
        </div>
      );
    } else return null;
  };

  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <GuideBanner>사용자 가이드</GuideBanner>
        <TitleBox>
          <img src={logo} alt="Main Logo" style={{ width: "15%" }} />
        </TitleBox>
        <div className="flex flex-row gap-6 justify-center">
          <SubmitForm onSubmit={handleSubmit}>
            <div className="flex flex-col w-[100%] justify-center align-top">
              <TextBox>
                <TextLabel>제목</TextLabel>
                <TitleForm
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextLabel>보도자료</TextLabel>
                <TextForm ref={textInputRef} id="coverage info" required />
              </TextBox>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextLabel htmlFor="factcheck">
                  팩트체크 하이라이팅 여부
                </TextLabel>
                <input
                  ref={factCheckRef}
                  type="checkbox"
                  id="factcheck"
                  name="factcheck"
                  style={{ display: "none" }}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="factcheck">
                  <img
                    src={imagePath}
                    alt="Checkbox Image"
                    style={{ width: "2vw", margin: "0vw 1vw" }}
                  />
                </label>
              </div>
              <SubmitBtn type="submit">기사 생성</SubmitBtn>
            </div>
          </SubmitForm>
          <SubmitForm>
            <BottomBox>
              <div class="flex flex-col">
                {renderStepContent()}
                <div class="flex flex-row space-evenly justify-center gap-6 mt-[1vw] w-[100%]">
                  {
                    <StepButton
                      onClick={(e) => {
                        e.preventDefault();
                        handlePrev();
                      }}
                    >
                      Prev
                    </StepButton>
                  }
                  {
                    <StepButton
                      onClick={(e) => {
                        e.preventDefault();
                        handleNext();
                      }}
                    >
                      Next
                    </StepButton>
                  }
                </div>
              </div>
            </BottomBox>
          </SubmitForm>
        </div>
      </MainBox>
    </Frame>
  );
}

const StepButton = styled.button`
  width: 8vw;
  height: 2.5vw;
  background-color: #f5f6fa;
  color: #0089cf;
  font-weight: bold;
  font-size: 1vw;
  border: 1px solid #0089cf;
  border-radius: 2vw;
  cursor: pointer;
  &:hover {
    background-color: #0089cf;
    color: white;
  }
`;
const Filename = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: #f5f6fa;
  border-style: solid;
  border-color: #d9d9d9;
  border-width: 0.5px;
  font-size: 1vw;
  border-radius: 0.5vw;
  padding: 0.2vw 3vw;
  margin: 0vw 0vw 1vw 0vw;
  box-sizing: border-box;
`;
const BottomBox = styled.div`
  width: 50vw;
  display: flex;
  flex-direction: col;
  justify-content: space-between;
  padding: 0vw 2vw 1vw 2vw;
  box-sizing: border-box;
  margin: 2vw auto;
`;
const SubmitBtn = styled.button`
  width: 6vw;
  height: 2.7vw;
  background-color: #0089cf;
  color: white;
  font-weight: bold;
  font-size: 0.9vw;
  border-radius: 2vw;
  border-style: none;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
`;
const SubmitForm = styled.form`
  width: 30vw;
  height: 35vw;
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
  margin-bottom: 3vw;
  padding-bottom: 2vw;
`;

const TextLabel = styled.label`
  font-size: 1vw;
  font-weight: bold;
  margin: 0.5vw 0vw 1vw 0vw;
  selfalign: left;
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
  grid-template-rows: 0.5fr 1.5fr 5fr;
  align-items: stretch;
`;
const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 45vw;
  height: 100%;
`;
const TitleForm = styled.input`
  width: 27vw;
  height: 3vw;
  padding: 1vw;
  margin-bottom: 1vw;
  border-radius: 10px;
  border-style: none;
  background-color: #f5f6fa;
  box-sizing: border-box;
`;
const TextForm = styled.textarea`
  margin-bottom: 2vw;
  width: 27vw;
  height: 15vw;
  padding: 1vw;
  border-radius: 10px;
  border-style: none;
  background-color: #f5f6fa;
  box-sizing: border-box;
`;
const GuideBanner = styled.a`
  width: 100%;
  background-color: transparent;
  align-items: right;
  padding: 20px;
  box-sizing: border-box;
  font-weight: bold;
  text-align: right;
  font-size: 1vw;
  color: #0089cf;
  cursor: pointer;
`;

export default Main;
