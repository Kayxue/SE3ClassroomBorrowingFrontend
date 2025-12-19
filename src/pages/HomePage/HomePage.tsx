import React, { useState, useEffect } from "react";
import logo from "../../assets/logo2.svg";
import ClassroomCard from "../../components/Classroomcard";
import SearchBar from "../../components/SearchBar";
import unknownPic from "../../assets/unknowpic.jpg";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./HomePage.css";
import { getClassroomList, createClassroom, updateClassroomPhoto,updateClassroom,deleteClassroom } from "../../api/classroom";
import UserNotificationPage from "../UserNotificationPage/UserNotificationPage";
import { getProfile } from "../../api/profile";
import { createReservation } from "../../api/reservation";


export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); 
  const [showNotifications, setShowNotifications] = useState(false); 
  const [formData, setFormData] = useState({
    name: "",
    type: "普通教室",
    capacity: "20",
    location: "",
    photo: null as File | null, 
  });

  const navigate = useNavigate();
  const [selectedClassroom, setSelectedClassroom] = useState<any>(null);
  const [classrooms, setClassrooms] = useState<any[]>([]);

  // 搜尋重置與過濾
  const [allClassrooms, setAllClassrooms] = useState<any[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [borrowDate, setBorrowDate] = useState("");
  const [startHour, setStartHour] = useState("00:00");
  const [endHour, setEndHour] = useState("00:00");
  const [purpose, setPurpose] = useState("");

  // 控制申請表單 Modal（如果有用）
  const [showReservationModal, setShowReservationModal] = useState(false);


  const handleEditClick = (classroom: any) => {
    setEditData({
      id: classroom.id,
      name: classroom.name,
      capacity: classroom.capacity,
      location: classroom.location || "",
      description: classroom.type || "普通教室",
      room_code: classroom.room_code || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { res } = await updateClassroom(editData.id, {
        name: editData.name,
        capacity: Number(editData.capacity),
        location: editData.location,
        description: editData.description,
        room_code: editData.room_code,
      });

      if (res.ok) {
        alert("教室更新成功！");
        setClassrooms((prev) =>
          prev.map((c) =>
            c.id === editData.id
              ? { ...c, ...editData, type: editData.description || c.type }
              : c
          )
        );
        setAllClassrooms((prev) =>
          prev.map((c) =>
            c.id === editData.id
              ? { ...c, ...editData, type: editData.description || c.type }
              : c
          )
        );
        setShowEditModal(false);
      } else {
        const errText = await res.text();
        alert(`更新失敗 (${res.status})：${errText}`);
      }
    } catch (err: any) {
      console.error("更新教室失敗:", err);
      alert("發生錯誤：" + err.message);
    }
  };


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { res, data } = await getProfile();
        console.log(res.status)
        if (res.ok && data) {
          setIsLoggedIn(true);
          if (data.role === "Admin") {
            setIsAdmin(true);
          }
        } 
      } catch (err) {
        console.error("抓取使用者資料錯誤：", err);
      }
    };

    const fetchClassrooms = async () => {
      try {
        const { res, data } = await getClassroomList();
        if (res.ok && Array.isArray(data)) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            name: item.name || `教室 ${item.id}`,
            type: item.description || "未分類",
            location: item.location || "未知地點",
            capacity: item.capacity || 0,
            imageUrl: item.photo_id ? `/api/image/${item.photo_id}` : unknownPic,
            __raw: item,
          }));
          setAllClassrooms(mapped);
          setClassrooms(mapped);
        } else {
          console.warn("無法取得教室資料：", data);
        }
      } catch (err) {
        console.error("抓取教室資料錯誤：", err);
      }
    };

    fetchUserProfile();
    fetchClassrooms();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const { res } = await deleteClassroom(String(id));

      if (res.ok) {
        alert("教室刪除成功！");
        setClassrooms((prev) => prev.filter((c) => c.id !== id));
        setAllClassrooms((prev) => prev.filter((c) => c.id !== id));
      } else if (res.status === 404) {
        alert("找不到該教室，可能已被刪除");
      } else {
        alert(`刪除失敗 (${res.status})`);
      }
    } catch (err: any) {
      console.error("刪除教室失敗：", err);
      alert("發生錯誤：" + err.message);
    }
  };

  const handleAddClassroom = async (newClassroom: any) => {
    try {
      const fd = new FormData();
      fd.append("name", newClassroom.name);
      fd.append("capacity", String(newClassroom.capacity));
      fd.append("location", newClassroom.location);
      fd.append("description", `${newClassroom.type}`);
      fd.append("photo", newClassroom.photo)

      const { success,status,data } = await createClassroom(fd);

      if (success) {
        alert("新增成功！");
        const created = { id: data.id, ...newClassroom, imageUrl: `/api/image/${data.photo_id}`, __raw: data, type: newClassroom.type };
        setClassrooms((prev) => [...prev, created]);
        setAllClassrooms((prev) => [...prev, created]);
        setShowAddModal(false);
      } else {
        alert(`新增失敗 (${status})：${data || "未知錯誤"}`);
      }
    } catch (err: any) {
      console.error("新增教室失敗:", err);
      alert(`發生錯誤：${err.message || err}`);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFormData((prev) => ({ ...prev, photo: file }));
    };

    const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const date = borrowDate;
      const startTime = `${date}T${startHour}:00+08:00`;
      const endTime = `${date}T${endHour}:00+08:00`;


      console.log("送出的 JSON：", {
        classroom_id: selectedClassroom.id,
        start_time: startTime,
        end_time: endTime,
        purpose,
      });

      const { success, status, data } = await createReservation(
        selectedClassroom.id,
        startTime,
        endTime,
        purpose
      );

      if (success) {
        alert("申請成功！");
        setShowReservationModal(false);
      } else {
        alert(`申請失敗 (${status})：${data}`);
      }
    } catch (err: any) {
      console.error("申請教室失敗：", err);
      alert("發生錯誤：" + err.message);
    }
  };

  const borrowedList = [
    { id: 1, name: "101 教室", category: "普通教室" },
    { id: 2, name: "204 教室", category: "電腦教室" },
    { id: 3, name: "305 教室", category: "演講廳" },
  ];

  // 搜尋處理
  const handleSearch = (filters: any) => {
    const { time, type, capacity, onlyAvailable } = filters;
    console.log("查詢條件：", filters);

    let result = allClassrooms.slice();

    // 類別過濾
    if (type) {
      result = result.filter((c) => (c.type || "").toString() === type);
    }

    // 容納人數過濾
    if (capacity) {
      if (capacity === "60以上") {
        result = result.filter((c) => Number(c.capacity) >= 60);
      } else {
        const capNum = Number(capacity);
        if (!isNaN(capNum)) {
          result = result.filter((c) => Number(c.capacity) >= capNum);
        }
      }
    }

    // "時段"與"是否可借用"待更新
    if (time || onlyAvailable) {
      if (onlyAvailable) {
        alert('「只顯示可借用教室」待更新。');
      }
      if (time) {
        console.log('時段條件待更新:', time);
      }
    }

    setClassrooms(result);
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <img src={logo} alt="Logo" className="homepage-logo" />

        {isLoggedIn ? (
          <div className="icon-group">
            {isAdmin && (
              <FaEdit
                className="icon-button"
                title="編輯教室"
                onClick={() => setEditMode(!editMode)}
              />
            )}
            <FaEnvelope
              className="icon-button"
              title="通知"
              onClick={() => setShowNotifications(true)} 
            />
            <FaUserCircle
              className="icon-button"
              title="個人資料"
              onClick={() => navigate("/profile")}
            />
          </div>
        ) : (
          <button className="login-button" onClick={() => navigate("/")}>
            登入
          </button>
        )}
      </header>

      {/* 通知彈窗*/}
      {showNotifications && (
        <UserNotificationPage onClose={() => setShowNotifications(false)} />
      )}

      {isLoggedIn && !isAdmin ? (
        <aside className="sidebar">
          <h2 className="sidebar-title">待還教室列表</h2>
          <div className="borrow-list">
            {borrowedList.map((item, index) => (
              <div key={index} className="borrow-item">
                <span className="borrow-name">{item.name}</span>
                <button className="return-btn">歸還</button>
              </div>
            ))}
          </div>
        </aside>
      ) : null}

      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} />
      </div>

      <main className="homepage-content">
        <div className="classroom-grid">
          {editMode && (
            <div className="add-card" onClick={() => setShowAddModal(true)}>
              <FaPlus className="plus-icon" />
              <p>新增教室</p>
            </div>
          )}

          {classrooms.map((c) => (
            <div key={c.id} className="classroom-card">
              <div onClick={() => {
                if (editMode) {
                  handleEditClick(c); 
                } else {
                  setSelectedClassroom(c); 
                }
              }}
            >
                <ClassroomCard name={c.name} imageUrl={c.imageUrl} />
              </div>
              {editMode && (
                <FaTrash
                  className="delete-icon"
                  title="刪除教室"
                  onClick={() => handleDelete(c.id)}
                />
              )}
            </div>
          ))}
        </div>
      </main>

      {/* 新增教室彈窗 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            <h2>新增教室</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddClassroom(formData);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <label>
                教室名稱：
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="請輸入教室名稱"
                  required
                  style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </label>

              <label>
                教室地點：
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="請輸入教室地點"
                  required
                  style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </label>

              <label>
                教室類型：
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value,
                    })
                  }
                  style={{ width: "95%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                  <option value="普通教室">普通教室</option>
                  <option value="電腦教室">電腦教室</option>
                  <option value="自習教室">自習教室</option>
                  <option value="演講廳">演講廳</option>
                </select>
              </label>


              <label>
                容納人數：
                <select
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  style={{ width: "95%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                  <option value="20">20 人</option>
                  <option value="30">30 人</option>
                  <option value="40">40 人</option>
                  <option value="50">50 人</option>
                  <option value="60">60 人</option>
                </select>
              </label>

              <label>
                上傳圖片：
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, photo: e.target.files?.[0] || null })
                  }
                  style={{ width: "90%", padding: "8px" }}
                />
              </label>


              <button
                type="submit"
                style={{
                  marginTop: "10px",
                  backgroundColor: "#0c2a5b",
                  color: "#fff",
                  padding: "10px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                確認新增
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 現有教室彈窗 */}
      {selectedClassroom && (
        <div className="modal-overlay" onClick={() => setSelectedClassroom(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedClassroom(null)}>×</button>
            <div className="modal-top">
              <img
                src={selectedClassroom.imageUrl}
                alt={selectedClassroom.name}
                className="modal-thumbnail"
              />
              <div className="modal-info">
                <h2>{selectedClassroom.name}</h2>
                <p>地點：{selectedClassroom.location}</p>
                <p>種類：{selectedClassroom.type}</p>
                <p>容納人數：{selectedClassroom.capacity} 人</p>
              </div>
            </div>
            <div className="modal-bottom">
              {!isLoggedIn ? (
                // --- 訪客模式 ---
                <div className="guest-login">
                  <button onClick={() => navigate("/")}>登入以申請教室</button>
                </div>
              ) : !isAdmin ? (
                // --- 一般使用者登入模式 ---
                <form className="apply-form" onSubmit={handleReservationSubmit}>
                  <label>借用日期：</label>
                  <input type="date" value={borrowDate} onChange={(e) => setBorrowDate(e.target.value)} />

                  <div className="time-row">
                    <div className="time-field">
                      <label>開始時間：</label>
                      <select value={startHour} onChange={(e) => setStartHour(e.target.value)}>
                        {Array.from({ length: 24 }).map((_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <option key={i} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="time-field">
                      <label>結束時間：</label>
                      <select value={endHour} onChange={(e) => setEndHour(e.target.value)}>
                        {Array.from({ length: 24 }).map((_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <option key={i} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <label>申請理由：</label>
                  <textarea
                    rows={3}
                    placeholder="請輸入教室使用目的"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />

                  <div className="submit-row">
                    <button type="submit">提出申請</button>
                  </div>
                </form>

              ) : (
                // --- 管理員模式 ---
                <p className="admin-msg">管理員無需申請教室。</p>
              )}
            </div>


          </div>
        </div>
      )}

      {showEditModal && editData && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            <h2>編輯教室</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const { res } = await updateClassroom(editData.id, {
                    name: editData.name,
                    capacity: Number(editData.capacity),
                    location: editData.location,
                    description: editData.description,
                    room_code: editData.room_code,
                  });

                  if (res.ok) {
                    if (editData.photo) {
                      const { success } = await updateClassroomPhoto(editData.id, editData.photo);
                      if (success) {
                        const updatedUrl = URL.createObjectURL(editData.photo);
                        setClassrooms((prev) =>
                          prev.map((c) =>
                            c.id === editData.id ? { ...c, imageUrl: updatedUrl, type: editData.description || c.type } : c
                          )
                        );
                        setAllClassrooms((prev) =>
                          prev.map((c) =>
                            c.id === editData.id ? { ...c, imageUrl: updatedUrl, type: editData.description || c.type } : c
                          )
                        );
                      }
                    }
                    alert("教室資料已更新！");
                    setShowEditModal(false);

                    setClassrooms((prev) =>
                      prev.map((c) =>
                        c.id === editData.id ? { ...c, ...editData, type: editData.description || c.type } : c
                      )
                    );
                    setAllClassrooms((prev) =>
                      prev.map((c) =>
                        c.id === editData.id ? { ...c, ...editData, type: editData.description || c.type } : c
                      )
                    );
                  } else {
                    alert(`更新失敗 (${res.status})`);
                  }
                } catch (err: any) {
                  console.error("更新教室失敗:", err);
                  alert("發生錯誤：" + err.message);
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <label>
                教室名稱：
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="請輸入教室名稱"
                  required
                />
              </label>

              <label>
                教室地點：
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  placeholder="請輸入教室地點"
                />
              </label>

              <label>
                教室類型：
                <select
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      description: e.target.value,
                    })
                  }
                >
                  <option value="普通教室">普通教室</option>
                  <option value="電腦教室">電腦教室</option>
                  <option value="自習教室">自習教室</option>
                  <option value="演講廳">演講廳</option>
                </select>
              </label>

              <label>
                容納人數：
                <select
                  value={editData.capacity}
                  onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                >
                  <option value="20">20 人</option>
                  <option value="30">30 人</option>
                  <option value="40">40 人</option>
                  <option value="50">50 人</option>
                  <option value="60">60 人</option>
                </select>
              </label>

              <label>
                上傳圖片：
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      photo: e.target.files?.[0] || null,
                    })
                  }
                />
              </label>

              <button
                type="submit"
                style={{
                  marginTop: "10px",
                  backgroundColor: "#0c2a5b",
                  color: "#fff",
                  padding: "10px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                儲存修改
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
