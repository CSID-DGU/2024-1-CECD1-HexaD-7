// import React, {useState, useEffect} from 'react';
// import {useNavigate} from 'react-router-dom';
// import styled from 'styled-components';
// import BigLogo from '../images/BigLogo.png'
// import basiccheck from '../images/basiccheck.png';
// import  API from 'api/axios';
// import axios from 'axios';

// const UserLogin =() => {

//     const [accessCode, setAccessCode] = useState('');
//     const [accessError, setAccessError] = useState('');
//     const [confirmError, setConfirmError] = useState('');
//     const [successLogin, setSuccessLogin] = useState(false);
//     const navigate = useNavigate();

//     const handleLogin = async(e) => {
//         e.preventDefault();
//         const userData = {
//           "access_code" : accessCode
//         };
//     }

//     API.post('/userlogin/api/verify-access-code/',userData)
//     .then((response) => {
//         if(response.status == 200){
//             console.log("로그인 성공: ", response.data);
//             localStorage.setItem('access', response.data.access);
//             localStorage.setItem('refresh', response.data.refresh); // refresh 토큰 저장
//             setSuccessLogin(true); // 로그인 상태 변경
//             alert("서비스 접근에 성공하였습니다.");
//             navigate('/main');
//         }
//     })
//     .catch((error)=>{
//         if (error.response) {
//             const errorData = error.response.data;
//             alert("서비스 접근에 실패하였습니다.");
//     }})


//     const handleInputChange = (event) => {
//         setAccessCode(event.target.value);
//     }

//     const confirm = "240528";
//     const accessCodeCheckHandler = () => {
//         const accessCodeRegex = /^[a-z\d!@*&-_]{6}$/;
//         if (accessCode === "") {
//           setAccessError('access 코드를 입력해주세요.');
//           setTimeout(()=>{
//             setAccessError('');
//           }, 1500);
//           return false;
//         } else if (!accessCodeRegex.test(accessCode)) {
//             setAccessError('access code는 6자의 영소문자, 숫자, !@*&-_만 입력 가능합니다.');
//             setTimeout(()=>{
//                 setAccessError('');
//               }, 1500);
//             return false;
//         } else if (confirm !== accessCode) {
//             setAccessError('');
//             setTimeout(()=>{
//                 setAccessError('');
//               }, 1500);
//             setConfirmError('Access Code가 일치하지 않습니다.');
//           return false;
//         } else{
//             setSuccessLogin(true);
//             alert("접속에 성공하였습니다!");
//             navigate('/main');
//         }    
//       }


//     return (
//     <Frame>
//         <LoginBanner>
//         <img 
//         style={{width: "20vw"}}
//         src={BigLogo} alt = "main logo" />
//         </LoginBanner>
//         <form onSubmit={handleLogin}>
//         <LoginBox>
//             <div style={{display:"flex", flexDirection:"column", alignItems: "flex-start"}}>
//                 <h3 style={{color:"black", fontSize:"2vw", margin:"0"}}>서비스 이용하기</h3>
//                 <p style={{color:"#737373", fontSize:"1vw"}}>서비스 접근을 위한 직원용 Access Code를 입력하세요.</p>
//             </div>
//             <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
//                 <AccessCodeInput
//                 type="password"
//                 value={accessCode}
//                 onChange={handleInputChange}
//                 maxLength={6}
//                 />
//                <InputBox>
//                 {accessError && <p style={{ color: "red", fontSize:"1vw" }}>{accessError}</p>}
//                     {confirmError && <p style={{ color: "red", fontSize:"1vw"  }}>{confirmError}</p>} 
//                 </InputBox>
//                 <LoginBtn onClick={accessCodeCheckHandler}>
//                     완료
//                     <img src={basiccheck} alt="Checkbox Image" style={{width: "2vw", margin: "0vw 1vw"}} />
//                 </LoginBtn>
//             </div>
//         </LoginBox>
//         </form>
//     </Frame>
//     )
// }

// const InputBox = styled.div`
//     height: 3vw;

// `
// const AccessCodeInput = styled.input`
// width: 60%;
// font-size: 2vw;
// font-weight: bold;
// padding: 0.5vw;
// border-top: none;             
// border-right: none;           
// border-left: none;            
// border-bottom: 2px solid #293EFA; 
// margin: 7vw 0vw 0vw 2vw;
// text-align: center;
// letter-spacing: 1vw;
// background-color: transparent;
// outline: none;
//   border-bottom: ${props => props.value ? "3px solid #293EFA" : "2px solid gray"};
// `;


// const LoginBtn = styled.button`
// width:30vw;
// height: 3.5vw;
// background-color: #B6B6B6;
// color:white;
// border-style: none;
// border-radius: 3px;
// font-size: 1.5vw;
// font-weight: bold;
// padding: 0.7vw;
// margin: 2vw;
// box-sizing: border-box;
// text-align:center;
// display:flex;
// justify-content: center;
// &:hover{
//     background-color:#0089CF;
// }
// `

// const LoginBox = styled.div`
//     width: 100%;
//     height: 100%;
//     font-size: 2vw;
//     color: white;
//     box-sizing: border-box;
//     padding: 10vw;
//     display: flex;
//     flex-direction: column;
//     border-style: none;
//     cursor: pointer;
//     box-sizing: border-box;
//     background-color: #F5F6FA;
//     margin: 0vw 0vw 0vw 2vw;

// `

