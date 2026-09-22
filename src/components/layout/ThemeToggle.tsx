import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "switch to dark mode" : "switch to light mode"}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-paper text-ink-soft transition-colors duration-fast ease-standard hover:text-ink hover:bg-cloud cursor-pointer"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
