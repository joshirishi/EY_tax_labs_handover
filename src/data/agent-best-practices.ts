/**
 * Agent instruction elements + techniques — from
 * reference/assets/"Agent Best Practices mailer content 2.xlsx"
 * (sheets: Agent best practices, Common failures, Pattern Summary, Summary).
 */

export type AgentExampleBlock = {
  tone: "bad" | "good" | "neutral";
  label?: string;
  lines: readonly string[];
};

export type AgentBestPracticeSlide = {
  n: string;
  heading: string;
  sub: string;
  content: readonly string[];
  weak: string;
  strong: string;
  examples: readonly AgentExampleBlock[];
  /** Practice 10 uses three reasoning styles instead of weak/strong. */
  reasoningLevels?: readonly { label: string; text: string }[];
};

export type AgentFailureItem = {
  n: string;
  title: string;
  whatHappens: string;
  fix: string;
  example: string;
};

/** Source: reference/assets/Agent Best Practices mailer content 2.xlsx — Pattern Summary sheet. */
export type AgentTechniqueItem = {
  n: string;
  name: string;
  summary: string;
  taxExample: string;
  /** Pattern Summary sheet column D. */
  whenToUse: string;
};

const WHEN_TO_USE_LABEL = /^(to:?|to prevent\s*:?|to follow:?|to encourage the agent to:?)$/i;

/** Column D → scan bullets. Drops “To:” / “To prevent:” labels. */
export function parseWhenToUse(raw: string): string[] {
  return raw
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => !WHEN_TO_USE_LABEL.test(line))
    .map(line => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function exampleLines(text: string): string[] {
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.replace(/^[-•]\s*/, "").replace(/^\d+\.[\s\t]*/, "").trim())
    .filter(Boolean);
}

/** Pattern Summary column B → headline question + supporting body. */
export function parseSummaryParts(summary: string): { headline: string; body: string } {
  const parts = summary.split("\n").map(line => line.trim()).filter(Boolean);
  return { headline: parts[0] ?? "", body: parts.slice(1).join(" ") };
}

/** Pattern Summary column C → text shown in the Agent Builder Instructions preview. */
export function formatTechniqueInstructionPreview(raw: string): string {
  const { dont, doLines } = parseTaxExample(raw);
  if (dont && doLines.length > 0) {
    const steps = doLines.map((line, i) => `${i + 1}. ${line}`).join("\n");
    return `${dont}\n${steps}`;
  }
  return raw.trim().replace(/\t/g, " ");
}

/** Column C → Don’t (weak one-liner) + Do (copyable steps). */
export function parseTaxExample(raw: string): { dont?: string; doLines: string[] } {
  const instead = raw.match(/Instead of writing:\s*([\s\S]*?)\s*Try:\s*([\s\S]*)/i);
  if (instead) {
    return { dont: instead[1].trim(), doLines: exampleLines(instead[2]) };
  }
  const rather = raw.match(/^([\s\S]+?)\n\s*Rather than\s+(.+)$/i);
  if (rather) {
    return {
      dont: rather[2].trim().replace(/\.$/, ""),
      doLines: exampleLines(rather[1].replace(/^Structure your instructions as:\s*/i, "")),
    };
  }
  return { doLines: exampleLines(raw) };
}

function practice(
  n: string,
  heading: string,
  sub: string,
  content: readonly string[],
  weak: string,
  strong: string,
): AgentBestPracticeSlide {
  return {
    n,
    heading,
    sub,
    content,
    weak,
    strong,
    examples: [
      { tone: "bad", label: "Weak instruction", lines: [weak] },
      { tone: "good", label: "Strong instruction", lines: [strong] },
    ],
  };
}

