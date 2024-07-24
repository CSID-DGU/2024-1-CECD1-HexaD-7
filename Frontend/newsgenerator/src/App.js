import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import Main from "./pages/Main"; // 메인 페이지 컴포넌트 이름은 프로젝트에 맞게 조정
import MainLoading from "./pages/MainLoading";
import MainOutput from "./pages/MainOutput";
import TopicGenerator1 from "./pages/TopicGenerator1";
import TopicGenerator2 from "./pages/TopicGenerator2";
import Feedback from "./pages/Feedback";
import Feedbackoutput from "./pages/Feedbackoutput";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/main" element={<Main />} />
          <Route path="/mainloading" element={<MainLoading />} />
          <Route path="/mainoutput" element={<MainOutput />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/feedbackoutput" element={<Feedbackoutput />} />
          <Route path="/topicgenerator1" element={<TopicGenerator1 />} />
          <Route path="/topicgenerator2" element={<TopicGenerator2 />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
