import { useCallback, useEffect, useState } from "react"

const THEME_KEY = "theme"

export type Theme = "light" | "dark"

function getInitialTheme(): Theme {
  if (typeof document === "undefined") {
    return "dark"
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"))
  }, [])

  return { theme, toggleTheme }
}
