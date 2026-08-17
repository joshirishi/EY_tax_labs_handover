/**
 * EYButton — three sanctioned button styles
 *
 * variant="primary"   — dark filled (EY Confident Black bg, white text)
 * variant="secondary" — outlined (border, transparent bg)
 * variant="text"      — underline text link
 *
 * size="sm" | "md" (default) | "lg"
 *
 * RULE: Never fill a button with solid EY Yellow.
 */

import { colors, fonts } from './tokens';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface EYButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  /** Optional arrow suffix — appended automatically for text variant */
  arrow?: boolean;
}

const sizes = {
  sm:  { padding: '8px 20px',  fontSize: 13 },
  md:  { padding: '12px 28px', fontSize: 14 },
  lg:  { padding: '16px 36px', fontSize: 16 },
} as const;

export function EYButton({
  variant = 'primary',
  size = 'md',
  children,
  arrow,
  style,
  ...rest
}: EYButtonProps) {
  const { padding, fontSize } = sizes[size];
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding,
    fontSize,
    fontFamily: fonts.bold,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
    textDecoration: 'none',
    lineHeight: 1,
    ...style,
  };

  if (variant === 'primary') {
    return (
      <button
        {...rest}
        style={{ ...base, background: colors.confidentBlack, color: colors.white }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = colors.offBlack;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = colors.confidentBlack;
        }}
      >
        {children}
        {arrow && <span aria-hidden="true">→</span>}
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        {...rest}
        style={{
          ...base,
          background: 'transparent',
          color: colors.offBlack,
          border: `1.5px solid ${colors.offBlack}`,
        }}
        onMouseEnter={(e) => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.background = colors.offBlack;
          b.style.color = colors.white;
        }}
        onMouseLeave={(e) => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.background = 'transparent';
          b.style.color = colors.offBlack;
        }}
      >
        {children}
        {arrow && <span aria-hidden="true">→</span>}
      </button>
    );
  }

  // text variant
  return (
    <button
      {...rest}
      style={{
        ...base,
        padding: 0,
        background: 'transparent',
        border: 'none',
        color: colors.offBlack,
        textDecoration: 'underline',
        textUnderlineOffset: 3,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = colors.yellow;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = colors.offBlack;
      }}
    >
      {children}
      <span aria-hidden="true">→</span>
    </button>
  );
}
