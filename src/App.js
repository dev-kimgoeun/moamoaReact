import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./component/Header";
import Mypage_info from "./component/member/Mypage_info";
import Login from "./component/member/Login";
import Signup from "./component/member/Signup";
import DevLogin from "./component/member/DevLogin";
import AfterSignin from "./component/member/AfterSignin";
import JoinFunding from "./component/funding/JoinFunding";
import HostFunding from "./component/funding/HostFunding";
import FundingList from "./component/funding/FundingList";
import Frindlist from "./component/member/Frindlist";

function App() {
  return (
    <div className="App-background">
      <h1>메인 페이지(root)</h1>
      <Header />
      <header className="App-header">
        <container className="App-container">
          <Routes>
            <Route path="/member/info" element={<Mypage_info />} />
            <Route path="/" element={<Login />} />
            <Route path="/member/frind" element={<Frindlist />} />
            <Route path="/member/signup" element={<Signup />} />
            <Route path="/login" element={<DevLogin />} />
            <Route path="/login/after" element={<AfterSignin />} />
            <Route path="/funding/join" element={<JoinFunding />} />
            <Route path="/funding/host" element={<HostFunding />} />
            <Route path="/funding/list" element={<FundingList />} />
          </Routes>
        </container>
      </header>
    </div>
  );
}

export default App;
