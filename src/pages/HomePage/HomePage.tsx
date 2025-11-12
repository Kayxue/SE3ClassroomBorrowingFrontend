import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import ClassroomCard from "../../components/Classroomcard";
import SearchBar from "../../components/SearchBar";
import unknownPic from "../../assets/unknowpic.jpg";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import "./HomePage.css";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 暫時借放登入中

  const handleSearch = (filters: any) => {
    console.log("查詢條件：", filters);
  };

  const [selectedClassroom, setSelectedClassroom] = useState<any>(null);
  const navigate = useNavigate();

  const classrooms = [
    { name: "103 教室", type: "普通教室", capacity: 60, imageUrl: unknownPic },
    { name: "105 教室", type: "普通教室", capacity: 60, imageUrl: unknownPic },
    { name: "201 教室", type: "電腦教室", capacity: 20, imageUrl: unknownPic },
    { name: "202 教室", type: "自習教室", capacity: 30, imageUrl: unknownPic },
    { name: "203 教室", type: "電腦教室", capacity: 40, imageUrl: unknownPic },
    { name: "303 教室", type: "普通教室", capacity: 50, imageUrl: unknownPic },
  ];

  // 測試用借用清單資料
  const borrowedList = [
    {
      id: 1,
      name: "101 教室",
      category: "普通教室",
      capacity: 40,
      borrowedTime: "10:00 - 12:00",
    },
    {
      id: 2,
      name: "204 教室",
      category: "電腦教室",
      capacity: 30,
      borrowedTime: "13:00 - 15:00",
    },
    {
      id: 3,
      name: "305 教室",
      category: "演講廳",
      capacity: 60,
      borrowedTime: "15:00 - 17:00",
    },
  ];


  return (
  <div className="homepage-container">
    <header className="homepage-header">
      <img src={logo} alt="Logo" className="homepage-logo" />
      
      {isLoggedIn ? (
        <div className="icon-group">
          <FaEnvelope className="icon-button" title="通知" />
          <FaUserCircle
            className="icon-button"
            title="個人資料"
            onClick={() => navigate("/profile")}
          />
        </div>
      ) : (
        <button className="login-button">登入</button>
      )}
    </header>


    <div className="homepage-body">
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

      <main className="homepage-content">
        <SearchBar onSearch={handleSearch} />
        <div className="classroom-grid">
          {classrooms.map((c, i) => (
            <div key={i} onClick={() => setSelectedClassroom(c)}>
              <ClassroomCard name={c.name} imageUrl={c.imageUrl} />
            </div>
          ))}
        </div>
      </main>
    </div>

    {/* 彈跳式視窗 */}
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
