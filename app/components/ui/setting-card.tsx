"use client";

import { useEffect, useState } from "react";
import { UndoButton } from "./undo-button";

/**
 * Carte d'un réglage (titre + sous-titre à gauche, contrôle + undo à droite).
 *
 * Gère 3 états visuels :
 *   - idle : carte navy avec bord subtil
 *   - hover : bord cyan léger
 *   - is-modified : bord cyan permanent quand la valeur diffère du défaut
 *   - is-flashing : flash cyan bref au moment où l'utilisateur change la valeur
 *
 * Le flash est déclenché par la prop `flashKey` (un nombre qui s'incrémente
 * côté parent à chaque changement). On le retire automatiquement après
 * l'animation pour pouvoir le redéclencher.
 */
export function SettingCard({
  title,
  description,
  modified,
  flashKey = 0,
  onUndo,
  children,
}: {
  title: string;
  description?: string;
  modified: boolean;
  flashKey?: number;
  onUndo: () => void;
  children: React.ReactNode;
}) {
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (flashKey === 0) return;
    setFlashing(true);
    const t = setTimeout(() => setFlashing(false), 420);
    return () => clearTimeout(t);
  }, [flashKey]);

  return (
    <div
      className={[
        "setting-card",
        modified ? "is-modified" : "",
        flashing ? "is-flashing" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex-1 min-w-0">
        <div className="setting-title">{title}</div>
        {description && <div className="setting-sub">{description}</div>}
      </div>

      <UndoButton visible={modified} onClick={onUndo} label={title} />

      {children}
    </div>
  );
}
