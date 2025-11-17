import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("請輸入完整的帳號與密碼");
      return;
    }

    // 在 production 環境下強制使用 HTTPS，避免在不安全連線傳送原始密碼
    if ((globalThis as any).process?.env?.NODE_ENV === "production" && window.location.protocol !== "https:") {
      setMessage("為保護帳號安全，請在 HTTPS 連線下登入（伺服器端會安全處理並儲存密碼）。");
      return;
    }

    setLoading(true);
    setMessage("登入中...");

    try {
      const { res, data } = await login(email, password);

      if (res.ok) {
        if (data?.token) {
          localStorage.setItem("authToken", data.token);
        } else if (data && (data.id || data.email || data.username)) {
          localStorage.setItem("user", JSON.stringify(data));
        }
        setMessage("登入成功");
        setTimeout(() => navigate("/home"), 500);
      } else {
        if (res.status === 401) {
          setMessage("登入失敗：帳號或密碼錯誤");
        } else if (res.status === 500) {
          setMessage("伺服器錯誤，請稍後再試");
        } else {
          setMessage(data?.message || `登入失敗（status ${res.status}）`);
        }
        console.error("Login error:", { status: res.status, body: data });
      }
    } catch (err: any) {
      console.error("err:", err);
      setMessage("網路錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
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

        <button type="submit" className="btn submit-btn" disabled={loading}>
          {loading ? "登入中..." : "登入"}
        </button>
        <button
          type="button"
          className="btn visitor-btn"
          disabled={loading}
          onClick={() => {
            setTimeout(() => {
              navigate("/home");
            }, 1000);
          }}
        >
          訪客模式
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <button
        type="button"
        className="btn-link left-link"
        onClick={() => {
          // 導向忘記密碼頁面
          navigate("/forget");
        }}
      >
        忘記密碼
      </button>
      <button
        type="button"
        className="btn-link right-link"
        onClick={() => {
          // 導向註冊頁面
          navigate("/signup");
        }}
      >
        註冊
      </button>
    </div>
  );
};

export default LoginForm;
