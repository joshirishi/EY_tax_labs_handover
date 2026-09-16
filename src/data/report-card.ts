/** Verbatim session data from reference/AI-Tax-Excellence-ReportCard.html */

export type QuizScore = { name: string; score: number };

export type ConceptTopic = {
  topic: string;
  quizzes: QuizScore[];
  note: string;
};

export type UseCaseStatus = "Done" | "In Progress" | "Not Started";
export type BuildType = "Prompt" | "No-Code" | "Pro-Code";

export type ProcessUseCase = {
  useCase: string;
  buildType: BuildType;
  status: UseCaseStatus;
  confidence: number;
};

export type ResponsibleAnswer = {
  concept: string;
  answer: string;
  result: "Correct" | "Review";
};

export type ResponsibleQuestion = {
  question: string;
  score: number;
  answers: ResponsibleAnswer[];
};

export type ReportCardMeta = {
  client: string;
  participants: number;
  date: string;
  duration: string;
  facilitator: string;
};

export type ReportCardDataset = {
  meta: ReportCardMeta;
  conceptsLearned: ConceptTopic[];
  processReimagined: ProcessUseCase[];
  responsibleUse: ResponsibleQuestion[];
};

export const REPORT_CARD_SUBTITLE =
  "A consolidated executive view of participant learning, process transformation ideation, and responsible AI understanding.";

export const REPORT_CARD_FOOTER =
  "This report card is intended for strategic discussion and participant development tracking. Scores shown are session-level indicators and should be interpreted alongside facilitator notes and business context.";

export const RESPONSIBLE_COLUMNS = [
  "What is the risk?",
  "What decision?",
  "What control?",
  "Who is accountable?",
] as const;

export const SESSION_DURATION_HEADING = "Session Duration";

const PROCESS_EXAMPLES: ProcessUseCase[] = [
  { useCase: "Notice Drafting Assistant", buildType: "Prompt", status: "Done", confidence: 86 },
  { useCase: "Tax Position Summary", buildType: "Prompt", status: "In Progress", confidence: 78 },
  { useCase: "Ruling Comparison Brief", buildType: "Prompt", status: "Not Started", confidence: 72 },
  { useCase: "Client Meeting Preparation", buildType: "Prompt", status: "Not Started", confidence: 74 },
  { useCase: "Audit Query Response Draft", buildType: "Prompt", status: "Not Started", confidence: 69 },
  { useCase: "Legislation Change Summary", buildType: "Prompt", status: "Not Started", confidence: 76 },
  { useCase: "Tax Email Refinement", buildType: "Prompt", status: "Not Started", confidence: 81 },
  { useCase: "Transfer Pricing Narrative Draft", buildType: "Prompt", status: "Not Started", confidence: 70 },
  { useCase: "Research Question Framing", buildType: "Prompt", status: "Not Started", confidence: 73 },
  { useCase: "Working Paper Quality Review", buildType: "Prompt", status: "Not Started", confidence: 77 },
  { useCase: "GST Data Reconciliation Screener", buildType: "No-Code", status: "In Progress", confidence: 72 },
  { useCase: "Case Law Summary Workbench", buildType: "No-Code", status: "Done", confidence: 79 },
  { useCase: "Tax Provision Variance Analyzer", buildType: "No-Code", status: "Not Started", confidence: 67 },
  { useCase: "Return Review Checklist Agent", buildType: "No-Code", status: "Not Started", confidence: 71 },
  { useCase: "Indirect Tax Query Assistant", buildType: "No-Code", status: "Not Started", confidence: 75 },
  { useCase: "Contract Tax Clause Reviewer", buildType: "No-Code", status: "Not Started", confidence: 68 },
  { useCase: "Tax Calendar Reminder Agent", buildType: "No-Code", status: "Not Started", confidence: 80 },
  { useCase: "Compliance Evidence Collector", buildType: "No-Code", status: "Not Started", confidence: 65 },
  { useCase: "Entity Data Intake Assistant", buildType: "No-Code", status: "Not Started", confidence: 70 },
  { useCase: "Tax FAQ Knowledge Agent", buildType: "No-Code", status: "Not Started", confidence: 78 },
  { useCase: "Withholding Risk Early Warning", buildType: "Pro-Code", status: "Not Started", confidence: 58 },
  { useCase: "Enterprise Tax Data Hub", buildType: "Pro-Code", status: "Not Started", confidence: 61 },
  { useCase: "Automated Provision Workflow", buildType: "Pro-Code", status: "Not Started", confidence: 59 },
  { useCase: "Real-Time Compliance Monitor", buildType: "Pro-Code", status: "Not Started", confidence: 55 },
  { useCase: "Tax Risk Decision Engine", buildType: "Pro-Code", status: "Not Started", confidence: 57 },
  { useCase: "Integrated Filing Orchestrator", buildType: "Pro-Code", status: "Not Started", confidence: 54 },
  { useCase: "Global Tax Control Tower", buildType: "Pro-Code", status: "Not Started", confidence: 52 },
];

