import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavBarComponent from "../components/NavBar";
import logo from "../images/logo.png";
import check from "../images/check.png";
import nocheck from "../images/nocheck.png";
import clip from "../images/clip.png";
import FormOpBtn from "../components/FormOpBtn";
import { responseState, loadingState } from "../api/state.js";
import API from "../api/axios";
import { useRecoilState } from "recoil";
import CategoryTable from "../components/ContentCategoryTable.js";
function Main() {
  const navigate = useNavigate();
  const [imagePath, setImagePath] = useState(nocheck);
  const [fileName, setFileName] = useState("파일을 선택해주세요.");
  const textInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const factCheckRef = useRef(null);

  const [loading, setLoading] = useRecoilState(loadingState);
  const [, setResponse] = useRecoilState(responseState);
  const [articleType, setArticleType] = useState("");

  const handleCheckboxChange = (event) => {
    setImagePath(event.target.checked ? check : nocheck);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("파일을 선택해주세요.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("research_info", textInputRef.current.value);
    if (fileInputRef.current.files[0]) {
      formData.append("file", fileInputRef.current.files[0]);
    }
    formData.append("article_type", "스트레이트기사");
    formData.append("fact_check_highlight", factCheckRef.current.checked);
    setLoading(true);
    navigate("/mainloading");

    try {
      const response = await API.post(
        "/textprocessor/generate-article",
        formData
      );
      setResponse(response.data.content);
      navigate("/mainoutput");
      console.log("Server response: ", response.data.content);
    } catch (error) {
      console.log("Error sending data to the server: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <GuideBanner>사용자 가이드</GuideBanner>
        <TitleBox>
          <img src={logo} alt="Main Logo" style={{ width: "15%" }} />
        </TitleBox>
        <div class="flex flex-row gap-6 justify-center">
          <SubmitForm
            onOptionClick={setArticleType}
            onSubmit={handleSubmit}
            enctype="multipart/form-data"
          >
            <div class="flex flex-col w-[100%] justify-center align-top">
              <TextBox>
                <TextLabel htmlFor="coverage info">
                  기사 작성에 필요한 제목과 보도자료를 입력하세요.
                </TextLabel>
                <TitleForm class="h-[2vw]" />
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
            </div>
          </SubmitForm>
          <SubmitForm>
            <BottomBox>
              <CategoryTable />
              <SubmitBtn type="submit">기사 생성</SubmitBtn>
            </BottomBox>
          </SubmitForm>
        </div>
      </MainBox>
      {/* <CategoryTable /> */}
    </Frame>
  );
}

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
  flex-direction: row;
  //align-items:flex-end;
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
  grid-template-rows: 0.5fr 1.5fr 5fr; // 4개의 행으로 구성, 각 행의 비율 조정
  align-items: stretch; // 수직 방향으로 가운데 정렬
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
  width: 27vw;
  height: 23vw;
  padding: 1vw;
  border-radius: 10px;
  border-style: none;
  background-color: #f5f6fa;
  box-sizing: border-box;
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

export default Main;
