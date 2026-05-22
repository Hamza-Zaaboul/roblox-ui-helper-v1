/**
 * Label de section : petit trait vertical bleu + texte muted.
 * Reproduit le pattern "Graphiques / Jouabilité / Caméra / Effets" des
 * screenshots. Le trait vertical est généré via ::before en CSS pour ne
 * pas polluer le markup.
 */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="section-label">{children}</h2>;
}
