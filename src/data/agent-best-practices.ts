/**
 * Agent instruction best practices — verbatim from
 * reference/assets/"Agent Best Practices mailer content.xlsx".
 * Shared by Module 3 Quick Recall and the M365 Copilot Hub tab.
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
  examples: readonly AgentExampleBlock[];
};

export const AGENT_BEST_PRACTICES_SLIDES: readonly AgentBestPracticeSlide[] = [
  {
    n: "01",
    heading: "Use Clear, Actionable Language",
    sub: "Stop Telling Copilot Agent What NOT To Do. Just tell It What TO Do.",
    content: [
      "Use clear verbs like Ask, Search, Check, Use, Send",
      "The more precise your instructions, the more reliable your agent's output",
      "Avoid vague instructions.",
    ],
    examples: [
      { tone: "bad", lines: ["Review Section 194R applicability"] },
      { tone: "good", lines: ["Analyze whether Section 194R applies to the attached sales promotion scheme and identify compliance requirements"] },
    ],
  },
  {
    n: "02",
    heading: "Build Step-by-Step Workflows with transitions",
    sub: "Confused Agents Follow Confused Instructions.",
    content: ["Every workflow should have:", "- Goal", "- Action", "- Transition"],
    examples: [
      { tone: "bad", label: "Instead of", lines: ["Review tax notices and prepare responses."] },
      { tone: "good", label: "Use", lines: ["Step 1: Identify pending notices.", "Step 2: Extract due dates.", "Step 3: Draft response summary."] },
    ],
  },
  {
    n: "03",
    heading: "Use strict structure",
    sub: "Great Results Start with Great Structure",
    content: ["Use:", "- Sections for categories", "- Bullets for parallel tasks", "- Steps for sequential workflows"],
    examples: [
      { tone: "bad", lines: ["Mixed instructions in one paragraph"] },
      { tone: "good", label: "Separate sections", lines: ["Research", "Analysis", "Output"] },
    ],
  },
  {
    n: "04",
    heading: "Make tasks atomic",
    sub: "One Instruction. One Outcome.",
    content: [
      "Complex work isn't solved in a single leap.",
      "Guide your agent through the same logical path you would follow:",
      "- Review the facts",
      "- Identify the issues",
      "- Analyze the impact",
      "- Recommend the next steps",
    ],
    examples: [
      { tone: "bad", lines: ["Extract case laws and draft litigation arguments"] },
      { tone: "good", lines: ["Extract relevant case laws", "Summarize legal principles", "Draft litigation arguments"] },
    ],
  },
  {
    n: "05",
    heading: "Always specify tone, verbosity, and output format",
    sub: "If You Don't Specify It, Copilot Will Guess.",
    content: ["Always define:", "- Tone", "- Detail level", "- Output format"],
    examples: [
      { tone: "bad", label: "Poor Instruction", lines: ["Draft an email to the client summarising the provisions covered u/s 90"] },
      { tone: "good", label: "Better Instruction", lines: [
        "Draft an email to the client summarising the provisions covered u/s 90",
        "Tone: Professional and reassuring",
        "Length: Under 150 words",
        "Output Format: Email ready to send with subject line",
      ] },
    ],
  },
  {
    n: "06",
    heading: "Structure instructions in Markdown",
    sub: "Help Your Agent See the Bigger Picture",
    content: [
      "Use #, ##, and ### for section headers",
      "Use bullets or numbered lists",
      "Highlight tool or system names",
      "Make critical instructions bold by using **",
    ],
    examples: [
      { tone: "bad", lines: ["Prepare a transfer pricing risk assessment."] },
      { tone: "good", lines: [
        "Scope",
        "Review FY 2025-26 transactions",
        "Analysis",
        "Identify related party transactions",
        "Evaluate transfer pricing exposure",
        "Risk Assessment",
        "High-risk areas",
        "Supporting documentation gaps",
        "Deliverable",
        "Risk matrix and recommendations",
      ] },
    ],
  },
  {
    n: "07",
    heading: "Provide domain vocabulary",
    sub: "Teach Your Agent Your Language",
    content: [
      "Never Assume Copilot Knows Your Acronyms.",
      "Define:",
      "- Acronyms",
      "- Tax terms",
      "- Internal terms",
      "- Specialized formulas",
    ],
    examples: [
      { tone: "neutral", lines: [
        "TP = Transfer Pricing",
        "FAI = Foreign Asset Information",
        "PE = Permanent Establishment",
        "AO = Assessing Officer",
      ] },
    ],
  },
  {
    n: "08",
    heading: "Explicitly reference capabilities, knowledge, and actions",
    sub: "Tell Copilot Where To Look",
    content: [
      "Tell the agent:",
      "- Search Teams",
      "- Check emails",
      "- Use SharePoint knowledge",
      "- Use OneDrive documents",
    ],
    examples: [
      { tone: "bad", label: "Instead", lines: ["Summarize action items"] },
      { tone: "good", label: "Use", lines: ["Search Teams conversations and summarize action items"] },
    ],
  },
  {
    n: "09",
    heading: "Provide examples",
    sub: "Examples Are Superpowers",
    content: [
      "Don't Just Describe It. Show It.",
      "Provide examples for more than one example for edge cases.",
      "Remove ambiguity and help your agent replicate the outcome you expect",
    ],
    examples: [
      { tone: "bad", label: "Instruction Only", lines: ["Draft a client communication."] },
      { tone: "good", label: "Instruction + Example", lines: [
        "Use the tone and structure below:",
        "Dear Client, We would like to inform you about the recent amendment impacting withholding tax obligations.",
        "Recommended next step: Review current vendor arrangements.",
        "Now draft a communication regarding Section 194T using the same style.",
      ] },
    ],
  },
  {
    n: "10",
    heading: "Control reasoning through phrasing",
    sub: "Control How Much Reasoning You Need",
    content: [
      "Not Every Task Needs Deep Thinking.",
      "Choose the right instruction style:",
      "- Deep reasoning to analyze, derive, evaluate, justify, think step by step, reflect, verify logic and structure tasks into multiple dependent steps",
      "- Moderate reasoning (balanced) for concise but structured explanation",
      "- Fast and minimal reasoning for short answers, no reasoning on explanation and final result only.",
    ],
    examples: [
      { tone: "neutral", label: "Deep Task", lines: ["Analyze litigation strategy considering recent High Court and Supreme Court rulings."] },
      { tone: "neutral", label: "Moderate Task", lines: ["Summarize implications of Section 148A."] },
      { tone: "neutral", label: "Quick Task", lines: ["Extract due dates from this notice."] },
    ],
  },
];