export const AGENT_BEST_PRACTICES_SLIDES: readonly AgentBestPracticeSlide[] = [
  practice(
    "01",
    "Use Clear, Actionable Language",
    "Minimise Telling Copilot Agent What NOT To Do. Just tell It What TO Do.",
    [
      "Use clear verbs like Ask, Search, Check, Use, Send",
      "Supplement with examples to minimize ambiguity",
      "Define terms that are nonstandard or unique",
    ],
    "Do not overlook differences between the trial balance and tax computation.",
    "Compare the trial balance with the tax computation. List each difference, quantify the variance, and classify it as temporary or permanent.",
  ),
  practice(
    "02",
    "Build Step-by-Step Workflows with transitions",
    "Confused Agents Follow Confused Instructions.",
    [
      "Break every workflow into modular, unambiguous, nonconflicting steps",
      "Every workflow should have a Goal, an Action, and a Transition",
    ],
    "Review the current year related party disclosures, compare them with the prior-year AE list and prepare observations.",
    "Step 1: Extract current-year AE and reportable transactions.\nStep 2: Compare them with the prior-year AE list.\nStep 3: Flag additions, deletions and transaction changes.\nStep 4: Use flagged items to prepare observation summary.\nTransition: Proceed to next step after current step. End workflow after summary.",
  ),
  practice(
    "03",
    "Use strict structure",
    "Great Results Start with Great Structure",
    [
      "Use sections to group related tasks into categories — instead of implying sequence",
      "Use bullets for parallel tasks — instead of numbers, to avoid an unintended order",
      "Use steps for sequential workflows",
    ],
    "Extract details from the FIRCs and prepare a summary table.",
    "Documents to Review\n• All pages of the attached FIRC file\n\nFields to Extract\n• Event date\n• Company name\n• FIRC number\n• Foreign currency and amount\n• Exchange rate\n• Amount in INR\n\nSteps\nStep 1: Extract the specified fields from each FIRC.\nStep 2: Validate that no page is skipped.\nStep 3: Consolidate the results into one table.",
  ),
  practice(
    "04",
    "Make tasks atomic",
    "Reduce ambiguity. Prevent reinterpretation.",
    [
      "Guide your agent through the same logical path you would follow",
      "Review the facts",
      "Identify the issues",
      "Analyze the impact",
      "Recommend the next steps",
    ],
    "Review the shareholder agreement, identify tax clauses, analyze withholding tax and GST implications, and recommend changes.",
    "• Review the agreement and key payment terms.\n• Extract clauses dealing with taxes, withholding, invoicing.\n• Analyze potential TDS, GST and compliance implications.\n• Recommend clause-specific actions and required supporting documents.",
  ),
  practice(
    "05",
    "Always specify tone, verbosity, and output format",
    "If You Don't Specify It, Copilot Will Guess.",
    ["Always define tone, detail level, and output format"],
    "Prepare a tax leadership update.",
    "Prepare a tax leadership update covering compliance status, auditor comments, legislative developments and pending risks.\nTone: Executive and professional\nDetail level: Concise, with only decision-relevant information\nOutput format: One-page summary with sections for Key Updates, Risks, Decisions Required and Next Steps",
  ),
  practice(
    "06",
    "Structure instructions in Markdown",
    "Provide emphasis and clarity on the order",
    [
      "Use #, ##, and ### for section headers",
      "Use bullet '-' where sequence is unimportant",
      "Use numbered lists where order is important",
      "Make critical instructions bold by using **",
      "Maintain consistency. Avoid unintended interpretation.",
    ],
    "Review the judicial precedent and explain its implications for the tax fact pattern.",
    "# Judicial Precedent Analysis\n## Information to Extract\n• Relevant facts of the case\n• Tax issue considered by the court\n• Key findings of the court\n• Tax provisions and treaty articles discussed\n\n## Required Output\n1. Summary of the precedent\n2. Key legal principles\n3. Implications for the tax fact pattern\n\n**Do not assume facts that are not contained in the judgment**",
  ),
  practice(
    "07",
    "Provide domain vocabulary",
    "Teach Your Agent Your Language",
    [
      "Never assume Copilot knows your acronyms.",
      "Define acronyms, tax terms, internal terms, and specialized formulas",
    ],
    "Review the FAR and identify changes in the TP position.",
    "Definitions\n• FAR = Functions, Assets and Risks\n• AE = Associated Enterprise\n• TP = Transfer Pricing\n• ALP = Arm's Length Price\n• Tested party = Entity whose margins are benchmarked\n\nInstruction\n1. Review the current-year FAR profile\n2. Compare it with the prior-year TP report\n3. Summarize changes that may affect characterization or benchmarking.",
  ),
  practice(
    "08",
    "Explicitly reference capabilities, knowledge, and actions",
    "Tell Copilot Where To Look",
    [
      "Search Teams",
      "Check emails",
      "Use SharePoint knowledge",
      "Use OneDrive documents",
    ],
    "Collect supporting evidence for the assessment.",
    "• Search Outlook for notices, submissions and correspondence relating to the assessment year.\n• Search Teams for discussions and agreed action items.\n• Search SharePoint and OneDrive for invoices, agreements, prior submissions and supporting workings.\n• Organize the evidence by issue and identify missing documents.",
  ),
  practice(
    "09",
    "Provide examples",
    "Examples Are Superpowers",
    [
      "Don't just describe it. Show it.",
      "Provide examples for complex scenarios",
      "Remove ambiguity and help your agent replicate the outcome you expect",
    ],
    "Draft a request for documents required for a GST refund claim.",
    "Use the following style:\n\nStandard request: “Please share the FIRC register, export invoices and supporting reconciliation for the refund period.”\n\nMissing-document follow-up: “The FIRC for Invoice 125 is not available in the shared folder. Please provide the document or confirm its status.”\n\nNow draft a professional email requesting the outstanding GST refund documents, using a subject line and bullet-point list.",
  ),
  {
    ...practice(
      "10",
      "Control reasoning through phrasing",
      "Not Every Task Needs Deep Thinking.",
      [
        "Deep reasoning: use analyze, derive, evaluate; add justify, think step by step, reflect, verify logic; structure dependent steps",
        "Moderate reasoning: ask for a concise but structured explanation; prefer constraints over meta-reasoning cues",
        "Fast and minimal reasoning: short answers, no explanation, final result only",
      ],
      "",
      "",
    ),
    reasoningLevels: [
      {
        label: "Deep reasoning",
        text: "Analyze the current-quarter advance tax computation against the prior quarter. Evaluate changes in assumptions, forecast movements and tax adjustments. Justify the drivers of material variances and recommend follow-up actions.",
      },
      {
        label: "Moderate reasoning",
        text: "Summarize the key quarter-on-quarter movements in the advance tax computation and list the main reasons for the changes.",
      },
      {
        label: "Fast and minimal reasoning",
        text: "Provide the list of reasons for changes in the advance tax computation.",
      },
    ],
  },
];

