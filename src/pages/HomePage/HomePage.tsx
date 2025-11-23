import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import ClassroomCard from "../../components/Classroomcard";
import SearchBar from "../../components/SearchBar";
import unknownPic from "../../assets/unknowpic.jpg";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./HomePage.css";
import { getClassroomList, createClassroom, uploadClassroomPhoto } from "../../api/classroom";


export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "普通教室",
    capacity: "20",
    photo: null as File | null, 
  });

  const navigate = useNavigate();
  const [selectedClassroom, setSelectedClassroom] = useState<any>(null);
  const [classrooms, setClassrooms] = useState<any[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      const parsed = JSON.parse(user);
      if (parsed.role === "Admin") setIsAdmin(true);
    } else {
      setIsLoggedIn(false);
    }

    const fetchData = async () => {
      try {
        const { res, data } = await getClassroomList();
        if (res.ok && Array.isArray(data)) {
          setClassrooms(
            data.map((item: any) => ({
              id: item.id,
              name: item.purpose || `教室 ${item.id}`,
              type: item.status || "未分類",
              capacity: item.capacity || 0,
              imageUrl: unknownPic,
            }))
          );
        } else {
          console.warn("無法取得教室資料：", data);
        }
      } catch (err) {
        console.error("抓取教室資料錯誤：", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    setClassrooms((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddClassroom = async (newClassroom: any) => {
    try {
      const fd = new FormData();
      fd.append("name", newClassroom.name);
      fd.append("capacity", String(newClassroom.capacity));
      fd.append("location", "");
      fd.append("room_code", "");
      fd.append("description", newClassroom.type + " 教室");

      const { res, data } = await createClassroom(fd);

      if (res.ok && data?.id) {
        if (newClassroom.photo) {
          const { res: photoRes } = await uploadClassroomPhoto(data.id, newClassroom.photo);
          if (!photoRes.ok) {
            console.warn("圖片上傳失敗");
          }
        }

        alert("新增成功！");
        setClassrooms((prev) => [
          ...prev,
          { id: data.id, ...newClassroom, imageUrl: unknownPic },
        ]);
        setShowAddModal(false);
      } else {
        alert(`新增失敗 (${res.status})：${data.rawText || "未知錯誤"}`);
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

  const borrowedList = [
    { id: 1, name: "101 教室", category: "普通教室" },
    { id: 2, name: "204 教室", category: "電腦教室" },
    { id: 3, name: "305 教室", category: "演講廳" },
  ];

  const handleSearch = (filters: any) => {
    console.log("查詢條件：", filters);
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
            <FaEnvelope className="icon-button" title="通知" />
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

      {isLoggedIn && (
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
      )}

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
              <div onClick={() => setSelectedClassroom(c)}>
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
                教室類型：
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                <p>種類：{selectedClassroom.type}</p>
                <p>容納人數：{selectedClassroom.capacity} 人</p>
              </div>
            </div>
            <div className="modal-bottom"></div>
          </div>
        </div>
      )}
    </div>
  );
}
