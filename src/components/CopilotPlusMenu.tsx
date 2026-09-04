import { useState, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AtSign,
  ChevronRight,
  Globe,
  Image,
  LineChart,
  Paperclip,
  Plus,
  ScanLine,
  Share2,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { colors, fonts as F } from "../design-kit/tokens";

const C = colors;
const line = `color-mix(in srgb, ${C.gray02} 50%, ${C.white})`;

type MenuRow = { label: string; icon: LucideIcon; chevron?: boolean; capabilities?: boolean };

const PRIMARY_ROWS: MenuRow[] = [
  { label: "Add content", icon: Paperclip },
  { label: "Upload", icon: Upload, chevron: true },
  { label: "Take screenshot", icon: ScanLine, chevron: true },
];

const MID_ROWS: MenuRow[] = [
  { label: "Add capabilities", icon: SlidersHorizontal, chevron: true, capabilities: true },
  { label: "Chat with an agent", icon: AtSign },
];

const BOTTOM_ROWS: MenuRow[] = [
  { label: "Change data sources", icon: Share2 },
];

const CAPABILITY_ROWS: MenuRow[] = [
  { label: "Research a topic", icon: Globe },
  { label: "Analyze data", icon: LineChart },
  { label: "Generate an image", icon: Image },
];

function MenuItem({ row, active }: { row: MenuRow; active?: boolean }) {
  const Icon = row.icon;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        background: active ? `color-mix(in srgb, ${C.gray02} 35%, ${C.white})` : "transparent",
      }}
    >
      <Icon size={15} strokeWidth={1.75} color={C.offBlack} aria-hidden />
      <span style={{ flex: 1, fontFamily: F.regular, fontSize: 12, color: C.offBlack }}>{row.label}</span>
      {row.chevron ? <ChevronRight size={13} strokeWidth={1.75} color={C.gray01} aria-hidden /> : null}
    </div>
  );
}

export function CopilotPlusMenu({
  showCapabilitiesFlyout = true,
  menuTourId,
}: {
  showCapabilitiesFlyout?: boolean;
  menuTourId?: string;
}) {
  return (
    <div
      data-tour-id={menuTourId}
      style={{
        position: "absolute",
        left: 0,
        bottom: "calc(100% + 8px)",
        display: "flex",
        alignItems: "flex-start",
        zIndex: 8,
      }}
    >
      <div
        style={{
          width: 220,
          borderRadius: 12,
          border: `1px solid ${C.gray02}`,
          background: C.white,
          boxShadow: `0 12px 32px color-mix(in srgb, ${C.confidentBlack} 14%, transparent)`,
          overflow: "hidden",
          padding: "4px 0",
        }}
      >
        {PRIMARY_ROWS.map(row => (
          <MenuItem key={row.label} row={row} />
        ))}
        <div style={{ height: 1, background: line, margin: "4px 0" }} aria-hidden />
        {MID_ROWS.map(row => (
          <div key={row.label} style={{ position: "relative" }}>
            <MenuItem row={row} active={row.capabilities && showCapabilitiesFlyout} />
            {row.capabilities && showCapabilitiesFlyout ? (
              <div
                style={{
                  position: "absolute",
                  left: "calc(100% + 4px)",
                  top: 0,
                  width: 196,
                  borderRadius: 12,
                  border: `1px solid ${C.gray02}`,
                  background: C.white,
                  boxShadow: `0 12px 32px color-mix(in srgb, ${C.confidentBlack} 14%, transparent)`,
                  overflow: "hidden",
                  padding: "4px 0",
                }}
              >
                {CAPABILITY_ROWS.map(cap => (
                  <MenuItem key={cap.label} row={cap} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <div style={{ height: 1, background: line, margin: "4px 0" }} aria-hidden />
        {BOTTOM_ROWS.map(row => (
          <MenuItem key={row.label} row={row} />
        ))}
      </div>
    </div>
  );
}

export function CopilotPlusButton({
  open,
  defaultOpen = false,
  onOpenChange,
  showCapabilitiesFlyout = true,
  plusTourId,
  menuTourId,
  iconSize = 18,
  iconColor = C.offBlack,
  buttonStyle,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCapabilitiesFlyout?: boolean;
  plusTourId?: string;
  menuTourId?: string;
  iconSize?: number;
  iconColor?: string;
  buttonStyle?: CSSProperties;
}) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const controlled = open !== undefined;
  const menuOpen = controlled ? open : localOpen;

  const setMenuOpen = (next: boolean) => {
    if (!controlled) setLocalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <span data-tour-id={plusTourId} style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-label="Add content and capabilities"
        aria-expanded={menuOpen}
        onClick={e => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          ...buttonStyle,
        }}
      >
        <Plus size={iconSize} strokeWidth={1.75} color={iconColor} aria-hidden />
      </button>
      {menuOpen ? (
        <CopilotPlusMenu showCapabilitiesFlyout={showCapabilitiesFlyout} menuTourId={menuTourId} />
      ) : null}
    </span>
  );
}
