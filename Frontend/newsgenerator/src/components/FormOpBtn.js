import React from 'react';
import styled from 'styled-components';

const FormOpBtn = ({ onOptionClick, selectedOption }) => {
  const handleClick = (event, option) => {
    event.preventDefault();  
    onOptionClick(option);
  };

  return (
    <BtnComponent>
      <OptionBtn 
        onClick={(e) => handleClick(e, "스트레이트 기사")} 
        selected={selectedOption === "스트레이트 기사"}
      >
        스트레이트 기사
      </OptionBtn>
      <OptionBtn 
        onClick={(e) => handleClick(e, "보도 기사")} 
        selected={selectedOption === "보도 기사"}
      >
        보도 기사
      </OptionBtn>
      <OptionBtn 
        onClick={(e) => handleClick(e, "기획 기사")} 
        selected={selectedOption === "기획 기사"}
      >
        기획 기사
      </OptionBtn>
    </BtnComponent>
  );
};

const BtnComponent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-radius: 1vw;
  border-width: 1px;
  border-style: solid;
  border-color: #0089CF;
  width: 30vw;
  height: 2vw;
  background-color: #EBEDFA;
`;

const OptionBtn = styled.button`
  width: 100%;
  border-radius: 1vw;
  border-style: none;
  border-color: transparent;
  background-color: ${({ selected }) => (selected ? '#0089CF' : 'transparent')};
  color: ${({ selected }) => (selected ? 'white' : 'black')};
  font-size: 1vw;
  font-weight: bold;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#0078B8' : '#D1E3F4')};
  }
`;

export default FormOpBtn;
