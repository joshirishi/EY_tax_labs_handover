/**
 * EYCard — Insight card following EY web component spec
 *
 * Features:
 *   - Thumbnail area with Spectrum Frame border overlay
 *   - Eyebrow category label (EY Yellow)
 *   - Title heading
 *   - Optional body text and CTA link
 *   - theme="light" (default white card) | theme="dark" (dark card bg)
 *
 * Usage:
 *   <EYCard
 *     eyebrow="Featured thinking"
 *     title="How can alumni networks create new opportunities?"
 *     cta="Read more"
 *     onClick={...}
 *   />
 */

import { colors, fonts, spectrumGradients } from './tokens';
import type { CSSProperties, ReactNode } from 'react';

/**
 * StepBadge — circular number badge matching the LearningNav module order chip.
 *
 * Usage:
 *   <StepBadge n={1} />                          // yellow on dark bg (default)
 *   <StepBadge n={3} color="#8630FF" />           // custom accent
 *   <StepBadge n={2} size={24} onLight />         // larger, light-bg variant
 */
export function StepBadge({
  n,
  color,
  textColor: textColorProp,
  size = 22,
  onLight = false,
  variant = 'filled',
}: {
  n: number | string;
  color?: string;
  /** Override the text colour inside the badge. */
  textColor?: string;
  size?: number;
  onLight?: boolean;
  /** 'filled' = solid background (default); 'outline' = border only, transparent fill. */
  variant?: 'filled' | 'outline';
}) {
  const accentColor = color ?? colors.yellow;
  const isYellow = !color || color === colors.yellow || color === '#FFE600';
  const defaultTextColor = variant === 'outline'
    ? accentColor
    : isYellow ? colors.offBlack : colors.white;
  const textColor = textColorProp ?? defaultTextColor;
  const fontSize = size <= 20 ? 11 : size <= 26 ? 12 : 13;

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: variant === 'outline' ? 'transparent' : accentColor,
        border: variant === 'outline' ? `1.5px solid ${accentColor}` : 'none',
        color: textColor,
        fontFamily: fonts.bold,
        fontSize,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
}

interface EYCardProps {
  eyebrow?: string;
  title: string;
  body?: string;
  cta?: string;
  /** 1–7 spectrum gradient for the card frame overlay */
  gradient?: number;
  /** Background image URL for the thumbnail */
  imageUrl?: string;
  /** Thumbnail height in px (default 140) */
  imageHeight?: number;
  theme?: 'light' | 'dark';
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function EYCard({
  eyebrow,
  title,
  body,
  cta,
  gradient = 3,
  imageUrl,
  imageHeight = 140,
  theme = 'light',
  onClick,
  className,
  style,
  children,
}: EYCardProps) {
  const isDark = theme === 'dark';
  const [startColor, , endColor] = spectrumGradients[Math.max(0, Math.min(gradient - 1, 6))];

  const cardBg  = isDark ? colors.confidentBlack : colors.white;
  const border  = `1px solid ${isDark ? colors.offBlack : colors.gray02}`;
  const titleColor = isDark ? colors.white : colors.offBlack;
  const bodyColor  = isDark ? colors.gray02  : colors.gray01;

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: cardBg,
        border,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s, box-shadow 0.15s',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!onClick) return;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      {/* Thumbnail with Spectrum Frame border overlay */}
      <div
        style={{
          height: imageHeight,
          position: 'relative',
          background: imageUrl
            ? `url(${imageUrl}) center/cover no-repeat`
            : `linear-gradient(135deg, ${colors.gray01}, ${colors.offBlack})`,
          flexShrink: 0,
        }}
      >
        {/* EY Frame border: top + left + right, open bottom — CSS border shorthand */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            right: 36,
            bottom: 36,
            borderTop:   `2px solid ${startColor}`,
            borderLeft:  `2px solid ${startColor}`,
            borderRight: `2px solid ${endColor}`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Card body */}
      <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {eyebrow && (
          <p style={{
            fontFamily: fonts.bold,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: isDark ? colors.yellow : colors.eyebrowGoldDark,
            margin: 0,
          }}>
            {eyebrow}
          </p>
        )}

        <h3 style={{
          fontFamily: fonts.bold,
          fontWeight: 700,
          fontSize: 16,
          lineHeight: 1.3,
          color: titleColor,
          margin: 0,
        }}>
          {title}
        </h3>

        {body && (
          <p style={{
            fontFamily: "'EYInterstate:Light', Arial, sans-serif",
            fontWeight: 300,
            fontSize: 14,
            lineHeight: 1.55,
            color: bodyColor,
            margin: 0,
          }}>
            {body}
          </p>
        )}

        {children}

        {cta && (
          <span style={{
            fontFamily: fonts.bold,
            fontWeight: 700,
            fontSize: 13,
            color: isDark ? colors.white : colors.offBlack,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            marginTop: 'auto',
            paddingTop: 4,
            cursor: 'pointer',
          }}>
            {cta} →
          </span>
        )}
      </div>
    </div>
  );
}
