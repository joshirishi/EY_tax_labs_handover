/**
 * Shared end-of-module Ascent trek — Priya trek callouts + completion quotes.
 * Hub defaults live in AscentJourneyInfographic; this builds per-module progress.
 */

import AscentJourneyInfographic, {
  type AscentCalloutEntry,
  type AscentOverrides,
  type AscentStageNodeEntry,
  type AscentStageTitleEntry,
} from "./AscentJourneyInfographic";
import { SUBNAV_SCROLL_MARGIN } from "@/design-kit/LearningNav";
import { colors } from "@/design-kit";

export type AscentModuleKey = "m1_1" | "m1_2" | "m1_3" | "m2" | "m3" | "m4";

export const MODULE_COMPLETION_QUOTES: Record<AscentModuleKey, string> = {
  m1_1: "I am confident in the foundational concepts of AI and ready to reimagine tax with AI-powered ways of working.",
  m1_2: "I understand prompt elements and techniques and can effectively communicate with AI.",
  m1_3: "I understand M365 Copilot Chat and Agents and can use them to work smarter and faster.",
  m2: "I can now identify AI opportunities in tax workflows and know when to use prompts or agents.",
  m3: "I can confidently design prompts and Agents to solve business and tax challenges.",
  m4: "I can use AI responsibly while ensuring compliance and governance.",
};

const STARTER_QUOTE = "Everyone is talking about AI, but I don't know where to start.";

/** Hub landing (#phased-content) — Priya trek-stage quotes (boxes 1–4); boxes 5+ use completion quotes. */
const HUB_TREK_CALLOUTS: readonly string[] = [
  STARTER_QUOTE,
  "I understand AI concepts which can help me work towards atleast 20%++ efficiency gains.",
  "I have reimagined atleast 5-7 tax use cases via prompts and/or M365 Agents.",
  "I have built 10 no-code agents assisting me in my day-to-day Tax workshops",
];

const SUMMIT_DEFAULT =
  "I am an AI-enabled tax professional. I can confidently and responsibly use AI across the tax lifecycle to deliver greater value.";

/** Furthest open callout index (0 = module 1.1 … 6 = summit). */
const OPEN_THROUGH: Record<AscentModuleKey, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
  m1_1: 0,
  m1_2: 1,
  m1_3: 2,
  m2: 3,
  m3: 4,
  m4: 6,
};

const CALLOUT_LAYOUT = [
  { left: 140, top: 250, width: 149 },
  { left: 305, top: 188, width: 175 },
  { left: 498, top: 115, width: 165 },
  { left: 685, top: 95, width: 145 },
  { left: 848, top: 125, width: 125 },
  { left: 1170, top: 298, width: 228, pin: true as const },
  {
    left: 1188,
    top: 0,
    width: 300,
    pin: true as const,
    rounded: 4 as const,
    highlights: ["I am an AI-enabled tax professional", "AI across the tax lifecycle"] as const,
  },
] as const;

const CURRICULUM_STAGE_NODES: readonly AscentStageNodeEntry[] = [
  { left: 359, top: 295, icon: "/ascent/icon-search.svg", alt: "Laying the Foundation" },
  { left: 554, top: 260, icon: "/ascent/icon-cpu.svg", alt: "Discovering Opportunities" },
  { left: 769, top: 240, icon: "/ascent/icon-trending-up.svg", alt: "Building Solutions" },
  { left: 1018, top: 227, icon: "/ascent/icon-shield-embedding.svg", alt: "Embedding Confidence" },
  { left: 1164, top: 202, icon: "/ascent/icon-cpu.svg", alt: "Responsible Adoption" },
  { left: 1221, top: 94, icon: "/ascent/icon-peak-performance.svg", alt: "Peak Performance", iconFill: true },
];

const CURRICULUM_STAGE_TITLES: readonly AscentStageTitleEntry[] = [
  { title: "Base Camp", markerTop: 366, markerSize: 46, calloutIndex: 0 },
  { title: "Laying the Foundation", markerTop: 295, markerSize: 40, calloutIndex: 1 },
  { title: "Discovering Opportunities", markerTop: 260, markerSize: 40, calloutIndex: 2 },
  { title: "Building Solutions", markerTop: 240, markerSize: 40, calloutIndex: 3 },
  { title: "Embedding Confidence", markerTop: 227, markerSize: 40, calloutIndex: 4, labelLeft: 978, labelWidth: 120 },
  { title: "Responsible Adoption", markerTop: 202, markerSize: 40, calloutIndex: 5, labelLeft: 1132, labelTop: 250, labelWidth: 120 },
  { title: "Peak Performance", markerTop: 94, markerSize: 40, calloutIndex: 6, labelLeft: 1310, labelTop: 98, labelWidth: 105 },
];

