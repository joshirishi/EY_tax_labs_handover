import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Target, Zap } from "lucide-react";
import { colors as C, fonts as F } from "../design-kit/tokens";

type StackElement = {
  id: number;
  shortName: string;
  color: string;
  border: string;
  fragment: string;
};

const PROMPT_STACK: StackElement[] = [
  {
    id: 1,
    shortName: "Persona",
    color: C.frameMagenta,
    border: C.frameMagenta,
    fragment:
      "You are an Indian Tax Professional specializing in the Indian Income-tax Act and allied laws, with expertise in cross-border withholding tax and software royalty transactions.",
  },
  {
    id: 2,
    shortName: "Context",
    color: C.frameTeal,
    border: C.frameTeal,
    fragment:
      'ABC Software Solutions Pvt. Ltd. (Pune, India) pays software license fees to its US parent XYZ Inc. The company needs clarity on whether these payments constitute "royalty" under the Income-tax Act and the India-US DTAA.',
  },
  {
    id: 3,
    shortName: "Instruction",
    color: C.yellow,
    border: C.yellow,
    fragment:
      "1. Analyze the SC ruling in Engineering Analysis Centre of Excellence and categorize the EULAs.\n2. Analyze the attached Software License EULA clause by clause.\n3. Draft a client memo covering background, EULA analysis, documentation checklist, and withholding tax position.",
  },
  {
    id: 4,
    shortName: "Constraints",
    color: C.frameBlue,
    border: C.frameBlue,
    fragment:
      "Scope: Withholding tax implications only. Do not cover GST, corporate tax, or transfer pricing. Keep the memo under 3 pages.",
  },
  {
    id: 5,
    shortName: "Grounding",
    color: C.framePurple,
    border: C.framePurple,
    fragment:
      "Base your analysis strictly on the Income Tax Act 1961, Income Tax Rules 1962, the SC ruling in EACoE (2022), and applicable DTAA provisions. Do not cite tribunal decisions unless directly relevant.",
  },
  {
    id: 6,
    shortName: "Tone",
    color: C.yellow,
    border: C.yellow,
    fragment:
      "Draft in a formal, client-ready advisory style suitable for the Tax Head of a software company. Use professional language, avoid jargon where possible.",
  },
  {
    id: 7,
    shortName: "Output",
    color: C.frameGreen,
    border: C.frameGreen,
    fragment:
      "Present the EULA analysis as a table (Term | SC Interpretation). Provide clause analysis in a 3-column table (Clause | Description | SC Ruling). End with a numbered action checklist.",
  },
];

function buildStackedPrompt(stackedIds: number[]): string {
  return [...stackedIds]
    .sort((a, b) => a - b)
    .map((id) => PROMPT_STACK.find((e) => e.id === id)?.fragment)
    .filter(Boolean)
    .join(" ");
}

type PromptStrengthState = {
  pct: number;
  label: string;
  color: string;
  Icon?: LucideIcon;
};

function getPromptStrengthState(layers: number, total = 7): PromptStrengthState {
  const pct = Math.round((layers / total) * 100);
  if (layers === 0) return { pct, label: "Empty — add layers!", color: C.destructive };
  if (layers <= 2) return { pct, label: "Weak — keep adding!", color: C.destructive };
  if (layers <= 4) return { pct, label: "Getting better...", color: C.accentOrange };
  if (layers <= 6) return { pct, label: "Strong prompt!", color: C.offBlack, Icon: Zap };
  return { pct, label: "Client-ready!", color: C.success, Icon: Target };
}

