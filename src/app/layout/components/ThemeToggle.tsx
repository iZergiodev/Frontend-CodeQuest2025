import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 transition-transform hover:scale-110 rounded-xl"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-yellow-500 transition-colors" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-colors" />
      )}
    </Button>
  );
};

export default ThemeToggle;