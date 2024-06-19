import React from 'react'
import styled from 'styled-components'

const FormOpBtn = ({ onOptionClick }) => {
    return (
        <BtnComponent>
          <OptionBtn onClick={() => onOptionClick("스트레이트 기사")}>스트레이트 기사</OptionBtn>
          <OptionBtn onClick={() => onOptionClick("보도 기사")}>보도 기사</OptionBtn>
          <OptionBtn onClick={() => onOptionClick("기획 기사")}>기획 기사</OptionBtn>
        </BtnComponent>
    )
}

const BtnComponent = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-radius: 1vw;
    border-width:1px;
    border-style: solid;
    border-color: #0089CF;
    width: 30vw;
    height: 2vw;
    background-color: #EBEDFA;
`
const OptionBtn = styled.button`
width: 100%;
border-radius: 1vw;
border-style: none;
border-color: transparent;
background-color:transparent;
color: black;
font-size: 1vw;
font-weight: bold;
&:click{
  background-color:#0089CF;
  color: white;
}
`
export default FormOpBtn;
