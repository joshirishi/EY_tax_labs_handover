import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle, AlignLeft, Archive, ArrowRight,
  BarChart3, Bold, BookOpen, Bot, Brain, Briefcase, Calculator, Calendar, Check, CheckCircle, CircleCheckBig, CircleX, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, ClipboardList, Compass, Copy,
  CornerUpLeft, DollarSign, ExternalLink, FileText, FolderOpen, Info,
  Globe, Grid3x3, Hexagon, Image, Italic, LayoutTemplate, Lightbulb, LineChart, Link2,
  List, ListOrdered, Mail, Megaphone, Menu, MessagesSquare, Mic, Monitor, MoreHorizontal, PenLine,
  Pencil, Percent, Pin, Play, Plus, PlusSquare, Power, Rocket, Save, Search, Send, Settings, ShieldCheck, Sparkles,
  Target, Timer, Trash2, Type, Underline, Users, Video, X, XCircle, ZoomIn, ZoomOut,
} from "lucide-react";
import { ModuleHeader, SUBNAV_SCROLL_MARGIN, useModuleSectionHashScroll } from "../design-kit/LearningNav";
import { SiteHeader } from "../design-kit/SiteHeader";
import { SectionAnchorTitle } from "../design-kit/EYTypography";
import { TabRail } from "../design-kit/TabRail";
import { colors, contentInlinePad, contentRailStyle, fonts as F, spacing, spectrumCss, typeScale } from "../design-kit/tokens";
import { AscentModuleProgressSection } from "../imports/Frame353/ascentCurriculum";
import { M365ChatSlideTour, M365AgentHowExplorer } from "../components/M365ChatSlideTour";
import { AgentInstructionComponents } from "../components/AgentInstructionComponents";
import { AGENT_HEX_SRC } from "../components/AgentHexIcon";
import {
  AGENT_BEST_PRACTICES_SLIDES,
  AGENT_COMMON_FAILURES,
  AGENT_SUMMARY_PARTS,
  AGENT_TECHNIQUE_PATTERNS,
  formatTechniqueInstructionPreview,
  parseSummaryParts,
  parseTaxExample,
  parseWhenToUse,
  type AgentSummaryRow,
  type AgentTechniqueItem,
} from "../data/agent-best-practices";

// Canonical token alias — keeps existing C.dark / C.dark2 references working
const C = {
  ...colors,
  dark:       colors.confidentBlack,
  dark2:      colors.offBlack,
  // Microsoft app colours (used for realistic app-window chrome only)
  wordBlue:   colors.frameBlue,
  excelGreen: colors.frameGreen,
  pptOrange:  "#FF3C00",
  outlookBlue: colors.frameBlue,
  teamsViolet: colors.framePurple,
};

// ── Copilot icon (simplified sparkle — replaces expired Figma asset) ──────────
function CopilotIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="url(#cg)" />
      <defs><radialGradient id="cg" cx="30%" cy="30%"><stop offset="0%" stopColor="#4696FF"/><stop offset="100%" stopColor="#B400FF"/></radialGradient></defs>
      <path d="M16 8l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" fill="#FFFFFF" opacity=".9"/>
    </svg>
  );
}

// ── Tab config (exact labels from Figma 3317:15589) ──────────────────────────
// `logo` paths match the laptop-stage / CoreProcessingPipeline MS app SVGs in
// public/pipeline/ — real product marks, not letter-on-square placeholders.
const TABS = [
  { id: "word",    label: "MS Word",          color: C.wordBlue,   appColor: C.wordBlue,   logo: "/pipeline/word.svg" },
  { id: "excel",   label: "MS Excel",         color: C.excelGreen, appColor: C.excelGreen, logo: "/pipeline/excel.svg" },
  { id: "ppt",     label: "MS PowerPoint",    color: C.pptOrange,  appColor: C.pptOrange,  logo: "/pipeline/powerpoint.svg" },
  { id: "outlook", label: "MS Outlook",       color: C.outlookBlue,appColor: C.outlookBlue,logo: "/pipeline/outlook.svg" },
  { id: "teams",   label: "MS Teams",         color: C.teamsViolet,appColor: C.teamsViolet,logo: "/pipeline/teams.svg" },
  { id: "m365",    label: "MS Chat",          color: C.teamsViolet,appColor: C.teamsViolet,logo: "/pipeline/copilot-icon.svg" },
  { id: "agent",   label: "M365 Agent",       color: C.teamsViolet,appColor: C.teamsViolet,logo: AGENT_HEX_SRC },
] as const;
type TabId = (typeof TABS)[number]["id"];
// Prompt-repository pills are app categories only. Agent lives in the Learn header.
const APP_TABS = TABS.filter((t) => t.id !== "agent");

type UseCaseChip = { icon?: LucideIcon; agentIcon?: boolean; title: string; body: string; group?: string };

// ── Real app display names — used in use-case tags, mock window titles, and
// the "Ask Copilot in {App}" prompt-panel headers ────────────────────────────
const APP_NAME: Record<TabId, string> = {
  word: "Word",
  excel: "Excel",
  ppt: "PowerPoint",
  outlook: "Outlook",
  teams: "Teams",
  m365: "M365 Chat",
  agent: "M365 Agent",
};

// ── Laptop stage — "What you can do" popping app widget (ported from Module1) ─
// Live apps with prompt content below "pop" and jump to their tab.
// M365 Agent sits on the stage itself; remaining apps stay in the muted dock.
// 7 live apps sit on one ellipse around the laptop so none pile on a corner.
const LAPTOP_TILE = 64;
const LAPTOP_ORBIT = { cx: 280, cy: 200, rx: 232, ry: 156 };

function laptopOrbitPos(angleDeg: number, delay: string): React.CSSProperties {
  const r = (angleDeg * Math.PI) / 180;
  return {
    top: Math.round(LAPTOP_ORBIT.cy + LAPTOP_ORBIT.ry * Math.sin(r) - LAPTOP_TILE / 2),
    left: Math.round(LAPTOP_ORBIT.cx + LAPTOP_ORBIT.rx * Math.cos(r) - LAPTOP_TILE / 2),
    animationDelay: delay,
  };
}

const LAPTOP_ORBIT_STEP = 360 / 7;
const LAPTOP_CORE_APPS: { id: TabId; label: string; logo: string; pos: React.CSSProperties }[] = [
  { id: "m365",    label: "M365 Chat",   logo: "/pipeline/copilot-icon.svg",    pos: laptopOrbitPos(-90, "0s") },
  { id: "excel",   label: "Excel",       logo: "/pipeline/excel.svg",           pos: laptopOrbitPos(-90 + LAPTOP_ORBIT_STEP, "0.4s") },
  { id: "ppt",     label: "PowerPoint",  logo: "/pipeline/powerpoint.svg",      pos: laptopOrbitPos(-90 + LAPTOP_ORBIT_STEP * 2, "0.8s") },
  { id: "agent",   label: "M365 Agent",  logo: AGENT_HEX_SRC, pos: laptopOrbitPos(-90 + LAPTOP_ORBIT_STEP * 3, "1.2s") },
  { id: "outlook", label: "Outlook",     logo: "/pipeline/outlook.svg",         pos: laptopOrbitPos(-90 + LAPTOP_ORBIT_STEP * 4, "1.6s") },
  { id: "teams",   label: "Teams",       logo: "/pipeline/teams.svg",           pos: laptopOrbitPos(-90 + LAPTOP_ORBIT_STEP * 5, "2s") },
  { id: "word",    label: "Word",        logo: "/pipeline/word.svg",            pos: laptopOrbitPos(-90 + LAPTOP_ORBIT_STEP * 6, "2.4s") },
];

// ── Exact content from Figma (3317:15589), upgraded with the "use-grid" +
// "copilot scene" tax use-case & prompt content ported from copilot_dashboard.html ──
const SECTION_DATA: Record<TabId, {
  h2: string;
  useCases: UseCaseChip[];
  panelSubtitle: string;
  prompts: { label: string; text: string }[];
  screenshotSide: "left" | "right";
  altBg: boolean;
}> = {
  word: {
    h2: "M365 Copilot in MS Word",
    useCases: [
      { icon: FileText, title: "Draft Position Notes",  body: "Create first-cut tax research memos, issue notes, legal summaries and client-ready position papers." },
      { icon: Search,   title: "Summarise Case Laws",   body: "Condense lengthy rulings, circulars, notifications or tribunal orders into crisp facts and implications." },
      { icon: PenLine,  title: "Refine Legal Language", body: "Rewrite tax submissions and opinion drafts into a sharper, review-ready tone." },
      { icon: Pin,      title: "Track Review Points",   body: "Convert comments and inputs into action points, open items and next-step trackers." },
    ],
    panelSubtitle: "Draft, review and refine tax documents with speed and consistency.",
    prompts: [
      { label: "Draft a Position Note",         text: "Draft a 1-page position note on the withholding tax treatment of software royalty payments to our US parent, citing the EACoE Supreme Court ruling." },
      { label: "Summarise a Tribunal Ruling",   text: "Summarise this ITAT order in plain English — facts, issue, ruling, and what it means for our client." },
      { label: "Tighten the Legal Language",    text: "Rewrite this tax opinion draft in a sharper, more formal tone suitable for client delivery." },
      { label: "Build a Review Tracker",        text: "Convert the reviewer's comments in this document into a numbered action tracker with owners and due dates." },
      { label: "Create an Executive Summary",   text: "Summarise this 12-page tax memo into a 5-bullet executive summary for the CFO." },
    ],
    screenshotSide: "left",
    altBg: true,
  },
  excel: {
    h2: "M365 Copilot in MS Excel",
    useCases: [
      { icon: BarChart3,     title: "Analyse Tax Data",      body: "Summarise large datasets and identify key trends, gaps, mismatches and exceptions." },
      { icon: Calculator,    title: "Build Reconciliations", body: "Create formulas and logic checks to compare books, returns and working papers." },
      { icon: AlertTriangle, title: "Spot Exceptions",       body: "Detect anomalies such as missing details, rate mismatches or duplicates." },
      { icon: LineChart,     title: "Visualise Compliance",  body: "Create summary views to show status, exposures, ageing and risk movement." },
    ],
    panelSubtitle: "Analyse tax data, reconciliations and compliance trackers with precision.",
    prompts: [
      { label: "Reconcile Two Ledgers",           text: "Compare the GST returns and books data in these two sheets and flag every mismatch above ₹10,000." },
      { label: "Explain This Formula",            text: "Explain what this VLOOKUP + IFERROR formula in column F is actually doing, in plain language." },
      { label: "Spot Withholding Gaps",           text: "Scan this vendor payment sheet and flag any transaction where TDS appears under-deducted." },
      { label: "Build a Compliance Summary",    text: "Turn this data into a one-page summary showing filing status, ageing, and open exposures by entity." },
      { label: "Forecast the Effective Tax Rate", text: "Using this P&L, calculate the projected effective tax rate for FY26 factoring in surcharge and cess." },
    ],
    screenshotSide: "right",
    altBg: false,
  },
  ppt: {
    h2: "M365 Copilot in MS PowerPoint",
    useCases: [
      { icon: Target,     title: "Create Client Decks",        body: "Convert tax analysis into structured, visually clean, client-ready presentations." },
      { icon: Compass,    title: "Tell the Tax Story",         body: "Organise complex positions into context, issue, risk, recommendation and next steps." },
      { icon: Megaphone,  title: "Prepare Leadership Updates", body: "Generate concise leadership slides on exposures, updates and decisions required." },
      { icon: FolderOpen, title: "Summarise Case Strategy",    body: "Build crisp hearing briefs, timelines and argument maps." },
    ],
    panelSubtitle: "Convert tax positions and updates into leadership-ready narratives.",
    prompts: [
      { label: "Build a Client-Ready Deck",  text: "Turn this tax position note into a 6-slide client deck with an executive summary slide." },
      { label: "Tell the Tax Story",         text: "Structure this analysis as Context → Issue → Risk → Recommendation → Next Steps across slides." },
      { label: "Simplify for the Board",     text: "Rewrite these slides in plain business language a non-tax board member would understand." },
      { label: "Create a Litigation Timeline", text: "Build a visual timeline slide of this case's key hearing dates and outcomes." },
      { label: "Design a Comparison Slide",  text: "Create a side-by-side slide comparing the old vs new GST rate structure." },
    ],
    screenshotSide: "right",
    altBg: true,
  },
  outlook: {
    h2: "M365 Copilot in MS Outlook",
    useCases: [
      { icon: Mail,           title: "Draft Client Emails",   body: "Prepare clear professional emails for data requests, updates and follow-ups." },
      { icon: MessagesSquare, title: "Summarise Threads",     body: "Extract decisions, pending inputs, responsibilities and deadlines from long chains." },
      { icon: Timer,          title: "Manage Follow-ups",     body: "Convert email conversations into action-oriented follow-ups." },
      { icon: Sparkles,       title: "Polish Tone Instantly", body: "Rewrite responses to sound concise, client-sensitive and executive-ready." },
    ],
    panelSubtitle: "Manage tax communications, follow-ups and client responses faster.",
    prompts: [
      { label: "Draft a Client Update",        text: "Draft a concise email to the client summarising the outcome of today's assessment hearing." },
      { label: "Summarise a Long Thread",      text: "Summarise this 20-email thread into decisions made, pending items, and who owns what." },
      { label: "Chase Outstanding Documents",  text: "Draft a polite but firm follow-up requesting the pending Form 15CA/CB documents." },
      { label: "Soften a Firm Response",       text: "Rewrite this reply to sound more diplomatic — we're pushing back on the client's proposed position." },
      { label: "Prepare a Cover Note",         text: "Draft a short covering email to accompany our reply to the GST show cause notice." },
    ],
    screenshotSide: "left",
    altBg: false,
  },
  teams: {
    h2: "M365 Copilot in MS Teams",
    useCases: [
      { icon: Calendar, title: "Meeting Options before the call", body: "Open the meeting in Calendar, then Meeting options, and choose whether Copilot can run during and after the call." },
      { icon: Users, title: "Participants' acceptance of Copilot on the call", body: "When Copilot or transcription starts, each person on the call must accept before Copilot can use the conversation." },
      { icon: Power, title: "Ability to turn Copilot on and off during the call", body: "Use the meeting toolbar to turn Copilot off if the discussion should not be captured, then turn it back on when needed." },
      { icon: Sparkles, title: "Selecting Copilot while on the call", body: "Select Copilot on the meeting bar to open the pane and ask for a recap, open items, or decisions." },
    ],
    panelSubtitle: "Use Copilot in the meeting pane the same way the Teams recording shows in chat.",
    prompts: [
      { label: "Summarise this chat", text: "Summarise this chat" },
      { label: "What are open items?", text: "What are open items?" },
      { label: "What decisions were made?", text: "What decisions were made?" },
      { label: "What decisions were made in this chat?", text: "What decisions were made in this chat?" },
    ],
    screenshotSide: "right",
    altBg: true,
  },
  m365: {
    h2: "M365 in Chat",
    useCases: [
      { icon: Sparkles,  title: "Enable Work IQ",         body: "Choose whether Copilot can use your work data and the web, or web content only." },
      { icon: Brain,     title: "Select a Model",         body: "Auto, GPT Quick, GPT Advanced, or Claude Opus — pick speed or depth for the task." },
      { icon: Settings,  title: "Personalize Responses",  body: "Custom instructions and saved memories so answers follow your tax style." },
      { icon: Save,      title: "Saved Prompts",          body: "Reuse GST and other templates with one click for consistent results." },
      { agentIcon: true, title: "Researcher Agent",       body: "Deep briefing for complex meetings — tax, customs, and transfer pricing.", group: "Agents" },
      { agentIcon: true, title: "Analyst Agent",          body: "Turn GST filings into trends, late-filing flags, and charts in minutes.", group: "Agents" },
      { agentIcon: true, title: "Custom Agent",           body: "Build a specialist for Indian tax with your instructions and knowledge sources.", group: "Agents" },
      { icon: Rocket,    title: "Create Content",         body: "Generate professional images, videos, surveys, and pages from a short brief." },
    ],
    panelSubtitle: "Ask cross-app questions and retrieve tax context across Microsoft 365.",
    prompts: [
      { label: "Find Every Mention",         text: "Find every email, doc or chat this quarter that mentions the 'safe harbour' rate change." },
      { label: "Prep for a Client Call",     text: "Pull together everything we discussed with ABC Corp on their TP matter in the last 30 days." },
      { label: "Draft a Matter Brief",       text: "Summarise all files related to the XYZ litigation into a one-page matter brief." },
      { label: "Check What's Still Pending", text: "What action items are still open for me across all my tax engagements this week?" },
      { label: "Compare Team Positions",     text: "Compare how our Mumbai and Bangalore teams have each interpreted the new TDS circular." },
    ],
    screenshotSide: "right",
    altBg: true,
  },
  agent: {
    h2: "M365 Agent",
    useCases: [
      { icon: Info,          title: "What are agents",         body: "An M365 agent is a focused Copilot assistant for a tax workflow — it follows your instructions and approved sources, rather than answering every question in general chat." },
      { icon: Search,        title: "Retrieve Tax Knowledge",    body: "Locate historical positions, precedents and supporting materials across approved repositories." },
      { icon: FolderOpen,    title: "Organise Evidence",         body: "Gather and package issue-wise evidence from SharePoint, Teams and Outlook for audits and disputes." },
      { icon: ClipboardList, title: "Track Compliance",          body: "Monitor filing deadlines, action items and overdue obligations across engagements." },
      { icon: Rocket,        title: "Automate Correspondence",   body: "Standardise recurring tax communications with approved templates and tone guidelines." },
      { agentIcon: true, title: "Researcher Agent", body: "Deep briefing for complex meetings — tax, customs, and transfer pricing.", group: "Agents" },
      { agentIcon: true, title: "Analyst Agent",    body: "Turn GST filings into trends, late-filing flags, and charts in minutes.", group: "Agents" },
      { agentIcon: true, title: "Custom Agent",     body: "Build a specialist for Indian tax with your instructions and knowledge sources.", group: "Agents" },
    ],
    panelSubtitle: "Sample agent instructions for common tax workflow scenarios.",
    prompts: [
      { label: "Tax Knowledge Retrieval Agent",      text: "You are a tax knowledge assistant. Search approved repositories for opinions, notices, submissions and policies. Summarise findings with source references and flag gaps." },
      { label: "Transfer Pricing Documentation Agent", text: "Review related-party schedules, TP reports and GL records. Identify transactions, summarise supporting information and highlight exceptions for audit readiness." },
      { label: "Advance Tax Reviewer Agent",           text: "Compare current and prior quarter advance tax computations. Validate assumption changes, analyse variances and draft a management summary note." },
      { label: "Assessment Evidence Agent",            text: "Search SharePoint, Teams and Outlook for documentation related to this assessment issue. Create an evidence pack and list missing support." },
      { label: "Compliance Tracker Agent",             text: "Maintain the compliance calendar and filing records. Flag upcoming, due and overdue obligations with risk notes for each entity." },
    ],
    screenshotSide: "left",
    altBg: false,
  },
};

