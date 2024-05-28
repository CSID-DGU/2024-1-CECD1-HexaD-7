import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import Main from './pages/Main'; // 메인 페이지 컴포넌트 이름은 프로젝트에 맞게 조정

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
