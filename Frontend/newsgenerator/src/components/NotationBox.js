import React from "react";

const NotationBox = ({ Notation, onClick }) => {
  return (
    <div
      onClick={onClick}
      class="rounded cursor-pointer w-[26vw] h-[7vw] border-[0.1vw] border-gray-300 px-1 pr-2 bg-white my-2"
    >
      <div class="w-[100%] flex justify-between p-1  h-[2vw]">
        <b>{Notation.output_text}</b>
        <b class="text-right">x</b>
      </div>
      <div class="pl-1">
        <p>
          {Notation.description.length > 20
            ? Notation.description.slice(0, 20) + "..."
            : Notation.description}
        </p>
        <hr class="mt-2 mb-[0.1vw]" />
        <div class="flex items-center justify-between p-1">
          <div class="text-blue-500 bg-blue-100 px-2 rounded font-bold">
            {Notation.pos}
          </div>
          <p>수정하기</p>
        </div>
      </div>
    </div>
  );
};
export default NotationBox;