// ── M365 Agent — instruction principles, templates, and MS Learn reference ──
const MS_LEARN_AGENT_INSTRUCTIONS =
  "https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-instructions";
const MS_LEARN_MODEL_MIGRATION =
  "https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-model-migration-overview";
const MS_LEARN_OPENAPI_GUIDANCE =
  "https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/openapi-document-guidance";
const MS_LEARN_COPILOT_STUDIO_INSTRUCTIONS =
  "https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-mode-guidance";
const MS_LEARN_SPECIAL_INSTRUCTIONS =
  "https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.6#special-instructions-object";
const EXAMPLE_INSTRUCTIONS_INTRO =
  "The following example instructions are for an agent that can help resolve common IT problems.";

const PATTERNS_SECTION_INTRO =
  "This section provides patterns and templates that you can add to your declarative agent instructions. The examples shown aren't prescriptive. Use them as a starting point and adapt them to the requirements of your use case.";

const IT_AGENT_FULL_EXAMPLE = `# OBJECTIVE
Guide users through issue resolution by gathering information, checking outages, narrowing down solutions, and creating tickets if needed. Ensure the interaction is focused, friendly, and efficient.

# RESPONSE RULES
- Ask one clarifying question at a time, only when needed.
- Present information as concise bullet points or tables.
- Avoid overwhelming users with details or options.
- Always confirm before moving to the next step or ending.
- Use tools only if data is sufficient; otherwise, ask for missing info.

# WORKFLOW

## Step 1: Gather Basic Details
- **Goal:** Identify the user's issue.
- **Action:**
  - Proceed if the description is clear.
  - If unclear, ask a single, focused clarifying question.
    - Example:
      User: "Issue accessing a portal."
      Assistant: "Which portal?"
- **Transition:** Once clear, proceed to Step 2.

## Step 2: Check for Ongoing Outages
- **Goal:** Rule out known outages.
- **Action:**
  - Query \`ServiceNow\` for current outages.
  - If an outage is found:
    - Share details and ETA.
    - Ask: "Is your issue unrelated? If yes, I can help further."
    - If yes, go to Step 3. If no/no response, end politely.
  - If none, inform the user and go to Step 3.

## Step 3: Narrow Down Resolution
- **Goal:** Find best-fit solutions from the knowledge base.
- **Action:**
  - Search \`ServiceNow KB\` for related articles.
  - **Iterative narrowing:** Don't list all results. Instead:
    - Ask clarifying questions based on article differences.
    - Eliminate irrelevant options with user responses.
    - Repeat until the best solution is found.
  - Provide step-by-step fix instructions.
  - Confirm: "Did this help? If not, I can go deeper or create a ticket."
    - If more info is provided, repeat this step.
    - If ticket needed, go to Step 4.
    - If resolved/no response, end politely.

## Step 4: Create Support Ticket
- **Goal:** Log unresolved issues.
- **Action:**
  1. Map **category** and **subcategory** from the \`sys_choice\` SharePoint file.
     - Use only valid pairs. Leave blank if not clear.
  2. Fetch user's UPN (email) with the people capability.
  3. Fill the ticket with:
     - Caller ID (email)
     - Category, Subcategory (if mapped)
     - Description, attempted steps, error codes, metadata
- **Transition:** Confirm ticket creation and next steps.

# OUTPUT FORMATTING RULES
- Use bullets for actions, lists, next steps.
- Use tables for structured data where UI allows.
- Avoid long paragraphs; keep responses skimmable.
- Always confirm before ending or submitting tickets.

# EXAMPLES

## Valid Example
**User:** "I can't connect to VPN."
**Assistant:**
- "Are you seeing a specific error?"
  (User: "DNS server not responding.")
- "Let me check for outages."
  (No outage.)
- "No outages. Searching knowledge base…"
  (Finds articles. Asks: "Are you on office Wi-Fi or home?")
  (User: "Home.")
- "Try resetting your DNS settings. Here's how…"
- "Did this help? If not, I can create a support ticket."

## Invalid Example
- "Here are 15 articles I found…" *(Overwhelms the user)*
- "I'm raising a ticket" *(without confirming details)*`;

type AgentPromptFailure = {
  n: string;
  title: string;
  problem: string;
  solution: string;
};

/** MS Learn § Avoid common prompt failures — declarative-agent-instructions */
const AGENT_FAILURES_INTRO =
  "Be aware of the following pitfalls and their solutions to avoid common failures.";

const AGENT_PROMPT_FAILURES: readonly AgentPromptFailure[] = [
  {
    n: "01",
    title: "Overeager tool use",
    problem: "The model calls tools without needed inputs.",
    solution: "Add instruction \"Only call the tool if necessary inputs are available; otherwise, ask the user.\"",
  },
  {
    n: "02",
    title: "Repetitive phrasing",
    problem: "The model reuses example phrasing verbatim.",
    solution: "Encourage varied responses and natural language. Consider adding more than one example instead of just one (few-shot prompting). Experiment with removing the example to save on tokens.",
  },
  {
    n: "03",
    title: "Verbose explanations",
    problem: "The model overexplains or provides excessive formatting.",
    solution: "To limit verbosity or formatting, add constraints and concise examples.",
  },
] as const;

const AGENT_INTRO_BODY =
  "Declarative agents are customized versions of Microsoft 365 Copilot that help you create personalized experiences by declaring specific instructions, actions, and knowledge. To write effective instructions for your declarative agent, consider the following questions:";

const AGENT_INTRO_QUESTIONS = [
  "What goal must your agent accomplish?",
  "What workflows do you envision your end users going through?",
  "Is there business logic you want to incorporate?",
  "Is there a desired end user experience you want to incorporate?",
  "For each workflow, can you provide step-by-step instructions for the agent?",
] as const;

const AGENT_GPT_MIGRATION_CALLOUT =
  "Microsoft 365 Copilot periodically transitions to newer GPT versions. Because these updates are automatic, expect some behavioral change over time and be prepared to adapt prompts and instructions where precision matters. The recent move from GPT 5.0 to GPT 5.1 was a larger shift from a mostly literal interpretation of instructions to a more intent‑first, adaptive reasoning approach. This shift might affect how your declarative agent understands and responds to your instructions, particularly in structured or step-by-step scenarios.";

const AGENT_SHAREPOINT_XPIA_CALLOUT =
  "Don't store or offload declarative agent instructions in SharePoint documents (or any other knowledge source) to work around the 8,000-character instruction limit. Knowledge source content is not trusted maker-authored instruction content and is subject to cross-prompt injection attacks (XPIA) classifiers — directive-like language can be blocked, truncated, or sanitized at runtime, causing unpredictable agent behavior. This pattern also expands the attack surface: anyone with edit access to the referenced document can alter agent behavior at runtime, bypassing the manifest's authoring, versioning, and governance controls.";

const AGENT_COMPONENTS_MAIN = ["Purpose", "General guidelines, including general directions, tone, and restrictions", "Skills"] as const;

const AGENT_COMPONENTS_OPTIONAL = [
  "Step-by-step instructions",
  "Error handling and limitations",
  "Feedback and iteration",
  "Interaction examples",
  "Nonstandard terms",
  "Follow-up and closing",
] as const;

type AgentBestPractice = {
  n: string;
  title: string;
  bullets?: readonly string[];
  paragraphs?: readonly string[];
  codeBlocks?: readonly { label: string; code: string }[];
};

/** MS Learn § Best practices for agent instructions — verbatim structure */
const AGENT_MS_BEST_PRACTICES: readonly AgentBestPractice[] = [
  {
    n: "01",
    title: "Use clear actionable language",
    bullets: [
      "**Focus on what Copilot should do**, not what to avoid.",
      "**Use precise, specific verbs**, such as \"ask\", \"search\", \"send\", \"check\", or \"use\".",
      "**Supplement with examples** to minimize ambiguity.",
      "**Define any terms** that are nonstandard or unique to the organization in the instructions.",
    ],
  },
  {
    n: "02",
    title: "Build step-by-step workflows with transitions",
    paragraphs: ["Break workflows into modular, unambiguous, and nonconflicting steps. Each step should include:"],
    bullets: [
      "**Goal**: The purpose of the step.",
      "**Action**: What the agent should do and which tools to use.",
      "**Transition**: Clear criteria for moving to the next step or ending the workflow.",
    ],
  },
  {
    n: "03",
    title: "Use strict structure",
    paragraphs: ["Structure is one of the strongest signals used to interpret intent:"],
    bullets: [
      "Use *sections* to group related tasks into logical categories, without implying sequence.",
      "Use *bullets* for parallel tasks that can be completed independently. Avoid numbering that might introduce unintended order.",
      "Use *steps* for actions that must occur in a required sequence, and reserve them only for true workflows.",
    ],
  },
  {
    n: "04",
    title: "Make tasks atomic",
    paragraphs: [
      "Break multiaction instructions into clearly separated units. This approach reduces ambiguity and prevents the model from merging or reinterpreting tasks.",
      "Instead of: Extract metrics and summarize findings.",
      "Use separate steps: 1. Extract metrics. 2. Summarize findings.",
    ],
  },
  {
    n: "05",
    title: "Always specify tone, verbosity, and output format",
    paragraphs: [
      "If you don't specify tone and level of detail, the language model might infer these attributes, which can lead to inconsistent behavior across models. For example, specify:",
    ],
    bullets: [
      "Tone: professional and concise.",
      "Output: Three bullet points per section.",
      "Return only the requested format; no explanations.",
    ],
  },
  {
    n: "06",
    title: "Structure instructions in Markdown",
    paragraphs: ["To provide emphasis and clarity on the order of steps, use Markdown."],
    bullets: [
      "Use `#`, `##`, and `###` for section headers.",
      "Use `-` for unordered lists and `1.` for numbered lists. Use unordered lists unless the order of steps is important, in which case, use numbered lists.",
      "Highlight tool or system names (for example, `Jira`, `ServiceNow`, `Teams`) by using backticks.",
      "Make critical instructions bold by using `**`.",
      "Clear headings and consistent list structures help the model understand your intended hierarchy. Avoid mixing list types in ways that can introduce unintended interpretation.",
    ],
  },
  {
    n: "07",
    title: "Provide domain vocabulary",
    paragraphs: ["Define specialized terms, formulas, acronyms, and dataset‑specific language. This definition prevents incorrect inference and ensures consistent interpretation."],
  },
  {
    n: "08",
    title: "Explicitly reference capabilities, knowledge, and actions",
    paragraphs: ["Clearly call out the names of actions, capabilities, or knowledge sources involved at each step."],
    bullets: [
      "**Actions**: For example, \"Use `Jira` to fetch tickets.\"",
      "**Copilot connector knowledge**: For example, \"Use `ServiceNow KB` for help articles.\"",
      "**SharePoint knowledge**: For example, \"Reference SharePoint or OneDrive internal documents.\"",
      "**Email messages**: For example, \"Check user emails for relevant information.\"",
      "**Teams messages**: For example, \"Search Teams chat history.\"",
      "**Code interpreter**: For example, \"Use code interpreter to generate bar or pie charts.\"",
      "**People knowledge**: For example, \"Use people knowledge to fetch user email.\"",
    ],
  },
  {
    n: "09",
    title: "Ground responses to configured knowledge sources",
    paragraphs: [
      "Language models have built-in knowledge from their training data. In many agent scenarios, you want the agent to rely only on the knowledge sources you configure—not the model's internal knowledge. This approach ensures that responses are accurate, consistent, and traceable to your organizational data.",
      "The recommended way to prevent the model from drawing on its built-in knowledge is to set the `discourage_model_knowledge` property to `true` in the `special_instructions` object of your agent manifest. When enabled, the agent does its best to avoid generating responses from model knowledge and relies on your configured knowledge sources instead.",
    ],
  },
  {
    n: "10",
    title: "Provide examples",
    bullets: [
      "For simple scenarios, you don't need to give examples.",
      "For complex scenarios, declarative agents work best with few-shot prompting. That is, give more than one example to illustrate different aspects or edge cases.",
    ],
  },
  {
    n: "11",
    title: "Control reasoning through phrasing",
    paragraphs: ["Your wording signals how much reasoning you want the model to apply."],
    codeBlocks: [
      {
        label: "Deep reasoning",
        code: `Use deep reasoning. Break the problem into steps, analyze each step, evaluate alternatives, and justify the final decision. Reflect before answering.
Task: Determine the optimal 3-year migration strategy given constraints A, B, and C.`,
      },
      {
        label: "To detect when deep reasoning was selected",
        code: `Before answering, report in one sentence whether you needed deep reasoning or minimal reasoning to solve this. Then provide the final answer only.`,
      },
      {
        label: "Moderate reasoning (balanced)",
        code: `Provide a concise but structured explanation. Include a short summary, 3 key drivers, and a final recommendation. No step-by-step reasoning required.
Task: Explain the tradeoffs between solution X and Y.`,
      },
      {
        label: "Fast and minimal reasoning",
        code: `Short answer only. No reasoning or explanation. Provide the final result only.
Task: Extract the product name and renewal date from this paragraph.`,
      },
    ],
  },
] as const;

const AGENT_ADVANCED_TOPICS: readonly { n: string; title: string; body: string; link?: { href: string; label: string } }[] = [
  {
    n: "13",
    title: "Add a final self-evaluation step",
    body: "A self-check step reinforces completeness and ensures that the agent verifies alignment with your instructions before responding. For example: Before finalizing, confirm that all items from Section A appear in the summary.",
  },
  {
    n: "14",
    title: "Apply a stabilizing header when needed",
    body: "When an agent shows signs of inference drift or step reordering, especially following a model update, add a short header that instructs the model to interpret the instructions literally and avoid inference.",
    link: { href: MS_LEARN_MODEL_MIGRATION, label: "Model changes in GPT 5.1+ for declarative agents" },
  },
  {
    n: "15",
    title: "Iterate on your instructions",
    body: "Developing instructions for declarative agents is often an iterative process. It typically consists of the following steps:",
  },
] as const;

const AGENT_ITERATE_STEPS = [
  "**Create** instructions and conversation starters for your agent following the structure and format described in this article.",
  "**Publish** your agent. Responsible AI (RAI) practices are integrated into the validation process to ensure that agents uphold ethical standards.",
  "**Test** your agent — confirm added value vs. Microsoft 365 Copilot, verify conversation starters, confirm instruction adherence, and handle out-of-scope prompts appropriately.",
  "**Iterate** on instructions — modify instructions to change behavior; try adding knowledge like web search, OneDrive/SharePoint, or Microsoft 365 Copilot connectors if needed.",
] as const;

type AgentPattern = {
  n: string;
  name: string;
  intro?: string;
  template: string;
  goodPrecision?: string;
  deepReasoning?: string;
  fastReasoning?: string;
  whenToUseIntro?: string;
  whenToUse?: readonly string[];
};

