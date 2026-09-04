import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsRight,
  FileText,
  Globe,
  Info,
  Link2,
  Mail,
  Grid3x3,
  MessagesSquare,
  Mic,
  MoreHorizontal,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react";
import { colors, fonts as F } from "../design-kit/tokens";
import { CopilotPlusButton } from "./CopilotPlusMenu";
import { AgentHexIcon, AgentIcon, CopilotHex, type AgentIconKind } from "./AgentHexIcon";

const C = { ...colors, dark2: colors.offBlack };
const line = `color-mix(in srgb, ${C.gray02} 50%, ${C.white})`;
const FIGMA_W = 953;
const FIGMA_H = 530;
const REVEAL_MS = 3000;

type TourPhase = "preview" | "focus" | "recap";

type Placement = "left" | "right" | "top" | "bottom";
type CalloutRect = { left: number; top: number; width: number; height: number };
type Callout = {
  title: string;
  body: string;
  icon: LucideIcon;
  /** Matches data-tour-id on the real control — highlight is measured live. */
  target: string;
  placement: Placement;
  /** If the preferred side would sit off-canvas, use this instead of the opposite side. */
  fallbackPlacement?: Placement;
};

function boxEdgePoint(rect: CalloutRect, anchorLeft: number, anchorTop: number) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = anchorLeft - cx;
  const dy = anchorTop - cy;
  if (Math.abs(dx) * rect.height >= Math.abs(dy) * rect.width) {
    return { x: dx >= 0 ? rect.left + rect.width : rect.left, y: cy };
  }
  return { x: cx, y: dy >= 0 ? rect.top + rect.height : rect.top };
}

function cardTransform(placement: Placement): CSSProperties {
  switch (placement) {
    case "right":
      return { transform: "translate(10px, -50%)" };
    case "left":
      return { transform: "translate(calc(-100% - 10px), -50%)" };
    case "top":
      return { transform: "translate(-50%, calc(-100% - 10px))" };
    case "bottom":
      return { transform: "translate(-50%, 10px)" };
  }
}

type SlideKind = "teach" | "landing" | "instructions" | "knowledge";
type Slide = { label: string; kind: SlideKind; callouts: Callout[] };

/** Product chrome first so the Agent section opens on the Microsoft-style scene. */
const AGENT_TOUR_SLIDES: Slide[] = [
  {
    label: "New Agent",
    kind: "landing",
    callouts: [
      {
        title: "Researcher agent",
        body: "Prep a manufacturing client exploring global expansion — it pulls indirect tax, customs and transfer pricing, then returns a meeting-ready brief.",
        icon: Search,
        target: "researcher",
        placement: "right",
      },
      {
        title: "Analyst agent",
        body: "Ask it to analyse 12 months of GST filings. It finds patterns, late filings and high-risk periods, then builds the charts — minutes, not hours.",
        icon: BarChart3,
        target: "analyst",
        placement: "right",
      },
      {
        title: "New agent",
        body: "In the sidebar under Agents, choose New agent to start building a specialist for Indian tax workflows.",
        icon: Bot,
        target: "new-agent",
        placement: "right",
      },
      {
        title: "All your agents",
        body: "Every agent you use or create is listed here — Researcher, Analyst, and your tax specialists.",
        icon: Bot,
        target: "agents-list",
        placement: "right",
      },
      {
        title: "Describe your agent",
        body: "Type what the agent should do — or skip the chat and start from a template.",
        icon: PenLine,
        target: "describe",
        placement: "bottom",
      },
      {
        title: "Upload work content",
        body: "Attach files from the plus menu so the agent starts with your approved tax material.",
        icon: Upload,
        target: "upload-menu",
        placement: "left",
        fallbackPlacement: "bottom",
      },
      {
        title: "Sample templates",
        body: "Ready-made starters you can adapt — pick one instead of building from a blank page.",
        icon: FileText,
        target: "templates",
        placement: "top",
      },
      {
        title: "Agent store",
        body: "Find agents built by Microsoft, your organisation, and you — then open More agents.",
        icon: Search,
        target: "agent-store",
        placement: "right",
      },
    ],
  },
  {
    label: "What is an agent?",
    kind: "teach",
    callouts: [
      {
        title: "Chat vs agent",
        body: "Chat answers broadly. Agents help deeply within a defined workflow.",
        icon: Sparkles,
        target: "chat-vs-agent",
        placement: "top",
      },
    ],
  },
  {
    label: "Instructions",
    kind: "instructions",
    callouts: [
      {
        title: "Name your agent",
        body: "Give the agent a clear name so colleagues know the workflow it owns.",
        icon: PenLine,
        target: "agent-name",
        placement: "left",
      },
      {
        title: "Write instructions",
        body: "Say exactly how it should behave, the tone to use, and the tasks it must stay focused on.",
        icon: FileText,
        target: "instructions",
        placement: "left",
      },
      {
        title: "Choose the model",
        body: "Auto picks the best model for the task. Switch to a quicker reply or a deeper think when you need it.",
        icon: Sparkles,
        target: "model",
        placement: "left",
      },
    ],
  },
  {
    label: "Knowledge",
    kind: "knowledge",
    callouts: [
      {
        title: "Add knowledge sources",
        body: "Point the agent at approved files, SharePoint, meetings, emails, and websites so answers stay grounded.",
        icon: BookOpen,
        target: "knowledge-sources",
        placement: "left",
      },
      {
        title: "Org data sources",
        body: "Add connectors your organisation has enabled — only sources EY has approved for Copilot.",
        icon: Link2,
        target: "org-sources",
        placement: "left",
      },
      {
        title: "People and org chart",
        body: "Use org chart and profile data when the agent needs to answer people questions.",
        icon: Users,
        target: "org-chart",
        placement: "left",
      },
      {
        title: "Restrict the scope",
        body: "Turn on “Only use specified sources” when accuracy is critical — the agent stays inside your chosen material.",
        icon: ShieldCheck,
        target: "restrict-scope",
        placement: "left",
      },
    ],
  },
];