export const REPORT_CARD_PRIMARY: ReportCardDataset = {
  meta: {
    client: "Apex Manufacturing Ltd.",
    participants: 18,
    date: "03 Sep 2026",
    duration: "5.5 Hours",
    facilitator: "EY Tax AI Team",
  },
  conceptsLearned: [
    {
      topic: "AI in Tax Fundamentals",
      quizzes: [
        { name: "Match the Explanation", score: 82 },
        { name: "Spot the Right Technology", score: 76 },
      ],
      note: "• Evolution of AI\n• Decoding GenAI convo\n• Gen AI beyond drafting and summarizing\n• GenAI vs AI Agent vs Agentic AI",
    },
    {
      topic: "Prompting Basics",
      quizzes: [
        { name: "Choose the Best Answer", score: 76 },
        { name: "Match the Description", score: 76 },
      ],
      note: "• Brief AI, like briefing your team\n• Prompt elements\n• Prompt techniques",
    },
    {
      topic: "Prompt vs Agent Use",
      quizzes: [{ name: "Bingo - True or False", score: 71 }],
      note: "• M365 in MS apps, chats and agents\n• Reimagining use cases via Prompts and Agents",
    },
  ],
  processReimagined: PROCESS_EXAMPLES,
  responsibleUse: [
    {
      question: "Data privacy and confidential handling",
      score: 100,
      answers: [
        { concept: "Risk", answer: "Potential disclosure of client, taxpayer and transaction information in an unapproved environment", result: "Correct" },
        { concept: "Decision", answer: "Stop and confirm whether the tool and intended data use are approved", result: "Correct" },
        { concept: "Missing Control", answer: "Use an approved AI environment, confirm permitted data use and minimise inputs", result: "Correct" },
        { concept: "Accountability", answer: "The tax professional and the responsible reviewer under applicable organisational procedures", result: "Correct" },
      ],
    },
    {
      question: "Hallucination risk identification",
      score: 75,
      answers: [
        { concept: "Risk", answer: "The cited authority may be fabricated, misquoted or inapplicable, undermining the analysis", result: "Correct" },
        { concept: "Decision", answer: "Independently verify the judgment and reassess the entire conclusion", result: "Correct" },
        { concept: "Missing Control", answer: "Locate and read the primary authority, verify relevance and reassess the conclusion", result: "Correct" },
        { concept: "Accountability", answer: "The qualified tax professional approving the note", result: "Review" },
      ],
    },
    {
      question: "Human review checkpoints",
      score: 100,
      answers: [
        { concept: "Risk", answer: "The Agent is acting beyond its approved purpose and may create uncontrolled consequential output", result: "Correct" },
        { concept: "Decision", answer: "Stop the test, record the behaviour and review the Agent's instructions and boundaries", result: "Correct" },
        { concept: "Missing Control", answer: "Reconfirm purpose, define permitted and prohibited activities, add stop/escalation rules and retest", result: "Correct" },
        { concept: "Accountability", answer: "The business owner and qualified human reviewer responsible under the approved governance process", result: "Correct" },
      ],
    },
    {
      question: "Prompt hygiene and policy alignment",
      score: 100,
      answers: [
        { concept: "Risk", answer: "An unclear or unsafe prompt may produce unreliable output or expose sensitive information", result: "Correct" },
        { concept: "Decision", answer: "Stop and revise the prompt before relying on the output", result: "Correct" },
        { concept: "Missing Control", answer: "Remove sensitive data, define the task clearly and add review requirements", result: "Correct" },
        { concept: "Accountability", answer: "The tax professional who creates and uses the prompt", result: "Correct" },
      ],
    },
    {
      question: "Output traceability and auditability",
      score: 100,
      answers: [
        { concept: "Risk", answer: "An output cannot be validated or defended when its source, prompt and review history are unknown", result: "Correct" },
        { concept: "Decision", answer: "Retain the relevant prompt, source material and review evidence before using the output", result: "Correct" },
        { concept: "Missing Control", answer: "Keep an audit trail linking the input, output, sources, reviewer and approval", result: "Correct" },
        { concept: "Accountability", answer: "The tax professional and responsible reviewer approving the final output", result: "Correct" },
      ],
    },
  ],
};

