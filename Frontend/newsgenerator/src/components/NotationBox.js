import React from "react";

const NotationBox = ({ Notation, onClick, onDelete }) => {
  return (
    <div
      onClick={onClick}
      className="rounded cursor-pointer w-[26vw] h-[7vw] border-[0.1vw] border-gray-300 px-1 pr-2 bg-white my-2"
    >
      <div className="w-[100%] flex justify-between p-1 h-[2vw]">
        <b>{Notation.replacement_word}</b>
        <b
          className="text-right cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 전파 막기
            onDelete(); // 삭제 함수 호출
          }}
        >
          x
        </b>
      </div>
      <div className="pl-1">
        <p>
          {`${Notation.target_word}를 ${Notation.replacement_word}로 교체합니다.`}
        </p>
        <hr className="mt-2 mb-[0.1vw]" />
        <div className="flex items-center justify-between p-1">
          <div className="text-blue-500 bg-blue-100 px-2 rounded font-bold">
            {Notation.pos}
          </div>
          <p> </p>
        </div>
      </div>
    </div>
  );
};

export default NotationBox;
