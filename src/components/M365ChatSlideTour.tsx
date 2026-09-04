import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsRight,
  Circle,
  CircleHelp,
  Clock,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Grid3x3,
  Globe,
  Info,
  ListFilter,
  Mail,
  MessageSquare,
  MessagesSquare,
  Mic,
  MoreHorizontal,
  PenLine,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  UserCog,
  X,
} from "lucide-react";
import { colors, fonts as F, typeScale } from "../design-kit/tokens";
import { CopilotPlusButton } from "./CopilotPlusMenu";
import { AgentHexIcon, AgentIcon, CopilotHex, agentIconKind, type AgentIconKind } from "./AgentHexIcon";

const C = { ...colors, dark2: colors.offBlack };
const line = `color-mix(in srgb, ${C.gray02} 50%, ${C.white})`;
const FIGMA_W = 953;
const FIGMA_H = 530;

// ── Types ─────────────────────────────────────────────────────────────────────

type Placement = "left" | "right" | "top" | "bottom";

type Callout = {
  title: string;
  body: string;
  icon: LucideIcon;
  /** Matches data-tour-id on the canvas element — highlight measured live. */
  target: string;
  placement: Placement;
  /** 0–1 along highlight height for left/right cards (default 0.5 = middle). */
  anchorY?: number;
  /** Pin the annotation card inside the highlight (e.g. over a modal sidebar). */
  cardInset?: "left" | "right";
  /** Shared 1–8 workflow number (Step 3 has 3a/3b/3c… sub-beats). */
  workflowStep: number;
};

type SlideKind = "personalization" | "analyst" | "builder" | "researcher" | "create" | "agents-landing";

type Slide = {
  label: string;
  kind: SlideKind;
  callouts: Callout[];
};

const WORKFLOW_STEPS = 6;

/** Last-night Create→agents tour — kept for reference; MS Chat uses CHAT_TOUR_SLIDES again. */
const CHAT_AGENT_TOUR_SLIDES: Slide[] = [
  {
    label: "Create",
    kind: "create",
    callouts: [
      {
        title: "New chat",
        body: "Start from the sidebar — New chat resets the conversation and surfaces creation paths in Copilot.",
        icon: PenLine,
        target: "new-chat",
        placement: "right",
        workflowStep: 1,
      },
      {
        title: "M365 apps",
        body: "Click the apps grid in the sidebar to open Microsoft 365 — pick Create or jump into Word, Excel, Teams, and more.",
        icon: Grid3x3,
        target: "m365-apps-flyout",
        placement: "right",
        anchorY: 0.2,
        workflowStep: 2,
      },
      {
        title: "Create content",
        body: "Choose a format — image, video, or infographic — describe what you need, then refine from templates.",
        icon: Rocket,
        target: "create-describe-input",
        placement: "right",
        anchorY: 0.45,
        workflowStep: 3,
      },
    ],
  },
  {
    label: "Saved prompts",
    kind: "agents-landing",
    callouts: [
      {
        title: "More prompt shortcuts",
        body: "Tap the more button beside the quick pills to open your saved prompt library.",
        icon: Save,
        target: "quick-pills-more",
        placement: "top",
        anchorY: 0.4,
        workflowStep: 4,
      },
      {
        title: "Prompt Lab",
        body: "Your saved templates live here. Browse GST notice drafts, advance tax checks and more — pick one to drop it straight into chat.",
        icon: BookOpen,
        target: "prompt-lab-modal",
        placement: "left",
        cardInset: "left",
        anchorY: 0.42,
        workflowStep: 5,
      },
    ],
  },
  {
    label: "Agents in Copilot Chat",
    kind: "agents-landing",
    callouts: [
      {
        title: "Researcher agent",
        body: "Prep a manufacturing client exploring global expansion — it pulls indirect tax, customs and transfer pricing, then returns a meeting-ready brief.",
        icon: Search,
        target: "researcher",
        placement: "right",
        workflowStep: 6,
      },
      {
        title: "Analyst agent",
        body: "Ask it to analyse 12 months of GST filings. It finds patterns, late filings and high-risk periods, then builds the charts — minutes, not hours.",
        icon: BarChart3,
        target: "analyst",
        placement: "right",
        workflowStep: 7,
      },
      {
        title: "New agent",
        body: "In the sidebar under Agents, choose New agent to start building a specialist for Indian tax workflows.",
        icon: Bot,
        target: "new-agent",
        placement: "right",
        workflowStep: 8,
      },
      {
        title: "All your agents",
        body: "Every agent you use or create is listed here — Researcher, Analyst, and your tax specialists.",
        icon: Bot,
        target: "agents-list",
        placement: "right",
        workflowStep: 9,
      },
    ],
  },
];

export type HowExploreAgentId = "new-agent" | "researcher" | "analyst";

// ── Callout measurement (from rendered DOM — works across scale transforms) ───

type CalloutRect = { left: number; top: number; width: number; height: number };

function measureTarget(frame: HTMLElement, target: string, scrollIntoView = false): CalloutRect | null {
  if (scrollIntoView) scrollTargetIntoPanel(frame, target);
  const el = frame.querySelector(`[data-tour-id="${target}"]`);
  if (!(el instanceof HTMLElement)) return null;
  const parent = frame.getBoundingClientRect();
  const box = el.getBoundingClientRect();
  if (parent.width < 2 || parent.height < 2 || box.width < 1) return null;
  const pad = 5;
  return {
    left: ((box.left - parent.left - pad) / parent.width) * 100,
    top: ((box.top - parent.top - pad) / parent.height) * 100,
    width: ((box.width + pad * 2) / parent.width) * 100,
    height: ((box.height + pad * 2) / parent.height) * 100,
  };
}