/** Unused on the live page — kept so the HTML alternate sample is not lost. */
export const REPORT_CARD_ALTERNATE: ReportCardDataset = {
  meta: {
    client: "Vertex Consumer Group",
    participants: 12,
    date: "03 Sep 2026",
    duration: "5 Hours",
    facilitator: "EY Tax AI Team",
  },
  conceptsLearned: [
    {
      topic: "1.1 AI in Tax Fundamentals",
      quizzes: [
        { name: "Quiz 1: Match the Explanation", score: 73 },
        { name: "Quiz 2: Spot the Right Technology", score: 68 },
      ],
      note: "• Evolution of AI\n• Decoding GenAI convo\n• Gen AI beyond drafting and summarizing\n• GenAI vs AI Agent vs Agentic AI",
    },
    {
      topic: "1.2 Prompting Basics",
      quizzes: [
        { name: "Quiz 1: Choose the Best Answer", score: 68 },
        { name: "Quiz 2: Match the Description", score: 68 },
      ],
      note: "• Brief AI, like briefing your team\n• Prompt elements\n• Prompt techniques",
    },
    {
      topic: "Prompt vs Agent Use",
      quizzes: [{ name: "Quiz 3: Bingo - True or False", score: 66 }],
      note: "• Prompt quality, context and few-shot techniques\n• Copilot and AI agent capabilities\n• Responsible handling of confidential data",
    },
  ],
  processReimagined: PROCESS_EXAMPLES,
  responsibleUse: [
    {
      question: "Data privacy and confidential handling",
      score: 100,
      answers: [
        { concept: "Risk", answer: "Potential disclosure of client, taxpayer and transaction information in an unapproved environment", result: "Correct" },
        { concept: "Decision", answer: "Stop and confirm whether the tool and intended data use are approved", result: "Correct" },
        { concept: "Missing Control", answer: "Use an approved AI environment, confirm permitted data use and minimise inputs", result: "Correct" },
        { concept: "Accountability", answer: "The tax professional and the responsible reviewer under applicable organisational procedures", result: "Correct" },
      ],
    },
    {
      question: "Hallucination risk identification",
      score: 63,
      answers: [
        { concept: "Risk", answer: "The cited authority may be fabricated, misquoted or inapplicable, undermining the analysis", result: "Correct" },
        { concept: "Decision", answer: "Independently verify the judgment and reassess the entire conclusion", result: "Correct" },
        { concept: "Missing Control", answer: "Locate and read the primary authority, verify relevance and reassess the conclusion", result: "Correct" },
        { concept: "Accountability", answer: "The qualified tax professional approving the note", result: "Review" },
      ],
    },
    {
      question: "Human review checkpoints",
      score: 86,
      answers: [
        { concept: "Risk", answer: "The Agent is acting beyond its approved purpose and may create uncontrolled consequential output", result: "Correct" },
        { concept: "Decision", answer: "Stop the test, record the behaviour and review the Agent's instructions and boundaries", result: "Correct" },
        { concept: "Missing Control", answer: "Reconfirm purpose, define permitted and prohibited activities, add stop/escalation rules and retest", result: "Correct" },
        { concept: "Accountability", answer: "The business owner and qualified human reviewer responsible under the approved governance process", result: "Correct" },
      ],
    },
    {
      question: "Prompt hygiene and policy alignment",
      score: 71,
      answers: [
        { concept: "Risk", answer: "An unclear or unsafe prompt may produce unreliable output or expose sensitive information", result: "Correct" },
        { concept: "Decision", answer: "Stop and revise the prompt before relying on the output", result: "Correct" },
        { concept: "Missing Control", answer: "Remove sensitive data, define the task clearly and add review requirements", result: "Correct" },
        { concept: "Accountability", answer: "The tax professional who creates and uses the prompt", result: "Correct" },
      ],
    },
    {
      question: "Output traceability and auditability",
      score: 74,
      answers: [
        { concept: "Risk", answer: "An output cannot be validated or defended when its source, prompt and review history are unknown", result: "Correct" },
        { concept: "Decision", answer: "Retain the relevant prompt, source material and review evidence before using the output", result: "Correct" },
        { concept: "Missing Control", answer: "Keep an audit trail linking the input, output, sources, reviewer and approval", result: "Correct" },
        { concept: "Accountability", answer: "The tax professional and responsible reviewer approving the final output", result: "Correct" },
      ],
    },
  ],
};

export function hoursFromDuration(duration: string): string {
  return (duration.match(/[0-9]+(?:\.[0-9]+)?/) || ["5.5"])[0] ?? "5.5";
}

export function statusLabel(status: UseCaseStatus): string {
  return status === "Not Started" ? "Not Done" : status;
}

export function statusChipVariant(status: UseCaseStatus): "success" | "warning" | "critical" {
  if (status === "Done") return "success";
  if (status === "In Progress") return "warning";
  return "critical";
}