function PromptStrengthIndicator({ layers, total = PROMPT_STACK.length }: { layers: number; total?: number }) {
  const { pct, label, color, Icon } = getPromptStrengthState(layers, total);

  return (
    <div
      className="pt-wizard-strength"
      role="progressbar"
      aria-valuenow={layers}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Prompt strength: ${label}. ${layers} of ${total} layers added.`}
      style={{
        marginTop: 10,
        flexShrink: 0,
        padding: "12px 16px",
        background: C.offWhite,
        border: `1px solid ${C.yellowAlpha12}`,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.gray01,
          fontFamily: F.bold,
          marginBottom: 6,
        }}
      >
        Prompt strength
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            background: "rgba(46,46,56,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: color,
              borderRadius: 3,
              transition: "width 200ms ease",
            }}
          />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: F.bold, whiteSpace: "nowrap" }}>
          {layers}/{total}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {Icon && <Icon size={14} strokeWidth={1.75} color={color} aria-hidden />}
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: F.bold }}>{label}</span>
      </div>
    </div>
  );
}

/** Compact click-to-add prompt stack for Panel 3 Prompt Anatomy tab. */
export function PromptStackBuilderCompact() {
  const [stackOrder, setStackOrder] = useState<number[]>([]);
  const focusRing = `2px solid ${C.yellow}`;
  const stackScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stackScrollRef.current) {
      stackScrollRef.current.scrollTop = stackScrollRef.current.scrollHeight;
    }
  }, [stackOrder.length]);

  const stackedSet = new Set(stackOrder);
  const sortedStacked = [...stackOrder]
    .sort((a, b) => a - b)
    .map((id) => PROMPT_STACK.find((e) => e.id === id))
    .filter(Boolean) as StackElement[];

  const toggleElement = (id: number) => {
    setStackOrder((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div
      style={{
        border: `1px solid rgba(46,46,56,0.10)`,
        borderRadius: 8,
        overflow: "hidden",
        background: C.offWhite,
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          background: C.confidentBlack,
          borderBottom: `1px solid ${C.borderOnDark}`,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: C.yellow,
            fontFamily: F.bold,
          }}
        >
          Use case
        </span>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.onDark,
            fontFamily: F.bold,
            lineHeight: 1.4,
            margin: "4px 0 0",
          }}
        >
          Analyzing withholding tax on software royalty payments to a US parent company
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(200px, 240px) 1fr",
          gap: 16,
          height: 480,
          minHeight: 480,
          padding: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <p style={{ fontSize: 12, color: C.gray01, fontFamily: F.regular, lineHeight: 1.5, marginBottom: 10, flexShrink: 0 }}>
            Click to add each layer:
          </p>
          <div
            role="group"
            aria-label="Prompt elements"
            style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", flex: 1, paddingRight: 4 }}
          >
            {PROMPT_STACK.map((el) => {
              const active = stackedSet.has(el.id);
              return (
                <button
                  key={el.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleElement(el.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 6,
                    cursor: "pointer",
                    textAlign: "left",
                    background: active ? "rgba(255,230,0,0.18)" : C.white,
                    border: active ? `1.5px solid ${C.yellow}` : `1px solid rgba(46,46,56,0.12)`,
                    flexShrink: 0,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = focusRing;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: active ? C.yellow : el.color + "22",
                      border: active ? "none" : `1.5px solid ${el.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.confidentBlack,
                      fontFamily: F.bold,
                    }}
                  >
                    {el.id}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: active ? C.offBlack : C.confidentBlack, fontFamily: F.bold }}>
                    {el.shortName}
                  </span>
                </button>
              );
            })}
          </div>
          <PromptStrengthIndicator layers={stackOrder.length} />
        </div>

        <div
          aria-label="Prompt element stack"
          ref={stackScrollRef}
          style={{
            minHeight: 0,
            overflowY: "auto",
            background: C.white,
            border: `1px solid rgba(46,46,56,0.08)`,
            borderRadius: 8,
            padding: "16px 20px",
          }}
        >
          {sortedStacked.length === 0 ? (
            <div style={{ height: "100%", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p
                style={{
                  fontSize: 13,
                  color: C.gray01,
                  fontFamily: F.regular,
                  margin: 0,
                  textAlign: "center",
                  maxWidth: 280,
                  lineHeight: 1.6,
                }}
              >
                Click the ingredients on the left to build your prompt layer by layer. Each layer adds a colored block.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sortedStacked.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "10px 12px",
                    background: C.offWhite,
                    borderRadius: 6,
                    border: `1px solid rgba(46,46,56,0.08)`,
                    borderLeft: `3px solid ${item.border}`,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      color: C.offBlack,
                      background: item.color + "18",
                      border: `1px solid ${item.border}40`,
                      borderRadius: 4,
                      padding: "2px 6px",
                      fontFamily: F.bold,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.shortName.toUpperCase()}
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: C.offBlack,
                      fontFamily: F.regular,
                      flex: 1,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.fragment}
                  </p>
                  <button
                    type="button"
                    aria-label={`Remove ${item.shortName}`}
                    onClick={() => toggleElement(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: C.gray01,
                      fontSize: 16,
                      lineHeight: 1,
                      padding: "0 2px",
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { buildStackedPrompt, PROMPT_STACK };
