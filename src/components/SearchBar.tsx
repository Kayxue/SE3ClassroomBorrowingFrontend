import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch }: { onSearch: Function }) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [startHour, setStartHour] = useState("07:00");
  const [endHour, setEndHour] = useState("08:00");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const allowedStartHours = Array.from({ length: 15 }).map((_, i) =>
    (7 + i).toString().padStart(2, "0")
  );
  const allowedEndHours = Array.from({ length: 15 }).map((_, i) =>
    (8 + i).toString().padStart(2, "0")
  );
  const typeOptions = ["普通教室", "電腦教室", "演講廳"];
  const capacityOptions = ["20", "30", "40", "50", "60", "60以上"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      date,
      startHour,
      endHour,
      type,
      capacity,
      onlyAvailable,
    });
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>日期：</label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>開始時間：</label>
        <select
          value={startHour}
          onChange={(e) => {
            const newStart = e.target.value;
            setStartHour(newStart);
            if (endHour < newStart) setEndHour(newStart);
          }}
        >
          {allowedStartHours.map((hour) => (
            <option key={hour} value={`${hour}:00`}>
              {hour}:00
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>結束時間：</label>
        <select
          value={endHour}
          onChange={(e) => {
            const newEnd = e.target.value;
            if (newEnd < startHour) {
              setEndHour(startHour);
            } else {
              setEndHour(newEnd);
            }
          }}
        >
          {allowedEndHours.map((hour) => {
            const value = `${hour}:00`;
            const disabled = Number(hour) <= Number(startHour.split(":")[0]);
            return (
              <option key={hour} value={value} disabled={disabled}>
                {hour}:00
              </option>
            );
          })}
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
