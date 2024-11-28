import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NotationBox from "../components/NotationBox";
import NavBarComponent from "../components/NavBar";
import logo from "../images/logo.png";
import BackBtn from "../components/Backbtn";
import NotationDetailBox from "../components/NotationDetailBox";
import API from "../api/axios";
import RegisterNotationForm from "../components/UpdateRegisterForm";

function RegisterNotation() {
  const [isClickedDetail, setIsClickedDetail] = useState(false);
  const [detailNotation, setDetailNotation] = useState({});
  const [notations, setNotations] = useState([]);
  const [newNotation, setNewNotation] = useState({
    target_word: "",
    pos: "",
    replacement_word: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotation, setEditingNotation] = useState(null);

  // 상태 변경 로그
  useEffect(() => {
    console.log("isClickedDetail:", isClickedDetail);
    console.log("detailNotation:", detailNotation);
  }, [isClickedDetail, detailNotation]);

  // 어휘 규칙 데이터 불러오기 (GET)
  useEffect(() => {
    fetchNotations();
  }, []);

  const fetchNotations = async () => {
    try {
      const response = await API.get("/api/feedback/vocabulary-management/");
      setNotations(response.data);
    } catch (error) {
      console.error("Failed to fetch notations:", error);
    }
  };

  // 어휘 규칙 추가하기 (POST)
  const addNotation = async () => {
    try {
      const response = await API.post(
        "/api/feedback/vocabulary-management/",
        newNotation
      );
      alert(response.data.message);
      fetchNotations(); // 데이터 다시 불러오기
      setNewNotation({ target_word: "", pos: "", replacement_word: "" }); // 입력 필드 초기화
    } catch (error) {
      console.error("Failed to add notation:", error);
    }
  };

  // 어휘 규칙 수정하기 (PUT)
  const updateNotation = async (notation) => {
    try {
      const response = await API.put(
        `/api/feedback/vocabulary-management/`,
        notation
      );
      alert(response.data.message);
      fetchNotations(); // 업데이트 후 데이터 다시 불러오기
    } catch (error) {
      console.error("Failed to update notation:", error);
    }
  };

  // 어휘 규칙 삭제하기 (DELETE)
  const deleteNotation = async (notation) => {
    try {
      const response = await API.delete(
        `/api/feedback/vocabulary-management/`,
        {
          data: {
            target_word: notation.target_word,
            pos: notation.pos,
            replacement_word: notation.replacement_word,
          },
        }
      );
      alert(response.data.message);
      fetchNotations(); // 삭제 후 데이터 다시 불러오기
    } catch (error) {
      console.error("Failed to delete notation:", error);
    }
  };

  const handleEditClick = (notation) => {
    setIsEditing(true);
    setEditingNotation(notation);
  };

  const onUpdate = async (notation) => {
    try {
      await updateNotation(notation);
      alert("수정이 완료되었습니다.");
      setIsEditing(false);
      setEditingNotation(null);
    } catch (error) {
      console.error("Failed to update notation: ", error);
      alert("수정 중 오류가 발생하였습니다.");
    }
  };

  return (
    <Frame>
      <NavBarComponent />
      <MainBox>
        <div className="flex justify-between">
          <BackBtn prevPath="/feedback" />
          <GuideBanner>사용자 가이드</GuideBanner>
        </div>
        <TitleBox>
          <img src={logo} alt="Main Logo" style={{ width: "15%" }} />
        </TitleBox>
        <div className="grid grid-rows-[1fr-20fr-3fr]">
          <div className="pl-[7vw] h-[3vw]">
            <div className="text-[1vw]">
              <b>어휘 표기 규칙 등록 리스트 조회</b>
              <br />
              <p>현재 {notations.length}개의 리스트가 등록되어있습니다.</p>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-16 text-[1vw] h-[32vw]">
            <div className="flex flex-col justify-center">
              <div className="h-[30vw] overflow-y-auto">
                {notations.map((item, index) => (
                  <NotationBox
                    Notation={item}
                    key={index}
                    onClick={() => {
                      setIsClickedDetail(true);
                      setDetailNotation(item);
                    }}
                    onDelete={() => deleteNotation(item)} // 삭제 버튼 처리
                    onUpdate={() => handleEditClick(item)} // 수정 버튼 처리
                  />
                ))}
              </div>
              <div className="h-[3vw]"></div>
            </div>
            <RegisterBox>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addNotation();
                }}
                className="flex flex-col px-[2vw]"
              >
                <div className="mb-[0.2vw]">어휘표기규칙을 등록하세요. </div>
                <b>어휘 등록</b>
                <input
                  className="bg-gray-200 rounded h-[3vw] px-[1vw]"
                  value={newNotation.target_word}
                  onChange={(e) =>
                    setNewNotation({
                      ...newNotation,
                      target_word: e.target.value,
                    })
                  }
                  required
                />
                <div className="flex justify-center">▼</div>
                <b>품사 등록</b>
                <input
                  className="bg-gray-200 rounded h-[3vw] mb-[1vw] px-[1vw]"
                  value={newNotation.pos}
                  onChange={(e) =>
                    setNewNotation({
                      ...newNotation,
                      pos: e.target.value,
                    })
                  }
                  required
                />
                <b>대체 단어 등록</b>
                <input
                  className="bg-gray-200 rounded h-[3vw] mb-[1vw] px-[1vw]"
                  value={newNotation.replacement_word}
                  onChange={(e) =>
                    setNewNotation({
                      ...newNotation,
                      replacement_word: e.target.value,
                    })
                  }
                  required
                />
                <div class="mt-[3vw] flex flex-row text-[1.2vw] textd-center round">
                  <button class="w-[100%] h-[3.3vw] p-[0.8vw] bg-[#0089CF] text-white font-bold">
                    등록하기
                  </button>
                  <button class="w-[100%] h-[3.3vw] p-[0.8vw] bg-[#D9D9D9] text-white font-bold">
                    취소하기
                  </button>
                </div>
              </form>
            </RegisterBox>
          </div>
        </div>
      </MainBox>

      {isClickedDetail && (
        <NotationDetailBox
          Notation={detailNotation}
          onClose={() => setIsClickedDetail(false)}
        />
      )}
      {isEditing && editingNotation && (
        <RegisterNotationForm
          onUpdate={onUpdate}
          editingNotation={editingNotation}
          setEditingNotation={setEditingNotation}
          setIsEditing={setIsEditing}
        />
      )}
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
  word-wrap: break-word;
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
  grid-template-rows: 0.5fr 1.5fr 5fr;
  align-items: stretch;
`;
const TitleBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const GuideBanner = styled.a`
  width: 100%;
  background-color: transparent;
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
