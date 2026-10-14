import React from "react";
import { playClickSound } from "../utils/sound.js";

const CATEGORIES = ["All", "Executive", "Finance", "Personal", "Urgent", "Wellness"];

export default function FilterBar({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  tasks,
  onClearDone,
}) {
  const allCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.done).length;
  const doneCount = tasks.filter((t) => t.done).length;
  const urgentCount = tasks.filter((t) => !t.done && t.priority === "High").length;

  const tabs = [
    { id: "All", label: "All Missions", count: allCount },
    { id: "Active", label: "Active", count: activeCount },
    { id: "Done", label: "Achieved", count: doneCount },
    { id: "Urgent", label: "High Priority", count: urgentCount },
  ];

  return (
    <div className="filter-controls-container">
      {/* Search and Sort row */}
      <div className="search-sort-bar">
        <div className="search-box-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search missions by keyword, tag or priority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="sort-box-wrapper">
          <span className="sort-label">Sort:</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="due">Target Deadline</option>
          </select>
        </div>
      </div>

      {/* Status tabs & Clear button */}
      <div className="tabs-header-row">
        <div className="tab-pill-group">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${filter === tab.id ? "active" : ""}`}
              onClick={() => {
                playClickSound();
                setFilter(tab.id);
              }}
            >
              <span>{tab.label}</span>
              <span className="tab-count-badge">{tab.count}</span>
            </button>
          ))}
        </div>

        {doneCount > 0 && (
          <button
            className="clear-done-btn"
            onClick={() => {
              playClickSound();
              onClearDone();
            }}
            title="Purge achieved missions"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Clear Done ({doneCount})</span>
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="category-filter-bar">
        <span className="cat-filter-label">Filter:</span>
        <div className="cat-filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill-btn ${selectedCategory === cat ? "selected" : ""}`}
              onClick={() => {
                playClickSound();
                setSelectedCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
