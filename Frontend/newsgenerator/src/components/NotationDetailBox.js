import React from "react";
import styled from "styled-components";

const NotationDetailBox = ({ Notation }) => {
  return (
    <SubmitForm class="border-[0.1vw] border-gray-300 px-1 pr-2 bg-white">
      <b class="text-right cursor-pointer w-[100%] text-right">x</b>
      <div class="font-bold">수정 전 표기</div>
      <div class="w-[100%] flex justify-between p-1  h-auto bg-gray-100 rounded mb-[1.5vw]">
        <b>
          {Notation.input_text.map((item, index) =>
            index === Notation.input_text.length - 1 ? item : item + " / "
          )}
        </b>
      </div>
      <div class="font-bold">수정 후 표기</div>
      <div class="w-[100%] flex justify-between p-1  h-auto bg-gray-100 rounded mb-[1.5vw]">
        <b>{Notation.output_text}</b>
      </div>
      <div class="flex flex-row mb-[1.5vw]">
        <b>품사</b>
        <div class="ml-[1svw] text-blue-500 bg-blue-100 px-2 rounded font-bold">
          {Notation.pos}
        </div>
      </div>

      <div class="flex items-center justify-between p-1"></div>
      <div class="font-bold">설명</div>
      <div class="w-[100%] flex justify-between p-1  h-auto bg-gray-100 rounded">
        <b>{Notation.description}</b>
      </div>
    </SubmitForm>
  );
};

const SubmitForm = styled.form`
  border-radius: 1vw;
  border-color: gray;
  border-weight: 0.2vw;
  font-size: 1vw;
  position: fixed;
  top: 19vw;
  left: 25vw;
  width: 23vw;
  height: 27vw;
  background-color: #ffffff;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  padding: 1vw;
  box-sizing: border-box;
`;
export default NotationDetailBox;
