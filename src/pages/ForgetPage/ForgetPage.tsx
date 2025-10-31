import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgetPage.css";

export default function ForgetPage(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("請輸入 email");
      return;
    }
    setMessage("重設密碼連結已發送到您的 email");
    // setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="forget-page">
      <form className="forget-form" onSubmit={handleSubmit}>
        <h1 className="forget-title">忘記密碼</h1>

        <div className="forget-row">
          <label htmlFor="email" className="forget-label">Email</label>
          <input
            id="email"
            type="email"
            className="forget-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="請輸入 Email"
            required
          />
        </div>

        <button type="submit" className="forget-button">確認</button>

        {message && <div className="forget-message">{message}</div>}
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
  );
}