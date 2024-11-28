import React, { useState } from "react";
import styled from "styled-components";

function FormatTable() {
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
    <Table>
      <thead>
        <tr>
          <TableHeader>대분류</TableHeader>
          <TableHeader>소분류</TableHeader>
          <TableHeader>선택</TableHeader>
        </tr>
      </thead>
      <tbody>
        {/* 문체 */}
        <TableRow>
          <TableData rowSpan="2">문체</TableData>
          <TableData>딱딱한 문체의 기사</TableData>
          <TableData>
            <Checkbox
              type="checkbox"
              onChange={() => handleCheckboxChange("딱딱한 문체의 기사")}
              checked={selectedItems.includes("딱딱한 문체의 기사")}
            />
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>부드러운 문체의 기사</TableData>
          <TableData>
            <Checkbox
              type="checkbox"
              onChange={() => handleCheckboxChange("부드러운 문체의 기사")}
              checked={selectedItems.includes("부드러운 문체의 기사")}
            />
          </TableData>
        </TableRow>

        {/* 구성 */}
        <TableRow>
          <TableData rowSpan="4">구성</TableData>
          <TableData>역피라미드형 구성</TableData>
          <TableData>
            <Checkbox
              type="checkbox"
              onChange={() => handleCheckboxChange("역피라미드형 구성")}
              checked={selectedItems.includes("역피라미드형 구성")}
            />
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>피라미드형 구성</TableData>
          <TableData>
            <Checkbox
              type="checkbox"
              onChange={() => handleCheckboxChange("피라미드형 구성")}
              checked={selectedItems.includes("피라미드형 구성")}
            />
          </TableData>
        </TableRow>
        <TableRow>
          <TableData>다이아몬드형 구성</TableData>
          <TableData>
            <Checkbox
              type="checkbox"
              onChange={() => handleCheckboxChange("다이아몬드형 구성")}
              checked={selectedItems.includes("다이아몬드형 구성")}
            />
          </TableData>
        </TableRow>
        <TableRow>
          <TableData> 혼합형 구성 </TableData>
          <TableData>
            <Checkbox
              type="checkbox"
              onChange={() => handleCheckboxChange("혼합형 구성")}
              checked={selectedItems.includes("혼합형 구성")}
            />
          </TableData>
        </TableRow>

        {/* 스타일 */}
        <TableRow>
          <TableData rowSpan="3">스타일</TableData>
          <TableData> 서술형 </TableData>
          <TableData>
            <Checkbox
              type="checkbox"
              onChange={() => handleCheckboxChange("서술형")}
              checked={selectedItems.includes("서술형")}
            />
          </TableData>
        </TableRow>
        <TableRow>
          <TableData> Q&A형 </TableData>
          <TableData>
            <Checkbox
              type="checkbox"
              onChange={() => handleCheckboxChange("Q&A형")}
              checked={selectedItems.includes("Q&A형")}
            />
          </TableData>
        </TableRow>
        <TableRow>
          <TableData> 핵심 포인트형 </TableData>
          <TableData>
            <Checkbox
              type="checkbox"
              onChange={() => handleCheckboxChange("핵심 포인트형")}
              checked={selectedItems.includes("핵심 포인트형")}
            />
          </TableData>
        </TableRow>
      </tbody>
    </Table>
  );
}

const Table = styled.table`
  border-collapse: collapse;
  min-width: 26vw; /* 기존 값보다 증가 */
  min-height: 27vw; /* 기존 값보다 증가 */
  overflow-y: auto;
  display: block;
  font-size: 1.1vw; /* 크기에 비례해 증가 */
`;

// 테이블 열
const TableData = styled.td`
  border: 1px solid black;
  padding: 6px; /* 크기에 비례해 증가 */
  height: 2vw; /* 기존 값보다 증가 */
`;

// 테이블 행
const TableRow = styled.tr`
  border: 1px solid black;
`;

// 테이블 열(타이틀-제목)
const TableHeader = styled.th`
  border: 1px solid black;
  padding: 10px; /* 크기에 비례해 증가 */
`;

// 체크박스 크기 조정
const Checkbox = styled.input`
  transform: scale(1.4); /* 비율에 맞춰 키움 */
`;

export default FormatTable;
