import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowRight, Check, CheckCircle, ChevronRight, Copy, Cpu, EyeOff, FileText, ListChecks, ListTree, Lock, Palette, Play, RotateCcw, Scale, Shield, Table2, Target, User, X, XCircle, Zap } from "lucide-react";
import { colors as C, contentInlinePad, contentRailStyle, fonts as F, spacing, spectrumCss, typeScale } from "../design-kit/tokens";
import { ModuleHeader, SUBNAV_SCROLL_MARGIN, useModuleSectionHashScroll } from "../design-kit/LearningNav";
import { SiteHeader } from "../design-kit/SiteHeader";
import { SectionAnchorTitle } from "../design-kit/EYTypography";
import { AscentModuleProgressSection } from "../imports/Frame353/ascentCurriculum";
import heroImg from "../assets/images/AdobeStock-621943361.jpeg";
import { PROMPTING_TECHNIQUES, TECHNIQUE_FACETS, type TechniqueFacetKey } from "../data/prompt-techniques";

/** Section surface rhythm: dark → neutral → light (repeats down the page). */
type SurfaceTone = "dark" | "neutral" | "light";
const SURFACE: Record<SurfaceTone, { bg: string; heading: string; body: string; eyebrow: string; border: string }> = {
  dark: {
    bg: C.confidentBlack,
    heading: C.onDark,
    body: C.gray02,
    eyebrow: C.yellow,
    border: C.borderOnDark,
  },
  neutral: {
    bg: C.offWhite,
    heading: C.confidentBlack,
    body: C.gray01,
    eyebrow: C.eyebrowGoldDark,
    border: "rgba(46,46,56,0.10)",
  },
  light: {
    bg: C.white,
    heading: C.confidentBlack,
    body: C.gray01,
    eyebrow: C.eyebrowGoldDark,
    border: "rgba(46,46,56,0.10)",
  },
};

// ── Data ────────────────────────────────────────────────────────────────────

const ELEMENTS = [
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

/** Golden Rules — 7 Do's / 7 Don'ts, sourced from the prompting exercise brief. */
const DOS = [
  {
    title: "Be Specific",
    desc: "Describe the issue, jurisdiction, entity and objective — vague inputs produce vague, generic answers.",
    example: '"Explain transfer pricing." → "Explain the transfer pricing implications for an Indian captive IT services company providing services to its US parent."',
  },
  {
    title: "Provide Context",
    desc: "Give AI the background it needs — your industry, business model, jurisdiction and the relevant facts of the situation.",
    example: '"Our client is an Indian subsidiary of a US pharma company paying management fees to its parent — analyze the withholding tax position."',
  },
  {
    title: "Define the Output",
    desc: "Tell AI exactly what you want back — an executive summary, a comparison table, a memo, or a risk matrix.",
    example: '"Provide a risk matrix comparing the old and new GST rates, followed by a 1-page executive summary."',
  },
  {
    title: "Specify the Audience",
    desc: "Tailor the response to the reader — a CFO, Tax Head, Tax Manager or the Board each need a different level of detail and language.",
    example: '"Explain the POEM provisions in simple, non-technical language suitable for a CEO with no tax background."',
  },
  {
    title: "Refine Through Conversation",
    desc: 'Treat the first answer as a starting point, not the final word. Follow up with "Simplify this", "Add examples", "Make it user-ready" or "Strengthen the key arguments."',
    example: '"That\'s a good draft — now simplify it for a board presentation and add one practical example."',
  },
  {
    title: "Use Dummy Data",
    desc: "Replace sensitive information with placeholders — Company A, Vendor X, ₹XX crore — before entering it into an AI tool.",
    example: '"Company A (manufacturing, turnover ₹XX Cr) has paid ₹YY Cr to Vendor X (US parent) as management fees. Analyze the withholding obligation."',
  },
  {
    title: "Verify Before You Rely",
    desc: "Use AI for research and drafting, and apply your professional judgment for conclusions — always check facts, assumptions, sources and the current law.",
    example: '"Use this AI output as a discussion starting point with your tax team — never as standalone advice for filings or board decisions."',
  },
];

const DONTS = [
  {
    title: "Don't Be Vague",
    desc: 'Vague prompts produce vague answers. Instead of "Tell me about GST," specify the issue, the taxpayer, the jurisdiction and the outcome you need.',
    example: '"Tell me about GST." — AI doesn\'t know which provision, which taxpayer, or which state you mean.',
  },
  {
    title: "Don't Ask Everything at Once",
    desc: "One focused question beats ten unrelated ones. Break complex requests into smaller, sequential tasks for sharper answers.",
    example: '"Explain GST, income tax changes, TDS rates, advance tax dates and MAT provisions for 2025-26" — this dilutes every answer.',
  },
  {
    title: "Don't Skip Key Facts",
    desc: "Missing facts lead to generic outputs. Always provide background, assumptions and constraints relevant to the query.",
    example: "Asking for a TP analysis without mentioning the transaction type, countries involved, or amounts leaves AI guessing.",
  },
  {
    title: "Don't Share Confidential Information",
    desc: "Never enter PAN, GSTIN, bank account details, financials or confidential transaction details into non-approved AI tools.",
    example: 'Never type: "PAN: AABCX1234Z, GSTIN: 27AABCX1234Z1ZP" into a public AI tool.',
  },
  {
    title: "Don't Ignore Jurisdiction",
    desc: "Tax answers are jurisdiction-specific. Always specify the country, state (where relevant) and the applicable legislation.",
    example: '"What\'s the capital gains tax rate?" — for whom, in which country, on what asset, over what holding period?',
  },
  {
    title: "Don't Accept the First Answer",
    desc: "Challenge the output before using it. Ask what assumptions were made, whether alternative views exist, and what information might be missing.",
    example: 'Copy-pasting AI\'s first draft into a client memo without asking "Is this current for AY 2025-26?" is a professional risk.',
  },
  {
    title: "Don't Treat AI as Final Authority",
    desc: "AI assists, professionals decide. Use AI to research, draft, summarize and brainstorm — not to sign off opinions, take filing positions, or replace professional judgment.",
    example: "AI may confidently cite a section number that has since been amended or a circular that was superseded — always cross-verify.",
  },
];

type AdvancedTechnique = {
  id: string;
  name: string;
  tagline: string;
  what: string;
  does: string; // "Why it matters" copy from reference
  without: string;
  with: string;
};

type AdvancedCategory = {
  id: string;
  name: string;
  color: string;
  summary: string;
  techniques: AdvancedTechnique[];
};

/** Prompt like a Pro — Techniques (exact copy from ai-tax-prompting1.html). */
const ADVANCED_CATEGORIES: AdvancedCategory[] = [
  {
    id: "techniques",
    name: "Pro Techniques",
    color: C.frameBlue,
    summary: "Now that you know the elements, here are 8 techniques to level up your prompting game.",
    techniques: [
      {
        id: "few-shot",
        name: "Few-Shot Prompting",
        tagline: "SHOW AI what good looks like",
        what: "Providing 1-3 examples of ideal input-output pairs before asking your actual question — so AI learns the pattern you want.",
        does: "Like showing a new associate a sample memo before asking them to draft one — the output matches your style and standard.",
        without: '"Draft a tax equalisation policy for employees relocating from India to the US."',
        with: '"Here is a sample tax equalisation policy [attached]. Using the same format and structure, draft a policy for India-to-US relocations."',
      },
      {
        id: "iteration",
        name: "Iteration",
        tagline: "BUILD on what AI gives you",
        what: "Using multi-turn conversations — asking AI to improve, expand, or restructure its own previous output step by step.",
        does: "First drafts are starting points. Each follow-up sharpens precision — like reviewing a junior's memo through rounds of feedback.",
        without: '"Summarize this SC ruling and draft a client memo."',
        with: 'Turn 1: "Summarize the facts and ruling." → Turn 2: "Now draft a 1-page client memo." → Turn 3: "Simplify for a non-tax CFO audience."',
      },
      {
        id: "cot",
        name: "Chain of Thought",
        tagline: "MAKE AI show its reasoning",
        what: 'Asking AI to "think step by step" — making it show its reasoning before giving the final answer so you can verify the logic.',
        does: "Like asking an associate to show their workings, not just the conclusion. You can spot errors in reasoning before they reach the client.",
        without: '"What is the effective tax rate for MNCs with royalty payments?"',
        with: '"Think step by step: First identify applicable provisions, then calculate base rate, add surcharge and cess, factor in DTAA, and arrive at the effective rate for MNCs with royalty payments."',
      },
      {
        id: "meta",
        name: "Meta Prompt",
        tagline: "ASK AI to write the prompt for you",
        what: "A prompt that instructs AI to generate an optimised prompt for you — describe your use case and let AI craft the perfect structured instruction.",
        does: "You don't need to remember every technique. Describe what you need and let AI build the optimal prompt structure for you.",
        without: '"Help me respond to a GST show cause notice on product classification."',
        with: '"You are an expert prompt crafter. My use case: I\'m a Tax Head responding to a GST SCN on misclassification. Craft me an optimal prompt that includes persona, context, task, constraints, and step-back reasoning."',
      },
      {
        id: "refinement",
        name: "Refinement",
        tagline: "SHARPEN the output after review",
        what: "Asking AI to critique and improve its own output — reviewing as a partner would, fixing gaps, strengthening arguments.",
        does: "AI catches its own weak spots. Like asking an associate to self-review before submitting — the second pass is always stronger.",
        without: '"Draft a TP memo for IT services." (accept whatever comes back)',
        with: '"Now review your own draft as if you are the reviewing partner. Identify gaps in legal reasoning, strengthen weak arguments, and produce an improved version."',
      },
      {
        id: "expansion",
        name: "Creative Expansion",
        tagline: "EXPLORE angles you haven't considered",
        what: "Asking AI to brainstorm alternative approaches, counterarguments, or edge cases you may not have considered.",
        does: "Uncovers blind spots in your analysis. Like having a second opinion from a specialist in a different tax domain.",
        without: '"Analyze the tax implications of this cross-border restructuring."',
        with: '"Analyze the restructuring, then list 5 risks I might be overlooking — including GAAR, PE exposure, and indirect transfer provisions that a revenue officer might raise."',
      },
      {
        id: "audience",
        name: "Audience Targeting",
        tagline: "TAILOR for who will read it",
        what: "Explicitly telling AI who the reader is — so it adjusts complexity, jargon level, and depth accordingly.",
        does: "A board presentation needs different language than an ITAT submission. Name your reader and AI writes for them.",
        without: '"Explain POEM rules under Section 6(3)."',
        with: '"Explain POEM rules under Section 6(3) in simple language for a CFO with no tax background. Avoid section references — focus on business impact and what action they need to take."',
      },
      {
        id: "flipped",
        name: "Flipped Prompting",
        tagline: "LET AI ask YOU the questions",
        what: "Instead of you writing the prompt, ask AI to interview you — it asks clarifying questions first, then produces a tailored output.",
        does: "When you don't know how to frame the problem, let AI guide you. It surfaces context you might have forgotten to include.",
        without: '"Help me with a tax restructuring advisory." (dumps everything at once, misses key details)',
        with: '"I need help with a restructuring advisory. Before you start, ask me 5 clarifying questions about the entities, jurisdictions, transaction type, timeline, and key concerns."',
      },
    ],
  },
];

type FacetKey = "what" | "does" | "without" | "with";

const FACETS: { key: FacetKey; label: string; color: string }[] = [
  { key: "what", label: "What it is", color: C.frameBlue },
  { key: "does", label: "Why it matters", color: C.frameOrange },
  { key: "without", label: "Without", color: C.destructive },
  { key: "with", label: "With", color: C.success },
];


type AdvancedView = "wizard" | "table";

/** Advanced Techniques — nested 4-stage framework (2 buckets × 2 stages each). */
type AdvancedStageId = "cot" | "decomposition" | "ensemble" | "self-criticism";
type AdvancedBucketId = "solve" | "risk";

type AdvancedStage = { id: AdvancedStageId; name: string; subtitle: string };
type AdvancedBucket = { id: AdvancedBucketId; label: string; stages: AdvancedStage[] };

const ADVANCED_BUCKETS: AdvancedBucket[] = [
  {
    id: "solve",
    label: "Solving the Use Case",
    stages: [
      { id: "cot", name: "Chain of Thought", subtitle: "Improve reasoning" },
      { id: "decomposition", name: "Decomposition", subtitle: "Break large problems into manageable tasks" },
    ],
  },
  {
    id: "risk",
    label: "Risk Mitigation & Validation",
    stages: [
      { id: "ensemble", name: "Ensemble", subtitle: "Improve accuracy, robustness and completeness" },
      { id: "self-criticism", name: "Self-Criticism", subtitle: "Reduce hallucinations and validate outputs" },
    ],
  },
];

const ADVANCED_USE_CASE =
  "Analyzing withholding tax on software royalty payments to a US parent company";

/** Chain of Thought — 4 filter-chip groups shown inside the CoT detail pane. */
type COTGroupId = "initiation" | "structuring" | "adaptation" | "uncertainty";
type COTTechnique = { name: string; purpose: string; explain: string; samplePrompt?: string };
type COTGroup = {
  id: COTGroupId;
  label: string;
  framing?: string;
  techniques?: COTTechnique[];
  tableRows?: { confidence: string; action: string }[];
};

const COT_GROUPS: COTGroup[] = [
  {
    id: "initiation",
    label: "Initiation of Thoughts",
    framing: "How should I begin thinking about this problem?",
    techniques: [
      {
        name: "Step-Back Prompting",
        purpose: "Look at the bigger picture first",
        explain: "Before solving the problem, ask AI to step back and identify broader considerations.",
        samplePrompt: "Before analysing withholding tax on software royalty payments to a US parent, step back: which treaty articles, characterisation questions, and source rules should we settle first?",
      },
      {
        name: "Analogical Prompting",
        purpose: "Learn from similar situations",
        explain: "Use past cases, familiar situations or known examples to guide reasoning.",
        samplePrompt: "Think of a similar case where software payments to a related overseas company were treated as royalties versus business profits. Use that analogy to reason about withholding tax here.",
      },
    ],
  },
  {
    id: "structuring",
    label: "Structuring Thoughts",
    framing: "How should I organize my thinking?",
    techniques: [
      { name: "Thread of Thoughts (ThoT)", purpose: "Explore multiple reasoning paths", explain: "Instead of one line of reasoning, consider several possible ways to solve the problem." },
      { name: "Tabular Chain of Thought (Tab-COT)", purpose: "Structure complex reasoning", explain: "Organize thinking into tables when multiple variables or factors must be considered." },
    ],
  },
  {
    id: "adaptation",
    label: "Adaptation & Optimization",
    framing: "How much thinking is actually required?",
    techniques: [
      { name: "Auto-COT", purpose: "Automatically generate reasoning steps from past processes", explain: "The model determines the reasoning process itself." },
      { name: "Active-COT", purpose: "Incorporate human feedback", explain: "AI adjusts its reasoning using feedback during the process." },
      { name: "Complexity-Based COT", purpose: "Match effort to difficulty", explain: "Easy → direct answer, Moderate → ThoT, Complex → Tab-COT." },
      { name: "Contrastive COT", purpose: "Compare right vs wrong reasoning", explain: "Evaluate what should be done and what should not be done." },
    ],
  },
  {
    id: "uncertainty",
    label: "Uncertainty-Routed (UR-COT)",
    tableRows: [
      { confidence: "Low Complexity + High Confidence", action: "Direct answer" },
      { confidence: "Moderate Complexity", action: "Apply COT" },
      { confidence: "High Complexity or High Uncertainty", action: "Escalate, slow down reasoning, seek additional validation" },
    ],
  },
];

/** Decomposition — stepped flow + worked example. */
const DECOMPOSITION_FLOW = ["Large Problem", "Break into Smaller Tasks", "Apply Relevant Prompting Technique", "Combine Results", "Final Answer"];
const DECOMPOSITION_EXAMPLE_TASKS = [
  "Understand transaction",
  "Review direct tax impact",
  "Review withholding tax impact",
  "Review treaty impact",
  "Review GST impact",
  "Summarize risks",
];

/** Ensemble — stepped flow + method table (Method / How It Works / Improves). */
const ENSEMBLE_FLOW = ["Same Problem", "Multiple Responses", "Judge / Majority Vote", "Final Output"];
const ENSEMBLE_METHODS: { name: string; how: string; improves: string }[] = [
  { name: "Multiple Runs", how: "Solve the same problem many times", improves: "Accuracy" },
  { name: "Multiple Logical Paths", how: "Use different reasoning approaches", improves: "Accuracy" },
  { name: "Prompt Paraphrasing", how: "Rephrase prompt multiple ways", improves: "Robustness" },
  { name: "Multiple LLMs", how: "Compare outputs across models", improves: "Robustness + Accuracy" },
  { name: "Diverse Personas", how: "Multiple perspectives", improves: "Completeness" },
  { name: "Majority Vote", how: "Select most frequent / strongest answer", improves: "Accuracy" },
  { name: "Maximum Mutual Information", how: "Collect maximum information from multiple viewpoints", improves: "Completeness" },
];

/** Memory Aid — quick-reference table mapping each advanced technique to a plain-English anchor and India tax use cases. */
const MEMORY_AID_ROWS: { technique: string; thinkOf: string; useCases: string }[] = [
  { technique: "Chain of Thought (COT)", thinkOf: "Think Better", useCases: "Analyzing Permanent Establishment (PE) exposure, assessing GAAR implications." },
  { technique: "Decomposition", thinkOf: "Break It Down", useCases: "Cross-border restructuring, M&A tax diligence, where multiple workstreams must be analysed separately." },
  { technique: "Ensemble", thinkOf: "Ask Multiple Experts", useCases: "High-value tax opinions, litigation strategy, where multiple perspectives strengthen the conclusion." },
  { technique: "Self-Criticism", thinkOf: "Verify Before Trusting", useCases: "Advisory memos, technical research notes, and any output where factual accuracy is critical." },
];

/** Self-Criticism — expandable technique cards. */
const SELF_CRITICISM_TECHNIQUES: { id: string; name: string; flow: string[]; checklist?: string[] }[] = [
  { id: "reverse-cot", name: "Reverse Chain of Thought", flow: ["Answer First", "Explain Reasoning", "Check Supporting Facts", "Correct Errors"] },
  {
    id: "cove",
    name: "Chain of Verification (CoVe)",
    flow: ["Draft Response", "Generate Verification Questions", "Answer Verification Questions Independently", "Fact Check", "Final Verified Response"],
    checklist: ["Are all facts supported?", "Are any assumptions unsupported?", "Do the logical steps hold?", "If not, correct and regenerate."],
  },
];

const RECAP = [
  { element: "Persona", question: "Who is the AI?", example: "Senior Tax Partner, India" },
  { element: "Context", question: "What's the situation?", example: "Client has cross-border IT support arrangement" },
  { element: "Instruction", question: "What exactly should it do?", example: "Summarise exposures above INR 25 Cr" },
  { element: "Constraints", question: "What are the limits?", example: "Under 200 words, last 3 assessment years" },
  { element: "Grounding", question: "Which sources apply?", example: "Income-tax Act, 1961 + CBDT circulars" },
  { element: "Tone", question: "How should it sound?", example: "Formal, client-ready" },
  { element: "Output", question: "What format?", example: "Table + 3 bullet risks" },
];

const RECAP_CARDS: { icon: LucideIcon; name: string; color: string; bg: string; desc: string }[] = [
  { icon: User, name: "Persona", color: C.frameMagenta, bg: "rgba(255,50,255,0.06)", desc: 'Tell AI WHO to be. Like telling a new colleague: "Pretend you\'re a senior tax partner" — so it talks like one, not like a Wikipedia article.' },
  { icon: FileText, name: "Context", color: C.frameTeal, bg: "rgba(50,255,255,0.06)", desc: "Give the background story. Like telling a taxi driver WHERE you're going — without it, AI drives in circles giving generic answers." },
  { icon: ListChecks, name: "Instruction", color: C.yellow, bg: "rgba(255,230,0,0.08)", desc: 'Say exactly WHAT to do. Like ordering food: "Give me a paneer tikka" works. "Give me something nice" doesn\'t.' },
  { icon: Shield, name: "Constraints", color: C.frameBlue, bg: "rgba(70,150,255,0.08)", desc: 'Set boundaries. Like telling a kid "draw me a picture — but only use 3 colours and keep it on one page." Keeps AI focused.' },
  { icon: Scale, name: "Grounding", color: C.framePurple, bg: "rgba(180,0,255,0.06)", desc: 'Tell AI WHERE to look. Like saying "only use THIS textbook for answers" — prevents it from making things up.' },
  { icon: Palette, name: "Tone / Style", color: C.yellow, bg: "rgba(255,230,0,0.08)", desc: 'Tell AI HOW to sound. Like asking someone: "Explain it like I\'m presenting to a CFO" vs "Explain it to a 5-year-old." Same info, different packaging.' },
  { icon: Table2, name: "Output Format", color: C.frameGreen, bg: "rgba(0,200,100,0.08)", desc: 'Tell AI WHAT SHAPE the answer should take. Like saying "give me a table, not a paragraph" — saves you 20 minutes of reformatting.' },
];

const STRONG_BRIEF_FIELDS = [
  { label: "User", value: "ABC Corp" },
  { label: "Issue", value: "Royalty payments" },
  { label: "Jurisdiction", value: "India" },
  { label: "Output", value: "1-page memo" },
  { label: "Deadline", value: "Thursday" },
  { label: "Audience", value: "User-ready" },
];

/** Exercise 1 — Choose the Best Answer: 5 MCQs, sourced from the prompting exercise brief. */
type ChooseBestOption = { key: "A" | "B" | "C" | "D"; label: string };
type ChooseBestQuestion = {
  id: string;
  prompt: string;
  options: ChooseBestOption[];
  correctKey: "A" | "B" | "C" | "D";
};

const CHOOSE_BEST_QUESTIONS: ChooseBestQuestion[] = [
  {
    id: "q1",
    prompt: "A tax professional wants AI to explain POEM provisions differently for a CFO, a Tax Manager and a CEO. Which prompting element would have the greatest impact?",
    options: [
      { key: "A", label: "Persona" },
      { key: "B", label: "Audience Targeting" },
      { key: "C", label: "Output Indicator" },
      { key: "D", label: "Constraints" },
    ],
    correctKey: "B",
  },
  {
    id: "q2",
    prompt: 'A user asks: "Summarize this Supreme Court judgement." The output is technically correct, but it does not follow the firm\'s preferred format. What is the MOST effective improvement?',
    options: [
      { key: "A", label: "Persona Prompt" },
      { key: "B", label: "Grounding Prompt" },
      { key: "C", label: "Output Instruction Prompt" },
      { key: "D", label: "Chain of Thought" },
    ],
    correctKey: "C",
  },
  {
    id: "q3",
    prompt: "A user wants AI to prepare a tax advisory note but first needs AI to understand: transaction structure, countries involved, business objectives, timelines. Which technique should be used?",
    options: [
      { key: "A", label: "Flipped Prompting" },
      { key: "B", label: "Iterative Prompting" },
      { key: "C", label: "Meta Prompting" },
      { key: "D", label: "Refinement Prompting" },
    ],
    correctKey: "A",
  },
  {
    id: "q4",
    prompt: "A user has already received a reasonably good output and now wants: stronger language, better structure, executive summary. What is the MOST appropriate technique?",
    options: [
      { key: "A", label: "Chain of Thought" },
      { key: "B", label: "Few-Shot Prompting" },
      { key: "C", label: "Refinement Prompting" },
      { key: "D", label: "Audience Prompting" },
    ],
    correctKey: "C",
  },
  {
    id: "q5",
    prompt: "A user provides: one excellent tax memo, one excellent litigation summary, and asks AI to create a third document using the same style and structure. Which technique is being used?",
    options: [
      { key: "A", label: "Context Prompting" },
      { key: "B", label: "Few-Shot Prompting" },
      { key: "C", label: "Persona Prompting" },
      { key: "D", label: "Flipped Prompting" },
    ],
    correctKey: "B",
  },
];

/** Exercise 2 — Match the Description: 10 A–J pairs, sourced from the prompting exercise brief. */
type MatchPair = { id: string; description: string; term: string };

const MATCH_PAIRS: MatchPair[] = [
  { id: "A", description: "Before answering, ask me any questions needed to properly understand the transaction.", term: "Flipped Prompting" },
  { id: "B", description: "According to the Income-tax Act, 1961 and CBDT circulars, explain the position.", term: "Grounding / Source Anchoring" },
  { id: "C", description: "Provide the response as a table followed by three key recommendations.", term: "Output Indicator" },
  { id: "D", description: "You are a senior tax controversy partner advising a multinational group.", term: "Persona" },
  { id: "E", description: "Generate 10 alternative approaches and identify any risks we may have overlooked.", term: "Creative Expansion Prompting" },
  { id: "F", description: "Review my prompt and suggest a better version before proceeding.", term: "Meta Prompting" },
  { id: "G", description: "The user is an India-headquartered IT company providing services to its Singapore parent.", term: "Context" },
  { id: "H", description: "Think through the issue step by step before arriving at a conclusion.", term: "Chain of Thought" },
  { id: "I", description: "Now shorten the output to one page and make it suitable for a CFO.", term: "Iterative Prompting" },
  { id: "J", description: "Limit the response to 200 words and exclude judicial precedents.", term: "Constraints & Boundaries" },
];

/** Display order for the term chips — shuffled so it never mirrors the A→J description order. */
const MATCH_TERM_ORDER = ["G", "D", "H", "B", "J", "A", "F", "I", "C", "E"];

/** Anatomy layer texts — exact copy from ai-tax-prompting1.html promptLayers. */
const PROMPT_STACK = ELEMENTS.map(e => ({
  id: e.id,
  name: e.name.replace(" / ", " · "),
  shortName: e.name.split(" / ")[0],
  question: RECAP[e.id - 1]?.question ?? e.q,
  example: RECAP[e.id - 1]?.example ?? "",
  color: e.color,
  border: e.border,
  fragment: [
    "You are an Indian Tax Professional specializing in the Indian Income-tax Act and allied laws, with expertise in cross-border withholding tax and software royalty transactions.",
    'ABC Software Solutions Pvt. Ltd. (Pune, India) pays software license fees to its US parent XYZ Inc. The company needs clarity on whether these payments constitute "royalty" under the Income-tax Act and the India-US DTAA.',
    "1. Analyze the SC ruling in Engineering Analysis Centre of Excellence and categorize the EULAs.\n2. Analyze the attached Software License EULA clause by clause.\n3. Draft a client memo covering background, EULA analysis, documentation checklist, and withholding tax position.",
    "Scope: Withholding tax implications only. Do not cover GST, corporate tax, or transfer pricing. Keep the memo under 3 pages.",
    "Base your analysis strictly on the Income Tax Act 1961, Income Tax Rules 1962, the SC ruling in EACoE (2022), and applicable DTAA provisions. Do not cite tribunal decisions unless directly relevant.",
    "Draft in a formal, client-ready advisory style suitable for the Tax Head of a software company. Use professional language, avoid jargon where possible.",
    "Present the EULA analysis as a table (Term | SC Interpretation). Provide clause analysis in a 3-column table (Clause | Description | SC Ruling). End with a numbered action checklist.",
  ][e.id - 1],
}));

function buildStackedPrompt(stackedIds: number[]): string {
  return [...stackedIds]
    .sort((a, b) => a - b)
    .map(id => PROMPT_STACK.find(e => e.id === id)?.fragment)
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
  if (layers === 0) {
    return { pct, label: "Empty — add layers!", color: C.destructive };
  }
  if (layers <= 2) {
    return { pct, label: "Weak — keep adding!", color: C.destructive };
  }
  if (layers <= 4) {
    return { pct, label: "Getting better...", color: C.accentOrange };
  }
  if (layers <= 6) {
    return { pct, label: "Strong prompt!", color: C.offBlack, Icon: Zap };
  }
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
        background: C.white,
        border: `1px solid ${C.yellowAlpha12}`,
        borderRadius: 8,
      }}
    >
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: C.gray01,
        fontFamily: F.bold,
        marginBottom: 6,
      }}>
        Prompt strength
      </div>
      <div className="pt-wizard-strength__track">
        <div
          className="pt-wizard-strength__fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        marginTop: 6,
        fontSize: 11,
        fontWeight: 700,
        color,
        fontFamily: F.bold,
      }}>
        {Icon && <Icon size={14} strokeWidth={1.75} aria-hidden />}
        {label}
      </div>
    </div>
  );
}

