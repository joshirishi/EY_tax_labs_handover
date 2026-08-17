import { colors as C } from "../design-kit/tokens";

export const TECHNIQUE_COLORS = [
  C.frameMagenta,
  C.frameTeal,
  C.yellow,
  C.frameBlue,
  C.framePurple,
  C.frameGreen,
  C.frameOrange,
  C.frameLime,
] as const;

export type PromptingTechnique = {
  id: number;
  color: string;
  technique: string;
  what: string;
  does: string;
  without: string;
  with: string;
};

export const PROMPTING_TECHNIQUES: PromptingTechnique[] = [
  {
    id: 1,
    color: TECHNIQUE_COLORS[0],
    technique: "Audience Prompting",
    what: "Telling AI who the output is intended for.",
    does: "Adjusts language, depth and terminology for the reader.",
    without: '"Explain POEM provisions."',
    with: '"Explain POEM provisions for a CEO with no tax background using simple business language and examples."',
  },
  {
    id: 2,
    color: TECHNIQUE_COLORS[1],
    technique: "Zero-Shot / Few-Shot Prompting",
    what: "Providing no examples (Zero-Shot) or sample examples (Few-Shot).",
    does: "Guides the format and quality of the response.",
    without: '"Summarize this tax judgment."',
    with: '"Example Format: Issue → Taxpayer Argument → Revenue Argument → Decision → Key Takeaway. Now summarize this judgment using the same format."',
  },
  {
    id: 3,
    color: TECHNIQUE_COLORS[2],
    technique: "Iterative Prompting",
    what: "Improving the output through a series of follow-up prompts.",
    does: "Refines the response step by step until it meets your needs.",
    without: '"Draft a note on GST implications."',
    with: '"Draft a note on GST implications." → "Make it user-friendly." → "Reduce it to one page." → "Add a summary table."',
  },
  {
    id: 4,
    color: TECHNIQUE_COLORS[3],
    technique: "Flipped Prompting",
    what: "Asking AI to ask questions before answering.",
    does: "Helps gather missing context and improve accuracy.",
    without: '"Prepare a tax advisory note on this transaction."',
    with: '"Before preparing the advisory note, ask me all relevant questions regarding the transaction, jurisdictions, parties, objectives and timeline."',
  },
  {
    id: 5,
    color: TECHNIQUE_COLORS[4],
    technique: "Chain-of-Thought Prompting",
    what: "Asking AI to reason through a problem step by step.",
    does: "Improves structured thinking and analysis.",
    without: '"Does this arrangement create a Permanent Establishment risk?"',
    with: '"Assess this arrangement step-by-step: identify key facts, evaluate PE indicators, analyze supporting and opposing arguments, then conclude."',
  },
  {
    id: 6,
    color: TECHNIQUE_COLORS[5],
    technique: "Creative Expansion Prompting",
    what: "Asking AI to challenge assumptions and identify gaps.",
    does: "Generates additional perspectives and uncovers blind spots.",
    without: '"Review this restructuring proposal."',
    with: '"Review this restructuring proposal and identify 10 risks, unanswered questions or issues the team may have overlooked."',
  },
  {
    id: 7,
    color: TECHNIQUE_COLORS[6],
    technique: "Refinement Prompting",
    what: "Asking AI to improve your question before attempting the task.",
    does: "Helps identify gaps and creates a stronger, more effective prompt.",
    without: '"Summarize the GST implications of this transaction."',
    with: '"Review my prompt and suggest a better version before answering. Highlight any missing context, assumptions or instructions that would improve the quality of the response."',
  },
  {
    id: 8,
    color: TECHNIQUE_COLORS[7],
    technique: "Meta Prompting",
    what: "Asking AI to create or improve the prompt itself.",
    does: "Combines multiple prompting techniques and helps build stronger prompts.",
    without: '"Summarize this judgment."',
    with: '"Create the most effective prompt for summarizing a Supreme Court tax judgment for a Tax Partner. Incorporate persona, audience, format and key takeaway requirements."',
  },
];

export type TechniqueFacetKey = "what" | "does" | "without" | "with";

export const TECHNIQUE_FACETS: { key: TechniqueFacetKey; label: string; color: string }[] = [
  { key: "what", label: "What it is", color: C.frameBlue },
  { key: "does", label: "What it does", color: C.frameOrange },
  { key: "without", label: "Without the Technique", color: C.destructive },
  { key: "with", label: "With the Technique", color: C.success },
];
