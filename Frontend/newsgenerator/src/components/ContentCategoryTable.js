import React, { useState } from "react";
import styled from "styled-components";

function CategoryTable() {
  // 선택된 항목들을 저장하는 상태
  const [selectedItems, setSelectedItems] = useState([]);

  // 항목 선택 핸들러
  const handleCheckboxChange = (category) => {
    setSelectedItems((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* 표 구성 */}
      <Table>
        <thead>
          <tr>
            <TableHeader>상위</TableHeader>
            <TableHeader>중위</TableHeader>
            <TableHeader>하위</TableHeader>
            <TableHeader>소분류</TableHeader>
            <TableHeader>선택</TableHeader>
          </tr>
        </thead>
        <tbody>
          {/* 건강 정보 */}
          <TableRow>
            <TableData rowSpan="11">건강 정보</TableData>
            <TableData rowSpan="3">건강 일반</TableData>
            <TableData>연구 결과</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("연구 결과")}
                checked={selectedItems.includes("연구 결과")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>질병 정보</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("질병 정보")}
                checked={selectedItems.includes("질병 정보")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>정보 전달</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("정보 전달")}
                checked={selectedItems.includes("정보 전달")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData rowSpan="2">먹거리 건강</TableData>
            <TableData>음식 및 식재료</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("음식 및 식재료")}
                checked={selectedItems.includes("음식 및 식재료")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>정보 전달</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("정보 전달")}
                checked={selectedItems.includes("정보 전달")}
              />
            </TableData>
          </TableRow>

          <TableRow>
            <TableData rowSpan="5">한방</TableData>
            <TableData>연구 결과</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("연구 결과")}
                checked={selectedItems.includes("연구 결과")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>질병 정보</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("질병 정보")}
                checked={selectedItems.includes("질병 정보")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>음식 및 식재료</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("음식 및 식재료")}
                checked={selectedItems.includes("음식 및 식재료")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>한의원 홍보</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("한의원 홍보")}
                checked={selectedItems.includes("한의원 홍보")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>정보 전달</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("정보 전달")}
                checked={selectedItems.includes("정보 전달")}
              />
            </TableData>
          </TableRow>

          <TableRow>
            <TableData>헬스 신간</TableData>
            <TableData>-</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("헬스 신간")}
                checked={selectedItems.includes("헬스 신간")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData rowSpan="3">뷰티</TableData>
            <TableData>성형</TableData>
            <TableData>-</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("성형")}
                checked={selectedItems.includes("헬스 신간")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>피부미용</TableData>
            <TableData>-</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("피부미용")}
                checked={selectedItems.includes("피부미용")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>화장품</TableData>
            <TableData>-</TableData>
            <TableData>-</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("화장품")}
                checked={selectedItems.includes("화장품")}
              />
            </TableData>
          </TableRow>

          {/* 뉴스 */}
          <TableRow>
            <TableData rowSpan="5">뉴스</TableData>
            <TableData rowSpan="5">정책</TableData>
            <TableData>국회의원</TableData>
            <TableData>개최</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("개최")}
                checked={selectedItems.includes("개최")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData rowSpan="4">단체 소식</TableData>
          </TableRow>
          <TableRow>
            <TableData>협력협약</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("협력협약")}
                checked={selectedItems.includes("협력협약")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>수상소식</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("수상소식")}
                checked={selectedItems.includes("수상소식")}
              />
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>홍보</TableData>
            <TableData>
              <Checkbox
                type="checkbox"
                onChange={() => handleCheckboxChange("홍보")}
                checked={selectedItems.includes("홍보")}
              />
            </TableData>
          </TableRow>
        </tbody>
      </Table>

      {/* 선택된 항목 표시 */}
      {/* <SelectedList>
        <h3>선택된 소분류</h3>
        <ul>
          {selectedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SelectedList> */}
    </div>
  );
}

// 스타일 컴포넌트 정의
const Table = styled.table`
  border-collapse: collapse;
  width: 25vw;
  max-height: 27vw;
  overflow-y: auto;
  display: block;
  font-size: 1vw;
`;

// 테이블 행
const TableRow = styled.tr`
  border: 1px solid black;
`;

// 테이블 열(타이틀-제목)
const TableHeader = styled.th`
  border: 1px solid black;
  padding: 8px;
`;

// 테이블 열
const TableData = styled.td`
  border: 1px solid black;
  padding: 4px;
  height: 1.5vw;
`;

const Checkbox = styled.input`
  transform: scale(1.2);
`;

const SelectedList = styled.div`
  width: 30%;
`;

export default CategoryTable;