// const Frame = styled.div`
// width:95vw;
// height: 50vw; 
// background-color:#F5F6FA;
// display: flex;
// flex-directon: column;
// align-items: stretch;
// `
// const LoginBanner = styled.div`
// padding: 10vw 30px;
// align-items: center;
// display:flex;
// flex-direction: column;
// background-color: #0089CF;
// width: 25vw;
// box-sizing: border-box; 
// `
// export default UserLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BigLogo from '../images/BigLogo.png';
import basiccheck from '../images/basiccheck.png';
import API from '../api/axios'; 
const UserLogin = () => {
    const [accessCode, setAccessCode] = useState('');
    const [accessError, setAccessError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [accessSuccess, setAccessSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const userData = {
            "access_code": String(accessCode)
        };
        
        API.post('userlogin/api/verify-access-code/', userData)
            .then((response) => {
                console.log("response: ",response.data);
                if (response.data.status === "success") {
                    setAccessSuccess(true);
                    console.log("로그인 성공: ", response.data);

                    //access token과 refresh token도 추가해야함.
                    //localStorage.setItem('access', response.data.access);
                    //localStorage.setItem('refresh', response.data.refresh); // refresh 토큰 저장
                    alert("서비스 접근에 성공하였습니다.");
                    navigate('/main');
                }
            })
            .catch((error) => {
                if (error.response) {
                    const errorData = error.response.data;
                    console.log("error: ",errorData);
                    alert("서비스 접근에 실패하였습니다.");
                }
            });
    };

    const handleInputChange = (event) => {
        setAccessCode(event.target.value);
    };

    const confirm = "240528";/*
    const accessCodeCheckHandler = () => {
        const accessCodeRegex = /^[a-z\d!@*&-_]{6}$/;
        if (accessCode === "") {
            setAccessError('access 코드를 입력해주세요.');
            setTimeout(() => {
                setAccessError('');
            }, 1500);
            return false;
        } else if (!accessCodeRegex.test(accessCode)) {
            setAccessError('access code는 6자의 영소문자, 숫자, !@*&-_만 입력 가능합니다.');
            setTimeout(() => {
                setAccessError('');
            }, 1500);
            return false;
        } else if (confirm !== accessCode) {
            setAccessError('');
            setTimeout(() => {
                setAccessError('');
            }, 1500);
            setConfirmError('Access Code가 일치하지 않습니다.');
            return false;
        } else {
            setAccessSuccess(true);
            alert("접속에 성공하였습니다!");
            navigate('/main');
        }
    };
*/
    return (
        <Frame>
            <LoginBanner>
                <img
                    style={{ width: "20vw" }}
                    src={BigLogo} alt="main logo" />
            </LoginBanner>
            <form onSubmit={handleLogin}>
                <LoginBox>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <h3 style={{ color: "black", fontSize: "2vw", margin: "0" }}>서비스 이용하기</h3>
                        <p style={{ color: "#737373", fontSize: "1vw" }}>서비스 접근을 위한 직원용 Access Code를 입력하세요.</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <AccessCodeInput
                            type="password"
                            value={accessCode}
                            onChange={handleInputChange}
                            maxLength={6}
                        />
                        <InputBox>
                            {accessError && <p style={{ color: "red", fontSize: "1vw" }}>{accessError}</p>}
                            {confirmError && <p style={{ color: "red", fontSize: "1vw" }}>{confirmError}</p>}
                        </InputBox>
                        <LoginBtn /*onClick={accessCodeCheckHandler}*/>
                            완료
                            <img src={basiccheck} alt="Checkbox Image" style={{ width: "2vw", margin: "0vw 1vw" }} />
                        </LoginBtn>
                    </div>
                </LoginBox>
            </form>
        </Frame>
    );
};



const InputBox = styled.div`
    height: 3vw;

`
const AccessCodeInput = styled.input`
width: 60%;
font-size: 2vw;
font-weight: bold;
padding: 0.5vw;
border-top: none;             
border-right: none;           
border-left: none;            
border-bottom: 2px solid #293EFA; 
margin: 7vw 0vw 0vw 2vw;
text-align: center;
letter-spacing: 1vw;
background-color: transparent;
outline: none;
  border-bottom: ${props => props.value ? "3px solid #293EFA" : "2px solid gray"};
`;


const LoginBtn = styled.button`
width:30vw;
height: 3.5vw;
background-color: #B6B6B6;
color:white;
border-style: none;
border-radius: 3px;
font-size: 1.5vw;
font-weight: bold;
padding: 0.7vw;
margin: 2vw;
box-sizing: border-box;
text-align:center;
display:flex;
justify-content: center;
&:hover{
    background-color:#0089CF;
}
`

const LoginBox = styled.div`
    width: 100%;
    height: 100%;
    font-size: 2vw;
    color: white;
    box-sizing: border-box;
    padding: 10vw;
    display: flex;
    flex-direction: column;
    border-style: none;
    cursor: pointer;
    box-sizing: border-box;
    background-color: #F5F6FA;
    margin: 0vw 0vw 0vw 2vw;

`

const Frame = styled.div`
width:95vw;
height: 50vw; 
background-color:#F5F6FA;
display: flex;
flex-directon: column;
align-items: stretch;
`
const LoginBanner = styled.div`
padding: 10vw 30px;
align-items: center;
display:flex;
flex-direction: column;
background-color: #0089CF;
width: 25vw;
box-sizing: border-box; 
`
export default UserLogin;