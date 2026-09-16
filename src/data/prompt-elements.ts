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
    what: "Defines who the AI should act like.",
    why: "Aligns the output to the required expertise.",
    without: '"Explain the tax implications of cross-border services."',
    with: '"You are an experienced international tax manager. Explain the tax implications of cross-border IT support services received by an Indian company from its overseas group entity."',
  },
  { id: 2, name: "Context", color: C.frameTeal, border: C.frameTeal, q: "WHAT's the background?",
    what: "Provides background information for the task.",
    why: "Ensures a relevant and tailored output.",
    without: '"Summarise recent transfer pricing changes."',
    with: '"An Indian captive centre provides software development services exclusively to its US parent company. Summarise recent transfer pricing developments that could affect its documentation and benchmarking requirements."',
  },
  { id: 3, name: "Instruction", color: C.yellow, border: C.yellow, q: "WHAT should AI do?",
    what: "Gives AI a clear task or command.",
    why: "Reduces ambiguity and improves response quality.",
    without: '"Review these tax audit observations."',
    with: '"Identify observations that could create additional tax exposure, categorise them by tax type, and list the follow-up actions required from the tax team."',
  },
  { id: 4, name: "Constraints & Boundaries", color: C.frameBlue, border: C.frameBlue, q: "WHAT are the limits?",
    what: "Sets limits on scope, detail, or length.",
    why: "Keeps the answer focused and avoids overload.",
    without: '"Summarise recent GST updates."',
    with: '"In no more than 150 words, summarise GST developments from the last quarter that could affect input tax credit claims. Exclude procedural updates."',
  },
  { id: 5, name: "Grounding / Source Anchoring", color: C.framePurple, border: C.framePurple, q: "WHERE should AI look?",
    what: "Instructs AI to use specified statutes, circulars, or case law.",
    why: "Prevents hallucination and supports legal accuracy.",
    without: '"Explain the tax treatment of employee secondment arrangements."',
    with: '"Using only the Income-tax Act, 1961, the CBDT circulars and the judicial decisions provided, explain the tax considerations for employee secondment arrangements. Cite the source supporting each conclusion."',
  },
  { id: 6, name: "Tone / Style", color: C.yellow, border: C.yellow, q: "HOW should it sound?",
    what: "Directs AI to adopt a formal, concise, or simplified style.",
    why: "Ensures the output fits audience expectations.",
    without: '"Explain the new TDS provisions."',
    with: '"Explain the new TDS provisions in plain business language. Keep the tone formal and concise, and avoid technical jargon wherever possible."',
  },
  { id: 7, name: "Output Format", color: C.frameGreen, border: C.frameGreen, q: "WHAT shape should the answer take?",
    what: "Specifies the desired format or type of output.",
    why: "Helps structure the response.",
    without: '"Compare the old and new depreciation rates."',
    with: '"Present a table comparing the old and new depreciation rates, with separate columns for the asset category, earlier rate, revised rate, and impact on the tax computation."',
  },
];
