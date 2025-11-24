import React, { useState } from "react";
import "./UserNotificationPage.css";

type Notification = {
  id: number;
  classroom: string;
  time: string;
  status: "approved" | "rejected" | "pending";
  comment?: string;
};

export default function UserNotificationPage({ onClose }: { onClose: () => void }) {
  // 假資料
  const [notifications] = useState<Notification[]>([
    { id: 1, classroom: "101 教室", time: "2025-10-01 10:00 - 12:00", status: "approved", comment: "申請通過，請依時使用" },
    { id: 2, classroom: "204 教室", time: "2025-10-03 13:00 - 15:00", status: "rejected", comment: "時間衝突" },
    { id: 3, classroom: "305 教室", time: "2025-10-05 09:00 - 11:00", status: "pending", comment: "審核中" },
  ]);

  const [selected, setSelected] = useState<Notification | null>(null);

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <button className="notification-close" onClick={onClose}>×</button>
        <h3>通知（教室借用審核結果）</h3>

        <div className="notification-list">
          {notifications.map((n) => (
            <div key={n.id} className="notification-item" onClick={() => setSelected(n)}>
              <div className="notification-left">
                <strong>{n.classroom}</strong>
                <div className="notification-time">{n.time}</div>
              </div>
              <div className={`notification-status ${n.status}`}>
                {n.status === "approved" ? "通過" : n.status === "rejected" ? "拒絕" : "審核中"}
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="notification-detail">
            <h4>審核詳情</h4>
            <p><strong>教室：</strong>{selected.classroom}</p>
            <p><strong>時間：</strong>{selected.time}</p>
            <p><strong>狀態：</strong>{selected.status === "approved" ? "通過" : selected.status === "rejected" ? "拒絕" : "審核中"}</p>
            {selected.comment && <p><strong>備註：</strong>{selected.comment}</p>}
            <div style={{ marginTop: 10 }}>
              <button className="btn" onClick={() => setSelected(null)}>返回列表</button>
              <button className="btn primary" onClick={onClose} style={{ marginLeft: 12 }}>關閉</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
