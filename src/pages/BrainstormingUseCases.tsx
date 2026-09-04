import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, PlusCircle, QrCode, X } from "lucide-react";
import { PromptBookshelfLibrary } from "../components/PromptBookshelfLibrary";
import { WorkshopLibraryShareActions } from "../components/WorkshopLibraryShareActions";
import { UseCaseBucketCards } from "../components/UseCaseBucketCards";
import {
  EMPTY_USE_CASE_DRAFTS,
  moveUseCaseEntry,
  readStoredUseCaseEntries,
  type UseCaseBucketId,
  writeStoredUseCaseEntries,
} from "../data/use-case-buckets";
import { SiteHeader } from "../design-kit/SiteHeader";
import { ModuleHeader, SUBNAV_SCROLL_MARGIN, useModuleSectionHashScroll } from "../design-kit/LearningNav";
import { AscentModuleProgressSection } from "../imports/Frame353/ascentCurriculum";
import { AGENT_TEMPLATE_LIBRARY } from "../data/agent-template-library";
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
  { id: "problem-first", label: "Problem First", group: "learn" as const },
  { id: "your-use-cases", label: "Your Use Cases", group: "apply" as const },
  { id: "deliverables", label: "Outputs", group: "apply" as const },
  { id: "workshop-library", label: "Library", group: "apply" as const },
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

const PROCODE_TASKS = [
  "Complex multi-step automation",
  "Custom integrations with enterprise systems",
  "Advanced data transformation pipelines",
  "Scalable workflow orchestration",
];

