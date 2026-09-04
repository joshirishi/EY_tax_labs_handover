/** Canonical M365 agent icons — Figma 4448:8525 (Researcher / Analyst), 4455:8530 (New agent). */
import type { CSSProperties } from "react";

export const AGENT_HEX_SRC = "/reference-images/m365-chat-tour/agent-hex.png";
export const AGENT_RESEARCHER_SRC = "/reference-images/m365-chat-tour/agent-researcher.png";
export const AGENT_ANALYST_SRC = "/reference-images/m365-chat-tour/agent-analyst.png";
export const AGENT_NEW_BASE_SRC = "/reference-images/m365-chat-tour/agent-new-base.png";
export const AGENT_NEW_BADGE_SRC = "/reference-images/m365-chat-tour/agent-new-badge.svg";

export type AgentIconKind = "generic" | "researcher" | "analyst" | "new-agent";

const AGENT_ICON_SRC: Record<Exclude<AgentIconKind, "new-agent">, string> = {
  generic: AGENT_HEX_SRC,
  researcher: AGENT_RESEARCHER_SRC,
  analyst: AGENT_ANALYST_SRC,
};

export function agentIconKind(id?: string | null): AgentIconKind {
  if (id === "researcher") return "researcher";
  if (id === "analyst") return "analyst";
  if (id === "new-agent") return "new-agent";
  return "generic";
}

const agentImgStyle = (size: number): CSSProperties => ({
  width: size,
  height: size,
  objectFit: "contain",
  display: "block",
  flexShrink: 0,
});

function NewAgentIcon({ size }: { size: number }) {
  const badgeSize = Math.max(7, Math.round(size * 0.44));
  return (
    <span
      aria-hidden
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-block",
        flexShrink: 0,
      }}
    >
      <img src={AGENT_NEW_BASE_SRC} alt="" width={size} height={size} draggable={false} style={agentImgStyle(size)} />
      <img
        src={AGENT_NEW_BADGE_SRC}
        alt=""
        width={badgeSize}
        height={badgeSize}
        draggable={false}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: badgeSize,
          height: badgeSize,
          display: "block",
        }}
      />
    </span>
  );
}

export function AgentIcon({ kind = "generic", size = 16 }: { kind?: AgentIconKind; size?: number }) {
  if (kind === "new-agent") return <NewAgentIcon size={size} />;

  return (
    <img
      src={AGENT_ICON_SRC[kind]}
      alt=""
      width={size}
      height={size}
      draggable={false}
      style={agentImgStyle(size)}
    />
  );
}

/** Generic M365 agent hex — Agent Builder, custom agents (not New agent sidebar row). */
export function AgentHexIcon({ size = 16 }: { size?: number }) {
  return <AgentIcon kind="generic" size={size} />;
}

/** Copilot / Agent Builder brand mark — same hex asset as custom agents. */
export function CopilotHex({ size }: { size: number }) {
  return <AgentHexIcon size={size} />;
}
