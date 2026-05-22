"use client";

import { useEffect, useRef } from "react";
import { UndoButton } from "./undo-button";

/**
 * Carte d'un réglage (titre + sous-titre à gauche, contrôle + undo à droite).
 *
 * Gère 3 états visuels :
 *   - idle : carte navy avec bord subtil
 *   - hover : bord cyan léger (cf. globals.css)
 *   - is-modified : bord cyan permanent quand la valeur diffère du défaut
 *   - is-flashing : flash cyan bref au moment où l'utilisateur change la valeur
 *
 * Le flash est déclenché par la prop `flashKey` (un nombre qui s'incrémente
 * côté parent à chaque changement). On manipule la classe directement sur le
 * DOM via une ref pour éviter un re-render React inutile — la classe est
 * traitée comme un effet externe (synchronisation DOM), ce qui colle aux
 * recommandations React 19 (pas de setState dans un effect).
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flashKey === 0) return;
    const el = ref.current;
    if (!el) return;
    // Retire la classe d'abord pour pouvoir relancer l'animation même
    // si la précédente n'est pas finie (sinon le navigateur l'ignore).
    el.classList.remove("is-flashing");
    // Force un reflow pour redémarrer proprement l'animation CSS.
    void el.offsetWidth;
    el.classList.add("is-flashing");
    const t = window.setTimeout(() => {
      el.classList.remove("is-flashing");
    }, 420);
    return () => window.clearTimeout(t);
  }, [flashKey]);

  return (
    <div
      ref={ref}
      className={["setting-card", modified ? "is-modified" : ""].filter(Boolean).join(" ")}
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
