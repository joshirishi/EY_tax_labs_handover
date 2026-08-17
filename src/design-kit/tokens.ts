/**
 * EY Global Design Kit — Design Tokens
 * Source: EY Brand Guidelines / Design System
 *
 * These are the canonical EY brand values. Import and use these
 * instead of hardcoding hex strings throughout the codebase.
 */

export const colors = {
  // ── Primary palette ──────────────────────────────────────────────────────
  yellow:          '#FFE600', // EY Yellow — highlight only, never body text on white
  white:           '#FFFFFF',
  offWhite:        '#F6F6FA', // digital only
  gray02:          '#C4C4CD', // digital only
  gray01:          '#747480',
  offBlack:        '#2E2E38', // preferred for print
  confidentBlack:  '#1A1A24', // digital only

  // ── Spectrum / Frame accent colors ───────────────────────────────────────
  frameOrange:     '#FF7D1E',
  frameRed:        '#FF3C00',
  frameMagenta:    '#FF32FF',
  framePurple:     '#B400FF',
  frameLime:       '#B4FF00',
  frameGreen:      '#00C864',
  frameTeal:       '#32FFFF',
  frameBlue:       '#4696FF',

  // ── Semantic ─────────────────────────────────────────────────────────────
  error:           '#FF4136',
  eyebrowGold:     '#B89B00', // gold accent on dark surfaces, borders, decorative fills
  eyebrowGoldDark: '#7A6800', // accessible eyebrow text on light/neutral surfaces (WCAG AA)
  success:         '#00C864', // alias of frameGreen — positive/correct states
  destructive:     '#FF4136', // alias of error — negative/incorrect states
  info:            '#4696FF', // alias of frameBlue — informational accents
  accentOrange:    '#FF7D1E', // alias of frameOrange — activity/badge accents

  // ── Dark module surfaces (mirrors --ey-* vars in theme.css) ──────────────
  eyBgBody:        '#1A1A24', // dark section base
  eyBgBodyAlt:     '#1A1A24', // dark section gradient stop
  eyBgCard:        '#2E2E38', // elevated card on dark surfaces
  onDark:          '#FFFFFF', // primary text on dark backgrounds
  onDarkMuted:     'rgba(255, 255, 255, 0.72)', // secondary text on dark
  onDarkSubtle:    'rgba(255, 255, 255, 0.55)', // tertiary/caption text on dark
  surfaceOnDark:   'rgba(255, 255, 255, 0.06)', // inner panel fill on dark
  borderOnDark:    'rgba(255, 255, 255, 0.12)', // borders on dark
  yellowAlpha10:   'rgba(255, 230, 0, 0.10)',
  yellowAlpha12:   'rgba(255, 230, 0, 0.12)',
} as const;

/**
 * 7 Spectrum gradient presets.
 * Each is [start, mid, end] stops — Yellow always anchors the start.
 * Gradient direction for strokes: linear-gradient(90deg, ...)
 */
export const spectrumGradients: readonly [string, string, string][] = [
  [colors.yellow, colors.frameOrange,   colors.frameMagenta], // 1 · Yellow › Orange › Magenta
  [colors.yellow, colors.frameMagenta,  colors.frameRed],     // 2 · Yellow › Magenta › Red
  [colors.yellow, colors.frameMagenta,  colors.frameTeal],    // 3 · Yellow › Magenta › Teal
  [colors.yellow, colors.framePurple,   colors.frameBlue],    // 4 · Yellow › Purple › Blue
  [colors.yellow, colors.frameLime,     colors.frameTeal],    // 5 · Yellow › Lime › Teal
  [colors.yellow, colors.frameGreen,    colors.frameBlue],    // 6 · Yellow › Green › Blue
  [colors.yellow, colors.frameOrange,   colors.frameTeal],    // 7 · Yellow › Orange › Teal
] as const;

/** Returns a CSS linear-gradient string for a spectrum preset (1-indexed). */
export function spectrumCss(index: number, direction = '90deg'): string {
  const [a, b, c] = spectrumGradients[Math.max(0, Math.min(index - 1, 6))];
  return `linear-gradient(${direction}, ${a}, ${b}, ${c})`;
}

// ── Typography ───────────────────────────────────────────────────────────────
export const fonts = {
  bold:    "'EYInterstate:Bold', Arial, 'Helvetica Neue', sans-serif",
  regular: "'EYInterstate:Regular', Arial, 'Helvetica Neue', sans-serif",
  light:   "'EYInterstate:Light', Arial, 'Helvetica Neue', sans-serif",
  quote:   "Georgia, 'Times New Roman', serif",
} as const;

/** Type scale in px — matches EY Brand Guidelines spec */
export const typeScale = {
  display:    { size: 64, weight: 700, tracking: '-0.025em' },
  h1:         { size: 40, weight: 700, tracking: '-0.02em'  },
  h2:         { size: 32, weight: 700, tracking: '-0.02em'  },
  subheading: { size: 19, weight: 400, tracking: '-0.01em'  },
  body:       { size: 16, weight: 300, tracking: '-0.01em'  },
  cta:        { size: 16, weight: 700, tracking: '-0.02em'  },
  label:      { size: 13, weight: 700, tracking: '0.04em'   }, // eyebrow — uppercase
  caption:    { size: 12, weight: 300, tracking: '-0.01em'  },
} as const;

// ── Layout ───────────────────────────────────────────────────────────────────
/**
 * Global content rail. Change `contentWidth` once — every page that uses
 * `contentRailStyle`, `spacing.sectionPadding`, or `var(--ey-content-width)`
 * updates together.
 */
export const layout = {
  /** Main content area as a share of available screen width (e.g. '80%', '72%'). */
  contentWidth: 'min(90%, 1440px)',
} as const;

/** React style for a centered content rail at `layout.contentWidth`. */
export const contentRailStyle = {
  width: layout.contentWidth,
  maxWidth: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
} as const;

/** Horizontal inset that leaves `layout.contentWidth` for content. */
export const contentInlinePad = `calc((100% - ${layout.contentWidth}) / 2)`;

// ── Spacing / Layout ─────────────────────────────────────────────────────────
export const spacing = {
  /** Vertical rhythm + sides sized so content is `layout.contentWidth`. */
  sectionPadding: `72px ${contentInlinePad}`,
  sectionPaddingY: '72px',
  cardPadding:    '18px',
  navHeight:      '60px',
} as const;

// ── Frame stroke thickness formula ───────────────────────────────────────────
/** Returns stroke thickness in px for a given longest-edge pixel length */
export function frameStroke(longestEdgePx: number, square = false): number {
  return Math.round(longestEdgePx / (square ? 60 : 120));
}
