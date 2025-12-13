import React, { useState, useEffect } from "react";
import "./UserNotificationPage.css";
import { getAllReservations, getReservationsByStatus, reviewReservation } from "../../api/reservation";
import { getClassroomById } from "../../api/classroom";
import { getProfile } from "../../api/profile";

function formatTimeRange(start: string, end: string) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const date = s.toISOString().slice(0, 10);
    const startTime = s.toISOString().slice(11, 16);
    const endTime = e.toISOString().slice(11, 16);
    return `${date} ${startTime}~${endTime}`;
  } catch {
    return `${start} ~ ${end}`;
  }
}

type Notification = {
  id: string;
  classroom_id: string;
  start_time: string;
  end_time: string;
  purpose?: string;
  status: string;
  reject_reason?: string | null;
  approved_by?: string | null;
  user_id?: string | null;
  classroom_name?: string;
};

export default function UserNotificationPage({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  // 抓使用者資料
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { res, data } = await getProfile();
        if (res.ok && data) {
          localStorage.setItem("user_id", data.id);
          localStorage.setItem("role", data.role);
          if (data.role === "Admin") {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error("抓取使用者資料錯誤：", err);
      }
    };
    fetchUserProfile();
  }, []);

  // 抓取申請資料
  const fetchData = async (statusFilter = "All") => {
    setLoading(true);
    let result;
    const role = localStorage.getItem("role");

    try {
      if (isAdmin) {
        if (statusFilter !== "All") {
          result = await getReservationsByStatus(statusFilter);
        } else {
          result = await getAllReservations();
        }
      } else {
        result = await getAllReservations();
      }

      const { success, data } = result;
      if (success && Array.isArray(data)) {
        const myId = localStorage.getItem("user_id");
        const filtered = role === "Admin" ? data : data.filter((n: any) => n.user_id === myId);

        const enriched = await Promise.all(
          filtered.map(async (n: any) => {
            let classroomName = "未知教室";
            try {
              const res = await getClassroomById(n.classroom_id);
              if (res.success && res.data.name) classroomName = res.data.name;
            } catch (err) {
              console.warn("查詢教室名稱失敗:", err);
            }
            return { ...n, classroom_name: classroomName };
          })
        );
        setNotifications(enriched);
      } else {
        alert("無法載入申請資料");
      }
    } catch (err) {
      console.error("載入申請資料錯誤:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  // 管理員審核
  const handleReview = async (status: "Approved" | "Rejected") => {
    if (!selected) return;
    let rejectReason: string | null = null;
    if (status === "Rejected") {
      rejectReason = prompt("請輸入拒絕原因：");
      if (!rejectReason) return;
    }
    const { success } = await reviewReservation(selected.id, status, rejectReason);
    if (success) {
      alert(status === "Approved" ? "已核准申請" : "已拒絕申請");
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === selected.id ? { ...n, status } : n
        )
      );
      setSelected(null);
    } else {
      alert("審核失敗，請重試");
    }
  };

  if (loading) {
    return (
      <div className="notification-modal-overlay">
        <div className="notification-modal">
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <button className="notification-close" onClick={onClose}>×</button>
        <h3>{isAdmin ? "教室申請管理" : "我的教室申請"}</h3>

        {isAdmin && (
          <div style={{ marginBottom: "12px" }}>
            <select
              value={filterStatus}
              onChange={(e) => {
                const newStatus = e.target.value;
                setFilterStatus(newStatus);
                setSelected(null); 
                fetchData(newStatus);
              }}
              style={{ padding: "6px 8px", borderRadius: "6px" }}
            >
              <option value="All">全部</option>
              <option value="Pending">待審核</option>
              <option value="Approved">已通過</option>
              <option value="Rejected">已拒絕</option>
            </select>
          </div>
        )}

        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className="notification-item" onClick={() => setSelected(n)}>
                <div className="notification-left">
                  <strong>{n.classroom_name}</strong>
                  <div className="notification-time">
                    {formatTimeRange(n.start_time, n.end_time)}
                  </div>
                </div>
                <div className={`notification-status ${n.status.toLowerCase()}`}>
                  {n.status === "Approved"
                    ? "通過"
                    : n.status === "Rejected"
                    ? "拒絕"
                    : "審核中"}
                </div>
              </div>
            ))
          ) : (
            <p>目前沒有申請資料。</p>
          )}
        </div>

        {selected && (
          <div className="notification-detail">
            <h4>申請詳情</h4>
            <p><strong>教室：</strong>{selected.classroom_name}</p>
            <p><strong>時間：</strong>{formatTimeRange(selected.start_time, selected.end_time)}</p>
            <p>
              <strong>狀態：</strong>
              {selected.status === "Approved"
                ? "通過"
                : selected.status === "Rejected"
                ? "拒絕"
                : "審核中"}
            </p>
            {selected.purpose && <p><strong>用途：</strong>{selected.purpose}</p>}
            {selected.reject_reason && <p><strong>備註：</strong>{selected.reject_reason}</p>}

            <div className="notification-actions">
              {isAdmin && selected.status === "Pending" && (
                <div className="review-buttons">
                  <button className="btn approve" onClick={() => handleReview("Approved")}>核准</button>
                  <button className="btn reject" onClick={() => handleReview("Rejected")}>拒絕</button>
                </div>
              )}
              <div style={{ marginTop: "10px" }}>
                <button className="btn back" onClick={() => setSelected(null)}>返回列表</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
