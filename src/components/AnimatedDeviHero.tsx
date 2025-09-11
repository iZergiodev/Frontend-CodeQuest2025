import { useEffect, useRef } from "react";
import DEVIHERO from "@/assets/DEVI_hero.svg?raw";

export default function AnimatedDev() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = DEVIHERO;
    
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