export const AGENT_COMMON_FAILURES: readonly AgentFailureItem[] = [
  {
    n: "01",
    title: "Overeager Tool Use",
    whatHappens: "AI starts the task without complete information.",
    fix: "Specify that tools should only be used when sufficient information is available.",
    example: "Search Outlook for relevant emails containing notices, submissions and correspondence relating to AY 2025-26. If not available, ask the user.",
  },
  {
    n: "02",
    title: "Repetitive phrasing",
    whatHappens: "AI repeats the same phrases or examples.",
    fix: "Encourage variation and provide multiple examples.",
    example: "Draft an email requesting missing tax documents.\nUse varied professional language and avoid repeating the same opening or closing statements.\n\nExamples of opening:\n\"Please share the following documents required for the assessment proceedings.\"\n\"Below is a list of documents required for the assessment proceedings. Please collate and circulate to our team\"",
  },
  {
    n: "03",
    title: "Verbose Output",
    whatHappens: "Responses seem overexplained or excessively formatted.",
    fix: "Define length, format and brevity expectations.",
    example: "Summarize the GST audit observations.\nRequirements:\n• Maximum 5 bullet points\n• One line per observation\n• Mention only the issue and impact\n• Do not include detailed explanations unless specifically requested",
  },
  {
    n: "04",
    title: "Missing Self-Validation",
    whatHappens: "AI may skip requirements, miss key points, or generate incomplete results.",
    fix: "Add a self-check step before finalizing the response, to reinforce completeness and alignment with your instructions.",
    example: "Before finalising the transfer pricing report summary, ensure you have reviewed instructions pertaining to:\n• Functional changes\n• Transaction changes\n• Benchmarking updates",
  },
  {
    n: "05",
    title: "Inference Drift",
    whatHappens: "AI starts making assumptions or reordering steps differently than intended.",
    fix: "Use a stabilizing header instructing the model to follow instructions literally.",
    example: "# Follow Instructions Literally\nAnalyze only the information explicitly stated in the tax audit report.\nDo not assume transactions, tax exposures or risks that are not mentioned in the report.",
  },
  {
    n: "06",
    title: "One-and-Done Prompting",
    whatHappens: "Prompt quality stagnates and outputs remain inconsistent over time.",
    fix: "Continuously test, refine, and iterate on instructions.",
    example: "Test and verify if the agent is working as expected and the outputs are adding value.\nUpdate from time-to-time:\n• reference knowledge sources\n• Instructions and examples (few-shot)",
  },
];

