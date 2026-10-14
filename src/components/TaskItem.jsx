import React, { useState } from "react";
import { playCompleteSound, playDeleteSound, playClickSound } from "../utils/sound.js";
import { triggerConfetti } from "../utils/confetti.js";

const CATEGORY_ICONS = {
  Executive: "💼",
  Finance: "💎",
  Personal: "👤",
  Urgent: "⚡",
  Wellness: "🌿",
  Work: "💼",
  Study: "📚",
  Health: "🌱",
};

export default function TaskItem({ task, onToggle, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.title);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (!task.done) {
      triggerConfetti(x, y);
      playCompleteSound();
    } else {
      playClickSound();
    }
    onToggle(task.id);
  };

  const handleStartEdit = () => {
    playClickSound();
    setText(task.title);
    setEditing(true);
  };

  const save = () => {
    if (!text.trim()) return;
    playClickSound();
    onSave(task.id, text.trim());
    setEditing(false);
  };

  const cancel = () => {
    playClickSound();
    setText(task.title);
    setEditing(false);
  };

  const handleDelete = () => {
    playDeleteSound();
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 250);
  };

  // Compute due date badge info
  const getDueBadge = (dueDateStr) => {
    if (!dueDateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueParts = dueDateStr.split("-");
    if (dueParts.length !== 3) return { text: dueDateStr, type: "normal" };

    const dueDate = new Date(dueParts[0], dueParts[1] - 1, dueParts[2]);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, type: "overdue" };
    } else if (diffDays === 0) {
      return { text: "Due Today", type: "today" };
    } else if (diffDays === 1) {
      return { text: "Due Tomorrow", type: "tomorrow" };
    } else {
      return {
        text: dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        type: "upcoming",
      };
    }
  };

  const dueBadge = getDueBadge(task.due);

  return (
    <div
      className={`task-card priority-border-${(task.priority || "medium").toLowerCase()} ${
        task.done ? "task-completed" : ""
      } ${isDeleting ? "task-deleting" : ""}`}
    >
      {/* Custom Animated Checkbox */}
      <button
        type="button"
        className={`custom-checkbox ${task.done ? "checked" : ""}`}
        onClick={handleToggle}
        aria-label={task.done ? "Mark as active" : "Mark as completed"}
      >
        <svg
          className="checkmark-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>

      {/* Main Content Area */}
      <div className="task-content-body">
        {editing ? (
          <div className="task-edit-inline">
            <input
              type="text"
              className="task-edit-input"
              value={text}
              autoFocus
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") cancel();
              }}
            />
            <div className="task-edit-actions">
              <button type="button" className="action-btn save-btn" onClick={save} title="Save (Enter)">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Save</span>
              </button>
              <button type="button" className="action-btn cancel-btn" onClick={cancel} title="Cancel (Esc)">
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="task-title-row">
              <span className="task-title-text" onClick={handleToggle}>
                {task.title}
              </span>
            </div>

            {/* Badges / Metadata row */}
            <div className="task-meta-row">
              {/* Category pill */}
              {task.category && (
                <span className="meta-category-pill">
                  <span className="cat-emoji">{CATEGORY_ICONS[task.category] || "🏷️"}</span>
                  <span>{task.category}</span>
                </span>
              )}

              {/* Priority pill */}
              <span className={`meta-priority-pill priority-${(task.priority || "medium").toLowerCase()}`}>
                <span className="priority-pulse-dot"></span>
                <span>{task.priority || "Medium"}</span>
              </span>

              {/* Due Date badge */}
              {dueBadge && (
                <span className={`meta-due-badge due-${dueBadge.type}`}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{dueBadge.text}</span>
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Card Action Buttons (Edit / Delete) */}
      {!editing && (
        <div className="task-actions-group">
          <button
            type="button"
            className="icon-action-btn edit-icon-btn"
            onClick={handleStartEdit}
            title="Edit mission"
            aria-label="Edit mission"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button
            type="button"
            className="icon-action-btn delete-icon-btn"
            onClick={handleDelete}
            title="Delete mission"
            aria-label="Delete mission"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
