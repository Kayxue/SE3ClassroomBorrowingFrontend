import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch }: { onSearch: Function }) {
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ time, type, capacity, onlyAvailable });
  };

  const timeOptions = [
    "8:00~9:00", "9:00~10:00", "10:00~11:00", "11:00~12:00",
    "12:00~13:00", "13:00~14:00", "14:00~15:00", "15:00~16:00",
    "16:00~17:00", "17:00~18:00", "18:00~19:00", "19:00~20:00",
    "20:00~21:00", "21:00~22:00"
  ];

  const typeOptions = ["普通教室", "電腦教室", "演講廳"];
  const capacityOptions = ["20", "30", "40", "50", "60", "60以上"];

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>時段：</label>
        <select value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="">請選擇</option>
          {timeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>教室類別：</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">請選擇</option>
          {typeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>容納人數：</label>
        <select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
          <option value="">請選擇</option>
          {capacityOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          只顯示可借用教室
        </label>
      </div>

      <button type="submit" className="search-btn">查詢</button>
    </form>
  );
}