export const AGENT_TECHNIQUE_PATTERNS: readonly AgentTechniqueItem[] = [
  {
    n: "01",
    name: "Convert ambiguous multitask requests into deterministic workflows",
    summary: "Are you leaving Copilot to guess what to do next?\nStructured instructions help Copilot follow the intended workflow and deliver reliable outputs, resulting in more predictable outcomes.",
    taxExample: "Instead of writing:\nCalculate the tax impact.\nTry:\n1. Identify taxable income.\n2. Determine the applicable tax regime.\n3. Calculate tax liability.\n4. Present the outcome in a table.",
    whenToUse: "To:\n - remove ambiguity\n - ensure stable repeatable behavious\n",
  },
  {
    n: "02",
    name: "Correct Parallel vs Sequential Structure",
    summary: "Are all your instructions meant to happen in the same order?\nSome tasks can run independently, while others depend on prior outputs. Clearly separating parallel and sequential steps helps Copilot execute workflows as intended.",
    taxExample: "Parallel steps — for tax research:\n• Extract relevant provisions from the Income-tax Act.\n• Identify applicable judicial precedents.\n• Gather relevant CBDT circulars.\n\nSequential steps — for summarizing:\n1. Explain the provisions under the Act.\n2. List the judicial precedents applicable.\n3. Provide references to the CBDT circulars.",
    whenToUse: "To:\n - separate parallel and sequential logic\n - ensure workflows are run without adding or reordering steps\n",
  },
  {
    n: "03",
    name: "Explicit Decision Rules",
    summary: "Have you told Copilot what to do when conditions change?\nCopilot performs more consistently when decisions are defined using clear if/then rules instead of leaving them open to interpretation.",
    taxExample: "• If no judicial precedent exists, then rely on statutory provisions.\n• If conflicting precedents exist, then present the favorable view.\n• If a key fact is missing, then seek clarification before proceeding.",
    whenToUse: "To:\n - prevent unintended model interpretation\n - enforce deterministic outcomes\n - to prevent agent  resolving ambiguous conditional logic on its own",
  },
  {
    n: "04",
    name: "Output Contract",
    summary: "Are you defining the output or hoping for the best?\nClearly specifying the required format, level of detail, and content helps Copilot produce outputs that meet expectations from the start.",
    taxExample: "Instead of writing:\nSummarize this litigation matter.\n\nTry:\nPrepare a 1-page brief covering facts, issue, tax position, risks, and supporting precedents. Exclude recommendations.",
    whenToUse: "To prevent :\n - overly long responses\n - overly terse responses\n To follow:\n - precise format\n - specified level of detail\n - specific template\n - process requiring consistent formatting ",
  },
  {
    n: "05",
    name: "Clean Markdown Structure",
    summary: "Is Copilot missing steps or merging tasks unexpectedly?\nWell-structured instructions with clear headings, sections, and steps are easier for Copilot to interpret and follow accurately.",
    taxExample: "Structure your instructions as:\n• Data Collection\n• Analysis\n• Conclusions\n• Output Format\n\nRather than providing everything in a single paragraph.",
    whenToUse: "To prevent:\n - merged steps\n - unintended hierarchy\n - collapsed sections",
  },
  {
    n: "06",
    name: "Self-Evaluation Gate",
    summary: "Have you asked Copilot to review its own work?\nAdding a self-check step encourages Copilot to verify completeness, identify gaps, and improve response quality before delivering the final output.",
    taxExample: "Before finalizing a tax position, ask Copilot to confirm:\n• All issues have been addressed.\n• Relevant provisions have been referenced.\n• Assumptions are clearly identified.\n• No requested section is missing.",
    whenToUse: "To encourage the agent to:\n - validate completeness\n - verify alignment with instructions\n - correct omissions before responding",
  },
  {
    n: "07",
    name: "Steering Auto mode Reasoning",
    summary: "Does every task really need deep analysis?\nDifferent tasks require different levels of reasoning. Telling Copilot how much thinking a task requires helps balance speed and quality.",
    taxExample: "For extraction: Provide only the applicable section reference.\n\nFor tax planning: Evaluate alternatives, assess implications, and recommend the most suitable approach with supporting rationale.",
    whenToUse: "To prevent:\n - over-explaining simple answers\n - under-explaining complex decisions",
  },
  {
    n: "08",
    name: "Literal Execution Header",
    summary: "Need Copilot to follow instructions exactly as written?\nWhen consistency is critical, instruct Copilot to execute instructions literally without making assumptions, adding context, or changing the workflow.",
    taxExample: "For a compliance checklist:\n• Do not infer missing information.\n• Do not add recommendations.\n• Follow the specified order.\n• Return only the requested output.",
    whenToUse: "To:\n - observe reordering, added steps, or excessive reasoning in agent's responses\n - diagnose whether inference or instruction ambiguity is causing the problem",
  },
  {
    n: "09",
    name: "Evaluate and Improve Existing Instructions",
    summary: "When was the last time you reviewed your instructions?\nEven well-performing prompts and agents can become more effective through regular reviews. Evaluating instructions helps identify ambiguity, gaps, and opportunities for improvement.",
    taxExample: "Review a tax research agent to check whether it:\n• Cites retrieved sources.\n• Asks for clarification when information is missing.\n• Avoids unsupported conclusions.\n• Follows a defined output structure.",
    whenToUse: "To:\n - audit existing agent behaving inconsistently\n - determine which parts of the instruction set are fragile or ambiguous\n - need a quick way to identify which issues are structural, stylistic, or safety related",
  },
];

