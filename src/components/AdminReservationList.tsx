import React, { useEffect, useState } from "react";
import { getAdminReservations, reviewReservation } from "../api/reservation";
import "./AdminReservationList.css";

export default function AdminReservationList({ classroomId }: { classroomId: number }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [reservations, setReservations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (status: string) => {
    setLoading(true);
    const { success, data } = await getAdminReservations(status);
    if (success) {
      const filtered = (data.items || data).filter(
        (r: any) => r.classroom_id === classroomId
      );
      setReservations(filtered);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData("All");
  }, [classroomId]);

  function formatTime(datetime: string) {
    const date = new Date(datetime);
    date.setHours(date.getHours() + 8); // 加上台灣時區 (+8)

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    let hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, "0");
    const period = hour >= 12 ? "下午" : "上午";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    return `${yyyy}/${mm}/${dd} ${period}${hour}:${minute}`;
    }

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
      setSelected(null);
      fetchData(filterStatus);
    } else {
      alert("操作失敗，請稍後再試");
    }
  };

  return (
    <div className="admin-list-wrapper">
      <h3>教室申請管理</h3>

      <div className="filter-bar">
        <select
          value={filterStatus}
          onChange={(e) => {
            const newStatus = e.target.value;
            setFilterStatus(newStatus);
            setSelected(null);
            fetchData(newStatus);
          }}
        >
          <option value="All">全部</option>
          <option value="Pending">待審核</option>
          <option value="Approved">已通過</option>
          <option value="Rejected">已拒絕</option>
        </select>
      </div>

      {loading ? (
        <p className="no-reservation">載入中...</p>
        ) : reservations.length === 0 ? (
        <p className="no-reservation">目前無申請紀錄。</p>
        ) : (
        <div className="reservation-list">
            {reservations.map((r) => (
            <div
                key={r.id}
                className={`reservation-item ${r.status.toLowerCase()}`}
                onClick={() => setSelected(r)}
            >
                <div className="reservation-info">
                <div className="reservation-time">
                    {formatTime(r.start_time)} - <br />
                    {formatTime(r.end_time)}
                </div>
                </div>

                <div className={`status-tag ${r.status.toLowerCase()}`}>
                {r.status === "Approved"
                    ? "通過"
                    : r.status === "Rejected"
                    ? "拒絕"
                    : "審核中"}
                </div>
            </div>
            ))}
        </div>
        )}


      {selected && (
        <div className="review-modal-overlay" onClick={() => setSelected(null)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <h3>申請詳情</h3>
            <p>教室：{selected.classroom_name}</p>
            <p>
              時間：
              {new Date(selected.start_time).toLocaleString()} ~{" "}
              {new Date(selected.end_time).toLocaleString()}
            </p>
            <p>狀態：{selected.status}</p>
            <p>用途：{selected.purpose || "未填寫"}</p>

            {selected.status === "Pending" && (
              <div className="review-button-group">
                <button
                  className="approve-btn"
                  onClick={() => handleReview("Approved")}
                >
                  核准
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReview("Rejected")}
                >
                  拒絕
                </button>
              </div>
            )}
            <button
              className="back-btn"
              onClick={() => setSelected(null)}
              style={{ marginTop: "12px" }}
            >
              返回列表
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