const PROCODE_ROLE = [
  "Built by developers or technical teams",
  "Requires coding and API access",
  "Suited for organisation-wide deployment",
  "Maintained with version control and testing",
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

// ── Problem First data — verbatim from PDF slide 4 ──────────────────────────
const PROBLEM_STEPS = [
  {
    n: "01",
    q: "Where does effort or friction arise?",
    details: ["Searching, reviewing, comparing, drafting", "Follow-ups, tracking, evidence and reporting"],
  },
  {
    n: "02",
    q: "What work is being performed?",
    details: ["Tax process and key activities", "Trigger and required output"],
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

        <p style={{
          fontFamily: fonts.bold, fontSize: typeScale.label.size, letterSpacing: typeScale.label.tracking,
          textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 8px",
        }}>
          Problem First
        </p>

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

        {/* Workshop strip — appears after all 4 revealed */}
        {promptVisible && (
          <div
            style={{
              marginTop: 8,
              background: colors.yellow,
              borderRadius: 10,
              padding: "clamp(20px, 2.5vw, 32px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              animation: "ey-slide-up 420ms cubic-bezier(.22,.68,0,1.05) both",
            }}
          >
            <p style={{
              fontFamily: fonts.bold,
              fontSize: "clamp(16px, 2vw, 20px)",
              color: colors.confidentBlack,
              margin: 0,
              lineHeight: 1.45,
              letterSpacing: "-0.01em",
              flex: "1 1 240px",
            }}>
              Let&apos;s begin brainstorming?
            </p>
            <div
              aria-label="QR code placeholder"
              style={{
                width: 88,
                height: 88,
                flexShrink: 0,
                background: colors.white,
                border: `1px solid ${colors.confidentBlack}`,
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <QrCode size={36} strokeWidth={1.75} color={colors.confidentBlack} aria-hidden />
              <span style={{
                fontFamily: fonts.bold,
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: colors.gray01,
              }}>
                QR
              </span>
            </div>
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

const RECALL_PROMPT_EXAMPLES = GUIDED_EXAMPLES.slice(0, 4);
const RECALL_AGENT_EXAMPLES = AGENT_TEMPLATE_LIBRARY.slice(0, 4);

type RecallExampleKind = "prompt" | "agent";

type RecallExampleDetail = {
  kind: RecallExampleKind;
  name: string;
  fields: { label: string; body: string }[];
};

function agentRecallFields(agent: (typeof AGENT_TEMPLATE_LIBRARY)[number]): RecallExampleDetail["fields"] {
  const bodyFor = (sub: string) => agent.slides.find((s) => s.sub === sub)?.body ?? "";
  return [
    { label: "Purpose", body: bodyFor("Purpose") },
    { label: "Actions", body: bodyFor("Actions") },
    { label: "Outcome", body: bodyFor("Outcome") },
  ];
}

/** Overlay with purpose / approach or actions / outcome for a Quick Recall example. */
function RecallExampleModal({ detail, onClose }: { detail: RecallExampleDetail; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isPrompt = detail.kind === "prompt";
  const accent = isPrompt ? colors.yellow : colors.framePurple;
  const badgeColor = isPrompt ? colors.confidentBlack : colors.white;

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: `color-mix(in srgb, ${colors.confidentBlack} 72%, transparent)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recall-example-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 100%)",
          maxHeight: "88vh",
          overflowY: "auto",
          background: colors.white,
          borderRadius: 10,
          borderTop: `4px solid ${accent}`,
          boxShadow: `0 20px 48px color-mix(in srgb, ${colors.confidentBlack} 28%, transparent)`,
          padding: "24px 28px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
          <div>
            <span
              style={{
                fontFamily: fonts.bold,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: badgeColor,
                background: isPrompt ? colors.yellow : colors.framePurple,
                borderRadius: 4,
                padding: "3px 10px",
                display: "inline-block",
                marginBottom: 10,
              }}
            >
              {isPrompt ? "Prompt" : "M365 Agent"}
            </span>
            <h3
              id="recall-example-title"
              style={{
                fontFamily: fonts.bold,
                fontSize: 22,
                color: colors.offBlack,
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {detail.name}
            </h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close example"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: colors.offWhite,
              border: `1px solid ${colors.gray02}`,
              color: colors.offBlack,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <X size={18} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        {detail.fields.map((field, i) => (
          <div key={field.label} style={{ marginBottom: i === detail.fields.length - 1 ? 0 : 20 }}>
            {i > 0 && <div style={{ height: 1, background: colors.gray02, marginBottom: 16 }} />}
            <p
              style={{
                fontFamily: fonts.bold,
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: colors.eyebrowGold,
                margin: "0 0 8px",
              }}
            >
              {field.label}
            </p>
            <p
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: colors.offBlack,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {field.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Your Use Cases — workshop buckets (Prompt / Agent / Pro Code) ─────────────
function UseCaseBucketsSection() {
  const [entries, setEntries] = useState<Record<UseCaseBucketId, string[]>>(() => readStoredUseCaseEntries());
  const [drafts, setDrafts] = useState<Record<UseCaseBucketId, string>>(EMPTY_USE_CASE_DRAFTS);

  useEffect(() => {
    writeStoredUseCaseEntries(entries);
  }, [entries]);

  const addEntry = (bucketId: UseCaseBucketId) => {
    const text = drafts[bucketId].trim();
    if (!text) return;
    setEntries((prev) => ({ ...prev, [bucketId]: [...prev[bucketId], text] }));
    setDrafts((prev) => ({ ...prev, [bucketId]: "" }));
  };

  const removeEntry = (bucketId: UseCaseBucketId, index: number) => {
    setEntries((prev) => ({
      ...prev,
      [bucketId]: prev[bucketId].filter((_, i) => i !== index),
    }));
  };

  const moveEntry = (
    fromBucket: UseCaseBucketId,
    fromIndex: number,
    toBucket: UseCaseBucketId,
    toIndex?: number,
  ) => {
    setEntries((prev) => moveUseCaseEntry(prev, fromBucket, fromIndex, toBucket, toIndex));
  };

  return (
    <section
      id="your-use-cases"
      style={{
        scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: colors.confidentBlack,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{
            fontFamily: fonts.bold,
            fontSize: typeScale.label.size,
            letterSpacing: typeScale.label.tracking,
            textTransform: "uppercase",
            color: colors.yellow,
            margin: "0 0 12px",
          }}>
            Your Use Cases
          </p>
          <h2 style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(22px, 3.5vw, 36px)",
            color: colors.onDark,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            Sort Each Idea into the Right Box
          </h2>
          <p style={{
            fontFamily: fonts.regular,
            fontSize: "clamp(13px, 1.4vw, 15px)",
            color: colors.onDarkMuted,
            margin: 0,
            lineHeight: 1.5,
            maxWidth: 680,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            Use the same Prompt, M365 Agent and Pro Code buckets from Quick Recall.
            Add tax activities from your workshop discussion — one box per lever.
            Drag an idea into another box if you change your mind.
          </p>
        </div>

        <UseCaseBucketCards
          sectionId="your-use-cases"
          entries={entries}
          editable
          drafts={drafts}
          onDraftChange={(bucketId, value) => setDrafts((prev) => ({ ...prev, [bucketId]: value }))}
          onAdd={addEntry}
          onRemove={removeEntry}
          onMove={moveEntry}
        />
      </div>
    </section>
  );
}

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


      </div>
    </section>
  );
}

// ── Workshop Library — browsable prompt template shelf ───────────────────────
function WorkshopLibrarySection() {
  return (
    <section
      id="workshop-library"
      style={{
        scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: colors.offWhite,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>
        {/* Deliverable 3 — dark header + bookshelf in one frame */}
        <div
          style={{
            background: colors.white,
            border: `1px solid ${colors.gray02}`,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
            }}
          >
            <div
              style={{
                background: colors.confidentBlack,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 0",
              }}
            >
              <span
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 56,
                  lineHeight: 1,
                  color: colors.onDark,
                  letterSpacing: "-0.04em",
                }}
              >
                03
              </span>
            </div>
            <div
              style={{
                padding: "32px 36px 16px",
                background: colors.eyBgCard,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  border: `1px solid ${colors.yellow}`,
                  borderRadius: 100,
                  padding: "3px 10px",
                  marginBottom: 14,
                  fontFamily: fonts.bold,
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: colors.yellow,
                }}
              >
                Deliverable 3
              </span>
              <h2
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 20,
                  color: colors.onDark,
                  margin: "0 0 10px",
                  lineHeight: 1.2,
                }}
              >
                Workshop Reference Library
              </h2>
              <p
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: colors.onDarkMuted,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                After the process maps and recommendation note, open a Prompt or Agent book on the shelf for worked examples.
              </p>
              <WorkshopLibraryShareActions />
            </div>
          </div>

          <div style={{ padding: "16px 16px 16px" }}>
            <PromptBookshelfLibrary />
          </div>
        </div>
      </div>
    </section>
  );
}


// ── Live Brainstorm Section ──────────────────────────────────────────────────

// ── Deliverables Section ─────────────────────────────────────────────────────

const D1_ACCENT = "#0076A8";
const D2_ACCENT = "#7B5EA7";

function DeliverablesSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <>
      <section id="deliverables" style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN, background: colors.white, padding: "80px 0 0" }}>
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
            The workshop converts validated client inputs into three practical Phase 2 deliverables.
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
            marginBottom: 0,
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

      <WorkshopLibrarySection />

      {/* What's Next — Journey Map */}
      <AscentModuleProgressSection
        moduleKey="m2"
        onNextStepCta={() => onNavigate("/guidance-implementation")}
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
  const [openExample, setOpenExample] = useState<RecallExampleDetail | null>(null);

  const cardBase: React.CSSProperties = {
    background: colors.white,
    border: `1px solid ${colors.gray02}`,
    borderRadius: 10,
    padding: "clamp(20px, 2.5vw, 32px)",
    flex: "1 0 260px",
    minWidth: 260,
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
        <div style={{ textAlign: "center", marginBottom: 32 }}>
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
          margin: 0,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}>
          Prompt or M365 Agent?
        </h2>
        </div>

        {/* Cards — single row; scroll sideways on small screens */}
        <div style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "clamp(16px, 2vw, 24px)",
          alignItems: "stretch",
          overflowX: "auto",
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

            <div style={{ height: 1, background: colors.gray02, margin: "16px 0" }} />
            <p style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.gray01, margin: "0 0 10px" }}>
              Examples
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
              {RECALL_PROMPT_EXAMPLES.map((ex) => (
                <li key={ex.name} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: colors.yellow, flexShrink: 0, marginTop: 6,
                  }} />
                  <button
                    type="button"
                    onClick={() => setOpenExample({
                      kind: "prompt",
                      name: ex.name,
                      fields: [
                        { label: "Purpose", body: ex.purpose },
                        { label: "Approach", body: ex.approach },
                        { label: "Outcome", body: ex.outcome },
                      ],
                    })}
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 13,
                      color: colors.offBlack,
                      lineHeight: 1.4,
                      background: "none",
                      border: "none",
                      padding: 0,
                      textAlign: "left",
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    {ex.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Agents card ── */}
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

              <div style={{ height: 1, background: colors.gray02, margin: "16px 0" }} />
              <p style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.gray01, margin: "0 0 10px" }}>
                Examples
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {RECALL_AGENT_EXAMPLES.map((ex) => (
                  <li key={ex.name} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: colors.framePurple, flexShrink: 0, marginTop: 6,
                    }} />
                    <button
                      type="button"
                      onClick={() => setOpenExample({
                        kind: "agent",
                        name: ex.name,
                        fields: agentRecallFields(ex),
                      })}
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: 13,
                        color: colors.offBlack,
                        lineHeight: 1.4,
                        background: "none",
                        border: "none",
                        padding: 0,
                        textAlign: "left",
                        cursor: "pointer",
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                      }}
                    >
                      {ex.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          {/* ── Pro Code card ── */}
          <div
            className="ey-recall-procode"
            style={{
              ...cardBase,
              borderTop: `3px solid ${colors.frameBlue}`,
              animation: "ey-slide-up 420ms cubic-bezier(.22,.68,0,1.05) 120ms both",
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{
                fontFamily: fonts.bold,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: colors.white,
                background: colors.frameBlue,
                borderRadius: 4,
                padding: "3px 10px",
              }}>
                Pro Code
              </span>
            </div>
            <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray01, margin: "0 0 20px", lineHeight: 1.4 }}>
              Developer-built solutions for complex, scalable tax workflows
            </p>

            <p style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.gray01, margin: "0 0 10px" }}>
              Typically useful when work requires:
            </p>
            <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
              {PROCODE_TASKS.map((task) => (
                <li key={task} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: colors.frameBlue, flexShrink: 0, marginTop: 6,
                  }} />
                  <span style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.offBlack, lineHeight: 1.4 }}>{task}</span>
                </li>
              ))}
            </ul>

            <div style={{ height: 1, background: colors.gray02, margin: "0 0 16px" }} />

            <p style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.gray01, margin: "0 0 10px" }}>
              The solution
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
              {PROCODE_ROLE.map((role) => (
                <li key={role} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: colors.frameBlue, flexShrink: 0, marginTop: 6,
                  }} />
                  <span style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.offBlack, lineHeight: 1.4 }}>{role}</span>
                </li>
              ))}
            </ul>

            <div style={{ height: 1, background: colors.gray02, margin: "16px 0" }} />
            <p style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.gray01, margin: "0 0 10px" }}>
              Examples
            </p>
            <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray01, margin: 0, lineHeight: 1.4 }}>
              Examples will be added later.
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 32,
          display: "flex",
          alignItems: "center",
          gap: 16,
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
      </div>
      {openExample && (
        <RecallExampleModal detail={openExample} onClose={() => setOpenExample(null)} />
      )}
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

// ── Hero context — FROM→TO (separated from dark hero per pattern) ─────────────
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
      className="relative bg-white content-stretch flex flex-col items-stretch w-full max-w-full min-w-0"
      data-name="EY.ai Tax Labs - Phase 2"
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

      {/* ── Main content ── */}
      <main id="phase2-content">

        <HeroSection />

        <HeroContextSection />

        <QuickRecallSection />

        <ProblemFirstSection />

        {/* Guided Examples carousel hidden for now — Prompt details live in Quick Recall modals. */}

        <UseCaseBucketsSection />

        <DeliverablesSection onNavigate={onNavigate} />

      </main>
    </div>
  );
}
