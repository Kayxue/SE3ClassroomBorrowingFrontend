import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { getUserById } from "../api/user";

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

		setLoading(true);
		setMessage("登入中...");

		try {
			const { success, status, data } = await login(email, password);

			if (success) {
				setMessage("登入成功");

				setTimeout(() => navigate("/home"), 500);
			} else {
				if (status === 401) {
					setMessage("登入失敗：帳號或密碼錯誤");
				} else if (status === 500) {
					setMessage("伺服器錯誤，請稍後再試");
				} else {
					setMessage(data?.message || `登入失敗（status ${status}）`);
				}
				console.error("Login error:", { status: status, body: data });
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
						localStorage.removeItem("authToken");
						localStorage.removeItem("user");

						setTimeout(() => {
							navigate("/home");
						}, 500);
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
