"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Slider horizontal — cf. screenshot 4 ("Angle de vision", "Décalage latéral").
 *
 * Comportement :
 *   - track plat (navy) + fill cyan à gauche
 *   - handle blanc, scale au hover, scale + halo au drag
 *   - valeur numérique à droite, tabular-nums pour pas qu'elle saute
 *   - drag souris/clavier supporté
 *
 * Implémenté à la main (pas de <input type="range">) pour avoir le contrôle
 * fin sur les états visuels et le styling.
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const pct = ((value - min) / (max - min)) * 100;

  /** Calcule la valeur snappée au step pour un clientX donné. */
  const valueFromClientX = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      const snapped = Math.round(raw / step) * step;
      return Math.min(max, Math.max(min, snapped));
    },
    [min, max, step, value],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setDragging(true);
      onChange(valueFromClientX(e.clientX));
    },
    [onChange, valueFromClientX],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      onChange(valueFromClientX(e.clientX));
    },
    [dragging, onChange, valueFromClientX],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  // Clavier : flèches +/- step, Home/End = bornes.
  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let next = value;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") next = value + step;
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = value - step;
      else if (e.key === "Home") next = min;
      else if (e.key === "End") next = max;
      else if (e.key === "PageUp") next = value + step * 10;
      else if (e.key === "PageDown") next = value - step * 10;
      else return;
      e.preventDefault();
      onChange(Math.min(max, Math.max(min, next)));
    },
    [value, min, max, step, onChange],
  );

  // Cleanup : si l'utilisateur relâche en dehors, on coupe quand même.
  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [dragging]);

  return (
    <div className="flex flex-1 items-center gap-3">
      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        className={`slider ${dragging ? "is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKey}
      >
        <div className="slider-track">
          <div className="slider-fill" style={{ width: `${pct}%` }} />
          <div className="slider-handle" style={{ left: `${pct}%` }} />
        </div>
      </div>
      <span className="slider-value">{value}</span>
    </div>
  );
}
