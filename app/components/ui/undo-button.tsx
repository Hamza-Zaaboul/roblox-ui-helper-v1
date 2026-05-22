"use client";

import { UndoIcon } from "./icons";

/**
 * Bouton "undo" qui apparaît à côté d'un contrôle dès que sa valeur diffère
 * de sa valeur par défaut. La transition d'apparition est gérée par la
 * classe `.is-visible` (cf. globals.css) — opacité + translation + scale.
 */
export function UndoButton({
  visible,
  onClick,
  label,
}: {
  visible: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={`Réinitialiser ${label}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={`undo-btn ${visible ? "is-visible" : ""}`}
    >
      <UndoIcon />
    </button>
  );
}
