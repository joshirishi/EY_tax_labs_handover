/**
 * Guided Prompt Library — content from Priya’s
 * `reference/3.1 - Sample Prompt Templates_Priya.pptx` (exact slide wording).
 */

export type PromptLibrarySlide = {
  title: string;
  sub: string;
  body: string;
};

export type PromptLibraryWhyType =
  | "Query"
  | "Analyse"
  | "Compare"
  | "Explain"
  | "Generate"
  | "Summarise"
  | "Extract"
  | "Transform"
  | "Evaluate";

export type PromptLibraryCategory =
  | "Research"
  | "Compliance"
  | "Planning and Communication"
  | "Data";

export type PromptLibraryEntry = {
  id: number;
  name: string;
  category: PromptLibraryCategory;
  capabilities: PromptLibraryWhyType[];
  slides: PromptLibrarySlide[];
};

export const PROMPT_LIBRARY_FILTERS: { id: "all" | PromptLibraryCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Research", label: "Research" },
  { id: "Compliance", label: "Compliance" },
  { id: "Planning and Communication", label: "Planning & Comm." },
  { id: "Data", label: "Data" },
];

export const PROMPT_LIBRARY_WHY_TYPE_FILTERS: {
  id: "all" | PromptLibraryWhyType;
  label: string;
}[] = [
  { id: "all", label: "All types" },
  { id: "Query", label: "Query" },
  { id: "Extract", label: "Extract" },
  { id: "Analyse", label: "Analyse" },
  { id: "Compare", label: "Compare" },
  { id: "Explain", label: "Explain" },
  { id: "Generate", label: "Generate" },
  { id: "Summarise", label: "Summarise" },
  { id: "Transform", label: "Transform" },
  { id: "Evaluate", label: "Evaluate" },
];

