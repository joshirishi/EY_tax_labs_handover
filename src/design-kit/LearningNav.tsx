/**
 * ModuleHeader — Figma Level 2 breadcrumb row (node 3508:4135), shown beneath
 * <SiteHeader variant="learning"/> on Phase 1 overview and every module page.
 *
 * Structure:
 *   Row A — Circular yellow back + "Tax Labs" › [current module ▾]
 *           The picker button shows the current module (with order badge) on
 *           module pages, or the workshop name on the phase-overview page.
 *           Opening it reveals the workshop context header + "Workshop
 *           overview" + the module list. A progress pill sits on the right
 *           (Module / Sub-module of total) plus an optional section status.
 *   Row B — "Learn" / "Apply" tab clusters (module pages only) that jump to
 *           in-page sections within the current module, with scroll-spy
 *           highlighting. Sub-module sections live here — not in the dropdown
 *           (Row A), which handles only workshop/module navigation.
 *
 * Usage (Phase 1 overview):
 *   <SiteHeader variant="learning" onNavigate={navigate} />
 *   <ModuleHeader mode="phase-overview" onNavigate={navigate} onBack={() => navigate("/")} />
 *
 * Usage (module page):
 *   <ModuleHeader currentModuleId="ai-tax-prompting" onNavigate={navigate} onBack={onBack} />
 *
 * Sections reachable from Row B must set `style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN }}`.
 */

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { colors, fonts } from "./tokens";
import {
  PHASE_NUMBER,
  PHASE_PATH,
  TOTAL_PHASES,
  BRAND_LABEL,
  getAdjacentModules,
  getCurrentPhase,
  getModule,
  getSubModuleGroups,
  isModuleAvailable,
  type CurriculumModule,
  type ModuleId,
  type SubModule,
} from "./curriculum";

/**
 * Fallback scroll offset (px) for ModuleHeader alone.
 * SiteHeader scrolls away on module pages — do not include it here.
 */
export const SUBNAV_SCROLL_OFFSET = 100;

/** CSS scroll-margin value — tracks live ModuleHeader height via `--ey-subnav-scroll-offset`. */
export const SUBNAV_SCROLL_MARGIN = `var(--ey-subnav-scroll-offset, ${SUBNAV_SCROLL_OFFSET}px)` as const;

function syncSubnavScrollOffset(height: number) {
  document.documentElement.style.setProperty("--ey-subnav-scroll-offset", `${height}px`);
}

const FOCUS_RING = `2px solid ${colors.yellow}`;
const WORKSHOP_LABEL = getCurrentPhase().label.replace(/^(Phase|Module) \d+: /, "");

function applyFocusRing(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.outline = FOCUS_RING;
  e.currentTarget.style.outlineOffset = "2px";
}

function clearFocusRing(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.outline = "none";
}

type ModuleHeaderProps =
  | {
      mode?: "module";
      currentModuleId: ModuleId;
      onNavigate: (path: string) => void;
      onBack: () => void;
      /** Override for iframe-based modules — scroll inside the embedded document. */
      onSectionClick?: (sectionId: string) => void;
      /** Optional secondary status — only show when real (never invent "Section N Completed"). */
      sectionStatus?: string;
    }
  | {
      mode: "phase-overview";
      currentModuleId?: never;
      onNavigate: (path: string) => void;
      onBack: () => void;
      onSectionClick?: never;
      sectionStatus?: string;
      /** Override the phase label shown in the breadcrumb (e.g. for Phase 2+). */
      phaseLabel?: string;
      /** Override the phase number shown in the progress chip (default: PHASE_NUMBER). */
      phaseNumber?: number;
      /** Sub-phase label shown after the module chip (e.g. "2.1"). When provided, renders the two-chip style. */
      subPhaseLabel?: string;
      /**
       * Section tabs for phase-overview pages, which have no curriculum module to
       * derive them from. When provided, these drive the learn/apply tab rows and
       * the scroll-spy instead of getSubModuleGroups().
       */
      sections?: SubModule[];
      /** Hide the module/workshop title picker — e.g. Phase 1 hub where cards are the entry points. */
      hideModuleDropdown?: boolean;
    };

