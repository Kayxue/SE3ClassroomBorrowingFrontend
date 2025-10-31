import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

export default function SignupPage(): React.ReactElement {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage("請填寫所有欄位");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("密碼與再次輸入的密碼不相同!");
      return;
    }

    setMessage("註冊中...");
    setTimeout(() => {
      setMessage("註冊成功，準備導向登入頁...");
      setTimeout(() => navigate("/"), 800);
    }, 1000);
  };

  return React.createElement(
    "div",
    { className: "signup-page" },
    React.createElement(
      "div",
      { className: "signup-card" },
      React.createElement("h2", null, "註冊帳號"),
      React.createElement(
        "form",
        { onSubmit: handleSignup },
        
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement("label", null, "Email"),
          React.createElement("input", {
            type: "email",
            value: email,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setMessage("");
            },
            placeholder: "請輸入 Email",
          })
        ),
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement("label", null, "密碼"),
          React.createElement("input", {
            type: "password",
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setMessage("");
            },
            placeholder: "請設定密碼",
          })
        ),
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement("label", null, "再次輸入密碼"),
          React.createElement("input", {
            type: "password",
            value: confirmPassword,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value);
              setMessage("");
            },
            placeholder: "請再次輸入密碼",
          })
        ),
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement("label", null, "姓名"),
          React.createElement("input", {
            value: name,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
              setMessage("");
            },
            placeholder: "請輸入姓名",
          })
        ),
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement("label", null, "電話"),
          React.createElement("input", {
            value: phone,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setPhone(e.target.value);
              setMessage("");
            },
            placeholder: "請輸入電話",
          })
        ),
        React.createElement(
          "button",
          { type: "submit", className: "btn submit-btn" },
          "註冊"
        ),
        message && React.createElement("p", { className: "signup-message" }, message)
      ),
      React.createElement(
        "div",
        { className: "signup-footer" },
        React.createElement(
          "button",
          {
            type: "button",
            className: "btn-link",
            onClick: () => navigate(-1),
          },
          "返回"
        )
      )
    )
  );
}