"use client";

import { useCallback } from "react";

/**
 * Toggle pill — états reproduits depuis les screenshots :
 *   - idle (off)   : fond navy sombre, knob blanc à gauche
 *   - hover        : léger scale 1.04 + halo blanc subtil (cf. CSS)
 *   - active/press : scale 0.96 + knob squish horizontal (cf. CSS)
 *   - on           : fond cyan gradient + glow + knob à droite
 *
 * Le composant est entièrement contrôlé (on, onChange). L'attribut data-on
 * sert de hook pour les styles CSS (au lieu d'une classe, ça reste lisible
 * dans le DOM inspector).
 */
export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  const handleClick = useCallback(() => onChange(!on), [on, onChange]);
  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onChange(!on);
      }
    },
    [on, onChange],
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`${label} : ${on ? "activé" : "désactivé"}`}
      data-on={on}
      onClick={handleClick}
      onKeyDown={handleKey}
      className="toggle"
    >
      <span className="toggle-knob" aria-hidden />
    </button>
  );
}