export function ModuleHeader(props: ModuleHeaderProps) {
  const { onNavigate, onBack, sectionStatus } = props;
  const isPhaseOverview = props.mode === "phase-overview";
  const currentModuleId = isPhaseOverview ? null : props.currentModuleId;
  const onSectionClick = isPhaseOverview ? undefined : props.onSectionClick;

  const overridePhaseLabel = isPhaseOverview
    ? (props as Extract<ModuleHeaderProps, { mode: "phase-overview" }>).phaseLabel
    : undefined;
  const overridePhaseNumber = isPhaseOverview
    ? (props as Extract<ModuleHeaderProps, { mode: "phase-overview" }>).phaseNumber
    : undefined;
  const subPhaseLabel = isPhaseOverview
    ? (props as Extract<ModuleHeaderProps, { mode: "phase-overview" }>).subPhaseLabel
    : undefined;
  // Phase-overview pages have no curriculum module to derive section tabs from,
  // so they pass their own list; module pages always use getSubModuleGroups().
  const overrideSections = isPhaseOverview
    ? (props as Extract<ModuleHeaderProps, { mode: "phase-overview" }>).sections
    : undefined;
  const hideModuleDropdown = isPhaseOverview
    ? (props as Extract<ModuleHeaderProps, { mode: "phase-overview" }>).hideModuleDropdown ?? false
    : false;

  const workshopDisplayLabel = overridePhaseLabel
    ? overridePhaseLabel.replace(/^(Phase|Module) \d+: /, "")
    : WORKSHOP_LABEL;

  const current = currentModuleId ? getModule(currentModuleId) : null;
  const pageTitle = isPhaseOverview
    ? (overridePhaseLabel ? overridePhaseLabel.replace(/^(Phase|Module) \d+: /, "") : "Foundational AI Training")
    : current!.title;
  // Picker button shows WHERE YOU ARE: the current module on module pages, the
  // workshop name on the phase-overview page. The trailing page-title span was
  // removed because it duplicated this label; the dropdown adds workshop context.
  const pickerLabel = isPhaseOverview ? workshopDisplayLabel : current!.title;
  // User-facing: Phase → Module, Module → Sub-module.
  // Split into two chips so Module (context) ≠ Sub-module (you are here).
  const activePhaseNumber = overridePhaseNumber ?? PHASE_NUMBER;
  const progressChips = isPhaseOverview
    ? { module: `Module ${activePhaseNumber}`, subModule: subPhaseLabel ?? null as string | null }
    : {
        module: `Module ${PHASE_NUMBER}`,
        // Plan numbering — {phaseNumber}.{moduleOrder} e.g. "1.3" = phase 1, 3rd module.
        subModule: `${PHASE_NUMBER}.${current!.order}`,
      };
  const statusText = sectionStatus;

  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [subnavHeight, setSubnavHeight] = useState(SUBNAV_SCROLL_OFFSET);
  const groups = currentModuleId ? getSubModuleGroups(currentModuleId) : { learn: [], apply: [] };
  const effectiveSections = overrideSections ?? [];
  const learn = effectiveSections.length > 0 ? effectiveSections.filter((s) => s.group === "learn") : groups.learn;
  const apply = effectiveSections.length > 0 ? effectiveSections.filter((s) => s.group === "apply") : groups.apply;
  const showSectionTabs =
    (isPhaseOverview && effectiveSections.length > 0) ||
    (!isPhaseOverview && !!current?.supportsInPageNav && (groups.learn.length > 0 || groups.apply.length > 0));
  const spySectionIds = effectiveSections.length > 0
    ? effectiveSections.map((s) => s.id)
    : (onSectionClick || !current ? [] : current.subModules.map((s) => s.id));
  const activeSectionId = useScrollSpy(spySectionIds, subnavHeight);

  useLayoutEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const update = () => {
      const height = el.offsetHeight;
      setSubnavHeight(height);
      syncSubnavScrollOffset(height);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [showSectionTabs, pageTitle]);

  useEffect(() => {
    if (!pickerOpen) return;
    function onDocClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPickerOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pickerOpen]);

  return (
    <div
      ref={stickyRef}
      className="ey-module-header-sticky"
      style={{ position: "sticky", top: 0, zIndex: 300, width: "100%" }}
    >
      {/* ── Level 2: breadcrumb + progress — fluid padding, collapses on narrow screens ── */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 md:gap-4 px-4 sm:px-6 md:px-10 py-3"
        style={{
          background: colors.confidentBlack,
          borderBottom: `1px solid ${colors.offBlack}`,
        }}
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="flex items-center gap-2 shrink-0"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              borderRadius: 4,
            }}
            aria-label={`Back to ${BRAND_LABEL}`}
            onFocus={applyFocusRing}
            onBlur={clearFocusRing}
          >
            <YellowBackArrow />
            <span
              className="hidden sm:inline"
              style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.yellow, whiteSpace: "nowrap" }}
            >
              {BRAND_LABEL}
            </span>
          </button>

          {!hideModuleDropdown && (
            <>
              <span className="hidden sm:inline shrink-0" aria-hidden="true">
                <ChevronSep />
              </span>

              <div ref={pickerRef} className="relative min-w-0">
                <button
                  onClick={() => setPickerOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={pickerOpen}
                  className="flex items-center gap-2 min-w-0 max-w-[min(100%,260px)] sm:max-w-none"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    borderRadius: 4,
                    fontFamily: fonts.bold,
                    fontSize: 14,
                    color: colors.yellow,
                  }}
                  onFocus={applyFocusRing}
                  onBlur={clearFocusRing}
                >
                  {isPhaseOverview && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        fontSize: 11,
                        fontFamily: fonts.bold,
                        background: colors.yellow,
                        color: colors.offBlack,
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      {activePhaseNumber}
                    </span>
                  )}
                  {!isPhaseOverview && current && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        fontSize: 11,
                        fontFamily: fonts.bold,
                        background: colors.yellow,
                        color: colors.offBlack,
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      {current.order}
                    </span>
                  )}
                  <span className="truncate">{pickerLabel}</span>
                  <span
                    style={{
                      fontSize: 8,
                      color: colors.yellow,
                      transform: pickerOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.15s",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>

                {pickerOpen && (
                  <ModulePickerMenu
                    isPhaseOverview={isPhaseOverview}
                    currentModuleId={currentModuleId}
                    onNavigate={onNavigate}
                    onClose={() => setPickerOpen(false)}
                  />
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <ProgressChipGroup moduleLabel={progressChips.module} subModuleLabel={progressChips.subModule} />
          {statusText && (
            <div className="hidden md:flex items-center gap-2">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: colors.yellow,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <span style={{ color: colors.white, fontFamily: fonts.regular, fontSize: 12, whiteSpace: "nowrap" }}>
                {statusText}
              </span>
            </div>
          )}
        </div>
      </div>

      {showSectionTabs && (
        <nav
          aria-label={`${pageTitle} sections`}
          className="flex items-end gap-6 md:gap-8 overflow-x-auto px-4 sm:px-6 md:px-10 pt-2.5"
          style={{
            background: colors.offWhite,
            borderBottom: "1px solid rgba(46,46,56,0.1)",
          }}
        >
          {learn.length > 0 && (
            <TabCluster label="Learn" items={learn} activeSectionId={activeSectionId} onSectionClick={onSectionClick} />
          )}
          {learn.length > 0 && apply.length > 0 && (
            <div className="hidden sm:block w-px self-stretch mb-2.5" style={{ background: "rgba(46,46,56,0.12)" }} aria-hidden="true" />
          )}
          {apply.length > 0 && (
            <TabCluster label="Apply" items={apply} activeSectionId={activeSectionId} onSectionClick={onSectionClick} />
          )}
        </nav>
      )}
    </div>
  );
}

/**
 * Orientation chip group — Module (quiet context) + Sub-module (yellow = here).
 * Pulses once when labels change. Respects prefers-reduced-motion.
 */
function ProgressChipGroup({
  moduleLabel,
  subModuleLabel,
}: {
  moduleLabel: string;
  subModuleLabel: string | null;
}) {
  const liveKey = subModuleLabel ? `${moduleLabel}|${subModuleLabel}` : moduleLabel;
  const [displayModule, setDisplayModule] = useState(moduleLabel);
  const [displaySub, setDisplaySub] = useState(subModuleLabel);
  const [pulse, setPulse] = useState(false);
  const [fade, setFade] = useState(false);
  const prevKey = useRef(liveKey);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (liveKey === prevKey.current) return;
    prevKey.current = liveKey;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (reduceMotion) {
      setDisplayModule(moduleLabel);
      setDisplaySub(subModuleLabel);
      setPulse(false);
      setFade(false);
      return;
    }

    setFade(true);
    timers.current.push(
      setTimeout(() => {
        setDisplayModule(moduleLabel);
        setDisplaySub(subModuleLabel);
        setFade(false);
        setPulse(true);
        timers.current.push(setTimeout(() => setPulse(false), 200));
      }, 100),
    );
  }, [liveKey, moduleLabel, subModuleLabel]);

  const chipBase: CSSProperties = {
    borderRadius: 12,
    padding: "6px 12px",
    fontSize: 12,
    whiteSpace: "nowrap",
    lineHeight: 1.2,
  };

  const announce = displaySub ? `${displayModule}, ${displaySub}` : displayModule;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={announce}
      className="flex items-center shrink-0"
      style={{
        gap: 6,
        transform: pulse ? "scale(1.03)" : "scale(1)",
        opacity: fade ? 0.4 : 1,
        transition: "transform 200ms ease, opacity 100ms ease",
        transformOrigin: "right center",
      }}
    >
      {/* Context — quieter on dark bar so it doesn't fight the yellow chip */}
      <span
        style={{
          ...chipBase,
          background: displaySub ? "rgba(255,255,255,0.08)" : colors.yellow,
          border: displaySub ? `1px solid ${colors.borderOnDark}` : "none",
          color: displaySub ? colors.gray02 : colors.confidentBlack,
          fontFamily: displaySub ? fonts.regular : fonts.bold,
        }}
      >
        {displayModule}
      </span>
      {displaySub && (
        <>
          <span
            aria-hidden="true"
            style={{ color: colors.gray01, fontSize: 11, fontFamily: fonts.regular, userSelect: "none" }}
          >
            ›
          </span>
          {/* You-are-here — plain EY Yellow text, no pill (plan number reads as a label, not a badge) */}
          <span
            style={{
              fontSize: 12,
              whiteSpace: "nowrap",
              lineHeight: 1.2,
              color: colors.yellow,
              fontFamily: fonts.bold,
            }}
          >
            {displaySub}
          </span>
        </>
      )}
    </div>
  );
}

