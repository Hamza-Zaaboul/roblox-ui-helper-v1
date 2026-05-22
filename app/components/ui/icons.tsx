/**
 * Iconographie : trait fin (1.6–2px), stroke "currentColor" pour hériter
 * de la couleur du parent. Tous les chemins en stroke (pas de fill) pour
 * coller à la DA des screenshots.
 */

type IconProps = {
  className?: string;
  size?: number;
};

export function CloseIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/**
 * Icône "undo" : flèche circulaire qui revient à gauche, comme dans le
 * screenshot 3 (apparaît à côté du toggle/slider quand on a modifié la
 * valeur par rapport au défaut).
 */
export function UndoIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 9 8 9" />
    </svg>
  );
}
