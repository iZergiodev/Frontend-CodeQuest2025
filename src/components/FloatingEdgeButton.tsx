import React, { useEffect, useLayoutEffect } from "react";
import {
  useFloating,
  offset,
  shift,
  autoUpdate,
  Placement,
} from "@floating-ui/react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

type FloatingEdgeButtonProps = {

  referenceRef: React.RefObject<HTMLElement>;
  onClick?: () => void;
  topPx?: number;
  // separación horizontal respecto al borde del contenido.
  offsetMain?: number;
  className?: string;
  label?: string;
  hideBelow?: Breakpoint | null;
  //placement de Floating UI (por defecto "left-start") 
  placement?: Placement;
  //valor cualquiera para forzar recalcular posición si cambia (ej. isOpen del sidebar) 
  watch?: any;
  // contenido del botón (ej. ícono) 
  children?: React.ReactNode;
  paddingViewport?: number;
};

export function FloatingEdgeButton({
  referenceRef,
  onClick,
  topPx = 96,
  offsetMain = 12,
  className = "",
  label = "Volver",
  hideBelow = "lg",
  placement = "left-start",
  watch,
  children,
  paddingViewport = 8,
}: FloatingEdgeButtonProps) {
  const { refs, x, strategy, update } = useFloating({
    placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: offsetMain }),
      shift({ crossAxis: true, padding: paddingViewport }),
    ],
  });


  useLayoutEffect(() => {
   if (referenceRef.current) {
     refs.setReference(referenceRef.current);
     update();
   }}, [referenceRef, refs, update]);

  useEffect(() => {
    update();
  }, [watch, update]);


  const hiddenClass = hideBelow ? `hidden ${hideBelow}:inline-flex` : "";

  return (
    <button
      ref={refs.setFloating}
      onClick={onClick}
      aria-label={label}
      style={{
        position: strategy,
        left: x ?? 0,
        top: topPx,
      }}
      className={[
        hiddenClass,
        "h-9 w-9 inline-flex items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring z-40",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