function YellowBackArrow() {
  // SVG arrow — text "←" sits off-centre once EY Interstate loads (glyph metrics).
  // Vector keeps optical centre identical on every ModuleHeader screen.
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        borderRadius: "50%",
        border: `1.5px solid ${colors.yellow}`,
        color: colors.yellow,
        flexShrink: 0,
        boxSizing: "border-box",
      }}
      aria-hidden="true"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", flexShrink: 0 }}
      >
        <path
          d="M7.5 2.5L4 6l3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ChevronSep() {
  return (
    <span style={{ color: colors.gray01, fontSize: 14, flexShrink: 0 }} aria-hidden="true">
      ›
    </span>
  );
}

/** Scroll to `#section` after cross-module navigation (hash in URL). */
export function useModuleSectionHashScroll(onSectionClick?: (sectionId: string) => void) {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const scrollToSection = () => {
      if (onSectionClick) {
        onSectionClick(hash);
        return;
      }
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const timer = window.setTimeout(scrollToSection, 120);
    return () => window.clearTimeout(timer);
  }, [onSectionClick]);
}

function ModulePickerMenu({
  isPhaseOverview,
  currentModuleId,
  onNavigate,
  onClose,
}: {
  isPhaseOverview: boolean;
  currentModuleId: ModuleId | null;
  onNavigate: (path: string) => void;
  onClose: () => void;
}) {
  const phase = getCurrentPhase();

  const goToModule = (mod: CurriculumModule) => {
    if (!isModuleAvailable(mod)) return;
    onClose();
    if (mod.id !== currentModuleId) onNavigate(mod.path);
  };

  return (
    <div
      role="menu"
      aria-label="Jump to module"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        minWidth: 280,
        maxWidth: "min(92vw, 360px)",
        background: colors.confidentBlack,
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: 8,
        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        padding: 6,
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        maxHeight: "min(70vh, 480px)",
      }}
    >
      {/* Workshop context — anchors the module list below it. */}
      <div
        style={{
          padding: "8px 10px 6px",
          fontFamily: fonts.bold,
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: colors.yellow,
          lineHeight: 1.2,
        }}
      >
        {WORKSHOP_LABEL}
      </div>

      <PickerItem
        label="Workshop overview"
        isCurrent={isPhaseOverview}
        order={null}
        onClick={() => {
          onClose();
          if (!isPhaseOverview) onNavigate(phase.path);
        }}
      />

      <div
        style={{
          overflowY: "auto",
          marginTop: 4,
          paddingTop: 4,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          flex: 1,
          minHeight: 0,
        }}
      >
        {phase.modules.filter(isModuleAvailable).map((mod) => (
          <PickerItem
            key={mod.id}
            label={mod.title}
            isCurrent={mod.id === currentModuleId}
            order={mod.order}
            disabled={!isModuleAvailable(mod)}
            meta={isModuleAvailable(mod) ? undefined : "Coming soon"}
            onClick={() => goToModule(mod)}
          />
        ))}
      </div>
    </div>
  );
}

