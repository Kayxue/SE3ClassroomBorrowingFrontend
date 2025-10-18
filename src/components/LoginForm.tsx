import React, { useState } from "react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 前端先做測試
    if (!email || !password) {
      setMessage("請輸入完整的帳號與密碼");
      return;
    }

    // 模擬登入中
    setMessage("登入中...");

    // 模擬延遲
    setTimeout(() => {
      if (email === "yin@gmail.com" && password === "88888888") {
        setMessage("登入成功");
      } else {
        setMessage("登入失敗（帳號或密碼錯誤）");
      }
    }, 1000);
  };

  return (
    <div className="login-form-container">
      <h2>教室借用平臺</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>帳號：</label>
          <input
            type="email"
            value={email}
            placeholder="請輸入 Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>密碼：</label>
          <input
            type="password"
            value={password}
            placeholder="請輸入密碼"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn submit-btn">登入</button>
        <button
          type="button"
          className="btn visitor-btn"
          onClick={() => {/* 訪客模式logic */}}
        >
          訪客模式
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <button
        type="button"
        className="btn-link left-link"
        onClick={() => {/* 忘記密碼logic */}}
      >
        忘記密碼
      </button>
      <button
        type="button"
        className="btn-link right-link"
        onClick={() => {/* 註冊logic */}}
      >
        註冊
      </button>
    </div>
  );
};

export default LoginForm;
