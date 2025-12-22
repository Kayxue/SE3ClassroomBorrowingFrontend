import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
import { register } from "../../api/signup";

export default function SignupPage(): React.ReactElement {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !password || !phone || !studentId) {
      setMessage("請填寫所有欄位");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("密碼與再次輸入的密碼不相同!");
      return;
    }

    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setMessage("電話格式錯誤：必須以 09 開頭，後面 8 碼（範例：0912345678）");
      return;
    }

    setMessage("註冊中...");
    try {
      const payload = {
        email,
        name,
        password,
        phone_number: phone,
        student_id: studentId,
        username,
      };
      const { res, data } = await register(payload);
      if (res.ok) {
        setMessage("註冊成功，準備導向登入頁...");
        setTimeout(() => navigate("/"), 800);
      } else {
        setMessage(data?.message || `註冊失敗（status ${res.status}）`);
        console.error("Register error:", { status: res.status, body: data });
      }
    } catch (err) {
      console.error("err:", err);
      setMessage("網路錯誤，請稍後再試");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>註冊帳號</h2>
        <form onSubmit={handleSignup}>
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                setMessage("");
              }}
              placeholder="請輸入 Email"
            />
          </div>

          <div className="form-row">
            <label>密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                setMessage("");
              }}
              placeholder="請設定密碼"
            />
          </div>

          <div className="form-row">
            <label>再次輸入密碼</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(e.target.value);
                setMessage("");
              }}
              placeholder="請再次輸入密碼"
            />
          </div>

          <div className="form-row">
            <label>使用者名稱</label>
            <input
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
                setMessage("");
              }}
              placeholder="請設定使用者名稱 (username)"
            />
          </div>

          <div className="form-row">
            <label>姓名</label>
            <input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                setMessage("");
              }}
              placeholder="請輸入姓名"
            />
          </div>

          <div className="form-row">
            <label>電話</label>
            <input
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const digits = e.target.value.replace(/\D/g, "");
                setPhone(digits);
                setMessage("");
              }}
              placeholder="請輸入手機號碼，例如 : 0912345678"
              maxLength={10}
              inputMode="numeric"
              pattern="09[0-9]{8}"
            />
          </div>

          <div className="form-row">
            <label>學號</label>
            <input
              value={studentId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setStudentId(e.target.value);
                setMessage("");
              }}
              placeholder="請輸入學號"
            />
          </div>

          <button type="submit" className="btn submit-btn">
            註冊
          </button>
          {message && <p className="signup-message">{message}</p>}
        </form>

        <div className="signup-footer">
          <button
            type="button"
            className="btn-link"
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
}