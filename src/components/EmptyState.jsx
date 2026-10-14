import React from "react";

export default function EmptyState({ isFiltered, onResetFilter }) {
  return (
    <div className="empty-state-card">
      <div className="empty-graphic-wrapper">
        <div className="empty-glow-ring"></div>
        <div className="floating-illustration">
          <span className="executive-badge-icon">👑</span>
        </div>
      </div>

      <h3 className="empty-title">
        {isFiltered ? "No matching missions found" : "Your docket is completely clear 😎"}
      </h3>
      <p className="empty-desc">
        {isFiltered
          ? "Try adjusting your search criteria or filters to locate what you're seeking."
          : "Add your next mission above or celebrate a completely conquered agenda! ✨"}
      </p>

      {isFiltered && (
        <button type="button" className="reset-filter-btn" onClick={onResetFilter}>
          Clear All Filters
        </button>
      )}
    </div>
  );
}
