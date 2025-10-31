import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage"; 
import SignupPage from "./pages/SignupPage/SignupPage";
import ForgetPage from "./pages/ForgetPage/ForgetPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forget" element={<ForgetPage />} />

      </Routes>
    </Router>
  );
}

export default App;