function useScaleToWidth(designWidth: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / designWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);
  return { ref, scale };
}

function NavRow({ icon, label, active }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 6,
        width: "100%",
        background: active ? `color-mix(in srgb, ${C.gray02} 40%, ${C.white})` : "transparent",
        cursor: "default",
      }}
    >
      <span style={{ width: 16, height: 16, display: "flex", flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          fontFamily: F.regular,
          fontSize: 13,
          color: C.dark2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function AgentRow({
  label,
  tourId,
  active,
  iconKind = "generic",
}: {
  label: string;
  tourId?: string;
  active?: boolean;
  iconKind?: AgentIconKind;
}) {
  return (
    <div
      data-tour-id={tourId}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 10px",
        borderRadius: 6,
        width: "100%",
        cursor: "default",
        background: active ? `color-mix(in srgb, ${C.gray02} 40%, ${C.white})` : "transparent",
      }}
    >
      <AgentIcon kind={iconKind} size={18} />
      <span style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
        {label}
      </span>
    </div>
  );
}

const SIDEBAR_W = 210;

function AgentSidebar({ highlightId }: { highlightId?: string }) {
  const icon = { size: 16, strokeWidth: 1.5, color: "#424242" } as const;
  return (
    <div
      style={{
        width: SIDEBAR_W,
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        borderRight: `1px solid #e5e5e5`,
        background: C.white,
        gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px", marginBottom: 8 }}>
        <span style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CopilotHex size={22} />
        </span>
        <span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Grid3x3 size={18} strokeWidth={1.5} color="#616161" aria-hidden />
        </span>
      </div>
      <NavRow icon={<PenLine {...icon} />} label="New chat" />
      <NavRow icon={<Search {...icon} />} label="Search" />
      <NavRow icon={<BookOpen {...icon} />} label="Library" />
      <div data-tour-id="agents-list" style={{ marginTop: 12, marginBottom: 2 }}>
        <span style={{ display: "block", padding: "0 10px", marginBottom: 2, fontFamily: F.regular, fontSize: 11, fontWeight: 600, color: "#757575" }}>
          Agents
        </span>
        <AgentRow label="Researcher" tourId="researcher" iconKind="researcher" active={highlightId === "researcher"} />
        <AgentRow label="Analyst" tourId="analyst" iconKind="analyst" active={highlightId === "analyst"} />
        <div
          data-tour-id="new-agent"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 10px",
            borderRadius: 6,
            width: "100%",
            cursor: "default",
            background: highlightId === "new-agent" ? `color-mix(in srgb, ${C.gray02} 40%, ${C.white})` : "transparent",
          }}
        >
          <AgentIcon kind="new-agent" size={18} />
          <span style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
            New agent
          </span>
        </div>
      </div>
      <div data-tour-id="agent-store" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", marginTop: 4 }}>
        <ChevronsRight size={14} strokeWidth={1.5} color={C.gray01} aria-hidden />
        <span style={{ fontFamily: F.regular, fontSize: 13, color: C.gray01 }}>More agents</span>
      </div>
    </div>
  );
}

