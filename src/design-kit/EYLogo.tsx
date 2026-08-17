/**
 * EYLogo — four sanctioned EY logo variants
 *
 * variant="stacked"         — logo mark + tagline below (default / print/digital)
 * variant="horizontal-sm"   — mark + tagline beside (nav bars, restricted vertical space)
 * variant="horizontal-lg"   — mark + tagline beside, large (stages, events)
 * variant="mark-only"       — just the EY mark (favicons, social, signage)
 *
 * theme="dark"  — EY letters render white  (use on dark backgrounds)
 * theme="light" — EY letters render #2E2E38 (use on white/off-white backgrounds)
 */

import { colors } from './tokens';

interface EYLogoProps {
  variant?: 'stacked' | 'horizontal-sm' | 'horizontal-lg' | 'mark-only';
  theme?: 'dark' | 'light';
  className?: string;
  onClick?: () => void;
}

/**
 * EY mark — paths sourced directly from /public/ey-logo.svg
 * (ernst-young-ey-logo-svgrepo-com.svg). letterColor is controlled
 * via prop so we can render white on dark backgrounds and dark on light.
 */
function EYMark({ height, letterColor }: { height: number; letterColor: string }) {
  return (
    <svg
      viewBox="0 -18 217.599 217.599"
      style={{ height, width: 'auto', display: 'block', flexShrink: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EY logo"
    >
      {/* Yellow wedge — identical to /public/ey-logo.svg */}
      <path fill={colors.yellow} d="M0 79.4L217.599 0v41z" />
      {/* E + Y letterforms — identical to /public/ey-logo.svg */}
      <path
        fill={letterColor}
        d="M24.9 150.6h28.5v-16.5H24.9v-13h31.5L46 103H1.4v78.6h62.8v-18.1H24.9zM106.1 103l-13.3 25.7L79.4 103h-26l27.4 47.6v31h23.5v-31l27.5-47.6z"
      />
    </svg>
  );
}

/** "Shape the future with confidence" tagline text */
function Tagline({ fontSize, color }: { fontSize: number; color: string }) {
  return (
    <span
      style={{
        fontFamily: "'EYInterstate:Bold', Arial, sans-serif",
        fontWeight: 700,
        fontSize,
        lineHeight: 1.2,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      Shape the future
      <br />
      with confidence
    </span>
  );
}

export function EYLogo({
  variant = 'stacked',
  theme = 'dark',
  className,
  onClick,
}: EYLogoProps) {
  const letterColor = theme === 'dark' ? colors.white : colors.offBlack;
  const taglineColor = theme === 'dark' ? colors.white : colors.offBlack;

  const wrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'flex-start',
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
  };

  if (variant === 'mark-only') {
    return (
      <div style={wrapperStyle} className={className} onClick={onClick} aria-label="EY">
        <EYMark height={44} letterColor={letterColor} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        style={{ ...wrapperStyle, flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}
        className={className}
        onClick={onClick}
        aria-label="EY — Shape the future with confidence"
      >
        <EYMark height={100} letterColor={letterColor} />
        <Tagline fontSize={18} color={taglineColor} />
      </div>
    );
  }

  if (variant === 'horizontal-sm') {
    return (
      <div
        style={{ ...wrapperStyle, flexDirection: 'row', gap: 14, alignItems: 'center' }}
        className={className}
        onClick={onClick}
        aria-label="EY — Shape the future with confidence"
      >
        <EYMark height={40} letterColor={letterColor} />
        <Tagline fontSize={12} color={taglineColor} />
      </div>
    );
  }

  // horizontal-lg
  return (
    <div
      style={{ ...wrapperStyle, flexDirection: 'row', gap: 18, alignItems: 'center' }}
      className={className}
      onClick={onClick}
      aria-label="EY — Shape the future with confidence"
    >
      <EYMark height={56} letterColor={letterColor} />
      <Tagline fontSize={15} color={taglineColor} />
    </div>
  );
}
