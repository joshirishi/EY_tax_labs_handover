/**
 * EYFrame — The signature EY brand frame component
 *
 * variant="spectrum"     — gradient stroke frame (7 gradient presets)
 * variant="yellow"       — solid EY Yellow single-color frame
 * variant="breakthrough" — headline breaks across the frame boundary
 *
 * The frame shape follows the EY brand spec:
 *   Left vertical │ Diagonal top ╱ (open right side) │ Bottom horizontal
 *   Three yellow indicator squares in the bottom-left corner
 *
 * Usage:
 *   <EYFrame variant="spectrum" gradient={4} headline="Will you shape the future?">
 *     <p>Body copy...</p>
 *   </EYFrame>
 */

import { colors, spectrumGradients, fonts } from './tokens';
import type { CSSProperties, ReactNode } from 'react';

interface EYFrameProps {
  variant?: 'spectrum' | 'yellow' | 'breakthrough';
  /** 1–7 spectrum gradient preset (only for variant="spectrum") */
  gradient?: number;
  /** Main headline text */
  headline?: string;
  /** Second half of headline for breakthrough split */
  headlineEnd?: string;
  /** Subheading text */
  subheading?: string;
  /** CTA text */
  cta?: string;
  /** Background color/gradient CSS value */
  background?: string;
  /** Stroke thickness in px (auto-calculated from width if omitted) */
  strokePx?: number;
  /** Whether to show the three indicator squares + approach text */
  showApproach?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Three yellow indicator squares (the "Approach Line" device) */
function ApproachLine({ color = colors.yellow }: { color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 9, height: 9, background: color, display: 'block' }} />
      ))}
    </div>
  );
}

/** EY Frame stroke rendered as SVG overlay — scales to any parent size */
function FrameSVG({
  strokeColor,
  gradientColors,
  strokePx = 3,
  id,
}: {
  strokeColor?: string;
  gradientColors?: [string, string, string];
  strokePx?: number;
  id: string;
}) {
  // Viewbox: 200×140. Frame: left from (8,132)→(8,36), diagonal (8,36)→(164,8), bottom (8,132)→(164,132)
  // Right side intentionally open — EY brand spec
  const pts = '8,132 8,36 164,8';
  const stroke = strokeColor ?? `url(#${id})`;

  return (
    <svg
      viewBox="0 0 200 140"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {gradientColors && (
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={gradientColors[0]} />
            <stop offset="50%"  stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[2]} />
          </linearGradient>
        </defs>
      )}
      {/* L-shape + diagonal: bottom-left → up-left → diagonal-top-right */}
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={strokePx} />
      {/* Bottom horizontal line */}
      <line x1="8" y1="132" x2="164" y2="132" stroke={stroke} strokeWidth={strokePx} />
    </svg>
  );
}

let frameCounter = 0;

export function EYFrame({
  variant = 'spectrum',
  gradient = 4,
  headline,
  headlineEnd,
  subheading,
  cta,
  background = colors.confidentBlack,
  strokePx = 3,
  showApproach = true,
  children,
  className,
  style,
}: EYFrameProps) {
  // Unique gradient ID per instance to avoid SVG defs collisions
  const gradId = `ey-frame-grad-${++frameCounter}`;

  const gradColors = spectrumGradients[Math.max(0, Math.min(gradient - 1, 6))];
  const strokeColor = variant === 'yellow' ? colors.yellow : undefined;
  const gradientColors = variant === 'spectrum' ? gradColors : undefined;

  const textColor = colors.white;

  const wrapper: CSSProperties = {
    position: 'relative',
    padding: '36px 44px 28px 36px',
    background,
    color: textColor,
    overflow: 'hidden',
    ...style,
  };

  if (variant === 'breakthrough') {
    // Headline breaks across the frame's width — two halves side by side
    return (
      <div className={className} style={wrapper}>
        <FrameSVG
          gradientColors={gradColors}
          strokePx={strokePx}
          id={gradId}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: textColor }}>
              {headline}
            </span>
            <span style={{ fontFamily: fonts.bold, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: textColor, textAlign: 'right' }}>
              {headlineEnd}
            </span>
          </div>
          {showApproach && <ApproachLine />}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={wrapper}>
      <FrameSVG
        strokeColor={strokeColor}
        gradientColors={gradientColors}
        strokePx={strokePx}
        id={gradId}
      />
      {/* Content sits above the SVG overlay */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {headline && (
          <p style={{
            fontFamily: fonts.bold,
            fontWeight: 700,
            fontSize: 24,
            lineHeight: 1.15,
            color: textColor,
            margin: '0 0 10px 0',
          }}>
            {headline}
          </p>
        )}
        {subheading && (
          <p style={{
            fontFamily: "'EYInterstate:Regular', Arial, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            color: textColor,
            margin: '0 0 10px 0',
            lineHeight: 1.5,
          }}>
            {subheading}
          </p>
        )}
        {cta && (
          <span style={{
            fontFamily: fonts.bold,
            fontSize: 13,
            fontWeight: 700,
            color: textColor,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            cursor: 'pointer',
          }}>
            {cta}
          </span>
        )}
        {children}
        {showApproach && <ApproachLine />}
        <p style={{
          fontFamily: fonts.bold,
          fontSize: 10,
          fontWeight: 700,
          lineHeight: 1.3,
          color: textColor,
          margin: '8px 0 0 0',
          opacity: 0.7,
        }}>
          The better the question.<br />
          The better the answer.<br />
          The better the world works.
        </p>
      </div>
    </div>
  );
}