function ScaledFrame({ label, children }: { label: string; children: ReactNode }) {
  const { ref, scale } = useScaleToWidth(FIGMA_W);
  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      style={{ width: "100%", aspectRatio: `${FIGMA_W} / ${FIGMA_H}`, position: "relative", overflow: "hidden", background: C.white }}
    >
      <div
        aria-hidden
        data-tour-canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: FIGMA_W,
          height: FIGMA_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          display: "flex",
          background: C.white,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function TeachCanvas() {
  const pillars = [
    {
      n: "1",
      title: "It knows the context",
      body: "Connect approved knowledge — files, SharePoint, or connectors — so answers stay grounded.",
    },
    {
      n: "2",
      title: "It follows instructions",
      body: "You define how it should behave, what style it should use, and which tasks it must focus on.",
    },
    {
      n: "3",
      title: "It can help act",
      body: "Depending on how it is built, it can retrieve, summarise, or trigger the next step in a workflow.",
    },
  ];
  return (
    <ScaledFrame label="What is an M365 Copilot agent">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 48px 28px", background: C.offWhite }}>
        <p style={{ margin: 0, fontFamily: F.bold, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gray01 }}>
          A simple mental model
        </p>
        <h3 style={{ margin: "10px 0 12px", fontFamily: F.bold, fontSize: 26, fontWeight: 700, color: C.dark2, lineHeight: 1.2 }}>
          What is an M365 Copilot agent?
        </h3>
        <p style={{ margin: "0 0 24px", fontFamily: F.regular, fontSize: 15, color: C.gray01, lineHeight: 1.5, maxWidth: 720 }}>
          An agent is a focused version of Copilot designed for a specific task, process, or knowledge area.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, flex: 1, minHeight: 0 }}>
          {pillars.map(p => (
            <div
              key={p.n}
              style={{
                background: C.white,
                border: `1px solid ${C.gray02}`,
                borderRadius: 14,
                padding: "20px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: C.yellow,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: F.bold,
                  fontSize: 13,
                  color: C.dark2,
                }}
              >
                {p.n}
              </span>
              <p style={{ margin: 0, fontFamily: F.bold, fontSize: 16, color: C.dark2, lineHeight: 1.3 }}>{p.title}</p>
              <p style={{ margin: 0, fontFamily: F.regular, fontSize: 13, color: C.gray01, lineHeight: 1.5 }}>{p.body}</p>
            </div>
          ))}
        </div>
        <div
          data-tour-id="chat-vs-agent"
          style={{
            marginTop: 20,
            padding: "14px 18px",
            borderRadius: 12,
            background: C.white,
            border: `1px solid ${C.gray02}`,
            boxShadow: `inset 4px 0 0 ${C.yellow}`,
          }}
        >
          <p style={{ margin: 0, fontFamily: F.bold, fontSize: 15, color: C.dark2, lineHeight: 1.4 }}>
            Chat answers broadly. Agents help deeply within a defined workflow.
          </p>
        </div>
      </div>
    </ScaledFrame>
  );
}

const TEMPLATES = [
  { title: "Tax Knowledge Retrieval", body: "Find, organise, and summarise opinions and notices into a short report.", color: C.frameBlue },
  { title: "Transfer Pricing Digest", body: "Highlights related-party trends, gaps, and audit-ready comparisons.", color: C.framePurple },
  { title: "Advance Tax Reviewer", body: "Compares quarter computations and drafts a management note.", color: C.frameGreen },
] as const;

