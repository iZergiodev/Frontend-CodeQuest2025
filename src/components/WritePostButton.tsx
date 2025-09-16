// components/WritePostButton.tsx
import { PenTool, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type WritePostButtonProps = {
  to?: string;
  className?: string;
  icon?: "pen" | "plus";
};

export default function WritePostButton({ to = "/create-post", className, icon = "plus" }: WritePostButtonProps) {
  const navigate = useNavigate();
  const Icon = icon === "plus" ? Plus : PenTool;

  return (
    <>
      {/* Desktop */}
      <Button
        onClick={() => navigate(to)}
        variant="outline"
        className={cn(
          "hidden md:inline-flex items-center gap-2 rounded-full h-10 px-4",
          className
        )}
      >
        <Icon className="h-4 w-4" />
        Escribir Post
      </Button>

      {/* Mobile */}
      <Button
        onClick={() => navigate(to)}
        variant="outline"
        size="icon"
        aria-label="Escribir Post"
        className={cn(
          "md:hidden rounded-full h-10 w-10",
        )}
      >
        <Icon className="h-4 w-4" />
      </Button>
    </>
  );
}
