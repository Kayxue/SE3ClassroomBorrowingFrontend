import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgetPage.css";
import { forgotPassword, verifyCode, resetPassword } from "../../api/passwordreset";

export default function ForgetPage(): React.ReactElement {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 發送驗證碼
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("請輸入 email");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await forgotPassword(email);
      setMessage("驗證碼已寄出，請檢查您的 email");
      setStep(2);
    } catch {
      setMessage("發送失敗，請稍後再試");
    }
    setLoading(false);
  };

  // 驗證驗證碼
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setMessage("請輸入驗證碼");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await verifyCode(email, code);
      if (res && res.reset_token) {
        setResetToken(res.reset_token);
        setMessage("驗證成功，請輸入新密碼");
        setStep(3);
      } else {
        setMessage("驗證碼錯誤或已過期");
      }
    } catch {
      setMessage("驗證失敗，請稍後再試");
    }
    setLoading(false);
  };

  // 重設密碼
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirm) {
      setMessage("請輸入新密碼並確認");
      return;
    }
    if (newPassword !== confirm) {
      setMessage("兩次密碼不一致");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await resetPassword(email, newPassword, resetToken, confirm);
      if (res.status === 200) {
        setMessage("密碼重設成功，將自動返回登入頁");
        setTimeout(() => navigate("/"), 1500);
      } else if (res.status === 404) {
        setMessage("找不到使用者");
      } else if (res.status === 400) {
        setMessage("請檢查輸入內容");
      } else {
        setMessage("重設失敗，請稍後再試");
      }
    } catch {
      setMessage("重設失敗，請稍後再試");
    }
    setLoading(false);
  };

  return (
    <div className="forget-page">
      <form
        className="forget-form"
        onSubmit={
          step === 1
            ? handleSendCode
            : step === 2
            ? handleVerifyCode
            : handleResetPassword
        }
      >
        <h1 className="forget-title">忘記密碼</h1>

        {step === 1 && (
          <div className="forget-row">
            <label htmlFor="email" className="forget-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="forget-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入 Email"
              required
              disabled={loading}
            />
          </div>
        )}

        {step === 2 && (
          <div className="forget-row">
            <label htmlFor="code" className="forget-label">
              驗證碼
            </label>
            <input
              id="code"
              type="text"
              className="forget-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="請輸入 6 位數驗證碼"
              required
              disabled={loading}
            />
          </div>
        )}

        {step === 3 && (
          <>
            <div className="forget-row">
              <label htmlFor="new-password" className="forget-label">
                新密碼
              </label>
              <input
                id="new-password"
                type="password"
                className="forget-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="請輸入新密碼"
                required
                disabled={loading}
              />
            </div>
            <div className="forget-row">
              <label htmlFor="confirm" className="forget-label">
                確認密碼
              </label>
              <input
                id="confirm"
                type="password"
                className="forget-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="再次輸入新密碼"
                required
                disabled={loading}
              />
            </div>
          </>
        )}

        <button type="submit" className="forget-button" disabled={loading}>
          {loading
            ? "處理中..."
            : step === 1
            ? "發送驗證碼"
            : step === 2
            ? "驗證"
            : "重設密碼"}
        </button>

        {message && <div className="forget-message">{message}</div>}
      </form>

      <div className="forget-footer">
        <button type="button" className="btn-link" onClick={() => navigate(-1)} disabled={loading}>
          返回
        </button>
      </div>
    </div>
  );
}