function PromptStackBuilder() {
  const [stackOrder, setStackOrder] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
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
    .map(id => PROMPT_STACK.find(e => e.id === id))
    .filter(Boolean) as typeof PROMPT_STACK;
  const generatedPrompt = buildStackedPrompt(stackOrder);

  const toggleElement = (id: number) => {
    setStackOrder(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
    setCopied(false);
  };

  const resetStack = () => {
    setStackOrder([]);
    setCopied(false);
  };

  const copyPrompt = async () => {
    if (!generatedPrompt) return;
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: C.offWhite,
      border: `1px solid rgba(46,46,56,0.10)`,
      borderRadius: 12,
      overflow: "hidden",
    }}>
      {/* Dark use-case header — matches EightElementsWizard detail strip */}
      <div style={{
        padding: "16px 24px",
        background: C.confidentBlack,
        borderBottom: `1px solid ${C.borderOnDark}`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: C.yellow,
          fontFamily: F.bold,
        }}>
          Use case
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.onDark, fontFamily: F.bold, lineHeight: 1.4 }}>
          Analyzing withholding tax on software royalty payments to a US parent company
        </span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(240px, 280px) 1fr",
        gap: 24,
        height: 560,
        minHeight: 560,
        padding: 20,
      }}>
      {/* Element picker — single column */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <p style={{ fontSize: 13, color: C.gray01, fontFamily: F.regular, lineHeight: 1.5, marginBottom: 12, flexShrink: 0 }}>
          Click to add each layer:
        </p>
        <div
          role="group"
          aria-label="Prompt elements"
          style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", flex: 1, paddingRight: 4 }}
        >
          {PROMPT_STACK.map(el => {
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
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  background: active ? "rgba(255,230,0,0.18)" : C.white,
                  border: active ? `1.5px solid ${C.yellow}` : `1px solid rgba(46,46,56,0.12)`,
                  flexShrink: 0,
                }}
                onFocus={e => { e.currentTarget.style.outline = focusRing; }}
                onBlur={e => { e.currentTarget.style.outline = "none"; }}
              >
                <span style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: active ? C.yellow : el.color + "22",
                  border: active ? "none" : `1.5px solid ${el.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800,
                  color: C.confidentBlack,
                  fontFamily: F.bold,
                }}>
                  {el.id}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: active ? C.offBlack : C.confidentBlack, fontFamily: F.bold }}>
                    {el.shortName}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <PromptStrengthIndicator layers={stackOrder.length} />
      </div>

      {/* Preview + pinned generated prompt */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0, height: "100%" }}>
        {/* Scrollable tagged stack */}
        <div
          aria-label="Prompt element stack"
          ref={stackScrollRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            background: "transparent",
            border: `1px solid rgba(46,46,56,0.08)`,
            borderRadius: "12px 12px 0 0",
            padding: "20px 24px",
          }}
        >
          {sortedStacked.length === 0 ? (
            <div style={{ height: "100%", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 14, color: C.gray01, fontFamily: F.regular, margin: 0, textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
                Click the ingredients on the left to build your prompt layer by layer. Each layer adds a colored block. Watch the prompt grow from vague to precise.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sortedStacked.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: "12px 14px",
                    background: C.white,
                    borderRadius: 8,
                    border: `1px solid rgba(46,46,56,0.08)`,
                    borderLeft: `3px solid ${item.border}`,
                  }}
                >
                  <span style={{
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    color: C.offBlack,
                    background: item.color + "18",
                    border: `1px solid ${item.border}40`,
                    borderRadius: 4,
                    padding: "3px 8px",
                    fontFamily: F.bold,
                    lineHeight: 1.4,
                  }}>
                    {item.shortName.toUpperCase()}
                  </span>
                  <p style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: C.offBlack,
                    fontFamily: F.regular,
                    flex: 1,
                    whiteSpace: "pre-line",
                  }}>
                    {item.fragment}
                  </p>
                  <button
                    type="button"
                    aria-label={`Remove ${item.shortName}`}
                    onClick={() => toggleElement(item.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: C.gray01, fontSize: 18, lineHeight: 1, padding: "0 2px", flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pinned generated prompt panel — temporarily hidden per request */}
        {/*
        <div style={{
          flexShrink: 0,
          background: C.white,
          border: `1px solid rgba(46,46,56,0.10)`,
          borderTop: `2px solid ${C.yellow}`,
          borderRadius: "0 0 12px 12px",
          padding: "18px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.eyebrowGold, fontFamily: F.bold }}>
            Generated prompt
          </span>
          <p
            aria-live="polite"
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.7,
              color: generatedPrompt ? C.offBlack : C.gray01,
              fontFamily: F.light,
              fontStyle: generatedPrompt ? "italic" : "normal",
              maxHeight: 72,
              overflowY: "auto",
              flex: 1,
            }}
          >
            {generatedPrompt
              ? `"${generatedPrompt}"`
              : "Your assembled prompt appears here as you add elements."}
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
            <button
              type="button"
              onClick={resetStack}
              disabled={stackOrder.length === 0}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 6, fontSize: 12, fontFamily: F.regular,
                border: `1px solid rgba(46,46,56,0.15)`,
                background: C.white,
                color: stackOrder.length === 0 ? C.gray02 : C.offBlack,
                cursor: stackOrder.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>
            <button
              type="button"
              onClick={copyPrompt}
              disabled={!generatedPrompt}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 6, fontSize: 12, fontFamily: F.bold,
                border: "none",
                background: generatedPrompt ? C.yellow : C.offWhite,
                color: generatedPrompt ? C.confidentBlack : C.gray02,
                cursor: generatedPrompt ? "pointer" : "not-allowed",
              }}
            >
              <Copy size={13} /> {copied ? "Copied!" : "Copy prompt"}
            </button>
          </div>
        </div>
        */}
      </div>
      </div>
    </div>
  );
}

/**
 * Progressive disclosure — Figma 3978:2179 (side-by-side unlock).
 * 0 See Outcome → 1 Generic outcome → 2 Synced click-reveal (missing ↔ strong fields) → 3 Full strong brief
 */
type BriefBeat = 0 | 1 | 2 | 3;

const BRIEF_CTA_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  height: 45,
  padding: "12px 26px",
  background: C.yellow,
  color: C.confidentBlack,
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  fontFamily: F.bold,
  cursor: "pointer",
};

/** Outcome row: 14px pad + 28px header + 6px gap + ~20px body + 14px pad */
const BRIEF_OUTCOME_MIN_HEIGHT = 83;

function BriefRevealTile({
  side,
  disabled,
  onClick,
}: {
  side: "weak" | "strong";
  disabled?: boolean;
  onClick: () => void;
}) {
  const isWeak = side === "weak";
  const accent = isWeak ? C.destructive : C.success;
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={isWeak ? "Show weak brief" : "Show strong brief"}
      style={{
        minHeight: 403,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 32,
        background: disabled ? C.offWhite : C.white,
        border: `1px dashed ${disabled ? C.gray02 : `${accent}55`}`,
        borderTop: `3px solid ${disabled ? C.gray02 : accent}`,
        borderRadius: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <span
        style={{
          color: disabled ? C.gray01 : accent,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1px",
          fontFamily: F.bold,
        }}
      >
        {isWeak ? "WEAK BRIEF" : "STRONG BRIEF"}
      </span>
      <p
        style={{
          margin: 0,
          maxWidth: 280,
          textAlign: "center",
          fontSize: 13,
          lineHeight: 1.5,
          color: C.gray01,
          fontFamily: F.regular,
        }}
      >
        {disabled
          ? "Open the weak brief first, then click here."
          : "Click to open this brief."}
      </p>
    </button>
  );
}

function TeamBriefingSection() {
  const missingItems = ["What issue?", "Which jurisdiction?", "What output?", "By when?"];
  const [beat, setBeat] = useState<BriefBeat>(0);
  const [revealedStep, setRevealedStep] = useState(0);
  // 0 neither card · 1 weak · 2 weak + strong. Existing beat flow starts after both are open.
  const [shownBriefs, setShownBriefs] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setRevealedStep(beat === 2 ? 1 : 0);
  }, [beat]);

  const canAdvance = revealedStep < STRONG_BRIEF_FIELDS.length;
  const advanceStep = () => setRevealedStep((s) => Math.min(s + 1, STRONG_BRIEF_FIELDS.length));
  const tagsReady = revealedStep >= missingItems.length;

  const showGeneric = beat >= 1;
  const showMissing = beat >= 2;
  const showStrong = beat >= 3;
  const showProgressiveRight = showMissing && revealedStep > 0;
  const ctaOnLeft = beat === 0 || beat === 1;
  const ctaOnRight = beat === 2 && tagsReady;

  const leftCtaLabel = beat === 0 ? "See the Outcome" : "Show what's missing";

  return (
    <section id="team-briefing" style={{ background: SURFACE.light.bg, padding: `${spacing.sectionPaddingY} 0`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }} data-node-id="3978:2179">
      <div style={{ ...contentRailStyle }}>
        <SectionAnchorTitle align="center">Team Briefing</SectionAnchorTitle>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: C.confidentBlack, textAlign: "center", marginBottom: 8, fontFamily: F.bold }}>
          Brief AI Like You Brief Your Team
        </h2>
        <p style={{ fontSize: 16, color: C.gray01, textAlign: "center", lineHeight: 1.7, marginBottom: 40, fontFamily: F.light }}>
          The more context you provide, the better the outcome.
        </p>

        <div
          data-brief-grid
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 50,
            alignItems: "stretch",
          }}
        >
          {/* Weak Brief — hidden until the first tile is clicked */}
          {shownBriefs < 1 ? (
            <BriefRevealTile side="weak" onClick={() => setShownBriefs(1)} />
          ) : (
          <div
            style={{
              border: `1px solid ${C.destructive}33`,
              borderRadius: 12,
              overflow: "hidden",
              background: C.white,
              display: "flex",
              flexDirection: "column",
              minHeight: 403,
            }}
          >
            <div
              style={{
                background: C.destructive + "0d",
                borderBottom: `1px solid ${C.destructive}1f`,
                padding: "14px 22px",
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span style={{ color: C.destructive, fontSize: 11, fontWeight: 700, letterSpacing: "1px", fontFamily: F.bold }}>
                WEAK BRIEF
              </span>
              {showMissing && (
                <span style={{ color: C.gray01, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: F.bold }}>
                  Better brief
                </span>
              )}
            </div>

            <div
              style={{
                flex: 1,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 18,
                minHeight: 280,
              }}
            >
              <div style={{ width: "100%", background: C.offWhite, borderRadius: 8, padding: "16px 18px", borderLeft: `3px solid ${C.destructive}` }}>
                <p style={{ color: C.offBlack, fontSize: 15, fontStyle: "italic", lineHeight: 1.65, fontFamily: F.light, margin: 0 }}>
                  &ldquo;Research this matter and get back to me.&rdquo;
                </p>
              </div>

              {showMissing && (
                <div style={{ width: "100%" }}>
                  <div style={{ color: C.destructive, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 9, fontFamily: F.bold }}>
                    Missing:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {missingItems.slice(0, Math.min(revealedStep, missingItems.length)).map((item, idx) => {
                      const isActive = canAdvance && idx === revealedStep - 1 && revealedStep <= missingItems.length;
                      const nextItem = missingItems[revealedStep];
                      const itemStyle: CSSProperties = {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        padding: "7px 12px",
                        background: C.destructive + "0d",
                        borderRadius: 6,
                        animation: "briefFieldIn 0.32s ease both",
                        border: isActive ? `1px dashed ${C.destructive}55` : "1px solid transparent",
                        width: "100%",
                        textAlign: "left",
                      };

                      if (isActive) {
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={advanceStep}
                            aria-label={nextItem ? `Reveal next: ${nextItem}` : undefined}
                            style={{ ...itemStyle, cursor: "pointer" }}
                          >
                            <span style={{ color: C.destructive, fontSize: 11, fontWeight: 700, fontFamily: F.bold }}>{item}</span>
                            <ChevronRight size={14} strokeWidth={2} color={C.destructive} aria-hidden />
                          </button>
                        );
                      }

                      return (
                        <div key={item} style={itemStyle}>
                          <span style={{ color: C.destructive, fontSize: 11, fontWeight: 700, fontFamily: F.bold }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div
                style={{
                  width: "100%",
                  marginTop: "auto",
                  background: showGeneric ? C.destructive + "0a" : C.offWhite,
                  border: `1px dashed ${showGeneric ? C.destructive + "33" : C.gray02}`,
                  borderRadius: 8,
                  padding: 14,
                  ...(showStrong ? { minHeight: BRIEF_OUTCOME_MIN_HEIGHT } : {}),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div
                    style={{
                      color: showGeneric ? C.destructive : C.gray01,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "1px",
                      fontFamily: F.bold,
                    }}
                  >
                    OUTCOME
                  </div>
                  {showStrong && <div style={{ width: 28, height: 28, flexShrink: 0 }} aria-hidden />}
                </div>
                <p
                  style={{
                    color: showGeneric ? C.destructive : C.gray01,
                    fontSize: 12,
                    lineHeight: 1.6,
                    fontFamily: F.regular,
                    margin: 0,
                    fontWeight: showGeneric ? 700 : 400,
                  }}
                >
                  {showGeneric ? "Generic response" : "..."}
                </p>
                {ctaOnLeft && (
                  <div style={{ paddingTop: 12 }}>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setBeat((b) => (b === 0 ? 1 : 2)); }}
                      style={BRIEF_CTA_STYLE}
                    >
                      {leftCtaLabel}
                      <ArrowRight size={16} strokeWidth={2} aria-hidden />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Strong Brief — hidden until the second tile is clicked */}
          {shownBriefs < 2 ? (
            <BriefRevealTile
              side="strong"
              disabled={shownBriefs < 1}
              onClick={() => setShownBriefs(2)}
            />
          ) : !showStrong ? (
            <div
              style={{
                background: showProgressiveRight ? C.white : C.offWhite,
                border: showProgressiveRight ? `1px solid ${C.success}33` : `1px dashed ${C.gray02}`,
                borderTop: showProgressiveRight ? `3px solid ${C.success}` : `3px solid ${C.gray02}`,
                borderRadius: showProgressiveRight ? 12 : 10,
                minHeight: 403,
                display: "flex",
                flexDirection: "column",
                alignItems: showProgressiveRight ? "stretch" : "center",
                justifyContent: showProgressiveRight ? "flex-start" : "center",
                gap: showProgressiveRight ? 18 : 16,
                padding: showProgressiveRight ? 22 : 32,
                overflow: "hidden",
              }}
            >
              {showProgressiveRight ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        background: C.success + "0d",
                        border: `1px solid ${C.success}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Lock size={16} strokeWidth={1.75} color={C.success} aria-hidden />
                    </div>
                    <span style={{ color: C.success, fontSize: 11, fontWeight: 700, letterSpacing: "1px", fontFamily: F.bold }}>
                      STRONG BRIEF
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                    {STRONG_BRIEF_FIELDS.slice(0, revealedStep).map((field, idx) => {
                      const isActive = idx === revealedStep - 1 && canAdvance;
                      const nextField = STRONG_BRIEF_FIELDS[revealedStep];
                      const rowStyle: CSSProperties = {
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "7px 12px",
                        background: C.success + "0d",
                        borderRadius: 6,
                        animation: "briefFieldIn 0.32s ease both",
                        border: isActive ? `1px dashed ${C.success}55` : "1px solid transparent",
                        width: "100%",
                        textAlign: "left",
                      };

                      if (isActive) {
                        return (
                          <button
                            key={field.label}
                            type="button"
                            onClick={advanceStep}
                            aria-label={nextField ? `Reveal next: ${nextField.label} ${nextField.value}` : undefined}
                            style={{ ...rowStyle, cursor: "pointer" }}
                          >
                            <span style={{ color: C.gray01, fontSize: 11, fontWeight: 700, minWidth: 82, flexShrink: 0, fontFamily: F.bold }}>{field.label}</span>
                            <span style={{ color: C.offBlack, fontSize: 12, fontWeight: 400, flex: 1, fontFamily: F.regular }}>{field.value}</span>
                            <ChevronRight size={14} strokeWidth={2} color={C.success} aria-hidden />
                          </button>
                        );
                      }

                      return (
                        <div key={field.label} style={rowStyle}>
                          <span style={{ color: C.gray01, fontSize: 11, fontWeight: 700, minWidth: 82, flexShrink: 0, fontFamily: F.bold }}>{field.label}</span>
                          <span style={{ color: C.offBlack, fontSize: 12, fontWeight: 400, flex: 1, fontFamily: F.regular }}>{field.value}</span>
                          <Check size={14} strokeWidth={2.5} color={C.success} aria-hidden />
                        </div>
                      );
                    })}
                  </div>

                  {ctaOnRight && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setBeat(3); }}
                      style={{ ...BRIEF_CTA_STYLE, alignSelf: "center" }}
                    >
                      Reveal Strong Brief
                      <ArrowRight size={16} strokeWidth={2} aria-hidden />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      background: C.white,
                      border: `1px solid ${C.gray02}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Lock size={20} strokeWidth={1.75} color={C.gray01} aria-hidden />
                  </div>
                  <span
                    style={{
                      background: C.gray02,
                      color: C.gray01,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "1.1px",
                      textTransform: "uppercase",
                      fontFamily: F.bold,
                      padding: "3px 10px",
                      borderRadius: 4,
                    }}
                  >
                    Strong Brief
                  </span>
                  <p
                    style={{
                      margin: 0,
                      maxWidth: 317,
                      textAlign: "center",
                      fontSize: 12,
                      lineHeight: "18px",
                      color: C.gray01,
                      fontFamily: F.regular,
                    }}
                  >
                    A well-defined prompt that powers a repeatable AI Agent tailored to a specific tax workflow
                  </p>
                </>
              )}
            </div>
          ) : (
            <div
              style={{
                border: `1px solid ${C.success}33`,
                borderRadius: 12,
                overflow: "hidden",
                background: C.white,
                display: "flex",
                flexDirection: "column",
                minHeight: 403,
              }}
            >
              <div
                style={{
                  background: C.success + "0d",
                  borderBottom: `1px solid ${C.success}1f`,
                  padding: "14px 22px",
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span style={{ color: C.success, fontSize: 11, fontWeight: 700, letterSpacing: "1px", fontFamily: F.bold }}>
                  STRONG BRIEF
                </span>
                <span style={{ color: C.gray01, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: F.bold }}>
                  Better brief
                </span>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  minHeight: 280,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {STRONG_BRIEF_FIELDS.map((field, idx) => (
                    <div
                      key={field.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "7px 12px",
                        background: C.success + "0d",
                        borderRadius: 6,
                        animation: `briefFieldIn 0.28s ease ${idx * 0.05}s both`,
                      }}
                    >
                      <span style={{ color: C.gray01, fontSize: 11, fontWeight: 700, minWidth: 82, flexShrink: 0, fontFamily: F.bold }}>{field.label}</span>
                      <span style={{ color: C.offBlack, fontSize: 12, fontWeight: 400, flex: 1, fontFamily: F.regular }}>{field.value}</span>
                      <Check size={14} strokeWidth={2.5} color={C.success} aria-hidden />
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    width: "100%",
                    marginTop: "auto",
                    background: C.success + "0a",
                    border: `1px dashed ${C.success}33`,
                    borderRadius: 8,
                    padding: 14,
                    minHeight: BRIEF_OUTCOME_MIN_HEIGHT,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ color: C.success, fontSize: 10, fontWeight: 700, letterSpacing: "1px", fontFamily: F.bold }}>
                      OUTCOME
                    </div>
                    <button
                      type="button"
                      onClick={() => setBeat(0)}
                      aria-label="Start over"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        padding: 0,
                        background: C.white,
                        border: `1px solid ${C.success}33`,
                        borderRadius: 6,
                        color: C.success,
                        cursor: "pointer",
                      }}
                    >
                      <RotateCcw size={14} strokeWidth={2} aria-hidden />
                    </button>
                  </div>
                  <p style={{ color: C.success, fontSize: 12, lineHeight: 1.6, fontFamily: F.regular, margin: 0, fontWeight: 700 }}>
                    Focused response
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes briefFieldIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 900px) {
            #team-briefing [data-brief-grid] {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

/** Inline label tag for highlighted prompt phrases on dark quote blocks. */
function PromptInlineTag({ children, accent }: { children: React.ReactNode; accent: string }) {
  const isYellow = accent === C.yellow;
  const borderColor = isYellow ? C.yellow : accent;
  return (
    <span
      style={{
        display: "inline",
        fontStyle: "normal",
        fontWeight: typeScale.caption.weight,
        fontFamily: F.light,
        fontSize: typeScale.caption.size,
        letterSpacing: typeScale.label.tracking,
        textTransform: "uppercase",
        lineHeight: 1.35,
        padding: "2px 6px",
        borderRadius: 3,
        margin: "0 2px",
        verticalAlign: "baseline",
        background: isYellow ? C.yellow : `${accent}33`,
        border: `1.5px solid ${borderColor}`,
        borderLeft: `3px solid ${borderColor}`,
        color: isYellow ? C.offBlack : C.onDark,
      }}
    >
      {children}
    </span>
  );
}

function AiLazyProSection() {
  const s = SURFACE.dark;
  return (
    <section id="lazy-vs-pro" style={{ background: s.bg, padding: `${spacing.sectionPaddingY} 0`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
      <div style={{ ...contentRailStyle }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: s.heading, textAlign: "center", marginBottom: 8, fontFamily: F.bold }}>
          Same AI. Two Very Different Results.
        </h2>
        <p style={{ fontSize: 16, color: s.body, textAlign: "center", lineHeight: 1.7, marginBottom: 52, fontFamily: F.light }}>
          The only thing that changed? The way you asked.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 0, alignItems: "stretch" }}>
          <div style={{ background: C.eyBgCard, border: `1px solid ${C.destructive}33`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ background: C.destructive + "0d", padding: "14px 22px", borderBottom: `1px solid ${C.destructive}1f`, display: "flex", alignItems: "center", gap: 10, minHeight: 48 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.destructive} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
              <span style={{ color: C.destructive, fontSize: 11, fontWeight: 700, letterSpacing: "1px", fontFamily: F.bold }}>THE LAZY ASK</span>
            </div>
            <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ background: C.surfaceOnDark, borderRadius: 8, padding: "12px 16px", borderLeft: `3px solid ${C.destructive}`, minHeight: 72, display: "flex", alignItems: "flex-start" }}>
                <p style={{ color: s.heading, fontSize: 15, fontStyle: "italic", lineHeight: 1.65, fontFamily: F.light, margin: 0 }}>&ldquo;Summarise this document&rdquo;</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minHeight: 76 }}>
                {["No role", "No context", "No format", "No limits"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", background: C.destructive + "0d", borderRadius: 6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.destructive} strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    <span style={{ color: C.destructive, fontSize: 11, fontWeight: 600, fontFamily: F.bold }}>{t}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: C.destructive + "0a", border: `1px dashed ${C.destructive}33`, borderRadius: 8, padding: 14, marginTop: "auto" }}>
                <div style={{ color: C.destructive, fontSize: 10, fontWeight: 700, letterSpacing: "1px", marginBottom: 6, fontFamily: F.bold }}>↓ WHAT YOU GET BACK</div>
                <p style={{ color: s.body, fontSize: 12, lineHeight: 1.6, fontFamily: F.regular, margin: 0 }}>A generic 300-word wall of text. Wrong tone. Wrong audience. Needs complete rewriting. <strong style={{ color: C.destructive }}>30 minutes lost.</strong></p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 2, flex: 1, background: `linear-gradient(180deg, ${C.destructive}4d, ${C.yellow}99, ${C.success}4d)` }} />
            <div style={{ background: C.white, border: `2px solid ${C.yellow}`, color: C.offBlack, fontSize: 10, fontWeight: 800, padding: "6px 8px", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.bold }}>VS</div>
            <div style={{ width: 2, flex: 1, background: `linear-gradient(180deg, ${C.success}4d, ${C.yellow}99, ${C.destructive}4d)` }} />
          </div>

          <div style={{ background: C.eyBgCard, border: `1px solid ${C.success}33`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ background: C.success + "0d", padding: "14px 22px", borderBottom: `1px solid ${C.success}1f`, display: "flex", alignItems: "center", gap: 10, minHeight: 48 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span style={{ color: C.success, fontSize: 11, fontWeight: 700, letterSpacing: "1px", fontFamily: F.bold }}>THE PRO ASK</span>
            </div>
            <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ background: C.surfaceOnDark, borderRadius: 8, padding: "12px 16px", borderLeft: `3px solid ${C.success}`, minHeight: 72, display: "flex", alignItems: "flex-start" }}>
                <p style={{ color: s.heading, fontSize: 14, fontStyle: "italic", lineHeight: 1.65, fontFamily: F.light, margin: 0 }}>
                  &ldquo;You are a <PromptInlineTag accent={C.yellow}>tax advisor</PromptInlineTag>. Summarise the key <PromptInlineTag accent={C.frameBlue}>transfer pricing changes</PromptInlineTag> in this circular for a <PromptInlineTag accent={C.frameOrange}>client memo</PromptInlineTag>. Use <PromptInlineTag accent={C.framePurple}>bullet points</PromptInlineTag>. Keep it under <PromptInlineTag accent={C.success}>200 words</PromptInlineTag>.&rdquo;
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minHeight: 76 }}>
                {[
                  { label: "Role defined", accent: C.yellow },
                  { label: "Task clear", accent: C.frameBlue },
                  { label: "Format set", accent: C.framePurple },
                  { label: "Length capped", accent: C.success },
                ].map(({ label, accent }) => {
                  const isYellow = accent === C.yellow;
                  return (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 12px",
                        borderRadius: 6,
                        background: isYellow ? C.yellow : `${accent}33`,
                        border: `1.5px solid ${accent}`,
                        borderLeft: `3px solid ${accent}`,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isYellow ? C.offBlack : accent} strokeWidth="2.5" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ color: isYellow ? C.offBlack : C.onDark, fontSize: 11, fontWeight: 700, fontFamily: F.bold }}>{label}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: C.success + "0a", border: `1px dashed ${C.success}33`, borderRadius: 8, padding: 14, marginTop: "auto" }}>
                <div style={{ color: C.success, fontSize: 10, fontWeight: 700, letterSpacing: "1px", marginBottom: 6, fontFamily: F.bold }}>↓ WHAT YOU GET BACK</div>
                <p style={{ color: s.body, fontSize: 12, lineHeight: 1.6, fontFamily: F.regular, margin: 0 }}>A client-ready bullet list. Right tone. Right scope. Drop it straight into the email. <strong style={{ color: C.success }}>Done in 30 seconds.</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Prompting Equation — temporarily hidden
        <div style={{
          marginTop: 40, textAlign: "center", padding: "24px 32px",
          background: C.yellowAlpha10, border: `1px solid ${C.yellow}33`, borderRadius: 12,
        }}>
          <p style={{ color: C.eyebrowGold, fontSize: 16, fontWeight: 700, marginBottom: 12, fontFamily: F.bold }}>The Prompting Equation</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {["Role", "Context", "Task", "Format"].map((part, i) => (
              <span key={part} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                {i > 0 && <span style={{ color: C.eyebrowGold, fontSize: 18, fontWeight: 700 }}>+</span>}
                <span style={{
                  padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 700, fontFamily: F.bold,
                  background: C.white, border: `1px solid rgba(46,46,56,0.12)`, color: C.offBlack,
                }}>{part}</span>
              </span>
            ))}
            <span style={{ color: C.success, fontSize: 18, fontWeight: 700 }}>=</span>
            <span style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 700, fontFamily: F.bold,
              background: C.success + "14", border: `1px solid ${C.success}4d`, color: C.success,
            }}>Client-Ready Output</span>
          </div>
        </div>
        */}
      </div>
    </section>
  );
}

function RecapInNutshellSection() {
  const s = SURFACE.dark;
  return (
    <section id="recap" style={{
      background: s.bg,
      padding: `100px 0`,
      scrollMarginTop: SUBNAV_SCROLL_MARGIN,
    }}>
      <div style={{ ...contentRailStyle, textAlign: "center" }}>
        {/* Eyebrow pill hidden site-wide per request — see AI_TAX_PROMPTING pill removal
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: C.yellow, border: `1px solid ${C.gray02}`,
          borderRadius: 100, padding: "6px 16px", marginBottom: 16,
        }}>
          <span style={{ color: C.offBlack, fontSize: 14, fontFamily: F.regular }}>
            Recap in a Nutshell
          </span>
        </div>
        */}
        <h2 style={{ fontSize: 36, fontWeight: 700, color: s.heading, marginTop: 16, marginBottom: 10, fontFamily: F.bold }}>
          Putting your <span style={{ color: C.yellow, fontStyle: "italic" }}>#BestPrompt Forward</span>
        </h2>
        <p style={{ fontSize: 16, color: s.body, lineHeight: 1.6, marginBottom: 50, fontFamily: F.light }}>
          Your 7-element checklist. Before you hit Send, make sure you&apos;ve covered these.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, textAlign: "left" }}>
          {RECAP_CARDS.map(({ icon: Icon, name, color, desc }) => (
            <div key={name} style={{
              background: C.white, border: `1px solid ${s.border}`,
              borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "21px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: C.yellow,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={18} color={C.confidentBlack} strokeWidth={2} />
                </div>
                <span style={{ color, fontSize: 15, fontWeight: 700, fontFamily: F.bold }}>{name}</span>
              </div>
              <p style={{ color: C.gray01, fontSize: 13, lineHeight: 1.6, margin: 0, fontFamily: F.regular }}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 40, maxWidth: 900, marginLeft: "auto", marginRight: "auto",
          background: C.surfaceOnDark, border: `1px solid ${s.border}`,
          borderTop: `3px solid ${C.yellow}`,
          borderRadius: 12, padding: 29, textAlign: "center",
        }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, fontFamily: F.bold, color: s.heading }}>
            We have shared the essentials. Now it&apos;s your turn to unlock the extraordinary.
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 16, lineHeight: 1.6, color: s.body, fontFamily: F.regular }}>
            The more you practice, the sharper your prompts become. Start with one element — and layer more as you gain confidence.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * End-of-module ascent — continue via next trek-step CTA (no footer).
 */
function JourneyProgressSection({ onContinue }: { onContinue: () => void }) {
  return (
    <AscentModuleProgressSection
      moduleKey="m1_2"
      onNextStepCta={onContinue}
    />
  );
}

/** Meta Prompt workshop — exact content from ai-tax-prompting1.html #meta-prompt. */
function MetaPromptSection() {
  const steps = [
    { n: "1", title: "TELL AI WHO YOU ARE", body: '"I\'m a Tax Head dealing with a GST show cause notice on misclassification"' },
    { n: "2", title: "ASK AI TO BUILD THE PROMPT", body: '"Craft me the best prompt to get a comprehensive reply with legal backing"' },
    { n: "3", title: "USE THE GENERATED PROMPT", body: "Paste AI's crafted prompt into any platform → get expert-level output instantly" },
  ];
  const template = [
    { n: "①", title: "WHO IS AI IN THIS SCENARIO?", body: '"You are an expert prompt crafter who understands advanced prompting frameworks like Chain of Thought, Step-back Prompting, and Analogical reasoning."' },
    { n: "②", title: "WHAT'S YOUR SITUATION? (Plain English)", body: '"I\'m the Tax Head of a manufacturing company (₹3,000 Cr turnover). We got a GST show cause notice saying our products are misclassified. I need to prepare a legally-backed reply, find weak spots in our position, and create an action plan."' },
    { n: "③", title: "WHAT DO YOU WANT AI TO DO?", body: '"Craft me the best possible prompt I can paste into ChatGPT/Gemini to get a comprehensive analysis and reply for this situation."' },
    { n: "④", title: "WHAT SHOULD THE PROMPT INCLUDE?", body: '"Make sure the generated prompt includes:" Persona · Context · Clear Task · Tone · Constraints · Step-back Reasoning · Output Format' },
  ];

  return (
    <section id="meta-prompt" style={{ background: SURFACE.neutral.bg, padding: `${spacing.sectionPaddingY} 0`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
      <div style={{ ...contentRailStyle }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: C.eyebrowGold, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: F.bold, marginBottom: 12 }}>
            🪄 The Ultimate Shortcut
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: C.confidentBlack, fontFamily: F.bold, margin: "0 0 12px", lineHeight: 1.25 }}>
            Don&apos;t Write a Prompt.<br />Ask AI to Write It For You.
          </h2>
          <p style={{ fontSize: 16, color: C.gray01, fontFamily: F.light, lineHeight: 1.7, maxWidth: 680, margin: "0 auto" }}>
            Think of it like this: instead of cooking yourself, you hand a chef your ingredient list and dietary preferences — and they design the perfect recipe. That&apos;s a Meta Prompt.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: 0, alignItems: "stretch", marginBottom: 48 }}>
          <div style={{ border: `1px solid ${C.destructive}33`, borderRadius: 12, padding: 22, background: C.white }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: C.destructive, fontFamily: F.bold }}>😰 WITHOUT META PROMPT</p>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.6 }}>
              You spend 10 minutes trying to remember all the elements, get the structure right, include the right techniques...
            </p>
            <p style={{ margin: 0, fontSize: 13, fontStyle: "italic", color: C.gray01, fontFamily: F.light }}>
              &ldquo;Ugh, did I include persona? What about grounding? Should I add chain of thought here?&rdquo;
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: C.gray01, fontWeight: 700 }}>→</div>
          <div style={{ border: `1px solid ${C.success}33`, borderRadius: 12, padding: 22, background: C.white }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: C.success, fontFamily: F.bold }}>😎 WITH META PROMPT</p>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.6 }}>
              You describe your problem in plain English. AI builds the perfect structured prompt for you. Done in 30 seconds.
            </p>
            <p style={{ margin: 0, fontSize: 13, fontStyle: "italic", color: C.gray01, fontFamily: F.light }}>
              &ldquo;Hey AI, write me the best prompt to solve this GST notice issue.&rdquo;
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: 22, fontWeight: 700, color: C.confidentBlack, fontFamily: F.bold, textAlign: "center", margin: "0 0 8px" }}>
          How It Works — 3 Simple Steps
        </h3>
        <p style={{ textAlign: "center", fontSize: 14, color: C.gray01, margin: "0 0 28px", fontFamily: F.light }}>
          Like briefing a senior partner who then briefs the associate perfectly.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
          {steps.map(s => (
            <div key={s.n} style={{ background: C.white, border: `1px solid rgba(46,46,56,0.10)`, borderRadius: 12, padding: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.yellow, color: C.confidentBlack, fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.bold, marginBottom: 12 }}>{s.n}</div>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: C.offBlack, fontFamily: F.bold }}>{s.title}</p>
              <p style={{ margin: 0, fontSize: 13, color: C.gray01, fontFamily: F.light, lineHeight: 1.55, fontStyle: "italic" }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ background: C.white, border: `1px solid rgba(46,46,56,0.10)`, borderRadius: 12, padding: 28, marginBottom: 32 }}>
          <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, fontFamily: F.bold, color: C.confidentBlack }}>📋 Copy-Paste This Template</p>
          <p style={{ margin: "0 0 20px", fontSize: 12, color: C.gray01, fontFamily: F.regular }}>Works on ChatGPT / Gemini / Copilot</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {template.map(t => (
              <div key={t.n}>
                <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: C.eyebrowGold, fontFamily: F.bold }}>{t.n} {t.title}</p>
                <p style={{ margin: 0, fontSize: 13, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.6 }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.offWhite, border: `1px solid rgba(46,46,56,0.08)`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, fontFamily: F.bold, color: C.confidentBlack }}>✨ What Happens Next</p>
          <p style={{ margin: 0, fontSize: 14, color: C.gray01, fontFamily: F.regular, lineHeight: 1.65 }}>
            AI gives you back a perfectly structured, multi-paragraph prompt — complete with persona, context, step-by-step task breakdown, grounding references, tone settings, and guardrails. You then paste that prompt into any AI platform and get an analysis that would&apos;ve taken hours to write manually.
          </p>
        </div>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, fontFamily: F.bold, color: C.confidentBlack }}>💡 Why Does This Work So Well?</p>
          <p style={{ margin: 0, fontSize: 14, color: C.gray01, fontFamily: F.regular, lineHeight: 1.65, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            You tell a senior partner your problem in 2 sentences = They brief the associate with perfect detail and structure. The meta prompt is your senior partner. It takes your rough problem → turns it into a structured brief → that produces client-ready output.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {["🎯 Complex multi-area tasks", "⚡ Don't remember all techniques? Let AI handle it", "🔁 Save as template — reuse for every new matter"].map(t => (
            <span key={t} style={{
              padding: "8px 14px", borderRadius: 100, fontSize: 12, fontFamily: F.bold, fontWeight: 700,
              background: C.white, border: `1px solid rgba(46,46,56,0.10)`, color: C.offBlack,
            }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Exercise 1 — one MCQ at a time, instant feedback, auto-advance, running score. */
function ChooseBestAnswerExercise() {
  const [qIndex, setQIndex] = useState(0);
  /** Stored choice per question index — kept when navigating back/forward. */
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const advanceTimerRef = useRef<number | null>(null);

  const question = CHOOSE_BEST_QUESTIONS[qIndex];
  const selectedKey = answers[qIndex] ?? null;
  const answered = selectedKey !== null;
  const isLast = qIndex === CHOOSE_BEST_QUESTIONS.length - 1;
  const canGoPrev = qIndex > 0;
  /** Next advances when not last; on the last answered question it opens the score screen. */
  const canGoNext = answered;

  const clearAdvanceTimer = () => {
    if (advanceTimerRef.current != null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  const goPrev = () => {
    if (!canGoPrev) return;
    clearAdvanceTimer();
    setQIndex(i => i - 1);
  };

  const goNext = () => {
    if (!canGoNext) return;
    clearAdvanceTimer();
    if (isLast) {
      setFinished(true);
    } else {
      setQIndex(i => i + 1);
    }
  };

  const choose = (key: string) => {
    if (answered) return;
    setAnswers(prev => ({ ...prev, [qIndex]: key }));
    if (key === question.correctKey) setScore(s => s + 1);
    clearAdvanceTimer();
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      if (isLast) {
        setFinished(true);
      } else {
        setQIndex(i => i + 1);
      }
    }, 900);
  };

  const reset = () => {
    clearAdvanceTimer();
    setQIndex(0);
    setAnswers({});
    setScore(0);
    setFinished(false);
  };

  const navBtnStyle = (enabled: boolean) => ({
    display: "inline-flex" as const, alignItems: "center" as const, gap: 6,
    padding: "8px 16px", border: "1px solid rgba(46,46,56,0.15)", borderRadius: 6,
    background: C.white, color: enabled ? C.gray01 : C.gray02,
    fontSize: 12, fontWeight: 700, fontFamily: F.bold,
    cursor: enabled ? "pointer" as const : "default" as const,
    opacity: enabled ? 1 : 0.45,
  });

  return (
    <div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: C.white, border: "1px solid rgba(46,46,56,0.10)", borderLeft: `3px solid ${C.yellow}`,
        borderRadius: 8, padding: "8px 16px", marginBottom: 20,
      }}>
        <span style={{ fontSize: 12, color: C.gray01, fontFamily: F.regular }}>Score:</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: C.confidentBlack, background: C.yellow, borderRadius: 4, padding: "1px 8px", fontFamily: F.bold }}>
          {score} / {CHOOSE_BEST_QUESTIONS.length}
        </span>
      </div>

      {!finished ? (
        <div style={{
          background: C.white, border: "1px solid rgba(46,46,56,0.10)", borderRadius: 12,
          padding: "24px 28px", textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            {CHOOSE_BEST_QUESTIONS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === qIndex ? 12 : 10,
                  height: i === qIndex ? 12 : 10,
                  borderRadius: "50%",
                  background: i === qIndex || answers[i] != null ? C.yellow : C.gray02,
                  flexShrink: 0,
                  display: "inline-block",
                  transition: "width 0.2s, height 0.2s, background 0.2s",
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.eyebrowGold, fontFamily: F.bold }}>
            Question {qIndex + 1} of {CHOOSE_BEST_QUESTIONS.length}
          </span>
          <p style={{ fontSize: 15, color: C.offBlack, lineHeight: 1.6, fontFamily: F.regular, margin: "12px 0 20px" }}>
            {question.prompt}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {question.options.map(opt => {
              const isCorrectOpt = opt.key === question.correctKey;
              const isClicked = selectedKey === opt.key;
              const showCorrect = answered && isCorrectOpt;
              const showIncorrect = answered && isClicked && !isCorrectOpt;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => choose(opt.key)}
                  disabled={answered}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 8, textAlign: "left",
                    cursor: answered ? "default" : "pointer",
                    background: showCorrect ? C.success + "0d" : showIncorrect ? C.destructive + "0d" : C.offWhite,
                    border: showCorrect ? `2px solid ${C.success}` : showIncorrect ? `2px solid ${C.destructive}` : "2px solid rgba(46,46,56,0.10)",
                    fontFamily: F.regular,
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, fontFamily: F.bold,
                    background: showCorrect ? C.success : showIncorrect ? C.destructive : C.white,
                    color: showCorrect || showIncorrect ? C.white : C.gray01,
                    border: showCorrect || showIncorrect ? "none" : "1px solid rgba(46,46,56,0.15)",
                  }}>
                    {opt.key}
                  </span>
                  <span style={{ flex: 1, fontSize: 14, color: C.offBlack, lineHeight: 1.5 }}>{opt.label}</span>
                  {showCorrect && <CheckCircle size={18} color={C.success} strokeWidth={2} style={{ flexShrink: 0 }} />}
                  {showIncorrect && <XCircle size={18} color={C.destructive} strokeWidth={2} style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>

          {/* Prev / Next — answers stay in `answers` so revisiting shows the same feedback. */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, gap: 12 }}>
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Previous question"
              style={navBtnStyle(canGoPrev)}
            >
              <ArrowLeft size={14} strokeWidth={2} aria-hidden />
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              aria-label={isLast ? "See results" : "Next question"}
              style={navBtnStyle(canGoNext)}
            >
              {isLast ? "See results" : "Next"}
              <ArrowRight size={14} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: C.yellowAlpha10, border: `1px solid ${C.yellow}44`, borderRadius: 12,
          padding: "32px 28px", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: C.eyebrowGold, fontFamily: F.bold }}>
            {score} / {CHOOSE_BEST_QUESTIONS.length}
          </div>
          <p style={{ fontSize: 14, color: C.gray01, margin: "8px 0 20px", fontFamily: F.regular }}>
            {score === CHOOSE_BEST_QUESTIONS.length
              ? "Perfect score! You know exactly which element or technique fits each scenario."
              : score >= 3
              ? "Solid instincts — review the ones you missed and try again."
              : "Worth another pass — scroll back up to the Elements and Techniques sections for a refresher."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 24px", border: "1px solid rgba(46,46,56,0.15)", borderRadius: 6,
              background: C.white, color: C.gray01, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F.bold,
            }}
          >
            <RotateCcw size={14} strokeWidth={2} />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

/** Circular Check / X badge for match feedback (line icons only). */
function MatchResultBadge({ kind, label }: { kind: "ok" | "bad"; label: string }) {
  const color = kind === "ok" ? C.success : C.destructive;
  const Icon = kind === "ok" ? Check : X;
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        background: color + "14",
        color,
        flexShrink: 0,
      }}
    >
      <Icon size={14} strokeWidth={2} aria-hidden />
    </span>
  );
}

/** Exercise 2 — select a description, then its matching term; correct pairs lock green, wrong pairs flash red. */
function MatchDescriptionExercise() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Record<string, boolean>>({});
  const [wrongDescId, setWrongDescId] = useState<string | null>(null);
  const [wrongTermId, setWrongTermId] = useState<string | null>(null);

  const matchedCount = Object.keys(matchedIds).length;
  const isComplete = matchedCount === MATCH_PAIRS.length;

  const selectDescription = (id: string) => {
    if (matchedIds[id] || wrongDescId) return;
    setSelectedId(id);
  };

  const selectTerm = (id: string) => {
    if (matchedIds[id] || wrongTermId || !selectedId) return;
    if (selectedId === id) {
      setMatchedIds(prev => ({ ...prev, [id]: true }));
      setSelectedId(null);
      return;
    }
    setWrongDescId(selectedId);
    setWrongTermId(id);
    setSelectedId(null);
    // Keep wrong flash long enough to see the X badge; shake runs once (~500ms).
    window.setTimeout(() => {
      setWrongDescId(null);
      setWrongTermId(null);
    }, 1500);
  };

  const reset = () => {
    setSelectedId(null);
    setMatchedIds({});
    setWrongDescId(null);
    setWrongTermId(null);
  };

  return (
    <div>
      <style>{`
        @keyframes match-term-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .match-term-jitter {
          animation: match-term-shake 0.5s ease-in-out;
        }
      `}</style>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: C.white, border: "1px solid rgba(46,46,56,0.10)", borderLeft: `3px solid ${C.yellow}`,
        borderRadius: 8, padding: "8px 16px", marginBottom: 20,
      }}>
        <span style={{ fontSize: 12, color: C.gray01, fontFamily: F.regular }}>Score:</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: C.confidentBlack, background: C.yellow, borderRadius: 4, padding: "1px 8px", fontFamily: F.bold }}>
          {matchedCount} / {MATCH_PAIRS.length}
        </span>
        <span style={{ fontSize: 12, color: C.gray01, fontFamily: F.regular }}>matched</span>
      </div>

      {/* One row per index: left = description A→J, right = shuffled term at that index. Both cells stretch to equal row height. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MATCH_PAIRS.map((pair, index) => {
          const termId = MATCH_TERM_ORDER[index];
          const termPair = MATCH_PAIRS.find(p => p.id === termId)!;
          const isDescMatched = matchedIds[pair.id];
          const isDescSelected = selectedId === pair.id;
          const isDescWrong = wrongDescId === pair.id;
          const isTermMatched = matchedIds[termId];
          const isTermWrong = wrongTermId === termId;
          return (
            <div
              key={pair.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 280px",
                gap: 16,
                alignItems: "stretch",
              }}
            >
              <button
                type="button"
                onClick={() => selectDescription(pair.id)}
                disabled={isDescMatched}
                aria-pressed={isDescSelected}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  height: "100%", alignSelf: "stretch", boxSizing: "border-box",
                  padding: "12px 14px", borderRadius: 9, textAlign: "left",
                  cursor: isDescMatched ? "default" : "pointer",
                  background: isDescMatched ? C.success + "0d" : isDescWrong ? C.destructive + "0d" : isDescSelected ? C.yellowAlpha10 : C.white,
                  border: isDescMatched ? `1px solid ${C.success}70` : isDescWrong ? `1px solid ${C.destructive}70` : isDescSelected ? `1px solid ${C.yellow}` : "1px solid rgba(46,46,56,0.10)",
                  fontFamily: F.regular,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: C.eyebrowGold, flexShrink: 0, width: 16, fontFamily: F.bold }}>{pair.id}</span>
                <span style={{ flex: 1, fontSize: 13, color: C.offBlack, lineHeight: 1.5 }}>{pair.description}</span>
                {isDescMatched && <MatchResultBadge kind="ok" label="Correct match" />}
                {isDescWrong && <MatchResultBadge kind="bad" label="Incorrect match" />}
              </button>

              <div style={{ display: "flex", alignItems: "stretch", gap: 8, minHeight: 0 }}>
                <button
                  type="button"
                  onClick={() => selectTerm(termId)}
                  disabled={isTermMatched || !!wrongTermId}
                  className={isTermWrong ? "match-term-jitter" : undefined}
                  aria-label={`${termPair.term}${isTermMatched ? ", matched" : isTermWrong ? ", incorrect" : ""}`}
                  style={{
                    flex: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    height: "100%", alignSelf: "stretch", boxSizing: "border-box",
                    padding: "12px 14px", borderRadius: 9, textAlign: "center",
                    cursor: isTermMatched ? "default" : "pointer",
                    background: isTermMatched ? C.success + "1a" : isTermWrong ? C.destructive + "1a" : C.gray02,
                    border: isTermMatched ? `1px solid ${C.success}70` : isTermWrong ? `1px solid ${C.destructive}70` : "1px solid rgba(46,46,56,0.10)",
                    fontSize: 13, fontWeight: 700, fontFamily: F.bold,
                    color: isTermMatched ? C.success : C.offBlack,
                  }}
                >
                  {termPair.term}
                </button>
                {/* Same circular slot: Check stays after a correct match; X shows during wrong flash then clears. */}
                <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  {isTermMatched && <MatchResultBadge kind="ok" label="Correct match" />}
                  {isTermWrong && <MatchResultBadge kind="bad" label="Incorrect match" />}
                  {!isTermMatched && !isTermWrong && <span style={{ width: 24, flexShrink: 0 }} aria-hidden />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isComplete && (
        <div style={{
          marginTop: 24, padding: "20px 24px", background: C.yellowAlpha10, border: `1px solid ${C.yellow}44`,
          borderRadius: 12, textAlign: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
            <CheckCircle size={20} color={C.success} strokeWidth={2.5} />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.confidentBlack, fontFamily: F.bold }}>
              Complete — you matched all {MATCH_PAIRS.length}!
            </span>
          </div>
          <button
            type="button"
            onClick={reset}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 24px", border: "1px solid rgba(46,46,56,0.15)", borderRadius: 6,
              background: C.white, color: C.gray01, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F.bold,
            }}
          >
            <RotateCcw size={14} strokeWidth={2} />
            Reset &amp; Try Again
          </button>
        </div>
      )}
    </div>
  );
}

/** Interactive Activity — Exercise 1 (MCQ) + Exercise 2 (match) stacked in one section. */
function PromptingActivitySection() {
  return (
    <section id="match-activity" style={{
      background: SURFACE.neutral.bg,
      padding: `${spacing.sectionPaddingY} 0`,
      textAlign: "center",
      scrollMarginTop: SUBNAV_SCROLL_MARGIN,
    }}>
      <div style={{ ...contentRailStyle }}>
        <SectionAnchorTitle align="center">Activity</SectionAnchorTitle>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: C.confidentBlack, marginBottom: 56, fontFamily: F.bold }}>
          Test Your Prompting Skills
        </h2>

        <div style={{ textAlign: "left", marginBottom: 64 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: C.confidentBlack, marginBottom: 8, fontFamily: F.bold }}>
            Choose the Best Answer
          </h3>
          <p style={{ fontSize: 14, color: C.gray01, lineHeight: 1.6, marginBottom: 24, fontFamily: F.regular, maxWidth: 720 }}>
            For each scenario, choose the single most appropriate prompt element or prompting technique.
          </p>
          <ChooseBestAnswerExercise />
        </div>

        <div style={{ height: 1, background: "rgba(46,46,56,0.10)", marginBottom: 48 }} />

        <div style={{ textAlign: "left" }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: C.confidentBlack, marginBottom: 8, fontFamily: F.bold }}>
            Match the Description
          </h3>
          <p style={{ fontSize: 14, color: C.gray01, lineHeight: 1.6, marginBottom: 24, fontFamily: F.regular, maxWidth: 720 }}>
            Match each description with the correct Prompt Element or Prompting Technique.
          </p>
          <MatchDescriptionExercise />
        </div>
      </div>
    </section>
  );
}

// ── 7 Elements — left nav + detail pane (same pattern as AdvancedDecomposition) ─

type ElemPanelKey = "what" | "why" | "without" | "with";

const ELEM_FACETS: { key: ElemPanelKey; label: string; color: string }[] = [
  { key: "what", label: "What it is", color: C.frameBlue },
  { key: "why", label: "Why it matters", color: C.frameOrange },
  { key: "without", label: "Without", color: C.destructive },
  { key: "with", label: "With", color: C.success },
];

function EightElementsWizard() {
  const s = SURFACE.light;
  const [selectedId, setSelectedId] = useState(ELEMENTS[0].id);
  const elem = ELEMENTS.find(e => e.id === selectedId) ?? ELEMENTS[0];
  const focusRing = `2px solid ${C.yellow}`;

  return (
    <section id="elements" style={{ background: s.bg, padding: `${spacing.sectionPaddingY} 0`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
      <div style={{ ...contentRailStyle, textAlign: "center" }}>
        <SectionAnchorTitle align="center">Elements</SectionAnchorTitle>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: s.heading, fontFamily: F.bold, letterSpacing: "-0.02em", margin: "0 0 12px", textAlign: "center" }}>
          Prompt like a Pro
        </h2>
        <p style={{ fontSize: 16, color: s.body, fontFamily: F.light, lineHeight: "24px", margin: "0 auto 40px", maxWidth: 720, textAlign: "center" }}>
          Each element is a lever — pick one from the list to explore what it is, why it matters, and how it changes a prompt.
        </p>

        <div className="pt-wizard" style={{
          border: `1px solid rgba(46,46,56,0.10)`,
          borderRadius: 12,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "minmax(260px, 300px) 1fr",
          height: 760,
          textAlign: "left",
          background: C.white,
        }}>
          <nav aria-label="Prompt elements" style={{
            background: C.offWhite,
            borderRight: `1px solid rgba(46,46,56,0.08)`,
            padding: "20px 0",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}>
            <div style={{ padding: "0 20px 16px", borderBottom: `1px solid rgba(46,46,56,0.08)` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gray01, fontFamily: F.bold, marginBottom: 4 }}>
                Prompt like a Pro — Elements
              </div>
              <div style={{ fontSize: 13, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.5 }}>
                Pick an element to explore.
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
              {ELEMENTS.map(item => {
                const active = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={active ? "true" : undefined}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      marginBottom: 2,
                      background: active ? C.confidentBlack : "transparent",
                      border: active ? "none" : "1px solid transparent",
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onFocus={e => { e.currentTarget.style.outline = focusRing; }}
                    onBlur={e => { e.currentTarget.style.outline = "none"; }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: active ? C.yellow : item.color + "18",
                      border: `1.5px solid ${active ? C.yellow : item.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 800,
                      color: C.confidentBlack,
                      fontFamily: F.bold,
                    }}>
                      {item.id}
                    </span>
                    <span style={{
                      flex: 1, minWidth: 0,
                      fontSize: 13, fontWeight: 700,
                      color: active ? C.white : C.confidentBlack,
                      fontFamily: F.bold,
                    }}>
                      {item.name}
                    </span>
                    <ChevronRight size={14} color={active ? C.yellow : C.gray01} style={{ flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </nav>

          <div style={{ display: "flex", flexDirection: "column", background: C.white, minHeight: 0 }}>
            <div style={{
              padding: "16px 24px",
              background: C.confidentBlack,
              borderBottom: `1px solid ${C.borderOnDark}`,
              display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
              flexShrink: 0,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: C.yellow, color: C.confidentBlack,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, fontFamily: F.bold,
              }}>
                {elem.id}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.onDark, fontFamily: F.bold }}>{elem.name}</span>
              <span style={{ fontSize: 11, color: C.yellow, fontWeight: 700, fontFamily: F.bold }}>{elem.q}</span>
            </div>

            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}>
              {ELEM_FACETS.map(f => {
                const isExample = f.key === "without" || f.key === "with";
                const text = elem[f.key];
                return (
                  <section key={f.key} aria-labelledby={`elem-facet-${elem.id}-${f.key}`}>
                    <span
                      id={`elem-facet-${elem.id}-${f.key}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                        padding: "4px 10px",
                        borderRadius: 100,
                        border: `1px solid ${f.color}55`,
                        background: f.color + "14",
                        fontSize: 12,
                        fontWeight: 700,
                        color: f.color,
                        fontFamily: F.bold,
                        lineHeight: 1.3,
                      }}
                    >
                      {f.key === "without" && <MatchResultBadge kind="bad" label="Without this element" />}
                      {f.key === "with" && <MatchResultBadge kind="ok" label="With this element" />}
                      {f.label}
                    </span>
                    <p style={{
                      fontSize: isExample ? 14 : 16,
                      lineHeight: 1.7,
                      color: f.key === "without" ? C.destructive : f.key === "with" ? C.success : C.offBlack,
                      fontFamily: isExample ? F.light : F.regular,
                      fontStyle: isExample ? "italic" : "normal",
                      margin: 0,
                      maxWidth: 560,
                      padding: isExample ? "14px 18px" : 0,
                      background: isExample
                        ? f.key === "without" ? C.destructive + "0a" : C.success + "0a"
                        : "transparent",
                      borderRadius: isExample ? 8 : 0,
                      borderLeft: isExample ? `3px solid ${f.color}` : "none",
                    }}>
                      {text}
                    </p>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdvancedViewToggle({ view, onChange, onDark = false }: { view: AdvancedView; onChange: (v: AdvancedView) => void; onDark?: boolean }) {
  const focusRing = `2px solid ${C.yellow}`;
  const options: { id: AdvancedView; label: string; Icon: typeof Table2; hint: string }[] = [
    { id: "wizard", label: "Techniques", Icon: ListTree, hint: "8 pro techniques — one at a time" },
    { id: "table", label: "Level Up", Icon: Table2, hint: "Advanced catalog with tax use cases" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Techniques view"
      style={{
        display: "inline-flex",
        background: onDark ? C.white : C.offWhite,
        border: `1px solid rgba(46,46,56,0.10)`,
        borderRadius: 10,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map(({ id, label, Icon, hint }) => {
        const active = view === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            title={hint}
            onClick={() => onChange(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              background: active ? C.confidentBlack : "transparent",
              color: active ? C.white : C.gray01,
              fontSize: 13,
              fontWeight: active ? 700 : 500,
              fontFamily: active ? F.bold : F.regular,
              transition: "background 0.15s, color 0.15s",
            }}
            onFocus={e => { e.currentTarget.style.outline = focusRing; }}
            onBlur={e => { e.currentTarget.style.outline = "none"; }}
          >
            <Icon size={15} strokeWidth={2} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function TechniqueExampleQuote({ text, variant }: { text: string; variant: "without" | "with" }) {
  const accent = variant === "without" ? C.destructive : C.success;
  return (
    <div style={{
      background: accent + "0a",
      borderRadius: 8,
      padding: "10px 12px",
      borderLeft: `3px solid ${accent}`,
    }}>
      <p style={{
        margin: 0,
        fontSize: typeScale.body.size,
        lineHeight: 1.6,
        fontFamily: F.regular,
        fontStyle: "italic",
        color: C.gray01,
      }}>
        {text}
      </p>
    </div>
  );
}

/** Block 1 — left nav + detail pane (mirrors EightElementsWizard / AdvancedFrameworkShell). */
function PromptingTechniquesWizard() {
  const [selectedId, setSelectedId] = useState(PROMPTING_TECHNIQUES[0].id);
  const technique = PROMPTING_TECHNIQUES.find(t => t.id === selectedId) ?? PROMPTING_TECHNIQUES[0];
  const focusRing = `2px solid ${C.yellow}`;

  return (
    <div className="pt-wizard" style={{
      border: `1px solid rgba(46,46,56,0.10)`,
      borderRadius: 12,
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "minmax(260px, 300px) 1fr",
      height: 760,
      textAlign: "left",
      background: C.white,
    }}>
      <nav aria-label="Prompting techniques" style={{
        background: C.offWhite,
        borderRight: `1px solid rgba(46,46,56,0.08)`,
        padding: "14px 0",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}>
        <div style={{ padding: "0 16px 12px", borderBottom: `1px solid rgba(46,46,56,0.08)` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gray01, fontFamily: F.bold, marginBottom: 4 }}>
            Prompt like a Pro — Techniques
          </div>
          <div style={{ fontSize: 13, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.5 }}>
            Pick a technique to explore.
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          {PROMPTING_TECHNIQUES.map(item => {
            const active = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => setSelectedId(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  marginBottom: 2,
                  background: active ? C.confidentBlack : "transparent",
                  border: active ? "none" : "1px solid transparent",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onFocus={e => { e.currentTarget.style.outline = focusRing; }}
                onBlur={e => { e.currentTarget.style.outline = "none"; }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: active ? C.yellow : item.color + "18",
                  border: `1.5px solid ${active ? C.yellow : item.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800,
                  color: C.confidentBlack,
                  fontFamily: F.bold,
                }}>
                  {item.id}
                </span>
                <span style={{
                  flex: 1, minWidth: 0,
                  fontSize: 13, fontWeight: 700,
                  color: active ? C.white : C.confidentBlack,
                  fontFamily: F.bold,
                }}>
                  {item.technique}
                </span>
                <ChevronRight size={14} color={active ? C.yellow : C.gray01} style={{ flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{ display: "flex", flexDirection: "column", background: C.white, minHeight: 0 }}>
        <div style={{
          padding: "12px 20px",
          borderBottom: `1px solid rgba(46,46,56,0.08)`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: C.yellow, color: C.confidentBlack,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, fontFamily: F.bold,
            }}>
              {technique.id}
            </span>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.confidentBlack, fontFamily: F.bold, margin: 0 }}>
              {technique.technique}
            </h3>
          </div>
          <p style={{
            fontSize: 11,
            color: C.gray01,
            fontFamily: F.regular,
            lineHeight: 1.5,
            margin: "4px 0 0",
            paddingLeft: 36,
          }}>
            {technique.does}
          </p>
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          {TECHNIQUE_FACETS.map(f => {
            const text = technique[f.key];
            return (
              <section key={f.key} aria-labelledby={`tech-facet-${technique.id}-${f.key}`}>
                <span
                  id={`tech-facet-${technique.id}-${f.key}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    padding: "4px 10px",
                    borderRadius: 100,
                    border: `1px solid ${f.color}55`,
                    background: f.color + "14",
                    fontSize: 12,
                    fontWeight: 700,
                    color: f.color,
                    fontFamily: F.bold,
                    lineHeight: 1.3,
                  }}
                >
                  {f.key === "without" && <MatchResultBadge kind="bad" label="Without the technique" />}
                  {f.key === "with" && <MatchResultBadge kind="ok" label="With the technique" />}
                  {f.label}
                </span>
                {/* Inlined rather than a boolean flag so TS narrows f.key to
                    the "without" | "with" variant TechniqueExampleQuote wants. */}
                {f.key === "without" || f.key === "with" ? (
                  <TechniqueExampleQuote text={text} variant={f.key} />
                ) : (
                  <p style={{
                    fontSize: typeScale.body.size,
                    lineHeight: 1.6,
                    color: C.gray01,
                    fontFamily: F.regular,
                    margin: 0,
                    maxWidth: 560,
                  }}>
                    {text}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AdvancedUseCaseBanner() {
  return (
    <div
      aria-label="Advanced techniques use case"
      style={{
        marginBottom: 0,
        padding: "14px 20px",
        background: C.white,
        borderRadius: 10,
        border: `1px solid rgba(255,230,0,0.45)`,
        boxShadow: `inset 4px 0 0 ${C.yellow}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: C.confidentBlack,
        fontFamily: F.bold,
        background: C.yellow,
        padding: "4px 10px",
        borderRadius: 4,
        flexShrink: 0,
      }}>
        Use case
      </span>
      <span style={{
        fontSize: 14,
        fontWeight: 700,
        color: C.confidentBlack,
        fontFamily: F.bold,
        lineHeight: 1.5,
      }}>
        {ADVANCED_USE_CASE}
      </span>
    </div>
  );
}

function AdvancedBucketToggle({ bucketId, onChange, onDark = false }: { bucketId: AdvancedBucketId; onChange: (id: AdvancedBucketId) => void; onDark?: boolean }) {
  const focusRing = `2px solid ${C.yellow}`;
  return (
    <div
      role="tablist"
      aria-label="Advanced technique bucket"
      style={{
        display: "inline-flex",
        background: onDark ? C.white : C.offWhite,
        border: `1px solid rgba(46,46,56,0.10)`,
        borderRadius: 10,
        padding: 4,
        gap: 4,
      }}
    >
      {ADVANCED_BUCKETS.map(b => {
        const active = bucketId === b.id;
        return (
          <button
            key={b.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(b.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              background: active ? C.confidentBlack : "transparent",
              color: active ? C.white : C.gray01,
              fontSize: 13,
              fontWeight: active ? 700 : 500,
              fontFamily: active ? F.bold : F.regular,
              transition: "background 0.15s, color 0.15s",
              whiteSpace: "nowrap",
            }}
            onFocus={e => { e.currentTarget.style.outline = focusRing; }}
            onBlur={e => { e.currentTarget.style.outline = "none"; }}
          >
            {b.label}
          </button>
        );
      })}
    </div>
  );
}

/** Minimal stepped-flow visual — a row of labelled steps joined by arrows. Reused by
 *  Decomposition / Ensemble / Self-Criticism panels below instead of a bespoke diagram system. */
function SteppedFlow({ steps }: { steps: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, margin: "16px 0" }}>
      {steps.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: `1px solid rgba(46,46,56,0.12)`,
            background: C.offWhite,
            color: C.confidentBlack,
            fontSize: 12,
            fontWeight: 700,
            fontFamily: F.bold,
            lineHeight: 1.4,
          }}>
            {step}
          </span>
          {i < steps.length - 1 && (
            <ArrowRight size={14} color={C.gray01} strokeWidth={2} style={{ flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  );
}

/** Technique card — name + purpose + one-line explanation, in the same visual language as
 *  AdvancedDecomposition's facet pills, condensed into a compact card for chip-filtered groups. */
function AdvancedFrameworkCard({ name, purpose, explain, samplePrompt }: COTTechnique) {
  return (
    <div style={{
      border: `1px solid rgba(46,46,56,0.10)`,
      borderRadius: 10,
      padding: "16px 18px",
      background: C.offWhite,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.confidentBlack, fontFamily: F.bold, marginBottom: 4 }}>
        {name}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.frameBlue, fontFamily: F.bold, marginBottom: 6 }}>
        {purpose}
      </div>
      <p style={{ fontSize: 13, color: C.gray01, fontFamily: F.regular, lineHeight: 1.6, margin: 0 }}>
        {explain}
      </p>
      {samplePrompt && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: C.white,
            border: `1px solid rgba(46,46,56,0.10)`,
            borderLeft: `3px solid ${C.yellow}`,
            borderRadius: 6,
          }}
        >
          <p style={{
            margin: "0 0 6px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.gray01,
            fontFamily: F.bold,
          }}>
            Sample prompt
          </p>
          <p style={{
            margin: 0,
            fontSize: 12,
            fontStyle: "italic",
            lineHeight: 1.55,
            color: C.offBlack,
            fontFamily: F.light,
          }}>
            &ldquo;{samplePrompt}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

function ChainOfThoughtPanel() {
  const [groupId, setGroupId] = useState<COTGroupId>(COT_GROUPS[0].id);
  const group = COT_GROUPS.find(g => g.id === groupId) ?? COT_GROUPS[0];

  return (
    <>
      <p style={{ fontSize: 14, color: C.gray01, fontFamily: F.regular, lineHeight: 1.6, margin: "0 0 16px" }}>
        Instead of jumping directly to an answer, AI is asked to reason before responding.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {COT_GROUPS.map(g => {
          const active = g.id === groupId;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroupId(g.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 100,
                border: `1px solid ${active ? C.confidentBlack : "rgba(46,46,56,0.15)"}`,
                background: active ? C.confidentBlack : C.white,
                color: active ? C.white : C.offBlack,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: F.bold,
                cursor: "pointer",
              }}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {group.framing && (
        <p style={{ fontSize: 13, color: C.gray01, fontFamily: F.light, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 16px" }}>
          {group.framing}
        </p>
      )}

      {group.tableRows ? (
        <div style={{ border: `1px solid rgba(46,46,56,0.10)`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", background: C.offWhite, padding: "12px 18px", gap: 16 }}>
            {["Confidence Level", "Typical Action"].map(h => (
              <span key={h} style={{ color: C.gray01, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: F.bold }}>
                {h}
              </span>
            ))}
          </div>
          {group.tableRows.map((row, i) => (
            <div key={row.confidence} style={{
              display: "grid", gridTemplateColumns: "1.2fr 1.8fr", padding: "14px 18px", gap: 16,
              background: i % 2 === 0 ? C.white : C.offWhite,
              borderTop: `1px solid rgba(46,46,56,0.07)`,
            }}>
              <span style={{ color: C.confidentBlack, fontSize: 13, fontWeight: 700, fontFamily: F.bold, lineHeight: 1.5 }}>{row.confidence}</span>
              <span style={{ color: C.gray01, fontSize: 13, fontFamily: F.regular, lineHeight: 1.6 }}>{row.action}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {(group.techniques ?? []).map(t => <AdvancedFrameworkCard key={t.name} {...t} />)}
        </div>
      )}
    </>
  );
}

function DecompositionPanel() {
  const [showExample, setShowExample] = useState(true);

  return (
    <>
      <p style={{ fontSize: 14, color: C.gray01, fontFamily: F.regular, lineHeight: 1.6, margin: "0 0 8px" }}>
        Break a large problem into smaller tasks and apply the most appropriate prompting technique to each part.
      </p>

      <SteppedFlow steps={DECOMPOSITION_FLOW} />

      <button
        type="button"
        onClick={() => setShowExample(v => !v)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "transparent", border: "none", cursor: "pointer", padding: 0,
          color: C.eyebrowGold, fontSize: 13, fontWeight: 700, fontFamily: F.bold,
          marginTop: 8,
        }}
      >
        {showExample ? "Hide worked example" : "See worked example"}
        <ChevronRight size={14} strokeWidth={2} style={{ transform: showExample ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      {showExample && (
        <div style={{ marginTop: 14, border: `1px solid rgba(46,46,56,0.10)`, borderRadius: 10, overflow: "hidden" }}>
          {/* Task label — quoted highlight box */}
          <div style={{
            background: C.offWhite,
            borderBottom: `1px solid rgba(46,46,56,0.08)`,
            padding: "14px 20px",
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <div style={{ width: 3, flexShrink: 0, borderRadius: 2, background: C.eyebrowGold, alignSelf: "stretch" }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.eyebrowGold, fontFamily: F.bold, marginBottom: 4 }}>
                Tax Task
              </div>
              <div style={{ fontSize: 13, color: C.confidentBlack, fontFamily: F.bold, lineHeight: 1.5 }}>
                &ldquo;Assess implications of a cross-border restructuring&rdquo;
              </div>
            </div>
          </div>

          {/* Decomposed tasks */}
          <div style={{ padding: "14px 20px", background: C.white }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gray01, fontFamily: F.bold, marginBottom: 10 }}>
              Decomposed Into
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {DECOMPOSITION_EXAMPLE_TASKS.map((task, i) => (
                <li key={task} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    background: C.offWhite, border: `1px solid rgba(46,46,56,0.12)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: C.gray01, fontFamily: F.bold,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.5 }}>{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technique chips */}
          <div style={{ padding: "12px 20px 14px", background: C.offWhite, borderTop: `1px solid rgba(46,46,56,0.08)` }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gray01, fontFamily: F.bold, marginBottom: 8 }}>
              Each task can then use
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Step-Back", "Analogical", "Tabular COT", "Contrastive COT"].map(t => (
                <span key={t} style={{
                  display: "inline-block", padding: "3px 10px", borderRadius: 4,
                  background: C.white, border: `1px solid rgba(46,46,56,0.12)`,
                  fontSize: 12, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.6,
                }}>{t}</span>
              ))}
              <span style={{ fontSize: 12, color: C.gray01, fontFamily: F.light, fontStyle: "italic", alignSelf: "center" }}>— where appropriate</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EnsemblePanel() {
  return (
    <>
      <p style={{ fontSize: 14, color: C.gray01, fontFamily: F.regular, lineHeight: 1.6, margin: "0 0 8px" }}>
        Do not rely on a single answer. Generate multiple answers and use a judge to determine the strongest response.
      </p>

      <SteppedFlow steps={ENSEMBLE_FLOW} />

      <p style={{ fontSize: 13, color: C.gray01, fontFamily: F.light, fontStyle: "italic", lineHeight: 1.6, margin: "8px 0 12px" }}>
        Think of it as: &ldquo;What if I asked ten experts instead of one?&rdquo;
      </p>

      <div style={{ border: `1px solid rgba(46,46,56,0.10)`, borderRadius: 10, overflow: "hidden", marginTop: 4 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2.2fr 1fr", background: C.offWhite, padding: "12px 18px", gap: 16 }}>
          {["Method", "How It Works", "Improves"].map(h => (
            <span key={h} style={{ color: C.gray01, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: F.bold }}>
              {h}
            </span>
          ))}
        </div>
        {ENSEMBLE_METHODS.map((row, i) => (
          <div key={row.name} style={{
            display: "grid", gridTemplateColumns: "1.2fr 2.2fr 1fr", padding: "14px 18px", gap: 16, alignItems: "start",
            background: i % 2 === 0 ? C.white : C.offWhite,
            borderTop: `1px solid rgba(46,46,56,0.07)`,
          }}>
            <span style={{ color: C.confidentBlack, fontSize: 13, fontWeight: 700, fontFamily: F.bold, lineHeight: 1.5 }}>{row.name}</span>
            <span style={{ color: C.gray01, fontSize: 13, fontFamily: F.regular, lineHeight: 1.6 }}>{row.how}</span>
            <span style={{ color: C.offBlack, fontSize: 13, fontFamily: F.regular, lineHeight: 1.6 }}>{row.improves}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function SelfCriticismPanel() {
  const [openId, setOpenId] = useState<string | null>(SELF_CRITICISM_TECHNIQUES[0].id);

  return (
    <>
      <p style={{ fontSize: 14, color: C.gray01, fontFamily: F.regular, lineHeight: 1.6, margin: "0 0 16px" }}>
        Reduce hallucinations and improve factual reliability. Before trusting the answer: critique it, verify it, challenge it.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SELF_CRITICISM_TECHNIQUES.map(t => {
          const open = openId === t.id;
          return (
            <div key={t.id} style={{ border: `1px solid rgba(46,46,56,0.10)`, borderRadius: 10, overflow: "hidden" }}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : t.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "14px 18px", background: C.offWhite, border: "none", cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: C.confidentBlack, fontFamily: F.bold }}>{t.name}</span>
                <ChevronRight size={16} color={C.gray01} style={{ flexShrink: 0, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
              </button>
              {open && (
                <div style={{ padding: "16px 18px", background: C.white, borderTop: `1px solid rgba(46,46,56,0.08)` }}>
                  <SteppedFlow steps={t.flow} />
                  {t.checklist && (
                    <ul style={{ margin: "8px 0 0", padding: "0 0 0 20px" }}>
                      {t.checklist.map(item => (
                        <li key={item} style={{ fontSize: 13, color: C.gray01, fontFamily: F.regular, lineHeight: 1.8 }}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/** Memory Aid — compact reference table shown below the 4-stage framework. */
function MemoryAidTable() {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.eyebrowGold, fontFamily: F.bold, marginBottom: 10 }}>
        Memory Aid
      </div>
      <div style={{ border: `1px solid rgba(46,46,56,0.10)`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 2fr", background: C.offWhite, padding: "12px 18px", gap: 16 }}>
          {["Technique", "Think Of It As", "Typical India Tax Use Cases"].map(h => (
            <span key={h} style={{ color: C.gray01, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: F.bold }}>
              {h}
            </span>
          ))}
        </div>
        {MEMORY_AID_ROWS.map((row, i) => (
          <div key={row.technique} style={{
            display: "grid", gridTemplateColumns: "1.2fr 1fr 2fr", padding: "14px 18px", gap: 16, alignItems: "start",
            background: i % 2 === 0 ? C.white : C.offWhite,
            borderTop: `1px solid rgba(46,46,56,0.07)`,
          }}>
            <span style={{ color: C.confidentBlack, fontSize: 13, fontWeight: 700, fontFamily: F.bold, lineHeight: 1.5 }}>{row.technique}</span>
            <span style={{ color: C.frameBlue, fontSize: 13, fontWeight: 700, fontFamily: F.bold, lineHeight: 1.5 }}>{row.thinkOf}</span>
            <span style={{ color: C.gray01, fontSize: 13, fontFamily: F.regular, lineHeight: 1.6 }}>{row.useCases}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Left-nav + detail-pane shell for the 4-stage framework — layout borrowed from
 *  EightElementsWizard's flat single-level nav (simpler fit than AdvancedDecomposition's
 *  nested category/technique nav, since each bucket only ever has 2 stages). */
function AdvancedFrameworkShell({ bucket, stageId, onSelectStage }: { bucket: AdvancedBucket; stageId: AdvancedStageId; onSelectStage: (id: AdvancedStageId) => void }) {
  const stage = bucket.stages.find(s => s.id === stageId) ?? bucket.stages[0];
  const focusRing = `2px solid ${C.yellow}`;

  const panel = stage.id === "cot" ? <ChainOfThoughtPanel />
    : stage.id === "decomposition" ? <DecompositionPanel />
    : stage.id === "ensemble" ? <EnsemblePanel />
    : <SelfCriticismPanel />;

  return (
    <div className="af-shell" style={{
      border: `1px solid rgba(46,46,56,0.10)`,
      borderRadius: 12,
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "minmax(260px, 300px) 1fr",
      height: 650,
      textAlign: "left",
      background: C.white,
    }}>
      <nav aria-label="Advanced technique stages" style={{
        background: C.offWhite,
        borderRight: `1px solid rgba(46,46,56,0.08)`,
        padding: "14px 0",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}>
        <div style={{ padding: "0 16px 12px", borderBottom: `1px solid rgba(46,46,56,0.08)` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gray01, fontFamily: F.bold, marginBottom: 4 }}>
            {bucket.label}
          </div>
          <div style={{ fontSize: 13, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.5 }}>
            Pick a stage to explore.
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          {bucket.stages.map((s, i) => {
            const active = stageId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => onSelectStage(s.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  marginBottom: 2,
                  background: active ? C.confidentBlack : "transparent",
                  border: active ? "none" : "1px solid transparent",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onFocus={e => { e.currentTarget.style.outline = focusRing; }}
                onBlur={e => { e.currentTarget.style.outline = "none"; }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: active ? C.yellow : C.frameBlue + "18",
                  border: `1.5px solid ${active ? C.yellow : C.frameBlue}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800,
                  color: active ? C.confidentBlack : C.frameBlue,
                  fontFamily: F.bold,
                }}>
                  {i + 1}
                </span>
                <span style={{
                  flex: 1, minWidth: 0,
                  fontSize: 13, fontWeight: 700,
                  color: active ? C.white : C.confidentBlack,
                  fontFamily: F.bold,
                }}>
                  {s.name}
                </span>
                <ChevronRight size={14} color={active ? C.yellow : C.gray01} style={{ flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{ display: "flex", flexDirection: "column", background: C.white, minHeight: 0 }}>
        <div style={{
          padding: "12px 20px",
          borderBottom: `1px solid rgba(46,46,56,0.08)`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: C.yellow, color: C.confidentBlack,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, fontFamily: F.bold,
            }}>
              {bucket.stages.findIndex(s => s.id === stage.id) + 1}
            </span>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.confidentBlack, fontFamily: F.bold, margin: 0 }}>
              {stage.name}
            </h3>
          </div>
          <p style={{
            fontSize: 11,
            color: C.gray01,
            fontFamily: F.regular,
            lineHeight: 1.5,
            margin: "4px 0 0",
            paddingLeft: 36,
          }}>
            {stage.subtitle}
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px", minHeight: 0 }}>
          {panel}
        </div>
      </div>
    </div>
  );
}

type AdvancedTab = "techniques" | "advanced";

function AdvancedBlockToggle({ activeTab, onChange, onDark = false }: { activeTab: AdvancedTab; onChange: (t: AdvancedTab) => void; onDark?: boolean }) {
  const focusRing = `2px solid ${C.yellow}`;
  const options: { id: AdvancedTab; label: string }[] = [
    { id: "techniques", label: "Basic Prompting Techniques" },
    { id: "advanced", label: "Advanced Prompting Techniques" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Techniques section"
      style={{
        display: "inline-flex",
        background: onDark ? "rgba(255,255,255,0.06)" : C.offWhite,
        border: `1px solid ${onDark ? C.borderOnDark : "rgba(46,46,56,0.10)"}`,
        borderRadius: 10,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map(({ id, label }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 18px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              background: active ? C.confidentBlack : "transparent",
              color: active ? C.white : (onDark ? C.gray02 : C.gray01),
              fontSize: 13,
              fontWeight: active ? 700 : 400,
              fontFamily: active ? F.bold : F.regular,
              transition: "background 0.15s, color 0.15s",
              whiteSpace: "nowrap",
            }}
            onFocus={e => { e.currentTarget.style.outline = focusRing; }}
            onBlur={e => { e.currentTarget.style.outline = "none"; }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function AdvancedTechniquesSection({ onDark = false }: { onDark?: boolean }) {
  const [activeTab, setActiveTab] = useState<AdvancedTab>("techniques");
  const [bucketId, setBucketId] = useState<AdvancedBucketId>(ADVANCED_BUCKETS[0].id);
  const [stageId, setStageId] = useState<AdvancedStageId>(ADVANCED_BUCKETS[0].stages[0].id);
  const bucket = ADVANCED_BUCKETS.find(b => b.id === bucketId) ?? ADVANCED_BUCKETS[0];

  const selectBucket = (id: AdvancedBucketId) => {
    const next = ADVANCED_BUCKETS.find(b => b.id === id);
    if (!next) return;
    setBucketId(id);
    setStageId(next.stages[0].id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <AdvancedBlockToggle activeTab={activeTab} onChange={setActiveTab} onDark={onDark} />

      {activeTab === "techniques" && (
        <div role="tabpanel" aria-label="Prompting Techniques">
          <PromptingTechniquesWizard />
        </div>
      )}

      {activeTab === "advanced" && (
        <div role="tabpanel" aria-label="Advanced Prompting Techniques">
          <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <AdvancedUseCaseBanner />
            <AdvancedBucketToggle bucketId={bucketId} onChange={selectBucket} onDark={onDark} />
          </div>
          <AdvancedFrameworkShell bucket={bucket} stageId={stageId} onSelectStage={setStageId} />
          <MemoryAidTable />
        </div>
      )}
    </div>
  );
}

function AdvancedDecomposition() {
  const [openCategoryId, setOpenCategoryId] = useState(ADVANCED_CATEGORIES[0].id);
  const [selected, setSelected] = useState<{ categoryId: string; techniqueId: string }>({
    categoryId: ADVANCED_CATEGORIES[0].id,
    techniqueId: ADVANCED_CATEGORIES[0].techniques[0].id,
  });

  const category = ADVANCED_CATEGORIES.find(c => c.id === selected.categoryId)!;
  const technique = category.techniques.find(t => t.id === selected.techniqueId)!;

  const selectTechnique = (categoryId: string, techniqueId: string) => {
    setSelected({ categoryId, techniqueId });
    setOpenCategoryId(categoryId);
  };

  const focusRing = `2px solid ${C.yellow}`;

  return (
    <div style={{
      border: `1px solid rgba(46,46,56,0.10)`,
      borderRadius: 12,
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "minmax(260px, 300px) 1fr",
      minHeight: 520,
    }}>
      <nav aria-label="Advanced technique categories" style={{
        background: C.offWhite,
        borderRight: `1px solid rgba(46,46,56,0.08)`,
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: "0 20px 16px", borderBottom: `1px solid rgba(46,46,56,0.08)` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gray01, fontFamily: F.bold, marginBottom: 4 }}>
            Prompt like a Pro — Techniques
          </div>
          <div style={{ fontSize: 13, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.5 }}>
            Pick a technique to explore.
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
          {ADVANCED_CATEGORIES.map(cat => {
            const isOpen = openCategoryId === cat.id;
            return (
              <div key={cat.id} style={{ marginBottom: 6 }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenCategoryId(isOpen ? "" : cat.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: isOpen ? C.white : "transparent",
                    border: isOpen ? `1px solid rgba(46,46,56,0.10)` : "1px solid transparent",
                    borderRadius: 8,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onFocus={e => { e.currentTarget.style.outline = focusRing; }}
                  onBlur={e => { e.currentTarget.style.outline = "none"; }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: cat.color + "18", border: `1.5px solid ${cat.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, color: cat.color, fontFamily: F.bold,
                  }}>
                    {ADVANCED_CATEGORIES.indexOf(cat) + 1}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.confidentBlack, fontFamily: F.bold }}>{cat.name}</span>
                    <span style={{ display: "block", fontSize: 11, color: C.gray01, fontFamily: F.regular, marginTop: 2 }}>
                      {cat.techniques.length} technique{cat.techniques.length > 1 ? "s" : ""}
                    </span>
                  </span>
                  <ChevronRight size={14} color={C.gray01} style={{
                    flexShrink: 0,
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition: "transform 0.15s",
                  }} />
                </button>

                {isOpen && (
                  <div style={{ marginTop: 4, marginLeft: 14, paddingLeft: 14, borderLeft: `2px solid ${cat.color}44` }}>
                    {cat.techniques.map(t => {
                      const active = selected.categoryId === cat.id && selected.techniqueId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          aria-current={active ? "true" : undefined}
                          onClick={() => selectTechnique(cat.id, t.id)}
                          style={{
                            width: "100%",
                            display: "block",
                            padding: "8px 12px",
                            marginBottom: 2,
                            background: active ? C.confidentBlack : "transparent",
                            border: active ? "none" : "1px solid transparent",
                            borderRadius: 6,
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: 12,
                            fontWeight: active ? 700 : 500,
                            color: active ? C.white : C.offBlack,
                            fontFamily: active ? F.bold : F.regular,
                            lineHeight: 1.4,
                          }}
                          onFocus={e => { e.currentTarget.style.outline = focusRing; }}
                          onBlur={e => { e.currentTarget.style.outline = "none"; }}
                        >
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Detail pane — all facets stacked (no secondary tab/stepper) */}
      <div style={{ display: "flex", flexDirection: "column", background: C.white, minHeight: 0 }}>
        <div style={{
          padding: "16px 24px",
          borderBottom: `1px solid rgba(46,46,56,0.08)`,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.confidentBlack, fontFamily: F.bold }}>{technique.name}</span>
          <span style={{ fontSize: 11, color: category.color, fontWeight: 600, fontFamily: F.bold }}>{technique.tagline}</span>
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {FACETS.map(f => {
            const isExample = f.key === "without" || f.key === "with";
            return (
              <section key={f.key} aria-labelledby={`facet-${technique.id}-${f.key}`}>
                <span
                  id={`facet-${technique.id}-${f.key}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginBottom: 10,
                    padding: "4px 10px",
                    borderRadius: 100,
                    border: `1px solid ${f.color}55`,
                    background: f.color + "14",
                    fontSize: 12,
                    fontWeight: 700,
                    color: f.color,
                    fontFamily: F.bold,
                    lineHeight: 1.3,
                  }}
                >
                  {f.label}
                </span>
                <p style={{
                  fontSize: isExample ? 14 : 16,
                  lineHeight: 1.7,
                  color: f.key === "without" ? C.destructive : f.key === "with" ? C.success : C.offBlack,
                  fontFamily: isExample ? F.light : F.regular,
                  fontStyle: isExample ? "italic" : "normal",
                  margin: 0,
                  maxWidth: 560,
                  padding: isExample ? "14px 18px" : 0,
                  background: isExample
                    ? f.key === "without" ? C.destructive + "0a" : C.success + "0a"
                    : "transparent",
                  borderRadius: isExample ? 8 : 0,
                  borderLeft: isExample ? `3px solid ${f.color}` : "none",
                }}>
                  {technique[f.key]}
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function AiTaxPrompting({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (path: string) => void;
}) {
  useModuleSectionHashScroll();

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: C.white }}>

      <SiteHeader variant="learning" onNavigate={onNavigate} skipLinkTarget="#module-content" />
      <ModuleHeader currentModuleId="ai-tax-prompting" onNavigate={onNavigate} onBack={onBack} />

      {/* ── 1. HERO — dark + atmospheric Adobe stock ── */}
      <section
        id="module-content"
        style={{
          padding: `${spacing.sectionPaddingY} ${contentInlinePad} 72px`,
          minHeight: "420px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: C.confidentBlack,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Soft left scrim so white type stays readable over the bloom */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(26,26,36,0.97) 0%, rgba(26,26,36,0.84) 45%, rgba(26,26,36,0.45) 72%, rgba(26,26,36,0.28) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Spectrum accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: spectrumCss(5), zIndex: 2 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
          {/* Eyebrow pill hidden site-wide per request — see AI_TAX_PROMPTING pill removal
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,230,0,0.08)", border: "1px solid rgba(255,230,0,0.25)",
            borderRadius: 24, padding: "6px 18px", marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.yellow }} />
            <span style={{ color: C.yellow, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", fontFamily: F.bold }}>
              PART 2 · AI TAX LABS
            </span>
          </div>
          */}
          <h1 style={{ fontSize: 52, fontWeight: 700, color: C.white, lineHeight: 1.15, marginTop: 28, marginBottom: 20, fontFamily: F.bold }}>
            The Difference Is the{" "}
            <span style={{ color: C.yellow }}>Prompt</span>
          </h1>
          {/* <p style={{ fontSize: 19, color: C.gray02, fontWeight: 300, lineHeight: 1.7, maxWidth: 660, fontFamily: F.light }}>
            A prompt isn&apos;t just a question — it&apos;s a structured instruction that determines the quality of everything AI gives you back.
          </p> */}
        </div>
      </section>

      {/* ── 2. THE PIPELINE — neutral ── */}
      <section id="pipeline" style={{ background: SURFACE.neutral.bg, padding: `${spacing.sectionPaddingY} 0`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
        <div style={{ ...contentRailStyle, display: "flex", flexDirection: "column", gap: 48, alignItems: "center" }}>
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
            <SectionAnchorTitle align="center">Prompt Basics</SectionAnchorTitle>
            <h2 style={{
              fontSize: 32, fontWeight: 700, color: C.offBlack, fontFamily: F.bold,
              lineHeight: 1.2, letterSpacing: "-0.32px", textAlign: "center", margin: 0,
            }}>
              A Prompt Is Simply an Instruction
            </h2>
            <p style={{
              fontSize: 16, color: C.offBlack, fontFamily: F.light, lineHeight: "24px",
              textAlign: "center", maxWidth: 760, margin: 0,
            }}>
              AI responds to the instructions you provide. Better instructions produce better results
            </p>
          </div>

          {/* Flow diagram + core rules */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%", alignItems: "center" }}>
            <div style={{
              background: C.confidentBlack, border: `1px solid ${C.gray02}`, borderRadius: 16,
              padding: 32, width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 24, flexWrap: "wrap",
            }}>
              {/* YOU */}
              <div style={{
                background: C.white, border: `1.5px solid ${C.gray02}`, borderRadius: 16,
                width: 220, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              }}>
                <div style={{ background: C.info + "33", borderRadius: 100, padding: 12, display: "flex" }}>
                  <User size={24} color={C.info} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 15, color: C.offBlack, fontFamily: F.bold, lineHeight: "25.5px" }}>YOU</span>
                <span style={{
                  border: `1px solid ${C.gray02}`, borderRadius: 16, padding: "2px 8px",
                  fontSize: 14, color: C.offBlack, fontFamily: F.regular, lineHeight: "22.4px",
                }}>Instruction</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: C.gray01, fontFamily: F.regular }}>sends prompt</span>
                <ArrowRight size={16} color={C.white} strokeWidth={2} />
              </div>

              {/* AI */}
              <div style={{
                background: C.yellow, border: `1.5px solid ${C.gray02}`, borderRadius: 16,
                width: 220, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              }}>
                <div style={{ background: C.yellow, borderRadius: 100, padding: 12, display: "flex" }}>
                  <Cpu size={24} color={C.offBlack} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 15, color: C.offBlack, fontFamily: F.bold, lineHeight: "25.5px" }}>AI</span>
                <span style={{
                  border: `1px solid ${C.gray02}`, borderRadius: 16, padding: "2px 8px",
                  fontSize: 14, color: C.offBlack, fontFamily: F.regular, lineHeight: "22.4px",
                  background: C.yellow,
                }}>Processes</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: C.gray01, fontFamily: F.regular }}>returns output</span>
                <ArrowRight size={16} color={C.white} strokeWidth={2} />
              </div>

              {/* RESULT — light success surface so dark type stays WCAG-readable */}
              <div style={{
                background: C.white, border: `1.5px solid ${C.gray02}`, borderRadius: 16,
                width: 220, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              }}>
                <div style={{ background: "rgba(0,200,100,0.12)", borderRadius: 100, padding: 12, display: "flex" }}>
                  <CheckCircle size={24} color={C.success} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 15, color: C.offBlack, fontFamily: F.bold, lineHeight: "25.5px" }}>RESULT</span>
                <span style={{
                  border: `1px solid rgba(0,200,100,0.35)`, borderRadius: 16, padding: "2px 8px",
                  fontSize: 14, color: C.offBlack, fontFamily: F.regular, lineHeight: "22.4px",
                  background: "rgba(0,200,100,0.10)",
                }}>Output</span>
              </div>
            </div>

            {/* Core rules row */}
            <div style={{ display: "flex", gap: 24, width: "100%", flexWrap: "wrap" }}>
              {[
                { Icon: Target, text: "Specific input = Specific output." },
                { Icon: EyeOff, text: "AI doesn't read your mind." },
                { Icon: Zap, text: "Prompting is a skill, not a gift." },
              ].map(({ Icon, text }) => (
                <div key={text} style={{
                  flex: "1 1 240px", background: C.confidentBlack, border: `1px solid ${C.gray02}`,
                  borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 16,
                }}>
                  <Icon size={24} color={C.white} strokeWidth={2} style={{ flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 14, color: C.white, fontFamily: F.regular, lineHeight: "21px" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TEAM BRIEFING — brief a colleague, not an AI agent ── */}
      <TeamBriefingSection />

      {/* ── 3.5. VIDEO INTRO — dark break between white and gray ── */}
      <section
        id="video-intro"
        style={{
          background: C.confidentBlack,
          padding: `${spacing.sectionPaddingY} 0`,
          scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        }}
      >
        <div style={{ ...contentRailStyle }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontFamily: F.bold,
              color: C.onDark,
              textAlign: "center",
              margin: "0 0 32px",
            }}
          >
            See It in Action
          </h2>

          {/* 16:9 video container — max 800px, centered */}
          <div style={{ maxWidth: "min(800px, 100%)", margin: "0 auto" }}>
            <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden" }}>
              {/* VIDEO_SRC: replace this placeholder with <iframe> when URL is ready */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: C.gray01,
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  border: `1px solid ${C.borderOnDark}`,
                }}
              >
                <Play
                  size={48}
                  strokeWidth={1.5}
                  color={C.gray02}
                  aria-hidden
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontFamily: F.regular,
                    color: C.gray02,
                    letterSpacing: "0.02em",
                  }}
                >
                  Video coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. 7 ELEMENTS — Figma Section Elements ── */}
      <EightElementsWizard />

      {/* ── 5. AI PARALLEL — Same AI, Lazy Ask vs Pro Ask ── */}
      <AiLazyProSection />

      {/* ── 6. PROMPT STACK BUILDER — light ── */}
      <section id="stack-builder" style={{ background: SURFACE.light.bg, padding: `${spacing.sectionPaddingY} 0`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
        <div style={{ ...contentRailStyle }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: C.confidentBlack, textAlign: "center", marginBottom: 8, fontFamily: F.bold }}>
            Build a Perfect Prompt — Piece by Piece
          </h2>
          <p style={{ fontSize: 16, color: C.gray01, textAlign: "center", lineHeight: 1.7, marginBottom: 32, fontFamily: F.light, maxWidth: 650, marginLeft: "auto", marginRight: "auto" }}>
            Click each ingredient below to add it to the prompt. Watch it come together like assembling a client brief.
          </p>
          <PromptStackBuilder />
        </div>
      </section>

      {/* ── 7. TECHNIQUES + LEVEL UP — dark ── */}
      <section id="advanced" style={{ background: SURFACE.dark.bg, padding: `${spacing.sectionPaddingY} 0`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
        <div style={{ ...contentRailStyle }}>
          <SectionAnchorTitle theme="dark" align="center">Techniques</SectionAnchorTitle>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: SURFACE.dark.heading, textAlign: "center", marginBottom: 8, fontFamily: F.bold }}>
            Prompt like a Pro — Techniques
          </h2>
          <p style={{ fontSize: 16, color: SURFACE.dark.body, textAlign: "center", lineHeight: 1.7, marginBottom: 32, fontFamily: F.light, maxWidth: 920, marginLeft: "auto", marginRight: "auto" }}>
            Eight core techniques for sharper everyday prompts, plus an advanced framework for complex tax problems.
          </p>
          <AdvancedTechniquesSection onDark />
        </div>
      </section>

      {/* ── 8. META PROMPT — temporarily hidden ── */}
      {/* <MetaPromptSection /> */}

      {/* ── 9. PROMPTING ACTIVITY — MCQ + match exercises (Figma 3215:5657) ── */}
      <PromptingActivitySection />

      {/* ── 10. GOLDEN RULES — Do's & Don'ts ── */}
      <section id="dos-donts" style={{ background: SURFACE.light.bg, padding: `${spacing.sectionPaddingY} 0`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
        <div style={{ ...contentRailStyle }}>
          <SectionAnchorTitle align="center">Do&apos;s &amp; Don&apos;ts</SectionAnchorTitle>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: SURFACE.light.heading, marginBottom: 8, fontFamily: F.bold }}>
            Prompt Engineering — Do&apos;s &amp; Don&apos;ts
          </h2>
          <p style={{ fontSize: 15, color: C.gray01, marginBottom: 40, fontFamily: F.light, lineHeight: 1.6 }}>
            A practical guide for tax professionals. Each card includes a real example.
          </p>

          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: C.success + "1a", border: `1px solid ${C.success}40`, borderRadius: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ color: C.success, fontSize: 14, fontWeight: 700, fontFamily: F.bold }}>Do&apos;s</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: C.destructive + "1a", border: `1px solid ${C.destructive}40`, borderRadius: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.destructive} strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                <span style={{ color: C.destructive, fontSize: 14, fontWeight: 700, fontFamily: F.bold }}>Don&apos;ts</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DOS.map((doItem, i) => {
                const dontItem = DONTS[i];
                if (!dontItem) return null;
                return (
                  <div key={doItem.title} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "stretch" }}>
                    <div style={{
                      height: "100%",
                      padding: "16px 18px", background: SURFACE.neutral.bg, borderRadius: 8,
                      border: `1px solid ${SURFACE.light.border}`,
                      borderLeft: `3px solid ${C.success}`,
                      display: "flex", flexDirection: "column", gap: 8,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.success, fontFamily: F.bold }}>{doItem.title}</div>
                      <div style={{ fontSize: 13, color: SURFACE.light.body, lineHeight: 1.6, fontFamily: F.regular }}>{doItem.desc}</div>
                      <div style={{ fontSize: 12, color: C.gray01, lineHeight: 1.55, fontFamily: F.light, fontStyle: "italic", marginTop: "auto", paddingTop: 8 }}>{doItem.example}</div>
                    </div>
                    <div style={{
                      height: "100%",
                      padding: "16px 18px", background: SURFACE.neutral.bg, borderRadius: 8,
                      border: `1px solid ${SURFACE.light.border}`,
                      borderLeft: `3px solid ${C.destructive}`,
                      display: "flex", flexDirection: "column", gap: 8,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.destructive, fontFamily: F.bold }}>{dontItem.title}</div>
                      <div style={{ fontSize: 13, color: SURFACE.light.body, lineHeight: 1.6, fontFamily: F.regular }}>{dontItem.desc}</div>
                      <div style={{ fontSize: 12, color: C.gray01, lineHeight: 1.55, fontFamily: F.light, fontStyle: "italic", marginTop: "auto", paddingTop: 8 }}>{dontItem.example}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 40, padding: "28px 32px", background: C.yellow, border: `1px solid ${C.gray02}`, borderRadius: 10, textAlign: "center" }}>
            <p style={{ fontSize: 20, color: C.confidentBlack, lineHeight: 1.5, fontFamily: F.bold, margin: "0 0 6px" }}>
              Better Prompts → Better Outputs → Better Decisions
            </p>
            <p style={{ fontSize: 13, color: C.offBlack, lineHeight: 1.6, fontFamily: F.regular, margin: 0 }}>
              Clear Instructions + Context + Validation = Effective AI Usage
            </p>
          </div>
        </div>
      </section>

      {/* ── 10. RECAP IN A NUTSHELL — temporarily hidden per request ── */}
      {/* <RecapInNutshellSection /> */}

      {/* ── Journey progress — continue via next trek-step CTA ── */}
      <JourneyProgressSection onContinue={() => onNavigate("/copilot-hub")} />

    </div>
  );
}
