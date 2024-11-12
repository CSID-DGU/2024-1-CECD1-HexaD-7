import React from "react";
import { useNavigate } from "react-router-dom";
import backarrow from "../images/backarrow.png";
const BackBtn = ({ prevPath }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(prevPath)} class="pl-[2vw] text-[2vw]">
      <img src={backarrow} class="w-[1.5vw]" />
    </button>
  );
};
export default BackBtn;
