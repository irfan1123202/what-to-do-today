import React, { useState } from "react";
import { playAddSound } from "../utils/sound.js";

const CATEGORIES = [
  { id: "Executive", label: "Executive", icon: "💼" },
  { id: "Finance", label: "Finance", icon: "💎" },
  { id: "Personal", label: "Personal", icon: "👤" },
  { id: "Urgent", label: "Urgent", icon: "⚡" },
  { id: "Wellness", label: "Wellness", icon: "🌿" },
];

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Executive");
  const [due, setDue] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [error, setError] = useState("");

  const handleShortcutDue = (type) => {
    const today = new Date();
    if (type === "today") {
      setDue(today.toISOString().split("T")[0]);
    } else if (type === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDue(tomorrow.toISOString().split("T")[0]);
    }
  };

  const submit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError("Please describe the mission to conquer!");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    onAdd({
      id: Date.now(),
      title: title.trim(),
      priority,
      category,
      due,
      done: false,
      createdAt: new Date().toISOString(),
    });

    playAddSound();
    setTitle("");
    setDue("");
    setError("");
  };

  return (
    <form className={`form-container ${isShaking ? "shake" : ""}`} onSubmit={submit}>
      <div className="input-group-main">
        <div className="input-field-wrapper">
          <span className="input-leading-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <input
            id="task-input-title"
            className="main-task-input"
            type="text"
            placeholder="Assign your next mission (e.g., Close investment round, Review designs)..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
          />
        </div>

        <button type="submit" className="add-task-btn" id="btn-add-task">
          <svg className="btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add Mission 😎</span>
        </button>
      </div>

      {error && <div className="form-error-msg">{error}</div>}

      <div className="form-options-row">
        {/* Priority Selector Pills */}
        <div className="option-group">
          <span className="option-label">Priority Tier</span>
          <div className="pill-selector">
            {["Low", "Medium", "High"].map((p) => (
              <button
                type="button"
                key={p}
                className={`priority-chip ${p.toLowerCase()} ${priority === p ? "selected" : ""}`}
                onClick={() => setPriority(p)}
              >
                <span className="chip-dot"></span>
                <span>{p}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Selector Chips */}
        <div className="option-group">
          <span className="option-label">Classification</span>
          <div className="category-scroll-pills">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                className={`category-chip ${category === cat.id ? "selected" : ""}`}
                onClick={() => setCategory(cat.id)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-text">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Due Date with shortcuts */}
        <div className="option-group date-group">
          <span className="option-label">Target Deadline</span>
          <div className="date-input-wrap">
            <input
              type="date"
              className="styled-date-input"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              title="Select deadline date"
            />
            <div className="quick-date-buttons">
              <button
                type="button"
                className={`quick-date-btn ${due === new Date().toISOString().split("T")[0] ? "active" : ""}`}
                onClick={() => handleShortcutDue("today")}
              >
                Today
              </button>
              <button
                type="button"
                className="quick-date-btn"
                onClick={() => handleShortcutDue("tomorrow")}
              >
                Tomorrow
              </button>
              {due && (
                <button
                  type="button"
                  className="quick-date-clear"
                  onClick={() => setDue("")}
                  title="Clear deadline"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
