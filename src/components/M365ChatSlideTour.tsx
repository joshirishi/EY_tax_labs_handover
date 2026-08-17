import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
  Clock,
  ExternalLink,
  FileText,
  Grid3x3,
  Info,
  MessagesSquare,
  Mic,
  MoreHorizontal,
  PenLine,
  Pencil,
  Pin,
  Plus,
  Rocket,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { colors, fonts as F, spacing, spectrumCss, typeScale } from "../design-kit/tokens";

const C = {
  ...colors,
  dark2: colors.offBlack,
};

/** Hairline matching Figma 4035:4539, mixed from kit greys — no invented hex. */
const line = `color-mix(in srgb, ${C.gray02} 50%, ${C.white})`;
const FIGMA_W = 953;
const FIGMA_H = 530;
const COPILOT_HEX = "/reference-images/m365-chat-tour/copilot-hex.png";

type Placement = "left" | "right" | "top" | "bottom";

type CalloutRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Callout = {
  title: string;
  body: string;
  icon: LucideIcon;
  /** Yellow highlight box — % of the Figma 953×530 canvas */
  rect: CalloutRect;
  /** Where the pointer meets the card (percent of the canvas) */
  anchorLeft: number;
  anchorTop: number;
  /** Which way the card opens from the anchor */
  placement: Placement;
};

/** Canvas px → % rect, with pad so the 2px stroke sits just outside the control. */
function wrap(x: number, y: number, w: number, h: number, pad = 3): CalloutRect {
  const pct = (n: number, total: number) => Math.round((n / total) * 10000) / 100;
  return {
    left: pct(x - pad, FIGMA_W),
    top: pct(y - pad, FIGMA_H),
    width: pct(w + pad * 2, FIGMA_W),
    height: pct(h + pad * 2, FIGMA_H),
  };
}

/** Midpoint of the box edge that faces the annotation card. */
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

type Slide = {
  label: string;
  callouts: Callout[];
};

/**
 * Callout boxes wrap controls on Figma 4035:4539 (953×530) — Copilot Chat
 * with Agent Builder open. Px come from ChatTourCanvas layout, then wrap().
 *
 * Sidebar: pad 24/16, nav rows 32px (8+16+8), gap 4. Agents heading ~13px.
 * Centre / right: remaining 759 split flex 1 (379.5 each). Input ~48px tall.
 */
