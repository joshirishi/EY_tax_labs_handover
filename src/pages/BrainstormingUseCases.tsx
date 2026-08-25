import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Lock, PlusCircle } from "lucide-react";
import { SiteHeader } from "../design-kit/SiteHeader";
import { ModuleHeader, SUBNAV_SCROLL_MARGIN, useModuleSectionHashScroll } from "../design-kit/LearningNav";
import { EYWhatsNext, EYWhatsNextHighlight } from "../design-kit/EYWhatsNext";
import { PHASE2_LABEL, PHASE2_NUMBER } from "../design-kit/curriculum";
import { colors, contentRailStyle, fonts, layout, spacing, spectrumCss, typeScale } from "../design-kit/tokens";
import heroImg from "../assets/images/GettyImages-2212662948.jpg";

/**
 * Section tabs for the Phase 2 sub-nav. Phase-overview pages have no curriculum
 * module to derive these from, so they are declared here and passed to
 * <ModuleHeader sections={…}>. Each `id` must match a section id in the page.
 * Labels follow each section's own eyebrow copy.
 */
const PHASE2_SECTIONS = [
  { id: "quick-recall", label: "Quick Recall", group: "learn" as const },
  { id: "memory-refresh", label: "Memory Refresh", group: "learn" as const },
  { id: "problem-first", label: "Problem First", group: "learn" as const },
  { id: "guided-examples", label: "Prompt Examples", group: "learn" as const },
  { id: "agent-examples", label: "Agent Examples", group: "learn" as const },
  { id: "use-case-map", label: "Activity Choice", group: "apply" as const },
  { id: "live-brainstorm", label: "Live Brainstorm", group: "apply" as const },
  { id: "deliverables", label: "Outputs", group: "apply" as const },
  { id: "next-steps", label: "What's Next", group: "apply" as const },
];

// ── Quick Recall data — verbatim from PDF slide 2 ────────────────────────────
const PROMPT_TASKS = [
  "Extract information",
  "Summarise content",
  "Compare documents or positions",
  "Analyse facts or data",
  "Explain or evaluate material",
  "Transform or reformat content",
  "Generate a first draft",
];

const PROMPT_ROLE = [
  "Initiates the task",
  "Provides context and instructions",
  "Reviews the output",
  "Applies professional judgment",
];

const AGENT_TASKS = [
  "Recurring information requests",
  "Retrieval across approved repositories",
  "Repeated document collection",
  "Multiple stakeholders",
  "Status tracking",
  "Standardised communications",
  "Periodic reporting",
  "Defined workflows and escalation",
];

const AGENT_ROLE = [
  "Operates within an instructed purpose",
  "Uses specified knowledge sources",
  "Follows workflows and restrictions",
  "Produces outputs for human review",
];

