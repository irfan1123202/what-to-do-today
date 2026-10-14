import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar.jsx";
import StatsBar from "./components/StatsBar.jsx";
import TaskForm from "./components/TaskForm.jsx";
import FilterBar from "./components/FilterBar.jsx";
import TaskItem from "./components/TaskItem.jsx";
import EmptyState from "./components/EmptyState.jsx";
import { isSoundEnabled, setSoundEnabled } from "./utils/sound.js";
import { triggerConfetti } from "./utils/confetti.js";

const TASKS_KEY = "do-your-work-tasks-v2";
const THEME_KEY = "do-your-work-theme";

const DEFAULT_SAMPLE_TASKS = [
  {
    id: 1,
    title: "Finalize high-profile executive presentation",
    priority: "High",
    category: "Work",
    due: new Date().toISOString().split("T")[0],
    done: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Coordinate luxury brand campaign launch",
    priority: "Medium",
    category: "Work",
    due: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    done: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Review investment portfolio & real estate assets",
    priority: "High",
    category: "Personal",
    due: "",
    done: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "1-hour deep focus meditation & athletic training",
    priority: "Low",
    category: "Health",
    due: "",
    done: false,
    createdAt: new Date().toISOString(),
  },
];

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) return JSON.parse(raw);
    return DEFAULT_SAMPLE_TASKS;
  } catch {
    return DEFAULT_SAMPLE_TASKS;
  }
}

function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved && ["gold", "sapphire", "emerald", "rosegold", "pearl"].includes(saved)) {
      return saved;
    }
    return "gold"; // Default to Champagne Gold Luxury
  } catch {
    return "gold";
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [theme, setTheme] = useState(loadTheme);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);

  // Sync tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // Sync theme to DOM & localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  // Interactive subtle cursor spotlight tracking
  const handleMouseMove = (e) => {
    document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);
  };

  const selectTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const addTask = (task) => {
    setTasks([task, ...tasks]);
  };

  const toggleTask = (id) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      const total = next.length;
      const completed = next.filter((t) => t.done).length;
      if (total >= 2 && completed === total) {
        setTimeout(() => {
          triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.35);
        }, 150);
      }
      return next;
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const editTask = (id, title) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title } : t)));
  };

  const clearDone = () => {
    setTasks(tasks.filter((t) => !t.done));
  };

  const resetFilters = () => {
    setFilter("All");
    setSelectedCategory("All");
    setSearchQuery("");
  };

  // Filter & sort logic
  const visibleTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === "Active") return !t.done;
        if (filter === "Done") return t.done;
        if (filter === "Urgent") return !t.done && t.priority === "High";
        return true;
      })
      .filter((t) => {
        if (selectedCategory === "All") return true;
        return t.category === selectedCategory;
      })
      .filter((t) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q)) ||
          (t.priority && t.priority.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest") return (b.id || 0) - (a.id || 0);
        if (sortBy === "oldest") return (a.id || 0) - (b.id || 0);
        if (sortBy === "priority") {
          const rank = { High: 3, Medium: 2, Low: 1 };
          return (rank[b.priority] || 0) - (rank[a.priority] || 0);
        }
        if (sortBy === "due") {
          if (!a.due) return 1;
          if (!b.due) return -1;
          return new Date(a.due) - new Date(b.due);
        }
        return 0;
      });
  }, [tasks, filter, selectedCategory, searchQuery, sortBy]);

  const tasksLeft = tasks.filter((t) => !t.done).length;
  const isFiltered = filter !== "All" || selectedCategory !== "All" || searchQuery.trim() !== "";

  return (
    <div className={`app-canvas theme-${theme}`} onMouseMove={handleMouseMove}>
      {/* Interactive Cursor Ambient Glow Spotlight */}
      <div className="cursor-spotlight"></div>

      {/* Ambient Animated Luxury Orbs & Golden Tech Grid */}
      <div className="ambient-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      <main className="app-container">
        {/* Navbar with brand 'Do Your Work By Me 😎' and interactive Theme Picker */}
        <Navbar
          currentTheme={theme}
          onSelectTheme={selectTheme}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          tasksLeft={tasksLeft}
          totalTasks={tasks.length}
        />

        {/* Dynamic Luxury Stats Bar */}
        <StatsBar tasks={tasks} />

        {/* Task Creation Form */}
        <TaskForm onAdd={addTask} />

        {/* Search, Filter Tabs & Sort Controls */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          tasks={tasks}
          onClearDone={clearDone}
        />

        {/* Task Cards Grid */}
        <div className="task-list-section">
          {visibleTasks.length === 0 ? (
            <EmptyState isFiltered={isFiltered} onResetFilter={resetFilters} />
          ) : (
            <div className="task-cards-grid">
              {visibleTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onSave={editTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Elegant Footer */}
        <footer className="app-footer">
          <p>
            <strong>Do Your Work By Me 😎</strong> • Built for high-achievers & refined workflows •{" "}
            <span className="keyboard-tip">Press <kbd>Enter</kbd> to add</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