const CHAT_TOUR_SLIDES: Slide[] = [
  {
    label: "Chat essentials",
    callouts: [
      {
        title: "Start a new chat",
        body: "Opens a fresh conversation with Copilot — start from a clean thread whenever you need a new tax question or research task.",
        icon: MessagesSquare,
        rect: wrap(16, 76, 162, 32),
        anchorLeft: 24,
        anchorTop: 18,
        placement: "right",
      },
      {
        title: "Search across work",
        body: "Finds information quickly across files, emails, meetings and people — like an AI-powered search engine when you know what you're looking for.",
        icon: Search,
        rect: wrap(16, 112, 162, 32),
        anchorLeft: 24,
        anchorTop: 26,
        placement: "right",
      },
      {
        title: "Pages hub",
        body: "Your central hub for all Copilot-generated content — Pages, images, infographics and items shared with you. Open it from Library in the sidebar.",
        icon: FileText,
        rect: wrap(16, 148, 162, 32),
        anchorLeft: 24,
        anchorTop: 36,
        placement: "right",
      },
      {
        title: "Researcher",
        body: "Performs deep, multi-step research across your work data and the web to deliver a structured, source-cited report.",
        icon: Search,
        rect: wrap(16, 221, 162, 32),
        anchorLeft: 24,
        anchorTop: 45,
        placement: "right",
      },
      {
        title: "Analyst",
        body: "Analyzes data, identifies patterns and turns raw information into insights, forecasts and visualisations — from spreadsheet to answer in minutes.",
        icon: BarChart3,
        rect: wrap(16, 257, 162, 32),
        anchorLeft: 24,
        anchorTop: 58,
        placement: "right",
      },
    ],
  },
  {
    label: "Advanced features",
    callouts: [
      {
        title: "Previous chats",
        body: "All your previous chats are displayed here — pick up where you left off on any tax matter or research thread.",
        icon: MessagesSquare,
        rect: wrap(16, 483, 162, 23),
        anchorLeft: 24,
        anchorTop: 78,
        placement: "right",
      },
      {
        title: "Create an agent",
        body: "Build your own AI expert for a specific business need — the difference between generic AI and AI that knows your work.",
        icon: Sparkles,
        rect: wrap(16, 365, 162, 38),
        anchorLeft: 24,
        anchorTop: 68,
        placement: "right",
      },
      {
        title: "Work vs generic AI",
        body: "Work IQ grounds Copilot in your Microsoft 365 data — the difference between generic AI and AI that knows your work context.",
        icon: Sparkles,
        rect: wrap(485.5, 24, 24, 24),
        anchorLeft: 40,
        anchorTop: 18,
        placement: "bottom",
      },
      {
        title: "Auto LLM selection",
        body: "Automatically selects the most suitable LLM and reasoning level for your task — no manual model switching required.",
        icon: Sparkles,
        rect: wrap(881, 86, 48, 22),
        anchorLeft: 78,
        anchorTop: 28,
        placement: "left",
      },
      {
        title: "New design toggle",
        body: "New design with the same capabilities — switch between classic and refreshed Copilot Chat layouts.",
        icon: Sparkles,
        rect: wrap(736, 24, 100, 28),
        anchorLeft: 66,
        anchorTop: 16,
        placement: "left",
      },
      {
        title: "Apps & agents gateway",
        body: "Your gateway to apps, agents and tools that help Copilot get work done — launch specialised workflows from the plus menu.",
        icon: Rocket,
        rect: wrap(245, 320, 18, 18, 6),
        anchorLeft: 28,
        anchorTop: 42,
        placement: "top",
      },
      {
        title: "Create content",
        body: "Turns ideas into professional content such as images, videos, surveys, pages and other branded assets using AI.",
        icon: Rocket,
        rect: wrap(617.5, 207, 115, 20),
        anchorLeft: 48,
        anchorTop: 40,
        placement: "left",
      },
      {
        title: "Prompt with context",
        body: "Prompts with a clear goal, context and references generate the best results. Be specific about what you need.",
        icon: Pin,
        rect: wrap(226, 305, 315.5, 48),
        anchorLeft: 40,
        anchorTop: 78,
        placement: "bottom",
      },
      {
        title: "Attach work content",
        body: "Add specific work content like files, meetings, emails and more for a focused response grounded in your data.",
        icon: Pin,
        rect: wrap(245, 320, 18, 18, 6),
        anchorLeft: 22,
        anchorTop: 78,
        placement: "bottom",
      },
      {
        title: "Voice chat",
        body: "Start dictating with voice chat — speak your prompt instead of typing for hands-free Copilot interaction.",
        icon: Mic,
        rect: wrap(504.5, 320, 18, 18, 6),
        anchorLeft: 70,
        anchorTop: 48,
        placement: "left",
      },
      {
        title: "Temporary chat",
        body: "Start a temporary chat when you don't want the thread saved — useful for sensitive or one-off queries. Look for it in the top-right chat actions.",
        icon: Clock,
        rect: wrap(521.5, 26, 20, 20, 6),
        anchorLeft: 42,
        anchorTop: 16,
        placement: "bottom",
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

function NavRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, width: "100%" }}>
      <span style={{ width: 16, height: 16, display: "flex", flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          fontFamily: F.regular,
          fontSize: 10,
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

function AgentDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

function CopilotHex({ size }: { size: number }) {
  return (
    <img
      src={COPILOT_HEX}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", display: "block", flexShrink: 0 }}
    />
  );
}

const CHAT_SIDEBAR_W = 194;
const QUICK_PILLS = ["File Insights", "Inbox Triage", "People Search", "Meeting Prep"] as const;

/** Shared left sidebar — matches PPTX slide 1 essentials and Figma 4035:4539. */
function ChatSidebar({ icon }: { icon: { size: number; strokeWidth: number; color: string } }) {
  return (
    <div
      style={{
        width: CHAT_SIDEBAR_W,
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: "24px 16px",
        borderRight: `1px solid ${line}`,
        background: C.offWhite,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: C.gray02,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bot size={16} strokeWidth={1.75} color={C.dark2} />
        </span>
        <span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Grid3x3 size={18} strokeWidth={1.75} color={C.dark2} />
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
        <NavRow icon={<PenLine {...icon} />} label="New chat" />
        <NavRow icon={<Search {...icon} />} label="Search" />
        <NavRow icon={<BookOpen {...icon} />} label="Library" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
        <p
          style={{
            fontFamily: F.bold,
            fontSize: 11,
            fontWeight: 700,
            color: C.gray01,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Agents
        </p>
        <NavRow icon={<AgentDot color={C.frameGreen} />} label="Researcher" />
        <NavRow icon={<AgentDot color={C.framePurple} />} label="Analyst" />
        <NavRow icon={<AgentDot color={C.frameBlue} />} label="Labour Code Analyst" />
        <NavRow icon={<AgentDot color={C.frameMagenta} />} label="Tax AI Assessment Evaluator" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 8,
            width: "100%",
            background: `color-mix(in srgb, ${C.gray02} 28%, ${C.offWhite})`,
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              overflow: "hidden",
              flexShrink: 0,
              borderRadius: 2,
              background: spectrumCss(4, "135deg"),
            }}
          />
          <span style={{ fontFamily: F.bold, fontSize: 10, fontWeight: 700, color: C.dark2, whiteSpace: "nowrap" }}>
            New agent
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, width: "100%" }}>
          <ChevronsRight size={14} strokeWidth={1.75} color={C.gray01} />
          <span style={{ fontFamily: F.regular, fontSize: 14, color: C.gray01, whiteSpace: "nowrap" }}>
            More agents
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 12, width: "100%" }}>
        <p
          style={{
            fontFamily: F.bold,
            fontSize: 11,
            fontWeight: 700,
            color: C.gray01,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Chats
        </p>
        {["Creative AI Readiness Exercises…", "AI for Tax Excellence Trailer…", "Meeting Highlights Extraction"].map(title => (
          <span
            key={title}
            style={{
              fontFamily: F.regular,
              fontSize: 10,
              color: C.gray01,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: "4px 8px",
            }}
          >
            {title}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Slide 1 canvas — main Copilot Chat home (reference image1.png / PPTX essentials).
 * Sidebar callouts from slide 1 align to this layout.
 */
function ChatMainCanvas() {
  const { ref, scale } = useScaleToWidth(FIGMA_W);
  const icon = { size: 16, strokeWidth: 1.75, color: C.dark2 } as const;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Microsoft 365 Copilot Chat home"
      style={{
        width: "100%",
        aspectRatio: `${FIGMA_W} / ${FIGMA_H}`,
        position: "relative",
        overflow: "hidden",
        background: C.white,
      }}
    >
      <div
        aria-hidden
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
        <ChatSidebar icon={icon} />

        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "20px 48px 36px",
            background: C.white,
          }}
        >
          {/* Top bar — Work IQ, Auto, New design, governance shield */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: `1px solid ${C.gray02}`,
                  fontFamily: F.bold,
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.dark2,
                }}
              >
                <Sparkles size={14} strokeWidth={1.75} color={C.framePurple} aria-hidden />
                Work IQ
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 10px",
                  borderRadius: 999,
                  border: `1px solid ${C.gray02}`,
                }}
              >
                <span style={{ fontFamily: F.regular, fontSize: 12, color: C.dark2 }}>Auto</span>
                <ChevronDown size={12} strokeWidth={1.75} color={C.dark2} />
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>New design</span>
              <span
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 999,
                  background: C.frameGreen,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    right: 2,
                    top: 2,
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    background: C.white,
                  }}
                />
              </span>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: `color-mix(in srgb, ${C.success} 18%, ${C.white})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={16} strokeWidth={1.75} color={C.success} />
              </span>
              <MoreHorizontal size={20} strokeWidth={1.75} color={C.dark2} />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: F.bold,
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.25,
                color: C.dark2,
                textAlign: "center",
                margin: 0,
              }}
            >
              Hi, what can I help you with?
            </p>
            <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: 30,
                  border: `1px solid ${C.gray02}`,
                  background: C.white,
                  boxShadow: `0 4px 16px color-mix(in srgb, ${C.confidentBlack} 6%, transparent)`,
                }}
              >
                <Plus size={18} strokeWidth={1.75} color={C.dark2} />
                <span style={{ flex: 1, fontFamily: F.regular, fontSize: 15, color: C.gray01 }}>
                  Message Copilot
                </span>
                <Mic size={18} strokeWidth={1.75} color={C.dark2} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {QUICK_PILLS.map(label => (
                  <span
                    key={label}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      border: `1px solid ${C.gray02}`,
                      background: C.offWhite,
                      fontFamily: F.regular,
                      fontSize: 12,
                      color: C.dark2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </span>
                ))}
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    border: `1px solid ${C.gray02}`,
                    background: C.offWhite,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MoreHorizontal size={14} strokeWidth={1.75} color={C.gray01} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, filled }: { children: ReactNode; filled?: boolean }) {
  return (
    <span
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: filled ? `color-mix(in srgb, ${C.gray02} 22%, ${C.white})` : C.white,
        border: filled ? "none" : `1px solid ${line}`,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Designed Copilot Chat chrome from Figma 4035:4539, drawn at 953×530 then
 * scaled to the tour width so callout % stay locked to the artboard.
 */
function ChatTourCanvas() {
  const { ref, scale } = useScaleToWidth(FIGMA_W);
  const icon = { size: 16, strokeWidth: 1.75, color: C.dark2 } as const;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Microsoft 365 Copilot Chat with Agent Builder"
      style={{
        width: "100%",
        aspectRatio: `${FIGMA_W} / ${FIGMA_H}`,
        position: "relative",
        overflow: "hidden",
        background: C.white,
      }}
    >
      <div
        aria-hidden
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
        <ChatSidebar icon={icon} />

        {/* Centre chat */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "24px 32px 40px",
            background: C.white,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: `color-mix(in srgb, ${C.success} 18%, ${C.white})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={16} strokeWidth={1.75} color={C.success} />
              </span>
              <MoreHorizontal size={20} strokeWidth={1.75} color={C.dark2} />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: F.bold,
                fontSize: 24,
                fontWeight: 700,
                lineHeight: "44px",
                color: C.dark2,
                textAlign: "center",
                margin: 0,
                width: "100%",
              }}
            >
              Build your own specialist agent
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "14px 18px",
                borderRadius: 30,
                border: `1px solid ${C.gray02}`,
                background: C.white,
              }}
            >
              <Plus size={18} strokeWidth={1.75} color={C.dark2} />
              <span style={{ flex: 1, fontFamily: F.regular, fontSize: 15, color: C.gray01 }}>
                Message Agent Build
              </span>
              <Mic size={18} strokeWidth={1.75} color={C.dark2} />
            </div>
          </div>
        </div>

        {/* Right Agent Builder panel */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            padding: 24,
            borderLeft: `1px solid ${line}`,
            background: C.white,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 8px 4px 4px",
                  borderRadius: 999,
                  background: `color-mix(in srgb, ${C.framePurple} 7%, ${C.white})`,
                  border: `1px solid color-mix(in srgb, ${C.framePurple} 16%, ${C.white})`,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 18,
                    borderRadius: 21,
                    background: C.white,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CopilotHex size={18} />
                </span>
                <span
                  style={{
                    fontFamily: F.bold,
                    fontSize: 12,
                    fontWeight: 700,
                    color: `color-mix(in srgb, ${C.framePurple} 45%, ${C.confidentBlack})`,
                    whiteSpace: "nowrap",
                  }}
                >
                  Agent Builder
                </span>
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 10px",
                  borderRadius: 999,
                  border: `1px solid ${C.gray02}`,
                  flexShrink: 0,
                }}
              >
                <span style={{ fontFamily: F.regular, fontSize: 12, color: C.dark2, whiteSpace: "nowrap" }}>
                  Configure
                </span>
                <ChevronDown size={12} strokeWidth={1.75} color={C.dark2} />
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <IconBtn filled>
                <Plus size={14} strokeWidth={1.75} color={C.dark2} />
              </IconBtn>
              <IconBtn>
                <MoreHorizontal size={14} strokeWidth={1.75} color={C.dark2} />
              </IconBtn>
              <IconBtn>
                <X size={14} strokeWidth={1.75} color={C.dark2} />
              </IconBtn>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  width: 34,
                  height: 31,
                  borderRadius: 21,
                  background: C.white,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CopilotHex size={34} />
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: F.bold, fontSize: 20, fontWeight: 700, color: C.dark2, whiteSpace: "nowrap" }}>
                  New Agent
                </span>
                <Pencil size={16} strokeWidth={1.75} color={C.gray01} />
              </div>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <span style={{ fontFamily: F.regular, fontSize: 13, color: C.gray01 }}>Auto</span>
              <ChevronDown size={12} strokeWidth={1.75} color={C.gray01} />
            </span>
          </div>

          <p style={{ fontFamily: F.regular, fontSize: 14, color: C.gray01, margin: 0 }}>Describe your agent</p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: 20,
              borderRadius: 16,
              border: `1px solid ${line}`,
              background: C.white,
              width: "100%",
              minHeight: 0,
              flex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: F.bold, fontSize: 14, fontWeight: 700, color: C.dark2 }}>Instructions</span>
                <Info size={14} strokeWidth={1.75} color={C.gray01} />
              </div>
              <ExternalLink size={14} strokeWidth={1.75} color={C.gray01} />
            </div>
            <div
              style={{
                flex: 1,
                minHeight: 120,
                padding: 16,
                borderRadius: 8,
                border: `1px solid ${line}`,
              }}
            >
              <p style={{ fontFamily: F.regular, fontSize: 14, lineHeight: "20px", color: C.gray01, margin: 0 }}>
                Describe what this agent should do, define its tone, and outline any rules or guidelines it must follow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalloutBox({
  callout,
  active,
  stepNum,
}: {
  callout: Callout;
  active: boolean;
  stepNum: number;
}) {
  const Icon = callout.icon;
  const edge = boxEdgePoint(callout.rect, callout.anchorLeft, callout.anchorTop);

  return (
    <div
      role="note"
      aria-hidden={!active}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: active ? 20 : 5,
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none",
        transition: "opacity 0.25s ease",
      }}
    >
      {/* Pointer from the highlight box edge to the annotation card */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
      >
        <line
          x1={edge.x}
          y1={edge.y}
          x2={callout.anchorLeft}
          y2={callout.anchorTop}
          stroke={C.dark2}
          strokeWidth={4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={0.55}
        />
        <line
          x1={edge.x}
          y1={edge.y}
          x2={callout.anchorLeft}
          y2={callout.anchorTop}
          stroke={C.yellow}
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Bounding box around the UI control */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: `${callout.rect.left}%`,
          top: `${callout.rect.top}%`,
          width: `${callout.rect.width}%`,
          height: `${callout.rect.height}%`,
          boxSizing: "border-box",
          border: `2px solid ${C.yellow}`,
          borderRadius: 4,
          background: C.yellowAlpha10,
          boxShadow: `0 0 0 1px color-mix(in srgb, ${C.dark2} 55%, transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Annotation card — opens from the anchor, not from the target */}
      <div
        style={{
          position: "absolute",
          left: `${callout.anchorLeft}%`,
          top: `${callout.anchorTop}%`,
          width: "min(280px, 42vw)",
          background: C.white,
          border: `1.5px solid ${C.yellow}`,
          borderRadius: 12,
          padding: "14px 16px",
          boxShadow: `0 12px 32px color-mix(in srgb, ${C.confidentBlack} 18%, transparent)`,
          zIndex: 3,
          ...cardTransform(callout.placement),
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
              fontWeight: 700,
            }}
          >
            {stepNum}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Icon size={15} strokeWidth={1.75} color={C.dark2} aria-hidden />
              <p
                style={{
                  fontFamily: F.bold,
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.dark2,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {callout.title}
              </p>
            </div>
            <p
              style={{
                fontFamily: F.regular,
                fontSize: 13,
                color: C.gray01,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {callout.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
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

export function M365ChatSlideTour() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [calloutIndex, setCalloutIndex] = useState(0);
  const tourRef = useRef<HTMLDivElement>(null);

  const slide = CHAT_TOUR_SLIDES[slideIndex];
  const totalSlides = CHAT_TOUR_SLIDES.length;
  const totalCallouts = slide.callouts.length;
  const isFirstCallout = calloutIndex === 0;
  const isLastCallout = calloutIndex === totalCallouts - 1;
  const isFirstSlide = slideIndex === 0;
  const isLastSlide = slideIndex === totalSlides - 1;
  const tourComplete = isLastSlide && isLastCallout;

  const goNext = useCallback(() => {
    if (!isLastCallout) {
      setCalloutIndex((i) => i + 1);
      return;
    }
    if (!isLastSlide) {
      setSlideIndex((s) => s + 1);
      setCalloutIndex(0);
    }
  }, [isLastCallout, isLastSlide]);

  const goPrev = useCallback(() => {
    if (!isFirstCallout) {
      setCalloutIndex((i) => i - 1);
      return;
    }
    if (!isFirstSlide) {
      const prevSlide = slideIndex - 1;
      setSlideIndex(prevSlide);
      setCalloutIndex(CHAT_TOUR_SLIDES[prevSlide].callouts.length - 1);
    }
  }, [isFirstCallout, isFirstSlide, slideIndex]);

  const restart = useCallback(() => {
    setSlideIndex(0);
    setCalloutIndex(0);
    tourRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!tourRef.current?.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (!tourComplete) goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!isFirstSlide || !isFirstCallout) goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, tourComplete, isFirstSlide, isFirstCallout]);

  return (
    <div
      ref={tourRef}
      tabIndex={0}
      role="region"
      aria-label="M365 Copilot Chat feature walkthrough"
      aria-roledescription="carousel"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        outline: "none",
      }}
    >
      {/* Slide header — PPTX slide 1 / 2 labels + progress */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: F.bold,
              fontSize: typeScale.label.size,
              fontWeight: 700,
              letterSpacing: typeScale.label.tracking,
              textTransform: "uppercase",
              color: C.dark2,
            }}
          >
            {slide.label}
          </span>
          <span style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>
            Step {calloutIndex + 1} of {totalCallouts}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} aria-hidden>
          {CHAT_TOUR_SLIDES.map((s, i) => (
            <span
              key={s.label}
              style={{
                width: i === slideIndex ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: i === slideIndex ? C.yellow : C.gray02,
                transition: "width 0.2s ease",
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
          overflow: "hidden",
          border: `1px solid ${C.gray02}`,
          background: C.white,
          boxShadow: `0 16px 40px color-mix(in srgb, ${C.confidentBlack} 10%, transparent)`,
        }}
      >
        {slideIndex === 0 ? <ChatMainCanvas /> : <ChatTourCanvas />}

        {slide.callouts.map((c, i) => (
          <CalloutBox
            key={`${slideIndex}-${c.title}`}
            callout={c}
            active={i === calloutIndex}
            stepNum={i + 1}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "12px 0 0",
        }}
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirstSlide && isFirstCallout}
          aria-label="Previous step"
          style={navBtnStyle(isFirstSlide && isFirstCallout)}
        >
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
            aria-label={isLastCallout && !isLastSlide ? "Next slide" : "Next step"}
            style={primaryBtnStyle}
          >
            {isLastCallout && !isLastSlide ? "Next slide" : "Continue"}
            <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
          </button>
        )}

        <span
          style={{
            fontFamily: F.regular,
            fontSize: 12,
            color: C.gray01,
            flex: "1 1 100%",
            textAlign: "center",
          }}
        >
          Use arrow keys or Continue to reveal each feature
        </span>
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
