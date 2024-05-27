import React from 'react'
import styled from 'styled-components'

const FormOpBtn = () => {
    return (
        <BtnComponent>
          <OptionBtn>스트레이트 기사</OptionBtn>
          <OptionBtn>보도 기사</OptionBtn>
          <OptionBtn>기획 기사</OptionBtn>
        </BtnComponent>
    )
}

const BtnComponent = styled.div`
    display:grid;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-radius: 10px;
    border-width:1px;
    border-style: solid;
    border-color: #0089CF;
    width: 30vw;
    height: 2.5vw;
    display:flex;
    background-color: #EBEDFA;
`
const OptionBtn = styled.button`
width: 100%;
border-radius: 10px;
border-style: none;
border-color: transparent;
background-color:transparent;
color: black;
font-size: 1vw;
font-weight: bold;
&:hover{
  background-color:#0089CF;
  color: white;
}
`
export default FormOpBtn;