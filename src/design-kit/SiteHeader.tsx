/**
 * SiteHeader — shared top chrome. Two variants:
 *
 *   variant="hub" (default) — Home + Phased Engagement only.
 *     Yellow strip, EY mark + "India AI Tax Hub", then the site-section row
 *     ("About EY India AI Tax Hub" | "EY.ai Tax Labs").
 *
 *   variant="learning" — Phase 1 overview and every module page (Figma 3508:4135).
 *     Brand block "EY.ai Tax Labs" / "INDIA TAX HUB".
 *     No site-section row — breadcrumb navigation lives in <ModuleHeader/> below.
 */

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

/** Figma Level 1 — brand bar (Phase 1 + modules). */
function LearningBrandBar({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div
      className="flex items-center gap-3 w-full px-4 sm:px-6 md:px-10 py-3 md:py-4"
      style={{
        background: colors.confidentBlack,
        borderBottom: "1px solid #2E2E38",
      }}
    >
      <button
        onClick={() => onNavigate("/phased")}
        className="flex items-center gap-3 md:gap-4 min-w-0"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          borderRadius: 4,
        }}
        aria-label={`${BRAND_LABEL} — back to Tax Labs overview`}
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
            EY.ai <span style={{ fontFamily: fonts.regular }}>Tax Labs</span>
          </span>
          <span
            className="text-[9px] md:text-[10px]"
            style={{
              color: colors.yellow,
              fontFamily: fonts.bold,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            India Tax Hub
          </span>
        </div>
      </button>
    </div>
  );
}

/** Hub chrome for Home + Phased Engagement. */
function HubBrandBar({
  onNavigate,
  activeSection,
  rightSlot,
}: {
  onNavigate: (path: string) => void;
  activeSection: SiteSection;
  rightSlot?: React.ReactNode;
}) {
  return (
    <>
      <div style={{ background: colors.yellow, height: 3, width: "100%" }} />
      <div
        style={{
          background: colors.offBlack,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <button
          onClick={() => onNavigate("/")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}
          aria-label={`${BRAND_LABEL} — go to home`}
          onFocus={applyFocusRing}
          onBlur={clearFocusRing}
        >
          <EYLogo variant="mark-only" theme="dark" />
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: fonts.regular,
              fontSize: 13,
              borderLeft: "1px solid rgba(255,255,255,0.3)",
              paddingLeft: 12,
              whiteSpace: "nowrap",
            }}
          >
            India AI Tax Hub
          </span>
        </button>
        {rightSlot}
      </div>

      <nav aria-label="Site sections" style={{ background: colors.confidentBlack, display: "flex", alignItems: "center", padding: "0 16px", overflowX: "auto" }}>
        <SiteNavLink
          label="About EY India AI Tax Hub"
          isActive={activeSection === "home"}
          onClick={() => onNavigate("/")}
        />
        <SiteNavLink
          label="EY.ai Tax Labs"
          isActive={activeSection === "tax-labs"}
          onClick={() => onNavigate("/phased")}
        />
      </nav>
    </>
  );
}

function SiteNavLink({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={isActive ? undefined : onClick}
      aria-current={isActive ? "page" : undefined}
      style={{
        background: "none",
        border: "none",
        cursor: isActive ? "default" : "pointer",
        padding: "10px 14px",
        fontFamily: fonts.regular,
        fontSize: 13,
        color: isActive ? colors.yellow : colors.gray02,
        whiteSpace: "nowrap",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.color = "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.color = colors.gray02;
      }}
      onFocus={applyFocusRing}
      onBlur={clearFocusRing}
    >
      {label}
    </button>
  );
}