function PickerItem({
  label,
  isCurrent,
  order,
  onClick,
  disabled = false,
  meta,
  style,
}: {
  label: string;
  isCurrent: boolean;
  order: number | null;
  onClick: () => void;
  disabled?: boolean;
  meta?: string;
  style?: CSSProperties;
}) {
  return (
    <button
      role="menuitem"
      aria-current={isCurrent ? "page" : undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: isCurrent ? "rgba(255,230,0,0.1)" : "none",
        border: "none",
        borderRadius: 6,
        padding: "10px 10px",
        cursor: disabled ? "not-allowed" : isCurrent ? "default" : "pointer",
        textAlign: "left",
        fontFamily: isCurrent ? fonts.bold : fonts.regular,
        fontSize: 13,
        color: disabled ? colors.gray01 : isCurrent ? colors.yellow : colors.white,
        opacity: disabled ? 0.55 : 1,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!isCurrent && !disabled) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      }}
      onMouseLeave={(e) => {
        if (!isCurrent && !disabled) e.currentTarget.style.background = "none";
      }}
      onFocus={applyFocusRing}
      onBlur={clearFocusRing}
    >
      {order !== null && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: "50%",
            fontSize: 11,
            fontFamily: fonts.bold,
            background: isCurrent ? colors.yellow : "rgba(255,255,255,0.12)",
            color: isCurrent ? colors.offBlack : "rgba(255,255,255,0.7)",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {order}
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>{label}</span>
      {meta ? (
        <span
          style={{
            fontSize: 10,
            color: colors.gray01,
            fontFamily: fonts.regular,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {meta}
        </span>
      ) : null}
    </button>
  );
}

function TabCluster({
  label,
  items,
  activeSectionId,
  onSectionClick,
}: {
  label: string;
  items: { id: string; label: string }[];
  activeSectionId: string | null;
  onSectionClick?: (sectionId: string) => void;
}) {
  const clusterLabelStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    flexShrink: 0,
    fontFamily: fonts.bold,
    fontSize: 13,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: colors.offBlack,
    background: colors.white,
    border: `1px solid ${colors.gray02}`,
    borderRadius: 999,
    padding: "6px 14px",
    lineHeight: 1.2,
    marginBottom: 10,
    boxShadow: "0 1px 2px rgba(26, 26, 36, 0.06)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 16,
        flexShrink: 0,
      }}
    >
      <span aria-hidden="true" style={clusterLabelStyle}>
        {label}
      </span>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
        {items.map((item) => {
          const isActive = item.id === activeSectionId;
          const tabStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            paddingBottom: 10,
            background: "none",
            border: "none",
            color: isActive ? colors.offBlack : colors.gray01,
            fontFamily: isActive ? fonts.bold : fonts.regular,
            fontSize: 14,
            whiteSpace: "nowrap",
            textDecoration: "none",
            cursor: "pointer",
            borderBottom: isActive ? `3px solid ${colors.yellow}` : "3px solid transparent",
            transition: "color 0.15s, border-color 0.15s",
          };
          return onSectionClick ? (
            <button
              key={item.id}
              onClick={() => onSectionClick(item.id)}
              style={tabStyle}
              onFocus={applyFocusRing}
              onBlur={clearFocusRing}
            >
              {item.label}
            </button>
          ) : (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              style={tabStyle}
              onFocus={applyFocusRing}
              onBlur={clearFocusRing}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/** Highlights the section tab whose content is currently most visible under the sticky header. */
function useScrollSpy(sectionIds: string[], scrollOffset: number): string | null {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);

  useEffect(() => {
    if (sectionIds.length === 0) return;
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topMost.target.id);
        }
      },
      { rootMargin: `-${scrollOffset}px 0px -60% 0px`, threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds.join(","), scrollOffset]);

  return activeId;
}

