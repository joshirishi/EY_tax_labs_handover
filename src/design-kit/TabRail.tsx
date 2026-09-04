import { colors, fonts } from './tokens';

/** Light segmented control used on Phase 3 (and optional on-dark variant). */
export function TabRail<T extends string>({
  tabs,
  active,
  onChange,
  onDark = false,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  onDark?: boolean;
}) {
  const focusRing = `2px solid ${colors.yellow}`;
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        background: onDark ? colors.surfaceOnDark : colors.offWhite,
        border: onDark ? `1px solid ${colors.borderOnDark}` : `1px solid rgba(46,46,56,0.10)`,
        borderRadius: 8,
        padding: 4,
        gap: 4,
        marginBottom: 24,
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{
              padding: "9px 18px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background: isActive ? (onDark ? colors.yellow : colors.confidentBlack) : "transparent",
              color: isActive ? (onDark ? colors.confidentBlack : colors.white) : (onDark ? colors.onDarkMuted : colors.gray01),
              fontSize: 13,
              fontWeight: isActive ? 700 : 400,
              fontFamily: isActive ? fonts.bold : fonts.regular,
              transition: "background 150ms ease, color 150ms ease",
              whiteSpace: "nowrap",
            }}
            onFocus={(e) => { e.currentTarget.style.outline = focusRing; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
