/**
 * EYTypography — type scale components matching EY Brand Guidelines
 *
 * <EYEyebrow>   — small all-caps label (gold on light, yellow on dark)
 * <EYDisplay>   — hero display text 56–72px Bold
 * <EYHeading>   — h1 / h2 / h3 scaled headings
 * <EYSubheading>— 18–20px Regular subheading
 * <EYBody>      — 16px Light body copy
 * <EYCTA>       — 16px Bold CTA (with optional arrow)
 * <EYCaption>   — 12px caption / source line
 * <EYQuote>     — Georgia serif pull-quote
 *
 * All accept className and style for extension.
 * theme="dark"  → text defaults to white
 * theme="light" → text defaults to EY Off Black (default)
 */

import { colors, fonts, typeScale } from './tokens';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface TypoProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  theme?: Theme;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

const darkText  = colors.white;
const lightText = colors.offBlack;

function resolve(theme: Theme | undefined) {
  return theme === 'dark' ? darkText : lightText;
}

/** Visible label matching a ModuleHeader tab — ties section content to in-page nav. */
export function SectionAnchorTitle({
  children,
  theme,
  align = "center",
  style,
  className,
  ...rest
}: TypoProps & { align?: "left" | "center" | "right" }) {
  // eyebrowGold (#B89B00) fails WCAG AA on white/offWhite/gray02 — use confidentBlack on light surfaces.
  const lightEyebrowColor = theme !== "dark" ? colors.confidentBlack : undefined;
  return (
    <EYEyebrow
      theme={theme}
      className={className}
      style={{ textAlign: align, marginBottom: 8, color: lightEyebrowColor, ...style }}
      {...rest}
    >
      {children}
    </EYEyebrow>
  );
}

/** Small ALL-CAPS eyebrow / category label */
export function EYEyebrow({ children, theme, style, className, ...rest }: TypoProps) {
  const color = theme === 'dark' ? colors.yellow : colors.eyebrowGoldDark;
  return (
    <p
      {...rest}
      className={className}
      style={{
        fontFamily: fonts.bold,
        fontWeight: typeScale.label.weight,
        fontSize: typeScale.label.size,
        letterSpacing: typeScale.label.tracking,
        textTransform: 'uppercase',
        color,
        margin: 0,
        marginBottom: 6,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** Hero display text (56–72px Bold) */
export function EYDisplay({ children, theme, style, className, ...rest }: TypoProps) {
  return (
    <h1
      {...rest}
      className={className}
      style={{
        fontFamily: fonts.bold,
        fontWeight: typeScale.display.weight,
        fontSize: typeScale.display.size,
        letterSpacing: typeScale.display.tracking,
        color: resolve(theme),
        margin: 0,
        lineHeight: 1.05,
        ...style,
      }}
    >
      {children}
    </h1>
  );
}

interface HeadingProps extends TypoProps {
  level?: 1 | 2 | 3;
}

/** Section headings — level 1 (40px), 2 (32px), 3 (20px) */
export function EYHeading({ children, level = 2, theme, style, className, ...rest }: HeadingProps) {
  const scaleMap = { 1: typeScale.h1, 2: typeScale.h2, 3: { size: 20, weight: 700, tracking: '-0.02em' } } as const;
  const s = scaleMap[level];
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  return (
    <Tag
      {...(rest as HTMLAttributes<HTMLHeadingElement>)}
      className={className}
      style={{
        fontFamily: fonts.bold,
        fontWeight: s.weight,
        fontSize: s.size,
        letterSpacing: s.tracking,
        color: resolve(theme),
        margin: 0,
        lineHeight: 1.15,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/** Subheading — 18–20px Regular */
export function EYSubheading({ children, theme, style, className, ...rest }: TypoProps) {
  return (
    <p
      {...rest}
      className={className}
      style={{
        fontFamily: fonts.regular,
        fontWeight: typeScale.subheading.weight,
        fontSize: typeScale.subheading.size,
        letterSpacing: typeScale.subheading.tracking,
        color: resolve(theme),
        margin: 0,
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** Body copy — 16px Light */
export function EYBody({ children, theme, style, className, ...rest }: TypoProps) {
  return (
    <p
      {...rest}
      className={className}
      style={{
        fontFamily: fonts.light,
        fontWeight: typeScale.body.weight,
        fontSize: typeScale.body.size,
        letterSpacing: typeScale.body.tracking,
        color: resolve(theme),
        margin: 0,
        lineHeight: 1.6,
        maxWidth: 640,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

interface CTAProps extends TypoProps {
  arrow?: boolean;
}

/** Bold CTA text (underline style — not a button) */
export function EYCTA({ children, theme, style, className, arrow = true, ...rest }: CTAProps) {
  return (
    <span
      {...(rest as HTMLAttributes<HTMLSpanElement>)}
      className={className}
      style={{
        fontFamily: fonts.bold,
        fontWeight: typeScale.cta.weight,
        fontSize: typeScale.cta.size,
        letterSpacing: typeScale.cta.tracking,
        color: resolve(theme),
        textDecoration: 'underline',
        textUnderlineOffset: 3,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
      {arrow && ' →'}
    </span>
  );
}

/** Caption / source text — 12px Light, muted */
export function EYCaption({ children, theme, style, className, ...rest }: TypoProps) {
  const color = theme === 'dark' ? colors.gray02 : colors.gray01;
  return (
    <p
      {...rest}
      className={className}
      style={{
        fontFamily: fonts.light,
        fontWeight: typeScale.caption.weight,
        fontSize: typeScale.caption.size,
        letterSpacing: typeScale.caption.tracking,
        color,
        margin: 0,
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** Georgia serif pull-quote */
export function EYQuote({ children, theme, style, className, ...rest }: TypoProps) {
  return (
    <blockquote
      {...(rest as HTMLAttributes<HTMLElement>)}
      className={className}
      style={{
        fontFamily: fonts.quote,
        fontSize: 22,
        fontWeight: 400,
        color: resolve(theme),
        margin: 0,
        lineHeight: 1.45,
        fontStyle: 'italic',
        ...style,
      }}
    >
      {children}
    </blockquote>
  );
}
