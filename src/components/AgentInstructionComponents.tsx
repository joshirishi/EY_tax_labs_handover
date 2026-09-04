import { useState, type CSSProperties } from "react";
import {
  AgentBuilderInstructionPreview,
  type AgentInstructionPreviewFocus,
} from "./M365ChatSlideTour";
import { colors as C, fonts as F, spectrumCss, typeScale } from "../design-kit/tokens";

const AGENT_COMPONENTS: {
  n: string;
  label: string;
  question: string;
  focus: AgentInstructionPreviewFocus;
}[] = [
  { n: "01", label: "Purpose", question: "Background and Objective", focus: "purpose" },
  { n: "02", label: "Detail and Iterate", question: "What the Agent is expected to achieve", focus: "detail" },
  {
    n: "03",
    label: "Instructions",
    question: "Core responsibilities, WorkFlow, Output, Guardrails",
    focus: "instructions",
  },
  { n: "04", label: "Knowledge Sources", question: "Grounded source of truth", focus: "knowledge" },
];

const rowBorder = `1px solid color-mix(in srgb, ${C.confidentBlack} 7%, transparent)`;

const eyebrow = (color: string): CSSProperties => ({
  fontFamily: F.bold,
  fontSize: typeScale.label.size,
  fontWeight: typeScale.label.weight,
  letterSpacing: typeScale.label.tracking,
  textTransform: "uppercase",
  color,
  marginBottom: 8,
});

/** Instruction Components — slim navigator + live Agent Builder preview. */
export function AgentInstructionComponents() {
  const [activeEl, setActiveEl] = useState(0);
  const activeFocus = AGENT_COMPONENTS[activeEl]?.focus ?? "purpose";

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: F.bold,
            fontSize: typeScale.h2.size,
            fontWeight: typeScale.h2.weight,
            lineHeight: 1.2,
            letterSpacing: typeScale.h2.tracking,
            color: C.confidentBlack,
            margin: "0 0 12px",
          }}
        >
          How to build an agent
        </h2>
        <p style={{ fontFamily: F.light, fontSize: typeScale.body.size, color: C.gray01, margin: 0 }}>
          Design the assistant like a repeatable tax process — not a generic chatbot. Select a component to see where it lives in Agent Builder.
        </p>
      </div>

      <div
        className="agent-instruction-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 24%) 1fr",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background: C.offWhite,
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div style={{ height: 3, background: spectrumCss(2), flexShrink: 0 }} />
          <p style={{ ...eyebrow(C.eyebrowGoldDark), margin: "16px 16px 8px" }}>Components</p>
          <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
            {AGENT_COMPONENTS.map((item, i) => {
              const active = activeEl === i;
              return (
                <button
                  key={item.n}
                  type="button"
                  onClick={() => setActiveEl(i)}
                  onFocus={e => {
                    e.currentTarget.style.outline = `2px solid ${C.yellow}`;
                  }}
                  onBlur={e => {
                    e.currentTarget.style.outline = "none";
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 1fr",
                    gap: 10,
                    alignItems: "start",
                    width: "100%",
                    padding: "10px 6px",
                    background: active ? C.yellowAlpha10 : "transparent",
                    border: "none",
                    borderBottom: rowBorder,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 150ms ease",
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: active ? C.yellow : "transparent",
                      border: `1.5px solid ${active ? C.yellow : C.gray02}`,
                      fontFamily: F.bold,
                      fontSize: 10,
                      fontWeight: 700,
                      color: active ? C.confidentBlack : C.eyebrowGold,
                      marginTop: 1,
                    }}
                  >
                    {item.n}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                    <span style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 700, color: C.confidentBlack, lineHeight: 1.3 }}>
                      {item.label}
                    </span>
                    <span style={{ fontFamily: F.light, fontSize: 11, color: C.gray01, lineHeight: 1.4 }}>
                      {item.question}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
          <AgentBuilderInstructionPreview focus={activeFocus} />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .agent-instruction-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