/** Keep callout rings aligned when configure panels scroll inside the tour frame. */
function subscribeTourTargetMeasure(
  frame: HTMLElement,
  target: string,
  onUpdate: (rect: CalloutRect | null) => void,
): () => void {
  const update = (scrollIntoView: boolean) => onUpdate(measureTarget(frame, target, scrollIntoView));

  update(true);

  const ro = new ResizeObserver(() => update(false));
  ro.observe(frame);

  const targetEl = frame.querySelector(`[data-tour-id="${target}"]`);
  if (targetEl instanceof HTMLElement) ro.observe(targetEl);

  const scrollers = Array.from(frame.querySelectorAll("[data-tour-scroll]"));
  const onScroll = () => update(false);
  scrollers.forEach(scroller => scroller.addEventListener("scroll", onScroll, { passive: true }));

  const t1 = window.setTimeout(() => update(true), 80);
  const t2 = window.setTimeout(() => update(false), 240);

  return () => {
    ro.disconnect();
    scrollers.forEach(scroller => scroller.removeEventListener("scroll", onScroll));
    window.clearTimeout(t1);
    window.clearTimeout(t2);
  };
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

function cardAnchor(rect: CalloutRect, placement: Placement, alignY = 0.5) {
  const top = rect.top + rect.height * alignY;
  if (placement === "right") return { left: rect.left + rect.width, top };
  if (placement === "left") return { left: rect.left, top };
  if (placement === "top") return { left: rect.left + rect.width / 2, top: rect.top };
  return { left: rect.left + rect.width / 2, top: rect.top + rect.height };
}

function cardTransform(placement: Placement): CSSProperties {
  switch (placement) {
    case "right": return { transform: "translate(10px, -50%)" };
    case "left":  return { transform: "translate(calc(-100% - 10px), -50%)" };
    case "top":   return { transform: "translate(-50%, calc(-100% - 10px))" };
    case "bottom":return { transform: "translate(-50%, 10px)" };
  }
}

function insetCardAnchor(rect: CalloutRect, inset: "left" | "right", alignY = 0.5) {
  const top = rect.top + rect.height * alignY;
  if (inset === "left") return { left: rect.left + rect.width * 0.06, top };
  return { left: rect.left + rect.width * 0.94, top };
}

function insetCardTransform(inset: "left" | "right"): CSSProperties {
  if (inset === "left") return { transform: "translate(0, -50%)" };
  return { transform: "translate(-100%, -50%)" };
}

/** Flip a callout if it would sit off the canvas (avoids page jump on Next). */
function safePlacement(rect: CalloutRect, placement: Placement): Placement {
  if (placement === "top" && rect.top < 24) return "bottom";
  if (placement === "bottom" && rect.top + rect.height > 76) return "top";
  if (placement === "right" && rect.left + rect.width > 70) return "left";
  if (placement === "left" && rect.left < 30) return "right";
  return placement;
}

// ── Slide data ────────────────────────────────────────────────────────────────

const CHAT_TOUR_SLIDES: Slide[] = [
  {
    label: "Set up Copilot",
    kind: "personalization",
    callouts: [
      {
        title: "Enable Work IQ",
        body: "When on, Copilot can use your work data and the web, within your permissions. When off, answers come from web content only — you control what it can see.",
        icon: Sparkles,
        target: "work-iq-main",
        placement: "bottom",
        workflowStep: 1,
      },
      {
        title: "Select the right model",
        body: "Auto picks for you. GPT Quick is for fast drafts. GPT Advanced is for analysis. Claude Opus is for deep research and strategy.",
        icon: Brain,
        target: "auto-model",
        placement: "right",
        workflowStep: 2,
      },
      {
        title: "Open the plus menu",
        body: "Tap + beside Message Copilot to attach files, add capabilities, or connect data sources — without leaving chat.",
        icon: Plus,
        target: "plus-apps",
        placement: "top",
        anchorY: 0.5,
        workflowStep: 2,
      },
      {
        title: "Add content and capabilities",
        body: "Upload approved tax material, enable research or analysis, generate images, or limit Copilot to your chosen sources.",
        icon: Upload,
        target: "plus-menu",
        placement: "right",
        anchorY: 0.38,
        workflowStep: 2,
      },
      {
        title: "Open the more menu",
        body: "The three-dot menu in the top-right is where Chat settings live. Open it to set how Copilot should answer you.",
        icon: MoreHorizontal,
        target: "more-menu",
        placement: "left",
        workflowStep: 3,
      },
      {
        title: "Chat settings",
        body: "Choose Chat settings. The other items stay in the menu — this tour only uses settings.",
        icon: Settings,
        target: "chat-settings-item",
        placement: "left",
        workflowStep: 3,
      },
      {
        title: "Personalization",
        body: "Open Personalization to tell Copilot how to write and what to remember.",
        icon: UserCog,
        target: "settings-personalization",
        placement: "right",
        workflowStep: 3,
      },
      {
        title: "Custom instructions",
        body: "Tell Copilot how to answer. Example: you are an Indian tax professional — prioritise Indian law, use bullets, and call out risks, deadlines and penalties.",
        icon: Settings,
        target: "edit-instructions",
        placement: "bottom",
        workflowStep: 3,
      },
      {
        title: "Write your instructions",
        body: "Type how Copilot should speak, or tap a suggestion chip. Then save so every new chat follows your rules.",
        icon: PenLine,
        target: "custom-instructions-editor",
        placement: "left",
        workflowStep: 3,
      },
      {
        title: "Save instructions",
        body: "Save so Copilot uses these rules in later chats. Cancel leaves them unchanged.",
        icon: Save,
        target: "save-instructions",
        placement: "top",
        workflowStep: 3,
      },
      {
        title: "Saved prompts",
        body: "Back on the chat home, tap the more button beside the quick pills to open your personal library — reuse GST templates and other favourites with one click.",
        icon: Save,
        target: "quick-pills-more",
        placement: "top",
        anchorY: 0.4,
        workflowStep: 4,
      },
      {
        title: "Prompt Lab",
        body: "Your saved templates live here. Browse GST notice drafts, advance tax checks and more — pick one to drop it straight into chat.",
        icon: BookOpen,
        target: "prompt-lab-modal",
        placement: "left",
        cardInset: "left",
        anchorY: 0.42,
        workflowStep: 4,
      },
    ],
  },
  {
    label: "Create",
    kind: "create",
    callouts: [
      {
        title: "M365 apps",
        body: "Open the apps grid in the sidebar to jump into Word, Excel, Teams, Create, and more.",
        icon: Grid3x3,
        target: "m365-apps-flyout",
        placement: "right",
        anchorY: 0.35,
        workflowStep: 5,
      },
      {
        title: "Create content",
        body: "Choose a format — image, video, or infographic — describe what you need, then refine from templates.",
        icon: Rocket,
        target: "create-describe-input",
        placement: "right",
        anchorY: 0.45,
        workflowStep: 5,
      },
    ],
  },
  {
    label: "Agents in Copilot Chat",
    kind: "agents-landing",
    callouts: [
      {
        title: "All your agents",
        body: "Every agent you use or create is listed here — Researcher, Analyst, and your tax specialists.",
        icon: Bot,
        target: "agents-list",
        placement: "right",
        workflowStep: 6,
      },
    ],
  },
];

// ── Scale-to-width hook ───────────────────────────────────────────────────────

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

// ── Shared UI primitives ──────────────────────────────────────────────────────

function NavRow({ icon, label, tourId, active, onClick }: { icon: ReactNode; label: string; tourId?: string; active?: boolean; onClick?: () => void }) {
  const shared: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 6,
    width: "100%",
    background: active ? `color-mix(in srgb, ${C.gray02} 40%, ${C.white})` : "transparent",
    cursor: onClick ? "pointer" : "default",
    border: "none",
    textAlign: "left",
  };
  if (onClick) {
    return (
      <button type="button" data-tour-id={tourId} onClick={e => { e.stopPropagation(); onClick(); }} style={shared}>
        <span style={{ width: 16, height: 16, display: "flex", flexShrink: 0 }}>{icon}</span>
        <span style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
          {label}
        </span>
      </button>
    );
  }
  return (
    <div data-tour-id={tourId} style={shared}>
      <span style={{ width: 16, height: 16, display: "flex", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
        {label}
      </span>
    </div>
  );
}

function AgentRow({
  label,
  tourId,
  active,
  onClick,
  iconKind = "generic",
}: {
  label: string;
  tourId?: string;
  active?: boolean;
  onClick?: () => void;
  iconKind?: AgentIconKind;
}) {
  const shared: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 10px",
    borderRadius: 6,
    width: "100%",
    cursor: onClick ? "pointer" : "default",
    background: active ? `color-mix(in srgb, ${C.gray02} 40%, ${C.white})` : "transparent",
    border: "none",
    textAlign: "left",
  };
  if (onClick) {
    return (
      <button type="button" data-tour-id={tourId} onClick={e => { e.stopPropagation(); onClick(); }} style={shared}>
        <AgentIcon kind={iconKind} size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
          {label}
        </span>
      </button>
    );
  }
  return (
    <div data-tour-id={tourId} style={shared}>
      <AgentIcon kind={iconKind} size={18} />
      <span style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
        {label}
      </span>
    </div>
  );
}


// ── Shared sidebar ────────────────────────────────────────────────────────────

const CHAT_SIDEBAR_W = 210;

function ChatSidebar({
  prevChatsId,
  highlightNewAgent,
  highlightResearcher,
  highlightAnalyst,
  highlightNewChat,
  highlightM365AppsTrigger,
  showM365AppsFlyout,
  onNewChat,
  onM365AppsClick,
  exploreAgentId,
  onExploreAgentSelect,
}: {
  prevChatsId?: string;
  highlightNewAgent?: boolean;
  highlightResearcher?: boolean;
  highlightAnalyst?: boolean;
  highlightNewChat?: boolean;
  highlightM365AppsTrigger?: boolean;
  showM365AppsFlyout?: boolean;
  onNewChat?: () => void;
  onM365AppsClick?: () => void;
  exploreAgentId?: HowExploreAgentId;
  onExploreAgentSelect?: (id: HowExploreAgentId) => void;
}) {
  const icon = { size: 16, strokeWidth: 1.5, color: "#424242" } as const;
  return (
    <div
      style={{
        width: CHAT_SIDEBAR_W,
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        borderRight: `1px solid #e5e5e5`,
        background: C.white,
        gap: 4,
        overflow: "visible",
      }}
    >
      {/* Top icons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px", marginBottom: 8 }}>
        <span style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CopilotHex size={22} />
        </span>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            data-tour-id="m365-apps-trigger"
            aria-label="Microsoft 365 apps"
            onClick={e => { e.stopPropagation(); onM365AppsClick?.(); }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: highlightM365AppsTrigger ? `2px solid ${C.yellow}` : "none",
              background: highlightM365AppsTrigger ? C.yellowAlpha10 : "transparent",
              cursor: onM365AppsClick ? "pointer" : "default",
              padding: 0,
            }}
          >
            <Grid3x3 size={18} strokeWidth={1.5} color="#616161" />
          </button>
          {showM365AppsFlyout ? <M365AppsFlyout /> : null}
        </div>
      </div>

      {/* Nav */}
      <NavRow icon={<PenLine {...icon} />} label="New chat" tourId="new-chat" active={highlightNewChat} onClick={onNewChat} />
      <NavRow icon={<Search {...icon} />} label="Search" tourId="search" />
      <NavRow icon={<BookOpen {...icon} />} label="Library" tourId="library" />

      {/* Agents */}
      <div data-tour-id="agents-list" style={{ marginTop: 12, marginBottom: 2 }}>
        <span style={{ display: "block", padding: "0 10px", marginBottom: 2, fontFamily: F.regular, fontSize: 11, fontWeight: 600, color: "#757575", textTransform: "none", letterSpacing: 0 }}>
          Agents
        </span>
        <AgentRow
          label="Researcher"
          tourId="researcher"
          iconKind="researcher"
          active={exploreAgentId ? exploreAgentId === "researcher" : highlightResearcher}
          onClick={onExploreAgentSelect ? () => onExploreAgentSelect("researcher") : undefined}
        />
        <AgentRow
          label="Analyst"
          tourId="analyst"
          iconKind="analyst"
          active={exploreAgentId ? exploreAgentId === "analyst" : highlightAnalyst}
          onClick={onExploreAgentSelect ? () => onExploreAgentSelect("analyst") : undefined}
        />
        {onExploreAgentSelect ? (
          <AgentRow
            label="New agent"
            tourId="new-agent"
            iconKind="new-agent"
            active={exploreAgentId === "new-agent"}
            onClick={() => onExploreAgentSelect("new-agent")}
          />
        ) : (
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
              background: highlightNewAgent ? `color-mix(in srgb, ${C.gray02} 40%, ${C.white})` : "transparent",
            }}
          >
            <AgentIcon kind="new-agent" size={18} />
            <span style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, whiteSpace: "nowrap" }}>New agent</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px" }}>
          <ChevronsRight size={13} strokeWidth={1.5} color="#9e9e9e" />
          <span style={{ fontFamily: F.regular, fontSize: 12, color: "#9e9e9e" }}>More agents</span>
        </div>
      </div>

      {/* Chats */}
      <div style={{ marginTop: 10, marginBottom: 2, padding: "0 10px" }}>
        <span style={{ fontFamily: F.regular, fontSize: 11, fontWeight: 600, color: "#757575" }}>Chats</span>
      </div>
      <div data-tour-id={prevChatsId} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {["Example of Saved Prompt Usa…", "Explaining Work IQ in M365…", "Understanding Advance Tax Ba…"].map(t => (
          <div key={t} style={{ padding: "5px 10px", fontFamily: F.regular, fontSize: 12, color: "#616161", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Canvas: Slide 0 — Chat home ───────────────────────────────────────────────

const QUICK_PILLS = ["Saved Prompts", "Inbox Triage", "People Search", "Meeting Prep"] as const;

const USER_SAVED_PROMPTS = [
  {
    title: "GST notice draft",
    preview: "Draft a reply to this GST notice for {Period}. Separate demand vs interest, cite sections, and list documents I must attach.",
    footer: "Saved by you",
  },
  {
    title: "Advance tax check",
    preview: "Compute advance tax for Q{Quarter} from this P&L. Show instalment due dates and shortfall interest risk under Indian law.",
    footer: "Saved by you",
  },
  {
    title: "ITC mismatch review",
    preview: "Compare GSTR-2B with my purchase register. List ineligible ITC, vendor mismatches, and actions before the next return.",
    footer: "Saved by you",
  },
  {
    title: "80C and deductions",
    preview: "Review this salary and investment list. Map 80C, 80D and HRA and note missing proofs for the assessment year.",
    footer: "Saved by you",
  },
  {
    title: "Transfer pricing memo",
    preview: "Outline a TP memo for {Related party}. Cover method selection, comparables, and documentation gaps for Indian TP rules.",
    footer: "Saved by you",
  },
] as const;

const M365_APP_TILES = [
  { name: "Outlook", color: C.frameBlue },
  { name: "Teams", color: C.framePurple },
  { name: "Word", color: C.frameBlue },
  { name: "Excel", color: C.frameGreen },
  { name: "PowerPoint", color: "#FF3C00" },
  { name: "OneNote", color: C.framePurple },
  { name: "OneDrive", color: C.frameBlue },
  { name: "SharePoint", color: C.frameTeal },
] as const;

const CREATE_FORMAT_CHIPS = ["Create an image", "Create a video", "Design an infographic", "More..."] as const;

const EXPLORE_INFOGRAPHIC_CARDS = [
  { tag: "Compare two topics", bg: `linear-gradient(135deg, ${C.frameTeal}, ${C.frameBlue})` },
  { tag: "Create a detailed list", bg: `linear-gradient(135deg, ${C.frameBlue}, ${C.framePurple})` },
  { tag: "Compare two products", bg: `linear-gradient(135deg, #E81123, ${C.offBlack})` },
] as const;

function M365AppsFlyout() {
  return (
    <div
      data-tour-id="m365-apps-flyout"
      style={{
        position: "absolute",
        left: "calc(100% + 6px)",
        top: -4,
        width: 292,
        borderRadius: 14,
        border: `1px solid ${C.gray02}`,
        background: C.white,
        boxShadow: `0 16px 40px color-mix(in srgb, ${C.confidentBlack} 14%, transparent)`,
        zIndex: 12,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderBottom: `1px solid ${line}` }}>
        <Search size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
        <span style={{ flex: 1, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>Find Microsoft 365 apps</span>
        <X size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </div>
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CopilotHex size={44} />
          <span style={{ fontFamily: F.regular, fontSize: 14, color: C.offBlack }}>Create</span>
        </div>
        <div style={{ height: 1, background: line }} aria-hidden />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {M365_APP_TILES.map(app => (
            <div key={app.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
              <span
                aria-hidden
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: app.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.white,
                  fontFamily: F.bold,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {app.name.charAt(0)}
              </span>
              <span style={{ fontFamily: F.regular, fontSize: 10, color: C.offBlack, textAlign: "center", lineHeight: 1.2 }}>{app.name}</span>
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span
              aria-hidden
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: `1px solid ${C.gray02}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.gray01,
              }}
            >
              <Grid3x3 size={16} strokeWidth={1.75} />
            </span>
            <span style={{ fontFamily: F.regular, fontSize: 10, color: C.offBlack, textAlign: "center", lineHeight: 1.2 }}>More apps</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateContentCanvas({ frameRef }: { frameRef: (el: HTMLDivElement | null) => void }) {
  const { ref, scale } = useScaleToWidth(FIGMA_W);
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Copilot create content — infographic designer"
      style={{ width: "100%", aspectRatio: `${FIGMA_W} / ${FIGMA_H}`, position: "relative", overflow: "hidden", background: C.white }}
    >
      <div
        ref={frameRef}
        aria-hidden
        style={{ position: "absolute", top: 0, left: 0, width: FIGMA_W, height: FIGMA_H, transform: `scale(${scale})`, transformOrigin: "top left", display: "flex", background: C.white }}
      >
        <ChatSidebar />

        <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", padding: "20px 36px 16px", background: C.white }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, minHeight: 0 }}>
            <p style={{ margin: 0, fontFamily: F.regular, fontSize: 24, color: C.offBlack, textAlign: "center" }}>
              What do you want to create?
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {CREATE_FORMAT_CHIPS.map(chip => {
                const active = chip === "Design an infographic";
                return (
                  <span
                    key={chip}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      border: active ? "none" : `1px solid ${C.gray02}`,
                      background: active ? C.offBlack : C.white,
                      color: active ? C.white : C.offBlack,
                      fontFamily: F.regular,
                      fontSize: 12,
                    }}
                  >
                    {chip}
                  </span>
                );
              })}
            </div>

            <div
              data-tour-id="create-describe-input"
              style={{
                width: "100%",
                maxWidth: 560,
                borderRadius: 16,
                border: `1px solid ${C.gray02}`,
                background: C.white,
                boxShadow: `0 4px 16px color-mix(in srgb, ${C.confidentBlack} 6%, transparent)`,
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ flex: 1, fontFamily: F.regular, fontSize: 14, color: C.gray01 }}>Describe the infographic you want to create</span>
                <span
                  aria-hidden
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: C.gray02,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.white,
                    flexShrink: 0,
                  }}
                >
                  <ChevronRight size={14} strokeWidth={2} />
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <Plus size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
                {["Color", "Infographic type", "Size"].map(opt => (
                  <span key={opt} style={{ fontFamily: F.regular, fontSize: 11, color: C.gray01 }}>{opt}</span>
                ))}
              </div>
            </div>

            <div style={{ width: "100%", maxWidth: 620, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${line}`, paddingBottom: 6 }}>
                <span style={{ fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.offBlack, borderBottom: `2px solid ${C.offBlack}`, paddingBottom: 6 }}>
                  Explore infographics
                </span>
                <span style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>My infographics</span>
                <CircleHelp size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, flex: 1, minHeight: 0 }}>
                {EXPLORE_INFOGRAPHIC_CARDS.map(card => (
                  <div
                    key={card.tag}
                    style={{
                      position: "relative",
                      borderRadius: 12,
                      overflow: "hidden",
                      minHeight: 120,
                      background: card.bg,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        padding: "4px 8px",
                        borderRadius: 6,
                        background: C.white,
                        fontFamily: F.regular,
                        fontSize: 10,
                        color: C.offBlack,
                        maxWidth: "85%",
                        lineHeight: 1.3,
                      }}
                    >
                      {card.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type SettingsPane = "general" | "personalization" | "editor" | null;

const MODEL_MENU_OPTIONS = [
  { label: "Auto", sub: "Picks the best model for your query", checked: true },
  { label: "GPT Quick response", sub: "Fast drafts and summaries", checked: false },
  { label: "GPT Advanced", sub: "Analysis and complex problem-solving", checked: false },
  { label: "Claude Opus", sub: "Deep research and strategic planning", checked: false },
] as const;

function ModelPickerMenu() {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
      <div style={{ width: 200, borderRadius: 10, border: "1px solid #e0e0e0", background: C.white, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 13px", borderBottom: "1px solid #f0f0f0" }}>
          <span style={{ fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: "#1f1f1f" }}>Auto</span>
          <ChevronDown size={13} strokeWidth={1.5} color="#616161" />
        </div>
        {MODEL_MENU_OPTIONS.map(opt => (
          <div key={opt.label} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 13px", borderBottom: "1px solid #f5f5f5" }}>
            <span style={{ width: 14, height: 14, marginTop: 2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {opt.checked && <Check size={12} strokeWidth={2.5} color="#1f1f1f" />}
            </span>
            <div>
              <div style={{ fontFamily: F.bold, fontSize: 11, fontWeight: 700, color: "#1f1f1f" }}>{opt.label}</div>
              <div style={{ fontFamily: F.regular, fontSize: 10, color: "#757575", marginTop: 1 }}>{opt.sub}</div>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 13px", background: "#f7f0fd" }}>
          <div>
            <div style={{ fontFamily: F.bold, fontSize: 11, fontWeight: 700, color: "#1f1f1f" }}>GPT</div>
            <div style={{ fontFamily: F.regular, fontSize: 10, color: "#757575" }}>OpenAI versions</div>
          </div>
          <ChevronRight size={13} strokeWidth={1.5} color="#616161" />
        </div>
      </div>
      <div style={{ marginTop: 190, width: 180, borderRadius: 10, border: "1px solid #e0e0e0", background: C.white, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", overflow: "hidden", flexShrink: 0 }}>
        {["GPT 5.6 Think deeper", "GPT 5.6 Quick response", "GPT 5.5 Quick response"].map((label, i) => (
          <div key={label} style={{ padding: "10px 14px", fontFamily: F.regular, fontSize: 11, color: "#1f1f1f", borderBottom: i < 2 ? "1px solid #f5f5f5" : "none" }}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatMainCanvas({
  frameRef,
  showM365AppsFlyout,
  showMoreMenu,
  showModelMenu,
  settingsPane,
  highlightSavedPromptsPill,
  highlightQuickPillsMore,
  highlightNewAgent,
  highlightResearcher,
  highlightAnalyst,
  highlightNewChat,
  highlightM365AppsTrigger,
  onNewChat,
  onM365AppsClick,
  showPlusMenu,
  onPlusMenuOpen,
  showPromptLab,
  onOpenSavedPrompts,
  onOpenQuickPillsMore,
  onClosePromptLab,
  onExploreAgentSelect,
}: {
  frameRef: (el: HTMLDivElement | null) => void;
  showM365AppsFlyout?: boolean;
  showMoreMenu?: boolean;
  showModelMenu?: boolean;
  settingsPane?: SettingsPane;
  highlightSavedPromptsPill?: boolean;
  highlightQuickPillsMore?: boolean;
  highlightNewAgent?: boolean;
  highlightResearcher?: boolean;
  highlightAnalyst?: boolean;
  highlightNewChat?: boolean;
  highlightM365AppsTrigger?: boolean;
  onNewChat?: () => void;
  onM365AppsClick?: () => void;
  showPlusMenu?: boolean;
  onPlusMenuOpen?: () => void;
  showPromptLab?: boolean;
  onOpenSavedPrompts?: () => void;
  onOpenQuickPillsMore?: () => void;
  onClosePromptLab?: () => void;
  onExploreAgentSelect?: (id: HowExploreAgentId) => void;
}) {
  const { ref, scale } = useScaleToWidth(FIGMA_W);
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Microsoft 365 Copilot Chat home"
      style={{ width: "100%", aspectRatio: `${FIGMA_W} / ${FIGMA_H}`, position: "relative", overflow: "hidden", background: C.white }}
    >
      <div
        ref={frameRef}
        aria-hidden
        style={{ position: "absolute", top: 0, left: 0, width: FIGMA_W, height: FIGMA_H, transform: `scale(${scale})`, transformOrigin: "top left", display: "flex", background: C.white }}
      >
        <ChatSidebar
          highlightNewAgent={highlightNewAgent}
          highlightResearcher={highlightResearcher}
          highlightAnalyst={highlightAnalyst}
          highlightNewChat={highlightNewChat}
          highlightM365AppsTrigger={highlightM365AppsTrigger}
          showM365AppsFlyout={showM365AppsFlyout}
          onNewChat={onNewChat}
          onM365AppsClick={onM365AppsClick}
          onExploreAgentSelect={onExploreAgentSelect}
        />

        {/* Main area */}
        <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", padding: "16px 48px 32px", background: C.white }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                data-tour-id="work-iq-main"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, border: "1px solid #d0d0d0", fontFamily: F.regular, fontSize: 12, color: "#1f1f1f", background: C.white, cursor: "default" }}
              >
                <Sparkles size={13} strokeWidth={1.75} color="#7719AA" />
                Work IQ
              </span>
              <span style={{ position: "relative", display: "inline-flex" }}>
                <span
                  data-tour-id="auto-model"
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 999, border: "1px solid #d0d0d0", fontFamily: F.regular, fontSize: 12, color: "#1f1f1f", cursor: "default" }}
                >
                  Auto <ChevronDown size={12} strokeWidth={1.5} color="#616161" />
                </span>
                {showModelMenu && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 5 }}>
                    <ModelPickerMenu />
                  </div>
                )}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
              <span data-tour-id="gov-shield" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28 }}>
                <ShieldCheck size={18} strokeWidth={1.5} color="#107C10" />
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28 }}>
                <MessageSquare size={18} strokeWidth={1.5} color={C.gray01} />
              </span>
              <span
                data-tour-id="more-menu"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: showMoreMenu ? `color-mix(in srgb, ${C.gray02} 45%, ${C.white})` : "transparent",
                }}
              >
                <MoreHorizontal size={18} strokeWidth={1.5} color={C.gray01} />
              </span>
              {showMoreMenu && <MoreMenuCard />}
            </div>
          </div>

          {/* Centre */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
            <p style={{ fontFamily: F.bold, fontSize: 26, fontWeight: 700, color: "#1f1f1f", textAlign: "center", margin: 0, lineHeight: 1.3 }}>
              Hi, what can I help you with?
            </p>
            <div style={{ width: "100%", maxWidth: 540, display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                data-tour-id="prompt-input"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", borderRadius: 28, border: "1px solid #d0d0d0", background: C.white, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "text" }}
              >
                <CopilotPlusButton
                  plusTourId="plus-apps"
                  menuTourId="plus-menu"
                  open={showPlusMenu}
                  onOpenChange={open => { if (open) onPlusMenuOpen?.(); }}
                  iconSize={18}
                  iconColor="#424242"
                />
                <span style={{ flex: 1, fontFamily: F.regular, fontSize: 14, color: "#9e9e9e" }}>Message Copilot</span>
                <span data-tour-id="voice-btn" style={{ display: "inline-flex" }}>
                  <Mic size={18} strokeWidth={1.5} color="#424242" />
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {QUICK_PILLS.map(label => {
                  const isSaved = label === "Saved Prompts";
                  return (
                    <button
                      key={label}
                      type="button"
                      data-tour-id={isSaved ? "saved-prompts-pill" : undefined}
                      aria-label={label}
                      onClick={isSaved ? (e) => { e.stopPropagation(); onOpenSavedPrompts?.(); } : undefined}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 999,
                        border: isSaved && highlightSavedPromptsPill ? `2px solid ${C.yellow}` : `1px solid ${C.gray02}`,
                        background: isSaved && highlightSavedPromptsPill ? C.yellowAlpha10 : C.offWhite,
                        boxShadow: isSaved && highlightSavedPromptsPill
                          ? `0 0 0 1px color-mix(in srgb, ${C.yellow} 35%, transparent)`
                          : undefined,
                        fontFamily: F.regular,
                        fontSize: 12,
                        color: C.offBlack,
                        whiteSpace: "nowrap",
                        cursor: isSaved ? "pointer" : "default",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  data-tour-id="quick-pills-more"
                  aria-label="More prompt shortcuts"
                  onClick={e => { e.stopPropagation(); onOpenQuickPillsMore?.(); }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    border: highlightQuickPillsMore ? `2px solid ${C.yellow}` : "1px solid #d0d0d0",
                    background: highlightQuickPillsMore ? C.yellowAlpha10 : "#f9f9f9",
                    boxShadow: highlightQuickPillsMore
                      ? `0 0 0 1px color-mix(in srgb, ${C.yellow} 35%, transparent)`
                      : undefined,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: onOpenQuickPillsMore ? "pointer" : "default",
                    padding: 0,
                  }}
                >
                  <MoreHorizontal size={14} strokeWidth={1.5} color="#9e9e9e" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <p style={{ fontFamily: F.regular, fontSize: 11, color: "#9e9e9e", textAlign: "center", margin: 0 }}>
            AI-generated content may be incorrect
          </p>
        </div>

        {settingsPane ? <ChatSettingsModal pane={settingsPane} /> : null}
        {showPromptLab ? <PromptLabModal onClose={() => onClosePromptLab?.()} /> : null}
      </div>
    </div>
  );
}

const MORE_MENU_ITEMS = [
  { id: "scheduled", label: "Scheduled prompts", icon: Clock, chevron: false, tourId: undefined },
  { id: "settings", label: "Chat settings", icon: Settings, chevron: false, tourId: "chat-settings-item" },
  { id: "download", label: "Download apps", icon: Download, chevron: true, tourId: undefined },
  { id: "help", label: "Help and tips", icon: CircleHelp, chevron: true, tourId: undefined },
  { id: "feedback", label: "Send feedback", icon: User, chevron: false, tourId: undefined },
] as const;

function MoreMenuCard() {
  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        marginTop: 6,
        width: 220,
        borderRadius: 10,
        background: C.white,
        boxShadow: `0 8px 24px color-mix(in srgb, ${C.confidentBlack} 16%, transparent)`,
        padding: "6px 0",
        zIndex: 6,
      }}
    >
      {MORE_MENU_ITEMS.map(item => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            data-tour-id={item.tourId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 14px",
              cursor: "default",
            }}
          >
            <Icon size={16} strokeWidth={1.5} color={C.offBlack} />
            <span style={{ flex: 1, fontFamily: F.regular, fontSize: 13, color: C.offBlack }}>{item.label}</span>
            {item.chevron ? <ChevronRight size={14} strokeWidth={1.5} color={C.gray01} /> : null}
          </div>
        );
      })}
    </div>
  );
}

const SETTINGS_NAV = [
  { id: "general", label: "General", icon: Settings, tourId: "settings-general" },
  { id: "data", label: "Data controls", icon: BarChart3 },
  { id: "personalization", label: "Personalization", icon: UserCog, tourId: "settings-personalization" },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "agents", label: "Agents", icon: Code2 },
  { id: "sources", label: "Sources", icon: Share2 },
] as const;

function PromptLabModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-lab-title"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `color-mix(in srgb, ${C.confidentBlack} 28%, transparent)`,
      }}
    >
      <div
        data-tour-id="prompt-lab-modal"
        style={{
          width: "min(780px, 94%)",
          height: "min(500px, 88%)",
          borderRadius: 12,
          background: C.white,
          boxShadow: `0 16px 40px color-mix(in srgb, ${C.confidentBlack} 22%, transparent)`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
          <h2 id="prompt-lab-title" style={{ fontFamily: F.bold, fontSize: 20, fontWeight: 700, color: C.offBlack, margin: 0 }}>
            Prompt Lab
          </h2>
          <button
            type="button"
            aria-label="Close Prompt Lab"
            onClick={onClose}
            style={{ border: "none", background: "transparent", padding: 4, cursor: "pointer", display: "inline-flex" }}
          >
            <X size={18} strokeWidth={1.5} color={C.gray01} aria-hidden />
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", borderTop: `1px solid ${C.gray02}` }}>
          <nav
            aria-label="Prompt Lab sections"
            style={{
              width: 200,
              flexShrink: 0,
              background: C.offWhite,
              padding: "14px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 999 }}>
              <span
                aria-hidden
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 2,
                  background: C.yellow,
                  color: C.offBlack,
                  fontFamily: F.bold,
                  fontSize: 8,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                EY
              </span>
              <span style={{ fontFamily: F.regular, fontSize: 13, color: C.offBlack }}>EY Suggested</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: C.offBlack,
                  fontFamily: F.regular,
                  fontSize: 13,
                  color: C.white,
                }}
              >
                Saved prompts
              </span>
              <Settings size={15} strokeWidth={1.5} color={C.gray01} aria-hidden />
            </div>
            {[
              { label: "Prompt topics", Icon: ChevronDown },
              { label: "Agent prompts", Icon: ChevronDown },
            ].map(({ label, Icon }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px" }}>
                <span style={{ fontFamily: F.regular, fontSize: 13, color: C.offBlack }}>{label}</span>
                <Icon size={14} strokeWidth={1.5} color={C.gray01} aria-hidden />
              </div>
            ))}
          </nav>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: C.white }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 8px" }}>
              <ListFilter size={16} strokeWidth={1.5} color={C.gray01} aria-hidden />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: `1px solid ${C.gray02}`,
                  background: C.white,
                }}
              >
                <Search size={14} strokeWidth={1.5} color={C.gray01} aria-hidden />
                <span style={{ fontFamily: F.light, fontSize: 13, fontWeight: 300, color: C.gray01 }}>Search saved prompts</span>
              </div>
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: "0 8px 12px 16px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              {USER_SAVED_PROMPTS.map(item => (
                <li
                  key={item.title}
                  style={{
                    padding: "14px 12px 14px 0",
                    borderBottom: `1px solid ${C.gray02}`,
                  }}
                >
                  <div style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontFamily: F.bold, fontSize: 14, fontWeight: 700, color: C.offBlack, lineHeight: 1.4 }}>{item.preview}</div>
                  <div style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01, marginTop: 8 }}>{item.footer}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatSettingsModal({ pane }: { pane: Exclude<SettingsPane, null> }) {
  const navActive = pane === "general" ? "general" : "personalization";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `color-mix(in srgb, ${C.confidentBlack} 28%, transparent)`,
      }}
    >
      <div
        style={{
          width: 720,
          height: 480,
          borderRadius: 12,
          background: C.white,
          boxShadow: `0 16px 40px color-mix(in srgb, ${C.confidentBlack} 22%, transparent)`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px 8px" }}>
          <span style={{ fontFamily: F.bold, fontSize: 15, fontWeight: 700, color: C.offBlack }}>Chat settings</span>
          {pane === "editor" ? <span /> : <X size={16} strokeWidth={1.5} color={C.gray01} />}
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
          <div style={{ width: 188, flexShrink: 0, borderRight: `1px solid ${C.gray02}`, padding: "8px 10px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
            {SETTINGS_NAV.map(item => {
              const Icon = item.icon;
              const active = item.id === navActive;
              return (
                <div
                  key={item.id}
                  data-tour-id={item.tourId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 6,
                    position: "relative",
                    background: active ? `color-mix(in srgb, ${C.gray02} 42%, ${C.white})` : "transparent",
                  }}
                >
                  {active ? (
                    <span style={{ position: "absolute", left: 0, top: 6, bottom: 6, width: 3, borderRadius: 2, background: C.offBlack }} />
                  ) : null}
                  <Icon size={15} strokeWidth={1.5} color={C.offBlack} />
                  <span style={{ fontFamily: F.regular, fontSize: 12, color: C.offBlack }}>{item.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: "8px 20px 16px", overflow: "auto", position: "relative" }}>
            {pane === "general" ? <SettingsGeneralPane /> : null}
            {pane === "personalization" ? <SettingsPersonalizationPane /> : null}
            {pane === "editor" ? <SettingsEditorPane /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsRow({ label, action }: { label: string; action?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${C.gray02}`,
        background: C.white,
      }}
    >
      <span style={{ fontFamily: F.regular, fontSize: 12, color: C.offBlack }}>{label}</span>
      {action}
    </div>
  );
}

function SettingsGeneralPane() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontFamily: F.bold, fontSize: 20, fontWeight: 700, color: C.offBlack, margin: 0 }}>General</p>
      <p style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01, margin: 0, lineHeight: 1.45 }}>
        Manage your overall preferences and settings for the Microsoft 365 Copilot, including themes, language, and privacy options.
      </p>
      <SettingsRow
        label="About Microsoft 365 Copilot"
        action={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.regular, fontSize: 12, color: C.info }}>
            View <ExternalLink size={12} strokeWidth={1.5} />
          </span>
        }
      />
      <SettingsRow
        label="Third party data terms"
        action={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.regular, fontSize: 12, color: C.info }}>
            Download PDF <Download size={12} strokeWidth={1.5} />
          </span>
        }
      />
      <SettingsRow label="Version number: bizchat.20260814.47.2" />
      <p style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 700, color: C.offBlack, margin: "6px 0 0" }}>Appearance</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { label: "Use system settings", selected: false, split: true },
          { label: "Light", selected: true, split: false, light: true },
          { label: "Dark", selected: false, split: false, light: false },
        ].map(theme => (
          <div key={theme.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: "100%",
                height: 52,
                borderRadius: 8,
                border: theme.selected ? `2px solid ${C.info}` : `1px solid ${C.gray02}`,
                background: theme.split ? `linear-gradient(90deg, ${C.white} 50%, ${C.gray01} 50%)` : theme.light ? C.white : C.gray01,
                position: "relative",
              }}
            >
              {theme.selected ? (
                <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: 999, background: C.info, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={10} strokeWidth={2.5} color={C.white} />
                </span>
              ) : null}
            </div>
            <span style={{ fontFamily: F.regular, fontSize: 10, color: C.offBlack, textAlign: "center" }}>{theme.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleOff() {
  return (
    <span style={{ width: 34, height: 18, borderRadius: 999, background: C.gray02, position: "relative", flexShrink: 0 }}>
      <span style={{ position: "absolute", left: 2, top: 2, width: 14, height: 14, borderRadius: 999, background: C.white }} />
    </span>
  );
}

function SettingsPersonalizationPane() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontFamily: F.bold, fontSize: 20, fontWeight: 700, color: C.offBlack, margin: 0 }}>Personalization</p>
      <p style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01, margin: 0, lineHeight: 1.45 }}>
        Control how Copilot tailors responses using your preferences.{" "}
        <span style={{ color: C.info, textDecoration: "underline" }}>Learn more.</span>
      </p>
      {[
        {
          title: "Custom instructions",
          body: "Add details about your preferences so Copilot can respond your way.",
          action: "Edit instructions",
          actionId: "edit-instructions",
          toggle: true,
        },
        {
          title: "Work profile",
          body: "Copilot will use your work profile for more relevant answers.",
          action: "View work data",
        },
        {
          title: "Saved memories",
          body: "Allow Copilot to remember details to provide better responses.",
          action: "Manage saved memories",
          toggle: true,
        },
        {
          title: "Chat history",
          body: "Let Copilot use your past chats to personalize responses.",
          toggle: true,
        },
      ].map(card => (
        <div
          key={card.title}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 8,
            border: `1px solid ${C.gray02}`,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 700, color: C.offBlack, margin: "0 0 4px" }}>{card.title}</p>
            <p style={{ fontFamily: F.regular, fontSize: 11, color: C.gray01, margin: "0 0 6px", lineHeight: 1.4 }}>{card.body}</p>
            {card.action ? (
              <span
                data-tour-id={card.actionId}
                style={{ fontFamily: F.regular, fontSize: 12, color: C.info, textDecoration: "underline" }}
              >
                {card.action}
              </span>
            ) : null}
          </div>
          {card.toggle ? <ToggleOff /> : null}
        </div>
      ))}
    </div>
  );
}

const INSTRUCTION_CHIPS = [
  "Give honest feedback",
  "Use clear and simple language",
  "Prioritize my manager",
  "Highlight decisions in meeting notes",
  "Focus on internal sources",
  "Use bullet points for summaries",
] as const;

function SettingsEditorPane() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: F.bold, fontSize: 13, fontWeight: 700, color: C.offBlack }}>
          <ArrowLeft size={14} strokeWidth={1.75} /> Personalization
        </span>
        <X size={16} strokeWidth={1.5} color={C.gray01} />
      </div>
      <p style={{ fontFamily: F.bold, fontSize: 18, fontWeight: 700, color: C.offBlack, margin: "0 0 6px" }}>Custom Instructions</p>
      <p style={{ fontFamily: F.regular, fontSize: 11, color: C.gray01, margin: "0 0 8px", lineHeight: 1.4 }}>
        Add details you want Copilot to know about you and specify how you would like it to format its responses.
      </p>
      <p style={{ fontFamily: F.regular, fontSize: 11, color: C.offBlack, margin: "0 0 6px" }}>
        Add your own custom instructions or choose from the suggestions
      </p>
      <div
        data-tour-id="custom-instructions-editor"
        style={{
          minHeight: 72,
          padding: "10px 12px",
          borderRadius: 8,
          border: `1px solid ${C.gray02}`,
          fontFamily: F.regular,
          fontSize: 12,
          color: C.offBlack,
          lineHeight: 1.5,
          marginBottom: 10,
        }}
      >
        Share clear and truthful feedback in a respectful tone, and focus on offering constructive suggestions when something needs improvement.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
        {INSTRUCTION_CHIPS.map((chip, i) => (
          <span
            key={chip}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 999,
              border: `1px solid ${C.gray02}`,
              fontFamily: F.regular,
              fontSize: 11,
              color: C.offBlack,
            }}
          >
            <Plus size={12} strokeWidth={1.75} /> {chip}
            {i === INSTRUCTION_CHIPS.length - 1 ? <RefreshCw size={12} strokeWidth={1.5} color={C.gray01} /> : null}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "auto" }}>
        <span style={{ padding: "7px 14px", borderRadius: 6, border: `1px solid ${C.gray02}`, fontFamily: F.regular, fontSize: 12, color: C.offBlack }}>
          Cancel
        </span>
        <span
          data-tour-id="save-instructions"
          style={{ padding: "7px 14px", borderRadius: 6, background: C.offBlack, fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.white }}
        >
          Save instructions
        </span>
      </div>
    </div>
  );
}

// ── Canvas: Slide 1 — Personalization ────────────────────────────────────────

const SAVED_PROMPTS_DATA = [
  { label: "GST Compliance Check", icon: FileText },
  { label: "Meeting Summary", icon: MessagesSquare },
  { label: "Inbox Triage", icon: Search },
] as const;

function PersonalizationCanvas({ frameRef, showModelMenu }: { frameRef: (el: HTMLDivElement | null) => void; showModelMenu: boolean }) {
  const { ref, scale } = useScaleToWidth(FIGMA_W);
  return (
    <div
      ref={ref}
      role="img"
      aria-label="M365 Copilot Chat personalization settings"
      style={{ width: "100%", aspectRatio: `${FIGMA_W} / ${FIGMA_H}`, position: "relative", overflow: "hidden", background: C.white }}
    >
      <div
        ref={frameRef}
        aria-hidden
        style={{ position: "absolute", top: 0, left: 0, width: FIGMA_W, height: FIGMA_H, transform: `scale(${scale})`, transformOrigin: "top left", display: "flex", background: C.white }}
      >
        <ChatSidebar />

        {/* Main settings panel */}
        <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", padding: "16px 32px 24px", overflow: "hidden" }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
            <span
              data-tour-id="work-iq"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, border: "1px solid #d0d0d0", fontFamily: F.regular, fontSize: 12, color: "#1f1f1f", background: C.white }}
            >
              <Sparkles size={13} strokeWidth={1.75} color="#7719AA" />
              Work IQ
              <span style={{ display: "inline-block", width: 28, height: 16, borderRadius: 999, background: "#107C10", position: "relative", marginLeft: 4 }}>
                <span style={{ position: "absolute", right: 2, top: 2, width: 12, height: 12, borderRadius: 999, background: C.white }} />
              </span>
            </span>
            {/* Auto pill + open dropdown grouped together as one target */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span data-tour-id="auto-model" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 999, border: "1px solid #d0d0d0", fontFamily: F.regular, fontSize: 12, color: "#1f1f1f", alignSelf: "flex-start" }}>
                Auto <ChevronDown size={12} strokeWidth={1.5} color="#616161" />
              </span>
              {showModelMenu && (
                <div style={{ marginTop: 2 }}>
                  <ModelPickerMenu />
                </div>
              )}
            </div>
          </div>

          {/* Custom Instructions */}
          <div style={{ marginBottom: 16 }}>
            <div data-tour-id="custom-instructions" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Settings size={14} strokeWidth={1.5} color="#424242" />
              <span style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 600, color: "#1f1f1f" }}>Custom Instructions</span>
              <span style={{ padding: "2px 8px", borderRadius: 999, background: "#f0e6fa", fontFamily: F.regular, fontSize: 10, color: "#7719AA" }}>Personalisation</span>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d0d0d0", background: "#fafafa", minHeight: 108 }}>
              <p style={{ fontFamily: F.regular, fontSize: 12, color: "#424242", margin: 0, lineHeight: 1.65 }}>
                I am an Indian tax professional. When responding to tax questions, prioritise Indian tax laws and regulations. Present compliance requirements in bullet points and highlight risks, deadlines, and penalties separately.
              </p>
            </div>
          </div>

          {/* Saved Memories */}
          <div style={{ marginBottom: 20 }}>
            <div data-tour-id="saved-memories" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Brain size={14} strokeWidth={1.5} color="#424242" />
              <span style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 600, color: "#1f1f1f" }}>Saved Memories</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Preferred writing style", "Frequently used formats", "Tax jurisdiction: India"].map(mem => (
                <span key={mem} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, border: "1px solid #d0d0d0", background: C.white, fontFamily: F.regular, fontSize: 11, color: "#424242" }}>
                  <Brain size={11} strokeWidth={1.5} color="#7719AA" />
                  {mem}
                </span>
              ))}
            </div>
          </div>

          {/* Saved Prompts */}
          <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: 16 }}>
            <div data-tour-id="saved-prompts" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Save size={14} strokeWidth={1.5} color="#424242" />
              <span style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 600, color: "#1f1f1f" }}>Saved Prompts</span>
              <span style={{ padding: "2px 8px", borderRadius: 999, background: "#FFF8CC", fontFamily: F.regular, fontSize: 10, color: "#5a4500" }}>Personal library</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {SAVED_PROMPTS_DATA.map(({ label, icon: Icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, border: "1px solid #d0d0d0", background: C.white, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", minWidth: 160 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} strokeWidth={1.75} color={C.dark2} />
                  </span>
                  <span style={{ fontFamily: F.bold, fontSize: 11, fontWeight: 600, color: "#1f1f1f" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Canvas: Custom agent — landing after New agent ────────────────────────────

const AGENT_STARTER_TEMPLATES = [
  {
    title: "Plan My Day",
    body: "Creates a structured plan and task list based on your goals, meetings, and priorities.",
    color: colors.frameBlue,
  },
  {
    title: "Project Delta Digest",
    body: "Summarises project updates, risks, and decisions from recent chats and files.",
    color: colors.frameTeal,
  },
  {
    title: "Executive Briefing Agent",
    body: "Prepares a concise leadership brief from your work data before important meetings.",
    color: colors.framePurple,
  },
] as const;

function AgentBuilderLandingCanvas({
  frameRef,
  onSkip,
}: {
  frameRef: (el: HTMLDivElement | null) => void;
  onSkip?: () => void;
}) {
  const { ref, scale } = useScaleToWidth(FIGMA_W);
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Agent Builder landing after New agent"
      style={{ width: "100%", aspectRatio: `${FIGMA_W} / ${FIGMA_H}`, position: "relative", overflow: "hidden", background: C.white }}
    >
      <div
        ref={frameRef}
        aria-hidden
        style={{ position: "absolute", top: 0, left: 0, width: FIGMA_W, height: FIGMA_H, transform: `scale(${scale})`, transformOrigin: "top left", display: "flex", background: C.white }}
      >
        <ChatSidebar highlightNewAgent prevChatsId="prev-chats" />

        <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", padding: "16px 40px 28px", background: C.white }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginBottom: 8 }}>
            <ShieldCheck size={18} strokeWidth={1.5} color="#107C10" aria-hidden />
            <MoreHorizontal size={18} strokeWidth={1.5} color={C.gray01} aria-hidden />
          </div>

          <div
            data-tour-id="agent-detail-panel"
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}
          >
            <CopilotHex size={44} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <p style={{ margin: 0, fontFamily: F.regular, fontSize: 22, color: C.offBlack, textAlign: "center" }}>
                Build your own specialist agent
              </p>
              <button
                type="button"
                data-tour-id="agent-skip"
                aria-label="Skip to configure your agent"
                onClick={e => { e.stopPropagation(); onSkip?.(); }}
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
              data-tour-id="agent-builder-composer"
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
              <CopilotPlusButton iconSize={18} iconColor={C.offBlack} />
              <span style={{ flex: 1, fontFamily: F.regular, fontSize: 14, color: C.gray01 }}>Message Agent Builder</span>
              <Mic size={18} strokeWidth={1.5} color={C.offBlack} aria-hidden />
            </div>

            <div style={{ display: "inline-flex", padding: 3, borderRadius: 999, background: C.offWhite, border: `1px solid ${C.gray02}` }}>
              <span style={{ padding: "6px 14px", borderRadius: 999, background: C.offBlack, color: C.white, fontFamily: F.regular, fontSize: 12 }}>
                Templates
              </span>
              <span style={{ padding: "6px 14px", fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>My agents</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%", maxWidth: 640 }}>
              {AGENT_STARTER_TEMPLATES.map(t => (
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
                  <span
                    aria-hidden
                    style={{ width: 22, height: 22, borderRadius: 6, background: t.color, display: "block", marginBottom: 8 }}
                  />
                  <p style={{ margin: "0 0 6px", fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.offBlack }}>{t.title}</p>
                  <p style={{ margin: 0, fontFamily: F.regular, fontSize: 11, color: C.gray01, lineHeight: 1.4 }}>{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, on, tourId }: { label: string; on?: boolean; tourId?: string }) {
  return (
    <div data-tour-id={tourId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontFamily: F.regular, fontSize: 12, color: C.offBlack, display: "inline-flex", alignItems: "center", gap: 6 }}>
        {label} <Info size={12} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </span>
      <span
        aria-hidden
        style={{
          width: 32,
          height: 18,
          borderRadius: 999,
          background: on ? C.offBlack : C.gray02,
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

function ChatTourCanvas({
  frameRef,
  knowledgeExpanded,
  agentName = "New Agent",
  agentDescribe = "Describe your agent",
  agentDescribeNode,
  instructionsContent,
  exploreAgentId,
  onExploreAgentSelect,
  exploreVideoLabel,
  onExploreVideo,
  configureOnly = false,
  hideSidebar = false,
  highlightResearcherInSidebar = false,
  instructionsMinHeight,
}: {
  frameRef: (el: HTMLDivElement | null) => void;
  knowledgeExpanded?: boolean;
  agentName?: string;
  agentDescribe?: string;
  agentDescribeNode?: ReactNode;
  instructionsContent?: ReactNode;
  exploreAgentId?: HowExploreAgentId;
  onExploreAgentSelect?: (id: HowExploreAgentId) => void;
  exploreVideoLabel?: string;
  onExploreVideo?: () => void;
  /** What tab — show Configure panel only (no sidebar or centre chat). */
  configureOnly?: boolean;
  /** Instruction preview — hide sidebar for centre + configure layout. */
  hideSidebar?: boolean;
  /** Instruction preview — highlight Researcher in sidebar without explore layout. */
  highlightResearcherInSidebar?: boolean;
  instructionsMinHeight?: number;
}) {
  const sources = [
    { name: "SharePoint", Icon: FileText },
    { name: "Teams", Icon: MessagesSquare },
    { name: "Outlook", Icon: Mail },
    { name: "Web", Icon: Globe },
  ] as const;
  const connectors = ["Adobe Experience Manager", "Azure DevOps", "Custom Connector", "ServiceNow Catalog", "ServiceNow Knowledge"];
  const exploreLayout = !!exploreAgentId && (exploreAgentId === "researcher" || exploreAgentId === "analyst" || exploreAgentId === "new-agent");
  const centerPromo = exploreAgentId ? EXPLORE_AGENT_CENTER_PROMO[exploreAgentId] : null;
  const panelIconKind = exploreAgentId ? agentIconKind(exploreAgentId) : "generic";
  const designW = configureOnly ? 920 : FIGMA_W;
  const designH = configureOnly ? 480 : FIGMA_H;
  const { ref, scale } = useScaleToWidth(designW);
  return (
    <div
      ref={ref}
      role="img"
      aria-label={configureOnly ? "Agent Builder configure panel" : "Microsoft 365 Copilot Chat with Agent Builder configure"}
      style={{
        width: "100%",
        aspectRatio: configureOnly ? "920 / 480" : `${FIGMA_W} / ${FIGMA_H}`,
        position: "relative",
        overflow: "hidden",
        background: C.white,
      }}
    >
      <div
        ref={frameRef}
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: designW,
          height: designH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          display: "flex",
          background: C.white,
        }}
      >
        {!configureOnly && !hideSidebar && (
          <ChatSidebar
            highlightNewAgent={exploreAgentId === "new-agent"}
            highlightResearcher={exploreAgentId === "researcher" || highlightResearcherInSidebar}
            highlightAnalyst={exploreAgentId === "analyst"}
            prevChatsId="prev-chats"
            exploreAgentId={exploreAgentId}
            onExploreAgentSelect={onExploreAgentSelect}
          />
        )}

        {!configureOnly && centerPromo && (
          <div
            style={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "24px 42px 36px",
              background: C.offBlack,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, paddingBottom: 12 }}>
              <ShieldCheck size={18} strokeWidth={1.5} color="#107C10" aria-hidden />
              <MoreHorizontal size={18} strokeWidth={1.5} color={C.offWhite} aria-hidden />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, textAlign: "center" }}>
              <CopilotHex size={60} />
              <p style={EXPLORE_CENTER_PROMO_TEXT}>
                {centerPromo.prefix ?? "Use "}
                <span style={EXPLORE_CENTER_PROMO_HIGHLIGHT}>{centerPromo.highlight}</span>
                {centerPromo.tail}
              </p>
            </div>
          </div>
        )}

        {!configureOnly && !centerPromo && (
          <>
            <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", padding: "24px 42px 36px", background: C.white }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginBottom: 8 }}>
                <ShieldCheck size={18} strokeWidth={1.5} color="#107C10" aria-hidden />
                <MoreHorizontal size={18} strokeWidth={1.5} color={C.gray01} aria-hidden />
              </div>
              <div
                data-tour-id="agent-detail-panel"
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}
              >
                <CopilotHex size={48} />
                <p style={{ fontFamily: F.regular, fontSize: 22, color: C.offBlack, textAlign: "center", margin: 0, lineHeight: 1.35, maxWidth: 360 }}>
                  Build your own specialist agent
                </p>
                <div
                  data-tour-id="agent-builder-composer"
                  style={{
                    width: "100%",
                    maxWidth: 360,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    borderRadius: 28,
                    border: `1px solid ${C.gray02}`,
                    background: C.white,
                  }}
                >
                  <CopilotPlusButton iconSize={16} iconColor={C.offBlack} />
                  <span style={{ flex: 1, fontFamily: F.regular, fontSize: 14, color: C.gray01 }}>Message Agent Builder</span>
                  <Mic size={18} strokeWidth={1.5} color={C.offBlack} aria-hidden />
                </div>
              </div>
            </div>
          </>
        )}

        <div
          data-tour-id="agent-builder"
          style={{
            width: configureOnly ? "100%" : exploreLayout ? 352 : 420,
            flex: configureOnly ? 1 : undefined,
            flexShrink: configureOnly ? undefined : 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderLeft: configureOnly ? "none" : `1px solid ${C.gray02}`,
            background: C.white,
            minHeight: 0,
          }}
        >
          {!exploreLayout && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${C.gray02}`, flexShrink: 0 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 999, border: `1px solid ${C.gray02}`, fontFamily: F.regular, fontSize: 11, color: C.offBlack }}>
                <CopilotHex size={14} /> Agent Builder
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.gray02}`, fontFamily: F.regular, fontSize: 11, color: C.offBlack }}>
                Configure <ChevronDown size={12} strokeWidth={1.75} color={C.gray01} aria-hidden />
              </span>
              <span style={{ flex: 1 }} />
              <Plus size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
              <MoreHorizontal size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
              <X size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
            </div>
          )}
          {exploreLayout && exploreAgentId === "new-agent" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${C.gray02}`, flexShrink: 0 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, border: `1px solid ${C.gray02}`, fontFamily: F.regular, fontSize: 11, color: C.offBlack }}>
                <CopilotHex size={14} /> Agent Builder
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 6, border: `1px solid ${C.gray02}`, fontFamily: F.regular, fontSize: 11, color: C.offBlack }}>
                Configure <ChevronDown size={12} strokeWidth={1.75} color={C.gray01} aria-hidden />
              </span>
              <span style={{ flex: 1 }} />
              <Plus size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
              <MoreHorizontal size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
              <X size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
            </div>
          )}

          <div
            data-tour-scroll
            style={{
              padding: exploreLayout ? "14px 16px 0" : "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: exploreLayout ? 0 : 12,
              flex: 1,
              minHeight: 0,
              overflowX: "hidden",
              overflowY: exploreLayout ? "hidden" : "auto",
            }}
          >
            {exploreLayout ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    flexShrink: 0,
                    paddingBottom: 12,
                    marginBottom: 12,
                    borderBottom: exploreAgentId === "new-agent" ? "none" : `1px solid ${C.gray02}`,
                  }}
                >
                  <AgentIcon kind={panelIconKind} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      data-tour-id="agent-name"
                      style={{
                        margin: "0 0 4px",
                        fontFamily: F.bold,
                        fontSize: exploreAgentId === "new-agent" ? 20 : 18,
                        fontWeight: 700,
                        color: C.offBlack,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        lineHeight: 1.25,
                      }}
                    >
                      {agentName} <PenLine size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
                    </p>
                    {agentDescribeNode ?? (
                      <p data-tour-id="agent-describe" style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01, lineHeight: 1.5 }}>
                        {agentDescribe}
                      </p>
                    )}
                  </div>
                  {exploreAgentId === "new-agent" && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.regular, fontSize: 12, color: C.gray01, flexShrink: 0 }}>
                      Auto <ChevronDown size={12} strokeWidth={1.75} aria-hidden />
                    </span>
                  )}
                </div>

                <div
                  data-tour-id="agent-instructions"
                  style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, justifyContent: "flex-start" }}
                >
                  <div
                    data-tour-id="agent-instructions-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      flexShrink: 0,
                      maxHeight: "100%",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {instructionsContent}
                  </div>
                  {exploreVideoLabel && onExploreVideo && (
                    <div
                      style={{
                        flexShrink: 0,
                        paddingTop: 12,
                        paddingBottom: 8,
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <button type="button" onClick={onExploreVideo} style={howVideoBtnStyle}>
                        <Play size={14} strokeWidth={1.75} aria-hidden />
                        {exploreVideoLabel}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
            <div
              data-tour-id="agent-instructions"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <AgentIcon kind={panelIconKind} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    data-tour-id="agent-name"
                    style={{ margin: 0, fontFamily: F.bold, fontSize: 18, fontWeight: 700, color: C.offBlack, display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {agentName} <PenLine size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
                  </p>
                  {agentDescribeNode ?? (
                    <p data-tour-id="agent-describe" style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>
                      {agentDescribe}
                    </p>
                  )}
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>
                  Auto <ChevronDown size={12} strokeWidth={1.75} aria-hidden />
                </span>
              </div>
              <div
                data-tour-id="agent-instructions-card"
                style={{ border: `1px solid ${C.gray02}`, borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 700, color: C.offBlack }}>Instructions</span>
                  <Info size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
                </div>
                <div
                  style={{
                    minHeight: instructionsMinHeight ?? (instructionsContent ? 140 : 72),
                    border: `1px solid ${C.gray02}`,
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  {instructionsContent ?? (
                    <p style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01, lineHeight: 1.5 }}>
                      Describe what this agent should do, define its tone, and outline any rules or guidelines it must follow.
                    </p>
                  )}
                </div>
              </div>
            </div>
            )}

            {!exploreLayout && (knowledgeExpanded ? (
              <div data-tour-id="knowledge-sources" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: F.bold, fontSize: 14, fontWeight: 700, color: C.offBlack, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    Knowledge <Info size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
                  </span>
                  <RefreshCw size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
                </div>
                <p style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>
                  Choose the sources your agent will use to generate responses.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ margin: 0, fontFamily: F.regular, fontSize: 11, color: C.gray01 }}>Add files, meetings, chats, emails, and websites</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {sources.map(s => (
                      <span key={s.name} title={s.name} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.gray02}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: C.offBlack }}>
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
                <ToggleRow label="Only use specified sources" />
                <ToggleRow label="Reference org chart and profile info" on />
                <p style={{ margin: "4px 0 0", fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.offBlack }}>Add other data sources</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {connectors.map(name => (
                    <span key={name} style={{ border: `1px solid ${C.gray02}`, borderRadius: 8, padding: "8px 8px", fontFamily: F.regular, fontSize: 10, color: C.offBlack, lineHeight: 1.3 }}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div data-tour-id="knowledge-sources" style={{ border: `1px solid ${C.gray02}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <span style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 700, color: C.offBlack, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Knowledge <Info size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
                </span>
                <RefreshCw size={13} strokeWidth={1.75} color={C.gray01} aria-hidden />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const CALLOUT_RING_SHADOW = `4px 4px 0 0 color-mix(in srgb, ${C.confidentBlack} 88%, transparent)`;

function pillHighlightRadius(target: string) {
  return target === "work-iq-main" || target === "auto-model" || target === "more-menu" || target === "saved-prompts-pill" || target === "agent-skip"
    || target === "quick-pills-more" || target === "m365-apps-trigger" || target === "agent-detail-panel"
    ? 12
    : 6;
}

function useTourTargetRect(frame: HTMLDivElement | null, target: string | null, active: boolean) {
  const [rect, setRect] = useState<CalloutRect | null>(null);

  useLayoutEffect(() => {
    if (!frame || !active || !target) {
      setRect(null);
      return;
    }
    return subscribeTourTargetMeasure(frame, target, setRect);
  }, [frame, target, active]);

  return rect;
}

/** Current (solid, clickable) + next (dashed, hint) rings for What-tab onboarding. */
function TourDualRingOverlay({
  frame,
  currentTarget,
  nextTarget,
  currentLabel,
  onCurrentClick,
}: {
  frame: HTMLDivElement | null;
  currentTarget: string;
  nextTarget: string | null;
  currentLabel: string;
  onCurrentClick: () => void;
}) {
  const currentRect = useTourTargetRect(frame, currentTarget, true);
  const nextRect = useTourTargetRect(
    frame,
    nextTarget && nextTarget !== currentTarget ? nextTarget : null,
    true,
  );

  if (!currentRect && !nextRect) return null;

  return (
    <div
      aria-hidden={false}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {nextRect && (
        <div
          aria-hidden
          className="ey-tour-ring-pulse-next"
          style={{
            position: "absolute",
            left: `${nextRect.left}%`,
            top: `${nextRect.top}%`,
            width: `${nextRect.width}%`,
            height: `${nextRect.height}%`,
            boxSizing: "border-box",
            border: `2px dashed ${C.yellow}`,
            borderRadius: pillHighlightRadius(nextTarget!),
            background: `color-mix(in srgb, ${C.yellow} 6%, transparent)`,
            boxShadow: `0 0 0 1px color-mix(in srgb, ${C.yellow} 20%, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}

      {currentRect && (
        <button
          type="button"
          aria-label={`Continue from ${currentLabel}`}
          onMouseDown={e => e.preventDefault()}
          onClick={onCurrentClick}
          className="ey-tour-ring-pulse"
          style={{
            position: "absolute",
            left: `${currentRect.left}%`,
            top: `${currentRect.top}%`,
            width: `${currentRect.width}%`,
            height: `${currentRect.height}%`,
            boxSizing: "border-box",
            border: `2px solid ${C.yellow}`,
            borderRadius: pillHighlightRadius(currentTarget),
            background: "transparent",
            boxShadow: CALLOUT_RING_SHADOW,
            cursor: "pointer",
            padding: 0,
            zIndex: 2,
            pointerEvents: "auto",
          }}
        />
      )}
    </div>
  );
}

function whatTourCurrentTarget(step: WhatOnboardingStep): string {
  if (step.phase === "plain") {
    return step.view === "chat-home" ? "agents-list" : "agent-builder-composer";
  }
  return step.callout.target;
}

function whatTourCurrentLabel(step: WhatOnboardingStep): string {
  if (step.phase === "plain") {
    return step.view === "chat-home" ? "Agents list" : "Agent Builder";
  }
  return step.callout.title;
}

function whatTourNextTarget(stepIndex: number): string | null {
  const next = HOW_ONBOARDING_STEPS[stepIndex + 1];
  if (!next) return null;
  if (next.phase === "spotlight" || next.phase === "builder") return next.callout.target;
  if (next.view === "chat-home") return "researcher";
  return "new-agent";
}

function CalloutBox({
  callout,
  active,
  stepNum,
  frame,
  onNext,
  isLast,
  ringOnly = false,
  pulseRing = false,
}: {
  callout: Callout;
  active: boolean;
  stepNum: number;
  frame: HTMLDivElement | null;
  onNext: () => void;
  isLast: boolean;
  /** Hide the annotation card — only show the clickable highlight ring. */
  ringOnly?: boolean;
  /** Pulsate the highlight ring to invite a click. */
  pulseRing?: boolean;
}) {
  const Icon = callout.icon;
  const [rect, setRect] = useState<CalloutRect | null>(null);

  useLayoutEffect(() => {
    if (!frame || !active) { setRect(null); return; }
    return subscribeTourTargetMeasure(frame, callout.target, setRect);
  }, [frame, callout.target, active]);

  if (!rect) return null;
  const placement = callout.cardInset ? callout.placement : safePlacement(rect, callout.placement);
  const anchor = callout.cardInset
    ? insetCardAnchor(rect, callout.cardInset, callout.anchorY)
    : cardAnchor(rect, placement, callout.anchorY);
  const annotationTransform = callout.cardInset
    ? insetCardTransform(callout.cardInset)
    : cardTransform(placement);
  const overlayZ = active ? (callout.target === "prompt-lab-modal" || callout.target === "m365-apps-flyout" || callout.target === "plus-menu" ? 45 : 20) : 5;

  return (
    <div
      role="note"
      aria-hidden={!active}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: overlayZ,
        opacity: active ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.3s ease",
        background: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        filter: "none",
      }}
    >
      {/* Yellow ring — click advances the same as Next */}
      <button
        type="button"
        aria-label={`Continue from ${callout.title}`}
        onMouseDown={e => e.preventDefault()}
        onClick={onNext}
        className={pulseRing ? "ey-tour-ring-pulse" : undefined}
        style={{
          position: "absolute",
          left: `${rect.left}%`,
          top: `${rect.top}%`,
          width: `${rect.width}%`,
          height: `${rect.height}%`,
          boxSizing: "border-box",
          border: `2px solid ${C.yellow}`,
          borderRadius: pillHighlightRadius(callout.target),
          background: "transparent",
          boxShadow: CALLOUT_RING_SHADOW,
          cursor: "pointer",
          padding: 0,
          zIndex: 2,
          pointerEvents: "auto",
        }}
      />

      {!ringOnly && (
      <div
        style={{
          position: "absolute",
          left: `${anchor.left}%`,
          top: `${anchor.top}%`,
          width: callout.cardInset ? "min(220px, 24vw)" : "min(260px, 38vw)",
          maxWidth: callout.cardInset ? "24%" : undefined,
          background: C.white,
          border: `1.5px solid ${C.yellow}`,
          borderRadius: 12,
          padding: "12px 14px",
          boxShadow: `0 12px 32px color-mix(in srgb, ${C.confidentBlack} 18%, transparent)`,
          zIndex: 3,
          pointerEvents: "auto",
          ...annotationTransform,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ width: 26, height: 26, minWidth: 26, borderRadius: 7, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.dark2 }}>
            {stepNum}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <Icon size={14} strokeWidth={1.75} color={C.dark2} aria-hidden />
              <p style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 700, color: C.dark2, margin: 0, lineHeight: 1.3 }}>{callout.title}</p>
            </div>
            <p style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01, margin: 0, lineHeight: 1.5 }}>{callout.body}</p>
          </div>
        </div>
        {!isLast && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={onNext}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 999, border: "none", background: C.yellow, color: C.dark2, fontFamily: F.bold, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
            >
              Next <ChevronRight size={13} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

const BUILDER_CONFIGURE_TARGETS = new Set(["agent-instructions", "knowledge-sources"]);

const CHAT_HOME_TARGETS = new Set([
  "work-iq-main",
  "auto-model",
  "more-menu",
  "chat-settings-item",
  "settings-general",
  "settings-personalization",
  "edit-instructions",
  "custom-instructions-editor",
  "save-instructions",
  "saved-prompts-pill",
  "quick-pills-more",
  "prompt-lab-modal",
  "plus-apps",
  "plus-menu",
]);

function settingsPaneFor(target: string): SettingsPane {
  if (target === "settings-general") return "general";
  if (target === "settings-personalization" || target === "edit-instructions") return "personalization";
  if (target === "custom-instructions-editor" || target === "save-instructions") return "editor";
  return null;
}

// ── Nav button styles ─────────────────────────────────────────────────────────

const navBtnStyle = (disabled: boolean): CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999,
  border: `1px solid ${C.gray02}`, background: C.white, color: disabled ? C.gray02 : C.dark2,
  fontFamily: F.regular, fontSize: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
});

const primaryBtnStyle: CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 999,
  border: "none", background: C.yellow, color: C.dark2, fontFamily: F.bold, fontSize: 14, fontWeight: 700, cursor: "pointer", marginLeft: "auto",
};

// ── Main export ───────────────────────────────────────────────────────────────

/** workflowStep 1–6 maps to the Chat use-case pills. */
export function chatTourUseCaseIndex(workflowStep: number): number {
  return Math.max(0, Math.min(5, workflowStep - 1));
}

export function M365ChatSlideTour({ onHighlightUseCase }: { onHighlightUseCase?: (index: number) => void } = {}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [calloutIndex, setCalloutIndex] = useState(0);
  const [frameEl, setFrameEl] = useState<HTMLDivElement | null>(null);
  const [promptLabOpen, setPromptLabOpen] = useState(false);
  const tourRef = useRef<HTMLDivElement>(null);

  const slide = CHAT_TOUR_SLIDES[slideIndex];
  const totalSlides = CHAT_TOUR_SLIDES.length;
  const totalCallouts = slide.callouts.length;
  const safeCalloutIndex = Math.min(calloutIndex, totalCallouts - 1);
  const currentCallout = slide.callouts[safeCalloutIndex];
  const workflowStep = currentCallout.workflowStep;
  const highlightUseCase = chatTourUseCaseIndex(workflowStep);

  useEffect(() => {
    onHighlightUseCase?.(highlightUseCase);
  }, [highlightUseCase, onHighlightUseCase]);

  useEffect(() => {
    if (currentCallout.target === "prompt-lab-modal") setPromptLabOpen(true);
    else setPromptLabOpen(false);
  }, [currentCallout.target, slideIndex, safeCalloutIndex]);

  const showChatHome = slide.kind === "personalization" && CHAT_HOME_TARGETS.has(currentCallout.target);
  const chatSettingsPane = showChatHome ? settingsPaneFor(currentCallout.target) : null;
  const highlightSavedPromptsPill = currentCallout.target === "saved-prompts-pill";
  const highlightQuickPillsMore = currentCallout.target === "quick-pills-more";
  const tourPromptLabStep = currentCallout.target === "prompt-lab-modal";
  const skipGate = slide.kind === "builder" && currentCallout.target === "agent-skip";
  const newChatGate = slide.kind === "create" && currentCallout.target === "new-chat";
  const plusMenuGate = currentCallout.target === "plus-apps";
  const forcePlusMenuOpen = currentCallout.target === "plus-menu";
  const builderConfigure = slide.kind === "builder" && BUILDER_CONFIGURE_TARGETS.has(currentCallout.target);

  const isFirstCallout = safeCalloutIndex === 0;
  const isLastCallout = safeCalloutIndex === totalCallouts - 1;
  const isFirstSlide = slideIndex === 0;
  const isLastSlide = slideIndex === totalSlides - 1;
  const tourComplete = isLastSlide && isLastCallout;

  const goNext = useCallback(() => {
    setCalloutIndex(prev => {
      if (prev < totalCallouts - 1) return prev + 1;
      // Last callout — advance to next slide
      if (!isLastSlide) {
        setSlideIndex(s => s + 1);
        setFrameEl(null);
        return 0;
      }
      return prev; // tour complete — stay put
    });
  }, [totalCallouts, isLastSlide]);

  const goPrev = useCallback(() => {
    setCalloutIndex(prev => {
      if (prev > 0) return prev - 1;
      if (!isFirstSlide) {
        const prevSlide = slideIndex - 1;
        setSlideIndex(prevSlide);
        setFrameEl(null);
        return CHAT_TOUR_SLIDES[prevSlide].callouts.length - 1;
      }
      return 0;
    });
  }, [isFirstSlide, slideIndex]);

  const restart = useCallback(() => {
    setSlideIndex(0); setCalloutIndex(0); setFrameEl(null);
    tourRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!tourRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === "Escape" && promptLabOpen && !tourPromptLabStep) { e.preventDefault(); setPromptLabOpen(false); return; }
      if (promptLabOpen && !tourPromptLabStep) return;
      if (e.key === "ArrowRight" || e.key === "Enter") { e.preventDefault(); if (!tourComplete) goNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); if (!isFirstSlide || !isFirstCallout) goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, tourComplete, isFirstSlide, isFirstCallout, promptLabOpen, tourPromptLabStep]);

  const frameRefCb = useCallback((el: HTMLDivElement | null) => setFrameEl(el), []);

  const handleOpenQuickPillsMore = useCallback(() => {
    if (currentCallout.target === "quick-pills-more") {
      setPromptLabOpen(true);
      goNext();
    } else {
      setPromptLabOpen(true);
    }
  }, [currentCallout.target, goNext]);

  return (
    <div ref={tourRef} tabIndex={0} role="region" aria-label="M365 Copilot Chat guided tour" aria-roledescription="carousel"
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16, outline: "none" }}>

      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: F.bold, fontSize: typeScale.label.size, fontWeight: 700, letterSpacing: typeScale.label.tracking, textTransform: "uppercase", color: C.dark2 }}>
            {slide.label}
          </span>
          <span style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>
            Step {workflowStep} of {WORKFLOW_STEPS}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} aria-hidden>
          {Array.from({ length: WORKFLOW_STEPS }, (_, i) => (
            <span key={i} style={{ width: i + 1 === workflowStep ? 24 : 8, height: 8, borderRadius: 999, background: i + 1 === workflowStep ? C.yellow : C.gray02, transition: "width 0.2s ease" }} />
          ))}
        </div>
      </div>

      {/* Canvas with callout overlays */}
      <div style={{ position: "relative", width: "100%", borderRadius: 16, border: `1px solid ${C.gray02}`, background: C.white, boxShadow: `0 16px 40px color-mix(in srgb, ${C.confidentBlack} 10%, transparent)` }}>
        {showChatHome && (
          <ChatMainCanvas
            key={`setup-${currentCallout.target}`}
            frameRef={frameRefCb}
            showMoreMenu={currentCallout.target === "chat-settings-item"}
            showModelMenu={currentCallout.target === "auto-model"}
            settingsPane={chatSettingsPane}
            highlightSavedPromptsPill={highlightSavedPromptsPill}
            highlightQuickPillsMore={highlightQuickPillsMore}
            showPlusMenu={forcePlusMenuOpen ? true : undefined}
            onPlusMenuOpen={plusMenuGate ? goNext : undefined}
            showPromptLab={promptLabOpen}
            onOpenSavedPrompts={() => setPromptLabOpen(true)}
            onOpenQuickPillsMore={handleOpenQuickPillsMore}
            onClosePromptLab={() => setPromptLabOpen(false)}
          />
        )}
        {slide.kind === "personalization" && !CHAT_HOME_TARGETS.has(currentCallout.target) && (
          <PersonalizationCanvas key="personalization" frameRef={frameRefCb} showModelMenu={currentCallout.target === "auto-model"} />
        )}
        {slide.kind === "analyst" && (
          <ChatMainCanvas
            frameRef={frameRefCb}
            showPromptLab={promptLabOpen}
            onOpenSavedPrompts={() => setPromptLabOpen(true)}
            onClosePromptLab={() => setPromptLabOpen(false)}
          />
        )}
        {slide.kind === "builder" && currentCallout.target === "new-agent" && (
          <ChatMainCanvas
            key="builder-new-agent"
            frameRef={frameRefCb}
            highlightNewAgent
            showPromptLab={promptLabOpen}
            onOpenSavedPrompts={() => setPromptLabOpen(true)}
            onClosePromptLab={() => setPromptLabOpen(false)}
          />
        )}
        {slide.kind === "builder" && currentCallout.target === "agent-skip" && (
          <AgentBuilderLandingCanvas key="builder-landing" frameRef={frameRefCb} onSkip={goNext} />
        )}
        {builderConfigure && (
          <ChatTourCanvas
            key={`builder-configure-${currentCallout.target}`}
            frameRef={frameRefCb}
            knowledgeExpanded={currentCallout.target === "knowledge-sources"}
          />
        )}
        {slide.kind === "agents-landing" && (
          <ChatMainCanvas
            key={`agents-landing-${currentCallout.target}`}
            frameRef={frameRefCb}
            highlightResearcher={currentCallout.target === "researcher"}
            highlightAnalyst={currentCallout.target === "analyst"}
            highlightNewAgent={currentCallout.target === "new-agent"}
            highlightQuickPillsMore={currentCallout.target === "quick-pills-more"}
            showPromptLab={promptLabOpen}
            onOpenSavedPrompts={() => setPromptLabOpen(true)}
            onOpenQuickPillsMore={handleOpenQuickPillsMore}
            onClosePromptLab={() => setPromptLabOpen(false)}
          />
        )}
        {slide.kind === "researcher" && (
          <ChatMainCanvas
            frameRef={frameRefCb}
            highlightResearcher
            showPromptLab={promptLabOpen}
            onOpenSavedPrompts={() => setPromptLabOpen(true)}
            onClosePromptLab={() => setPromptLabOpen(false)}
          />
        )}
        {slide.kind === "create" && currentCallout.target !== "create-describe-input" && (
          <ChatMainCanvas
            key={`create-${currentCallout.target}`}
            frameRef={frameRefCb}
            highlightNewChat={currentCallout.target === "new-chat"}
            highlightM365AppsTrigger={currentCallout.target === "m365-apps-flyout"}
            showM365AppsFlyout={currentCallout.target === "m365-apps-flyout"}
            onNewChat={newChatGate ? goNext : undefined}
            onM365AppsClick={currentCallout.target === "m365-apps-flyout" ? goNext : undefined}
            showPromptLab={promptLabOpen}
            onOpenSavedPrompts={() => setPromptLabOpen(true)}
            onOpenQuickPillsMore={handleOpenQuickPillsMore}
            onClosePromptLab={() => setPromptLabOpen(false)}
          />
        )}
        {slide.kind === "create" && currentCallout.target === "create-describe-input" && (
          <CreateContentCanvas key="create-studio" frameRef={frameRefCb} />
        )}
        {slide.callouts.map((c, i) => (
          <CalloutBox key={`${slideIndex}-${i}-${c.target}`} callout={c} active={i === safeCalloutIndex} stepNum={c.workflowStep} frame={frameEl} onNext={goNext} isLast={tourComplete || (i === totalCallouts - 1 && isLastSlide)} />
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0 0" }}>
        <button type="button" onClick={goPrev} disabled={isFirstSlide && isFirstCallout} aria-label="Previous step" style={navBtnStyle(isFirstSlide && isFirstCallout)}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden /> Previous
        </button>
        {tourComplete ? (
          <button type="button" onClick={restart} aria-label="Restart tour" style={primaryBtnStyle}>Restart tour</button>
        ) : (
          <button type="button" onClick={goNext} aria-label="Next step" style={primaryBtnStyle}>
            Continue <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

const AGENT_BUILDER_SLIDE: Slide = {
  label: "Custom Agent",
  kind: "builder",
  callouts: [
    {
      title: "New agent",
      body: "In the sidebar under Agents, choose New agent to start building a specialist for Indian tax workflows.",
      icon: Bot,
      target: "new-agent",
      placement: "right",
      workflowStep: 1,
    },
    {
      title: "Skip the chat",
      body: "Agent Builder opens with a short chat. Press Skip to jump straight to the configure screen — name, instructions, and knowledge sources.",
      icon: ChevronRight,
      target: "agent-skip",
      placement: "left",
      anchorY: 0.35,
      workflowStep: 2,
    },
    {
      title: "Describe your agent",
      body: "Name the agent, then write instructions — what it should do, the tone to use, and guardrails for Indian tax workflows.",
      icon: PenLine,
      target: "agent-instructions",
      placement: "left",
      workflowStep: 3,
    },
    {
      title: "Knowledge sources",
      body: "Add approved files, SharePoint, meetings, email, and websites so answers stay grounded in your source of truth.",
      icon: BookOpen,
      target: "knowledge-sources",
      placement: "left",
      workflowStep: 4,
    },
  ],
};

/** Agent Builder walkthrough — same UI as MS Chat Custom Agent (sidebar + configure panel). */
export function M365AgentBuilderTour() {
  const [calloutIndex, setCalloutIndex] = useState(0);
  const [frameEl, setFrameEl] = useState<HTMLDivElement | null>(null);
  const tourRef = useRef<HTMLDivElement>(null);

  const slide = AGENT_BUILDER_SLIDE;
  const totalCallouts = slide.callouts.length;
  const safeCalloutIndex = Math.min(calloutIndex, totalCallouts - 1);
  const currentCallout = slide.callouts[safeCalloutIndex];

  const builderConfigure = BUILDER_CONFIGURE_TARGETS.has(currentCallout.target);
  const isFirstCallout = safeCalloutIndex === 0;
  const isLastCallout = safeCalloutIndex === totalCallouts - 1;
  const tourComplete = isLastCallout;

  const goNext = useCallback(() => {
    setCalloutIndex(prev => (prev < totalCallouts - 1 ? prev + 1 : prev));
  }, [totalCallouts]);

  const goPrev = useCallback(() => {
    setCalloutIndex(prev => (prev > 0 ? prev - 1 : 0));
  }, []);

  const restart = useCallback(() => {
    setCalloutIndex(0);
    setFrameEl(null);
    tourRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!tourRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === "ArrowRight" || e.key === "Enter") { e.preventDefault(); if (!tourComplete) goNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); if (!isFirstCallout) goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, tourComplete, isFirstCallout]);

  const frameRefCb = useCallback((el: HTMLDivElement | null) => setFrameEl(el), []);

  return (
    <div
      ref={tourRef}
      tabIndex={0}
      role="region"
      aria-label="M365 Agent Builder workflow"
      aria-roledescription="carousel"
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16, outline: "none" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 16,
          border: `1px solid ${C.gray02}`,
          background: C.white,
          boxShadow: `0 16px 40px color-mix(in srgb, ${C.confidentBlack} 10%, transparent)`,
        }}
      >
        {currentCallout.target === "new-agent" && (
          <ChatMainCanvas key="builder-new-agent" frameRef={frameRefCb} highlightNewAgent />
        )}
        {currentCallout.target === "agent-skip" && (
          <AgentBuilderLandingCanvas key="builder-landing" frameRef={frameRefCb} onSkip={goNext} />
        )}
        {builderConfigure && (
          <ChatTourCanvas
            key={`builder-configure-${currentCallout.target}`}
            frameRef={frameRefCb}
            knowledgeExpanded={currentCallout.target === "knowledge-sources"}
          />
        )}
        {slide.callouts.map((c, i) => (
          <CalloutBox
            key={`builder-${i}-${c.target}`}
            callout={c}
            active={i === safeCalloutIndex}
            stepNum={i + 1}
            frame={frameEl}
            onNext={goNext}
            isLast={tourComplete || i === totalCallouts - 1}
          />
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0 0" }}>
        <button type="button" onClick={goPrev} disabled={isFirstCallout} aria-label="Previous step" style={navBtnStyle(isFirstCallout)}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden /> Previous
        </button>
        {tourComplete ? (
          <button type="button" onClick={restart} aria-label="Restart tour" style={primaryBtnStyle}>Restart tour</button>
        ) : (
          <button type="button" onClick={goNext} aria-label="Next step" style={primaryBtnStyle}>
            Continue <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

function InstructionFocusRing({ frame, target }: { frame: HTMLDivElement | null; target: string }) {
  const [rect, setRect] = useState<CalloutRect | null>(null);

  useLayoutEffect(() => {
    if (!frame) {
      setRect(null);
      return;
    }
    return subscribeTourTargetMeasure(frame, target, setRect);
  }, [frame, target]);

  if (!rect) return null;

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
      <div
        style={{
          position: "absolute",
          left: `${rect.left}%`,
          top: `${rect.top}%`,
          width: `${rect.width}%`,
          height: `${rect.height}%`,
          boxSizing: "border-box",
          border: `2px solid ${C.yellow}`,
          borderRadius: pillHighlightRadius(target),
          boxShadow: CALLOUT_RING_SHADOW,
          transition: "left 0.25s ease, top 0.25s ease, width 0.25s ease, height 0.25s ease",
        }}
      />
    </div>
  );
}

export type AgentInstructionPreviewFocus = "purpose" | "detail" | "instructions" | "knowledge";

const INSTRUCTION_FOCUS_TARGETS: Record<AgentInstructionPreviewFocus, string> = {
  purpose: "agent-name",
  detail: "agent-detail-panel",
  instructions: "agent-instructions-card",
  knowledge: "knowledge-sources",
};

/** Live Agent Builder canvas for the What panel — highlights the active instruction component. */
export function AgentBuilderInstructionPreview({ focus }: { focus: AgentInstructionPreviewFocus }) {
  const [frameEl, setFrameEl] = useState<HTMLDivElement | null>(null);
  const frameRefCb = useCallback((el: HTMLDivElement | null) => setFrameEl(el), []);
  const highlightTarget = INSTRUCTION_FOCUS_TARGETS[focus];
  const usesFullCanvas = focus === "detail" || focus === "instructions" || focus === "knowledge";
  const hideSidebar = focus === "detail";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: 16,
        border: `1px solid ${C.gray02}`,
        background: C.white,
        boxShadow: `0 16px 40px color-mix(in srgb, ${C.confidentBlack} 10%, transparent)`,
        overflow: "hidden",
      }}
    >
      <ChatTourCanvas
        frameRef={frameRefCb}
        knowledgeExpanded={focus === "knowledge"}
        configureOnly={!usesFullCanvas}
        hideSidebar={hideSidebar}
        highlightResearcherInSidebar={usesFullCanvas && !hideSidebar}
        agentName={usesFullCanvas ? "Researcher" : "New Agent"}
        agentDescribe={usesFullCanvas ? "Do the heavy lifting" : "Describe your agent"}
      />
      <InstructionFocusRing frame={frameEl} target={highlightTarget} />
    </div>
  );
}

const HOW_AGENT_PROFILES: Record<
  HowExploreAgentId,
  { name: string; describe: string; intro: string; pointers: string[]; exploreTagline: string }
> = {
  researcher: {
    name: "Researcher",
    describe: "Do the heavy lifting",
    intro: "Let Copilot's Researcher agent do the heavy lifting:",
    exploreTagline: "agent do the heavy lifting",
    pointers: [
      "Step-by-Step Reasoning",
      "Source-Cited Reports",
      "Market Intelligence",
      "Knowledge Assistant",
      "Fact to Case Law Analysis",
    ],
  },
  analyst: {
    name: "Analyst",
    describe: "Navigate bulky data",
    intro: "Let Copilot's Analyst agent navigate bulky data:",
    exploreTagline: "agent navigate bulky data",
    pointers: [
      "Assessment Patterns",
      "Judgement Trends",
      "Provision Shifts",
      "GST Reconciliations",
      "APA Computations",
    ],
  },
  "new-agent": {
    name: "New Agent",
    describe: "No Code Custom agents",
    intro: "Let Copilot's No Code Custom agents work as your team's specialist:",
    exploreTagline: "No Code Custom agents",
    pointers: [
      "Review Partner",
      "Tax Research Expert",
      "Learning Coach",
      "Ideation Engine",
      "Work Assistant",
    ],
  },
};

const EXPLORE_CENTER_PROMO_TEXT: CSSProperties = {
  margin: 0,
  fontFamily: F.light,
  fontSize: 20,
  fontWeight: 300,
  lineHeight: 1.5,
  color: C.offWhite,
  maxWidth: 400,
};

const EXPLORE_CENTER_PROMO_HIGHLIGHT: CSSProperties = {
  fontFamily: F.regular,
  fontWeight: 400,
  color: C.yellow,
};

const EXPLORE_AGENT_CENTER_PROMO: Record<HowExploreAgentId, { prefix?: string; highlight: string; tail: string }> = {
  researcher: {
    highlight: "Researcher agent on your work data",
    tail: " to deliver cited, multi-stage research briefs for Indian tax workflows.",
  },
  analyst: {
    highlight: "Analyst agent on your tax data",
    tail: " to flag risk, spot trends and surface Insights.",
  },
  "new-agent": {
    prefix: "Create ",
    highlight: "Personalised agents",
    tail: " that work the way you do so that your expertise is available on demand!",
  },
};

function AgentInstructionBulletCards({ items, compact = false }: { items: string[]; compact?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 6 : 12, width: "100%" }}>
      {items.map(item => (
        <div
          key={item}
          style={{
            display: "flex",
            alignItems: "center",
            gap: compact ? 8 : 12,
            padding: compact ? "5px 8px" : "9px 12px",
            borderRadius: 8,
            border: `1.5px solid ${C.gray02}`,
          }}
        >
          <Circle size={compact ? 14 : 18} strokeWidth={1.5} color={C.gray02} aria-hidden style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: F.regular, fontSize: compact ? 12 : 16, lineHeight: 1.35, color: C.gray01 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function NewAgentExploreSubtitle() {
  return (
    <p data-tour-id="agent-describe" style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01, lineHeight: 1.5 }}>
      Let Copilot&apos;s <span style={{ fontFamily: F.bold, fontWeight: 700 }}>No Code Custom agents</span> work as your team&apos;s specialist
    </p>
  );
}

function AgentExploreSubtitle({ agentLabel, tagline }: { agentLabel: string; tagline: string }) {
  return (
    <p data-tour-id="agent-describe" style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01, lineHeight: 1.5 }}>
      Let Copilot&apos;s <span style={{ fontFamily: F.bold, fontWeight: 700 }}>{agentLabel}</span> {tagline}
    </p>
  );
}

const NEW_AGENT_REASONING_LEVELS = [
  {
    label: "Deep reasoning",
    body: "Analyze the current-quarter advance tax computation against the prior quarter. Evaluate changes in assumptions, forecast movements and tax adjustments. Justify the drivers of material variances and recommend follow-up actions.",
  },
  {
    label: "Moderate reasoning",
    body: "Summarize the key quarter-on-quarter movements in the advance tax computation and list the main reasons for the changes.",
  },
  {
    label: "Fast & minimal reasoning",
    body: "Provide the list of reasons for changes in the advance tax computation.",
  },
] as const;

function AgentPointerInstructions({ intro, pointers }: { intro: string; pointers: string[] }) {
  return (
    <div>
      <p style={{ margin: 0, fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.offBlack, lineHeight: 1.5 }}>
        {intro}
      </p>
      <ul
        style={{
          margin: "10px 0 0",
          paddingLeft: 18,
          fontFamily: F.regular,
          fontSize: 12,
          color: C.gray01,
          lineHeight: 1.55,
        }}
      >
        {pointers.map(point => (
          <li key={point} style={{ marginBottom: 6 }}>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewAgentReasoningInstructions({ intro }: { intro: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ margin: 0, fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.offBlack, lineHeight: 1.45 }}>
        {intro}
      </p>
      {NEW_AGENT_REASONING_LEVELS.map(level => (
        <div key={level.label}>
          <p
            style={{
              margin: "0 0 4px",
              fontFamily: F.bold,
              fontSize: 11,
              fontWeight: 700,
              color: C.offBlack,
              letterSpacing: "0.03em",
            }}
          >
            {level.label}
          </p>
          <p style={{ margin: 0, fontFamily: F.regular, fontSize: 11, color: C.gray01, lineHeight: 1.5 }}>
            {level.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Drop in video URLs when ready — modal shows placeholder until set. */
const HOW_AGENT_VIDEOS: Record<HowExploreAgentId, { buttonLabel: string; title: string; src?: string }> = {
  researcher: {
    buttonLabel: "See Researcher agent video",
    title: "Researcher agent in action",
  },
  analyst: {
    buttonLabel: "See Analyst agent video",
    title: "Analyst agent in action",
  },
  "new-agent": {
    buttonLabel: "See New agent video",
    title: "Build a custom agent",
  },
};

const howVideoBtnStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 18px",
  borderRadius: 3,
  border: "none",
  background: C.yellow,
  color: C.confidentBlack,
  fontFamily: F.bold,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: "0.03em",
};

function AgentHowVideoModal({
  agentId,
  onClose,
}: {
  agentId: HowExploreAgentId;
  onClose: () => void;
}) {
  const video = HOW_AGENT_VIDEOS[agentId];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-how-video-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: `color-mix(in srgb, ${C.confidentBlack} 55%, transparent)`,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(880px, 100%)",
          background: C.white,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: `0 24px 48px color-mix(in srgb, ${C.confidentBlack} 22%, transparent)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "16px 20px",
            borderBottom: `1px solid ${C.gray02}`,
          }}
        >
          <p id="agent-how-video-title" style={{ margin: 0, fontFamily: F.bold, fontSize: 16, fontWeight: 700, color: C.offBlack }}>
            {video.title}
          </p>
          <button
            type="button"
            aria-label="Close video"
            onClick={onClose}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, display: "flex" }}
          >
            <X size={18} strokeWidth={1.75} color={C.gray01} aria-hidden />
          </button>
        </div>
        <div style={{ position: "relative", paddingBottom: "56.25%", background: C.offWhite }}>
          {video.src ? (
            <video
              src={video.src}
              controls
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: C.confidentBlack }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: 24,
              }}
            >
              <Play size={40} strokeWidth={1.5} color={C.gray01} aria-hidden />
              <p style={{ margin: 0, fontFamily: F.regular, fontSize: 14, color: C.gray01, textAlign: "center" }}>
                Video coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type WhatOnboardingStep =
  | { phase: "plain"; subtitle: string; view: "chat-home" | "builder-landing" }
  | {
      phase: "spotlight";
      subtitle: string;
      agentId: "researcher" | "analyst";
      callout: Omit<Callout, "workflowStep">;
    }
  | {
      phase: "builder";
      subtitle: string;
      callout: Omit<Callout, "workflowStep">;
    };

const HOW_ONBOARDING_STEPS: WhatOnboardingStep[] = [
  {
    phase: "plain",
    subtitle: "Agents live in the Copilot Chat sidebar — browse what's available before you open one.",
    view: "chat-home",
  },
  {
    phase: "spotlight",
    subtitle: "Select the Researcher agent in the sidebar.",
    agentId: "researcher",
    callout: {
      title: "Researcher agent",
      body: "Start with Researcher in the sidebar — built for multi-step research with cited sources on Indian tax workflows.",
      icon: Search,
      target: "researcher",
      placement: "right",
    },
  },
  {
    phase: "spotlight",
    subtitle: "Select the Analyst agent in the sidebar.",
    agentId: "analyst",
    callout: {
      title: "Analyst agent",
      body: "Analyst navigates bulky tax data — GST filings, provision shifts, and APA computations — and surfaces patterns fast.",
      icon: BarChart3,
      target: "analyst",
      placement: "right",
    },
  },
  {
    phase: "spotlight",
    subtitle: "Choose New agent when you need a custom specialist for your team's workflows.",
    agentId: "new-agent",
    callout: {
      title: "New agent",
      body: "Open New agent in the sidebar — Agent Builder shows template ideas on the right with a personalised agents intro in the centre.",
      icon: Bot,
      target: "new-agent",
      placement: "right",
    },
  },
  {
    phase: "builder",
    subtitle: "Skip the onboarding chat and jump to Configure.",
    callout: {
      title: "Skip the chat",
      body: "Agent Builder opens with a short chat. Press Skip to jump straight to the configure screen — name, instructions, and knowledge sources.",
      icon: ChevronRight,
      target: "agent-skip",
      placement: "left",
      anchorY: 0.35,
    },
  },
  {
    phase: "builder",
    subtitle: "Name your agent and write its instructions.",
    callout: {
      title: "Describe your agent",
      body: "Name the agent, then write instructions — what it should do, the tone to use, and guardrails for Indian tax workflows.",
      icon: PenLine,
      target: "agent-instructions",
      placement: "left",
    },
  },
  {
    phase: "builder",
    subtitle: "Ground answers in approved knowledge sources.",
    callout: {
      title: "Knowledge sources",
      body: "Add approved files, SharePoint, meetings, email, and websites so answers stay grounded in your source of truth.",
      icon: BookOpen,
      target: "knowledge-sources",
      placement: "left",
    },
  },
];

function howTourStepIndexForAgent(id: HowExploreAgentId): number {
  return HOW_ONBOARDING_STEPS.findIndex(step => step.phase === "spotlight" && step.agentId === id);
}

/** What tab — agent types, then Agent Builder configure beats. */
export function M365AgentHowExplorer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [frameEl, setFrameEl] = useState<HTMLDivElement | null>(null);
  const [videoAgentId, setVideoAgentId] = useState<HowExploreAgentId | null>(null);
  const tourRef = useRef<HTMLDivElement>(null);
  const frameRefCb = useCallback((el: HTMLDivElement | null) => setFrameEl(el), []);

  const step = HOW_ONBOARDING_STEPS[stepIndex];
  const totalSteps = HOW_ONBOARDING_STEPS.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const goNext = useCallback(() => {
    setStepIndex(i => Math.min(i + 1, totalSteps - 1));
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setStepIndex(i => Math.max(i - 1, 0));
  }, []);

  const goToAgent = useCallback((id: HowExploreAgentId) => {
    const nextIndex = howTourStepIndexForAgent(id);
    if (nextIndex < 0) return;
    setStepIndex(nextIndex);
    setFrameEl(null);
  }, []);

  const restart = useCallback(() => {
    setStepIndex(0);
    setFrameEl(null);
    tourRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!tourRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === "ArrowRight" || e.key === "Enter") { e.preventDefault(); if (!isLast) goNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); if (!isFirst) goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, isFirst, isLast]);

  return (
    <div
      ref={tourRef}
      tabIndex={0}
      role="region"
      aria-label="Agent types and builder onboarding"
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16, outline: "none" }}
    >
      <style>{`
        @keyframes ey-tour-ring-pulse {
          0%, 100% {
            box-shadow: 4px 4px 0 0 color-mix(in srgb, ${C.confidentBlack} 88%, transparent),
              0 0 0 0 color-mix(in srgb, ${C.yellow} 50%, transparent);
          }
          50% {
            box-shadow: 4px 4px 0 0 color-mix(in srgb, ${C.confidentBlack} 88%, transparent),
              0 0 0 10px color-mix(in srgb, ${C.yellow} 0%, transparent);
          }
        }
        @keyframes ey-tour-ring-pulse-next {
          0%, 100% {
            opacity: 0.55;
            box-shadow: 0 0 0 0 color-mix(in srgb, ${C.yellow} 35%, transparent);
          }
          50% {
            opacity: 0.95;
            box-shadow: 0 0 0 8px color-mix(in srgb, ${C.yellow} 0%, transparent);
          }
        }
        .ey-tour-ring-pulse {
          animation: ey-tour-ring-pulse 1.5s ease-in-out infinite;
        }
        .ey-tour-ring-pulse-next {
          animation: ey-tour-ring-pulse-next 2.2s ease-in-out infinite;
          animation-delay: 0.4s;
        }
      `}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          {HOW_ONBOARDING_STEPS.map((s, i) => (
            <span
              key={`what-step-${i}`}
              aria-hidden
              style={{
                width: i === stepIndex ? 28 : 8,
                height: 8,
                borderRadius: 999,
                background: i === stepIndex ? C.yellow : i < stepIndex ? C.offBlack : C.gray02,
                transition: "width 200ms ease, background 200ms ease",
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 16,
          border: `1px solid ${C.gray02}`,
          background: C.white,
          boxShadow: `0 16px 40px color-mix(in srgb, ${C.confidentBlack} 10%, transparent)`,
          overflow: "hidden",
        }}
      >
        {step.phase === "plain" && step.view === "chat-home" && (
          <ChatMainCanvas key={`plain-chat-${stepIndex}`} frameRef={frameRefCb} onExploreAgentSelect={goToAgent} />
        )}
        {step.phase === "spotlight" && (() => {
          const profile = HOW_AGENT_PROFILES[step.agentId];
          const videoMeta = HOW_AGENT_VIDEOS[step.agentId];
          const isNewAgent = step.agentId === "new-agent";
          return (
            <ChatTourCanvas
              key={`spotlight-${step.agentId}-${stepIndex}`}
              frameRef={frameRefCb}
              exploreAgentId={step.agentId}
              onExploreAgentSelect={goToAgent}
              agentName={isNewAgent ? profile.name : `${profile.name} Agent`}
              agentDescribeNode={
                isNewAgent ? (
                  <NewAgentExploreSubtitle />
                ) : (
                  <AgentExploreSubtitle agentLabel={profile.name} tagline={profile.exploreTagline} />
                )
              }
              instructionsContent={<AgentInstructionBulletCards items={profile.pointers} compact />}
              exploreVideoLabel={videoMeta.buttonLabel}
              onExploreVideo={() => setVideoAgentId(step.agentId)}
            />
          );
        })()}
        {step.phase === "builder" && step.callout.target === "agent-skip" && (
          <AgentBuilderLandingCanvas key={`builder-skip-${stepIndex}`} frameRef={frameRefCb} onSkip={goNext} />
        )}
        {step.phase === "builder" && step.callout.target !== "agent-skip" && (
          <ChatTourCanvas
            key={`builder-configure-${stepIndex}-${step.callout.target}`}
            frameRef={frameRefCb}
            knowledgeExpanded={step.callout.target === "knowledge-sources"}
          />
        )}
        <TourDualRingOverlay
          frame={frameEl}
          currentTarget={whatTourCurrentTarget(step)}
          nextTarget={whatTourNextTarget(stepIndex)}
          currentLabel={whatTourCurrentLabel(step)}
          onCurrentClick={isLast ? restart : goNext}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "4px 0 0" }}>
        <button type="button" onClick={goPrev} disabled={isFirst} aria-label="Previous step" style={navBtnStyle(isFirst)}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden /> Previous
        </button>
        {isLast ? (
          <button type="button" onClick={restart} aria-label="Restart onboarding" style={primaryBtnStyle}>
            Restart tour
          </button>
        ) : (
          <button type="button" onClick={goNext} aria-label="Next step" style={primaryBtnStyle}>
            Continue <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
          </button>
        )}
      </div>

      {videoAgentId && <AgentHowVideoModal agentId={videoAgentId} onClose={() => setVideoAgentId(null)} />}
    </div>
  );
}
