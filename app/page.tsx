"use client";

import { useState } from "react";
import { SettingsModal } from "./components/settings-modal";

/**
 * Page démo : on affiche le modal Paramètres centré à l'écran, posé
 * sur un arrière-plan flou (aurore cyan/violette gérée dans globals.css).
 * Le bouton close en haut à droite ré-ouvre simplement le modal — c'est une
 * démo, donc on ne le démonte pas vraiment.
 */
export default function Home() {
  const [open, setOpen] = useState(true);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden p-4 sm:p-8">
      {/* Faux contenu de fond pour évoquer "modal posé sur un jeu" */}
      <BackdropMock />

      {open ? (
        <SettingsModal onClose={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur transition hover:border-white/25 hover:bg-white/10 hover:text-white"
        >
          Rouvrir les paramètres
        </button>
      )}
    </main>
  );
}

/**
 * Petit décor d'arrière-plan : quelques blobs colorés flous pour évoquer
 * un fond de jeu sans dépendre d'une image. Tout est en pur CSS donc 0 kB
 * d'image à charger.
 */
function BackdropMock() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute right-[10%] top-[20%] h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="absolute bottom-[8%] left-[40%] h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
    </div>
  );
}
