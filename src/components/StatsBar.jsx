import React from "react";

export default function StatsBar({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const highCount = tasks.filter((t) => !t.done && t.priority === "High").length;

  let badgeText = "Ready for Action 🎯";
  let badgeClass = "badge-neutral";
  if (total > 0 && percent === 100) {
    badgeText = "Mastermind Status 😎👑";
    badgeClass = "badge-luxury";
  } else if (percent >= 66) {
    badgeText = "Executive Flow ⚡";
    badgeClass = "badge-accent";
  } else if (percent >= 33) {
    badgeText = "Gaining Momentum ✨";
    badgeClass = "badge-warning";
  }

  return (
    <div className="stats-glass-card">
      <div className="stats-row">
        <div className="stat-metric">
          <span className="metric-label">Execution Rate</span>
          <div className="metric-value-wrap">
            <span className="metric-value">{percent}%</span>
            <span className={`status-badge ${badgeClass}`}>{badgeText}</span>
          </div>
        </div>

        <div className="stat-summary-pills">
          <div className="pill-item" title="Total Missions">
            <span className="pill-number">{total}</span>
            <span className="pill-title">Missions</span>
          </div>
          <div className="pill-item pill-done" title="Achieved">
            <span className="pill-number">{completed}</span>
            <span className="pill-title">Achieved</span>
          </div>
          <div className="pill-item pill-active" title="Pending">
            <span className="pill-number">{pending}</span>
            <span className="pill-title">Active</span>
          </div>
          {highCount > 0 && (
            <div className="pill-item pill-high" title="Urgent High Priority">
              <span className="pill-number">{highCount}</span>
              <span className="pill-title">High Priority</span>
            </div>
          )}
        </div>
      </div>

      {/* Elegant Progress Track */}
      <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        >
          {percent > 5 && <div className="progress-glow"></div>}
        </div>
      </div>
    </div>
  );
}