/**
 * Previous / Next module footer control — placed at the bottom of a module's
 * content so users can move forward or back without scrolling to the top bar.
 */
export function ModulePrevNext({
  currentModuleId,
  onNavigate,
  onBack,
}: {
  currentModuleId: ModuleId;
  onNavigate: (path: string) => void;
  onBack: () => void;
}) {
  const { prev, next } = getAdjacentModules(currentModuleId);

  return (
    <nav
      aria-label="Previous and next module"
      style={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        gap: 16,
        padding: "28px 32px",
        background: colors.offWhite,
        borderTop: "1px solid rgba(46,46,56,0.08)",
        flexWrap: "wrap",
      }}
    >
      {prev ? (
        <PrevNextButton direction="prev" title={prev.title} onClick={() => onNavigate(prev.path)} />
      ) : (
        <PrevNextButton direction="prev" title={`Module ${PHASE_NUMBER} Overview`} onClick={onBack} />
      )}
      {next ? (
        <PrevNextButton direction="next" title={next.title} onClick={() => onNavigate(next.path)} />
      ) : (
        <PrevNextButton direction="next" title={`Back to Module ${PHASE_NUMBER}`} onClick={onBack} />
      )}
    </nav>
  );
}

function PrevNextButton({
  direction,
  title,
  onClick,
}: {
  direction: "prev" | "next";
  title: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isNext = direction === "next";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isNext ? "flex-end" : "flex-start",
        textAlign: isNext ? "right" : "left",
        gap: 4,
        background: "none",
        border: "none",
        borderBottom: `2px solid ${hovered || focused ? colors.yellow : "transparent"}`,
        outline: focused ? FOCUS_RING : "none",
        outlineOffset: 2,
        cursor: "pointer",
        padding: "4px 2px 8px",
        minWidth: 180,
        marginLeft: isNext ? "auto" : 0,
      }}
    >
      <span style={{ color: colors.gray01, fontFamily: fonts.regular, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {isNext ? "Next" : "Previous"}
      </span>
      <span style={{ color: colors.offBlack, fontFamily: fonts.bold, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
        {!isNext && "←"} {title} {isNext && "→"}
      </span>
    </button>
  );
}
