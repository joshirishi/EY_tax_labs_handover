/**
 * EY.ai Tax Labs — Curriculum Map
 *
 * Single source of truth for the Phase 1 module journey: titles (matching the
 * Phase 1 course-card titles exactly), routes, ordering, and in-page
 * sub-module sections. LearningNav and the module pages read from this file
 * so labels never drift from the cards users unlock on /phase1.
 */

export type ModuleId =
  | "foundational"
  | "ai-tax-prompting"
  | "copilot-hub"
  | "ai-governance"
  | "advanced-workflows";

export interface SubModule {
  /** Anchor id of the <section> inside the module page (same-document scroll). */
  id: string;
  label: string;
  /** "learn" = concept-building sections, "apply" = practice/reference sections. */
  group: "learn" | "apply";
}

export interface CurriculumModule {
  id: ModuleId;
  /** Exact title shown on the Phase 1 course card — never abbreviate to "Module N". */
  title: string;
  path: string;
  order: number;
  estimatedTime: string;
  /** When "coming-soon", shown in nav but not navigable yet. */
  status?: "available" | "coming-soon";
  /** Whether ModuleHeader should render the Learn/Apply section tabs for this module. */
  supportsInPageNav: boolean;
  subModules: SubModule[];
}

/** Top-level curriculum unit — scales to Phase 2, 3, 4 without restructuring nav. */
export interface CurriculumPhase {
  number: number;
  label: string;
  path: string;
  modules: CurriculumModule[];
}

export const PHASE_LABEL = "Phase 1: Foundational Training Workshops";
export const PHASE_PATH = "/phase1";
/**
 * Current top-level unit in the Tax Labs journey (user-facing label: "Module").
 * Internal code still says PHASE_* for routes; chip copy uses Module / Sub-module.
 */
export const PHASE_NUMBER = 1;
export const TOTAL_PHASES = 4;
export const BRAND_LABEL = "AI for Tax Excellence";

export const PHASE2_LABEL = "Phase 2: Brainstorming Tax Use Cases";
export const PHASE2_PATH = "/phase2";
export const PHASE2_NUMBER = 2;

export const MODULES: CurriculumModule[] = [
  {
    id: "foundational",
    title: "Foundational Concepts of AI",
    path: "/foundational",
    order: 1,
    estimatedTime: "~45 min",
    supportsInPageNav: true,
    subModules: [
      { id: "act-now", label: "Act Now", group: "learn" },
      { id: "rise-of-ai", label: "Understanding AI", group: "learn" },
      { id: "evolution", label: "Evolution", group: "learn" },
      { id: "terminology", label: "Gen AI Convo", group: "learn" },
      { id: "genai-vs-agents", label: "GenAI vs Agents", group: "learn" },
      { id: "cheatsheet", label: "Thinking Partner", group: "learn" },
      { id: "quiz", label: "Quiz", group: "apply" },
    ],
  },
  {
    id: "ai-tax-prompting",
    title: "AI Tax Prompting",
    path: "/ai-tax-prompting",
    order: 2,
    estimatedTime: "~30 min",
    supportsInPageNav: true,
    subModules: [
      { id: "pipeline", label: "Prompt Basics", group: "learn" },
      { id: "elements", label: "Elements", group: "learn" },
      { id: "advanced", label: "Techniques", group: "learn" },
      { id: "match-activity", label: "Activity", group: "apply" },
      { id: "dos-donts", label: "Do's & Don'ts", group: "apply" },
      // "Cheat Sheet" tab hidden — links to RecapInNutshellSection in AiTaxPrompting.tsx, which is currently disabled.
      // { id: "recap", label: "Cheat Sheet", group: "apply" },
    ],
  },
  {
    id: "copilot-hub",
    title: "M365 Copilot Hub",
    path: "/copilot-hub",
    order: 3,
    estimatedTime: "~60 min",
    supportsInPageNav: true,
    subModules: [
      { id: "prompt-repository", label: "M365 Apps", group: "learn" },
      { id: "useful-links", label: "Useful Links", group: "apply" },
      { id: "security", label: "Security & Governance", group: "apply" },
    ],
  },
  {
    id: "ai-governance",
    title: "AI Governance in Tax",
    path: "/ai-governance",
    order: 4,
    estimatedTime: "~25 min",
    status: "coming-soon",
    supportsInPageNav: false,
    subModules: [],
  },
  {
    id: "advanced-workflows",
    title: "Advanced Tax Workflows",
    path: "/advanced-workflows",
    order: 5,
    estimatedTime: "~40 min",
    status: "coming-soon",
    supportsInPageNav: false,
    subModules: [],
  },
];

/** Ordered phases — add Phase 2+ here; ModuleHeader picker reads this tree. */
export const PHASES: CurriculumPhase[] = [
  {
    number: PHASE_NUMBER,
    label: PHASE_LABEL,
    path: PHASE_PATH,
    modules: MODULES,
  },
];

export function getPhase(number: number): CurriculumPhase {
  const found = PHASES.find((p) => p.number === number);
  if (!found) throw new Error(`Unknown phase number: ${number}`);
  return found;
}

export function getCurrentPhase(): CurriculumPhase {
  return getPhase(PHASE_NUMBER);
}

/** Flat list of every module across all phases (for prev/next, counts, etc.). */
export function getAllModules(): CurriculumModule[] {
  return PHASES.flatMap((p) => p.modules);
}

export function getModule(id: ModuleId): CurriculumModule {
  const found = getAllModules().find((m) => m.id === id);
  if (!found) throw new Error(`Unknown module id: ${id}`);
  return found;
}

export function getAdjacentModules(id: ModuleId): {
  prev: CurriculumModule | null;
  next: CurriculumModule | null;
} {
  const all = getAllModules().filter((m) => m.status !== "coming-soon");
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1]! : null,
    next: idx < all.length - 1 ? all[idx + 1]! : null,
  };
}

export const TOTAL_MODULES = getAllModules().filter((m) => m.status !== "coming-soon").length;

/** Splits a module's sub-modules into the "Learn" and "Apply" tab clusters. */
export function getSubModuleGroups(id: ModuleId): { learn: SubModule[]; apply: SubModule[] } {
  const { subModules } = getModule(id);
  return {
    learn: subModules.filter((s) => s.group === "learn"),
    apply: subModules.filter((s) => s.group === "apply"),
  };
}

/** Build navigation path — appends #section when jumping to a sub-module. */
export function moduleSectionPath(mod: CurriculumModule, sectionId?: string): string {
  return sectionId ? `${mod.path}#${sectionId}` : mod.path;
}

export function isModuleAvailable(mod: CurriculumModule): boolean {
  return mod.status !== "coming-soon";
}
