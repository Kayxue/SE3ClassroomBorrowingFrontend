import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import ClassroomCard from "../components/Classroomcard";
import unknownPic from "../assets/unknowpic.jpg";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const classrooms = [
    { name: "103 教室", imageUrl: unknownPic },
    { name: "105 教室", imageUrl: unknownPic },
    { name: "202 教室", imageUrl: unknownPic },
    { name: "203 教室", imageUrl: unknownPic },
    { name: "303 教室", imageUrl: unknownPic },
    { name: "305 教室", imageUrl: unknownPic },
    { name: "401 教室", imageUrl: unknownPic },
    { name: "402 教室", imageUrl: unknownPic },
  ];

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <img src={logo} alt="Logo" className="homepage-logo" />
        <button
          className="login-button"
          onClick={() => navigate("/")}
        >
          登入
        </button>
      </header>

      <main className="homepage-content">
        <div className="classroom-grid">
          {classrooms.map((c, index) => (
            <ClassroomCard key={index} name={c.name} imageUrl={c.imageUrl} />
          ))}
        </div>
      </main>
    </div>
  );
}
