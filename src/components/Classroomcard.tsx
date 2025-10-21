import React from "react";
import "./ClassroomCard.css";
import unknownPic from "../assets/unknowpic.jpg"; 

type ClassroomCardProps = {
  name: string;
  imageUrl?: string;
};

export default function ClassroomCard({ name, imageUrl }: ClassroomCardProps) {
  return (
    <div className="classroom-card">
      <div className="classroom-image">
        <img
          src={imageUrl || unknownPic}
          alt={name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = unknownPic; 
          }}
        />
      </div>
      <div className="classroom-name">{name}</div>
    </div>
  );
}
