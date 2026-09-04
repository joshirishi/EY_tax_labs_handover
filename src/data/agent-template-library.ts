/**
 * Agent Template Library — EY-Guided M365 Agent Examples.
 * Wording is purpose / actions / outcome from Sheet1 of Sample use cases.xlsx
 * (same list as the hidden Phase 3 Agent Instruction Library).
 */

import type { PromptLibraryEntry } from "./prompt-library";

function agentBook(
  id: number,
  name: string,
  category: PromptLibraryEntry["category"],
  capabilities: PromptLibraryEntry["capabilities"],
  purpose: string,
  actions: string,
  outcome: string,
): PromptLibraryEntry {
  return {
    id,
    name,
    category,
    capabilities,
    slides: [
      { title: name, sub: "Purpose", body: purpose },
      { title: name, sub: "Actions", body: actions },
      { title: name, sub: "Outcome", body: outcome },
    ],
  };
}

export const AGENT_TEMPLATE_LIBRARY: PromptLibraryEntry[] = [
  agentBook(
    1,
    "Tax Knowledge Retrieval Agent",
    "Research",
    ["Query"],
    "Acts as a centralized knowledge assistant for locating historical tax positions, precedents and supporting materials.",
    "Searches approved repositories containing tax opinions, notices, submissions, laws, policies and knowledge documents.",
    "Enables faster research, improves consistency in tax positions and reduces time spent searching for information.",
  ),
  agentBook(
    2,
    "Transfer Pricing Documentation Agent",
    "Compliance",
    ["Analyse"],
    "Supports preparation and maintenance of transfer pricing documentation and supporting evidence.",
    "Reviews related-party schedules, TP reports, benchmarking studies, GL records and supporting documentation.",
    "Identifies transactions, summarizes supporting information, highlights exceptions and improves audit readiness.",
  ),
  agentBook(
    3,
    "Advance Tax Reviewer Agent",
    "Compliance",
    ["Analyse"],
    "Assists tax teams in reviewing advance tax computations and identifying key movements between reporting periods.",
    "Compares current and prior quarter computations, validates changes in assumptions and workings, and analyses variances across tax forecasts and calculations.",
    "Produces variance analysis narratives, management summary notes and review observations that support faster validation, stakeholder reporting and decision-making.",
  ),
  agentBook(
    4,
    "Tax Information Request Agent",
    "Planning and Communication",
    ["Generate"],
    "Streamlines the collection and management of information required from stakeholders during tax projects.",
    "Drafts information requests, reviews responses, summarizes stakeholder inputs and identifies missing information.",
    "Reduces follow-up effort and improves the completeness and quality of information received.",
  ),
  agentBook(
    5,
    "Assessment Evidence Agent",
    "Data",
    ["Extract"],
    "Assists tax teams in gathering and organizing supporting evidence for audits, assessments and disputes.",
    "Searches SharePoint, Teams, Outlook and supporting repositories for relevant documentation and correspondence.",
    "Creates issue-wise evidence packs, highlights missing support and strengthens audit preparedness.",
  ),
  agentBook(
    6,
    "Tax Leadership Reporting Agent",
    "Planning and Communication",
    ["Summarise"],
    "Provides leadership with periodic consolidated visibility over tax activities, developments and risks.",
    "Collects status updates, auditor comments, legislative changes and regional tax developments for analysis.",
    "Produces executive dashboards, management reports and briefing materials to support decision-making.",
  ),
  agentBook(
    7,
    "Personalized Tracker Agent (including Compliance Tracker)",
    "Compliance",
    ["Evaluate"],
    "Acts as a centralized monitoring tool for tax compliance activities, deadlines and action items.",
    "Maintains compliance calendars, trackers, filing records and related correspondence.",
    "Identifies upcoming, due and overdue obligations, highlights risks and supports timely compliance management.",
  ),
  agentBook(
    8,
    "Repetitive Tax Correspondence Agent",
    "Planning and Communication",
    ["Generate"],
    "Standardizes recurring tax communications across stakeholders, management and employees.",
    "Generates communication templates, drafts correspondence, refines messaging and applies approved communication standards.",
    "Improves consistency, reduces drafting effort and accelerates turnaround of routine communications.",
  ),
  agentBook(
    9,
    "Second Brain Agent",
    "Research",
    ["Query"],
    "Acts as a personalized tax knowledge companion that helps professionals quickly access information, insights and prior work products accumulated over time.",
    "Searches across emails, meeting notes, presentations, research materials, working papers, tax opinions and enterprise repositories to build contextual understanding.",
    "Enables users to retrieve historical knowledge, identify relevant precedents, surface action items and obtain context-aware guidance without manually searching through multiple sources.",
  ),
];