export type AgentSummaryRow = {
  practice: string;
  failures: readonly string[];
  patterns: readonly string[];
};

export type AgentSummaryPart = {
  n: string;
  question: string;
  rows: readonly AgentSummaryRow[];
};

export const AGENT_SUMMARY_PARTS: readonly AgentSummaryPart[] = [
  {
    n: "01",
    question: "What should the agent do?",
    rows: [
      {
        practice: "Use Clear, Actionable Language",
        failures: ["Repetitive phrasing"],
        patterns: ["Explicit Decision Rules", "Literal Execution Header"],
      },
      {
        practice: "Build step-by-step workflows",
        failures: ["Missing Self-Validation"],
        patterns: ["Convert ambiguous multitask requests into deterministic workflows", "Self-Evaluation Gate"],
      },
      {
        practice: "Make tasks atomic",
        failures: ["Verbose Output"],
        patterns: ["Correct Parallel vs Sequential Structure"],
      },
      {
        practice: "Provide domain vocabulary",
        failures: ["Inference Drift"],
        patterns: ["Literal Execution Header"],
      },
    ],
  },
  {
    n: "02",
    question: "What should the output look like?",
    rows: [
      {
        practice: "Specify output format, tone and verbosity",
        failures: ["Verbose Output", "Inference Drift"],
        patterns: ["Explicit Decision Rules", "Output Contract", "Literal Execution Header"],
      },
      {
        practice: "Use strict structure",
        failures: ["Missing Self-Validation"],
        patterns: [
          "Convert ambiguous multitask requests into deterministic workflows",
          "Correct Parallel vs Sequential Structure",
          "Self-Evaluation Gate",
        ],
      },
      {
        practice: "Control reasoning through phrasing",
        failures: ["Verbose Output"],
        patterns: ["Steering Auto mode Reasoning", "Output Contract"],
      },
    ],
  },
  {
    n: "03",
    question: "How do I stop the agent going wrong?",
    rows: [
      {
        practice: "Structure using markdown",
        failures: ["Inference Drift"],
        patterns: ["Clean Markdown Structure", "Literal Execution Header"],
      },
      {
        practice: "Provide examples",
        failures: ["Repetitive phrasing", "One-and-Done Prompting"],
        patterns: ["Evaluate and Improve Existing Instructions"],
      },
      {
        practice: "Explicitly reference capabilities, knowledge, and actions",
        failures: ["Overeager Tool Use"],
        patterns: ["Evaluate and Improve Existing Instructions"],
      },
    ],
  },
];
