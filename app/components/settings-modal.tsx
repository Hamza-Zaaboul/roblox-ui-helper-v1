"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CloseIcon } from "./ui/icons";
import { SectionLabel } from "./ui/section-label";
import { SettingCard } from "./ui/setting-card";
import { Slider } from "./ui/slider";
import { Toggle } from "./ui/toggle";

/**
 * Schéma des réglages : on déclare une fois la liste, ses sections, ses
 * valeurs par défaut, et le state se construit tout seul. Ça permet de
 * détecter facilement les "modifié" (valeur actuelle ≠ défaut) sans
 * dupliquer la liste.
 *
 * Reproduit fidèlement les 4 screenshots :
 *   Graphiques  → Mode de performance (toggle)
 *   Jouabilité  → Exécution automatique (toggle), Restreindre invitations (toggle)
 *   Caméra      → Masquer obstacles (toggle), Angle de vision (slider 42),
 *                 Décalage latéral (slider 50)
 *   Effets      → Vibrations de l'écran (toggle)
 */

type BoolSetting = {
  kind: "toggle";
  id: string;
  title: string;
  description?: string;
  defaultValue: boolean;
};
type NumberSetting = {
  kind: "slider";
  id: string;
  title: string;
  description?: string;
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
};
type Setting = BoolSetting | NumberSetting;

type Section = { id: string; label: string; items: Setting[] };

const SECTIONS: Section[] = [
  {
    id: "graphics",
    label: "Graphiques",
    items: [
      {
        kind: "toggle",
        id: "performance",
        title: "Mode de performance",
        description: "Réduire la qualité visuelle",
        defaultValue: false,
      },
    ],
  },
  {
    id: "gameplay",
    label: "Jouabilité",
    items: [
      {
        kind: "toggle",
        id: "autorun",
        title: "Exécution automatique",
        description: "Courir automatiquement en permanence",
        defaultValue: false,
      },
      {
        kind: "toggle",
        id: "restrictInvites",
        title: "Restreindre les invitations de groupe",
        description: "Ne laissez que les amis vous inviter",
        defaultValue: false,
      },
    ],
  },
  {
    id: "camera",
    label: "Caméra",
    items: [
      {
        kind: "toggle",
        id: "hideObstacles",
        title: "Masquer les obstacles de vision",
        description: "Masquer les grands accessoires dans votre champ de vision",
        defaultValue: true,
      },
      {
        kind: "slider",
        id: "fov",
        title: "Angle de vision de la caméra",
        description: "Zoomer ou dézoomer",
        defaultValue: 42,
        min: 0,
        max: 100,
      },
      {
        kind: "slider",
        id: "cameraOffset",
        title: "Décalage latéral de la caméra",
        description: "Déplacer à gauche ou à droite",
        defaultValue: 50,
        min: 0,
        max: 100,
      },
    ],
  },
  {
    id: "effects",
    label: "Effets",
    items: [
      {
        kind: "toggle",
        id: "screenShake",
        title: "Vibrations de l'écran",
        description: "Activer les secousses lors des impacts",
        defaultValue: false,
      },
    ],
  },
];

type SettingsState = Record<string, boolean | number>;

function buildDefaults(): SettingsState {
  const out: SettingsState = {};
  for (const s of SECTIONS) for (const it of s.items) out[it.id] = it.defaultValue;
  return out;
}

export function SettingsModal({ onClose }: { onClose?: () => void }) {
  const defaults = useMemo(() => buildDefaults(), []);
  const [state, setState] = useState<SettingsState>(defaults);
  const [flashKeys, setFlashKeys] = useState<Record<string, number>>({});
  const flashCounter = useRef(0);

  const updateValue = useCallback((id: string, next: boolean | number) => {
    setState((s) => ({ ...s, [id]: next }));
    flashCounter.current += 1;
    const fc = flashCounter.current;
    setFlashKeys((k) => ({ ...k, [id]: fc }));
  }, []);

  const resetOne = useCallback(
    (id: string) => {
      setState((s) => ({ ...s, [id]: defaults[id] }));
    },
    [defaults],
  );

  // Échap pour fermer.
  useEffect(() => {
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal animate-modal-in w-[min(34rem,92vw)] p-6 sm:p-7">
      {/* En-tête : titre + bouton close */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-[1.75rem] font-extrabold tracking-tight leading-none">
          Paramètres
        </h1>
        <button
          type="button"
          aria-label="Fermer les paramètres"
          onClick={onClose}
          className="modal-close"
        >
          <CloseIcon size={14} />
        </button>
      </div>

      {/* Divider sous le titre */}
      <div className="modal-divider mt-5" />

      {/* Liste scrollable des sections */}
      <div
        className="mt-5 flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#1c2a3e transparent" }}
      >
        {SECTIONS.map((section) => (
          <section key={section.id} className="flex flex-col gap-2.5">
            <SectionLabel>{section.label}</SectionLabel>

            <div className="flex flex-col gap-2.5">
              {section.items.map((item) => {
                const current = state[item.id];
                const modified = current !== item.defaultValue;
                const flashKey = flashKeys[item.id] ?? 0;

                return (
                  <SettingCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    modified={modified}
                    flashKey={flashKey}
                    onUndo={() => resetOne(item.id)}
                  >
                    {item.kind === "toggle" ? (
                      <Toggle
                        on={current as boolean}
                        label={item.title}
                        onChange={(next) => updateValue(item.id, next)}
                      />
                    ) : (
                      <Slider
                        value={current as number}
                        label={item.title}
                        min={item.min}
                        max={item.max}
                        step={item.step ?? 1}
                        onChange={(next) => updateValue(item.id, next)}
                      />
                    )}
                  </SettingCard>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