const AGENT_INSTRUCTION_PATTERNS: readonly AgentPattern[] = [
  {
    n: "01",
    name: "Convert ambiguous multitask requests into deterministic workflows",
    intro: "By using this pattern, you remove ambiguity by defining atomic steps, explicit formulas, and required validation. This approach ensures stable, repeatable behavior across model versions.",
    template: `## Task: Metrics and ROI (Deterministic)

### Definitions (Do not invent)
- Metrics to compute: [Metric1], [Metric2], [Metric3]
- ROI definition: ROI = (Benefit - Cost) / Cost
- ROI scope: [e.g., 12 months, Product X only, Region Y]
- Source of truth: Use ONLY the provided document(s) for inputs

### Steps (Sequential — do not reorder)
Step 1: Locate inputs for [Metric1-3] in the document. Quote the section/table name where each input came from.
Step 2: Compute [Metric1-3] exactly as defined above. If any input is missing, stop and ask ONE question listing what's missing.
Step 3: Compute ROI using the ROI definition above. Do not substitute other ROI formulas.
Step 4: Output ONLY the table in the format below.

### Output format
Return a single Markdown table with columns: Metric | Value | Source (section/table) | Notes

### Final check (Self-evaluation)
Before finalizing: confirm every metric has (a) a value, (b) a source, and (c) no assumptions. If assumptions exist, stop and ask the user.`,
  },
  {
    n: "02",
    name: "Correct parallel versus sequential structure",
    intro: "By using this pattern, you make sure the model separates parallel and sequential logic. The model runs workflows correctly without adding or reordering steps.",
    template: `Section A — Extract Data
- Extract pricing changes.
- Extract margin changes.
- Extract sentiment themes.

Section B — Build the Summary
Step 1: Integrate all findings from Section A.
Step 2: Produce the 2 page call prep summary.`,
  },
  {
    n: "03",
    name: "Explicit decision rules",
    intro: "By using this pattern, you add explicit if/then rules that prevent unintended model interpretation and enforce deterministic outcomes. This approach stops the language model from trying to resolve ambiguous conditional logic on its own, which can result in blended branches (\"do both\") or selection of the wrong conditional path.",
    template: `Read the product report.
Check category performance.
If performance is stable or improving, write the summary section.
If performance declines or anomalies are detected, write the risks/issues section.`,
  },
  {
    n: "04",
    name: "Output contract",
    intro: "Output contracts provide shape, structure, tone, and allowed content, ensuring consistency. Without explicit output constraints, your agent might produce overly long explanations, overly terse responses, or switch unpredictably across versions.",
    goodPrecision: `Produce a 2-page call-prep briefing:
Page 1 → key metrics: revenue, margin, YoY deltas (calculate as needed).
Page 2 → top themes, risks, opportunities, customer signals.
Tone: Professional. Reasoning: none unless calculation required.`,
    template: `## Output Contract (Mandatory)
Goal: [one sentence]
Format: [bullet list | table | 2 pages | JSON]
Detail level: [short | medium | detailed] — do not exceed [X] bullets per section
Tone: [Professional | Friendly | Efficient]
Include: [A, B, C]
Exclude: No extra recommendations, no extra context, no "helpful tips"
Example shape:
- Section 1: ...
- Section 2: ...`,
    whenToUseIntro: "Use this pattern when your output must follow:",
    whenToUse: [
      "A precise format (bullets, table, JSON, multi-page summary).",
      "A specified level of detail (short, medium, detailed).",
      "A compliance, audit, or customer-facing template.",
      "A business process requiring consistent formatting across teams.",
    ],
  },
  {
    n: "05",
    name: "Clean Markdown structure",
    intro: "Clean, intentional Markdown ensures the model can reliably parse your instructions. Poorly nested lists, unclear headers, or inconsistent formatting cause merged steps, unintended hierarchy, or collapsed sections.",
    template: `## Section A — Extract Data
- Extract pricing changes.
- Extract margin changes.
- Extract sentiment themes.

## Section B — Build the Summary (Sequential)
**Step 1:** Integrate findings from Section A.
**Step 2:** Produce the 2 page call prep summary.`,
  },
  {
    n: "06",
    name: "Self-evaluation gate",
    intro: "By adding an explicit self-check step, you encourage the model to validate completeness, verify alignment with instructions, and correct omissions before responding. This step increases consistency and reliability.",
    template: `## Section A: Extract Data (Non-Sequential)
Perform these tasks when the user requests data extraction from the document:
- Extract pricing changes.
- Extract margin changes.
- Extract sentiment themes.
Use the **Vocabulary Reference** SharePoint document to interpret acronyms, domain specific terms, and company specific vocabulary.

## Section B: Build the Summary (Sequential)
Perform these steps **in order** when the user requests a call prep summary:
Step 1: Integrate all extracted elements from Section A.
Step 2: Produce a clear, well structured 2 page call prep summary.

## Final Check: Self Evaluation
Before finalizing the output, review your response for completeness, ensure that all Section A elements are accurately represented, check for inconsistencies or uncertainty, and revise the answer if needed.`,
  },
  {
    n: "07",
    name: "Steering automode reasoning",
    intro: "Explicit reasoning cues give you control over how much thinking the model applies. Without this guidance, your agent might over-explain simple answers or under-explain complex decisions.",
    template: "",
    deepReasoning: `Use deep reasoning. Break the problem into steps, analyze each step, evaluate alternatives, and justify the final decision. Reflect before answering.
Task: Determine the optimal 3-year migration strategy given constraints A, B, and C.`,
    fastReasoning: `Short answer only. No reasoning or explanation. Provide the final result only.
Task: Extract the product name and renewal date from this paragraph.`,
    whenToUseIntro: "Use this pattern when your workflow requires:",
    whenToUse: [
      "Deeper reasoning (planning, evaluating alternatives, multistep logic).",
      "Fast retrieval or extraction with minimal explanation.",
      "Switching between high-level summaries and deeper analysis.",
      "Consistent depth across multiple agents or use cases.",
    ],
  },
  {
    n: "08",
    name: "Apply a literal-execution header for immediate stability",
    intro: "A literal-execution header helps temporarily stabilize an existing agent, especially after a model change. This pattern is especially useful as an interim fix while you update the full instruction set.",
    template: `Always interpret instructions literally.
Never infer intent or fill in missing steps.
Never add context, recommendations, or assumptions.
Follow step order exactly with no optimization.
Respond concisely and only in the requested format.
Do not call tools unless a step explicitly instructs you to do so.`,
    whenToUseIntro: "Use this pattern when:",
    whenToUse: [
      "You observe reordering, added steps, or excessive reasoning after upgrading to GPT 5.1+.",
      "You need a fast short-term mitigation before applying deeper structural improvements.",
      "You want to diagnose whether inference or instruction ambiguity is causing the problem.",
    ],
  },
  {
    n: "09",
    name: "Evaluate and migrate existing declarative agent instructions",
    intro: "Use a structured evaluation prompt to quickly audit an existing agent, identify specific weaknesses, and generate precise fixes.",
    template: `You are reviewing Data Access (DA) agent instructions for 5.1 stability.

INPUT
<instructions>
[PASTE CURRENT INSTRUCTIONS]
</instructions>

TASK
Concise audit. Identify ONLY issues and exact fixes.

CHECKS
- Step order: identify ambiguity, missing steps, or merged steps → propose atomic, numbered steps.
- Tool use: identify auto-calls, retries, or tool switching → add "use only in step X; no auto-retry".
- Grounding: detect inference, blending, or citation gaps → add "cite only retrieved; no inference; no cross-document stitching".
- Missing-data handling: if retrieval is empty or conflicting → add "stop and ask the user".
- Verbosity: identify chatty or explanatory output → replace with "return only the requested data/format".
- Contradictions or duplicates: resolve discrepancies; prefer explicit over implied.
- Vague verbs ("verify", "process", "handle", "clean"): replace with precise, observable actions.
- Safety: prohibit step reordering, optimization, or reinterpretation.

OUTPUT (concise)
- Header patch (3–6 lines)
- Top 5 changes (bullet list: "Issue → Fix")
- Example rewrite (≤10 lines) for the riskiest step`,
    whenToUseIntro: "Use this pattern when:",
    whenToUse: [
      "You're migrating an existing agent from GPT 5.0 to GPT 5.1 or later.",
      "You're unsure which parts of the instruction set are fragile or ambiguous.",
      "You want a repeatable evaluation process for multiple declarative agents across an organization.",
      "You need a quick way to identify which issues are structural, stylistic, or safety related.",
    ],
  },
] as const;

type AgentInstructionNavItem = {
  id: string;
  group: string;
  label: string;
  badge?: string;
  title: string;
  subtitle?: string;
};

// ── Typing-reveal hook — ports the reference file's injectPrompt/typePrompt
// character-by-character animation into a lightweight React hook ─────────────
function useTypingPrompt() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [typedText, setTypedText] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const select = (idx: number, text: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveIndex(idx);
    setTypedText("");
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setTypedText(text.slice(0, i));
      if (i >= text.length && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 14);
  };

  return { activeIndex, typedText, select };
}

// ── Pattern 2a: In-app Copilot pane (matches MS Word / Excel / PPT / Outlook)
// Title bar + ribbon + workspace, with Copilot as a right-hand side pane.
// Clicking a suggestion card types the prompt into the composer.
const MOCK_SKEL = "rgba(46, 46, 56, 0.10)";
const MOCK_TOOL_ON = "rgba(26, 26, 36, 0.08)";

function MockTool({ icon: Icon, active }: { icon: LucideIcon; active?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        width: 32, height: 32, borderRadius: 6, flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: active ? MOCK_TOOL_ON : "transparent", color: C.offBlack,
      }}
    >
      <Icon size={16} strokeWidth={1.75} />
    </span>
  );
}

function MockZoom() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <ZoomOut size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      <span aria-hidden style={{ position: "relative", width: 100, height: 4, borderRadius: 2, background: C.gray02 }}>
        <span style={{ position: "absolute", left: 0, top: 0, width: 65, height: 4, borderRadius: 2, background: C.offBlack }} />
        <span style={{ position: "absolute", left: 60, top: -3, width: 10, height: 10, borderRadius: 5, background: C.offBlack }} />
      </span>
      <ZoomIn size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      <span style={{ fontFamily: F.bold, fontSize: 12, color: C.offBlack, width: 32, textAlign: "right" }}>100%</span>
    </div>
  );
}

const APP_ACCENT: Record<TabId, string> = {
  word: C.wordBlue,
  excel: C.excelGreen,
  ppt: C.pptOrange,
  outlook: C.outlookBlue,
  teams: C.teamsViolet,
  m365: C.teamsViolet,
  agent: C.wordBlue,
};

const RIBBON_TABS: Record<TabId, string[]> = {
  word: ["File", "Home", "Insert", "Draw", "Layout", "References", "Review", "View"],
  excel: ["File", "Home", "Insert", "Formulas", "Data", "Review", "View"],
  ppt: ["File", "Home", "Insert", "Design", "Transitions", "Slide Show", "Review", "View"],
  outlook: ["File", "Home", "View", "Help"],
  teams: ["Chat", "Calendar", "Teams", "Calls"],
  m365: ["Chat"],
  agent: ["File", "Home", "Insert", "Review", "View"],
};

const COPILOT_HEADING: Record<TabId, string> = {
  word: "Let's edit your document",
  excel: "Let's edit your workbook",
  ppt: "Let's edit your presentation",
  outlook: "What can I help with?",
  teams: "What can I help with?",
  m365: "What can I help with?",
  agent: "Let's edit your document",
};

const COPILOT_PLACEHOLDER: Record<TabId, string> = {
  word: "Describe what you'd like to edit",
  excel: "Describe what you'd like to edit",
  ppt: "Create a presentation about…",
  outlook: "Message Copilot",
  teams: "Message Copilot",
  m365: "Message Copilot",
  agent: "Describe what you'd like to edit",
};

const DOC_TITLES: Partial<Record<TabId, string>> = {
  word: "EY_AI_Governance_Framework_2026.docx",
  excel: "EY_AI_Ops_Budget_FY26.xlsx",
  ppt: "EY_AI_Strategy_Deck_2026.pptx",
  agent: "EY_AI_Governance_Framework_2026.docx",
};

function MsTitleBar({ tabId }: { tabId: TabId }) {
  const accent = APP_ACCENT[tabId];
  const isMail = tabId === "outlook";
  const isTeams = tabId === "teams";
  const title = isMail ? "Mail — Outlook" : isTeams ? "Meeting — Teams" : (DOC_TITLES[tabId] ?? `${APP_NAME[tabId]}`);
  return (
    <div style={{
      background: C.white, borderBottom: `1px solid ${C.gray02}`,
      display: "flex", alignItems: "center", gap: 12, padding: "6px 12px", flexShrink: 0, minHeight: 40,
    }}>
      {!isMail && !isTeams && (
        <span style={{ fontFamily: F.regular, fontSize: 11, color: C.gray01, flexShrink: 0 }}>AutoSave Off</span>
      )}
      <span aria-hidden style={{ width: 8, height: 8, borderRadius: 2, background: accent, flexShrink: 0 }} />
      <span style={{
        fontFamily: F.bold, fontSize: 13, color: C.offBlack, whiteSpace: "nowrap",
        overflow: "hidden", textOverflow: "ellipsis", minWidth: 0,
      }}>{title}</span>
      <div style={{
        flex: 1, maxWidth: 280, height: 26, margin: "0 auto", borderRadius: 6, background: C.offWhite,
        display: "flex", alignItems: "center", gap: 6, padding: "0 10px",
      }}>
        <Search size={12} strokeWidth={1.75} color={C.gray01} aria-hidden />
        <span style={{ fontFamily: F.regular, fontSize: 11, color: C.gray01 }}>
          {isMail ? "Search emails" : isTeams ? "Search meetings" : "Search"}
        </span>
      </div>
      <span style={{
        fontFamily: F.bold, fontSize: 11, color: C.white, background: accent,
        padding: "5px 12px", borderRadius: 4, flexShrink: 0,
      }}>Share</span>
      <span style={{
        width: 26, height: 26, borderRadius: 13, background: C.confidentBlack,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.bold, fontSize: 10, color: C.white, flexShrink: 0,
      }}>EY</span>
    </div>
  );
}

function MsRibbon({ tabId }: { tabId: TabId }) {
  const accent = APP_ACCENT[tabId];
  const tools: LucideIcon[] =
    tabId === "ppt" ? [PlusSquare, LayoutTemplate, Type, Image, Play]
    : tabId === "excel" ? [Bold, Italic, Grid3x3, DollarSign, Percent]
    : tabId === "outlook" ? [Plus, CornerUpLeft, Archive, Trash2]
    : tabId === "teams" ? [Video, Mic, Users, Monitor]
    : [Bold, Italic, Underline, AlignLeft, List, ListOrdered];
  return (
    <div style={{ background: C.white, borderBottom: `1px solid ${C.gray02}`, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "0 10px", minHeight: 28 }}>
        {RIBBON_TABS[tabId].map((tab, i) => (
          <span key={tab} style={{
            fontFamily: i === 1 || tab === "Home" ? F.bold : F.regular,
            fontSize: 11, color: C.offBlack, padding: "6px 10px",
            borderBottom: tab === "Home" || (tabId === "outlook" && tab === "Home") || (tabId === "teams" && tab === "Chat") ? `2px solid ${accent}` : "2px solid transparent",
          }}>{tab}</span>
        ))}
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px" }}>
          <img src="/pipeline/copilot-icon.svg" alt="" width={13} height={13} style={{ objectFit: "contain", display: "block" }} />
          <span style={{ fontFamily: F.bold, fontSize: 11, color: accent }}>Copilot</span>
        </span>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 2, padding: "4px 10px 6px",
        background: C.offWhite,
      }}>
        {tools.map((icon, i) => (
          <MockTool key={i} icon={icon} active={i === 0} />
        ))}
      </div>
    </div>
  );
}

function CopilotComposer({
  tabId, typedText, accent,
}: {
  tabId: TabId;
  typedText: string;
  accent: string;
}) {
  return (
    <div style={{
      padding: "10px 12px 8px", background: C.white,
      border: `1px solid ${C.gray02}`, borderRadius: 12,
      height: 108, display: "flex", flexDirection: "column",
    }}>
      <p style={{
        margin: 0, flex: 1, minHeight: 0, fontFamily: F.regular, fontSize: 12, lineHeight: 1.5,
        color: typedText ? C.offBlack : C.gray01, overflow: "auto",
      }}>
        {typedText || COPILOT_PLACEHOLDER[tabId]}
        {typedText ? (
          <span aria-hidden style={{
            display: "inline-block", width: 1, height: 12, marginLeft: 1,
            background: C.offBlack, verticalAlign: "text-bottom",
          }} />
        ) : null}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ display: "inline-flex", gap: 8 }}>
          <Plus size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
          <Mic size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
        </span>
        <span style={{
          width: 26, height: 26, borderRadius: 13, background: accent,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Send size={12} strokeWidth={2} color={C.white} aria-hidden />
        </span>
      </div>
    </div>
  );
}

