"use client";

import { useState } from "react";

type Setting = {
  id: string;
  label: string;
  defaultOn: boolean;
};

const SETTINGS: Setting[] = [
  { id: "shadows", label: "Shadows", defaultOn: true },
  { id: "music", label: "Music", defaultOn: true },
  { id: "weather", label: "Weather", defaultOn: false },
  { id: "players", label: "Players", defaultOn: true },
  { id: "invites", label: "Invites", defaultOn: true },
];

export function SettingsPanel() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SETTINGS.map((s) => [s.id, s.defaultOn])),
  );

  return (
    <div className="panel animate-pop w-[20rem] px-5 pt-12 pb-6 sm:w-[22rem] sm:px-6 sm:pt-14">
      <div className="panel-header">
        <span className="chunky text-2xl text-[#cfe5ff] sm:text-3xl">
          Settings
        </span>
      </div>

      <button
        type="button"
        aria-label="Fermer"
        className="panel-close"
      >
        <CloseIcon />
      </button>

      <ul className="flex flex-col gap-3">
        {SETTINGS.map((item) => (
          <li key={item.id}>
            <div className="row">
              <span className="row-label chunky-sm text-base sm:text-lg">
                {item.label}
              </span>
              <Toggle
                on={state[item.id]}
                onToggle={() =>
                  setState((s) => ({ ...s, [item.id]: !s[item.id] }))
                }
                label={item.label}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Toggle ---------- */

function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`${label} ${on ? "activé" : "désactivé"}`}
      onClick={onToggle}
      className="
        relative h-9 w-16 shrink-0 rounded-full
        transition-[background] duration-200
        outline-none focus-visible:ring-4 focus-visible:ring-white/60
      "
      style={{
        background: on
          ? "linear-gradient(180deg, #8fe48f 0%, var(--color-on) 50%, var(--color-on-deep) 100%)"
          : "linear-gradient(180deg, #ff8e8e 0%, var(--color-off) 50%, var(--color-off-deep) 100%)",
        boxShadow:
          "inset 0 3px 0 rgba(255,255,255,0.5), inset 0 -3px 0 rgba(0,0,0,0.25), 0 0 0 3px #ffffff, 0 0 0 5px var(--color-stroke), 0 4px 0 -1px rgba(0,0,0,0.45)",
      }}
    >
      <span
        className="
          absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full
          transition-[left] duration-200 ease-out
        "
        style={{
          left: on ? "calc(100% - 1.85rem)" : "0.35rem",
          background: "radial-gradient(circle at 35% 30%, #ffffff 0%, var(--color-knob) 60%, var(--color-knob-edge) 100%)",
          boxShadow:
            "inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -2px 0 rgba(0,0,0,0.12), 0 0 0 2px var(--color-stroke), 0 2px 0 rgba(0,0,0,0.4)",
        }}
      />
    </button>
  );
}

/* ---------- Icône X ---------- */

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      aria-hidden
      style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.35))" }}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