function LandingCanvas({ onSkip, showPlusMenu, highlightId }: { onSkip: () => void; showPlusMenu?: boolean; highlightId?: string }) {
  return (
    <ScaledFrame label="M365 Copilot after clicking New Agent">
      <AgentSidebar highlightId={highlightId ?? "new-agent"} />
      <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", padding: "16px 40px 28px", background: C.white }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginBottom: 8 }}>
          <ShieldCheck size={18} strokeWidth={1.5} color="#107C10" aria-hidden />
          <MoreHorizontal size={18} strokeWidth={1.5} color={C.gray01} aria-hidden />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <CopilotHex size={44} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <p style={{ margin: 0, fontFamily: F.regular, fontSize: 22, color: C.offBlack, textAlign: "center" }}>
              Build your own specialist agent
            </p>
            <button
              type="button"
              onClick={onSkip}
              aria-label="Skip to configure your agent"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 12px",
                borderRadius: 999,
                border: `1px solid ${C.gray02}`,
                background: C.white,
                fontFamily: F.regular,
                fontSize: 12,
                color: C.offBlack,
                cursor: "pointer",
              }}
            >
              Skip <ChevronRight size={12} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
          <div
            data-tour-id="describe"
            style={{
              width: "100%",
              maxWidth: 560,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 16px",
              borderRadius: 28,
              border: `1px solid ${C.gray02}`,
              background: C.white,
              boxShadow: `0 2px 8px color-mix(in srgb, ${C.confidentBlack} 6%, transparent)`,
            }}
          >
            <CopilotPlusButton plusTourId="upload" menuTourId="upload-menu" open={showPlusMenu} iconSize={18} iconColor={C.offBlack} />
            <span style={{ flex: 1, fontFamily: F.regular, fontSize: 14, color: C.gray01 }}>Message Agent Builder</span>
            <Mic size={18} strokeWidth={1.5} color={C.offBlack} aria-hidden />
          </div>
          <div style={{ display: "inline-flex", padding: 3, borderRadius: 999, background: C.offWhite, border: `1px solid ${C.gray02}` }}>
            <span style={{ padding: "6px 14px", borderRadius: 999, background: C.offBlack, color: C.white, fontFamily: F.regular, fontSize: 12 }}>
              Templates
            </span>
            <span style={{ padding: "6px 14px", fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>My agents</span>
          </div>
          <div data-tour-id="templates" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%", maxWidth: 640 }}>
            {TEMPLATES.map(t => (
              <div
                key={t.title}
                style={{
                  border: `1px solid ${C.gray02}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                  background: C.white,
                  minHeight: 96,
                }}
              >
                <span aria-hidden style={{ width: 22, height: 22, borderRadius: 6, background: t.color, display: "block", marginBottom: 8 }} />
                <p style={{ margin: "0 0 6px", fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.offBlack }}>{t.title}</p>
                <p style={{ margin: 0, fontFamily: F.regular, fontSize: 11, color: C.gray01, lineHeight: 1.4 }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScaledFrame>
  );
}

function SlimRail() {
  return (
    <div
      style={{
        width: 52,
        flexShrink: 0,
        borderRight: `1px solid ${line}`,
        background: C.offWhite,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0",
        gap: 14,
      }}
    >
      <CopilotHex size={22} />
      <Plus size={16} strokeWidth={1.75} color={C.dark2} aria-hidden />
      <Search size={16} strokeWidth={1.75} color={C.dark2} aria-hidden />
      <BookOpen size={16} strokeWidth={1.75} color={C.dark2} aria-hidden />
      <span style={{ marginTop: "auto", width: 26, height: 26, borderRadius: 13, background: C.confidentBlack, color: C.white, fontFamily: F.bold, fontSize: 9, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        EY
      </span>
    </div>
  );
}

function BuilderChatPane() {
  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", padding: "16px 20px 20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <ShieldCheck size={14} strokeWidth={1.75} color={C.success} aria-hidden />
        <MoreHorizontal size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ margin: 0, fontFamily: F.regular, fontSize: 18, color: C.dark2, textAlign: "center" }}>
          Build your own specialist agent
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderRadius: 999,
          border: `1px solid ${C.gray02}`,
        }}
      >
        <CopilotPlusButton iconSize={14} iconColor={C.gray01} />
        <span style={{ flex: 1, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>Message Agent Builder</span>
        <Mic size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </div>
    </div>
  );
}

function ConfigureChrome({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: 520, flexShrink: 0, borderLeft: `1px solid ${line}`, display: "flex", flexDirection: "column", background: C.white, minWidth: 0, minHeight: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${line}` }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 999, border: `1px solid ${C.gray02}`, fontFamily: F.regular, fontSize: 11, color: C.dark2 }}>
          <CopilotHex size={14} /> Agent Builder
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.gray02}`, fontFamily: F.regular, fontSize: 11, color: C.dark2 }}>
          Configure <ChevronDown size={12} strokeWidth={1.75} aria-hidden />
        </span>
        <span style={{ flex: 1 }} />
        <Plus size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
        <MoreHorizontal size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
        <X size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </div>
      {children}
    </div>
  );
}

function InstructionsCanvas({ showModelMenu }: { showModelMenu: boolean }) {
  return (
    <ScaledFrame label="Agent Builder — name, instructions, and model">
      <SlimRail />
      <BuilderChatPane />
      <ConfigureChrome>
        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AgentHexIcon size={36} />
            <div data-tour-id="agent-name" style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: F.bold, fontSize: 18, color: C.dark2, display: "flex", alignItems: "center", gap: 6 }}>
                New Agent <PenLine size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
              </p>
              <p style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>Describe your agent</p>
            </div>
            <span data-tour-id="model" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>
              Auto <ChevronDown size={12} strokeWidth={1.75} aria-hidden />
              {showModelMenu && (
                <span
                  style={{
                    position: "absolute",
                    top: 22,
                    right: 0,
                    width: 200,
                    background: C.white,
                    border: `1px solid ${C.gray02}`,
                    borderRadius: 10,
                    boxShadow: `0 12px 28px color-mix(in srgb, ${C.confidentBlack} 14%, transparent)`,
                    padding: 8,
                    zIndex: 4,
                  }}
                >
                  {[
                    { t: "Auto", d: "Best model for the task", on: true },
                    { t: "Quick response", d: "Answers right away" },
                    { t: "Think deeper", d: "Thinks longer for better answers" },
                  ].map(m => (
                    <span key={m.t} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 8px", borderRadius: 8, background: m.on ? C.offWhite : "transparent" }}>
                      <span style={{ width: 14 }}>{m.on ? <Check size={12} strokeWidth={2} color={C.dark2} aria-hidden /> : null}</span>
                      <span>
                        <span style={{ display: "block", fontFamily: F.bold, fontSize: 11, color: C.dark2 }}>{m.t}</span>
                        <span style={{ display: "block", fontFamily: F.regular, fontSize: 10, color: C.gray01 }}>{m.d}</span>
                      </span>
                    </span>
                  ))}
                </span>
              )}
            </span>
          </div>
          <div data-tour-id="instructions" style={{ flex: 1, minHeight: 0, border: `1px solid ${C.gray02}`, borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: F.bold, fontSize: 13, color: C.dark2 }}>Instructions</span>
              <Info size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
            </div>
            <div style={{ flex: 1, border: `1px solid ${line}`, borderRadius: 8, padding: 12 }}>
              <p style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01, lineHeight: 1.5 }}>
                Describe what this agent should do, define its tone, and outline any rules or guidelines it must follow.
              </p>
            </div>
          </div>
          <div style={{ border: `1px solid ${C.gray02}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: F.bold, fontSize: 13, color: C.dark2, display: "inline-flex", alignItems: "center", gap: 6 }}>
              Knowledge <Info size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
            </span>
            <RefreshCw size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
          </div>
        </div>
      </ConfigureChrome>
    </ScaledFrame>
  );
}

