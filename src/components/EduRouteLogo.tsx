/**
 * EDUROUTE brand mark — open book, learning path, destination pin.
 * Matches public/favicon.svg and the official app icon.
 */

type EduRouteLogoProps = {
  size?: number;
  className?: string;
  /** When true, skips rounded clip (e.g. already in a rounded container) */
  plain?: boolean;
};

export function EduRouteLogo({ size = 36, className = '', plain = false }: EduRouteLogoProps) {
  return (
    <img
      src="/favicon.svg"
      alt="EDUROUTE"
      width={size}
      height={size}
      draggable={false}
      className={`${plain ? '' : 'rounded-xl'} object-cover shrink-0 ${className}`}
    />
  );
}

export default EduRouteLogo;