export const PROMPT_LIBRARY: PromptLibraryEntry[] = [
  {
    id: 1,
    name: "Agreement Analysis and Tax Advisory",
    category: "Data",
    capabilities: ["Analyse"],
    slides: [
      {
        title: "Agreement Analysis and Tax Advisory",
        sub: "Prompt Framework — Role, Context & Review Task",
        body: "1. Persona (WHO should AI be?)\nAct as a senior tax advisor with expertise in Indian Income-tax laws, GST, FEMA, the Companies Act, international tax treaties and contract review. Bring experience analyzing commercial agreements for legal, operational and tax implications.\n2. Context (WHAT's the background?)\nA contractual agreement is provided for review. Identify contractual risks, tax implications, compliance obligations and opportunities to strengthen it. Consider the transaction, party obligations and relevant regulatory requirements.\n•  Attach the agreement for review.\n3. Instruction (WHAT should AI do?)\n•  Summarize the agreement, its purpose and transaction structure.\n•  Identify inconsistencies, contradictions, ambiguous language, missing provisions and unusual clauses.\n•  Analyze TDS / withholding obligations and GST considerations.\n•  Review tax representations, warranties, indemnities and disclosures.\n•  Assess reporting, compliance and cross-border tax implications, where applicable.\n•  Highlight commercial, regulatory and operational risks.\n•  Recommend clause modifications, additional provisions and practical risk mitigations.",
      },
      {
        title: "Agreement Analysis and Tax Advisory",
        sub: "Prompt Framework — Guardrails & Grounding",
        body: "4. Constraints & Boundaries (WHAT are the limits?)\n•  Limit the review to the contents of the agreement.\n•  Do not assume facts not stated in the document.\n•  Clearly distinguish observations from recommendations.\n•  Where information is insufficient, identify gaps and request clarification.\n•  Do not provide legal opinions beyond the agreement's context.\n5. Grounding (WHERE should AI look?)\nBase the analysis on:\n•  Income-tax Act, 1961\n•  GST laws and related notifications; FEMA provisions\n•  Companies Act, 2013; applicable tax treaties\n•  CBDT circulars, notifications and instructions\n•  Information explicitly contained within the agreement\n6. Tone (HOW should it sound?)\nProfessional, analytical, objective and advisory in nature. Present findings clearly, highlighting key risks and practical recommendations.",
      },
      {
        title: "Agreement Analysis and Tax Advisory",
        sub: "Prompt Framework — Output & Techniques",
        body: "7. Output Format (WHAT shape should the answer take?)\n•  Executive Summary; Purpose of Agreement; Key Commercial Terms; Overall Risk Assessment\n•  Contract Findings: Clause Reference | Observation | Risk Level | Recommendation\n•  Tax Analysis: Tax Area | Finding | Impact | Recommendation\n•  Questions / Information Required: missing information and clarifications\n•  Advisory Recommendations: clause revisions, additions and risk mitigation\nPrompting Techniques Demonstrated — I\n•  Audience Prompting — For tax professionals and business stakeholders.\n•  Zero-Shot Prompting — Defines the required review without examples.\n•  Flipped Prompting — Identifies information gaps and asks clarifying questions.\n•  Chain-of-Thought Prompting — Agreement understanding → risk review → tax analysis → recommendations.\nPrompting Techniques Demonstrated — II\n•  Iterative Prompting — Enables follow-up refinement.\n•  Creative Expansion Prompting — Finds additional risks and improvements.\n•  Refinement Prompting — Suggests stronger clause alternatives.\n•  Meta Prompting — Combines multiple prompting strategies.",
      },
    ],
  },
  {
    id: 2,
    name: "20–80 Principle to Learn New Topics in an Accelerated Manner",
    category: "Research",
    capabilities: ["Explain"],
    slides: [
      {
        title: "20–80 Principle to Learn New Topics in an Accelerated Manner",
        sub: "80/20 Learning — Role, Context & Task",
        body: "1. Persona (WHO should AI be?)\nAssume the role of a seasoned educator and mentor skilled at simplifying complex subjects and passionate about helping learners quickly build a strong foundation in new topics.\n2. Context (WHAT's the background?)\nGain a rapid, foundational understanding of <> by applying the 80/20 Principle. Identify the critical 20% of concepts that enables understanding of approximately 80% of the subject.\n3. Instruction (WHAT should AI do?)\n•  Top 20% to Learn About Immediately — Identify the core concepts, principles, theories, frameworks or skills.\n•  For each item, explain why it belongs to the critical 20% and how it supports understanding of the wider subject.\n•  Keep explanations concise, practical and easy to understand.\n•  To Gain Deeper Knowledge — Identify additional concepts for a more comprehensive understanding.\n•  Briefly explain each concept’s significance and how it connects to the foundations above.",
      },
      {
        title: "20–80 Principle to Learn New Topics in an Accelerated Manner",
        sub: "80/20 Learning — Guardrails & Output",
        body: "4. Constraints & Boundaries (WHAT are the limits?)\n•  Focus on concepts that provide maximum learning impact with minimum effort.\n•  Avoid unnecessary technical details, jargon or niche topics unless essential.\n•  Do not present speculative or unverified information.\n•  Clearly distinguish foundational concepts from advanced concepts.\n5. Output Format (WHAT shape should the answer take?)\n•  Topic Overview — Provide a brief introduction to <>.\n•  Top 20% to Learn About Immediately — Table: Concept | Why It Matters.\n•  To Gain Deeper Knowledge — Table: Concept | Significance | Connection to the Foundation.\n•  Suggested Learning Path — Present a clear sequence from foundations to application and depth.\n6. Suggested Learning Path\n1. Learn the foundational concepts first.\n2. Build understanding through practical examples.\n3. Explore deeper concepts after mastering the fundamentals.",
      },
      {
        title: "20–80 Principle to Learn New Topics in an Accelerated Manner",
        sub: "Prompting Techniques",
        body: "Audience Prompting\nWhy? The AI acts as an educator and mentor who simplifies concepts for someone learning a topic for the first time.\nEvidence — “Assume the role of a seasoned educator and mentor… skilled at simplifying complex subjects.”\nChain-of-Thought Prompting\nWhy? The prompt guides a logical sequence rather than requesting a random list.\n1. Identify foundational concepts (20%).\n2. Explain why they matter.\n3. Identify advanced concepts.\n4. Connect advanced concepts to the fundamentals.\nEvidence — “Top 20% to Learn About Immediately” and “To Gain Deeper Knowledge.”\nRefinement Prompting\nWhy? The prompt narrows a large subject to the highest-impact knowledge instead of explaining everything.\nEvidence — “Distill the subject matter,” “essential 20% of knowledge,” and “understand approximately 80% of the topic.”",
      },
    ],
  },
  {
    id: 3,
    name: "Data Extraction from Foreign Inward Remittance Certificate (FIRC)",
    category: "Data",
    capabilities: ["Extract"],
    slides: [
      {
        title: "Data Extraction from Foreign Inward Remittance Certificate (FIRC)",
        sub: "FIRC Extraction — Context, Role & Task",
        body: "1. Context + Grounding\nExtract relevant data from the attached FIRC PDF titled <> and compile it for mapping with export turnover while preparing a GST refund claim.\n•  Each PDF page is a separate FIRC. Read every page carefully and rely only on information available in the attached document.\n2. Persona\nAct as a tax consultant with expertise in GST advisory and compliance, particularly export of goods or services and GST refund claim documentation.\n3. Instruction + Extraction Workflow\n•  Treat each page as a separate FIRC and review the full page before extracting fields.\n•  Identify relevant bank terminology; labels may vary across certificates.\n•  Map identified attributes to the required output columns.\n•  Extract values only from the FIRC content.\n•  Where a direct INR value is unavailable, apply only the calculation rule stated in this prompt.\n•  Compile all entries into one structured register.",
      },
      {
        title: "Data Extraction from Foreign Inward Remittance Certificate (FIRC)",
        sub: "FIRC Extraction — Output & Field Rules",
        body: "4. Output Format\nPrepare one table with columns in this order:\n•  Sr. No. | Event Date | Name of the Company | FIRC Number | Foreign Currency Type | Foreign Currency Amount | Exchange Rate | Amount in INR\n5. Extraction Rules — Identification\n•  Sr. No. — Assign sequential numbers starting from <>.\n•  Company — Extract the name exactly as shown in the PDF.\n•  Event Date — Search “Event date”; preserve the date format exactly.\n•  FIRC Number — Search “Bill No.”, “FIRC no.” or “Remittance ID” and extract the corresponding value.\n6. Extraction Rules — Currency & Amounts\n•  Currency Type — Use the currency shown under “Bill Amount” (for example USD, GBP or EUR).\n•  Foreign Amount — Extract the amount under or near “Bill Amount”.\n•  Exchange Rate — Extract the figure beside “@”, including up to four decimal places.\n•  Amount in INR — Use the figure near “Credit Advice”; if absent, calculate Foreign Currency Amount × Exchange Rate.",
      },
      {
        title: "Data Extraction from Foreign Inward Remittance Certificate (FIRC)",
        sub: "FIRC Extraction — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Do not hallucinate or infer values not present in the document.\n•  Do not skip any PDF page.\n•  Do not modify date formatting or alter company names, FIRC numbers, currency types or extracted values.\n•  If a required field is absent, enter “Not available in document”.\n•  Conduct extraction strictly from the attached FIRC PDF and the stated calculation rule.\nPrompting Techniques Demonstrated — I\n•  Chain-of-Thought Prompting — Uses a structured page review, field identification, rule application and register-building sequence.\n•  Grounding — Restricts extraction to the attached FIRC PDF.\n•  Refinement Prompting — Narrows the task to specified dates, identifiers, currencies, exchange rates and INR amounts.\nPrompting Techniques Demonstrated — II\n•  Zero-Shot Prompting — Provides clear instructions without a completed sample extraction.\n•  Constraint-Based Prompting — Prohibits hallucination, skipped pages and format changes.",
      },
    ],
  },
  {
    id: 4,
    name: "Extract and Summarize from Images or Scanned Handwritten Content",
    category: "Data",
    capabilities: ["Extract"],
    slides: [
      {
        title: "Extract and Summarize from Images or Scanned Handwritten Content",
        sub: "Image Extraction — Context, Role & Workflow",
        body: "1. Context + Grounding\nExtract, analyze and summarize information from uploaded images or handwritten content.\n•  Base the analysis solely on the uploaded images and information visible within them.\n2. Persona\nAct as a tax consultant serving multinational organizations, experienced in interpreting and summarizing business notes, handwriting, meeting notes and supporting visual information.\n3. Text & Visual Extraction Workflow\n•  Review the entire image before beginning extraction.\n•  Extract and transcribe all visible text accurately.\n•  Identify diagrams, sketches, flowcharts, graphs, tables and other non-text visuals.\n•  Analyze each visual element separately.\n•  List labels, arrows, boxes, components, relationships and connections.\n•  Briefly explain the structure and purpose of each visual element.",
      },
      {
        title: "Extract and Summarize from Images or Scanned Handwritten Content",
        sub: "Image Extraction — Summary, Minutes & Output",
        body: "4. Summarization\n•  Using the transcription and detected visuals, create a concise summary of key facts, ideas, conclusions, observations and discussion points.\n•  For each diagram, summarize its structure, components and relationships; highlight important insights conveyed.\n5. Minutes of Meeting Creation\n•  Use the transcribed text and diagram information to prepare structured minutes.\n•  Identify attendees, topics discussed, decisions, assigned actions, deadlines and follow-ups.\n•  Include supporting information communicated through diagrams.\n6. Output Format — Three Prompts\n•  Prompt 1: Extraction — Transcribed Text; Detected Visual Elements: name, components, description and purpose.\n•  Prompt 2: Summary — Key Highlights; Diagram Insights: description, components, relationships and insights.\n•  Prompt 3: Minutes — Attendees; Discussion Points; Diagram Descriptions; Decisions Made; Action Items, owners and deadlines.",
      },
      {
        title: "Extract and Summarize from Images or Scanned Handwritten Content",
        sub: "Image Extraction — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Do not hallucinate or infer information not visible in the image.\n•  Transcribe text exactly as written wherever possible; mark unclear or illegible text explicitly.\n•  Base summaries and minutes only on visible uploaded content.\n•  Do not create unsupported attendees, decisions, actions or diagram interpretations.\n•  Follow the uploaded attachments and requested output structure strictly.\nPrompting Techniques Demonstrated — I\n•  Chain-of-Thought Prompting — Sequences transcription → visual identification → analysis → summary → meeting minutes.\n•  Grounding — Restricts every output to uploaded image content.\n•  Refinement Prompting — Progressively condenses extracted information into highlights, insights and minutes.\nPrompting Techniques Demonstrated — II\n•  Zero-Shot Prompting — Provides instructions without sample outputs or examples.\n•  Constraint-Based Prompting — Prohibits hallucination, unsupported inference and source-external content.",
      },
    ],
  },
  {
    id: 5,
    name: "VBA Code: File Name and Type Extraction",
    category: "Data",
    capabilities: ["Extract"],
    slides: [
      {
        title: "VBA Code: File Name and Type Extraction",
        sub: "Excel VBA — Role, Context & Task",
        body: "1. Persona\nAct as an experienced Excel VBA developer with deep expertise in automating file-management tasks.\n2. Context + Audience Prompting\nAutomate file inventory and auditing by extracting details from a user-selected folder and all sub-folders.\n•  Make the solution easy to integrate into Excel for users automating manual file-management processes.\n3. Instruction + Functional Sequence\n1. Prompt the user to select a folder using a folder picker.\n2. Traverse the selected folder and all sub-folders.\n3. Identify every file in the folder structure.\n4. Capture complete path, file name and file type.\n5. Populate the active Excel worksheet.\n6. Organize the results in a structured, readable format.\n•  Clearly comment key sections of the VBA code.",
      },
      {
        title: "VBA Code: File Name and Type Extraction",
        sub: "Excel VBA — Deliverables & Guardrails",
        body: "4. Deliverables + Output Structure\n•  VBA Code — Provide a complete snippet that can be copied directly into Excel and executed.\n•  Excel Output — Populate these columns in order:\n•  File Name with Complete File Path | File Name | File Type\n•  User Guide — Provide clear steps for setup, execution and viewing results.\n5. User Guide\n1. Open the VBA editor.\n2. Insert a new module.\n3. Paste the VBA code.\n4. Execute the macro.\n5. Select a folder.\n6. View the extracted output in Excel.\n6. Constraints & Boundaries\n•  Use working code compatible with Microsoft Excel VBA.\n•  Include meaningful comments and scan every sub-folder.\n•  Do not omit required functionality or use unsupported functions.\n•  Align all guidance strictly with the generated VBA solution.",
      },
      {
        title: "VBA Code: File Name and Type Extraction",
        sub: "Excel VBA — Prompting Techniques",
        body: "Chain-of-Thought Prompting\nWhy? The task follows a defined operational sequence rather than requesting an unstructured code sample.\nSequence — Select folder → scan files → extract attributes → populate worksheet → provide user instructions.\nAudience + Refinement Prompting\n•  Audience Prompting — The solution is tailored to Excel users who may not be experienced VBA developers.\n•  Evidence — Easy integration, comments and step-by-step usage guidance.\n•  Refinement Prompting — The requested output is narrowed to complete path, file name and file type.\nZero-Shot + Constraint-Based Prompting\n•  Zero-Shot Prompting — Defines requirements and expected behavior without supplying an example VBA solution.\n•  Constraint-Based Prompting — Requires comments, recursive scanning, user guidance and supported Excel VBA functionality.",
      },
    ],
  },
  {
    id: 6,
    name: "Meeting Minutes Assistant",
    category: "Planning and Communication",
    capabilities: ["Summarise"],
    slides: [
      {
        title: "Meeting Minutes Assistant",
        sub: "Meeting Minutes — Context, Role & Task",
        body: "1. Context + Grounding\nPrepare comprehensive meeting minutes for circulation using only the information supplied in:\n•  Agenda — <<e.g., Discussion on XYZ project...>>\n•  Brief context — attendees, speakers, topics, decisions and tasks.\n•  Transcript — the complete meeting record.\n2. Persona + Audience Prompting\nAct as a seasoned Big 4 tax professional experienced in documenting technical discussions, decisions, recommendations and action plans for clients and project teams.\n3. Instruction + Core Deliverables\n•  A. Executive Summary — Main topics, key highlights, major decisions, conclusions and agreed next steps.\n•  B. Person-wise Summary — For each speaker, capture points raised, observations, recommendations, decisions, assigned actions, ownership and immediate next steps.\n•  C. Detailed Summary — Reflect the conversation flow, participant responses, clarifications, feedback and recommendations.\n•  Retain important terminology, technical concepts and key phrases.",
      },
      {
        title: "Meeting Minutes Assistant",
        sub: "Meeting Minutes — Analysis & Output",
        body: "4. Detailed Summary Rules\n•  Summarize the discussion at regular intervals—approximately every two to three minutes.\n•  Explain responses, clarifications, feedback or recommendations between participants.\n•  Where a speaker talks at length, capture the major themes and discussion points.\n•  Present the summary so it reflects the conversation between participants.\n5. Refinement + Tone\n•  Organize under agenda items; technical discussions; problems, challenges or concerns; recommendations; solutions; implementation plans; and next steps/action items.\n•  Group discussion themes under appropriate headings and sub-headings.\n•  Tone — Formal, professional and business-appropriate throughout.\n6. Output Format\n•  A. Executive Summary — Overview | Topics | Decisions | Next Steps.\n•  B. Person-wise Table — Speaker | Key Points | Decisions / Recommendations | Actions.\n•  C. Detailed Summary — Topics; Responses; Decisions; Concerns; Recommendations; Solutions; Implementation.\n•  Action Table — Action Item | Owner | Due Date (if available).",
      },
      {
        title: "Meeting Minutes Assistant",
        sub: "Meeting Minutes — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Do not hallucinate information absent from the background or transcript.\n•  Do not attribute statements unless supported by the transcript.\n•  Preserve important technical terminology and phrases.\n•  Accurately reflect decisions, recommendations and action items.\n•  If information is unavailable, do not create assumptions.\n•  Base the analysis strictly on the information provided.\nPrompting Techniques Demonstrated — I\n•  Chain-of-Thought — Meeting understanding → topics → speaker contributions → technical discussions → decisions/actions.\n•  Grounding — Uses only the agenda, context and transcript.\n•  Audience Prompting — Creates professional minutes for team members, clients and project participants.\nPrompting Techniques Demonstrated — II\n•  Refinement — Converts raw transcript content into executive, speaker-wise and categorized summaries.\n•  Zero-Shot — Defines the outputs without a sample set of minutes.\n•  Constraint-Based — Prevents unsupported facts, attribution and terminology changes.",
      },
    ],
  },
  {
    id: 7,
    name: "Iterative Discussion for Insights on Foreign Tax Laws",
    category: "Research",
    capabilities: ["Query"],
    slides: [
      {
        title: "Iterative Discussion for Insights on Foreign Tax Laws",
        sub: "Foreign Tax — Context, Role & Iteration",
        body: "1. Context + Grounding\nAnalyze a cross-border tax scenario through iterative discussion to refine technical analysis, validate conclusions and prepare a summary communication for advisors or stakeholders.\n•  Rely only on facts provided initially and additional facts introduced during the discussion.\n2. Persona + Audience Prompting\nAct as a foreign tax advisor with expertise in the relevant jurisdiction's legislation, regulations, administrative guidance and judicial precedents.\n•  Respond professionally, accurately and in business-friendly language for tax professionals and stakeholders.\n3. Instruction + Iterative Prompting\n•  Provide an initial technical assessment of the presented facts.\n•  In later rounds, incorporate new facts and answer follow-up questions using prior responses.\n•  Challenge or validate assumptions; test and refine tax positions.\n•  Evaluate alternative interpretations where appropriate.\n•  Build consistently on prior conclusions unless new facts justify revision.\n•  Update the analysis transparently when the factual or technical basis changes.",
      },
      {
        title: "Iterative Discussion for Insights on Foreign Tax Laws",
        sub: "Foreign Tax — Analysis, Refinement & Output",
        body: "4. Query Analysis Method\n•  Analyze the relevant facts and identify applicable tax provisions.\n•  Assess tax implications and alternative interpretations.\n•  Highlight assumptions, limitations and points needing clarification.\n•  Reach a reasoned conclusion supported by applicable tax principles.\n•  Reference relevant code provisions, regulations, guidance or precedents appropriately.\n5. Refinement Prompting\n•  Strengthen the analysis as further questions are raised.\n•  Address concerns, incorporate additional fact patterns and reassess conclusions where required.\n•  Narrow the analysis to the precise technical issue under consideration.\n•  Ensure the final position reflects the collective insights developed across all rounds.\n6. Final Output Format\n•  Technical Summary — Facts | Provisions | Observations | Tax Implications | Assumptions / Limitations | Conclusions.\n•  Communication Summary — Background | Key Tax Considerations | Conclusions | Further Review | Recommended Next Steps.",
      },
      {
        title: "Iterative Discussion for Insights on Foreign Tax Laws",
        sub: "Foreign Tax — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Do not hallucinate tax provisions, case law, regulations or guidance.\n•  Base conclusions only on facts provided during the discussion.\n•  Distinguish clearly between facts, assumptions and conclusions.\n•  Identify missing information when the facts are incomplete.\n•  Revise conclusions only when supported by new facts or technical analysis.\n•  Maintain consistency throughout the iterative discussion.\nPrompting Techniques Demonstrated — I\n•  Iterative — Each round builds on prior analysis and new facts.\n•  Chain-of-Thought — Facts → law → analysis → alternatives → conclusion.\n•  Refinement — Successive questions narrow and strengthen the technical view.\n•  Grounding — Uses the stated facts and applicable tax-law sources.\nPrompting Techniques Demonstrated — II\n•  Audience — Suitable for tax professionals and business stakeholders.\n•  Zero-Shot — No sample analysis or output is supplied.\n•  Constraint-Based — Prevents unsupported law, facts and conclusions.",
      },
    ],
  },
  {
    id: 8,
    name: "Concept Simplification Framework",
    category: "Research",
    capabilities: ["Explain"],
    slides: [
      {
        title: "Concept Simplification Framework",
        sub: "Concept Simplification — Audience, Context & Structure",
        body: "1. Persona + Audience Prompting\nAct for a learner or professional seeking to understand a complex topic clearly, relatably and in a structured way.\n•  Use analogies, real-life examples and progressive explanations that build understanding step by step.\n2. Context + Refinement Prompting\nBreak down <<insert topic—e.g., GST mechanism, blockchain or equity valuation>> into clear, digestible components without compromising accuracy.\n•  Focus on the most important concepts and enable progressive learning through simplified explanations and relatable examples.\n3. Structure the Topic Logically\n•  Divide the topic into logical sub-topics or building blocks.\n•  Ensure each sub-topic builds on the previous one.\n•  Present concepts in a sequence that supports gradual understanding.\n•  Explain the foundation before introducing dependent or advanced ideas.\n•  Keep the learning path coherent from first principles to application.",
      },
      {
        title: "Concept Simplification Framework",
        sub: "Concept Simplification — Explanation, Grounding & Output",
        body: "4. Simplify with Analogies and Examples\n•  Use analogies, metaphors and real-life illustrations to explain concepts.\n•  Replace technical jargon with simple language wherever possible.\n•  When technical terms are necessary, define them plainly before using them.\n•  Clearly distinguish explanatory analogies from established facts.\n5. Recent Developments + Grounding\n•  Include relevant recent developments, updates, amendments or major announcements affecting the topic.\n•  Reference reliable and authoritative sources wherever applicable.\n•  Ensure all information is factually accurate and up to date.\n6. Tone + Output Format\n•  Tone — Engaging, professional and learner-friendly throughout.\n•  Primary table — Subtopic | Explanation | Example / Analogy | Key Takeaway | Source / Link.\n•  Adjust the format only where necessary to improve clarity and understanding.",
      },
      {
        title: "Concept Simplification Framework",
        sub: "Concept Simplification — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Avoid unnecessary complexity, excessive technical language and repetition.\n•  Do not oversimplify in a way that compromises accuracy.\n•  Maintain conceptual clarity throughout the explanation.\n•  Do not hallucinate or fabricate facts, examples, updates or references.\n•  Use reliable information and separate established facts from analogies.\nPrompting Techniques Demonstrated — I\n•  Audience Prompting — Tailors explanations to learners and professionals.\n•  Chain-of-Thought — Builds understanding through logical, progressive blocks.\n•  Refinement — Distills complex subject matter into essential learning components.\nPrompting Techniques Demonstrated — II\n•  Grounding — Uses current, reliable and authoritative information.\n•  Creative Expansion — Uses analogies, metaphors and real-life examples.\n•  Constraint-Based — Prevents repetition, fabrication and inaccurate simplification.",
      },
    ],
  },
  {
    id: 9,
    name: "EULA Analysis basis SC ruling in Engineering Analysis Centre of Excellence",
    category: "Research",
    capabilities: ["Analyse"],
    slides: [
      {
        title: "EULA Analysis basis SC ruling in Engineering Analysis Centre of Excellence",
        sub: "EULA / EACoE — Context, Role & Review",
        body: "1. Context + Grounding\nAnalyze the attached Software End User License Agreement in the context of the Supreme Court ruling in Engineering Analysis Centre of Excellence (EACoE).\n•  Use only the EULA, attached Supreme Court extracts on software-licensing categories, and any case-specific comparison instructions.\n•  Determine how the EULA terms align with the categories and principles discussed by the Court.\n2. Persona\nAct as an Indian tax professional specializing in the Income-tax Act, international tax, tax treaties, withholding tax, and software/IP judicial precedents.\n3. Clause-by-Clause Review\n•  Identify each relevant EULA paragraph and corresponding Supreme Court observation.\n•  Determine the most relevant EACoE category.\n•  Compare similarities and differences between the EULA and Court extracts.\n•  Explain the rationale for category classification.\n•  Where several clauses support one category, assess their collective effect.",
      },
      {
        title: "EULA Analysis basis SC ruling in Engineering Analysis Centre of Excellence",
        sub: "EULA / EACoE — Refinement & Output",
        body: "4. Refinement Focus\n•  Focus on use, ownership, licensing restrictions, copyright, reproduction, distribution, transfer, modification and sublicensing rights.\n•  Separate rights granted to the end user from rights retained by the software owner.\n•  Assess limited software-use rights versus possible copyright exploitation.\n•  Link each EULA provision to the relevant Court observation and incorporate additional comparison instructions.\n5. Comparative Analysis Table\nUse these columns in order:\n•  EULA Paragraph(s) | Relevant Supreme Court Reference | Category under EACoE | Comparative Analysis\n•  Classify as Category 1 / 2 / 3 / 4, with a detailed comparison and rationale.\n6. Closing Analysis\n•  Overall Summary — EULA characteristics; user and owner rights; category alignment; strong alignment; clauses needing review; overall conclusion.\n•  Additional Comparison — Include requested case-specific comparisons or additional analysis.",
      },
      {
        title: "EULA Analysis basis SC ruling in Engineering Analysis Centre of Excellence",
        sub: "EULA / EACoE — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Do not hallucinate judicial observations, paragraph references or legal conclusions.\n•  Restrict the analysis to the attached EULA and Supreme Court extracts.\n•  Distinguish factual observations from interpretative comments.\n•  State the limitation where a provision cannot be mapped to a category.\n•  Do not assume rights or restrictions absent from the EULA.\n•  Support conclusions with EULA language and the attached Court extracts.\nPrompting Techniques Demonstrated — I\n•  Chain-of-Thought — EULA clause → Court observation → category → comparison → conclusion.\n•  Grounding — Uses only the attached EULA and Supreme Court extracts.\n•  Refinement — Narrows review to licensing, copyright and category-classification rights.\nPrompting Techniques Demonstrated — II\n•  Zero-Shot — Provides instructions and structure without a completed example.\n•  Constraint-Based — Prevents unsupported law, assumptions and document-external conclusions.",
      },
    ],
  },
  {
    id: 10,
    name: "Comparative Analysis of Indian Tax Case Laws",
    category: "Research",
    capabilities: ["Compare"],
    slides: [
      {
        title: "Comparative Analysis of Indian Tax Case Laws",
        sub: "Case Law Comparison — Context, Role & Method",
        body: "1. Context + Grounding\nCompare two Indian tax judgments and present their similarities, differences, judicial principles and practical implications.\n•  Use only the two case laws provided.\n•  Derive every fact, observation, conclusion and comparison from the judgments.\n2. Persona + Audience\nAct as an Indian tax professional skilled in interpreting tax legislation and judicial precedents.\n•  Write clearly for tax professionals and non-specialists without losing technical accuracy.\n3. Analyze Each Case Separately\n•  Identify the central issue, relevant facts and applicable tax provisions.\n•  Summarize the taxpayer's and tax authority's arguments neutrally.\n•  Explain the court's observations, reasoning and cited precedents.\n•  State the final decision and its rationale.\n•  Then compare both rulings for similarities, differences and implications.",
      },
      {
        title: "Comparative Analysis of Indian Tax Case Laws",
        sub: "Case Law Comparison — Output & Insights",
        body: "4. Executive Summary\n•  Case Law 1 — Tax issue and outcome.\n•  Case Law 2 — Tax issue and outcome.\n•  Comparative Overview — Key similarities and key differences.\n5. Background + Arguments Tables\nUse columns: Particulars | Case Law 1 | Case Law 2\n•  Case Background — Relevant facts | tax issue | applicable legal provisions.\n•  Arguments Presented — Taxpayer's arguments | tax authority's arguments.\n6. Court's Ruling + Conclusion\n•  Ruling Table — Key observations | relevant precedents | final decision | rationale.\n•  Conclusion & Insights — Practical implications; judicial principles; convergence and divergence; key lessons.\n•  Tone — Simple, professional and reader-friendly.",
      },
      {
        title: "Comparative Analysis of Indian Tax Case Laws",
        sub: "Case Law Comparison — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Do not hallucinate facts, law, judicial observations or conclusions.\n•  Include only information available in the provided judgments.\n•  Clearly distinguish facts from judicial observations.\n•  Present both sides neutrally and avoid external commentary.\n•  Ensure the comparison accurately reflects each judgment.\n•  Use simple language while preserving technical accuracy.\nPrompting Techniques Demonstrated — I\n•  Chain-of-Thought — Moves from facts → law → arguments → reasoning → decision → comparison.\n•  Grounding — Uses only the two supplied case laws.\n•  Audience Prompting — Balances accessibility with tax and legal accuracy.\nPrompting Techniques Demonstrated — II\n•  Refinement — Organizes judgments into summaries, tables, rulings and insights.\n•  Zero-Shot — Supplies structure without a model answer.\n•  Constraint-Based — Blocks unsupported facts, law and commentary.",
      },
    ],
  },
  {
    id: 11,
    name: "Tax Analysis of Software Royalty Agreements",
    category: "Research",
    capabilities: ["Analyse"],
    slides: [
      {
        title: "Tax Analysis of Software Royalty Agreements",
        sub: "Software Royalty Tax — Facts, Sources & EACoE",
        body: "1. Context + Transaction Facts\nAnalyze software-royalty reimbursement payments from an Indian company to a foreign group entity.\n•  Indian payer — Name: << >> | Industry: Software Development—Data Analytics & Cybersecurity | HQ: Pune | Clients: Startups / MNCs / Fortune 500 | Residency: << >>\n•  Foreign recipient — Name: << >> | Location: << >> | Residency: << >> | Presence in India: << >>\n2. Grounding + Persona\n•  Use only the attached EACoE ruling, Software License EULA, Income-tax Act extracts and supplied memo/reference documents.\n•  Act as an Indian tax professional specializing in international tax, withholding, treaties, software royalty and judicial precedents.\n3. Part 1 — Supreme Court Analysis\n•  Identify each software-licensing category, its characteristics and the categorization rationale.\n•  Explain how EULAs are treated under each category.\n•  Output table: Terms of EULA considered by the Supreme Court | Supreme Court analysis / interpretation.",
      },
      {
        title: "Tax Analysis of Software Royalty Agreements",
        sub: "Software Royalty Tax — EULA Review & Tax Memo",
        body: "4. Part 2 — EULA Clause Review\n•  Identify each clause number and title; summarize rights, duties, restrictions and permissions.\n•  Compare the clause with EACoE and identify the most relevant Supreme Court observation.\n•  Table: Clause Number & Title | Clause Summary | Relevant Supreme Court Observation.\n5. Part 3 — Tax Memorandum\n•  Background + Purpose — Facts, relationship, licensing arrangement, objectives and key tax questions.\n•  EULA + Documentation — Key clauses, EACoE alignment, reimbursement records and substantiation.\n•  Withholding — Royalty vs reimbursement; EACoE; Income-tax Act; treaty if supported; TDS for << >>.\n6. Required Memo Sections\n•  Background | Purpose | Executive Summary | EULA Analysis | Documentation Requirements.\n•  Withholding Tax Position | Technical Observations | Assumptions & Limitations | Recommendations | Conclusion.",
      },
      {
        title: "Tax Analysis of Software Royalty Agreements",
        sub: "Software Royalty Tax — Iteration & Guardrails",
        body: "7. Part 4 — Follow-up Enhancements\n•  Build each update on the earlier analysis and newly supplied instructions.\n•  Add a detailed outline, scope limitations and reimbursement documentation.\n•  Address category-wise withholding, Act/treaty analysis and tax-compliant recommendations.\n8. Constraints & Boundaries\n•  Do not invent legal provisions, judicial observations or tax conclusions.\n•  Use only the supplied facts and documents; separate facts, assumptions and conclusions.\n•  Do not assume treaty applicability; identify missing information explicitly.\n•  Support conclusions with the EULA, EACoE ruling and provided legislation.\nPrompting Techniques Demonstrated\n•  Chain-of-Thought + Refinement — Ruling → EULA → reimbursement → withholding → conclusion.\n•  Grounding — Uses only supplied materials.\n•  Iterative — Expands the memo as new instructions arrive.\n•  Zero-Shot + Constraint-Based — No sample answer; blocks unsupported law and assumptions.",
      },
    ],
  },
  {
    id: 12,
    name: "Multi-law and Cross-Border Interplay",
    category: "Research",
    capabilities: ["Analyse"],
    slides: [
      {
        title: "Multi-law and Cross-Border Interplay",
        sub: "Multi-law Interplay — Role, Facts & Method",
        body: "1. Persona\nAct as a Senior Tax Transaction Specialist and Regulatory Advisor in India.\n•  Apply expertise across direct and indirect tax, FEMA, corporate and securities law, RBI regulation, competition law and international tax treaties.\n2. Transaction Context + Grounding\n•  <<Describe the transaction in 1–2 lines: jurisdictions, entity locations, Indian state, listed/unlisted status, ownership and other material facts.>>\n•  Treaty — <<Insert relevant DTAA—e.g., India–USA or India–UK.>>\n•  Use only the supplied facts and applicable Indian laws and treaty provisions identified in the prompt.\n3. Structured Multi-law Analysis\n•  For each relevant law, identify provisions and tax, regulatory, reporting, withholding, approval and compliance triggers.\n•  Assess cross-border and treaty implications, risks, ambiguity and required actions.\n•  Explain overlaps, dependencies and whether one law influences another.",
      },
      {
        title: "Multi-law and Cross-Border Interplay",
        sub: "Multi-law Interplay — Laws, Sources & Output",
        body: "4. Relevant-law Universe\n•  Income-tax Act and Rules | applicable DTAA | FEMA | Companies Act.\n•  SEBI | GST | RBI directions | competition law | other relevant Indian frameworks.\n•  Include only laws relevant to the stated transaction facts.\n5. Ground Every Conclusion\n•  Cite statutory sections and treaty articles.\n•  Reference relevant rules, notifications, circulars, guidelines and regulatory directions.\n•  Separate legislative provisions from interpretative observations; provide sources for key positions.\n6. Primary Output Table + Tone\n•  Columns — Law | Key Provisions | Implications | Required Action.\n•  Populate rows for Income-tax, FEMA, DTAA, Companies Act and every other applicable framework.\n•  Tone — Professional advisory-report style for tax, legal, finance and compliance stakeholders.",
      },
      {
        title: "Multi-law and Cross-Border Interplay",
        sub: "Multi-law Interplay — Report, Guardrails & Techniques",
        body: "7. Analysis Following the Table\n•  Executive Summary — Transaction overview; key tax, regulatory and treaty observations.\n•  Interaction of Laws — Overlaps, conflicts, dependencies and implementation order.\n•  Key Risks — Tax, regulatory, compliance and documentation exposure.\n•  Next Steps — Approvals, filings, documents and compliance actions.\n8. Constraints & Boundaries\n•  Use only Indian laws and treaty provisions in force on the analysis date.\n•  Base conclusions solely on stated facts; do not assume missing information.\n•  Do not invent provisions, circulars, notifications or treaty interpretations.\n•  Identify fact gaps and restrict conclusions to legally supported matters.\nPrompting Techniques Demonstrated\n•  Chain-of-Thought — Facts → laws → treaty → compliance → risks → actions.\n•  Grounding — Uses facts, law, guidance and treaty articles.\n•  Refinement — Narrows applicability to implications and actions.\n•  Audience — Advisory format for multidisciplinary stakeholders.\n•  Zero-Shot + Constraint-Based — No sample answer; blocks unsupported assumptions.",
      },
    ],
  },
  {
    id: 13,
    name: "Stress Test Events to Identify Policy Loopholes",
    category: "Compliance",
    capabilities: ["Evaluate"],
    slides: [
      {
        title: "Stress Test Events to Identify Policy Loopholes",
        sub: "Policy Stress Test — Context, Role & Review",
        body: "1. Context + Inputs\n•  Objective — Stress-test the policy for loopholes, vulnerabilities, implementation challenges and resilience to current or emerging risks.\n•  Inputs — Policy Type: <<e.g., Social Media, Data Privacy or Information Security>> | Organization: <<insert type>>.\n•  Focus Areas — <<e.g., privacy, conduct, crisis, reputation, compliance and emerging trends>>.\n2. Persona + Grounding\n•  Act as a risk, compliance and policy advisory professional experienced in governance, regulatory compliance, organizational risk and controls.\n•  Use only the attached policy and supplied inputs.\n3. Policy Review + Scenario Generation\n•  Review each section for gaps, ambiguities, inconsistencies and vulnerabilities.\n•  Test whether intended objectives and risk areas are adequately addressed.\n•  Create realistic operational, regulatory, technological, reputational and behavioral stress events.",
      },
      {
        title: "Stress Test Events to Identify Policy Loopholes",
        sub: "Policy Stress Test — Scenarios, Risks & Priorities",
        body: "4. Assess Every Scenario\n•  Identify the relevant policy provision.\n•  Evaluate whether the policy addresses the situation adequately.\n•  Identify loopholes, weak controls or unclear guidance.\n•  Assess the potential consequences and response under the policy.\n5. Creative Expansion\n•  Generate plausible situations not explicitly contemplated by the policy.\n•  Consider emerging technology, behavior, regulatory change and market developments.\n•  Also test cyber threats, social/reputational trends, disruption and cross-border issues where relevant.\n6. Prioritize + Refine Findings\n•  Rank findings by impact and likelihood; distinguish minor gaps from critical vulnerabilities.\n•  Highlight recurring themes and systemic weaknesses.\n•  Focus recommendations on clarifications or enhancements that materially improve resilience.",
      },
      {
        title: "Stress Test Events to Identify Policy Loopholes",
        sub: "Policy Stress Test — Outputs, Guardrails & Techniques",
        body: "7. Required Output\n•  Policy Assessment — Policy Area | Existing Coverage | Identified Gap | Risk Rating.\n•  Stress Tests — Scenario | Relevant Provision | Potential Loophole | Impact | Risk Level.\n•  Hidden Risks — Risk Area | Description | Potential Consequence.\n•  Enhancements — Observation | Recommended Enhancement | Expected Benefit.\n•  Executive Summary — Maturity, strengths, critical vulnerabilities, emerging risks and priorities.\n8. Constraints & Boundaries\n•  Use only the attached policy and facts provided.\n•  Do not assume undocumented controls, governance or procedures.\n•  Do not invent policy provisions or regulatory requirements.\n•  Separate documented requirements from inferred risks.\n•  Link every recommendation directly to an identified finding.\n•  Maintain a practical, risk-based and evidence-driven approach.\nPrompting Techniques Demonstrated\n•  Chain-of-Thought — Policy review → scenarios → impact → risks → recommendations.\n•  Grounding — Relies only on the policy and supplied facts.\n•  Creative Expansion — Surfaces plausible emerging and overlooked events.\n•  Refinement — Prioritizes loopholes and targeted improvements.\n•  Zero-Shot + Constraint-Based — No sample answer; blocks unsupported facts and controls.",
      },
    ],
  },
  {
    id: 14,
    name: "Mock Run for Presenting PPT",
    category: "Planning and Communication",
    capabilities: ["Evaluate", "Generate"],
    slides: [
      {
        title: "Mock Run for Presenting PPT",
        sub: "Mock Presentation — Context, Role & Review",
        body: "1. Persona + Presentation Context\n•  Role — Act as an experienced tax consultant who explains complex tax, regulatory, transaction and business issues clearly.\n•  Inputs — Forum: <<insert name>> | Industry / Focus: <<insert area>>.\n•  Grounding — Use only the attached deck; add no unsupported content, assumptions or explanations.\n2. Understand Every Slide\n•  Identify the slide objective, memorable message and points requiring emphasis.\n•  Explain the business relevance and implications supported by the slide.\n3. Flow + Audience Engagement\n•  Evaluate slide-to-slide logic; create smooth transitions and reinforce recurring themes.\n•  Anticipate clarification needs and likely discussion points.\n•  Suggest responses using only information contained in the presentation.",
      },
      {
        title: "Mock Run for Presenting PPT",
        sub: "Mock Presentation — Output Options & Delivery",
        body: "4. Option 1 — Slide-wise Speaking Notes\n•  Introduction — Opening statement for the slide.\n•  Key Messages + Business Relevance — Main points to emphasize and why they matter.\n•  Transition — Narrative link to the next slide.\n•  Q&A — Likely questions and deck-supported answers.\n5. Option 2 — Mock Narration\n•  Narration — Natural speaking script for each slide.\n•  Key Emphasis — Points to highlight verbally.\n•  Engagement Cues — Pauses, invitations for questions or input, and moments to reinforce messages.\n•  Transition — Suggested narrative link to the next slide.\n6. Refinement + Tone\n•  Distill content into concise, memorable speaking points.\n•  Simplify technical concepts while preserving accuracy; focus on decisions, business implications and practical outcomes.\n•  Use short, crisp sentences in a professional, conversational and presentation-friendly tone.",
      },
      {
        title: "Mock Run for Presenting PPT",
        sub: "Mock Presentation — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Use only the attached presentation.\n•  Do not invent content, facts, conclusions or positions.\n•  Preserve technical accuracy while simplifying explanations.\n•  Ensure anticipated questions and responses are supported by the slides.\n•  Focus on clarity, delivery effectiveness and audience engagement.\nPrompting Techniques Demonstrated — I\n•  Chain-of-Thought — Slide understanding → message → notes → questions → transitions → delivery.\n•  Grounding — Relies exclusively on the attached deck.\n•  Audience Prompting — Tailors explanations, relevance and engagement to the forum.\nPrompting Techniques Demonstrated — II\n•  Refinement — Converts detailed slides into concise, presentation-ready language.\n•  Zero-Shot — Provides a framework without sample notes.\n•  Constraint-Based — Prevents unsupported additions and preserves accuracy.",
      },
    ],
  },
  {
    id: 15,
    name: "Step Plan and Activity Tracker Generation",
    category: "Research",
    capabilities: ["Generate"],
    slides: [
      {
        title: "Step Plan and Activity Tracker Generation",
        sub: "Step Plan Tracker — Context, Role & Method",
        body: "1. Persona + Grounding\n•  Act as a tax professional specializing in transaction tax advisory and Indian corporate law.\n•  Apply the Companies Act, 2013, related rules, notifications, circulars and MCA filing requirements.\n•  Use only the supplied transaction facts and relevant corporate-law provisions.\n2. Transaction Context\n•  Prepare an implementation plan for <<insert corporate transaction or regulatory process>>.\n•  Examples: merger of unlisted companies, interstate registered-office shift or corporate restructuring.\n3. Build the Chronological Step Plan\n•  Sequence every action from planning through completion.\n•  Map law, statutory timeline, documents, MCA forms and regulatory filings.\n•  Assign responsibility and show dependencies between tasks.\n•  Use only provisions relevant to the transaction analyzed.",
      },
      {
        title: "Step Plan and Activity Tracker Generation",
        sub: "Step Plan Tracker — Refinement, Iteration & Timing",
        body: "4. Transaction-specific Refinement\n•  Merger — Map provisions, rules, approvals, stakeholder actions, forms, documents, timelines and owners.\n•  Office Shift — Map provisions, filings, approvals, documents, sequencing and estimated timing.\n•  Exclude unrelated requirements and focus on the selected transaction.\n5. Iterative Timeline Updates\n•  Incorporate revised timelines, fixed start dates, efficiency assumptions or acceleration requirements.\n•  Recalculate target dates and optimize sequencing and dependencies.\n•  Move non-working-day dates to the next working day when instructed.\n•  Build each revision on the prior plan and state timeline assumptions.\n6. Implementation Focus\n•  Keep activities in correct chronological order.\n•  Surface key milestones, approval stages, critical filing dates and regulatory dependencies.\n•  Make ownership, duration and target completion dates actionable.",
      },
      {
        title: "Step Plan and Activity Tracker Generation",
        sub: "Step Plan Tracker — Outputs, Guardrails & Techniques",
        body: "7. Required Output\n•  Activity Tracker — Step No. | Activity | Law / Section / Rule | Documents / Forms | Responsibility | Days | Target Date.\n•  Filing Tracker — Filing / Form | Provision | Authority | Timeline | Supporting Documents.\n•  Dependencies — Activity | Dependency | Impact if Delayed.\n•  Timeline Summary — Total timeline, milestones, approvals, filing dates and regulatory dependencies.\n8. Constraints & Boundaries\n•  Use only relevant corporate-law requirements and stated facts.\n•  Do not invent MCA forms, timelines, approvals or statutory obligations.\n•  Cite available sections, rules and form numbers; state assumptions and information gaps.\n•  Exclude unrelated provisions and clearly identify limitations.\nPrompting Techniques Demonstrated\n•  Chain-of-Thought — Transaction → law → actions → filings → owners → timeline.\n•  Grounding — Uses stated facts and applicable corporate law.\n•  Refinement — Converts requirements into detailed trackers.\n•  Iterative — Recalculates plans when assumptions change.\n•  Zero-Shot + Constraint-Based — No sample output; blocks unsupported forms and dates.",
      },
    ],
  },
  {
    id: 16,
    name: "Generate Your Own Prompt Through Iteration",
    category: "Planning and Communication",
    capabilities: ["Generate"],
    slides: [
      {
        title: "Generate Your Own Prompt Through Iteration",
        sub: "Iterative Prompt Builder — Role, Goal & Discovery",
        body: "1. Persona + Meta Prompting\n•  Act as my dedicated Prompt Engineer.\n•  Transform initial ideas into clear, structured and high-quality prompts that can be executed accurately.\n•  Improve the prompt itself rather than answering the underlying task immediately.\n2. Objective + Final Prompt Scope\n•  Develop the prompt collaboratively through multiple refinement rounds.\n•  Capture the objective, context, outputs, constraints, audience and tone where relevant.\n3. Begin with Flipped Prompting\n•  First ask for the topic, task, intended outcome and specific requirements or limitations.\n•  Use targeted questions to clarify scope, missing context, outputs, audience and format.\n•  Do not produce a final prompt before sufficient information is gathered.",
      },
      {
        title: "Generate Your Own Prompt Through Iteration",
        sub: "Iterative Prompt Builder — Refinement Cycle & Output",
        body: "4. Continuous Iteration Cycle\n•  Generate a stronger prompt using the latest information.\n•  Identify remaining gaps and ask focused follow-up questions.\n•  Incorporate responses and improve the next draft.\n•  Repeat until the user confirms the prompt is fit for purpose.\n5. Output for Every Iteration\n•  Revised Prompt — Provide the latest improved prompt.\n•  Improvements Made — List enhancements and explain how they improve quality.\n•  Clarifying Questions — Ask focused questions addressing remaining gaps.\n•  Next Draft — State information still needed and possible further improvements.\n6. Refinement Standards\n•  Remove ambiguity and improve clarity, specificity and actionability.\n•  Strengthen instructions, outputs and missing prompt elements.\n•  Simplify wording where possible without losing precision or consistency.",
      },
      {
        title: "Generate Your Own Prompt Through Iteration",
        sub: "Iterative Prompt Builder — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Do not assume facts, requirements, objectives or constraints.\n•  Do not finalize until sufficient information is available.\n•  Ask only relevant clarifying questions.\n•  Ensure every revision meaningfully improves the prior draft.\n•  Maintain consistency throughout the iterative process.\nPrompting Techniques Demonstrated — I\n•  Meta Prompting — Creates and optimizes the prompt rather than solving the task.\n•  Iterative Prompting — Improves the draft through repeated feedback cycles.\n•  Flipped Prompting — Begins with targeted questions before drafting.\nPrompting Techniques Demonstrated — II\n•  Refinement — Strengthens clarity, structure and output requirements.\n•  Audience Prompting — Tailors the final prompt to its intended users.\n•  Constraint-Based — Prevents unsupported assumptions and premature finalization.",
      },
    ],
  },
  {
    id: 17,
    name: "Streamlined Vernacular Document Translation",
    category: "Data",
    capabilities: ["Transform"],
    slides: [
      {
        title: "Streamlined Vernacular Document Translation",
        sub: "Document Translation — Context, Role & Extraction",
        body: "1. Context + Document Inputs\n•  Translate the attached vernacular-language PDF into English while preserving meaning, structure and all content.\n•  Document Title — <<insert document title—e.g., notice, tax certificate or correspondence>>\n•  Source Language — <<insert source language>>\n•  Grounding — Use only the attached PDF.\n2. Persona\n•  Act as an advanced translation specialist for legal, tax, regulatory and business documents.\n•  Preserve context, intent, terminology and document structure.\n3. Steps 1–2 — Extract + Verify\n•  Extract every line from every page, including mixed English and vernacular text.\n•  Capture headings, paragraphs, tables, footnotes, signatures, stamps, annotations and other document elements.\n•  Confirm that no page, paragraph, table or section has been omitted.",
      },
      {
        title: "Streamlined Vernacular Document Translation",
        sub: "Document Translation — Translation, Tables & Output",
        body: "4. Step 3 — Complete English Translation\n•  Translate all extracted content without omission, summary or reinterpretation.\n•  Preserve original meaning, context, intent and legal, tax, regulatory or technical terminology.\n•  Keep names, reference numbers, dates, identifiers and factual details exactly as shown unless translation is required.\n•  Maintain consistent terminology; mark unclear or illegible text rather than guessing.\n5. Step 4 — Preserve Tables\n•  Retain the original table structure and layout as closely as possible.\n•  Translate every textual field within each table.\n•  Do not drop headings, labels, notes or repeated entries.\n6. Required Output Format\n•  Part 1 — Extracted text page by page, only when requested.\n•  Part 2 — Complete translation under Page 1, Page 2 and so on.\n•  Part 3 — Preserved tables using Original Field | English Translation where suitable.",
      },
      {
        title: "Streamlined Vernacular Document Translation",
        sub: "Document Translation — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Do not summarize, condense, reinterpret or paraphrase.\n•  Do not omit source content or invent words, explanations or interpretations.\n•  Restrict extraction and translation to the attached PDF.\n•  Preserve the original meaning as accurately as possible.\n•  Explicitly flag unclear or illegible portions instead of guessing.\nPrompting Techniques Demonstrated — I\n•  Chain-of-Thought — Extraction → completeness review → translation → table preservation.\n•  Grounding — Relies exclusively on the attached document.\n•  Refinement — Moves from raw extraction to validated, structured translation.\nPrompting Techniques Demonstrated — II\n•  Zero-Shot — Defines the translation task without a sample output.\n•  Constraint-Based — Prevents omissions, invention, paraphrasing and unsupported interpretation.",
      },
    ],
  },
  {
    id: 18,
    name: "Excel Formulas for GST Compliance Validation",
    category: "Compliance",
    capabilities: ["Generate"],
    slides: [
      {
        title: "Excel Formulas for GST Compliance Validation",
        sub: "GST Validation — Context, Role & Formula Logic",
        body: "1. Context + Objective\n•  Review sales and transaction data before GST return preparation for accuracy, completeness and reporting readiness.\n•  Generate Excel formulas to validate GSTIN, document / invoice numbers and HSN / SAC codes.\n•  Use only the stated conditions and GST reporting requirements described in the prompt.\n2. Persona\n•  Act as an automation and GST compliance expert.\n•  Apply experience in Excel validation controls, data-quality reviews and return preparation.\n3. Formula Generation Process\n•  Analyze each condition and translate it into Excel-compatible logic.\n•  Evaluate the conditions sequentially.\n•  Return the specified message when any check fails; otherwise return blank.\n•  Generate one formula for each validation requirement.",
      },
      {
        title: "Excel Formulas for GST Compliance Validation",
        sub: "GST Validation — Field Rules & Required Output",
        body: "4. GSTIN Validator\n•  Length must be exactly 15 characters.\n•  Characters 1–2 numeric; 3–7 alphabetic; 8–11 numeric.\n•  Character 12 alphabetic; character 13 numeric; character 14 must be “Z”.\n•  Return “OurGSTIN is Invalid” on failure; return blank when valid.\n5. Document / Invoice Number Validator\n•  Must not be blank and must not exceed 16 characters.\n•  Allow only alphabets, numerals, hyphen (-) and slash (/).\n•  Must be unique for the financial year.\n•  Return “Invalid doc no” on failure; return blank when valid.\n6. HSN / SAC Validator + Output\n•  Length must be exactly 6 or exactly 8 characters.\n•  Return “Invalid HSN/SAC” on failure; return blank when valid.\n•  Under each validator heading, provide a single Excel formula only.",
      },
      {
        title: "Excel Formulas for GST Compliance Validation",
        sub: "GST Validation — Guardrails & Techniques",
        body: "7. Constraints & Boundaries\n•  Generate only Excel-compatible formulas.\n•  Do not provide VBA, Power Query logic or alternatives unless requested.\n•  Address only the specified conditions; do not add validation checks.\n•  Do not assume missing requirements or hallucinate.\n•  Output only the relevant formula requested.\nPrompting Techniques Demonstrated — I\n•  Chain-of-Thought — Conditions → Excel logic → sequential evaluation → result.\n•  Refinement — Narrows broad GST controls into precise field-level rules.\nPrompting Techniques Demonstrated — II\n•  Zero-Shot — Defines requirements without example formulas.\n•  Constraint-Based — Limits the answer to one compatible formula and stated checks.\n•  Audience Prompting — Targets practical controls for GST and compliance professionals.",
      },
    ],
  },
  {
    id: 19,
    name: "PPT Generation",
    category: "Planning and Communication",
    capabilities: ["Generate"],
    slides: [
      {
        title: "PPT Generation",
        sub: "PPT Generation — Role, Inputs & Grounding",
        body: "1. Persona + Audience\n•  Act as a tax professional who prepares structured, professional and presentation-ready decks.\n•  Support business discussions, knowledge-sharing, leadership reviews and stakeholder communications.\n•  Simplify complex tax, regulatory and business topics without compromising accuracy or relevance.\n2. Source Input + Grounding\n•  Document — <<insert title of uploaded PDF, Word file or other document>>\n•  Topic — <<insert query or topic in text>>\n•  Develop the presentation solely from the uploaded content or supplied query.\n3. Legal Scope + Narrative\n•  Restrict legal analysis to: <<insert relevant Acts, Rules, treaties, circulars or guidance>>.\n•  Give each slide a distinct topic within one coherent storyline.\n•  Adapt language and depth to the intended audience.",
      },
      {
        title: "PPT Generation",
        sub: "PPT Generation — Analysis, Structure & Expansion",
        body: "4. Content Analysis\n•  Identify the source purpose, key messages and intended outcome.\n•  Extract major themes, conclusions, observations and recommendations.\n•  Determine the logical sequence and break content into distinct slide topics.\n5. Structure + Prioritize\n•  Group related concepts and keep each slide focused on one theme.\n•  Progress from background to analysis, conclusions and next steps.\n•  Prioritize decision-relevant information and distill it into concise messages.\n•  Preserve the source intent and substance throughout.\n6. Refine + Expand Creatively\n•  For documents: summarize, surface actions / risks, and identify appendix material.\n•  For topics: build a complete storyline with detailed, slide-specific explanations.\n•  Recommend relevant visuals, charts, diagrams, timelines, tables and infographics.\n•  Suggest slide titles, speaker notes, executive takeaways and supporting sections.",
      },
      {
        title: "PPT Generation",
        sub: "PPT Generation — Output, Guardrails & Techniques",
        body: "7. Required Output Format\n•  Slide 1: title and subtitle; Slide 2: agenda / index.\n•  For every content slide: title, purpose, audience takeaway, bullets, suggested visuals and speaker notes.\n•  Include executive summary, conclusion / next steps and appendices where applicable.\n8. Tone + Constraints\n•  Use professional, concise and audience-appropriate business language.\n•  Do not hallucinate or introduce unsupported content; use only the specified sources and laws.\n•  Paraphrase rather than copy large text blocks; preserve accuracy and intent.\n•  Keep messaging consistent and distinguish observations, conclusions and recommendations.\nPrompting Techniques Demonstrated\n•  Chain-of-Thought — Analyze → structure → create slides → talking points → visuals → conclusions.\n•  Grounding — Grounds the deck in supplied content and specified laws.\n•  Audience + Refinement — Adapts and distills content for its intended viewers.\n•  Creative Expansion — Adds relevant visual-storytelling recommendations.\n•  Zero-Shot + Constraints — Defines outputs without examples and enforces strict source limits.",
      },
    ],
  },
  {
    id: 20,
    name: "30-Day Skill Development Plan",
    category: "Planning and Communication",
    capabilities: ["Generate"],
    slides: [
      {
        title: "30-Day Skill Development Plan",
        sub: "Skill Plan — Learner, Goal & Progression",
        body: "1. Persona + Audience\n•  Act as a tax professional in a multinational organization who wants to upskill and create greater value.\n•  Design practical, structured and time-efficient learning alongside a full-time role.\n•  Keep the journey beginner-friendly and relevant to a changing business environment.\n2. Skill + Learning Objective\n•  Skill — <<insert skill—e.g., International Tax, Power BI, Excel Automation, Transfer Pricing, Data Analytics or AI for Tax>>\n•  Build proficiency through important concepts, practical applications and current developments.\n•  Accelerate learning toward real-world competency.\n3. 30-Day Learning Journey\n•  Create a progressive roadmap: Foundation → Application → Practice → Advanced Concepts → Real-World Usage.\n•  Build each module logically on prior learning.\n•  Add hands-on exercises, real-world use cases and progress checkpoints.",
      },
      {
        title: "30-Day Skill Development Plan",
        sub: "Skill Plan — Activities, Resources & Trackers",
        body: "4. Daily / Weekly Plan Requirements\n•  Define a clear learning objective and concepts for each day or week.\n•  Assign a practical exercise and state the expected learning outcome.\n•  Keep workload realistic and maximize learning impact for a working professional.\n•  Include checkpoints to assess understanding and progress.\n5. Grounding + Learning Resources\n•  Incorporate relevant amendments, industry trends, announcements and best practices.\n•  Recommend reputable videos, articles, blogs, official guidance and affordable courses.\n•  Use reliable sources and avoid inventing resources or developments.\n6. Required Output Trackers\n•  Overview — Skill | Current Level | Learning Goal | Time Commitment.\n•  30-Day Plan — Day / Week | Topic | Objective | Exercise | Resource | Outcome.\n•  Latest Insights — Topic Area | Recent Update | Why It Matters.\n•  Practice — Activity | Purpose | Expected Benefit.",
      },
      {
        title: "30-Day Skill Development Plan",
        sub: "Skill Plan — Assessment, Guardrails & Techniques",
        body: "7. End-of-Month Assessment\n•  Evaluate conceptual understanding and retention.\n•  Assess practical application and problem-solving ability.\n•  Test whether learning translates into relevant business value.\n•  Present Assessment Area | Evaluation Criteria.\n8. Constraints & Boundaries\n•  Assume only 1–1.5 hours of learning time per day.\n•  Prioritize video, article and interactive formats.\n•  Cover foundations before advanced topics; avoid repetition and unnecessary complexity.\n•  Keep recommendations skill-relevant, practical and realistic; do not hallucinate.\nPrompting Techniques Demonstrated\n•  Audience — Tailors the plan to a time-constrained working professional.\n•  Chain-of-Thought — Foundation → application → practice → advanced → real-world.\n•  Refinement — Converts a broad skill into objectives, exercises and outcomes.\n•  Grounding — Requires current developments and reputable resources.\n•  Zero-Shot + Constraints — Defines the plan without examples and enforces time / quality limits.",
      },
    ],
  },
  {
    id: 21,
    name: "Strategic Upskilling Framework",
    category: "Planning and Communication",
    capabilities: ["Generate"],
    slides: [
      {
        title: "Strategic Upskilling Framework",
        sub: "Upskilling Framework — Learner, Goal & Progression",
        body: "1. Persona + Audience\n•  Act as a tax professional in a multinational organization building expertise in a new domain.\n•  Support competitiveness, adaptation to industry change and greater strategic value in the role.\n•  Design structured, practical learning that fits alongside full-time commitments.\n2. Skill + Study Cadence\n•  Skill — <<insert skill—e.g., International Tax, Power BI, Excel Automation, Transfer Pricing, Data Analytics or AI>>\n•  Duration — Two-month crash plan with 3 dedicated study days per week.\n•  Build from a strong foundation toward confident real-world application.\n3. Progressive Learning Path\n•  Follow: Foundation → Core Concepts → Hands-On Practice → Real-World Application → Strategic / Advanced Topics.\n•  Balance theory with practical exercises and real-world use cases.\n•  Build each module on prior knowledge and include periodic checkpoints.",
      },
      {
        title: "Strategic Upskilling Framework",
        sub: "Upskilling Framework — Sessions, Resources & Trackers",
        body: "4. Weekly + Session Requirements\n•  For every week and session, define the learning objective and topics.\n•  Assign a practical activity and specify the expected outcome or milestone.\n•  Maximize effectiveness within the available time while sustaining progress.\n•  Use checkpoints to assess understanding and reinforce learning.\n5. Grounding + Learning Resources\n•  Incorporate relevant developments, amendments, trends, regulatory updates and announcements.\n•  Recommend trusted videos, articles, blogs, platforms, interactive exercises and affordable courses.\n•  Prioritize recognized sources and do not invent resources or updates.\n6. Required Output Trackers\n•  Goal Overview — Skill | Target Proficiency | Duration | Weekly Commitment.\n•  Roadmap — Week | Session | Topic | Objective | Activity | Resource | Outcome.\n•  Industry Updates — Topic Area | Latest Updates / Trends | Importance.\n•  Application — Activity | Purpose | Business Relevance.",
      },
      {
        title: "Strategic Upskilling Framework",
        sub: "Upskilling Framework — Milestones, Guardrails & Techniques",
        body: "7. Reviews + Final Self-Assessment\n•  Track milestone reviews by Timeline | Assessment Focus | Expected Competency.\n•  Assess conceptual understanding, practical application and problem solving.\n•  Evaluate business relevance and readiness for independent work.\n8. Constraints & Boundaries\n•  Assume 1–2 hours per session, 3 days per week.\n•  Prioritize video, article and interactive learning content.\n•  Keep the plan realistic for full-time work; avoid early complexity and repetition.\n•  Use only skill-relevant recommendations; do not hallucinate resources or updates.\nPrompting Techniques Demonstrated\n•  Audience — Tailors the roadmap to a time-constrained working professional.\n•  Chain-of-Thought — Foundation → core → practice → application → advanced.\n•  Refinement — Turns a broad skill into sessions, exercises, milestones and outcomes.\n•  Grounding — Requires current developments and trusted learning resources.\n•  Zero-Shot + Constraints — Defines outputs without examples and enforces cadence / quality limits.",
      },
    ],
  },
];
