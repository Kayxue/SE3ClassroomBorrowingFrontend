import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { getProfile } from "../../api/profile";
import { updatePassword } from "../../api/password";
import { logout } from "../../api/logout"; 
import { updateProfile } from "../../api/updateprofile"; 

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  //假資料
  const borrowRecords = [
    { id: 1, room: "101 教室", time: "2025-10-01 10:00 - 12:00" },
    { id: 2, room: "204 教室", time: "2025-10-03 13:00 - 15:00" },
  ];

  const [showRecordsModal, setShowRecordsModal] = useState(false);

  // 更改密碼
  const [showChangePwdModal, setShowChangePwdModal] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMessage, setPwdMessage] = useState<string | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { res, data } = await getProfile();
        if (!mounted) return;
        if (res.status === 401) {
          navigate("/");
          return;
        }
        if (res.ok && data) {
          setIsLoggedIn(true);
          if (data.role === "Admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
          setEmail(data?.email ?? "");
          setName(data?.name ?? "");
          setPhone(data?.phone_number ?? "");
        } else {
          setError(data?.message || `取得資料失敗（status ${res.status}）`);
        }
      } catch (err) {
        alert("無法取得個人資料，請稍後再試");
        console.error("getProfile error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  // 儲存個人資料
  const handleSave = async () => {
    if (!name) {
      alert("請輸入姓名");
      return;
    }

    try {
      const payload = {
        email: email ?? null,
        name: name ?? null,
        phone_number: phone ?? null,
        username: null,
      };

      const { res, data } = await updateProfile(payload);

      if (res.ok) {
        alert("已儲存個人資料");
        if (data?.email) setEmail(data.email);
        if (data?.name) setName(data.name);
        if (data?.phone_number) setPhone(data.phone_number);
      } else if (res.status === 401) {
        alert("未授權，請重新登入");
        navigate("/");
      } else if (res.status === 500) {
        alert("伺服器錯誤，請稍後再試");
      } else {
        alert(data?.message || `儲存失敗（status ${res.status}）`);
      }
    } catch (err) {
      console.error("updateProfile error:", err);
      alert("網路錯誤，無法儲存，請稍後再試");
    }
  };

  // 登出
  const handleLogout = async () => {
    try {
      const { res, data } = await logout();
      if (res.ok) {
        navigate("/");
      } else {
        console.error("Logout failed:", { status: res.status, body: data });
        if (res.status === 500) {
          alert("登出失敗（伺服器錯誤），請稍後再試");
        } else {
          alert(data?.message || `登出失敗（status ${res.status}）`);
        }
      }
    } catch (err) {
      console.error("logout error:", err);
      alert("網路錯誤，無法登出，請稍後再試");
    }
  };

  // 變更密碼處理
  const handleChangePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPwdMessage(null);
    if (!oldPwd || !newPwd || !confirmPwd) {
      alert("請填寫所有欄位");
      return;
    }
    if (newPwd !== confirmPwd) {
      alert("新密碼與確認密碼不相符");
      return;
    }
    setPwdLoading(true);
    try {
      const { res, data } = await updatePassword({
        old_password: oldPwd,
        new_password: newPwd,
        confirm: confirmPwd,
      });
      if (res.ok) {
        setPwdMessage("密碼更新成功");
        setShowChangePwdModal(false);
        alert("已完成修改");
        setOldPwd("");
        setNewPwd("");
        setConfirmPwd("");
      } else if (res.status === 400) {
        alert(data?.message || "新密碼與確認密碼不相同或格式錯誤");
      } else if (res.status === 401) {
        alert("未授權，請重新登入");
        navigate("/");
      } else {
        alert(data?.message || `變更密碼失敗（status ${res.status}）`);
      }
    } catch (err) {
      console.error("updatePassword error:", err);
      alert("網路錯誤，請稍後再試");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>個人資料</h2>
        {loading ? (
          <p>讀取中...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="field">
              <label>Gmail（不可修改）</label>
              <input type="email" value={email} readOnly />
            </div>
            <div className="field">
              <label>姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="請輸入姓名"
              />
            </div>

            <div className="field column">
              <div className="pwd-row">
                <label className="pwd-label">密碼</label>
                <input
                  type="password"
                  value={"********"}
                  readOnly
                  className="pwd-input"
                />
                <button
                  className="btn-passwordlink pwd-btn"
                  type="button"
                  onClick={() => setShowChangePwdModal(true)}
                >
                  變更密碼
                </button>
              </div>
            </div>

            <div className="field">
              <label>電話</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="請輸入電話"
              />
            </div>
          </>
        )}

        <div className="actions">
          <button className="btn primary" onClick={handleSave}>
            儲存
          </button>
          <button className="btn danger" onClick={handleLogout}>
            登出
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {!isAdmin && (
            <button className="btn records-btn" onClick={() => setShowRecordsModal(true)}>
              借用紀錄
            </button>
          )}
        </div>

        <div style={{ marginTop: 5 }}>
          <button className="btn back-btn" onClick={() => navigate("/home")}>
            返回
          </button>
        </div>

        {/* 變更密碼 */}
        {showChangePwdModal && (
          <div className="modal-overlay" onClick={() => setShowChangePwdModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowChangePwdModal(false)}>
                ×
              </button>
              <h3>變更密碼</h3>
              <form onSubmit={handleChangePassword}>
                <div className="form-row">
                  <label>舊密碼</label>
                  <input
                    type="password"
                    value={oldPwd}
                    onChange={(e) => setOldPwd(e.target.value)}
                    placeholder="請輸入舊密碼"
                  />
                </div>
                <div className="form-row">
                  <label>新密碼</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="請輸入新密碼"
                  />
                </div>
                <div className="form-row">
                  <label>確認新密碼</label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="請再次輸入新密碼"
                  />
                </div>
                {pwdMessage && <p className="error">{pwdMessage}</p>}
                <div style={{ marginTop: 10 }}>
                  <button type="submit" className="btn primary" disabled={pwdLoading}>
                    {pwdLoading ? "處理中..." : "送出"}
                  </button>
                  <button type="button" className="btn" onClick={() => setShowChangePwdModal(false)} style={{ marginLeft: 25 }}>
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRecordsModal && (
          <div className="modal-overlay" onClick={() => setShowRecordsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowRecordsModal(false)}>
                ×
              </button>
              <h3>借用紀錄</h3>
                  <div className="records-list">
                {borrowRecords.map((record) => (
                  <div key={record.id} className="record-item">
                    <span>{record.time}</span>
                    <span>{record.room}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
