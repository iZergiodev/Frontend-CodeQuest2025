import { useEffect, useRef } from "react";
import DEVI_hero from "@/assets/DEVI_hero.svg?raw";
import DEVI_laptop from "@/assets/DEVI_laptop.svg?raw";

interface AnimatedSVGProps {
  svg: string;
}

const SVGs = {
  hero: DEVI_hero,
  laptop: DEVI_laptop,
}

export default function AnimatedSVG({ svg }: AnimatedSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = SVGs[svg];
    
      const script = containerRef.current.querySelector('script');
      if (script) {
        const scriptContent = script.textContent || script.innerHTML;
        if (scriptContent) {
          const newScript = document.createElement('script');
          newScript.textContent = scriptContent;
          document.head.appendChild(newScript);
        }
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
    />
  );
}
