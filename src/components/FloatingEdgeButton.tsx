import React, { useEffect } from "react";
import {
  useFloating,
  offset,
  shift,
  autoUpdate,
  Placement,
} from "@floating-ui/react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

type FloatingEdgeButtonProps = {
  /** Elemento de referencia (el contenedor del post) */
  referenceRef: React.RefObject<HTMLElement>;
  /** Acción al hacer click */
  onClick?: () => void;
  /** top fijo en px (no se mueve verticalmente al hacer scroll) */
  topPx?: number;
  /** separación horizontal respecto al borde del contenido.
   *  Para placement "left-*": positivo => más hacia la IZQUIERDA (fuera),
   *  negativo => hacia la DERECHA (dentro).
   */
  offsetMain?: number;
  /** clases extra para el botón */
  className?: string;
  /** aria-label accesible */
  label?: string;
  /** ocultar por debajo de un breakpoint (ej. "lg" = visible solo ≥ lg) */
  hideBelow?: Breakpoint | null;
  /** placement de Floating UI (por defecto "left-start") */
  placement?: Placement;
  /** valor cualquiera para forzar recalcular posición si cambia (ej. isOpen del sidebar) */
  watch?: any;
  /** contenido del botón (ej. ícono) */
  children?: React.ReactNode;
};

export function FloatingEdgeButton({
  referenceRef,
  onClick,
  topPx = 96,          // ≈ top-24
  offsetMain = 12,     // 12px hacia afuera a la izquierda (con left-start)
  className = "",
  label = "Volver",
  hideBelow = "lg",
  placement = "left-start",
  watch,
  children,
}: FloatingEdgeButtonProps) {
  const { refs, x, strategy, update } = useFloating({
    placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: offsetMain }),
      shift({ crossAxis: true, padding: 8 }),
    ],
  });

  // Conectamos el ref externo como "reference" para Floating UI
  useEffect(() => {
    if (referenceRef.current) {
      refs.setReference(referenceRef.current);
      update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceRef, refs, update]);

  // Reposicionar si cambia algo del layout (ej. sidebar abierto/cerrado)
  useEffect(() => {
    update();
  }, [watch, update]);

  const hiddenClass =
    hideBelow ? `hidden ${hideBelow}:grid` : ""; // p.ej. "hidden lg:grid"

  return (
    <button
      ref={refs.setFloating}
      onClick={onClick}
      aria-label={label}
      style={{
        position: strategy, // "fixed"
        left: x ?? 0,       // sigue el borde horizontal del contenido
        top: topPx,         // fijo vertical
      }}
      className={[
        hiddenClass,
        "h-9 w-9 place-items-center rounded-full border bg-background shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring z-40",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
