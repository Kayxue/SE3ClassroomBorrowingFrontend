import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import ClassroomCard from "../../components/Classroomcard";
import unknownPic from "../../assets/unknowpic.jpg";
import "./HomePage.css";

export default function HomePage() {
  const [selectedClassroom, setSelectedClassroom] = useState<any>(null);

  const classrooms = [
    { name: "103 教室", type: "普通教室", capacity: 60, imageUrl: unknownPic },
    { name: "105 教室", type: "普通教室", capacity: 60, imageUrl: unknownPic },
    { name: "201 教室", type: "電腦教室", capacity: 20, imageUrl: unknownPic },
    { name: "202 教室", type: "自習教室", capacity: 30, imageUrl: unknownPic },
    { name: "203 教室", type: "電腦教室", capacity: 40, imageUrl: unknownPic },
    { name: "303 教室", type: "普通教室", capacity: 50, imageUrl: unknownPic },

  ];

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <img src={logo} alt="Logo" className="homepage-logo" />
        <button className="login-button">登入</button>
      </header>

      <main className="homepage-content">
        <h1>教室總覽</h1>
        <div className="classroom-grid">
          {classrooms.map((c, i) => (
            <div key={i} onClick={() => setSelectedClassroom(c)}>
              <ClassroomCard name={c.name} imageUrl={c.imageUrl} />
            </div>
          ))}
        </div>
      </main>

      {/* 彈跳式視窗 */}
      {selectedClassroom && (
        <div className="modal-overlay" onClick={() => setSelectedClassroom(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedClassroom(null)}
            >
              ×
            </button>

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

            {/* 預留之後要寫的申請部分 */}
            <div className="modal-bottom">
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
