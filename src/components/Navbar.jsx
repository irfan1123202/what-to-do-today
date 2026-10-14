import React from "react";
import { playClickSound } from "../utils/sound.js";
import { ELEGANT_THEMES } from "../constants/themes.js";

export default function Navbar({ currentTheme, onSelectTheme, soundOn, onToggleSound, tasksLeft, totalTasks }) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="app-header">
      {/* Top Brand Bar */}
      <div className="header-top">
        {/* Brand Group */}
        <div className="brand-group">
          <div className="logo-badge-luxury">
            <span className="logo-emoji">😎</span>
            <div className="gold-aura-ring"></div>
          </div>
          <div className="title-area">
            <h1 className="main-title">
              <span className="brand-prefix">Do Your Work</span>
              <span className="brand-accent">By Me</span>
              <span className="cool-emoji-bounce">😎</span>
            </h1>
            <p className="subtitle">
              <span className="calendar-tag">📅 {currentDate}</span>
              <span className="dot-divider">•</span>
              <span className="tasks-status-text">
                {tasksLeft === 0 && totalTasks > 0
                  ? "All missions achieved! 🏆"
                  : `${tasksLeft} mission${tasksLeft === 1 ? "" : "s"} remaining`}
              </span>
            </p>
          </div>
        </div>

        {/* Audio Toggle Action Button */}
        <div className="header-actions">
          <button
            className={`action-pill-btn ${soundOn ? "active" : ""}`}
            onClick={() => {
              playClickSound();
              onToggleSound();
            }}
            title={soundOn ? "Mute luxury sound effects" : "Enable luxury sound effects"}
            aria-label="Toggle sound"
          >
            {soundOn ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            )}
            <span className="action-label">{soundOn ? "Audio On" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* Prominent Always-Visible Theme Changing Bar */}
      <div className="theme-changing-bar" role="region" aria-label="Theme selector bar">
        <div className="theme-bar-inner">
          <span className="theme-bar-label">
            <span className="theme-bar-icon">🎨</span>
            <span>Themes:</span>
          </span>
          <div className="theme-bar-pills">
            {ELEGANT_THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  type="button"
                  key={theme.id}
                  className={`theme-pill-chip ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    playClickSound();
                    onSelectTheme(theme.id);
                  }}
                  title={theme.desc}
                  aria-pressed={isSelected}
                >
                  <span
                    className="theme-chip-dot"
                    style={{ backgroundColor: theme.color, boxShadow: `0 0 8px ${theme.color}` }}
                  ></span>
                  <span className="theme-chip-icon">{theme.icon}</span>
                  <span className="theme-chip-name">{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