function ToggleRow({ label, on, tourId }: { label: string; on?: boolean; tourId?: string }) {
  return (
    <div data-tour-id={tourId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontFamily: F.regular, fontSize: 12, color: C.dark2, display: "inline-flex", alignItems: "center", gap: 6 }}>
        {label} <Info size={12} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </span>
      <span
        aria-hidden
        style={{
          width: 32,
          height: 18,
          borderRadius: 999,
          background: on ? C.dark2 : C.gray02,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: on ? 16 : 2,
            width: 14,
            height: 14,
            borderRadius: 7,
            background: C.white,
          }}
        />
      </span>
    </div>
  );
}

function KnowledgeCanvas() {
  const sources = [
    { name: "SharePoint", Icon: FileText },
    { name: "Teams", Icon: MessagesSquare },
    { name: "Outlook", Icon: Mail },
    { name: "Web", Icon: Globe },
  ];
  const connectors = ["Adobe Experience Manager", "Azure DevOps", "Custom Connector", "ServiceNow Catalog", "ServiceNow Knowledge"];
  return (
    <ScaledFrame label="Agent Builder — knowledge sources">
      <SlimRail />
      <BuilderChatPane />
      <ConfigureChrome>
        <div data-tour-scroll style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0, overflowX: "hidden", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: F.bold, fontSize: 14, color: C.dark2, display: "inline-flex", alignItems: "center", gap: 6 }}>
              Knowledge <Info size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
            </span>
            <RefreshCw size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
          </div>
          <p style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>
            Choose the sources your agent will use to generate responses.
          </p>
          <div data-tour-id="knowledge-sources" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ margin: 0, fontFamily: F.regular, fontSize: 11, color: C.gray01 }}>Add files, meetings, chats, emails, and websites</p>
          <div style={{ display: "flex", gap: 8 }}>
            {sources.map(s => (
              <span key={s.name} title={s.name} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.gray02}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: C.dark2 }}>
                <s.Icon size={13} strokeWidth={1.75} aria-hidden />
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, border: `1px solid ${C.gray02}` }}>
            <span style={{ flex: 1, fontFamily: F.regular, fontSize: 11, color: C.gray01 }}>Enter a name, URL, email, or drop a file</span>
            <Upload size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
          </div>
          </div>
          <ToggleRow label="Search all websites" />
          <ToggleRow label="Only use specified sources" tourId="restrict-scope" />
          <ToggleRow label="Reference org chart and profile info" on tourId="org-chart" />
          <p style={{ margin: "4px 0 0", fontFamily: F.bold, fontSize: 12, color: C.dark2 }}>Add other data sources</p>
          <div data-tour-id="org-sources" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {connectors.map(name => (
              <span key={name} style={{ border: `1px solid ${C.gray02}`, borderRadius: 8, padding: "8px 8px", fontFamily: F.regular, fontSize: 10, color: C.dark2, lineHeight: 1.3 }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </ConfigureChrome>
    </ScaledFrame>
  );
}

function scrollTargetIntoPanel(frame: HTMLElement, target: string) {
  const el = frame.querySelector(`[data-tour-id="${target}"]`);
  if (!(el instanceof HTMLElement)) return;
  const scroller = el.closest("[data-tour-scroll]");
  if (!(scroller instanceof HTMLElement)) return;
  const panel = scroller.getBoundingClientRect();
  const box = el.getBoundingClientRect();
  const pad = 16;
  if (box.top < panel.top + pad) {
    scroller.scrollTop += box.top - panel.top - pad;
  } else if (box.bottom > panel.bottom - pad) {
    scroller.scrollTop += box.bottom - panel.bottom + pad;
  }
}

function measureTarget(frame: HTMLElement, target: string): CalloutRect | null {
  const el = frame.querySelector(`[data-tour-id="${target}"]`);
  if (!(el instanceof HTMLElement)) return null;
  const parent = frame.getBoundingClientRect();
  const box = el.getBoundingClientRect();
  if (parent.width < 2 || parent.height < 2 || box.width < 1) return null;
  const pad = 6;
  return {
    left: ((box.left - parent.left - pad) / parent.width) * 100,
    top: ((box.top - parent.top - pad) / parent.height) * 100,
    width: ((box.width + pad * 2) / parent.width) * 100,
    height: ((box.height + pad * 2) / parent.height) * 100,
  };
}

function cardAnchor(rect: CalloutRect, placement: Placement) {
  if (placement === "right") return { left: rect.left + rect.width, top: rect.top + rect.height / 2 };
  if (placement === "left") return { left: rect.left, top: rect.top + rect.height / 2 };
  if (placement === "top") return { left: rect.left + rect.width / 2, top: rect.top };
  return { left: rect.left + rect.width / 2, top: rect.top + rect.height };
}

/** Keep the card on-canvas. For the plus-menu step, never flip to the right (that is where the flyout sits). */
function safePlacement(rect: CalloutRect, placement: Placement, fallback?: Placement): Placement {
  if (placement === "top" && rect.top < 24) return fallback ?? "bottom";
  if (placement === "bottom" && rect.top + rect.height > 76) return fallback ?? "top";
  if (placement === "right" && rect.left + rect.width > 70) return fallback ?? "left";
  if (placement === "left" && rect.left < (fallback === "bottom" ? 36 : 30)) return fallback ?? "right";
  return placement;
}

const CALLOUT_RING_SHADOW = `4px 4px 0 0 color-mix(in srgb, ${C.confidentBlack} 88%, transparent)`;

function CalloutBox({
  callout,
  active,
  stepNum,
  frame,
  onNext,
  isLast,
}: {
  callout: Callout;
  active: boolean;
  stepNum: number;
  frame: HTMLElement | null;
  onNext: () => void;
  isLast: boolean;
}) {
  const Icon = callout.icon;
  const [rect, setRect] = useState<CalloutRect | null>(null);

  useLayoutEffect(() => {
    if (!frame || !active) {
      setRect(null);
      return;
    }
    const update = () => {
      scrollTargetIntoPanel(frame, callout.target);
      setRect(measureTarget(frame, callout.target));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    const later = window.setTimeout(update, 80);
    const later2 = window.setTimeout(update, 220);
    const later3 = window.setTimeout(update, 400);
    return () => {
      ro.disconnect();
      window.clearTimeout(later);
      window.clearTimeout(later2);
      window.clearTimeout(later3);
    };
  }, [frame, callout.target, active]);

  if (!rect) return null;
  const placement = safePlacement(rect, callout.placement, callout.fallbackPlacement);
  const anchor = cardAnchor(rect, placement);
  const edge = boxEdgePoint(rect, anchor.left, anchor.top);
  return (
    <div
      role="note"
      aria-hidden={!active}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: active ? 20 : 5,
        opacity: active ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.4s ease",
        background: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        filter: "none",
      }}
    >
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <line x1={edge.x} y1={edge.y} x2={anchor.left} y2={anchor.top} stroke={C.offBlack} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: `${rect.left}%`,
          top: `${rect.top}%`,
          width: `${rect.width}%`,
          height: `${rect.height}%`,
          boxSizing: "border-box",
          border: `2px solid ${C.yellow}`,
          borderRadius: 4,
          background: "transparent",
          boxShadow: CALLOUT_RING_SHADOW,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${anchor.left}%`,
          top: `${anchor.top}%`,
          width: "min(280px, 42vw)",
          background: C.white,
          border: `1.5px solid ${C.yellow}`,
          borderRadius: 12,
          padding: "14px 16px",
          boxShadow: `0 12px 32px color-mix(in srgb, ${C.confidentBlack} 18%, transparent)`,
          pointerEvents: "auto",
          ...cardTransform(placement),
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span
            style={{
              width: 28,
              height: 28,
              minWidth: 28,
              borderRadius: 8,
              background: C.yellow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.dark2,
              fontFamily: F.bold,
              fontSize: 12,
            }}
          >
            {stepNum}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Icon size={15} strokeWidth={1.75} color={C.dark2} aria-hidden />
              <p style={{ fontFamily: F.bold, fontSize: 14, fontWeight: 700, color: C.dark2, margin: 0, lineHeight: 1.3 }}>
                {callout.title}
              </p>
            </div>
            <p style={{ fontFamily: F.regular, fontSize: 13, color: C.gray01, margin: 0, lineHeight: 1.5 }}>{callout.body}</p>
          </div>
        </div>
        {!isLast && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button
              type="button"
              onClick={onNext}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 999, border: "none", background: C.yellow, color: C.dark2, fontFamily: F.bold, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
            >
              Next <ChevronRight size={13} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SlideCanvas({
  slide,
  calloutIndex,
  onSkipLanding,
}: {
  slide: Slide;
  calloutIndex: number;
  onSkipLanding: () => void;
}) {
  if (slide.kind === "teach") return <TeachCanvas />;
  if (slide.kind === "landing") {
    const activeTarget = slide.callouts[calloutIndex]?.target;
    return <LandingCanvas onSkip={onSkipLanding} showPlusMenu={activeTarget === "upload-menu"} highlightId={activeTarget} />;
  }
  if (slide.kind === "instructions") return <InstructionsCanvas showModelMenu={calloutIndex === 2} />;
  return <KnowledgeCanvas />;
}

/** Chip indices on the M365 Agent CopilotScene (0 = What are agents, 5–7 = Agents group). */
export function destinationForAgentUseCase(idx: number): { slide: number; callout: number } | null {
  if (idx === 0) {
    const slide = AGENT_TOUR_SLIDES.findIndex(s => s.kind === "teach");
    return slide >= 0 ? { slide, callout: 0 } : null;
  }
  const landing = AGENT_TOUR_SLIDES.findIndex(s => s.kind === "landing");
  if (landing < 0) return null;
  const targets = AGENT_TOUR_SLIDES[landing].callouts;
  const byTarget = (id: string) => {
    const callout = targets.findIndex(c => c.target === id);
    return callout >= 0 ? { slide: landing, callout } : null;
  };
  if (idx === 5) return byTarget("researcher");
  if (idx === 6) return byTarget("analyst");
  if (idx === 7) return byTarget("new-agent");
  return null;
}

function agentTourUseCaseIndex(slideKind: SlideKind, target: string): number {
  if (slideKind === "teach") return 0;
  if (target === "researcher") return 5;
  if (target === "analyst") return 6;
  return 7;
}

export function M365AgentSlideTour({
  onHighlightUseCase,
  jump,
}: {
  onHighlightUseCase?: (index: number) => void;
  jump?: { n: number; idx: number } | null;
} = {}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [calloutIndex, setCalloutIndex] = useState(0);
  const [phase, setPhase] = useState<TourPhase>("focus");
  const tourRef = useRef<HTMLDivElement>(null);
  const enterModeRef = useRef<"preview" | "focus">("preview");
  const appliedJumpN = useRef(0);
  const [frameEl, setFrameEl] = useState<HTMLDivElement | null>(null);

  if (jump && jump.n !== appliedJumpN.current) {
    const dest = destinationForAgentUseCase(jump.idx);
    appliedJumpN.current = jump.n;
    if (dest) {
      enterModeRef.current = "focus";
      setSlideIndex(dest.slide);
      setCalloutIndex(dest.callout);
    }
  }

  const slide = AGENT_TOUR_SLIDES[slideIndex];
  const totalSlides = AGENT_TOUR_SLIDES.length;
  const totalCallouts = slide.callouts.length;
  const isFirstCallout = calloutIndex === 0;
  const isLastCallout = calloutIndex === totalCallouts - 1;
  const isFirstSlide = slideIndex === 0;
  const isLastSlide = slideIndex === totalSlides - 1;
  const hasFocusTour = slide.kind !== "teach";
  const tourComplete = isLastSlide && isLastCallout && phase === "recap";
  const skipGate = slide.kind === "landing" && phase !== "preview" && (isLastCallout || phase === "recap");

  const openSlide = useCallback((index: number, callout: number, mode: "preview" | "focus") => {
    enterModeRef.current = mode;
    setSlideIndex(index);
    setCalloutIndex(callout);
  }, []);

  const skipLanding = useCallback(() => {
    const next = AGENT_TOUR_SLIDES.findIndex(s => s.kind === "instructions");
    if (next >= 0) openSlide(next, 0, "preview");
  }, [openSlide]);

  const currentTarget = slide.callouts[Math.min(calloutIndex, Math.max(0, totalCallouts - 1))]?.target ?? "";

  useEffect(() => {
    onHighlightUseCase?.(agentTourUseCaseIndex(slide.kind, currentTarget));
  }, [slide.kind, currentTarget, onHighlightUseCase]);

  useEffect(() => {
    if (!hasFocusTour) {
      setPhase("focus");
      return;
    }
    setPhase(enterModeRef.current);
  }, [slideIndex, hasFocusTour]);

  useEffect(() => {
    if (!hasFocusTour) return;
    if (phase === "preview") {
      const t = window.setTimeout(() => setPhase("focus"), REVEAL_MS);
      return () => window.clearTimeout(t);
    }
    if (slide.kind === "landing" && isLastCallout && phase === "focus") {
      const t = window.setTimeout(() => setPhase("recap"), REVEAL_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === "recap" && !isLastSlide && slide.kind !== "landing") {
      const t = window.setTimeout(() => openSlide(slideIndex + 1, 0, "preview"), REVEAL_MS);
      return () => window.clearTimeout(t);
    }
  }, [phase, hasFocusTour, isLastSlide, isLastCallout, openSlide, slideIndex, slide.kind]);

  const goNext = useCallback(() => {
    if (hasFocusTour && phase === "preview") {
      setPhase("focus");
      return;
    }
    if (skipGate) return;
    if (phase === "recap") {
      if (!isLastSlide) openSlide(slideIndex + 1, 0, "focus");
      return;
    }
    if (!isLastCallout) {
      setCalloutIndex(i => i + 1);
      return;
    }
    if (hasFocusTour) {
      setPhase("recap");
      return;
    }
    if (!isLastSlide) openSlide(slideIndex + 1, 0, "preview");
  }, [hasFocusTour, phase, skipGate, isLastCallout, isLastSlide, openSlide, slideIndex]);

  const goPrev = useCallback(() => {
    if (phase === "recap") {
      setPhase("focus");
      return;
    }
    if (phase === "preview" || isFirstCallout) {
      if (isFirstSlide) return;
      const prev = slideIndex - 1;
      openSlide(prev, Math.max(0, AGENT_TOUR_SLIDES[prev].callouts.length - 1), "focus");
      return;
    }
    setCalloutIndex(i => i - 1);
  }, [phase, isFirstCallout, isFirstSlide, slideIndex, openSlide]);

  const restart = useCallback(() => {
    enterModeRef.current = "focus";
    setSlideIndex(0);
    setCalloutIndex(0);
    setPhase("focus");
    tourRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!tourRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (!tourComplete) goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!isFirstSlide || !isFirstCallout || phase === "recap") goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, tourComplete, isFirstSlide, isFirstCallout, phase]);

  return (
    <div
      ref={tourRef}
      tabIndex={0}
      role="region"
      aria-label="M365 Copilot Agent feature walkthrough"
      aria-roledescription="carousel"
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16, outline: "none" }}
    >
      <div ref={setFrameEl} style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${C.gray02}`,
            background: C.white,
            boxShadow: `0 16px 40px color-mix(in srgb, ${C.confidentBlack} 10%, transparent)`,
          }}
        >
          <SlideCanvas slide={slide} calloutIndex={calloutIndex} onSkipLanding={skipLanding} />
        </div>
        {hasFocusTour &&
          slide.callouts.map((c, i) => (
            <CalloutBox
              key={`${slideIndex}-${c.title}`}
              callout={c}
              active={(phase === "focus" || (phase === "recap" && slide.kind === "landing")) && i === calloutIndex}
              stepNum={i + 1}
              frame={frameEl}
              onNext={goNext}
              isLast={tourComplete || skipGate}
            />
          ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0 0" }}>
        <button type="button" onClick={goPrev} disabled={isFirstSlide && isFirstCallout && phase !== "recap"} aria-label="Previous step" style={navBtnStyle(isFirstSlide && isFirstCallout && phase !== "recap")}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
          Previous
        </button>
        {tourComplete ? (
          <button type="button" onClick={restart} aria-label="Restart tour" style={primaryBtnStyle}>
            Restart tour
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={skipGate}
            aria-label={skipGate ? "Press Skip in the window to continue" : isLastCallout && !isLastSlide ? "Next page" : "Next step"}
            style={{ ...primaryBtnStyle, opacity: skipGate ? 0.45 : 1, cursor: skipGate ? "not-allowed" : "pointer" }}
          >
            {isLastCallout && !isLastSlide ? "Next page" : "Continue"}
            <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

const navBtnStyle = (disabled: boolean): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 18px",
  borderRadius: 999,
  border: `1px solid ${C.gray02}`,
  background: C.white,
  color: disabled ? C.gray02 : C.dark2,
  fontFamily: F.regular,
  fontSize: 14,
  fontWeight: 700,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
});

const primaryBtnStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 20px",
  borderRadius: 999,
  border: "none",
  background: C.yellow,
  color: C.dark2,
  fontFamily: F.bold,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  marginLeft: "auto",
};
