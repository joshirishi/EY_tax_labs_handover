/**
 * EYFooter — Global footer following EY web component spec
 *
 * Sections:
 *   - EY Logo (mark-only variant)
 *   - Optional link columns (Services, About, Legal)
 *   - Spectrum gradient top border accent
 *   - Optional social links slot
 *
 * Usage:
 *   <EYFooter
 *     columns={[{ heading: 'Services', links: [{ label: 'Consulting', href: '/consulting' }] }]}
 *     copyright="© 2026 EY. All Rights Reserved."
 *   />
 */

import { useState } from 'react';
import { colors, contentRailStyle, fonts, spectrumCss } from './tokens';
import { EYLogo } from './EYLogo';
import type { CSSProperties, ReactNode } from 'react';

interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface EYFooterProps {
  columns?: FooterColumn[];
  /** @deprecated Copyright row removed; kept for API compatibility */
  copyright?: string;
  /** Slot for social icons or extra content */
  socialSlot?: ReactNode;
  /** Spectrum gradient number (1–7) for the top accent line */
  gradient?: number;
  style?: CSSProperties;
  className?: string;
}

export function EYFooter({
  columns = [],
  socialSlot,
  gradient = 4,
  style,
  className,
}: EYFooterProps) {
  return (
    <footer
      className={className}
      style={{
        background: colors.confidentBlack,
        color: colors.gray02,
        position: 'relative',
        ...style,
      }}
      aria-label="Site footer"
    >
      {/* Spectrum gradient top accent line */}
      <div
        style={{
          height: 3,
          background: spectrumCss(gradient),
          width: '100%',
        }}
        aria-hidden="true"
      />

      <div
        style={{
          ...contentRailStyle,
          padding: '40px 0 32px',
        }}
      >
        {/* ── Logo + optional link columns ─────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: columns.length > 0 ? `220px repeat(${columns.length}, 1fr)` : '1fr',
            gap: 48,
            alignItems: columns.length > 0 ? 'start' : 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <EYLogo variant="mark-only" theme="dark" />
            {socialSlot && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>{socialSlot}</div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p style={{
                fontFamily: fonts.bold,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: colors.yellow,
                margin: '0 0 12px 0',
              }}>
                {col.heading}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ link }: { link: FooterLink }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (link.onClick) link.onClick();
    else if (link.href) window.location.href = link.href;
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontFamily: "'EYInterstate:Regular', Arial, sans-serif",
        fontSize: 13,
        color: hovered ? colors.white : colors.gray02,
        transition: 'color 0.15s',
        textAlign: 'left',
      }}
    >
      {link.label}
    </button>
  );
}