// ── Animation keyframes injected once ────────────────────────────────────────
const HERO_STYLES = `
@keyframes ey-hero-fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ey-hero-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes ey-rule-draw {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes ey-slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ey-slide-left {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes ey-slide-right {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes ey-fade-dissolve {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
}
@media (prefers-reduced-motion: reduce) {
  .ey-hero-line1, .ey-hero-line2, .ey-hero-sub,
  .ey-hero-rule, .ey-hero-challenge, .ey-hero-cta,
  .ey-recall-prompts, .ey-recall-agents, .ey-recall-badge { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

// ── FROM → TO data ────────────────────────────────────────────────────────────
const FROM_ITEMS = [
  "Understanding AI",
  "Learning prompt techniques",
  "Exploring M365 Agents",
  "Reviewing sample use cases",
];
const TO_ITEMS = [
  "Applying AI to your tax function",
  "Identifying activities suitable for Prompts",
  "Identifying recurring workflows for Agents",
  "Discovering your own priority opportunities",
];

// ── Memory Refresh data — verbatim from PDF slide 3 ─────────────────────────
const PROMPT_ELEMENTS = [
  { n: 1, kw: "Persona",       sub: "Perspective" },
  { n: 2, kw: "Context",       sub: "Relevant facts" },
  { n: 3, kw: "Objective",     sub: "What AI should do" },
  { n: 4, kw: "Instructions",  sub: "Steps and criteria" },
  { n: 5, kw: "Sources",       sub: "Material to use" },
  { n: 6, kw: "Output",        sub: "Format and detail" },
  { n: 7, kw: "Constraints",   sub: "What not to assume or do" },
  { n: 8, kw: "Review",        sub: "What the user must verify" },
];

const AGENT_ELEMENTS = [
  { n: 1, kw: "Purpose",               sub: "Goal to accomplish" },
  { n: 2, kw: "General guidance",      sub: "Directions, tone, restrictions" },
  { n: 3, kw: "Skills",                sub: "Support expected" },
  { n: 4, kw: "Workflow",              sub: "Steps to follow" },
  { n: 5, kw: "Knowledge",             sub: "Approved information" },
  { n: 6, kw: "Errors & limitations",  sub: "When to stop or clarify" },
  { n: 7, kw: "Examples",              sub: "Appropriate interaction" },
  { n: 8, kw: "Follow-up & closing",   sub: "How to complete the exchange" },
];

// ── Memory Refresh section ───────────────────────────────────────────────────
function MemoryRefreshSection() {
  const [activeTab, setActiveTab] = useState<"prompt" | "agent">("prompt");
  const [subsVisible, setSubsVisible] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);

  const isPrompt = activeTab === "prompt";
  const elements = isPrompt ? PROMPT_ELEMENTS : AGENT_ELEMENTS;
  const accentColor = isPrompt ? colors.yellow : colors.framePurple;
  const accentText = isPrompt ? colors.confidentBlack : colors.white;

  const switchTab = (tab: "prompt" | "agent") => {
    setActiveTab(tab);
    setSubsVisible(false);
  };

  return (
    <section
      id="memory-refresh"
      style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: colors.confidentBlack,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>

        {/* Eyebrow + heading */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{
            fontFamily: fonts.bold, fontSize: typeScale.label.size, letterSpacing: typeScale.label.tracking,
            textTransform: "uppercase", color: colors.yellow, margin: "0 0 12px",
          }}>
            Memory Refresh
          </p>
          <h2 style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(22px, 3.5vw, 36px)",
            color: colors.white,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            Good Outcomes Begin with Clear Instructions
          </h2>
          <p style={{
            fontFamily: fonts.regular, fontSize: "clamp(14px, 1.5vw, 16px)",
            color: colors.onDarkMuted, margin: 0, lineHeight: 1.5,
          }}>
            Recall the building blocks — without repeating the full Phase 1 training.
          </p>
        </div>

        {/* Tab toggle + show descriptions row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 12,
        }}>
        <div style={{
          display: "inline-flex",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          padding: 4,
          gap: 4,
        }}>
          {(["prompt", "agent"] as const).map((tab) => {
            const active = activeTab === tab;
            const tabAccent = tab === "prompt" ? colors.yellow : colors.framePurple;
            const tabText = tab === "prompt" ? colors.confidentBlack : colors.white;
            const label = tab === "prompt" ? "Effective Prompt" : "Effective M365 Agent instructions";
            return (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 13,
                  letterSpacing: "-0.01em",
                  color: active ? tabText : colors.gray01,
                  background: active ? tabAccent : "transparent",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  cursor: "pointer",
                  transition: "background 200ms, color 200ms",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

          {/* Show/hide descriptions — right-aligned, inline with tabs */}
          <button
            onClick={() => setSubsVisible((v) => !v)}
            style={{
              fontFamily: fonts.bold, fontSize: 12,
              color: accentColor,
              background: "transparent",
              border: `1px solid ${accentColor}`,
              borderRadius: 20, padding: "6px 16px",
              cursor: "pointer", letterSpacing: "-0.01em",
              display: "inline-flex", alignItems: "center", gap: 6,
              opacity: 0.85,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {subsVisible ? "Hide descriptions" : "Show descriptions"}
            {subsVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* 2×4 tile grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(8px, 1.2vw, 14px)",
          marginBottom: 20,
        }}>
          {elements.map((el) => {
            const showSub = subsVisible || hoveredTile === el.n;
            const isHovered = hoveredTile === el.n;
            return (
              <div
                key={`${activeTab}-${el.n}`}
                onMouseEnter={() => setHoveredTile(el.n)}
                onMouseLeave={() => setHoveredTile(null)}
                style={{
                  background: isHovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isHovered ? accentColor : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 8,
                  padding: "clamp(14px, 1.5vw, 20px)",
                  animation: "ey-slide-up 260ms cubic-bezier(.22,.68,0,1.05) both",
                  animationDelay: `${el.n * 30}ms`,
                  cursor: "default",
                  transition: "background 180ms, border-color 180ms",
                }}
              >
                <span style={{
                  fontFamily: fonts.bold, fontSize: 11,
                  color: accentColor, display: "block", marginBottom: 6,
                }}>
                  {el.n}
                </span>
                <span style={{
                  fontFamily: fonts.bold, fontSize: 13,
                  color: colors.white, lineHeight: 1.3, display: "block",
                }}>
                  {el.kw}
                </span>
                {showSub && (
                  <span style={{
                    fontFamily: fonts.regular, fontSize: 12,
                    color: colors.onDarkMuted, lineHeight: 1.4,
                    display: "block", marginTop: 6,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: 6,
                    animation: "ey-hero-fade-up 200ms cubic-bezier(.22,.68,0,1.05) both",
                  }}>
                    {el.sub}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Show/hide descriptions */}
        {/* Transition line — verbatim from PDF */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 28,
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: fonts.regular, fontSize: "clamp(14px, 1.5vw, 17px)",
            color: colors.onDarkMuted, margin: "0 0 4px",
          }}>
            Now that we know how to instruct AI,
          </p>
          <p style={{
            fontFamily: fonts.bold, fontSize: "clamp(15px, 1.6vw, 18px)",
            color: colors.yellow, margin: 0, letterSpacing: "-0.01em",
          }}>
            which tax activities are worth redesigning?
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Problem First data — verbatim from PDF slide 4 ──────────────────────────
const PROBLEM_STEPS = [
  {
    n: "01",
    q: "What work is being performed?",
    details: ["Tax process and key activities", "Trigger and required output"],
  },
  {
    n: "02",
    q: "Where does effort or friction arise?",
    details: ["Searching, reviewing, comparing, drafting", "Follow-ups, tracking, evidence and reporting"],
  },
  {
    n: "03",
    q: "What makes the activity difficult?",
    details: ["Volume, stakeholders and repositories", "Formats, hand-offs, missing information and judgment"],
  },
  {
    n: "04",
    q: "What should improve?",
    details: ["Effort, speed and consistency", "Visibility, evidence organisation and time for analysis"],
  },
];

// ── Problem First section ────────────────────────────────────────────────────
function ProblemFirstSection() {
  const [revealed, setRevealed] = useState(1);
  const promptVisible = revealed >= PROBLEM_STEPS.length;

  const reveal = () => {
    if (revealed < PROBLEM_STEPS.length) setRevealed((r) => r + 1);
  };

  // EY spectrum arc across 4 steps — mirrors the hero rule gradient
  const STEP_COLORS = [colors.yellow, colors.frameOrange, colors.framePurple, colors.frameBlue];
  const accentFor = (idx: number) => STEP_COLORS[idx] ?? colors.yellow;

  return (
    <section
      id="problem-first"
      style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN, background: colors.white, padding: `${spacing.sectionPaddingY} 0`, width: "100%" }}
    >
      <style>{`
        @keyframes ey-row-step-back {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0.45; transform: translateX(-4px); }
        }
        @keyframes ey-row-step-forward {
          from { opacity: 0.45; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div style={{ ...contentRailStyle }}>

        {/* Eyebrow + heading + progress */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{
            fontFamily: fonts.bold, fontSize: typeScale.label.size, letterSpacing: typeScale.label.tracking,
            textTransform: "uppercase", color: colors.eyebrowGold, margin: 0,
          }}>
            Problem First
          </p>
          {!promptVisible && (
            <span style={{
              fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em",
              color: colors.gray01, background: colors.offWhite,
              border: `1px solid ${colors.gray02}`,
              borderRadius: 20, padding: "3px 12px",
            }}>
              {revealed} of {PROBLEM_STEPS.length}
            </span>
          )}
        </div>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(22px, 3.5vw, 36px)",
            color: colors.offBlack,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            Do Not Begin with "We Need an Agent"
          </h2>
          <p style={{
            fontFamily: fonts.regular, fontSize: "clamp(14px, 1.5vw, 16px)",
            color: colors.gray01, margin: 0, lineHeight: 1.5,
          }}>
            A technology choice should follow the problem definition — not precede it.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {PROBLEM_STEPS.map((step, idx) => {
            const isActive = idx < revealed;
            const isNextGhost = idx === revealed; // only the immediate next is a ghost
            const isHidden = idx > revealed;

            if (isHidden) return null;

            const accent = accentFor(idx);

            return (
              <div key={step.n}>
                {/* Divider between steps */}
                {idx > 0 && (
                  <div style={{ height: 1, background: colors.gray02, margin: "0 0 0" }} />
                )}

                <div
                  onClick={isNextGhost ? reveal : undefined}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "clamp(20px, 3vw, 40px)",
                    padding: "clamp(24px, 3vw, 36px) 0",
                    cursor: isNextGhost ? "pointer" : "default",
                    transition: "opacity 400ms cubic-bezier(.22,.68,0,1.05)",
                    animation: isActive && idx === revealed - 1
                      ? "ey-slide-up 380ms cubic-bezier(.22,.68,0,1.05) both"
                      : "none",
                    userSelect: "none",
                  }}
                >
                  {/* Left accent bar + number — dimmed when ghost */}
                  <div style={{
                    display: "flex", alignItems: "flex-start", gap: 12, flexShrink: 0,
                    opacity: isNextGhost ? 0.28 : 1,
                    transition: "opacity 400ms",
                  }}>
                    <div style={{
                      width: 3, borderRadius: 2,
                      background: accent,
                      alignSelf: "stretch",
                      minHeight: 40,
                    }} />
                    <span style={{
                      fontFamily: fonts.bold,
                      fontSize: "clamp(32px, 4vw, 48px)",
                      lineHeight: 1,
                      color: colors.offBlack,
                      letterSpacing: "-0.03em",
                      marginTop: 2,
                    }}>
                      {step.n}
                    </span>
                  </div>

                  {/* Question + details */}
                  <div style={{ flex: 1 }}>
                    {/* Question — dimmed when ghost */}
                    <p style={{
                      fontFamily: fonts.bold,
                      fontSize: "clamp(16px, 2vw, 20px)",
                      color: colors.offBlack,
                      margin: "0 0 10px",
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      opacity: isNextGhost ? 0.28 : 1,
                      transition: "opacity 400ms",
                    }}>
                      {step.q}
                    </p>
                    {isActive && (
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                        {step.details.map((d) => (
                          <li key={d} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ color: colors.gray01, flexShrink: 0, lineHeight: "22px", fontSize: 13 }}>·</span>
                            <span style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.gray01, lineHeight: 1.55 }}>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Ghost hint — always full opacity, same position as before */}
                    {isNextGhost && (
                      <p style={{
                        fontFamily: fonts.bold, fontSize: 13,
                        color: colors.offBlack, margin: "6px 0 0",
                        display: "inline-flex", alignItems: "center", gap: 6,
                        border: `1px solid ${colors.gray02}`,
                        borderRadius: 20, padding: "5px 14px",
                        background: colors.white,
                      }}>
                        <PlusCircle size={13} color={colors.offBlack} aria-hidden="true" />
                        Click to reveal
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workshop prompt — appears after all 4 revealed */}
        {promptVisible && (
          <div
            style={{
              marginTop: 8,
              background: colors.yellow,
              borderRadius: 10,
              padding: "clamp(24px, 3vw, 36px)",
              animation: "ey-slide-up 420ms cubic-bezier(.22,.68,0,1.05) both",
            }}
          >
            <p style={{
              fontFamily: fonts.bold, fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: colors.confidentBlack, margin: "0 0 12px", opacity: 0.6,
            }}>
              Workshop Prompt
            </p>
            <p style={{
              fontFamily: fonts.bold,
              fontSize: "clamp(16px, 2vw, 20px)",
              color: colors.confidentBlack,
              margin: 0,
              lineHeight: 1.45,
              letterSpacing: "-0.01em",
            }}>
              Which tax processes consume the most effort today — and which individual activities create that effort?
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Guided Examples data — verbatim from PDF slide 5 ────────────────────────
const GUIDED_EXAMPLES = [
  {
    name: "Concept Note",
    purpose: "Reviewing research from multiple sources and helps draft requisite concept note for larger consumption.",
    approach: "Analyses tax research data collated from various sources and drafts a concept note with the relevant legislative provisions, judicial precedents and positions adopted.",
    outcome: "Creates a precise and informative summary of relevant tax concepts that serves as a foundational reference document.",
  },
  {
    name: "Facts-to-Law Mapping",
    purpose: "Mapping of relevant facts of the case to applicable tax provisions and judicial precedents to assess tax exposure.",
    approach: "Extracts the relevant facts of a case, identifies the applicable tax provisions and maps these to applicable judicial precedents and positions adopted.",
    outcome: "Develops a structured fact-to-law matrix that clearly shows the relationship between facts and applicable legal frameworks.",
  },
  {
    name: "20-80 Concept Simplification",
    purpose: "Simplifying tax concepts into digestible, actionable insights that cover 80% of use cases with 20% of the effort.",
    approach: "Analyses complex tax concepts and extracts the key principles, rules and exceptions that apply to the most common scenarios encountered in practice.",
    outcome: "Produces concise, practical summaries of tax concepts that enable quick understanding and application in common scenarios.",
  },
  {
    name: "Stepwise Concept Plan",
    purpose: "Breaking down complex tax concepts into step-by-step implementation guidance that can be followed sequentially.",
    approach: "Structures tax concepts into logical, sequential steps with clear decision points, conditions and actions at each stage.",
    outcome: "Creates a structured implementation guide that reduces errors and ensures consistent application of tax concepts.",
  },
  {
    name: "Transaction Step Plan",
    purpose: "Mapping the tax implications of each step in a transaction to identify risks and planning opportunities.",
    approach: "Analyses each step of a proposed transaction, identifies applicable tax provisions and assesses the tax consequences and risks.",
    outcome: "Produces a comprehensive transaction map showing the tax implications at each step and highlighting key risk areas.",
  },
  {
    name: "GST Formula Validation",
    purpose: "Validating GST calculations and formulas to ensure compliance with applicable provisions and circulars.",
    approach: "Checks GST calculations against applicable tax rates, exemptions and provisions, identifies discrepancies and suggests corrections.",
    outcome: "Provides a validated GST calculation with references to applicable provisions and explanation of any adjustments made.",
  },
  {
    name: "Meeting Minutes",
    purpose: "Generating structured meeting minutes from discussion notes or recordings for tax team meetings.",
    approach: "Extracts key discussion points, decisions made, action items and owners from meeting notes and organises them into a structured format.",
    outcome: "Produces clear, concise meeting minutes with action items, owners and timelines that can be shared with stakeholders.",
  },
  {
    name: "PPT Mock Run",
    purpose: "Preparing for client presentations by generating anticipated questions and suggested responses.",
    approach: "Analyses the presentation content and generates likely client questions based on the subject matter, industry context and typical client concerns.",
    outcome: "Produces a Q&A preparation guide that helps presenters anticipate and prepare for client questions.",
  },
  {
    name: "Tax Strategic Upskilling",
    purpose: "Creating personalised learning materials to build tax team capability in specific areas.",
    approach: "Assesses the learning objectives and creates structured learning content including explanations, examples, scenarios and self-assessment questions.",
    outcome: "Produces targeted learning materials that build capability in specific tax areas efficiently.",
  },
  {
    name: "Document Extraction",
    purpose: "Extracting specific data points or information from large volumes of tax documents.",
    approach: "Identifies and extracts specified data fields from documents such as invoices, contracts, returns and correspondence.",
    outcome: "Produces structured data extracts that can be used for analysis, reconciliation or reporting purposes.",
  },
  {
    name: "Image Summarization",
    purpose: "Summarising content from images, charts or scanned documents for use in tax analysis.",
    approach: "Analyses image content including charts, tables, scanned documents and handwritten notes and converts them into structured text summaries.",
    outcome: "Produces text summaries of image content that can be integrated into analysis and reporting workflows.",
  },
  {
    name: "Vernacular Translation",
    purpose: "Translating tax documents or communications from regional languages to English for analysis.",
    approach: "Translates content from regional languages while preserving technical tax terminology and context.",
    outcome: "Provides accurate translations that enable analysis of tax documents in regional languages.",
  },
  {
    name: "VBA Automation",
    purpose: "Creating VBA macros to automate repetitive Excel-based tax calculations and data processing tasks.",
    approach: "Analyses the manual process steps and generates VBA code to automate data extraction, calculation and formatting tasks.",
    outcome: "Produces VBA code that automates repetitive tasks, reducing manual effort and improving consistency.",
  },
  {
    name: "Agreement Review",
    purpose: "Reviewing agreements for tax-relevant clauses and assessing the tax implications of contractual arrangements.",
    approach: "Extracts and analyses tax-relevant clauses from agreements, identifies potential tax risks and suggests areas for clarification or renegotiation.",
    outcome: "Produces a structured review highlighting key tax clauses, risks and recommended actions.",
  },
  {
    name: "SOP Review",
    purpose: "Reviewing and updating standard operating procedures to reflect current tax provisions and best practices.",
    approach: "Analyses existing SOPs against current tax provisions and identifies areas where updates or clarifications are required.",
    outcome: "Produces updated SOPs or a gap analysis highlighting required changes to align with current requirements.",
  },
];

// ── Guided Examples section ──────────────────────────────────────────────────
function GuidedExamplesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [panelKey, setPanelKey] = useState(0); // triggers slide-in animation on change

  const select = (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setPanelKey((k) => k + 1);
  };

  const active = GUIDED_EXAMPLES[activeIdx];
  const isLast = activeIdx === GUIDED_EXAMPLES.length - 1;

  const next = () => {
    const nextIdx = Math.min(activeIdx + 1, GUIDED_EXAMPLES.length - 1);
    select(nextIdx);
  };
  const prev = () => select(Math.max(activeIdx - 1, 0));

  return (
    <section
      id="guided-examples"
      style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: colors.offWhite,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>

        {/* Eyebrow + heading + disclaimer */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{
            fontFamily: fonts.bold, fontSize: typeScale.label.size, letterSpacing: typeScale.label.tracking,
            textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 12px",
          }}>
            Guided Examples
          </p>
          <h2 style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(22px, 3.5vw, 36px)",
            color: colors.offBlack,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            EY-Guided Prompt Examples
          </h2>
          <p style={{
            fontFamily: fonts.regular, fontSize: "clamp(13px, 1.4vw, 15px)",
            color: colors.gray01, margin: 0, lineHeight: 1.5,
          }}>
            These examples stimulate discussion — they are not a preselected implementation list.
          </p>
        </div>

        {/* Split panel */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "clamp(200px, 30%, 280px) 1fr",
          gap: 0,
          border: `1px solid ${colors.gray02}`,
          borderRadius: 10,
          overflow: "hidden",
          background: colors.white,
          minHeight: 480,
        }}>

          {/* LEFT — sidebar */}
          <div style={{
            background: colors.confidentBlack,
            borderRight: `1px solid rgba(255,255,255,0.08)`,
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Counter at top */}
            <div style={{
              padding: "16px 17px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{
                fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em",
                textTransform: "uppercase", color: colors.onDarkMuted,
              }}>
                Examples
              </span>
              <span style={{
                fontFamily: fonts.bold, fontSize: 11,
                color: colors.yellow,
                background: "rgba(255,230,0,0.12)",
                borderRadius: 20, padding: "2px 10px",
                letterSpacing: "0.02em",
              }}>
                {activeIdx + 1} / {GUIDED_EXAMPLES.length}
              </span>
            </div>

            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "8px 0",
            }}>
              {GUIDED_EXAMPLES.map((ex, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={ex.name}
                    onClick={() => select(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      border: "none",
                      background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                      borderLeft: isActive ? `3px solid ${colors.yellow}` : "3px solid transparent",
                      padding: "10px 16px 10px 14px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 150ms",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <span style={{
                      fontFamily: isActive ? fonts.bold : fonts.regular,
                      fontSize: isActive ? 13 : 12,
                      color: isActive ? colors.white : colors.onDarkMuted,
                      lineHeight: 1.35,
                      letterSpacing: isActive ? "-0.01em" : "0.01em",
                    }}>
                      {ex.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — detail panel */}
          <div
            key={panelKey}
            style={{
              padding: "clamp(24px, 3vw, 40px)",
              display: "flex",
              flexDirection: "column",
              animation: "ey-slide-right 200ms cubic-bezier(.22,.68,0,1.05) both",
            }}
          >
            {/* Prompt name */}
            <h3 style={{
              fontFamily: fonts.bold,
              fontSize: "clamp(18px, 2.2vw, 26px)",
              color: colors.offBlack,
              margin: "0 0 28px",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}>
              {active.name}
            </h3>

            {/* PURPOSE */}
            <div style={{ marginBottom: 24 }}>
              <p style={{
                fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.1em",
                textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 8px",
              }}>
                Purpose
              </p>
              <p style={{
                fontFamily: fonts.regular, fontSize: 14, color: colors.offBlack,
                margin: 0, lineHeight: 1.6,
              }}>
                {active.purpose}
              </p>
            </div>

            <div style={{ height: 1, background: colors.gray02, marginBottom: 24 }} />

            {/* APPROACH */}
            <div style={{ marginBottom: 24 }}>
              <p style={{
                fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.1em",
                textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 8px",
              }}>
                Approach
              </p>
              <p style={{
                fontFamily: fonts.regular, fontSize: 14, color: colors.offBlack,
                margin: 0, lineHeight: 1.6,
              }}>
                {active.approach}
              </p>
            </div>

            <div style={{ height: 1, background: colors.gray02, marginBottom: 24 }} />

            {/* OUTCOME */}
            <div style={{ marginBottom: 32 }}>
              <p style={{
                fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.1em",
                textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 8px",
              }}>
                Outcome
              </p>
              <p style={{
                fontFamily: fonts.regular, fontSize: 14, color: colors.offBlack,
                margin: 0, lineHeight: 1.6,
              }}>
                {active.outcome}
              </p>
            </div>

            {/* Prev / Next nav */}
            <div style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}>
              <button
                onClick={prev}
                disabled={activeIdx === 0}
                style={{
                  fontFamily: fonts.bold, fontSize: 13,
                  color: activeIdx === 0 ? colors.gray02 : colors.offBlack,
                  background: "transparent",
                  border: `1px solid ${activeIdx === 0 ? colors.gray02 : colors.offBlack}`,
                  borderRadius: 6, padding: "8px 20px",
                  cursor: activeIdx === 0 ? "not-allowed" : "pointer",
                  letterSpacing: "-0.01em",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "border-color 150ms, color 150ms",
                }}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={next}
                disabled={isLast}
                style={{
                  fontFamily: fonts.bold, fontSize: 13,
                  color: isLast ? colors.gray02 : colors.offBlack,
                  background: "transparent",
                  border: `1px solid ${isLast ? colors.gray02 : colors.offBlack}`,
                  borderRadius: 6, padding: "8px 20px",
                  cursor: isLast ? "not-allowed" : "pointer",
                  letterSpacing: "-0.01em",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "border-color 150ms, color 150ms",
                }}
              >
                {isLast ? <>See discussion prompt <ChevronDown size={14} /></> : <>Next <ChevronRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>

        {/* Discussion prompt — always visible below */}
        <div
          id="discussion-prompt"
          style={{
            marginTop: 24,
            background: colors.yellow,
            borderRadius: 10,
            padding: "clamp(24px, 3vw, 36px)",
            animation: isLast ? "ey-slide-up 300ms cubic-bezier(.22,.68,0,1.05) both" : undefined,
          }}
        >
          <p style={{
            fontFamily: fonts.bold, fontSize: 10,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: colors.confidentBlack, margin: "0 0 12px", opacity: 0.6,
          }}>
            Discussion Prompt
          </p>
          <p style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(16px, 2vw, 20px)",
            color: colors.confidentBlack,
            margin: 0,
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
          }}>
            Which recurring tax activity would benefit from stronger extraction, comparison, analysis,
            explanation, validation or a first draft?
          </p>
        </div>

      </div>
    </section>
  );
}

// ── M365 Agent Examples data — verbatim from PDF slide 6 ───────────────────
const AGENT_EXAMPLES = [
  {
    name: "Tax Knowledge Retrieval Agent",
    purpose: "Acts as a centralized knowledge assistant for locating historical tax positions, precedents and supporting materials.",
    actions: "Searches approved repositories containing tax opinions, notices, submissions, laws, policies and knowledge documents.",
    outcome: "Enables faster research, improves consistency in tax positions and reduces time spent searching for information.",
  },
  {
    name: "Transfer Pricing Documentation Agent",
    purpose: "Supports preparation and maintenance of transfer pricing documentation and supporting evidence.",
    actions: "Reviews related-party schedules, TP reports, benchmarking studies, GL records and supporting documentation.",
    outcome: "Identifies transactions, summarizes supporting information, highlights exceptions and improves audit readiness.",
  },
  {
    name: "Advance Tax Reviewer Agent",
    purpose: "Assists tax teams in reviewing advance tax computations and identifying key movements between reporting periods.",
    actions: "Compares current and prior quarter computations, validates changes in assumptions and workings, and analyses variances across tax forecasts and calculations.",
    outcome: "Produces variance analysis narratives, management summary notes and review observations that support faster validation, stakeholder reporting and decision-making.",
  },
  {
    name: "Tax Information Request Agent",
    purpose: "Streamlines the collection and management of information required from stakeholders during tax projects.",
    actions: "Drafts information requests, reviews responses, summarizes stakeholder inputs and identifies missing information.",
    outcome: "Reduces follow-up effort and improves the completeness and quality of information received.",
  },
  {
    name: "Assessment Evidence Agent",
    purpose: "Assists tax teams in gathering and organizing supporting evidence for audits, assessments and disputes.",
    actions: "Searches SharePoint, Teams, Outlook and supporting repositories for relevant documentation and correspondence.",
    outcome: "Creates issue-wise evidence packs, highlights missing support and strengthens audit preparedness.",
  },
  {
    name: "Tax Leadership Reporting Agent",
    purpose: "Provides leadership with periodic consolidated visibility over tax activities, developments and risks.",
    actions: "Collects status updates, auditor comments, legislative changes and regional tax developments for analysis.",
    outcome: "Produces executive dashboards, management reports and briefing materials to support decision-making.",
  },
  {
    name: "Personalized Tracker Agent (including Compliance Tracker)",
    purpose: "Acts as a centralized monitoring tool for tax compliance activities, deadlines and action items.",
    actions: "Maintains compliance calendars, trackers, filing records and related correspondence.",
    outcome: "Identifies upcoming, due and overdue obligations, highlights risks and supports timely compliance management.",
  },
  {
    name: "Repetitive Tax Correspondence Agent",
    purpose: "Standardizes recurring tax communications across stakeholders, management and employees.",
    actions: "Generates communication templates, drafts correspondence, refines messaging and applies approved communication standards.",
    outcome: "Improves consistency, reduces drafting effort and accelerates turnaround of routine communications.",
  },
  {
    name: "Second Brain Agent",
    purpose: "Acts as a personalized tax knowledge companion that helps professionals quickly access information, insights and prior work products accumulated over time.",
    actions: "Searches across emails, meeting notes, presentations, research materials, working papers, tax opinions and enterprise repositories to build contextual understanding.",
    outcome: "Enables users to retrieve historical knowledge, identify relevant precedents, surface action items and obtain context-aware guidance without manually searching through multiple sources.",
  },
];

// ── M365 Agent Examples section ──────────────────────────────────────────────
function AgentExamplesSection() {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const agent = AGENT_EXAMPLES[activeIdx];

  return (
    <section
      id="agent-examples"
      style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: colors.white,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>

        {/* Eyebrow + heading + intro */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{
            fontFamily: fonts.bold, fontSize: typeScale.label.size, letterSpacing: typeScale.label.tracking,
            textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 12px",
          }}>
            Guided Examples
          </p>
          <h2 style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(22px, 3.5vw, 36px)",
            color: colors.offBlack,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            EY-Guided M365 Agent Examples
          </h2>
          <p style={{
            fontFamily: fonts.regular, fontSize: "clamp(13px, 1.4vw, 15px)",
            color: colors.gray01, margin: 0, lineHeight: 1.5,
          }}>
            Purpose, actions and outcome as summarised in Sheet1 of Sample use cases.xlsx.
            Agents are reusable assistants for clearly defined business scenarios.
          </p>
        </div>

        {/* Tile rows — detail panel injects after the row containing the active tile */}
        {[0, 1, 2].map((rowIdx) => {
          const rowStart = rowIdx * 3;
          const rowAgents = AGENT_EXAMPLES.slice(rowStart, rowStart + 3);
          const activeRow = Math.floor(activeIdx / 3);
          const showPanel = activeRow === rowIdx;

          return (
            <div key={rowIdx} style={{ marginBottom: 10 }}>
              {/* Tile row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}>
                {rowAgents.map((a, i) => {
                  const idx = rowStart + i;
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={a.name}
                      onClick={() => setActiveIdx(idx)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "14px 16px",
                        background: isActive ? "rgba(134,48,255,0.08)" : colors.white,
                        border: `1px solid ${isActive ? colors.framePurple : colors.gray02}`,
                        borderBottom: isActive ? `3px solid ${colors.framePurple}` : `1px solid ${colors.gray02}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 180ms, border-color 180ms",
                        userSelect: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(134,48,255,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.background = colors.white;
                      }}
                    >
                      <span style={{
                        fontFamily: fonts.bold, fontSize: 11,
                        color: isActive ? colors.framePurple : colors.gray01,
                        lineHeight: 1.4, flexShrink: 0, marginTop: 1,
                      }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span style={{
                        fontFamily: fonts.bold, fontSize: 12,
                        color: isActive ? colors.framePurple : colors.offBlack,
                        lineHeight: 1.35, letterSpacing: "-0.01em",
                        transition: "color 180ms",
                      }}>
                        {a.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detail panel — only for the active row */}
              {showPanel && (
                <div
                  key={activeIdx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "clamp(16px, 2vw, 28px)",
                    background: colors.white,
                    borderTop: `1px solid ${colors.gray02}`,
                    borderRight: `1px solid ${colors.gray02}`,
                    borderBottom: `1px solid ${colors.gray02}`,
                    borderLeft: `3px solid ${colors.framePurple}`,
                    borderRadius: 8,
                    padding: "clamp(16px, 2vw, 24px) clamp(20px, 2.5vw, 28px)",
                    minHeight: 140,
                    animation: "ey-slide-up 180ms cubic-bezier(.22,.68,0,1.05) both",
                    marginTop: 8,
                    marginBottom: 10,
                  }}
                >
                  {[
                    { label: "Purpose", body: agent.purpose },
                    { label: "Actions", body: agent.actions },
                    { label: "Outcome", body: agent.outcome },
                  ].map(({ label, body }) => (
                    <div key={label}>
                      <p style={{
                        fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: colors.eyebrowGold,
                        margin: "0 0 8px",
                      }}>
                        {label}
                      </p>
                      <p style={{
                        fontFamily: fonts.regular, fontSize: 13,
                        color: colors.offBlack, margin: 0, lineHeight: 1.6,
                      }}>
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Discussion prompt */}
        <div style={{
          marginTop: 6,
          background: "rgba(134,48,255,0.07)",
          border: `1px solid rgba(134,48,255,0.18)`,
          borderLeft: `3px solid ${colors.framePurple}`,
          borderRadius: 10,
          padding: "clamp(20px, 2.5vw, 28px)",
        }}>
          <p style={{
            fontFamily: fonts.bold, fontSize: 10,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: colors.framePurple, margin: "0 0 12px",
          }}>
            Discussion Prompt
          </p>
          <p style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(16px, 2vw, 20px)",
            color: colors.offBlack,
            margin: 0,
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
          }}>
            Which recurring tax workflow repeatedly requires people to search, collect,
            coordinate, track or report?
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Activity-Level Choice section (Slide 7) ─────────────────────────────────
const ACTIVITY_ROWS = [
  { activity: "Request projected financials from business units", pain: "Multiple follow-ups", type: "agent" as const, response: "M365 Agent" },
  { activity: "Collect qualitative tax inputs", pain: "Inputs buried in email and Teams", type: "agent" as const, response: "M365 Agent" },
  { activity: "Summarise business changes affecting forecast", pain: "Manual review of communications and forecasts", type: "prompt" as const, response: "Prompt" },
  { activity: "Compare current and prior-quarter assumptions", pain: "Time spent reviewing historical workings", type: "prompt" as const, response: "Prompt" },
  { activity: "Prepare variance narrative", pain: "Manual drafting", type: "prompt" as const, response: "Prompt" },
  { activity: "Consolidate business-unit comments", pain: "Inputs received through different channels", type: "agent" as const, response: "M365 Agent" },
  { activity: "Draft communication to Treasury or business", pain: "Recurring communication within a broader workflow", type: "both" as const, response: "Prompt and/or Agent — subject to workflow design" },
  { activity: "Archive challans, approvals and supporting files", pain: "Manual document organisation", type: "agent" as const, response: "M365 Agent" },
];

const LEGEND_CARDS = [
  {
    key: "prompt" as const,
    title: "Consider a Prompt",
    accentColor: "#0076A8",
    bullets: [
      "User-initiated task",
      "Defined input",
      "Interpretation, review or drafting",
      "Output varies with facts",
      "Professional closely involved",
    ],
  },
  {
    key: "agent" as const,
    title: "Consider an Agent",
    accentColor: "#B400FF",
    bullets: [
      "Activity repeats",
      "Multiple people or repositories",
      "Collection, retrieval or tracking",
      "Workflow can be instructed",
      "Outputs and escalation can be defined",
    ],
  },
  {
    key: "both" as const,
    title: "Consider both",
    accentColor: "#168736",
    bullets: [
      "Agent coordinates or retrieves",
      "Prompt interprets, analyses or drafts",
    ],
  },
];

const BADGE_CONFIG = {
  prompt: { bg: "rgba(0,118,168,0.10)", color: "#0076A8" },
  agent:  { bg: "rgba(180,0,255,0.06)", color: "#B400FF" },
  both:   { bg: "rgba(22,135,54,0.10)",  color: "#168736" },
};

function ActivityLevelChoiceSection() {
  const [activeFilter, setActiveFilter] = useState<"prompt" | "agent" | "both" | null>(null);

  const toggleFilter = (key: "prompt" | "agent" | "both") => {
    setActiveFilter((prev) => (prev === key ? null : key));
  };

  const rowVisible = (type: "prompt" | "agent" | "both") =>
    activeFilter === null || activeFilter === type;

  return (
    <section
      id="use-case-map"
      style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: "rgba(0,163,255,0.05)",
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <style>{`
        @keyframes ey-row-step-back {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0.45; transform: translateX(-4px); }
        }
        @keyframes ey-row-step-forward {
          from { opacity: 0.45; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div style={{ ...contentRailStyle }}>

        {/* Eyebrow + heading */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{
            fontFamily: fonts.bold, fontSize: typeScale.label.size, letterSpacing: typeScale.label.tracking,
            textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 12px",
          }}>
            Activity-Level Choice
          </p>
          <h2 style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(22px, 3.5vw, 36px)",
            color: colors.offBlack,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            One Process. Different Activities. Different Solutions.
          </h2>
          <p style={{
            fontFamily: fonts.regular, fontSize: "clamp(13px, 1.4vw, 15px)",
            color: colors.gray01, margin: 0, lineHeight: 1.5,
          }}>
            Illustrative advance-tax mapping from the workbook: classify each activity separately.
          </p>
        </div>

        {/* Legend cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}>
          {LEGEND_CARDS.map((card) => {
            const isActive = activeFilter === card.key;
            return (
              <button
                key={card.key}
                onClick={() => toggleFilter(card.key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  padding: 0,
                  background: colors.white,
                  border: `1px solid ${isActive ? card.accentColor : colors.gray02}`,
                  borderTop: isActive ? `1px solid ${card.accentColor}` : `3px solid ${card.accentColor}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "border-color 180ms",
                  userSelect: "none",
                  overflow: "hidden",
                  boxShadow: isActive ? `0 2px 12px ${card.accentColor}28` : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = `${card.accentColor}08`;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = colors.white;
                }}
              >
                {/* Header band — only when active */}
                {isActive && (
                  <div style={{
                    background: card.accentColor,
                    padding: "10px 18px",
                    borderRadius: "5px 5px 0 0",
                  }}>
                    <p style={{
                      fontFamily: fonts.bold, fontSize: 13,
                      color: colors.white, margin: 0,
                      letterSpacing: "-0.01em",
                    }}>
                      {card.title}
                    </p>
                  </div>
                )}

                {/* Body */}
                <div style={{ padding: isActive ? "14px 18px" : "16px 18px" }}>
                  {!isActive && (
                    <p style={{
                      fontFamily: fonts.bold, fontSize: 13,
                      color: card.accentColor, margin: "0 0 10px",
                      letterSpacing: "-0.01em",
                    }}>
                      {card.title}
                    </p>
                  )}
                  <ul style={{ margin: 0, padding: "0 0 0 14px", listStyle: "disc" }}>
                    {card.bullets.map((b) => (
                      <li key={b} style={{
                        fontFamily: fonts.regular, fontSize: 12,
                        color: colors.offBlack, lineHeight: 1.55,
                        marginBottom: 3,
                      }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div style={{
          border: `1px solid ${colors.gray02}`,
          borderRadius: 8,
          overflow: "hidden",
          background: colors.white,
          marginBottom: 16,
        }}>
          {/* Header row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1.2fr",
            background: colors.offBlack,
            padding: "10px 20px",
          }}>
            {["Activity", "Current Pain Point", "Possible Response"].map((h) => (
              <p key={h} style={{
                fontFamily: fonts.bold, fontSize: 11,
                color: colors.yellow, margin: 0,
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                {h}
              </p>
            ))}
          </div>

          {/* Data rows */}
          {ACTIVITY_ROWS.map((row, i) => {
            const visible = rowVisible(row.type);
            const isLast = i === ACTIVITY_ROWS.length - 1;
            const badge = BADGE_CONFIG[row.type];
            return (
              <div
                key={row.activity}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1.2fr",
                  padding: "12px 20px",
                  borderBottom: isLast ? "none" : `1px solid ${colors.gray02}`,
                  borderLeft: activeFilter !== null && visible ? `3px solid ${badge.color}` : "3px solid transparent",
                  alignItems: "center",
                  background: activeFilter !== null && visible ? badge.bg : "transparent",
                  animation: activeFilter !== null
                    ? visible
                      ? "ey-row-step-forward 160ms ease-out forwards"
                      : "ey-row-step-back 160ms ease-out forwards"
                    : "none",
                  opacity: activeFilter !== null && !visible ? 0.45 : 1,
                  transition: "opacity 160ms, background 160ms, border-left-color 160ms",
                }}
              >
                <p style={{
                  fontFamily: fonts.regular, fontSize: 13,
                  color: colors.offBlack, margin: 0, lineHeight: 1.5,
                  paddingRight: 16,
                }}>
                  {row.activity}
                </p>
                <p style={{
                  fontFamily: fonts.regular, fontSize: 13,
                  color: colors.gray01, margin: 0, lineHeight: 1.5,
                  paddingRight: 16,
                }}>
                  {row.pain}
                </p>
                <span style={{
                  display: "inline-block",
                  justifySelf: "start",
                  fontFamily: fonts.bold, fontSize: 12,
                  color: badge.color,
                  background: badge.bg,
                  borderRadius: 20,
                  padding: "4px 10px",
                  lineHeight: 1.4,
                }}>
                  {row.response}
                </span>
              </div>
            );
          })}
        </div>

        {/* Key message bar */}
        <div style={{
          background: colors.yellow,
          borderRadius: 6,
          padding: "14px 20px",
        }}>
          <p style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(13px, 1.4vw, 15px)",
            color: colors.offBlack,
            margin: 0,
            lineHeight: 1.5,
          }}>
            Do not classify an entire tax process as "Prompt" or "Agent." Assess each activity separately.
          </p>
        </div>

      </div>
    </section>
  );
}

// ── Live Brainstorm Section ──────────────────────────────────────────────────

const BRAINSTORM_ITEMS = [
  {
    key: "A",
    title: "PROCESS",
    accent: "#0076A8",
    bullets: [
      "Process selected",
      "Business objective",
      "Trigger and final output",
      "Frequency",
    ],
  },
  {
    key: "B",
    title: "CURRENT ACTIVITIES",
    accent: "#2DB5A0",
    bullets: [
      "Key steps and owners",
      "Documents and data",
      "Systems and repositories",
    ],
  },
  {
    key: "C",
    title: "FRICTION",
    accent: "#FF6D22",
    bullets: [
      "Time and follow-ups",
      "Repeated searching",
      "Errors, inconsistencies or delays",
      "Professional judgment points",
    ],
  },
  {
    key: "D",
    title: "OPPORTUNITY",
    accent: "#B400FF",
    bullets: [
      "Prompt",
      "M365 Agent",
      "Prompt + Agent",
      "Process improvement",
      "Human-led activity",
    ],
  },
  {
    key: "E",
    title: "CONTROL QUESTIONS",
    accent: "#E8506B",
    bullets: [
      "Permitted information and sources",
      "Qualified reviewer",
      "Stop or escalation points",
      "What remains human-led",
    ],
  },
  {
    key: "F",
    title: "INITIAL PRIORITY",
    accent: "#168736",
    bullets: [
      "Relevance and friction",
      "Repeatability",
      "Inputs and sources",
      "Human review",
      "Practicality",
    ],
  },
] as const;

function LiveBrainstormSection() {
  const [activeKey, setActiveKey] = useState<string>("A");
  const activeItem = BRAINSTORM_ITEMS.find((i) => i.key === activeKey)!;
  const activeIdx = BRAINSTORM_ITEMS.findIndex((i) => i.key === activeKey);

  return (
    <section
      id="live-brainstorm"
      style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: colors.confidentBlack,
        padding: "80px 0",
      }}
    >
      <div style={{ ...contentRailStyle }}>
        {/* Eyebrow + heading + subhead — centered per section pattern */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
        <p style={{
          color: colors.yellow,
          fontFamily: fonts.bold,
          fontSize: typeScale.label.size,
          letterSpacing: typeScale.label.tracking,
          textTransform: "uppercase",
          margin: "0 0 14px",
        }}>
          Live Brainstorm
        </p>
        <h2 style={{
          color: colors.white,
          fontFamily: fonts.bold,
          fontSize: "clamp(26px, 3.2vw, 40px)",
          margin: "0 0 14px",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}>
          Your Tax Process. Your Pain Points. Your Opportunities.
        </h2>
        </div>

        {/* Subhead */}
        <p style={{
          color: "rgba(255,255,255,0.72)",
          fontFamily: fonts.regular,
          fontSize: "clamp(13px, 1.4vw, 15px)",
          margin: "0 0 32px",
          lineHeight: 1.6,
          maxWidth: 640,
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
        }}>
          EY's guided samples open the conversation. The client's validated process and pain points determine the opportunity.
        </p>

        {/* Main panel */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          overflow: "hidden",
          minHeight: 340,
        }}>
          {/* Left nav */}
          <nav
            aria-label="Brainstorm framework"
            style={{
              borderRight: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              flexDirection: "column",
              padding: "8px 0",
            }}
          >
            {BRAINSTORM_ITEMS.map((item) => {
              const isActive = activeKey === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveKey(item.key)}
                  aria-current={isActive ? "true" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                    border: "none",
                    borderLeft: isActive
                      ? `3px solid ${colors.yellow}`
                      : "3px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {/* Letter badge */}
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: isActive ? item.accent : `${item.accent}38`,
                    border: isActive ? "none" : `1px solid ${item.accent}70`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fonts.bold,
                    fontSize: 12,
                    color: colors.white,
                    transition: "background 150ms",
                  }}>
                    {item.key}
                  </span>
                  {/* Title */}
                  <span style={{
                    fontFamily: fonts.bold,
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isActive ? colors.white : "rgba(255,255,255,0.5)",
                    lineHeight: 1.4,
                    transition: "color 150ms",
                  }}>
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right detail pane */}
          <div
            key={activeKey}
            style={{
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              animation: "ey-slide-up 200ms cubic-bezier(.22,.68,0,1.05) both",
            }}
          >
            {/* Title only — letter lives in the nav */}
            <h3 style={{
              fontFamily: fonts.bold,
              fontSize: 18,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: colors.white,
              margin: "0 0 20px",
            }}>
              {activeItem.title}
            </h3>

            {/* Accent rule */}
            <div style={{
              height: 3,
              width: 36,
              borderRadius: 2,
              background: activeItem.accent,
              marginBottom: 22,
            }} />

            {/* Bullet list */}
            <ul style={{ margin: 0, padding: "0 0 0 18px", listStyle: "disc" }}>
              {activeItem.bullets.map((b) => (
                <li
                  key={b}
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 15,
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.75,
                    marginBottom: 4,
                  }}
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key message bar */}
        <div style={{
          marginTop: 20,
          background: colors.yellow,
          borderRadius: 6,
          padding: "14px 20px",
        }}>
          <p style={{
            fontFamily: fonts.bold,
            fontSize: 14,
            color: colors.offBlack,
            margin: 0,
            lineHeight: 1.55,
          }}>
            Select one tax process. Map the activities. Name the friction. Then choose the response—Prompt, Agent, both, process change or human-led.
          </p>
        </div>

      </div>
    </section>
  );
}

// ── Deliverables Section ─────────────────────────────────────────────────────

const D1_ACCENT = "#0076A8";
const D2_ACCENT = "#7B5EA7";

function DeliverablesSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <>
      <section id="deliverables" style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN, background: "#F4F4F8", padding: "80px 0 0" }}>
        <div style={{ ...contentRailStyle }}>
          {/* Eyebrow + heading — centered per section pattern */}
          <div style={{ textAlign: "center", marginBottom: 8 }}>
          <p style={{
            color: colors.eyebrowGold, fontFamily: fonts.bold,
            fontSize: typeScale.label.size, letterSpacing: typeScale.label.tracking, textTransform: "uppercase", margin: "0 0 14px",
          }}>
            Phase 2 Outputs
          </p>
          <h2 style={{
            color: colors.offBlack, fontFamily: fonts.bold,
            fontSize: "clamp(26px, 3.2vw, 40px)", margin: "0 0 12px",
            letterSpacing: "-0.02em", lineHeight: 1.1,
          }}>
            From Workshop Discussion to a Reimagined Tax Process
          </h2>
          </div>

          {/* Subhead */}
          <p style={{
            color: colors.gray01, fontFamily: fonts.regular,
            fontSize: "clamp(13px, 1.4vw, 15px)", margin: "0 0 40px",
            lineHeight: 1.6, maxWidth: 600, textAlign: "center",
            marginLeft: "auto", marginRight: "auto",
          }}>
            The workshop converts validated client inputs into two practical Phase 2 deliverables.
          </p>

          {/* Deliverable 1 — horizontal strip */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            background: colors.white,
            border: `1px solid ${colors.gray02}`,
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 16,
          }}>
            {/* Number column */}
            <div style={{
              background: D1_ACCENT,
              borderRight: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 0",
            }}>
              <span style={{
                fontFamily: fonts.bold,
                fontSize: 56,
                lineHeight: 1,
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.04em",
              }}>
                01
              </span>
            </div>

            {/* Content column */}
            <div style={{ padding: "32px 36px" }}>
              <span style={{
                display: "inline-flex",
                border: `1px solid ${D1_ACCENT}`, borderRadius: 100,
                padding: "3px 10px", marginBottom: 14,
                fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.08em",
                textTransform: "uppercase", color: D1_ACCENT,
              }}>
                Deliverable 1
              </span>

              <h3 style={{
                fontFamily: fonts.bold, fontSize: 20,
                color: colors.offBlack, margin: "0 0 18px", lineHeight: 1.2,
              }}>
                AI-enabled process maps
              </h3>

              <p style={{
                fontFamily: fonts.bold, fontSize: 12,
                color: D1_ACCENT, margin: "0 0 10px", textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
                For each selected use case:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 32px" }}>
                {[
                  "Current activity",
                  "Pain point",
                  "Proposed AI intervention",
                  "Human review",
                  "Reimagined activity",
                  "Expected operational benefit",
                ].map((item, i) => (
                  <div key={item} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{
                      fontFamily: fonts.bold, fontSize: 11,
                      color: D1_ACCENT, flexShrink: 0, minWidth: 16,
                    }}>
                      {i + 1}.
                    </span>
                    <span style={{
                      fontFamily: fonts.regular, fontSize: 14,
                      color: colors.offBlack, lineHeight: 1.65,
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <p style={{
                fontFamily: fonts.regular, fontSize: 12,
                color: colors.gray01, margin: "18px 0 0", lineHeight: 1.6,
                borderTop: `1px solid ${colors.gray02}`, paddingTop: 14,
              }}>
                Shows activities suited to Prompts, Agents, human judgment, hand-offs and review points.
              </p>
            </div>
          </div>

          {/* Deliverable 2 — horizontal strip */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            background: colors.white,
            border: `1px solid ${colors.gray02}`,
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 36,
          }}>
            {/* Number column */}
            <div style={{
              background: D2_ACCENT,
              borderRight: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 0",
            }}>
              <span style={{
                fontFamily: fonts.bold,
                fontSize: 56,
                lineHeight: 1,
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.04em",
              }}>
                02
              </span>
            </div>

            {/* Content column */}
            <div style={{ padding: "32px 36px" }}>
              <span style={{
                display: "inline-flex",
                border: `1px solid ${D2_ACCENT}`, borderRadius: 100,
                padding: "3px 10px", marginBottom: 14,
                fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.08em",
                textTransform: "uppercase", color: D2_ACCENT,
              }}>
                Deliverable 2
              </span>

              <h3 style={{
                fontFamily: fonts.bold, fontSize: 20,
                color: colors.offBlack, margin: "0 0 18px", lineHeight: 1.2,
              }}>
                Prompt-versus-Agent Recommendation Note
              </h3>

              <p style={{
                fontFamily: fonts.bold, fontSize: 12,
                color: D2_ACCENT, margin: "0 0 10px", textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
                Documents:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 32px" }}>
                {[
                  "Tax process and activity",
                  "Existing pain point",
                  "Proposed AI lever",
                  "Reason for recommendation",
                  "Initial priority",
                  "Dependencies or considerations",
                  "Suggested next step",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{
                      fontFamily: fonts.bold, fontSize: 14,
                      color: D2_ACCENT, flexShrink: 0, lineHeight: 1,
                    }}>
                      ·
                    </span>
                    <span style={{
                      fontFamily: fonts.regular, fontSize: 14,
                      color: colors.offBlack, lineHeight: 1.65,
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Next CTA */}
      <EYWhatsNext
        id="next-steps"
        style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN }}
        title={
          <>
            Phase 2 complete.{" "}
            <br />
            Time to <EYWhatsNextHighlight>design the solution.</EYWhatsNextHighlight>
          </>
        }
        ctaLabel="Return to Learning Journey"
        onContinue={() => onNavigate("/phased")}
      />
    </>
  );
}

// ── Placeholder (sections not yet built) ────────────────────────────────────
function PlaceholderSection({ id, label }: { id: string; label: string }) {
  return (
    <section
      id={id}
      style={{
        minHeight: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `2px dashed ${colors.gray02}`,
        borderRadius: 8,
        margin: "0 0 32px",
      }}
    >
      <span style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.gray01, letterSpacing: "0.02em" }}>
        [ {label} ]
      </span>
    </section>
  );
}

// ── Quick Recall section ──────────────────────────────────────────────────────
function QuickRecallSection() {
  const [agentsRevealed, setAgentsRevealed] = useState(false);
  const [btnDissolving, setBtnDissolving] = useState(false);

  const reveal = () => {
    setBtnDissolving(true);
    setTimeout(() => setAgentsRevealed(true), 280);
  };

  const cardBase: React.CSSProperties = {
    background: colors.white,
    border: `1px solid ${colors.gray02}`,
    borderRadius: 10,
    padding: "clamp(20px, 2.5vw, 32px)",
    flex: 1,
    minWidth: 0,
  };

  return (
    <section
      id="quick-recall"
      style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: colors.offWhite,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>

        {/* Eyebrow + heading — centered per section pattern */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
        <p style={{
          fontFamily: fonts.bold,
          fontSize: typeScale.label.size,
          letterSpacing: typeScale.label.tracking,
          textTransform: "uppercase",
          color: colors.eyebrowGold,
          margin: "0 0 12px",
        }}>
          Quick Recall
        </p>
        <h2 style={{
          fontFamily: fonts.bold,
          fontSize: "clamp(22px, 3.5vw, 36px)",
          color: colors.offBlack,
          margin: "0 0 8px",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}>
          Prompt or M365 Agent? Start with the Nature of the Activity.
        </h2>
        </div>
        <p style={{
          fontFamily: fonts.regular,
          fontSize: "clamp(14px, 1.5vw, 16px)",
          color: colors.gray01,
          margin: "0 0 40px",
          lineHeight: 1.5,
          textAlign: "center",
          maxWidth: 620,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          {agentsRevealed ? (
            <>
              One tax process may contain both Prompt activities and Agent activities.
              <br />
              The right tool depends on what the activity demands — not on which technology sounds more&nbsp;advanced.
            </>
          ) : (
            <>
              One tax process may contain Prompt activities, Agent activities, or both.
              <br />
              Before brainstorming, recall the building blocks for each.
            </>
          )}
        </p>

        {/* Cards container — always side-by-side grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "clamp(16px, 2vw, 24px)",
          alignItems: "stretch",
        }}>

          {/* ── Prompts card ── */}
          <div
            className="ey-recall-prompts"
            style={{
              ...cardBase,
              borderTop: `3px solid ${colors.yellow}`,
              animation: "ey-slide-left 420ms cubic-bezier(.22,.68,0,1.05) both",
            }}
          >
            {/* Card header */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{
                fontFamily: fonts.bold,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: colors.confidentBlack,
                background: colors.yellow,
                borderRadius: 4,
                padding: "3px 10px",
              }}>
                Prompt
              </span>
            </div>
            <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray01, margin: "0 0 20px", lineHeight: 1.4 }}>
              Targeted assistance for a defined task
            </p>

            {/* Typically useful when */}
            <p style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.gray01, margin: "0 0 10px" }}>
              Typically useful when a user needs to:
            </p>
            <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
              {PROMPT_TASKS.map((task) => (
                <li key={task} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: colors.yellow, flexShrink: 0, marginTop: 6,
                  }} />
                  <span style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.offBlack, lineHeight: 1.4 }}>{task}</span>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div style={{ height: 1, background: colors.gray02, margin: "0 0 16px" }} />

            {/* The user */}
            <p style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.gray01, margin: "0 0 10px" }}>
              The user
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
              {PROMPT_ROLE.map((role) => (
                <li key={role} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: colors.offBlack, flexShrink: 0, marginTop: 6,
                  }} />
                  <span style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.offBlack, lineHeight: 1.4 }}>{role}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Agents card: ghost/locked → revealed ── */}
          {!agentsRevealed ? (
            <div
              style={{
                ...cardBase,
                borderTop: `3px solid ${colors.gray02}`,
                border: `1px dashed ${colors.gray02}`,
                borderTopStyle: "solid",
                borderTopWidth: 3,
                borderTopColor: colors.gray02,
                background: colors.offWhite,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                animation: btnDissolving
                  ? "ey-fade-dissolve 280ms cubic-bezier(.4,0,.2,1) both"
                  : "ey-slide-right 420ms cubic-bezier(.22,.68,0,1.05) 80ms both",
                minHeight: 200,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: colors.white, border: `1px solid ${colors.gray02}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Lock size={20} color={colors.gray01} strokeWidth={1.75} aria-hidden="true" />
              </div>

              <div style={{ textAlign: "center" }}>
                <span style={{
                  fontFamily: fonts.bold,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: colors.gray01,
                  background: colors.gray02,
                  borderRadius: 4,
                  padding: "3px 10px",
                  display: "inline-block",
                  marginBottom: 8,
                }}>
                  M365 Agent
                </span>
                <p style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray01, margin: 0 }}>
                  A reusable assistant for a defined business scenario
                </p>
              </div>

              <button
                onClick={reveal}
                style={{
                  fontFamily: fonts.bold, fontSize: 13,
                  color: colors.confidentBlack, background: colors.yellow,
                  border: "none", borderRadius: 24, padding: "10px 24px",
                  cursor: "pointer", letterSpacing: "-0.01em",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  boxShadow: "0 2px 12px rgba(255,230,0,0.35)",
                }}
              >
                Reveal M365 Agent
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          ) : (
            /* Revealed agents card */
            <div
              className="ey-recall-agents"
              style={{
                ...cardBase,
                borderTop: `3px solid ${colors.framePurple}`,
                animation: "ey-slide-up 420ms cubic-bezier(.22,.68,0,1.05) both",
              }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{
                  fontFamily: fonts.bold,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: colors.white,
                  background: colors.framePurple,
                  borderRadius: 4,
                  padding: "3px 10px",
                }}>
                  M365 Agent
                </span>
              </div>
              <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray01, margin: "0 0 20px", lineHeight: 1.4 }}>
                A reusable assistant for a defined business scenario
              </p>

              <p style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.gray01, margin: "0 0 10px" }}>
                Typically useful when work involves:
              </p>
              <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {AGENT_TASKS.map((task) => (
                  <li key={task} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: colors.framePurple, flexShrink: 0, marginTop: 6,
                    }} />
                    <span style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.offBlack, lineHeight: 1.4 }}>{task}</span>
                  </li>
                ))}
              </ul>

              <div style={{ height: 1, background: colors.gray02, margin: "0 0 16px" }} />

              <p style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.gray01, margin: "0 0 10px" }}>
                The Agent
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {AGENT_ROLE.map((role) => (
                  <li key={role} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: colors.framePurple, flexShrink: 0, marginTop: 6,
                    }} />
                    <span style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.offBlack, lineHeight: 1.4 }}>{role}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Post-reveal summary — verbatim from PDF slide 2 */}
        {agentsRevealed && (
          <div style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            gap: 16,
            animation: "ey-hero-fade-up 400ms 200ms both",
          }}>
            <div style={{ flex: 1, height: 1, background: colors.gray02 }} />
            <p style={{
              fontFamily: fonts.bold,
              fontSize: 14,
              color: colors.offBlack,
              margin: 0,
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}>
              Prompts assist specific tasks. Agents support repeatable workflows.
            </p>
            <div style={{ flex: 1, height: 1, background: colors.gray02 }} />
          </div>
        )}
      </div>
    </section>
  );
}

// ── Hero section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!document.getElementById("ey-hero-keyframes")) {
      const el = document.createElement("style");
      el.id = "ey-hero-keyframes";
      el.textContent = HERO_STYLES;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    // Small RAF so CSS is parsed before we trigger animations
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const anim = (delay: number, duration = 480, extra = ""): React.CSSProperties =>
    mounted
      ? { animation: `ey-hero-fade-up ${duration}ms cubic-bezier(.22,.68,0,1.05) ${delay}ms both`, ...JSON.parse(extra || "{}") }
      : { opacity: 0 };

  const ruleAnim: React.CSSProperties = mounted
    ? { animation: `ey-rule-draw 500ms cubic-bezier(.4,0,.2,1) 420ms both`, transformOrigin: "left" }
    : { opacity: 0 };

  return (
    <section
      id="hero"
      style={{
        backgroundColor: colors.confidentBlack,
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        padding: `${spacing.sectionPaddingY} 0 64px`,
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left scrim — keeps type readable over the image bloom */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(26,26,36,0.97) 0%, rgba(26,26,36,0.84) 45%, rgba(26,26,36,0.45) 72%, rgba(26,26,36,0.28) 100%)", pointerEvents: "none" }} />
      <div style={{ ...contentRailStyle, display: "flex", flexDirection: "column", gap: 0, position: "relative", zIndex: 1 }}>

        {/* Headline line 1 */}
        <h1
          className="ey-hero-line1"
          style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            color: colors.white,
            margin: 0,
            ...anim(80, 480),
          }}
        >
          You Know What AI Can Do.
        </h1>

        {/* Headline line 2 — yellow, staggered */}
        <h1
          className="ey-hero-line2"
          style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            color: colors.yellow,
            margin: "0 0 32px",
            ...anim(400, 480),
          }}
        >
          Now, Where Should It Work for You?
        </h1>

        {/* Subheading */}
        <p
          className="ey-hero-sub"
          style={{
            fontFamily: fonts.regular,
            fontSize: "clamp(15px, 1.6vw, 19px)",
            color: colors.onDarkMuted,
            margin: "0 0 48px",
            lineHeight: 1.55,
            maxWidth: 640,
            ...anim(560, 400),
          }}
        >
          From foundational learning to tax-process opportunity discovery.
        </p>
      </div>
    </section>
  );
}

// ── Hero context — challenge + FROM→TO (separated from dark hero per pattern) ─
function HeroContextSection() {
  return (
    <section
      style={{
        background: colors.white,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>

        {/* Challenge card — light-theme */}
        <div style={{
          background: colors.offWhite,
          border: `1px solid ${colors.gray02}`,
          borderTop: `3px solid ${colors.yellow}`,
          borderRadius: 10,
          padding: "clamp(20px, 3vw, 32px)",
          marginBottom: 32,
        }}>
          <p style={{
            fontFamily: fonts.bold,
            fontSize: typeScale.label.size,
            letterSpacing: typeScale.label.tracking,
            textTransform: "uppercase",
            color: colors.eyebrowGold,
            margin: "0 0 12px",
          }}>
            Today's Challenge
          </p>
          <p style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(16px, 2vw, 22px)",
            color: colors.offBlack,
            margin: 0,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
          }}>
            Which activities consume time, create friction, or depend heavily on repeated
            searching, reviewing, drafting, coordination or follow-up?
          </p>
        </div>

        {/* FROM → TO orientation strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: "clamp(12px, 2vw, 32px)",
          alignItems: "start",
        }}>
          {/* FROM */}
          <div style={{
            background: colors.offWhite,
            border: `1px solid ${colors.gray02}`,
            borderRadius: 8,
            padding: "clamp(16px, 2vw, 24px)",
          }}>
            <p style={{
              fontFamily: fonts.bold,
              fontSize: typeScale.label.size,
              letterSpacing: typeScale.label.tracking,
              textTransform: "uppercase",
              color: colors.gray01,
              margin: "0 0 12px",
            }}>
              Phase 1 — From
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {FROM_ITEMS.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: colors.gray01, flexShrink: 0, lineHeight: "22px", fontSize: typeScale.label.size }}>·</span>
                  <span style={{ fontFamily: fonts.regular, fontSize: typeScale.label.size, color: colors.gray01, lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow connector */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 36,
            gap: 4,
          }}>
            <div style={{ width: 2, height: 20, background: colors.gray02 }} />
            <ArrowRight size={20} color={colors.yellow} aria-hidden="true" />
            <div style={{ width: 2, height: 20, background: colors.gray02 }} />
          </div>

          {/* TO */}
          <div style={{
            background: colors.offWhite,
            border: `1px solid ${colors.gray02}`,
            borderTop: `3px solid ${colors.yellow}`,
            borderRadius: 8,
            padding: "clamp(16px, 2vw, 24px)",
          }}>
            <p style={{
              fontFamily: fonts.bold,
              fontSize: typeScale.label.size,
              letterSpacing: typeScale.label.tracking,
              textTransform: "uppercase",
              color: colors.eyebrowGold,
              margin: "0 0 12px",
            }}>
              Phase 2 — To
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {TO_ITEMS.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: colors.yellow, flexShrink: 0, lineHeight: "22px", fontSize: typeScale.label.size }}>·</span>
                  <span style={{ fontFamily: fonts.bold, fontSize: typeScale.label.size, color: colors.offBlack, lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BrainstormingUseCases({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (path: string) => void;
}) {
  useModuleSectionHashScroll();

  return (
    <div
      className="relative bg-white content-stretch flex flex-col items-stretch w-full max-w-full min-w-0 overflow-x-hidden"
      data-name="EY.ai Tax Labs - Phase 2"
    >
      {/* ── Sticky chrome ── */}
      <div
        className="content-stretch flex flex-col items-stretch relative shrink-0 w-full sticky top-0 z-[300]"
        data-name="Top Navigation"
      >
        <SiteHeader variant="learning" onNavigate={onNavigate} skipLinkTarget="#phase2-content" />
        <ModuleHeader
          mode="phase-overview"
          hideModuleDropdown
          phaseLabel={PHASE2_LABEL}
          phaseNumber={PHASE2_NUMBER}
          subPhaseLabel="2.1"
          sections={PHASE2_SECTIONS}
          onNavigate={onNavigate}
          onBack={onBack}
        />
      </div>

      {/* ── Main content ── */}
      <main id="phase2-content">

        <HeroSection />

        <HeroContextSection />

        <QuickRecallSection />

        <MemoryRefreshSection />

        <ProblemFirstSection />

        <GuidedExamplesSection />

        <AgentExamplesSection />

        <ActivityLevelChoiceSection />

        <LiveBrainstormSection />

        <DeliverablesSection onNavigate={onNavigate} />

      </main>
    </div>
  );
}
