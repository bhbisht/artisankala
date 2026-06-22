"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.style.backgroundColor = "#111827";
      document.body.style.color = "#ffffff";
    } else {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
      localStorage.setItem("theme", "light");
    } else {
      document.body.style.backgroundColor = "#111827";
      document.body.style.color = "#ffffff";
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded bg-blue-500 text-white"
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}