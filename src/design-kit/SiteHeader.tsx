/**
 * SiteHeader — shared top chrome. Two variants:
 *
 *   variant="hub" (default) — Home + Phased Engagement only.
 *     Same brand bar as learning; optional rightSlot for hub actions.
 *
 *   variant="learning" — Phase 1 overview and every module page (Figma 3508:4135).
 *     Brand block "AI for Tax Excellence" + tagline.
 *     No site-section row — breadcrumb navigation lives in <ModuleHeader/> below.
 */

export const PRODUCT_TITLE = "AI for Tax Excellence";
export const PRODUCT_TAGLINE = "Practical AI skills for the modern tax professional";

import { colors, fonts } from "./tokens";
import { EYLogo } from "./EYLogo";
import { BRAND_LABEL } from "./curriculum";

export type SiteSection = "home" | "tax-labs";

interface SiteHeaderProps {
  /** "hub" = Home/Phased site chrome; "learning" = Phase 1 + modules (Figma Level 1). */
  variant?: "hub" | "learning";
  activeSection?: SiteSection;
  onNavigate: (path: string) => void;
  /** Right-aligned content on the hub brand bar (learning variant has no right slot). */
  rightSlot?: React.ReactNode;
  /** When set, renders an invisible-until-focused "Skip to content" link pointing at this id. */
  skipLinkTarget?: string;
}

const FOCUS_RING = `2px solid ${colors.yellow}`;
function applyFocusRing(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.outline = FOCUS_RING;
  e.currentTarget.style.outlineOffset = "2px";
}
function clearFocusRing(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.outline = "none";
}

export function SiteHeader({
  variant = "hub",
  activeSection = "tax-labs",
  onNavigate,
  rightSlot,
  skipLinkTarget,
}: SiteHeaderProps) {
  return (
    <header>
      {skipLinkTarget && (
        <a
          href={skipLinkTarget}
          style={{
            position: "absolute",
            left: -9999,
            top: "auto",
            width: 1,
            height: 1,
            overflow: "hidden",
            zIndex: 10000,
            background: colors.yellow,
            color: colors.confidentBlack,
            padding: "10px 16px",
            fontFamily: fonts.bold,
            fontSize: 13,
          }}
          onFocus={(e) => {
            Object.assign(e.currentTarget.style, { left: 16, top: 8, width: "auto", height: "auto" });
          }}
          onBlur={(e) => {
            Object.assign(e.currentTarget.style, { left: -9999, width: 1, height: 1 });
          }}
        >
          Skip to content
        </a>
      )}

      {variant === "learning" ? (
        <LearningBrandBar onNavigate={onNavigate} />
      ) : (
        <HubBrandBar onNavigate={onNavigate} activeSection={activeSection} rightSlot={rightSlot} />
      )}
    </header>
  );
}

const learningBrandBarStyle: React.CSSProperties = {
  background: colors.offBlack,
  borderBottom: `1px solid ${colors.confidentBlack}`,
};

const hubBrandBarStyle: React.CSSProperties = {
  background: colors.confidentBlack,
  borderBottom: `1px solid ${colors.borderOnDark}`,
};

function BrandBarHomeButton({
  onNavigate,
  ariaLabel,
}: {
  onNavigate: (path: string) => void;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={() => onNavigate("/")}
      className="flex items-center gap-3 md:gap-4 min-w-0"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        borderRadius: 4,
      }}
      aria-label={ariaLabel}
      onFocus={applyFocusRing}
      onBlur={clearFocusRing}
    >
      <div
        style={{
          background: colors.offBlack,
          width: 40,
          height: 40,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ transform: "scale(0.68)", transformOrigin: "center" }}>
          <EYLogo variant="mark-only" theme="dark" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 items-start min-w-0">
        <span
          className="text-[16px] md:text-[20px] truncate"
          style={{ color: "#FFFFFF", fontFamily: fonts.bold, lineHeight: 1.2 }}
        >
          {PRODUCT_TITLE}
        </span>
        <span
          className="text-[11px] md:text-[12px] truncate"
          style={{
            color: colors.gray02,
            fontFamily: fonts.regular,
            lineHeight: 1.3,
          }}
        >
          {PRODUCT_TAGLINE}
        </span>
      </div>
    </button>
  );
}

/** Figma Level 1 — brand bar (Phase 1 + modules). */
function LearningBrandBar({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div
      className="flex items-center gap-3 w-full px-4 sm:px-6 md:px-10 py-3 md:py-4"
      style={learningBrandBarStyle}
    >
      <BrandBarHomeButton onNavigate={onNavigate} ariaLabel={`${BRAND_LABEL} — back to overview`} />
    </div>
  );
}

/** Hub chrome for Home + Phased Engagement — deeper black bar than learning pages. */
function HubBrandBar({
  onNavigate,
  rightSlot,
}: {
  onNavigate: (path: string) => void;
  activeSection: SiteSection;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 w-full px-4 sm:px-6 md:px-10 py-3 md:py-4"
      style={hubBrandBarStyle}
    >
      <BrandBarHomeButton onNavigate={onNavigate} ariaLabel={`${BRAND_LABEL} — go to home`} />
      {rightSlot}
    </div>
  );
}