/** Module-end / progress trek — confident completion quotes per marker. */
function quoteForIndex(index: number): string {
  if (index === 0) return MODULE_COMPLETION_QUOTES.m1_1;
  if (index === 1) return MODULE_COMPLETION_QUOTES.m1_2;
  if (index === 2) return MODULE_COMPLETION_QUOTES.m1_3;
  if (index === 3) return MODULE_COMPLETION_QUOTES.m2;
  if (index === 4) return MODULE_COMPLETION_QUOTES.m3;
  if (index === 5) return MODULE_COMPLETION_QUOTES.m4;
  return SUMMIT_DEFAULT;
}

function buildCallouts(): readonly AscentCalloutEntry[] {
  return CALLOUT_LAYOUT.map((layout, index) => ({
    ...layout,
    quote: quoteForIndex(index),
  }));
}

export type ModuleProgressOptions = {
  /** @deprecated Prefer nextStepCta — Base Camp should not navigate. */
  onBaseCampCta?: () => void;
  lastNodeCtaLabel?: string;
  onLastNodeCta?: () => void;
  /** Yellow continue button on the next trek step */
  nextStepCtaLabel?: string;
  onNextStepCta?: () => void;
};

const DEFAULT_NEXT_STEP: Record<AscentModuleKey, string> = {
  m1_1: "AI Tax Prompting",
  m1_2: "M365 Copilot Hub",
  m1_3: "Brainstorming Use Cases",
  m2: "Guidance for Implementation",
  m3: "Closure & AI Reinforcement",
  m4: "Control Room",
};

/** Hub landing (/phased) — base camp open; no next-step pill (module-end treks keep it). */
export function buildHubLandingProps(): AscentOverrides {
  const callouts = buildCallouts();
  return {
    callouts: callouts.map((callout, index) => ({
      ...callout,
      quote:
        index < HUB_TREK_CALLOUTS.length ? HUB_TREK_CALLOUTS[index]! : callout.quote,
    })),
    stageNodes: CURRICULUM_STAGE_NODES,
    stageTitleLabels: CURRICULUM_STAGE_TITLES,
    defaultOpenCallouts: [0],
  };
}

/** Props for AscentJourneyInfographic for a completed module. */
export function buildModuleProgressProps(
  moduleKey: AscentModuleKey,
  options: ModuleProgressOptions = {},
): AscentOverrides {
  const through = OPEN_THROUGH[moduleKey];
  const defaultOpenCallouts = Array.from({ length: through + 1 }, (_, i) => i) as AscentOverrides["defaultOpenCallouts"];

  const nextStepCtaLabel = options.nextStepCtaLabel ?? DEFAULT_NEXT_STEP[moduleKey];
  // Accept legacy onBaseCampCta / onLastNodeCta as the continue handler
  const onNextStepCta =
    options.onNextStepCta ?? options.onLastNodeCta ?? options.onBaseCampCta;

  return {
    callouts: buildCallouts(),
    stageNodes: CURRICULUM_STAGE_NODES,
    stageTitleLabels: CURRICULUM_STAGE_TITLES,
    defaultOpenCallouts,
    progressThrough: through,
    // Base Camp stays a marker only — continue lives on the next trek step
    onBaseCampCta: undefined,
    nextStepCtaLabel: onNextStepCta ? nextStepCtaLabel : undefined,
    onNextStepCta,
    lastNodeCtaLabel: undefined,
    onLastNodeCta: undefined,
  };
}

/** Dark section wrapping the shared Ascent trek (no progress heading). */
export function AscentModuleProgressSection({
  moduleKey,
  id = "journey-progress",
  onBaseCampCta: _onBaseCampCta,
  lastNodeCtaLabel,
  onLastNodeCta,
  nextStepCtaLabel,
  onNextStepCta,
}: {
  moduleKey: AscentModuleKey;
  id?: string;
  /** Ignored — continue CTA is on the next trek step. Kept for call-site compat. */
  onBaseCampCta?: () => void;
  lastNodeCtaLabel?: string;
  onLastNodeCta?: () => void;
  nextStepCtaLabel?: string;
  onNextStepCta?: () => void;
}) {
  const infographicProps = buildModuleProgressProps(moduleKey, {
    onBaseCampCta: _onBaseCampCta,
    lastNodeCtaLabel,
    onLastNodeCta,
    nextStepCtaLabel,
    onNextStepCta,
  });

  return (
    <section
      id={id}
      aria-label="Ascent journey"
      style={{
        background: colors.confidentBlack,
        width: "100%",
        scrollMarginTop: SUBNAV_SCROLL_MARGIN,
      }}
    >
      <AscentJourneyInfographic {...infographicProps} />
    </section>
  );
}