function CopilotSuggestionCards({
  prompts, activeIndex, onSelect, accent,
}: {
  prompts: { label: string; text: string }[];
  activeIndex: number | null;
  onSelect: (idx: number) => void;
  accent: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {prompts.map((p, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={p.label}
            type="button"
            onClick={() => onSelect(i)}
            style={{
              display: "block", width: "100%", textAlign: "left", cursor: "pointer",
              padding: "10px 12px", borderRadius: 10, fontFamily: F.regular,
              background: C.white,
              border: active ? `1px solid ${accent}` : `1px solid ${C.gray02}`,
              boxShadow: active ? `inset 3px 0 0 ${C.yellow}` : "none",
            }}
          >
            <span style={{ fontFamily: F.regular, fontSize: 12, color: C.offBlack, lineHeight: 1.4 }}>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function CopilotSidePane({
  tabId, prompts, activeIndex, typedText, onSelect,
}: {
  tabId: TabId;
  prompts: { label: string; text: string }[];
  activeIndex: number | null;
  typedText: string;
  onSelect: (idx: number) => void;
}) {
  const accent = APP_ACCENT[tabId];
  const isMail = tabId === "outlook";
  return (
    <aside
      aria-label={`Copilot in ${APP_NAME[tabId]}`}
      style={{
        width: 292, flexShrink: 0, background: C.white,
        borderLeft: `1px solid ${C.gray02}`,
        display: "flex", flexDirection: "column", minHeight: 0,
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
        borderBottom: `1px solid ${C.gray02}`, flexShrink: 0,
      }}>
        <Menu size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
        <ShieldCheck size={14} strokeWidth={1.75} color={C.success} aria-hidden />
        {isMail ? (
          <>
            <span style={{
              marginLeft: 4, display: "inline-flex", alignItems: "center", gap: 2,
              background: C.offWhite, borderRadius: 8, padding: 2,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6, background: C.white,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Briefcase size={11} strokeWidth={1.75} color={C.offBlack} aria-hidden />
              </span>
              <span style={{
                width: 22, height: 22, borderRadius: 6,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Globe size={11} strokeWidth={1.75} color={C.gray01} aria-hidden />
              </span>
            </span>
            <span style={{ flex: 1 }} />
          </>
        ) : (
          <>
            <img src="/pipeline/copilot-icon.svg" alt="" width={16} height={16} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: F.bold, fontSize: 13, color: C.offBlack, flex: 1 }}>Copilot</span>
          </>
        )}
        <span style={{
          width: 22, height: 22, borderRadius: 5, background: accent,
          display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Pencil size={11} strokeWidth={1.75} color={C.white} aria-hidden />
        </span>
        <MoreHorizontal size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
        <X size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </div>

      <div style={{ padding: "18px 14px 8px", flexShrink: 0 }}>
        <p style={{ margin: 0, fontFamily: F.bold, fontSize: 18, color: C.offBlack, lineHeight: 1.25 }}>
          {COPILOT_HEADING[tabId]}
        </p>
        {!isMail && tabId !== "teams" && (
          <span style={{
            marginTop: 8, fontFamily: F.regular, fontSize: 11, color: C.gray01,
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            Allow editing <ChevronDown size={12} strokeWidth={1.75} aria-hidden />
          </span>
        )}
      </div>

      <div style={{ padding: "0 12px 10px", flexShrink: 0 }}>
        <CopilotComposer tabId={tabId} typedText={typedText} accent={accent} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 12px 12px" }}>
        <CopilotSuggestionCards prompts={prompts} activeIndex={activeIndex} onSelect={onSelect} accent={accent} />
      </div>

      <div style={{
        padding: "8px 12px 12px", flexShrink: 0, display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: F.regular, fontSize: 10, color: C.gray01 }}>M365 Copilot</span>
        <span style={{ fontFamily: F.regular, fontSize: 11, color: C.gray01, display: "inline-flex", alignItems: "center", gap: 2 }}>
          See more <ChevronDown size={12} strokeWidth={1.75} aria-hidden />
        </span>
      </div>
    </aside>
  );
}

function WordWorkspace() {
  const bar = (w: string, h: number) => (
    <span aria-hidden style={{ display: "block", width: w, height: h, borderRadius: 4, background: MOCK_SKEL }} />
  );
  return (
    <div style={{ flex: 1, background: C.offWhite, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
      <div aria-hidden style={{
        height: 18, flexShrink: 0, backgroundColor: C.white, borderBottom: `1px solid ${C.gray02}`,
        backgroundImage: `repeating-linear-gradient(90deg, ${C.gray02} 0 1px, transparent 1px 24px)`,
      }} />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div aria-hidden style={{
          width: 18, flexShrink: 0, backgroundColor: C.white, borderRight: `1px solid ${C.gray02}`,
          backgroundImage: `repeating-linear-gradient(180deg, ${C.gray02} 0 1px, transparent 1px 24px)`,
        }} />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "20px 28px", overflow: "hidden" }}>
          <div style={{
            width: "100%", maxWidth: 520, background: C.white,
            padding: "36px 40px", display: "flex", flexDirection: "column", gap: 16,
            boxShadow: "0 1px 8px rgba(26, 26, 36, 0.06)",
          }}>
            {bar("72%", 16)}
            {bar("100%", 10)}
            {bar("100%", 10)}
            {bar("88%", 10)}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: 3, background: C.yellow, flexShrink: 0 }} />
              {bar("100%", 10)}
            </div>
            {bar("64%", 10)}
            {bar("100%", 10)}
          </div>
        </div>
      </div>
    </div>
  );
}

function PptWorkspace() {
  return (
    <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden", background: C.offWhite }}>
      <div style={{ width: 148, flexShrink: 0, padding: 12, display: "flex", flexDirection: "column", gap: 12, borderRight: `1px solid ${C.gray02}`, background: C.white }}>
        {[1, 2, 3, 4].map(n => (
          <div key={n} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: F.regular, fontSize: 11, color: C.gray01, width: 12 }}>{n}</span>
            <div style={{
              flex: 1, height: 64, borderRadius: 4, background: C.offWhite,
              border: n === 1 ? `1.5px solid ${C.yellow}` : `1px solid ${C.gray02}`,
              padding: 8, display: "flex", flexDirection: "column", gap: 4,
            }}>
              <span aria-hidden style={{ height: 5, width: "100%", borderRadius: 2, background: MOCK_SKEL }} />
              <span aria-hidden style={{ height: 4, width: "36%", borderRadius: 2, background: MOCK_SKEL }} />
              <span aria-hidden style={{ flex: 1, borderRadius: 2, background: MOCK_SKEL }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{
          width: "100%", maxWidth: 480, aspectRatio: "16 / 9", background: C.white,
          padding: 36, boxShadow: "0 8px 24px -8px rgba(26, 26, 36, 0.12)",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 16,
        }}>
          <div style={{
            border: `1px dashed ${C.gray02}`, padding: "10px 12px",
            fontFamily: F.regular, fontSize: 22, color: C.gray01,
          }}>Click to add title</div>
          <div style={{
            border: `1px dashed ${C.gray02}`, padding: "8px 12px", maxWidth: 280,
            fontFamily: F.regular, fontSize: 13, color: C.gray01,
          }}>Click to add subtitle</div>
        </div>
      </div>
    </div>
  );
}

const EXCEL_ROWS: { metric: string; value: string; total?: boolean }[] = [
  { metric: "Financial Metric", value: "Value (USD)" },
  { metric: "Enterprise AI Licenses", value: "45,000" },
  { metric: "Cloud Compute Allocation", value: "128,500" },
  { metric: "Advisory Governance Fee", value: "32,000" },
  { metric: "Model Auditing & Compliance", value: "15,000" },
  { metric: "", value: "" },
  { metric: "Total Operations Cost", value: "220,500", total: true },
];

function ExcelWorkspace() {
  const cols = ["A", "B", "C", "D", "E", "F"];
  const cell: React.CSSProperties = {
    borderRight: `1px solid ${C.gray02}`, borderBottom: `1px solid ${C.gray02}`,
    fontFamily: F.regular, fontSize: 12, color: C.offBlack, padding: "0 8px",
    display: "flex", alignItems: "center", height: 24, overflow: "hidden",
  };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden", background: C.white }}>
      <div style={{
        height: 35, borderBottom: `1px solid ${C.gray02}`, display: "flex", alignItems: "center",
        gap: 10, padding: "0 16px", flexShrink: 0,
      }}>
        <span style={{
          fontFamily: F.bold, fontSize: 12, color: C.offBlack, background: C.offWhite,
          border: `1px solid ${C.gray02}`, borderRadius: 4, padding: "2px 10px",
        }}>C7</span>
        <span aria-hidden style={{ width: 1, height: 16, background: C.gray02 }} />
        <span style={{ fontFamily: F.bold, fontSize: 13, color: C.gray01, fontStyle: "italic" }}>fx</span>
        <span style={{ fontFamily: F.regular, fontSize: 13, color: C.offBlack }}>=SUM(C2:C6)</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 2.2fr 1fr 1fr 1fr 1fr", background: C.offWhite }}>
          <span style={{ ...cell, justifyContent: "center" }} />
          {cols.map(c => (
            <span key={c} style={{ ...cell, justifyContent: "center", fontFamily: F.bold, fontSize: 11, color: C.gray01 }}>{c}</span>
          ))}
        </div>
        {EXCEL_ROWS.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr 2.2fr 1fr 1fr 1fr 1fr" }}>
            <span style={{ ...cell, justifyContent: "center", background: C.offWhite, fontSize: 11, color: C.gray01 }}>{i + 1}</span>
            <span style={cell} />
            <span style={{ ...cell, fontFamily: i === 0 || row.total ? F.bold : F.regular }}>{row.metric}</span>
            <span style={{
              ...cell,
              justifyContent: "flex-end",
              fontFamily: i === 0 || row.total ? F.bold : F.regular,
              outline: row.total ? `2px solid ${C.excelGreen}` : undefined,
              outlineOffset: -2,
              background: row.total ? C.offWhite : undefined,
            }}>{row.value}</span>
            <span style={cell} /><span style={cell} /><span style={cell} />
          </div>
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`e${i}`} style={{ display: "grid", gridTemplateColumns: "40px 1fr 2.2fr 1fr 1fr 1fr 1fr" }}>
            <span style={{ ...cell, justifyContent: "center", background: C.offWhite, fontSize: 11, color: C.gray01 }}>{i + 8}</span>
            {cols.map(c => <span key={c} style={cell} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

const OUTLOOK_MAILS = [
  { from: "EY Compliance Desk", time: "10:24 AM", subject: "AI Audit Status: Action Required", preview: "The regulatory dashboard has detected a slight drift..." },
  { from: "Sarah Jenkins", time: "9:15 AM", subject: "Re: Governance Framework Update", preview: "Hi Team, please find my comments on Section 3 attached..." },
  { from: "Microsoft Azure Team", time: "Yesterday", subject: "Azure Compute Quota Increase Approved", preview: "Your subscription request for the governance cluster..." },
  { from: "Internal Advisory", time: "Yesterday", subject: "Global AI Practice Newsletter - Q1", preview: "Welcome to the quarterly update. Check out the ascent journey..." },
];

function OutlookWorkspace() {
  const rail: { icon: LucideIcon; on?: boolean }[] = [
    { icon: Mail, on: true },
    { icon: Calendar },
    { icon: Users },
    { icon: ClipboardList },
  ];
  return (
    <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
      <div style={{
        width: 44, flexShrink: 0, background: C.offWhite, borderRight: `1px solid ${C.gray02}`,
        display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, gap: 4,
      }}>
        {rail.map(({ icon: Icon, on }) => (
          <span key={Icon.displayName ?? Icon.name} style={{
            width: 32, height: 32, borderRadius: 8,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: on ? C.white : "transparent",
            boxShadow: on ? `inset 0 0 0 1.5px ${C.outlookBlue}` : "none",
            color: on ? C.outlookBlue : C.gray01,
          }}>
            <Icon size={16} strokeWidth={1.75} aria-hidden />
          </span>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
        <div style={{ width: 118, flexShrink: 0, background: C.white, borderRight: `1px solid ${C.gray02}`, padding: 10 }}>
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            height: 30, marginBottom: 10, borderRadius: 6, background: C.outlookBlue,
            color: C.white, fontFamily: F.bold, fontSize: 11,
          }}>
            <Plus size={12} strokeWidth={1.75} aria-hidden /> New email
          </span>
          {[
            { name: "Inbox", badge: "3", on: true },
            { name: "Sent Items" },
            { name: "Drafts", badge: "1" },
            { name: "Archive" },
            { name: "Deleted Items" },
          ].map(f => (
            <div key={f.name} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              height: 28, padding: "0 8px", borderRadius: 4,
              background: f.on ? C.offWhite : "transparent",
            }}>
              <span style={{ fontFamily: f.on ? F.bold : F.regular, fontSize: 13, color: C.offBlack }}>{f.name}</span>
              {f.badge && (
                <span style={{
                  fontFamily: F.bold, fontSize: 10, color: C.offBlack, background: C.yellow,
                  borderRadius: 8, padding: "1px 6px",
                }}>{f.badge}</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ width: 188, flexShrink: 0, background: C.white, borderRight: `1px solid ${C.gray02}`, overflow: "hidden" }}>
          {OUTLOOK_MAILS.map((m, i) => (
            <div key={m.subject} style={{
              padding: "12px 14px", borderBottom: `1px solid ${C.gray02}`,
              background: i === 0 ? C.offWhite : C.white,
              borderLeft: i === 0 ? `3px solid ${C.yellow}` : "3px solid transparent",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: F.bold, fontSize: 12, color: C.offBlack }}>{m.from}</span>
                <span style={{ fontFamily: F.regular, fontSize: 11, color: C.gray01, flexShrink: 0 }}>{m.time}</span>
              </div>
              <p style={{ margin: "0 0 2px", fontFamily: F.regular, fontSize: 12, color: C.offBlack }}>{m.subject}</p>
              <p style={{ margin: 0, fontFamily: F.light, fontSize: 11, color: C.gray01, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.preview}</p>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0, background: C.white, padding: "16px 16px 20px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 40, height: 40, borderRadius: 20, background: C.confidentBlack,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: F.bold, fontSize: 13, color: C.white,
              }}>CD</span>
              <div>
                <p style={{ margin: 0, fontFamily: F.bold, fontSize: 14, color: C.offBlack }}>EY Compliance Desk</p>
                <p style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>To: AI Team Advisory Group</p>
              </div>
            </div>
            <span style={{ fontFamily: F.regular, fontSize: 11, color: C.gray01 }}>Today, 10:24 AM</span>
          </div>
          <p style={{ margin: "0 0 12px", fontFamily: F.bold, fontSize: 16, color: C.offBlack }}>AI Audit Status: Action Required</p>
          <p style={{ margin: "0 0 10px", fontFamily: F.regular, fontSize: 13, color: C.offBlack, lineHeight: 1.5 }}>Dear Team,</p>
          <p style={{ margin: "0 0 12px", fontFamily: F.regular, fontSize: 13, color: C.offBlack, lineHeight: 1.5 }}>
            The responsible AI metrics engine has signaled a drift warning within the core underwriting pipeline. All variables must undergo demographic parity testing immediately to maintain alignment with global standards.
          </p>
          <div style={{ background: C.offWhite, borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <p style={{ margin: "0 0 8px", fontFamily: F.bold, fontSize: 12, color: C.offBlack }}>Next Steps for Team Members:</p>
            <p style={{ margin: "0 0 4px", fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>• Review model logs and trace data lineage metadata</p>
            <p style={{ margin: 0, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>• Re-run demographic bias mitigation protocols</p>
          </div>
          <p style={{ margin: 0, fontFamily: F.regular, fontSize: 13, color: C.offBlack, lineHeight: 1.5 }}>Best regards, EY AI Governance Desk</p>
        </div>
      </div>
    </div>
  );
}

function MockStatusBar({ tabId }: { tabId: TabId }) {
  if (tabId === "excel") {
    return (
      <div style={{
        height: 40, background: C.white, borderTop: `1px solid ${C.gray02}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {["Sheet1", "Sheet2", "Summary"].map((s, i) => (
            <span key={s} style={{
              fontFamily: i === 0 ? F.bold : F.regular, fontSize: 12,
              color: i === 0 ? C.offBlack : C.gray01,
              padding: "4px 12px",
              borderBottom: i === 0 ? `2px solid ${C.yellow}` : "2px solid transparent",
            }}>{s}</span>
          ))}
          <Plus size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
        </div>
        <MockZoom />
      </div>
    );
  }
  const left =
    tabId === "ppt" ? ["Slide 3 of 12", "Notes", "Accessibility: Good to go"]
    : tabId === "outlook" ? ["Items: 142", "All folders up to date"]
    : tabId === "teams" ? ["In a meeting", "Transcription on"]
    : ["184 words", "1,124 characters", "English (US)"];
  return (
    <div style={{
      height: 30, background: C.white, borderTop: `1px solid ${C.gray02}`,
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0,
    }}>
      <div style={{ display: "flex", gap: 16, fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>
        {left.map(t => <span key={t}>{t}</span>)}
      </div>
      {tabId === "outlook"
        ? <span style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>Connected to Microsoft Exchange</span>
        : tabId === "teams"
        ? <span style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01 }}>Copilot available</span>
        : <MockZoom />}
    </div>
  );
}

function TeamsWorkspace() {
  const rail: { icon: LucideIcon; on?: boolean }[] = [
    { icon: MessagesSquare },
    { icon: Calendar, on: true },
    { icon: Users },
    { icon: Video },
  ];
  const people = [
    { initials: "PR", name: "Presenter" },
    { initials: "RK", name: "Reviewer" },
    { initials: "AM", name: "Organiser" },
    { initials: "EY", name: "You" },
  ];
  return (
    <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
      <div style={{
        width: 44, flexShrink: 0, background: C.offWhite, borderRight: `1px solid ${C.gray02}`,
        display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, gap: 4,
      }}>
        {rail.map(({ icon: Icon, on }) => (
          <span key={Icon.displayName ?? Icon.name} style={{
            width: 32, height: 32, borderRadius: 8,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: on ? C.white : "transparent",
            boxShadow: on ? `inset 0 0 0 1.5px ${C.teamsViolet}` : "none",
            color: on ? C.teamsViolet : C.gray01,
          }}>
            <Icon size={16} strokeWidth={1.75} aria-hidden />
          </span>
        ))}
      </div>
      <div style={{
        flex: 1, minWidth: 0, background: C.dark, padding: 16,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontFamily: F.bold, fontSize: 14, color: C.white }}>Weekly huddle</p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.onDarkMuted }}>
            <Mic size={14} strokeWidth={1.75} aria-hidden />
            <Video size={14} strokeWidth={1.75} aria-hidden />
            <Monitor size={14} strokeWidth={1.75} aria-hidden />
            <Sparkles size={14} strokeWidth={1.75} color={C.yellow} aria-hidden />
          </span>
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, minHeight: 0 }}>
          {people.map(p => (
            <div key={p.initials} style={{
              background: C.offBlack, borderRadius: 12, border: `1px solid ${C.borderOnDark}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
              minHeight: 0,
            }}>
              <span style={{
                width: 44, height: 44, borderRadius: 22, background: C.white,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: F.bold, fontSize: 13, color: C.offBlack,
              }}>{p.initials}</span>
              <span style={{ fontFamily: F.regular, fontSize: 12, color: C.onDarkMuted }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CopilotAppMock({
  tabId, prompts, activeIndex, typedText, onSelect,
}: {
  tabId: TabId;
  prompts: { label: string; text: string }[];
  activeIndex: number | null;
  typedText: string;
  onSelect: (idx: number) => void;
}) {
  const workspace =
    tabId === "excel" ? <ExcelWorkspace />
    : tabId === "ppt" ? <PptWorkspace />
    : tabId === "outlook" ? <OutlookWorkspace />
    : tabId === "teams" ? <TeamsWorkspace />
    : <WordWorkspace />;

  return (
    <div style={{
      width: "100%", minHeight: 640, background: C.offWhite, borderRadius: 12, overflow: "hidden",
      border: `1px solid ${C.gray02}`, boxShadow: "0 16px 40px rgba(26, 26, 36, 0.10)",
      display: "flex", flexDirection: "column",
    }}>
      <MsTitleBar tabId={tabId} />
      <MsRibbon tabId={tabId} />
      <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          {workspace}
        </div>
        <CopilotSidePane
          tabId={tabId}
          prompts={prompts}
          activeIndex={activeIndex}
          typedText={typedText}
          onSelect={onSelect}
        />
      </div>
      <MockStatusBar tabId={tabId} />
    </div>
  );
}

// ── Pattern 2: Use cases (top) → prompts + app mock side-by-side — all app tabs
function CopilotScene({ tabId }: { tabId: TabId }) {
  const d = SECTION_DATA[tabId];
  const { activeIndex, typedText, select } = useTypingPrompt();

  return (
    <>
      <div className="copilot-scene">
        {tabId === "m365" ? (
          <div className="copilot-scene-main copilot-scene-main--chat-tour">
            <M365ChatSlideTour />
          </div>
        ) : (
          <div className="copilot-scene-main">
            <CopilotAppMock
              tabId={tabId}
              prompts={d.prompts}
              activeIndex={activeIndex}
              typedText={typedText}
              onSelect={idx => select(idx, d.prompts[idx].text)}
            />
          </div>
        )}
      </div>
      <style>{`
        .copilot-scene {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }
        .copilot-scene-main {
          width: 100%;
        }
        .copilot-scene-main--chat-tour {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `}</style>
    </>
  );
}

// ── M365 Agent hub — unified MS Learn instructions in AgentBuilderShell ─────
const AGENT_BUILDER_NAV = ["Home", "Agents", "Create agent", "Knowledge", "Actions"] as const;

type AgentBuilderSidebarItem = {
  id: string;
  label: string;
  badge?: string;
  group?: string;
};

function AgentBuilderShell({
  children,
  fullPanel = false,
  sidebarTitle = "Agent Builder",
  sidebarItems,
  activeSidebarId,
  onSidebarSelect,
}: {
  children: ReactNode;
  fullPanel?: boolean;
  sidebarTitle?: string;
  sidebarItems?: readonly AgentBuilderSidebarItem[];
  activeSidebarId?: string;
  onSidebarSelect?: (id: string) => void;
}) {
  const focusRing = `2px solid ${C.yellow}`;

  const sidebarGroups = useMemo(() => {
    if (!sidebarItems?.length) return [];
    const order: string[] = [];
    const map = new Map<string, AgentBuilderSidebarItem[]>();
    for (const item of sidebarItems) {
      const groupLabel = item.group ?? "Other";
      if (!map.has(groupLabel)) {
        map.set(groupLabel, []);
        order.push(groupLabel);
      }
      map.get(groupLabel)!.push(item);
    }
    return order.map(label => ({ label, items: map.get(label)! }));
  }, [sidebarItems]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(sidebarItems?.map(item => item.group ?? "Other") ?? []),
  );

  useEffect(() => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      for (const item of sidebarItems ?? []) next.add(item.group ?? "Other");
      return next;
    });
  }, [sidebarItems]);

  useEffect(() => {
    if (!activeSidebarId || !sidebarItems) return;
    const activeItem = sidebarItems.find(item => item.id === activeSidebarId);
    if (activeItem?.group) {
      setExpandedGroups(prev => new Set(prev).add(activeItem.group!));
    }
  }, [activeSidebarId, sidebarItems]);

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupLabel)) next.delete(groupLabel);
      else next.add(groupLabel);
      return next;
    });
  };

  const renderSidebar = () => (
    <div
      style={{
        width: sidebarItems ? 260 : 200,
        flexShrink: 0,
        borderRight: `1px solid ${C.gray02}`,
        background: C.white,
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <p style={{ fontFamily: F.bold, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gray01, margin: "0 0 12px", padding: "0 8px", flexShrink: 0 }}>
        {sidebarTitle}
      </p>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, paddingRight: 2, minHeight: 0 }}>
        {sidebarItems ? (
          sidebarGroups.map(({ label, items }, groupIndex) => {
            const isExpanded = expandedGroups.has(label);
            const groupHasActive = items.some(item => item.id === activeSidebarId);
            return (
              <div key={label} style={{ marginTop: groupIndex === 0 ? 0 : 4 }}>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => toggleGroup(label)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 8px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: F.bold,
                    background: groupHasActive && !isExpanded ? C.yellow + "1A" : "transparent",
                  }}
                  onFocus={e => { e.currentTarget.style.outline = focusRing; }}
                  onBlur={e => { e.currentTarget.style.outline = "none"; }}
                >
                  <ChevronDown
                    size={14}
                    strokeWidth={1.75}
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      color: C.gray01,
                      transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: C.gray01,
                    }}
                  >
                    {label}
                  </span>
                  <span style={{ fontFamily: F.regular, fontSize: 10, color: C.gray01, flexShrink: 0 }}>
                    {items.length}
                  </span>
                </button>
                {isExpanded && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2, paddingLeft: 4 }}>
                    {items.map(item => {
                      const active = item.id === activeSidebarId;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-current={active ? "true" : undefined}
                          onClick={() => onSidebarSelect?.(item.id)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            padding: "7px 10px",
                            borderRadius: 8,
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            fontFamily: F.regular,
                            background: active ? "rgba(255,230,0,0.2)" : "transparent",
                          }}
                          onFocus={e => { e.currentTarget.style.outline = focusRing; }}
                          onBlur={e => { e.currentTarget.style.outline = "none"; }}
                        >
                          {item.badge && (
                            <span
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                flexShrink: 0,
                                background: active ? C.yellow : "transparent",
                                border: `1.5px solid ${active ? C.yellow : C.gray02}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 700,
                                color: C.dark2,
                                fontFamily: F.bold,
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                          <span
                            style={{
                              flex: 1,
                              minWidth: 0,
                              fontSize: 12,
                              fontWeight: 400,
                              color: active ? C.dark2 : C.gray01,
                              lineHeight: 1.35,
                            }}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          AGENT_BUILDER_NAV.map(item => {
            const active = item === "Create agent";
            return (
              <div
                key={item}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  fontFamily: F.regular,
                  fontSize: 12,
                  fontWeight: active ? 700 : 400,
                  color: active ? C.dark2 : C.gray01,
                  background: active ? C.yellow + "33" : "transparent",
                }}
              >
                {item}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        border: `1px solid ${C.gray02}`,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        height: 680,
        maxHeight: 680,
        minHeight: 520,
        background: C.offWhite,
        textAlign: "left",
      }}
    >
      {renderSidebar()}

      {fullPanel ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, overflow: "hidden", background: C.white }}>
          {children}
        </div>
      ) : (
        <>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              minWidth: 0,
            }}
          >
            <div style={{ textAlign: "center", maxWidth: 360, width: "100%" }}>
              <p style={{ fontFamily: F.bold, fontSize: 22, fontWeight: 700, color: C.dark2, margin: "0 0 20px", lineHeight: 1.25 }}>
                Build your own specialist agent
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: 999,
                  border: `1px solid ${C.gray02}`,
                  background: C.white,
                  boxShadow: "0 2px 8px rgba(46,46,56,0.06)",
                }}
              >
                <Sparkles size={16} strokeWidth={1.75} color={C.teamsViolet} aria-hidden />
                <span style={{ fontFamily: F.regular, fontSize: 13, color: C.gray01 }}>Message Agent Builder</span>
              </div>
            </div>
          </div>
          <div
            style={{
              width: 380,
              flexShrink: 0,
              borderLeft: `1px solid ${C.gray02}`,
              background: C.white,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${C.gray02}`,
                background: C.confidentBlack,
              }}
            >
              <p style={{ fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.yellow, margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Instructions
              </p>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>{children}</div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Shared copy + MS Learn inline formatting helpers ─────────────────────────
function useCopyText() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return { copied, copy };
}

function VerbatimInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              style={{
                fontFamily: F.regular,
                fontSize: "0.92em",
                background: C.offWhite,
                border: `1px solid ${C.gray02}`,
                borderRadius: 4,
                padding: "1px 5px",
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </>
  );
}

function AgentCodeBlock({ code }: { code: string }) {
  return (
    <pre
      style={{
        fontFamily: F.regular,
        fontSize: 12,
        color: C.white,
        lineHeight: 1.7,
        whiteSpace: "pre-wrap",
        margin: 0,
        background: C.dark2,
        borderRadius: 8,
        padding: "14px 16px",
        border: "0.75px solid rgba(255,255,255,0.08)",
      }}
    >
      {code}
    </pre>
  );
}

function CopyButton({ text, label = "Copy template" }: { text: string; label?: string }) {
  const { copied, copy } = useCopyText();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        minHeight: 44,
        borderRadius: 8,
        border: `0.75px solid ${C.gray02}`,
        background: C.offWhite,
        cursor: "pointer",
        fontFamily: F.regular,
        fontSize: 13,
        fontWeight: 700,
        color: C.dark2,
      }}
    >
      {copied ? (
        <>
          <Check size={16} strokeWidth={1.75} color={colors.success} aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Copy size={16} strokeWidth={1.75} aria-hidden />
          {label}
        </>
      )}
    </button>
  );
}

function getPatternCopyText(pattern: AgentPattern): string {
  return [
    pattern.goodPrecision,
    pattern.deepReasoning,
    pattern.fastReasoning,
    pattern.template,
  ].filter(Boolean).join("\n\n");
}

function AgentPatternBody({ pattern }: { pattern: AgentPattern }) {
  const bodyStyle = { fontFamily: F.regular, fontSize: 13, color: C.dark2, lineHeight: 1.6, margin: 0 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {pattern.intro && (
        <p style={bodyStyle}>
          <VerbatimInline text={pattern.intro} />
          {pattern.name === "Apply a literal-execution header for immediate stability" && (
            <>
              {" For more information, see "}
              <a href={MS_LEARN_MODEL_MIGRATION} target="_blank" rel="noopener noreferrer" style={{ color: C.teamsViolet, fontWeight: 700 }}>
                Model changes in GPT 5.1+ for declarative agents
              </a>
              .
            </>
          )}
        </p>
      )}

      {pattern.goodPrecision && (
        <div>
          <p style={{ ...bodyStyle, fontWeight: 700, marginBottom: 8 }}><VerbatimInline text="**Good precision**:" /></p>
          <AgentCodeBlock code={pattern.goodPrecision} />
        </div>
      )}

      {pattern.deepReasoning && (
        <div>
          <p style={{ ...bodyStyle, fontWeight: 700, marginBottom: 8 }}><VerbatimInline text="**Trigger deep reasoning**:" /></p>
          <AgentCodeBlock code={pattern.deepReasoning} />
        </div>
      )}

      {pattern.fastReasoning && (
        <div>
          <p style={{ ...bodyStyle, fontWeight: 700, marginBottom: 8 }}><VerbatimInline text="**Force fast and minimal reasoning**:" /></p>
          <AgentCodeBlock code={pattern.fastReasoning} />
        </div>
      )}

      {pattern.template && (
        <div>
          {pattern.goodPrecision && (
            <p style={{ ...bodyStyle, fontWeight: 700, marginBottom: 8 }}><VerbatimInline text="**Output contract**:" /></p>
          )}
          <AgentCodeBlock code={pattern.template} />
        </div>
      )}

      {pattern.whenToUseIntro && pattern.whenToUse && (
        <div>
          <p style={{ ...bodyStyle, marginBottom: 8 }}>{pattern.whenToUseIntro}</p>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            {pattern.whenToUse.map(item => (
              <li key={item} style={bodyStyle}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <CopyButton text={getPatternCopyText(pattern)} label="Copy template" />
    </div>
  );
}

function AgentImportantCallout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        padding: "14px 16px",
        borderRadius: 10,
        background: "rgba(255,230,0,0.12)",
        border: `1px solid ${C.yellow}`,
        marginTop: 16,
      }}
    >
      <AlertTriangle size={18} strokeWidth={1.75} color={C.dark2} aria-hidden style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, lineHeight: 1.6 }}>
        <p style={{ fontFamily: F.bold, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>Important</p>
        {children}
      </div>
    </div>
  );
}

function AgentProse({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontFamily: F.regular, fontSize: 14, color: C.dark2, lineHeight: 1.65, margin: "0 0 12px", ...style }}>
      {children}
    </p>
  );
}

function AgentBulletList({ items, style }: { items: readonly string[]; style?: React.CSSProperties }) {
  return (
    <ul
      style={{
        margin: "0 0 16px",
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        ...style,
      }}
    >
      {items.map(item => (
        <li
          key={item}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            fontFamily: F.regular,
            fontSize: 14,
            color: C.dark2,
            lineHeight: 1.6,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              marginTop: 8,
              flexShrink: 0,
              borderRadius: "50%",
              background: C.offBlack,
            }}
          />
          <span>
            <VerbatimInline text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function buildAgentInstructionNav(): AgentInstructionNavItem[] {
  return [
    { id: "intro", group: "Intro", label: "Overview & framing questions", title: "Write effective instructions for declarative agents" },
    { id: "components", group: "Components", label: "Instruction components", title: "Instruction components", subtitle: "Purpose, guidelines, skills, and optional components" },
    ...AGENT_MS_BEST_PRACTICES.map(bp => ({
      id: `bp-${bp.n}`,
      group: "Best Practices",
      badge: bp.n,
      label: bp.title,
      title: bp.title,
    })),
    ...AGENT_PROMPT_FAILURES.map(f => ({
      id: `fail-${f.n}`,
      group: "Failures",
      badge: f.n,
      label: f.title,
      title: f.title,
    })),
    ...AGENT_ADVANCED_TOPICS.map(topic => ({
      id: `adv-${topic.n}`,
      group: "Advanced",
      badge: topic.n,
      label: topic.title,
      title: topic.title,
    })),
    { id: "example", group: "Example", label: "IT agent full example", title: "Example instructions", subtitle: EXAMPLE_INSTRUCTIONS_INTRO },
    ...AGENT_INSTRUCTION_PATTERNS.map(p => ({
      id: `pat-${p.n}`,
      group: "Patterns",
      badge: p.n,
      label: p.name,
      title: p.name,
    })),
  ];
}

function AgentInstructionsHub() {
  const navItems = buildAgentInstructionNav();
  const [activeId, setActiveId] = useState(navItems[0]?.id ?? "intro");
  const activeIndex = navItems.findIndex(item => item.id === activeId);
  const active = navItems[activeIndex] ?? navItems[0];
  const activePattern = AGENT_INSTRUCTION_PATTERNS.find(p => active.id === `pat-${p.n}`);
  const activeFailure = AGENT_PROMPT_FAILURES.find(f => active.id === `fail-${f.n}`);
  const activeBestPractice = AGENT_MS_BEST_PRACTICES.find(bp => active.id === `bp-${bp.n}`);
  const activeAdvanced = AGENT_ADVANCED_TOPICS.find(t => active.id === `adv-${t.n}`);

  const sidebarItems: AgentBuilderSidebarItem[] = navItems.map(item => ({
    id: item.id,
    group: item.group,
    badge: item.badge,
    label: item.label,
  }));

  const renderMainContent = () => {
    if (active.id === "intro") {
      return (
        <>
          <AgentProse>{AGENT_INTRO_BODY}</AgentProse>
          <AgentBulletList items={AGENT_INTRO_QUESTIONS} />
          <AgentProse>
            If your declarative agent also has API plugins as actions, the OpenAPI document for your plugin helps the agent understand any instructions referring to the API. For more information, see{" "}
            <a href={MS_LEARN_OPENAPI_GUIDANCE} target="_blank" rel="noopener noreferrer" style={{ color: C.teamsViolet, fontWeight: 700 }}>How to make an OpenAPI document effective in extending Copilot</a>.
          </AgentProse>
          <AgentProse>
            This guidance applies to developers and makers who use Agent Builder in Microsoft 365 Copilot or Microsoft 365 Agents Toolkit to create declarative agents. For Copilot Studio agents, see{" "}
            <a href={MS_LEARN_COPILOT_STUDIO_INSTRUCTIONS} target="_blank" rel="noopener noreferrer" style={{ color: C.teamsViolet, fontWeight: 700 }}>Configure high-quality instructions for generative orchestration</a>.
          </AgentProse>
          <AgentImportantCallout>
            <AgentProse style={{ margin: 0 }}>{AGENT_GPT_MIGRATION_CALLOUT} For more information, see{" "}
              <a href={MS_LEARN_MODEL_MIGRATION} target="_blank" rel="noopener noreferrer" style={{ color: C.teamsViolet, fontWeight: 700 }}>Model changes in GPT 5.1+ for declarative agents</a>.
            </AgentProse>
          </AgentImportantCallout>
          <AgentImportantCallout>
            <AgentProse style={{ margin: 0 }}>{AGENT_SHAREPOINT_XPIA_CALLOUT}</AgentProse>
          </AgentImportantCallout>
        </>
      );
    }

    if (active.id === "components") {
      return (
        <>
          <AgentProse>
            A well-structured set of instructions ensures that the agent understands its role, the tasks it should perform, and how to interact with users. The main components of declarative agent instructions are:
          </AgentProse>
          <AgentBulletList items={AGENT_COMPONENTS_MAIN} />
          <AgentProse>When relevant, also include the following components in the instructions:</AgentProse>
          <AgentBulletList items={AGENT_COMPONENTS_OPTIONAL} />
          <AgentImportantCallout>
            <AgentProse style={{ margin: 0 }}>{AGENT_SHAREPOINT_XPIA_CALLOUT}</AgentProse>
          </AgentImportantCallout>
        </>
      );
    }

    if (activeBestPractice) {
      return (
        <>
          {activeBestPractice.paragraphs?.map(p => (
            <AgentProse key={p}><VerbatimInline text={p} /></AgentProse>
          ))}
          {activeBestPractice.bullets && <AgentBulletList items={activeBestPractice.bullets} />}
          {activeBestPractice.codeBlocks?.map(block => (
            <div key={block.label} style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: F.bold, fontSize: 13, fontWeight: 700, color: C.dark2, margin: "0 0 8px" }}>{block.label}</p>
              <AgentCodeBlock code={block.code} />
            </div>
          ))}
          {activeBestPractice.n === "09" && (
            <AgentProse>
              For more information, see{" "}
              <a href={MS_LEARN_SPECIAL_INSTRUCTIONS} target="_blank" rel="noopener noreferrer" style={{ color: C.teamsViolet, fontWeight: 700 }}>Special instructions object</a>.
            </AgentProse>
          )}
          {activeBestPractice.n === "11" && (
            <AgentProse style={{ marginTop: 8 }}>This approach works because GPT‑5&apos;s routing system includes reasoning-token awareness.</AgentProse>
          )}
        </>
      );
    }

    if (activeFailure) {
      return (
        <>
          <AgentProse>{AGENT_FAILURES_INTRO}</AgentProse>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 8 }}>
            <div style={{ background: "rgba(255,65,54,0.06)", borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${colors.error}` }}>
              <p style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: F.bold, fontSize: 10, fontWeight: 700, color: colors.error, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" }}>
                <XCircle size={14} strokeWidth={1.75} aria-hidden />
                Problem
              </p>
              <p style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, lineHeight: 1.55, margin: 0 }}>{activeFailure.problem}</p>
            </div>
            <div style={{ background: "rgba(0,200,100,0.06)", borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${colors.success}` }}>
              <p style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: F.bold, fontSize: 10, fontWeight: 700, color: colors.success, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" }}>
                <CheckCircle size={14} strokeWidth={1.75} aria-hidden />
                Solution
              </p>
              <p style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, lineHeight: 1.55, margin: 0 }}>{activeFailure.solution}</p>
            </div>
          </div>
        </>
      );
    }

    if (activeAdvanced) {
      return (
        <>
          <AgentProse>{activeAdvanced.body}</AgentProse>
          {activeAdvanced.link && (
            <AgentProse>
              For more information, see{" "}
              <a href={activeAdvanced.link.href} target="_blank" rel="noopener noreferrer" style={{ color: C.teamsViolet, fontWeight: 700 }}>{activeAdvanced.link.label}</a>.
            </AgentProse>
          )}
          {activeAdvanced.n === "15" && (
            <ol style={{ margin: "12px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {AGENT_ITERATE_STEPS.map(step => (
                <li key={step} style={{ fontFamily: F.regular, fontSize: 14, color: C.dark2, lineHeight: 1.6 }}>
                  <VerbatimInline text={step} />
                </li>
              ))}
            </ol>
          )}
        </>
      );
    }

    if (active.id === "example") {
      return (
        <>
          <AgentProse>{EXAMPLE_INSTRUCTIONS_INTRO}</AgentProse>
          <div style={{ background: C.dark2, borderRadius: 10, padding: "16px 18px", border: "0.75px solid rgba(255,255,255,0.08)", overflowX: "auto", marginTop: 8, maxHeight: 420, overflowY: "auto" }}>
            <pre style={{ fontFamily: F.regular, fontSize: 12, color: C.white, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
              {IT_AGENT_FULL_EXAMPLE}
            </pre>
          </div>
          <div style={{ marginTop: 14 }}>
            <CopyButton text={IT_AGENT_FULL_EXAMPLE} label="Copy all" />
          </div>
        </>
      );
    }

    if (activePattern) {
      return (
        <>
          <AgentProse>{PATTERNS_SECTION_INTRO}</AgentProse>
          <div style={{ marginTop: 16 }}>
            <AgentPatternBody pattern={activePattern} />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <AgentBuilderShell
        fullPanel
        sidebarTitle="Instructions Guide"
        sidebarItems={sidebarItems}
        activeSidebarId={activeId}
        onSidebarSelect={setActiveId}
      >
        <div
          style={{
            padding: "16px 24px",
            background: C.confidentBlack,
            borderBottom: `1px solid rgba(255,255,255,0.12)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          {active.badge && (
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                flexShrink: 0,
                background: C.yellow,
                color: C.dark2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: F.bold,
              }}
            >
              {active.badge}
            </span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: F.bold, fontSize: 15, fontWeight: 700, color: C.onDark, margin: 0, lineHeight: 1.3 }}>
              {active.title}
            </p>
            {active.subtitle && (
              <p style={{ fontFamily: F.regular, fontSize: 12, color: C.onDarkSubtle, margin: "4px 0 0", lineHeight: 1.45 }}>{active.subtitle}</p>
            )}
          </div>
          <span style={{ fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.yellow, letterSpacing: "0.04em" }}>
            {activeIndex + 1}/{navItems.length}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px 24px", minHeight: 0 }}>
          {renderMainContent()}
        </div>

        <div
          style={{
            padding: "14px 24px",
            borderTop: `1px solid ${C.gray02}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0,
            background: C.offWhite,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveId(navItems[Math.max(0, activeIndex - 1)].id)}
            disabled={activeIndex === 0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              minHeight: 44,
              borderRadius: 8,
              border: `1px solid ${C.gray02}`,
              background: C.white,
              cursor: activeIndex === 0 ? "not-allowed" : "pointer",
              opacity: activeIndex === 0 ? 0.45 : 1,
              fontFamily: F.regular,
              fontSize: 13,
              fontWeight: 700,
              color: C.dark2,
            }}
          >
            <ChevronLeft size={16} strokeWidth={1.75} aria-hidden />
            Previous
          </button>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {navItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to ${item.label}`}
                onClick={() => setActiveId(item.id)}
                style={{
                  width: i === activeIndex ? 22 : 8,
                  height: 8,
                  borderRadius: 999,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === activeIndex ? C.yellow : C.gray02,
                  transition: "width 0.2s, background 0.2s",
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActiveId(navItems[Math.min(navItems.length - 1, activeIndex + 1)].id)}
            disabled={activeIndex === navItems.length - 1}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              minHeight: 44,
              borderRadius: 8,
              border: "none",
              background: activeIndex === navItems.length - 1 ? C.gray02 : C.yellow,
              cursor: activeIndex === navItems.length - 1 ? "not-allowed" : "pointer",
              opacity: activeIndex === navItems.length - 1 ? 0.45 : 1,
              fontFamily: F.regular,
              fontSize: 13,
              fontWeight: 700,
              color: C.dark2,
            }}
          >
            Next
            <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </AgentBuilderShell>
      <p style={{ fontFamily: F.regular, fontSize: 12, color: C.gray01, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
        Source:{" "}
        <a href={MS_LEARN_AGENT_INSTRUCTIONS} target="_blank" rel="noopener noreferrer" style={{ color: C.teamsViolet, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
          Microsoft Learn — Write effective instructions for declarative agents
          <ExternalLink size={12} strokeWidth={1.75} aria-hidden />
        </a>
      </p>
    </>
  );
}

function FullWorkedExampleCard() {
  return (
    <>
      <AgentProse>{EXAMPLE_INSTRUCTIONS_INTRO}</AgentProse>
      <div style={{ background: C.dark2, borderRadius: 10, padding: "16px 18px", border: "0.75px solid rgba(255,255,255,0.08)", overflowX: "auto", marginTop: 8, maxHeight: 420, overflowY: "auto" }}>
        <pre style={{ fontFamily: F.regular, fontSize: 12, color: C.white, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
          {IT_AGENT_FULL_EXAMPLE}
        </pre>
      </div>
      <div style={{ marginTop: 14 }}>
        <CopyButton text={IT_AGENT_FULL_EXAMPLE} label="Copy all" />
      </div>
    </>
  );
}

function AgentPager({
  items,
  activeIndex,
  onSelect,
}: {
  items: readonly { id: string; label: string }[];
  activeIndex: number;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      style={{
        padding: "14px 24px",
        borderTop: `1px solid ${C.gray02}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexShrink: 0,
        background: C.offWhite,
      }}
    >
      <button
        type="button"
        onClick={() => onSelect(items[Math.max(0, activeIndex - 1)].id)}
        disabled={activeIndex === 0}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          minHeight: 44,
          borderRadius: 8,
          border: `1px solid ${C.gray02}`,
          background: C.white,
          cursor: activeIndex === 0 ? "not-allowed" : "pointer",
          opacity: activeIndex === 0 ? 0.45 : 1,
          fontFamily: F.regular,
          fontSize: 13,
          fontWeight: 700,
          color: C.dark2,
        }}
      >
        <ChevronLeft size={16} strokeWidth={1.75} aria-hidden />
        Previous
      </button>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to ${item.label}`}
            onClick={() => onSelect(item.id)}
            style={{
              width: i === activeIndex ? 22 : 8,
              height: 8,
              borderRadius: 999,
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: i === activeIndex ? C.yellow : C.gray02,
              transition: "width 0.2s, background 0.2s",
            }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onSelect(items[Math.min(items.length - 1, activeIndex + 1)].id)}
        disabled={activeIndex === items.length - 1}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          minHeight: 44,
          borderRadius: 8,
          border: "none",
          background: activeIndex === items.length - 1 ? C.gray02 : C.yellow,
          cursor: activeIndex === items.length - 1 ? "not-allowed" : "pointer",
          opacity: activeIndex === items.length - 1 ? 0.45 : 1,
          fontFamily: F.regular,
          fontSize: 13,
          fontWeight: 700,
          color: C.dark2,
        }}
      >
        Next
        <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}

function AgentPanelHeader({
  badge,
  title,
  subtitle,
  counter,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  counter: string;
}) {
  return (
    <div
      style={{
        padding: "16px 24px",
        background: C.confidentBlack,
        borderBottom: `1px solid ${C.borderOnDark}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        flexShrink: 0,
      }}
    >
      {badge && (
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            flexShrink: 0,
            background: C.yellow,
            color: C.dark2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: F.bold,
          }}
        >
          {badge}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: F.bold, fontSize: 15, fontWeight: 700, color: C.onDark, margin: 0, lineHeight: 1.3 }}>
          {title}
        </p>
        {subtitle && (
          <p style={{ fontFamily: F.regular, fontSize: 12, color: C.onDarkSubtle, margin: "4px 0 0", lineHeight: 1.45 }}>
            {subtitle}
          </p>
        )}
      </div>
      <span style={{ fontFamily: F.bold, fontSize: 12, fontWeight: 700, color: C.yellow, letterSpacing: "0.04em" }}>
        {counter}
      </span>
    </div>
  );
}

function AgentLabeledBlock({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone: "weak" | "strong" | "neutral";
}) {
  const accent = tone === "weak" ? colors.error : tone === "strong" ? colors.success : C.gray01;
  const Icon = tone === "weak" ? XCircle : tone === "strong" ? CheckCircle : Info;
  return (
    <div
      style={{
        background: C.offWhite,
        borderRadius: 10,
        padding: "14px 16px",
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <p
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: F.bold,
          fontSize: 10,
          fontWeight: 700,
          color: accent,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          margin: "0 0 8px",
        }}
      >
        <Icon size={14} strokeWidth={1.75} aria-hidden />
        {label}
      </p>
      <p style={{ fontFamily: F.regular, fontSize: 13, color: C.dark2, lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap" }}>
        {text}
      </p>
    </div>
  );
}

/** Black + yellow stack — same pattern as the terminology “What is a prompt?” card. */
function AgentSplitToneCard({
  top,
  bottom,
}: {
  top: { label: string; text: string; icon: LucideIcon };
  bottom: { label: string; text: string; icon: LucideIcon };
}) {
  const labelStyle = (onYellow: boolean): React.CSSProperties => ({
    margin: 0,
    fontFamily: F.bold,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: onYellow ? C.offBlack : C.onDarkMuted,
  });
  const iconBox: React.CSSProperties = {
    width: 24,
    height: 24,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const headingRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  };
  const bodyStyle = (onYellow: boolean): React.CSSProperties => ({
    margin: 0,
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 1.55,
    whiteSpace: "pre-wrap",
    color: onYellow ? C.offBlack : C.white,
  });
  const panelPad: React.CSSProperties = {
    padding: "16px 18px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    textAlign: "left",
    minWidth: 0,
  };

  const TopIcon = top.icon;
  const BottomIcon = bottom.icon;

  return (
    <div
      role="group"
      aria-label={`${top.label} and ${bottom.label}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 8,
      }}
    >
      <div style={{ ...panelPad, background: C.dark }}>
        <div style={headingRow}>
          <span style={iconBox} aria-hidden>
            <TopIcon size={24} strokeWidth={1.75} />
          </span>
          <p style={labelStyle(false)}>{top.label}</p>
        </div>
        <p style={bodyStyle(false)}>{top.text}</p>
      </div>
      <div style={{ ...panelPad, background: C.yellow }}>
        <div style={headingRow}>
          <span style={iconBox} aria-hidden>
            <BottomIcon size={24} strokeWidth={1.75} />
          </span>
          <p style={labelStyle(true)}>{bottom.label}</p>
        </div>
        <p style={bodyStyle(true)}>{bottom.text}</p>
      </div>
    </div>
  );
}

function AgentWeakStrongCard({ weak, strong }: { weak: string; strong: string }) {
  return (
    <AgentSplitToneCard
      top={{ label: "Weak instruction", text: weak, icon: CircleX }}
      bottom={{ label: "Strong instruction", text: strong, icon: CircleCheckBig }}
    />
  );
}

/** Figma 4412:7179 — dark left rail bullets for Elements best-practice beats. */
const AGENT_DARK_RAIL_TITLE: React.CSSProperties = {
  margin: 0,
  fontFamily: F.regular,
  fontSize: 16,
  lineHeight: 1.25,
  letterSpacing: "-0.01em",
  color: C.offWhite,
};

const AGENT_DARK_RAIL_BODY: React.CSSProperties = {
  margin: 0,
  fontFamily: F.light,
  fontSize: 12,
  fontWeight: 300,
  lineHeight: 1.4,
  letterSpacing: "-0.01em",
  color: C.offWhite,
};

const AGENT_DARK_RAIL_PANEL: React.CSSProperties = {
  flex: "0 0 47%",
  maxWidth: "47%",
  background: C.dark2,
  padding: "20px 24px 28px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minHeight: 0,
  overflowY: "auto",
};

function AgentElementsDarkBullets({ title, items }: { title?: string; items: readonly string[] }) {
  return (
    <div
      style={{
        ...AGENT_DARK_RAIL_PANEL,
        justifyContent: "flex-start",
      }}
    >
      {title && <p style={AGENT_DARK_RAIL_TITLE}>{title}</p>}
      {items.map(item => (
        <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: 8,
              background: C.offWhite,
              marginTop: 5,
              flexShrink: 0,
            }}
          />
          <p style={AGENT_DARK_RAIL_BODY}>{item}</p>
        </div>
      ))}
    </div>
  );
}

function AgentInstructionPreviewCard({
  label,
  text,
  tone,
  highlightPulse,
}: {
  label: string;
  text: string;
  tone: "weak" | "strong";
  highlightPulse?: boolean;
}) {
  const accent = tone === "weak" ? colors.error : colors.success;
  const Icon = tone === "weak" ? CircleX : CircleCheckBig;
  return (
    <div
      className={highlightPulse ? "agent-tech-strong-pulse" : undefined}
      style={{
        border: `1px solid ${C.gray02}`,
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: C.white,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon size={24} strokeWidth={1.75} color={accent} aria-hidden />
        <p
          style={{
            margin: 0,
            fontFamily: F.bold,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {label}
        </p>
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: F.regular,
          fontSize: 13,
          lineHeight: 1.55,
          color: C.offBlack,
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </p>
    </div>
  );
}

/** Figma 4412:7179 — Agent Builder configure mock with Instructions weak/strong cards. */
function AgentBuilderConfigurePreview({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        background: C.white,
        borderLeft: `1px solid ${C.gray02}`,
        minHeight: 0,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: `1px solid ${C.gray02}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 10px",
            borderRadius: 999,
            border: `1px solid ${C.gray02}`,
            fontFamily: F.regular,
            fontSize: 11,
            color: C.offBlack,
          }}
        >
          <img src={AGENT_HEX_SRC} alt="" width={14} height={14} style={{ display: "block" }} />
          Agent Builder
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 10px",
            borderRadius: 6,
            border: `1px solid ${C.gray02}`,
            fontFamily: F.regular,
            fontSize: 11,
            color: C.offBlack,
          }}
        >
          Configure <ChevronDown size={12} strokeWidth={1.75} color={C.gray01} aria-hidden />
        </span>
        <span style={{ flex: 1 }} />
        <Plus size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
        <MoreHorizontal size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
        <X size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <img src={AGENT_HEX_SRC} alt="" width={44} height={44} style={{ display: "block", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontFamily: F.bold,
                fontSize: 20,
                fontWeight: 700,
                color: C.offBlack,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Agent <PenLine size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
            </p>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.regular, fontSize: 12, color: C.gray01, flexShrink: 0 }}>
            Auto <ChevronDown size={12} strokeWidth={1.75} aria-hidden />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function AgentElementsSplitBody({
  title,
  leftItems,
  right,
}: {
  title?: string;
  leftItems: readonly string[];
  right: ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        overflow: "hidden",
        borderTop: `1px solid ${C.gray02}`,
        background: C.white,
      }}
    >
      <AgentElementsDarkBullets title={title} items={leftItems} />
      <AgentBuilderConfigurePreview>{right}</AgentBuilderConfigurePreview>
    </div>
  );
}

function AgentElementsInstructionsPanel({
  weak,
  strong,
  reasoningLevels,
  strongLabel,
  pulseStrong,
}: {
  weak?: string;
  strong?: string;
  reasoningLevels?: readonly { label: string; text: string }[];
  strongLabel?: string;
  pulseStrong?: boolean;
}) {
  return (
    <div
      style={{
        border: `1px solid ${C.gray02}`,
        borderRadius: 18,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: F.bold, fontSize: 14, fontWeight: 700, color: C.offBlack }}>Instructions</span>
        <Info size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reasoningLevels?.map(level => (
          <AgentInstructionPreviewCard key={level.label} label={level.label} text={level.text} tone="strong" />
        ))}
        {weak && (
          <AgentInstructionPreviewCard label="Weak instruction" text={weak} tone="weak" />
        )}
        {strong && (
          <AgentInstructionPreviewCard
            label={strongLabel ?? (weak ? "Strong instruction" : "Example")}
            text={strong}
            tone="strong"
            highlightPulse={pulseStrong}
          />
        )}
      </div>
    </div>
  );
}

const splitLabelStyle = (onYellow: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  margin: 0,
  fontFamily: F.bold,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: onYellow ? C.offBlack : C.onDarkMuted,
});

const TECHNIQUE_ICON = 18;
const STATUS_ICON = 24;

/** Techniques: When to use as scan bullets, Don’t vs Do, copy, raw workbook one click away. */
function AgentTechniquePatternCard({ pattern }: { pattern: AgentTechniqueItem }) {
  const [showRaw, setShowRaw] = useState(false);
  const whenItems = parseWhenToUse(pattern.whenToUse);
  const { dont, doLines } = parseTaxExample(pattern.taxExample);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {whenItems.length > 0 && (
        <div
          style={{
            background: C.offWhite,
            border: `1px solid ${C.gray02}`,
            borderRadius: 12,
            padding: "16px 18px",
          }}
        >
          <p style={{ ...splitLabelStyle(false), color: C.gray01, marginBottom: 10 }}>
            <CircleHelp size={TECHNIQUE_ICON} strokeWidth={1.75} aria-hidden />
            When to use
          </p>
          <AgentBulletList items={whenItems} style={{ margin: 0 }} />
        </div>
      )}

      <div
        role="group"
        aria-label="Don’t write this, then the instruction to copy"
        style={{ borderRadius: 12, overflow: "hidden" }}
      >
        {dont && (
          <div style={{ background: C.dark, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={splitLabelStyle(false)}>
              <CircleX size={STATUS_ICON} strokeWidth={1.75} aria-hidden />
              Don’t write this
            </p>
            <p style={{ margin: 0, fontFamily: F.regular, fontSize: 13, lineHeight: 1.55, color: C.white }}>
              {dont}
            </p>
          </div>
        )}
        <div style={{ background: C.yellow, padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={splitLabelStyle(true)}>
            <CircleCheckBig size={STATUS_ICON} strokeWidth={1.75} aria-hidden />
            Write this Instead
          </p>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {doLines.map((line, i) => (
              <li
                key={`${i}-${line}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontFamily: F.regular,
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: C.offBlack,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    minWidth: 18,
                    fontFamily: F.bold,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.offBlack,
                  }}
                >
                  {i + 1}.
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div>
        <button
          type="button"
          aria-expanded={showRaw}
          onClick={() => setShowRaw(open => !open)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: F.regular,
            fontSize: 13,
            fontWeight: 700,
            color: C.gray01,
          }}
        >
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            aria-hidden
            style={{ transform: showRaw ? "rotate(180deg)" : "none", transition: "transform 150ms ease" }}
          />
          Show workbook wording
        </button>
        {showRaw && (
          <pre
            style={{
              margin: "8px 0 0",
              padding: "14px 16px",
              borderRadius: 10,
              background: C.offWhite,
              border: `1px solid ${C.gray02}`,
              fontFamily: F.regular,
              fontSize: 12,
              lineHeight: 1.55,
              color: C.dark2,
              whiteSpace: "pre-wrap",
            }}
          >
            {`When to use\n${pattern.whenToUse.trim()}\n\nTax example\n${pattern.taxExample.trim()}`}
          </pre>
        )}
      </div>
    </div>
  );
}

function AgentElementsTab({ openId }: { openId?: string } = {}) {
  const navItems: AgentBuilderSidebarItem[] = [
    ...AGENT_BEST_PRACTICES_SLIDES.map(s => ({
      id: `bp-${s.n}`,
      label: s.heading,
      badge: s.n,
      group: "Agent Best Practices",
    })),
    ...AGENT_COMMON_FAILURES.map(f => ({
      id: `fail-${f.n}`,
      label: f.title,
      badge: f.n,
      group: "Common Failures",
    })),
  ];

  const [activeId, setActiveId] = useState(
    openId && navItems.some(item => item.id === openId) ? openId : (navItems[0]?.id ?? "bp-01"),
  );
  const activeIndex = navItems.findIndex(item => item.id === activeId);
  const active = navItems[activeIndex] ?? navItems[0];
  const practice = AGENT_BEST_PRACTICES_SLIDES.find(s => active.id === `bp-${s.n}`);
  const failure = AGENT_COMMON_FAILURES.find(f => active.id === `fail-${f.n}`);

  return (
    <AgentBuilderShell
      fullPanel
      sidebarTitle="Elements"
      sidebarItems={navItems}
      activeSidebarId={activeId}
      onSidebarSelect={setActiveId}
    >
      <AgentPanelHeader
        badge={active.badge}
        title={practice?.heading ?? failure?.title ?? active.label}
        counter={`${activeIndex + 1}/${navItems.length}`}
      />
      {practice && (
        <AgentElementsSplitBody
          title={practice.sub}
          leftItems={practice.content}
          right={
            <AgentElementsInstructionsPanel
              weak={practice.reasoningLevels ? undefined : practice.weak}
              strong={practice.reasoningLevels ? undefined : practice.strong}
              reasoningLevels={practice.reasoningLevels}
            />
          }
        />
      )}
      {failure && (
        <AgentElementsSplitBody
          title="What happens and how to fix it"
          leftItems={[failure.whatHappens, failure.fix]}
          right={<AgentElementsInstructionsPanel strong={failure.example} />}
        />
      )}
      <AgentPager items={navItems} activeIndex={Math.max(0, activeIndex)} onSelect={setActiveId} />
    </AgentBuilderShell>
  );
}

const TECHNIQUE_STEP_STYLES = `
@keyframes agent-tech-strong-ring {
  0% {
    border-color: ${C.yellow};
    box-shadow: 0 0 0 0 rgba(255, 230, 0, 0.45);
    background: rgba(255, 230, 0, 0.32);
  }
  100% {
    border-color: ${C.yellow};
    box-shadow: 0 0 0 8px rgba(255, 230, 0, 0);
    background: rgba(255, 230, 0, 0.2);
  }
}
.agent-tech-strong-pulse {
  animation: agent-tech-strong-ring 300ms ease-out;
}
@media (prefers-reduced-motion: reduce) {
  .agent-tech-strong-pulse {
    animation: none;
  }
}
`;

/** Matches AgentBuilderShell active sidebar item (aria-current). */
const TECHNIQUE_INSTRUCTIONS_HIGHLIGHT = {
  background: "rgba(255,230,0,0.2)",
  border: `1.5px solid ${C.yellow}`,
} as const;

function useAgentTechniqueStepTransition(stepKey: string) {
  const [visible, setVisible] = useState(true);
  const [pulseStrong, setPulseStrong] = useState(false);
  const prevKey = useRef(stepKey);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (stepKey === prevKey.current) return;
    prevKey.current = stepKey;

    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPulseStrong(false);

    if (reduceMotion) {
      setVisible(true);
      return;
    }

    setVisible(false);
    timers.current.push(
      setTimeout(() => {
        setVisible(true);
        timers.current.push(
          setTimeout(() => {
            setPulseStrong(true);
            timers.current.push(setTimeout(() => setPulseStrong(false), 300));
          }, 250),
        );
      }, 250),
    );
  }, [stepKey, reduceMotion]);

  const stepMotionStyle: React.CSSProperties = reduceMotion
    ? { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }
    : {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 250ms ease-out, transform 250ms ease-out",
      };

  return { stepMotionStyle, pulseStrong };
}

/** Figma 4421:8439 — When to use card (Pattern Summary column D). */
function AgentWhenToUseCard({ items }: { items: readonly string[] }) {
  if (!items.length) return null;
  return (
    <div
      style={{
        background: C.offWhite,
        border: `1.5px solid ${C.gray02}`,
        borderRadius: 12,
        padding: 18,
        width: "100%",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <CircleHelp size={24} strokeWidth={1.75} color={C.offBlack} aria-hidden />
        <span
          style={{
            fontFamily: F.bold,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: C.offBlack,
          }}
        >
          When to use
        </span>
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: 20,
          fontFamily: F.regular,
          fontSize: 13,
          lineHeight: 1.55,
          color: C.offBlack,
        }}
      >
        {items.map(item => (
          <li key={item} style={{ marginBottom: 4 }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function AgentTechniqueInstructionsPreview({
  text,
  pulseStrong,
  footer,
}: {
  text: string;
  pulseStrong?: boolean;
  footer?: ReactNode;
}) {
  return (
    <div
      className={pulseStrong ? "agent-tech-strong-pulse" : undefined}
      style={{
        ...TECHNIQUE_INSTRUCTIONS_HIGHLIGHT,
        borderRadius: 18,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            flexShrink: 0,
            background: C.yellow,
            border: `1.5px solid ${C.yellow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden
        >
          <ClipboardList size={12} strokeWidth={1.75} color={C.dark2} />
        </span>
        <span style={{ fontFamily: F.bold, fontSize: 14, fontWeight: 700, color: C.dark2 }}>Instructions</span>
        <Info size={14} strokeWidth={1.75} color={C.gray01} aria-hidden />
      </div>
      <div
        style={{
          borderRadius: 12,
          padding: 14,
          background: C.white,
          border: `1px solid ${C.gray02}`,
          maxHeight: 320,
          overflowY: "auto",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: F.regular,
            fontSize: 13,
            lineHeight: 1.55,
            color: C.offBlack,
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </pre>
      </div>
      {footer}
    </div>
  );
}

/** Figma 4421:8439 — dark summary rail + Agent Builder instructions preview. */
function AgentTechniqueFigmaSplit({
  headline,
  body,
  whenItems,
  instructionText,
  pulseStrong,
  footer,
}: {
  headline: string;
  body: string;
  whenItems: readonly string[];
  instructionText: string;
  pulseStrong?: boolean;
  footer?: ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        overflow: "hidden",
        borderTop: `1px solid ${C.gray02}`,
        background: C.white,
      }}
    >
      <div
        style={{
          ...AGENT_DARK_RAIL_PANEL,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={AGENT_DARK_RAIL_TITLE}>{headline}</p>
          {body && <p style={AGENT_DARK_RAIL_BODY}>{body}</p>}
        </div>
        <AgentWhenToUseCard items={whenItems} />
      </div>
      <AgentBuilderConfigurePreview>
        <AgentTechniqueInstructionsPreview text={instructionText} pulseStrong={pulseStrong} footer={footer} />
      </AgentBuilderConfigurePreview>
    </div>
  );
}

function AgentTechniqueSplitContent({
  pattern,
  pulseStrong,
}: {
  pattern: AgentTechniqueItem;
  pulseStrong?: boolean;
}) {
  const { headline, body } = parseSummaryParts(pattern.summary);
  const whenItems = parseWhenToUse(pattern.whenToUse);
  const instructionText = formatTechniqueInstructionPreview(pattern.taxExample);

  return (
    <AgentTechniqueFigmaSplit
      headline={headline}
      body={body}
      whenItems={whenItems}
      instructionText={instructionText}
      pulseStrong={pulseStrong}
    />
  );
}

function AgentTechniqueExampleSplitContent() {
  return (
    <AgentTechniqueFigmaSplit
      headline="IT agent full example"
      body="Copy this declarative-agent instruction set into Agent Builder → Configure → Instructions and adapt it for your team's tax workflows."
      whenItems={[
        "Complete instruction set for an IT agent",
        "Structured for Agent Builder configure panel",
        "Copy and adapt for your tax workflows",
      ]}
      instructionText={IT_AGENT_FULL_EXAMPLE}
      footer={<CopyButton text={IT_AGENT_FULL_EXAMPLE} label="Copy all" />}
    />
  );
}

function AgentTechniquesTab({ openId }: { openId?: string } = {}) {
  const navItems: AgentBuilderSidebarItem[] = [
    ...AGENT_TECHNIQUE_PATTERNS.map(p => ({
      id: `pat-${p.n}`,
      label: p.name,
      badge: p.n,
      group: "Patterns",
    })),
    { id: "example", label: "IT agent full example", badge: "Ex", group: "Example" },
  ];

  const [activeId, setActiveId] = useState(
    openId && navItems.some(item => item.id === openId) ? openId : (navItems[0]?.id ?? "pat-01"),
  );
  const activeIndex = navItems.findIndex(item => item.id === activeId);
  const active = navItems[activeIndex] ?? navItems[0];
  const pattern = AGENT_TECHNIQUE_PATTERNS.find(p => active.id === `pat-${p.n}`);
  const { stepMotionStyle, pulseStrong } = useAgentTechniqueStepTransition(activeId);

  return (
    <>
      <style>{TECHNIQUE_STEP_STYLES}</style>
      <AgentBuilderShell
        fullPanel
        sidebarTitle="Techniques"
        sidebarItems={navItems}
        activeSidebarId={activeId}
        onSidebarSelect={setActiveId}
      >
        <AgentPanelHeader
          badge={active.badge}
          title={pattern?.name ?? active.label}
          counter={`${activeIndex + 1}/${navItems.length}`}
        />
        <div style={stepMotionStyle}>
          {active.id === "example" ? (
            <AgentTechniqueExampleSplitContent />
          ) : pattern ? (
            <AgentTechniqueSplitContent pattern={pattern} pulseStrong={pulseStrong} />
          ) : null}
        </div>
        <AgentPager items={navItems} activeIndex={Math.max(0, activeIndex)} onSelect={setActiveId} />
      </AgentBuilderShell>
    </>
  );
}

const SUMMARY_TABLE_COLUMNS = ["Best Practice", "Likely failure", "Pattern"] as const;

const summaryThStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 1,
  padding: "12px 16px",
  textAlign: "left",
  verticalAlign: "top",
  fontFamily: F.bold,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: C.gray01,
  background: C.offWhite,
  borderBottom: `2px solid ${C.gray02}`,
  borderRight: `1px solid ${C.gray02}`,
};

const summaryTdBase: React.CSSProperties = {
  padding: "16px",
  verticalAlign: "top",
  borderBottom: `1px solid ${C.gray02}`,
  borderRight: `1px solid ${C.gray02}`,
  lineHeight: 1.55,
  color: C.offBlack,
};

function SummaryCellList({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  if (items.length === 1) {
    return (
      <span style={{ fontFamily: F.light, fontSize: 13, fontWeight: 300, lineHeight: 1.55, color: C.offBlack }}>
        {items[0]}
      </span>
    );
  }
  return (
    <ul
      style={{
        margin: 0,
        paddingLeft: 18,
        fontFamily: F.light,
        fontSize: 13,
        fontWeight: 300,
        lineHeight: 1.55,
        color: C.offBlack,
      }}
    >
      {items.map(item => (
        <li key={item} style={{ marginBottom: 8 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Summary sheet from xlsx — plain 3-column table per learner question. */
function AgentSummaryPlainTable({ rows }: { rows: readonly AgentSummaryRow[] }) {
  return (
    <div style={{ overflowX: "auto", flex: 1, minHeight: 0 }}>
      <table
        style={{
          width: "100%",
          minWidth: 640,
          tableLayout: "fixed",
          borderCollapse: "collapse",
          border: `1px solid ${C.gray02}`,
          background: C.white,
        }}
      >
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "32%" }} />
          <col style={{ width: "38%" }} />
        </colgroup>
        <thead>
          <tr>
            {SUMMARY_TABLE_COLUMNS.map((col, i) => (
              <th
                key={col}
                scope="col"
                style={{
                  ...summaryThStyle,
                  borderRight: i === SUMMARY_TABLE_COLUMNS.length - 1 ? "none" : summaryThStyle.borderRight,
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.practice}
              style={{ background: index % 2 === 0 ? C.white : C.offWhite }}
            >
              <td
                style={{
                  ...summaryTdBase,
                  fontFamily: F.bold,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {row.practice}
              </td>
              <td style={summaryTdBase}>
                <SummaryCellList items={row.failures} />
              </td>
              <td style={{ ...summaryTdBase, borderRight: "none" }}>
                <SummaryCellList items={row.patterns} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AgentSummaryTab() {
  const navItems: AgentBuilderSidebarItem[] = AGENT_SUMMARY_PARTS.map(part => ({
    id: `sum-${part.n}`,
    label: part.question,
    badge: part.n,
    group: "Learner questions",
  }));

  const [activeId, setActiveId] = useState(navItems[0]?.id ?? "sum-01");
  const activeIndex = navItems.findIndex(item => item.id === activeId);
  const part = AGENT_SUMMARY_PARTS.find(p => activeId === `sum-${p.n}`) ?? AGENT_SUMMARY_PARTS[0];

  return (
    <AgentBuilderShell
      fullPanel
      sidebarTitle="Summary"
      sidebarItems={navItems}
      activeSidebarId={activeId}
      onSidebarSelect={setActiveId}
    >
      <AgentPanelHeader
        badge={part.n}
        title={part.question}
        counter={`${activeIndex + 1}/${navItems.length}`}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", minHeight: 0, display: "flex", flexDirection: "column" }}>
        <AgentSummaryPlainTable rows={part.rows} />
      </div>
      <AgentPager items={navItems} activeIndex={Math.max(0, activeIndex)} onSelect={setActiveId} />
    </AgentBuilderShell>
  );
}

const PEEK_FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Summary stay-put peek: technique card for one pattern, no Techniques tab jump. */
function AgentPatternPeekSheet({
  patternId,
  onClose,
}: {
  patternId: string;
  onClose: () => void;
}) {
  const pattern = AGENT_TECHNIQUE_PATTERNS.find(p => `pat-${p.n}` === patternId);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!pattern) {
      onClose();
    }
  }, [pattern, onClose]);

  useEffect(() => {
    if (!pattern) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(PEEK_FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [pattern, onClose]);

  if (!pattern) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `24px var(--ey-content-inline-pad, 24px)`,
        background: `color-mix(in srgb, ${C.confidentBlack} 62%, transparent)`,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "min(760px, var(--ey-content-width), 100%)",
          maxHeight: "min(90vh, 720px)",
          height: "min(90vh, 680px)",
          background: C.white,
          borderRadius: 14,
          border: `1px solid ${C.gray02}`,
          borderTop: `4px solid ${C.yellow}`,
          boxShadow: `0 24px 64px color-mix(in srgb, ${C.confidentBlack} 28%, transparent)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "18px 20px",
            background: C.offWhite,
            borderBottom: `1px solid ${C.gray02}`,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              flexShrink: 0,
              background: C.yellow,
              color: C.offBlack,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.bold,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {pattern.n}
          </span>
          <h2
            id={titleId}
            style={{
              flex: 1,
              minWidth: 0,
              margin: 0,
              fontFamily: F.bold,
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              color: C.offBlack,
            }}
          >
            {pattern.name}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
              minHeight: 44,
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${C.gray02}`,
              background: C.white,
              cursor: "pointer",
              fontFamily: F.bold,
              fontSize: 13,
              fontWeight: 700,
              color: C.offBlack,
            }}
          >
            Close
            <X size={16} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "24px 28px 28px", background: C.white }}>
          <AgentTechniquePatternCard key={pattern.n} pattern={pattern} />
        </div>
      </div>
    </div>
  );
}

const AGENT_HUB_TABS = [
  { id: "elements", label: "Elements" },
  { id: "techniques", label: "Techniques" },
  { id: "summary", label: "Summary" },
] as const;
type AgentHubTabId = (typeof AGENT_HUB_TABS)[number]["id"];

export function AgentHubTabs({ variant = "hub" }: { variant?: "hub" | "rail" } = {}) {
  const [activeSubTab, setActiveSubTab] = useState<AgentHubTabId>("elements");
  const [guideOpenId, setGuideOpenId] = useState<string | undefined>();
  const [previewPatternId, setPreviewPatternId] = useState<string | null>(null);

  const closePatternPeek = useCallback(() => setPreviewPatternId(null), []);

  const selectHubTab = (id: AgentHubTabId) => {
    setGuideOpenId(undefined);
    setPreviewPatternId(null);
    setActiveSubTab(id);
  };

  const patternPeekSheet = previewPatternId ? (
    <AgentPatternPeekSheet
      key={previewPatternId}
      patternId={previewPatternId}
      onClose={closePatternPeek}
    />
  ) : null;

  const fieldGuideTabs = (
    <div
      role="tablist"
      aria-label="Instruction guide views"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        width: "min(520px, 100%)",
        margin: 0,
        padding: 5,
        border: `1px solid ${C.gray02}`,
        borderRadius: 12,
        background: C.white,
        boxShadow: `0 12px 30px color-mix(in srgb, ${C.confidentBlack} 10%, transparent)`,
      }}
    >
      {AGENT_HUB_TABS.map(t => {
        const selected = activeSubTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => selectHubTab(t.id)}
            style={{
              position: "relative",
              minHeight: 46,
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: selected ? F.bold : F.regular,
              fontWeight: selected ? 700 : 400,
              background: selected ? C.confidentBlack : "transparent",
              color: selected ? C.white : C.gray01,
              transition: "background 150ms ease, color 150ms ease",
            }}
          >
            {t.label}
            {selected && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 18,
                  right: 18,
                  bottom: 6,
                  height: 2,
                  borderRadius: 2,
                  background: C.yellow,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  if (variant === "rail") {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TabRail
            tabs={[...AGENT_HUB_TABS]}
            active={activeSubTab}
            onChange={selectHubTab}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          {activeSubTab === "elements" && <AgentElementsTab openId={guideOpenId} />}
          {activeSubTab === "techniques" && <AgentTechniquesTab openId={guideOpenId} />}
          {activeSubTab === "summary" && (
            <AgentSummaryTab />
          )}
        </div>
        {patternPeekSheet}
      </div>
    );
  }

  // Hub only: Field Guide chrome replaces the old yellow pills, not the agent tour above.
  return (
    <div className="page" style={{ marginTop: 32 }}>
      <header
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "14px 14px 0 0",
          background: C.confidentBlack,
          color: C.white,
          textAlign: "left",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: "0 0 auto",
            height: 4,
            background: spectrumCss(1),
          }}
        />
        <div style={{ padding: "36px 28px 56px" }}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              margin: "0 0 12px",
              color: C.yellow,
              fontFamily: F.bold,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <Lightbulb size={18} strokeWidth={1.75} aria-hidden />
            Agent builder field guide
          </p>
          <h2
            style={{
              margin: "0 0 12px",
              color: C.white,
              fontFamily: F.bold,
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
            }}
          >
            Write instructions agents can follow
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: 560,
              color: C.onDarkMuted,
              fontFamily: F.light,
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Find a proven practice, understand the failure it prevents, and copy an instruction you can adapt. Every example is taken directly from the approved workbook.
          </p>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: -28,
          position: "relative",
          zIndex: 2,
        }}
      >
        {fieldGuideTabs}
      </div>

      <div style={{ marginTop: 20 }}>
        {activeSubTab === "elements" && <AgentElementsTab openId={guideOpenId} />}
        {activeSubTab === "techniques" && <AgentTechniquesTab openId={guideOpenId} />}
        {activeSubTab === "summary" && (
          <AgentSummaryTab />
        )}
      </div>
      {patternPeekSheet}
    </div>
  );
}


// ── App icon — real MS 365 / Office product logos from public/pipeline/ ───────
function AppIcon({ logo, label, size = 24 }: { logo: string; label: string; size?: number }) {
  return (
    <img
      src={logo}
      alt=""
      aria-hidden
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0, display: "block" }}
      title={label}
    />
  );
}

// ── Laptop stage widget — "What you can do" (Figma/legacy pattern from Module1) ─
function LaptopStage({ onOpenApp }: { onOpenApp: (id: TabId) => void }) {
  return (
    <div style={{ position: "relative", zIndex: 1, width: 560, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {/* Laptop mockup + popping apps */}
      <div style={{ position: "relative", width: "100%", minHeight: 430, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Keyboard base */}
        <div style={{ position: "absolute", bottom: 38, width: "94%", maxWidth: 472, height: 50, background: `linear-gradient(180deg, ${C.dark2}, ${C.dark})`, borderRadius: "6px 6px 20px 20px", transform: "rotateX(55deg)", boxShadow: "0 24px 44px rgba(0,0,0,0.5)" }} />
        {/* Laptop screen */}
        <div style={{ width: "min(430px, 94%)", height: 260, background: `linear-gradient(145deg, ${C.dark}, ${C.dark2})`, border: `3px solid ${C.dark2}`, borderRadius: "18px 18px 10px 10px", boxShadow: "0 30px 70px rgba(0,0,0,0.55), 0 0 28px rgba(180,0,255,0.18)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 12, borderRadius: 12, background: C.dark }} />
          <div style={{ position: "absolute", zIndex: 5, width: "78%", textAlign: "center", left: "50%", top: "50%", transform: "translate(-50%, -46%)", pointerEvents: "none" }}>
            <p style={{ color: C.yellow, fontSize: "clamp(19px, 2.2vw, 26px)", fontWeight: 700, marginBottom: 8, lineHeight: 1.15, fontFamily: F.regular }}>What you can do</p>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 12, lineHeight: 1.5, fontFamily: F.regular }}>Click the popping Apps to explore the M365 copilot use cases in Tax</p>
          </div>
        </div>

        {/* Floating (popping) apps — jump to matching prompt tab. Real MS app
            logos sit on a white tile (they're full-color, transparent-bg SVGs
            that would disappear or clash on a colored/dark fill — same reason
            CoreProcessingPipeline.tsx keeps them on a neutral backdrop). */}
        {LAPTOP_CORE_APPS.map(app => (
          <button
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            title={`Open ${app.label} tax use cases`}
            style={{
              position: "absolute",
              width: 64, height: 64,
              borderRadius: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.5)",
              cursor: "pointer",
              background: C.white,
              boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
              zIndex: 20,
              animation: "laptopStageFloat 5s ease-in-out infinite",
              transition: "transform 0.2s, box-shadow 0.2s",
              ...app.pos,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12) translateY(-3px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
          >
            <img src={app.logo} alt={app.label} style={{ width: 40, height: 40, objectFit: "contain" }} />
            <span style={{ position: "absolute", bottom: -22, fontSize: 11, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", fontFamily: F.regular, fontWeight: 700 }}>{app.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes laptopStageFloat {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -12px; }
        }
      `}</style>
    </div>
  );
}

const AGENT_VIEW_PILLS = [
  { id: "what", label: "What" },
  { id: "how", label: "How" },
  { id: "drafting", label: "Effective Drafting" },
] as const;
type AgentViewId = (typeof AGENT_VIEW_PILLS)[number]["id"];

// ── Full tab section ──────────────────────────────────────────────────────────
function TabSection({ tabId, surface = "offWhite" }: { tabId: TabId; surface?: "offWhite" | "white" }) {
  const d = SECTION_DATA[tabId];
  const tabMeta = TABS.find(t => t.id === tabId)!;
  const [agentView, setAgentView] = useState<AgentViewId>("what");
  // Default offWhite matches #prompt-repository. White is only for #m365-agent.
  const background = surface === "white" ? C.white : C.offWhite;
  return (
    <div style={{ background, padding: `48px 0 64px` }}>
      <div style={{ ...contentRailStyle }}>
      {/* Tab header — centered for all tabs */}
      <header style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 36 }}>
        <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: F.bold, fontSize: typeScale.h2.size, fontWeight: 700, color: C.dark2, margin: 0, lineHeight: 1.2, letterSpacing: typeScale.h2.tracking }}>
          {/* Header title mark only — tab pills keep the default 24px AppIcon. */}
          <AppIcon logo={tabMeta.logo} label={APP_NAME[tabId]} size={40} />
          {d.h2}
        </p>
      </header>

      {tabId === "agent" ? (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TabRail tabs={[...AGENT_VIEW_PILLS]} active={agentView} onChange={setAgentView} />
          </div>
          {agentView === "what" && <M365AgentHowExplorer />}
          {agentView === "how" && (
            <AgentInstructionComponents />
          )}
          {agentView === "drafting" && <AgentHubTabs />}
        </>
      ) : (
        <CopilotScene tabId={tabId} />
      )}
      </div>
    </div>
  );
}

// Useful Links — top 30% holds a Lucide line icon on a yellow-accent tile.
type UsefulLink = {
  title: string;
  body: string;
  cta: string;
  icon: LucideIcon;
};

const USEFUL_LINKS: UsefulLink[] = [
  { title: "Outlook Copilot Resources", body: "Access quick reference sheets and guides for secure email automation.",                  cta: "View Guides",    icon: Mail },
  { title: "EY Prompt Library",         body: "Explore verified prompts created and vetted specifically by professional services.",      cta: "Browse Library", icon: BookOpen },
  { title: "Copilot FAQs",              body: "Find quick answers regarding workspace licenses, token limits, and prompt accuracy.",     cta: "Read FAQs",      icon: CircleHelp },
  { title: "Explore Agents",            body: "Discover AI agents built for specific EY workflows, from tax research to audit support.", cta: "Explore Agents", icon: Bot },
  { title: "Manage Access",             body: "Review your Copilot license status, request access, or manage permissions for your team.",cta: "Manage Access",  icon: ShieldCheck },
];

type SecurityChecklistItem = {
  num: string;
  title: string;
  body: string;
  image?: string;
  italicBody?: string;
  /** When false, card is text-only (no infographic lightbox). */
  hasInfographic?: boolean;
};

// ── Security checklist (4-step — cards 1–3 open infographic lightbox) ────────
const SECURITY_CHECKLIST: SecurityChecklistItem[] = [
  {
    num: "1",
    title: "Before You Upload: Check Who Really Has Access",
    body: 'Find and remove broad access (e.g., “People in EY”). Once someone opens that link, they’re added to the access list and the file becomes eligible for Copilot in their prompts.',
    image: "/security/copilot4.png",
  },
  {
    num: "2",
    title: "Sensitivity Labels: Your First Line of Copilot Control",
    body: "Add EY sensitivity labels to emails and files so Copilot is blocked for others (note: the label owner can still use their labelled content).",
    image: "/security/copilot3.png",
  },
  {
    num: "3",
    title: "Sharing Smartly: Choose Links That Limit Visibility",
    body: 'When sending links, choose “People you choose” (or “People with existing access”) instead of org-wide sharing.',
    image: "/security/copilot2.png",
  },
  {
    num: "4",
    title: "Quick Check Before You Use Copilot",
    body: "Ask yourself:",
    italicBody: "Would I be comfortable if M365 Copilot referenced this content in a colleague’s prompt?",
    hasInfographic: false,
  },
];

const LIGHTBOX_PAD = 24;
const LIGHTBOX_MIN_ZOOM = 1;
const LIGHTBOX_MAX_ZOOM = 4;

function SecurityImageLightbox({
  item,
  onClose,
}: {
  item: SecurityChecklistItem;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const scaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const dragRef = useRef<{ panX: number; panY: number; startX: number; startY: number } | null>(null);

  const [scale, setScale] = useState(LIGHTBOX_MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const clampScale = (next: number) =>
    Math.min(LIGHTBOX_MAX_ZOOM, Math.max(LIGHTBOX_MIN_ZOOM, next));

  const applyScale = (next: number) => {
    const clamped = clampScale(next);
    scaleRef.current = clamped;
    setScale(clamped);
    if (clamped <= LIGHTBOX_MIN_ZOOM) {
      panRef.current = { x: 0, y: 0 };
      setPan({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;

      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyScale(scaleRef.current + (e.deltaY > 0 ? -0.12 : 0.12));
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      pinchRef.current = { dist, scale: scaleRef.current };
      dragRef.current = null;
    } else if (e.touches.length === 1 && scaleRef.current > LIGHTBOX_MIN_ZOOM) {
      dragRef.current = {
        panX: panRef.current.x,
        panY: panRef.current.y,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
      };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      applyScale(pinchRef.current.scale * (dist / pinchRef.current.dist));
    } else if (e.touches.length === 1 && dragRef.current && scaleRef.current > LIGHTBOX_MIN_ZOOM) {
      e.preventDefault();
      const next = {
        x: dragRef.current.panX + (e.touches[0].clientX - dragRef.current.startX),
        y: dragRef.current.panY + (e.touches[0].clientY - dragRef.current.startY),
      };
      panRef.current = next;
      setPan(next);
    }
  };

  const onTouchEnd = () => {
    pinchRef.current = null;
    dragRef.current = null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || scaleRef.current <= LIGHTBOX_MIN_ZOOM) return;
    dragRef.current = {
      panX: panRef.current.x,
      panY: panRef.current.y,
      startX: e.clientX,
      startY: e.clientY,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || scaleRef.current <= LIGHTBOX_MIN_ZOOM) return;
    const next = {
      x: dragRef.current.panX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.panY + (e.clientY - dragRef.current.startY),
    };
    panRef.current = next;
    setPan(next);
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} security infographic`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: `color-mix(in srgb, ${C.dark} 92%, transparent)`,
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: LIGHTBOX_PAD,
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close infographic"
        style={{
          position: "fixed",
          top: LIGHTBOX_PAD,
          right: LIGHTBOX_PAD,
          zIndex: 9999,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: C.surfaceOnDark,
          border: `1px solid ${C.borderOnDark}`,
          color: C.onDark,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={22} strokeWidth={1.75} aria-hidden />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "min(92vw, 1200px)",
          maxHeight: "92vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={viewportRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            overflow: "hidden",
            touchAction: "none",
            cursor: scale > LIGHTBOX_MIN_ZOOM ? "grab" : "zoom-in",
            maxWidth: "100%",
            maxHeight: "92vh",
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            draggable={false}
            style={{
              display: "block",
              maxWidth: "min(92vw, 1200px)",
              maxHeight: "92vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              borderRadius: 12,
              boxShadow: `0 24px 64px color-mix(in srgb, ${C.dark} 60%, transparent)`,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "center center",
              userSelect: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function M365CopilotHub({
  onBack,
  onNavigate,
}: {
  onBack?: () => void;
  onNavigate?: (path: string) => void;
}) {
  useModuleSectionHashScroll();
  const [activeTab, setActiveTab] = useState<TabId>("word");
  const [securityLightbox, setSecurityLightbox] = useState<SecurityChecklistItem | null>(null);

  const openApp = (id: TabId) => {
    // Agent has its own Learn section; app pills stay in the prompt repository.
    const targetId = id === "agent" ? "m365-agent" : "prompt-repository";
    if (id !== "agent") setActiveTab(id);
    setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <div style={{ fontFamily: F.regular, color: C.dark2, background: C.white, minHeight: "100vh" }}>

      {onBack && onNavigate && (
        <>
          <SiteHeader variant="learning" onNavigate={onNavigate} skipLinkTarget="#module-content" />
          <ModuleHeader currentModuleId="copilot-hub" onNavigate={onNavigate} onBack={onBack} />
        </>
      )}

      {/* ── Hero (Figma: HeroSection) ───────────────────────────────────────── */}
      {/* Spectrum: Frame 9 — EY-yellow beam, darkest left for copy readability */}
      <section
        id="module-content"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          minHeight: "620px",
          padding: `64px ${contentInlinePad}`,
          gap: 64,
          overflow: "hidden",
          backgroundColor: C.dark,
          backgroundImage: "url('/spectrum/hero-frame-9.png')",
          backgroundSize: "cover",
          backgroundPosition: "72% center",
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
              "linear-gradient(90deg, rgba(26,26,36,0.92) 0%, rgba(26,26,36,0.72) 42%, rgba(26,26,36,0.28) 70%, rgba(26,26,36,0.15) 100%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, flex: 1, maxWidth: 676 }}>
          <h1 style={{ fontFamily: F.bold, fontSize: typeScale.h1.size, fontWeight: 700, color: C.white, lineHeight: 1.2, letterSpacing: typeScale.h1.tracking, marginBottom: 20 }}>
            Explore M365 Copilot prompts in a new-age workspace
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.6 }}>
            Step into an interactive M365 learning space where you can find what wonders the age-old MS apps can do just by adding a magical element called M365.
          </p>
        </div>
        {/* Laptop stage — "What you can do" popping app widget (ported from Module1) */}
        <LaptopStage onOpenApp={openApp} />
      </section>

      {/* ── Repository Tabs — CENTERED header (Figma: RepositoryTabs) ────────── */}
      <section id="prompt-repository" style={{ background: C.offWhite, padding: `64px 0 0`, textAlign: "center", scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
        <div style={{ ...contentRailStyle }}>
        <SectionAnchorTitle
          align="center"
          style={{ fontSize: typeScale.h2.size, letterSpacing: typeScale.h2.tracking, lineHeight: 1.2, marginBottom: 12 }}
        >
          M365 in MS Apps
        </SectionAnchorTitle>
        <p style={{ fontSize: 11, color: C.gray01, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>EXPLORE PROMPT CATEGORIES</p>
        <p style={{ fontSize: 15, color: C.gray01, marginBottom: 32 }}>Select your preferred MS application tool below to view optimized, compliant corporate-ready prompts.</p>
        {/* Tab row — centered. Dark container from tokens: offBlack (#2E2E38) */}
        <div style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: 8, background: C.dark2, borderRadius: 12, padding: 8 }}>
          {APP_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 8,
                background: activeTab === t.id ? C.yellow : "transparent",
                border: "none", cursor: "pointer", fontSize: 13,
                color: activeTab === t.id ? C.dark2 : C.gray02,
                fontWeight: 700,
                boxShadow: activeTab === t.id ? "0 1px 6px rgba(0,0,0,0.25)" : "none",
                transition: "background 0.15s, color 0.15s, box-shadow 0.15s", fontFamily: F.regular,
              }}
            >
              <AppIcon logo={t.logo} label={t.label} />
              {t.label}
            </button>
          ))}
        </div>
        </div>
      </section>

      {/* ── Active tab section ──────────────────────────────────────────────── */}
      {/* key={activeTab} remounts each app so Copilot typing state does not leak. */}
      <TabSection key={activeTab} tabId={activeTab} />

      {/* Agent is its own Learn section (header tab #m365-agent), not a repository pill. */}
      <section id="m365-agent" style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
        <TabSection tabId="agent" surface="white" />
      </section>

      {/* ── Useful Links (Figma: useful-links-section-redesign) ─────────────── */}
      <section id="useful-links" style={{ background: C.dark2, padding: `${spacing.sectionPaddingY} 0 64px`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
        <div style={{ ...contentRailStyle }}>
        <SectionAnchorTitle theme="dark" align="center">Useful Links</SectionAnchorTitle>
        <h2 style={{ fontFamily: F.bold, fontSize: typeScale.h2.size, fontWeight: 700, color: C.white, lineHeight: 1.2, letterSpacing: typeScale.h2.tracking, marginBottom: 12, textAlign: "center" }}>Useful Links</h2>
        <p style={{ fontSize: 15, color: C.gray02, marginBottom: 48, textAlign: "center" }}>Handy EY resources to check your system access, explore deeper templates, and use generative AI safely.</p>
        <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
          {USEFUL_LINKS.map(l => (
            <article
              key={l.title}
              style={{
                flex: "1 1 0",
                minWidth: 0,
                minHeight: 320,
                background: C.eyBgCard,
                border: `1px solid ${C.borderOnDark}`,
                borderRadius: 16,
                overflow: "hidden",
                display: "grid",
                gridTemplateRows: "30% 1fr",
                cursor: "default",
              }}
            >
              <div
                aria-hidden
                style={{
                  minHeight: 0,
                  background: C.surfaceOnDark,
                  borderBottom: `1px solid ${C.borderOnDark}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: C.yellowAlpha12,
                    border: `1px solid ${C.eyebrowGold}`,
                    boxShadow: `0 0 0 5px ${C.yellowAlpha10}`,
                    color: C.yellow,
                  }}
                >
                  <l.icon size={32} strokeWidth={1.75} />
                </span>
              </div>
              <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
                <p style={{ fontFamily: F.bold, fontWeight: 700, fontSize: 15, color: C.white, lineHeight: 1.3, margin: 0 }}>{l.title}</p>
                <p style={{ fontFamily: F.regular, fontSize: 13, color: C.gray02, flex: 1, lineHeight: 1.55, margin: 0 }}>{l.body}</p>
                <a href="#" style={{ fontFamily: F.bold, fontSize: 14, color: C.yellow, textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {l.cta} <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
                </a>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>

      {/* ── Security (Figma: security-case-studies — 4 horizontal cards) ─────── */}
      <section id="security" style={{ background: C.dark, padding: `${spacing.sectionPaddingY} 0`, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
        <div style={{ ...contentRailStyle }}>
        <header style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,230,0,0.12)", border: "1px solid rgba(255,230,0,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
            <span style={{ fontFamily: F.bold, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.yellow }}>Security &amp; Governance</span>
          </div>
          <h2 style={{ fontFamily: F.bold, fontSize: typeScale.h2.size, fontWeight: 700, color: C.white, lineHeight: 1.2, letterSpacing: typeScale.h2.tracking, marginBottom: 14 }}>Enterprise-Grade Security</h2>
          <p style={{ fontFamily: F.bold, fontSize: typeScale.subheading.size, fontWeight: 700, color: C.white, marginBottom: 10 }}>
            Your 4-step checklist
          </p>
          <p style={{ fontFamily: F.regular, fontSize: typeScale.body.size, color: C.gray02, maxWidth: 800, lineHeight: 1.6, margin: "0 auto" }}>
            Before you let Copilot loose on tax data, work through these four access and sharing checks.
          </p>
        </header>
        {/* 4-step checklist — cards 1–3 open security infographic on click */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
          {SECURITY_CHECKLIST.map((step) => {
            const cardBody = (
              <>
                <p style={{ fontFamily: F.bold, fontWeight: 700, fontSize: typeScale.h2.size, color: C.yellow, margin: 0, lineHeight: 1 }}>
                  {step.num}
                </p>
                <p
                  style={{
                    fontFamily: F.regular,
                    fontSize: 14,
                    color: C.gray02,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {step.body}
                </p>
                {step.italicBody && (
                  <p
                    style={{
                      fontFamily: F.regular,
                      fontSize: 14,
                      color: C.gray02,
                      margin: 0,
                      lineHeight: 1.6,
                      fontStyle: "italic",
                    }}
                  >
                    {step.italicBody}
                  </p>
                )}
              </>
            );

            const cardStyle: React.CSSProperties = {
              background: C.dark2,
              border: `1px solid ${C.borderOnDark}`,
              borderRadius: 12,
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              textAlign: "left",
              fontFamily: F.regular,
            };

            if (step.hasInfographic === false) {
              return (
                <div key={step.num} style={cardStyle}>
                  {cardBody}
                </div>
              );
            }

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setSecurityLightbox(step)}
                aria-label={`View ${step.title} infographic`}
                style={{
                  ...cardStyle,
                  cursor: "pointer",
                  transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.yellowAlpha12;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px color-mix(in srgb, ${C.dark} 35%, transparent)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.borderOnDark;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = C.yellowAlpha12;
                  e.currentTarget.style.outline = `2px solid ${C.yellow}`;
                  e.currentTarget.style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = C.borderOnDark;
                  e.currentTarget.style.outline = "none";
                }}
              >
                {cardBody}
              </button>
            );
          })}
        </div>
        </div>
      </section>

      {securityLightbox && (
        <SecurityImageLightbox
          item={securityLightbox}
          onClose={() => setSecurityLightbox(null)}
        />
      )}

      <AscentModuleProgressSection
        moduleKey="m1_3"
        onNextStepCta={() => onNavigate?.("/phase2")}
      />

    </div>
  );
}
