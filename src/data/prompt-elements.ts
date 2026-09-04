import { colors as C } from "../design-kit/tokens";

export type PromptElement = {
  id: number;
  name: string;
  color: string;
  border: string;
  q: string;
  what: string;
  why: string;
  without: string;
  with: string;
};

export type ElemPanelKey = "what" | "why" | "without" | "with";

export const ELEM_FACETS: { key: ElemPanelKey; label: string; color: string }[] = [
  { key: "what", label: "What it is", color: C.frameBlue },
  { key: "why", label: "Why it matters", color: C.frameOrange },
  { key: "without", label: "Without", color: C.destructive },
  { key: "with", label: "With", color: C.success },
];

export const ELEMENTS: PromptElement[] = [
  { id: 1, name: "Persona", color: C.frameMagenta, border: C.frameMagenta, q: "WHO should AI be?",
    what: "Defines who the AI should act like — setting its expertise, seniority, and perspective. A tax partner writes differently from a junior analyst.",
    why: "Aligns output to the expertise level you need. Without it, AI defaults to a generic voice that doesn't match your audience.",
    without: '"Explain impact of New Tax Act on MNCs."',
    with: '"You are a senior tax partner in India. Explain impact of withholding tax changes in the New Income Tax Act, 2025 on MNCs."',
  },
  { id: 2, name: "Context", color: C.frameTeal, border: C.frameTeal, q: "WHAT's the background?",
    what: "Background information for the task — the who, what, where, and when surrounding your query.",
    why: "Without context, AI gives generic answers that miss your specific situation entirely.",
    without: '"Explain recent changes to transfer pricing regulations."',
    with: '"Our client in India provides IT support to its parent in Singapore. Explain recent TP Regulation changes in 2025."',
  },
  { id: 3, name: "Instruction", color: C.yellow, border: C.yellow, q: "WHAT should AI do?",
    what: "A clear task or command — the specific action you want AI to perform. No ambiguity.",
    why: 'Define what "significant" or "recent" means — don\'t leave it to AI to guess.',
    without: '"Summarise significant recent tax exposures of the Indian target company"',
    with: '"Summarise tax exposures above INR 25 crore, under dispute in the last 3 assessment years."',
  },
  { id: 4, name: "Constraints & Boundaries", color: C.frameBlue, border: C.frameBlue, q: "WHAT are the limits?",
    what: "Setting limits on scope, detail, or length — guardrails that keep AI focused.",
    why: "Without limits, AI may produce 2000 words when you needed 200.",
    without: '"Summarise GST refund changes."',
    with: '"In under 200 words, summarise July 2025 GST refund changes for exporters."',
  },
  { id: 5, name: "Grounding / Source Anchoring", color: C.framePurple, border: C.framePurple, q: "WHERE should AI look?",
    what: "Instructing AI to use specific statutes, circulars, or case law as its reference base.",
    why: "Prevents hallucination and ensures legal accuracy. Ungrounded output is dangerous output.",
    without: '"Explain safe harbour rules."',
    with: '"According to the Income-tax Act, 1961 and latest CBDT circulars, explain safe harbour applicability to cross-border service fees."',
  },
  { id: 6, name: "Tone / Style", color: C.yellow, border: C.yellow, q: "HOW should it sound?",
    what: "Directing AI to adopt a formal, client-ready, or simplified style matching your audience.",
    why: "A CFO needs different language than an internal audit team or ITAT bench.",
    without: '"Draft an email to the client regarding new GST slab rates"',
    with: '"Explain new GST slab changes in formal and concise manner, suitable for Tax Head of a Logistics company"',
  },
  { id: 7, name: "Output Format", color: C.frameGreen, border: C.frameGreen, q: "WHAT shape should the answer take?",
    what: "Specifies desired format — table, bullets, email, memo, comparison chart, etc.",
    why: "Output is immediately usable without reformatting — saves editing time.",
    without: '"Compare old vs new tax rates."',
    with: '"Provide a table comparing old vs new tax rates, followed by 3 bullet-point risks and recommendations."',
  },
];
