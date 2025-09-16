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
          // base legible + hover con alto contraste usando tokens shadcn
          "border-muted-foreground/20 text-foreground/80",
          "hover:bg-accent hover:text-accent-foreground hover:border-transparent",
          "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
          "active:scale-95 transition-[background,color,border,transform] duration-150",
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
          "border-muted-foreground/20 text-foreground/80",
          "hover:bg-accent hover:text-accent-foreground hover:border-transparent",
          "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
          "active:scale-95 transition-[background,color,border,transform] duration-150"
        )}
      >
        <Icon className="h-4 w-4" />
      </Button>
    </>
  );
}
