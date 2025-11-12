import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  // 假資料
  const initialEmail = "user@example.com";
  const [email] = useState(initialEmail);
  const [name, setName] = useState("王小明");
  const [phone, setPhone] = useState("0912345678");

  const borrowRecords = [
    { id: 1, room: "101 教室", time: "2025-10-01 10:00 - 12:00" },
    { id: 2, room: "204 教室", time: "2025-10-03 13:00 - 15:00" },
  ];

  const [showRecordsModal, setShowRecordsModal] = useState(false);

  const navigate = useNavigate();

  const handleSave = () => {
    // 呼叫 API 儲存個人資料
    alert("已儲存個人資料");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>個人資料</h2>
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
        <div className="field">
          <label>電話</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="請輸入電話"
          />
        </div>

        <div className="actions">
          <button className="btn primary" onClick={handleSave}>
            儲存
          </button>
          <button className="btn danger" onClick={handleLogout}>
            登出
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn records-btn" onClick={() => setShowRecordsModal(true)}>
            借用紀錄
          </button>
        </div>

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
