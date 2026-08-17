/**
 * EYNavbar — Global sticky navigation bar
 *
 * Follows EY web component spec:
 *   - EY logo (horizontal-sm variant) on the left
 *   - Nav links on the right — active link underlined in EY Yellow
 *   - Background: EY Confident Black (#1A1A24) with subtle bottom border
 *   - Mobile-friendly: collapses links at narrow widths
 *
 * Usage:
 *   <EYNavbar
 *     items={[{ label: 'Home', href: '/', active: true }, ...]}
 *     onLogoClick={() => navigate('/')}
 *   />
 */

import { useState } from 'react';
import { colors, fonts } from './tokens';
import { EYLogo } from './EYLogo';
import type { CSSProperties } from 'react';

export interface NavItem {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

interface EYNavbarProps {
  items?: NavItem[];
  onLogoClick?: () => void;
  /** Extra content to put in the right slot (e.g. a CTA button) */
  rightSlot?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function EYNavbar({
  items = [],
  onLogoClick,
  rightSlot,
  style,
  className,
}: EYNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={className}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: colors.confidentBlack,
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
        ...style,
      }}
      aria-label="Main navigation"
    >
      {/* ── Main bar ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: 60,
        maxWidth: 1440,
        margin: '0 auto',
      }}>
        {/* Logo */}
        {/* EYLogo has no style prop; it already derives cursor from onClick. */}
        <EYLogo
          variant="horizontal-sm"
          theme="dark"
          onClick={onLogoClick}
        />

        {/* Desktop nav links */}
        <div
          style={{
            display: 'flex',
            gap: 28,
            alignItems: 'center',
          }}
          role="menubar"
        >
          {items.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
          {rightSlot}
        </div>

        {/* Mobile hamburger — visible only via media query class */}
        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((v) => !v)}
          style={{
            display: 'none', // shown via Tailwind md:hidden below — here just baseline
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
          }}
          className="md:hidden block"
        >
          <HamburgerIcon open={mobileOpen} />
        </button>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          style={{
            background: colors.confidentBlack,
            borderTop: `1px solid rgba(255,255,255,0.08)`,
            padding: '12px 32px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          role="menu"
        >
          {items.map((item) => (
            <NavLink key={item.label} item={item} mobile />
          ))}
          {rightSlot && <div style={{ marginTop: 8 }}>{rightSlot}</div>}
        </div>
      )}
    </nav>
  );
}

function NavLink({ item, mobile = false }: { item: NavItem; mobile?: boolean }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (item.onClick) item.onClick();
    else if (item.href) window.location.href = item.href;
  };

  return (
    <button
      role="menuitem"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: mobile ? '10px 0' : '0',
        fontFamily: fonts.bold,
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: '-0.01em',
        color: item.active || hovered ? colors.white : colors.gray02,
        borderBottom: item.active
          ? `2px solid ${colors.yellow}`
          : hovered
          ? `2px solid rgba(255,255,255,0.3)`
          : '2px solid transparent',
        paddingBottom: mobile ? undefined : 5,
        transition: 'color 0.15s, border-color 0.15s',
        textAlign: 'left',
        display: 'block',
        width: mobile ? '100%' : 'auto',
      }}
      aria-current={item.active ? 'page' : undefined}
    >
      {item.label}
    </button>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {open ? (
        <>
          <line x1="4" y1="4" x2="18" y2="18" stroke={colors.white} strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="4" x2="4" y2="18" stroke={colors.white} strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="3" y1="6"  x2="19" y2="6"  stroke={colors.white} strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="11" x2="19" y2="11" stroke={colors.white} strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="16" x2="19" y2="16" stroke={colors.white} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
