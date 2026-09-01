"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : systemDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", nextTheme);
    setTheme(nextTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [mounted, theme]);

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg border px-3 py-2 text-sm font-medium"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
          color: "var(--foreground)",
        }}
      >
        Theme
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
      className="rounded-lg border px-3 py-2 text-sm font-medium transition"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
        color: "var(--foreground)",
      }}
    >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}
