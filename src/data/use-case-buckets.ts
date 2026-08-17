import { colors } from "../design-kit/tokens";

export type UseCaseBucketId = "prompt" | "agent" | "procode";

export const USE_CASE_BUCKETS_STORAGE_KEY = "ey-phase2-use-cases";

export const USE_CASE_BUCKETS: {
  id: UseCaseBucketId;
  label: string;
  accent: string;
  chipText: string;
  hint: string;
  placeholder: string;
}[] = [
  {
    id: "prompt",
    label: "Prompt",
    accent: colors.yellow,
    chipText: colors.confidentBlack,
    hint: "One-off tasks where a user drives the interaction",
    placeholder: "e.g. Summarise a Supreme Court tax judgment for a client memo",
  },
  {
    id: "agent",
    label: "M365 Agent",
    accent: colors.framePurple,
    chipText: colors.white,
    hint: "Repeatable workflows across people, systems and repositories",
    placeholder: "e.g. Collect transfer pricing documentation from stakeholders each quarter",
  },
  {
    id: "procode",
    label: "Pro Code",
    accent: colors.frameBlue,
    chipText: colors.white,
    hint: "Custom automation or pro-code builds for structured tax processes",
    placeholder: "e.g. Automate GST reconciliation between ERP and filing portal",
  },
];

export const EMPTY_USE_CASES: Record<UseCaseBucketId, string[]> = {
  prompt: [],
  agent: [],
  procode: [],
};

export const EMPTY_USE_CASE_DRAFTS: Record<UseCaseBucketId, string> = {
  prompt: "",
  agent: "",
  procode: "",
};

function isUseCaseBucketId(value: unknown): value is UseCaseBucketId {
  return value === "prompt" || value === "agent" || value === "procode";
}

function normalizeEntries(raw: unknown): Record<UseCaseBucketId, string[]> {
  if (!raw || typeof raw !== "object") return { ...EMPTY_USE_CASES };

  const source = raw as Record<string, unknown>;
  const next = { ...EMPTY_USE_CASES };

  for (const bucketId of Object.keys(next) as UseCaseBucketId[]) {
    const items = source[bucketId];
    if (Array.isArray(items)) {
      next[bucketId] = items.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  }

  return next;
}

export function readStoredUseCaseEntries(): Record<UseCaseBucketId, string[]> {
  if (typeof window === "undefined") return { ...EMPTY_USE_CASES };

  try {
    const raw = window.localStorage.getItem(USE_CASE_BUCKETS_STORAGE_KEY);
    if (!raw) return { ...EMPTY_USE_CASES };
    return normalizeEntries(JSON.parse(raw));
  } catch {
    return { ...EMPTY_USE_CASES };
  }
}

export function writeStoredUseCaseEntries(entries: Record<UseCaseBucketId, string[]>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USE_CASE_BUCKETS_STORAGE_KEY, JSON.stringify(entries));
}

export function countUseCaseEntries(entries: Record<UseCaseBucketId, string[]>): number {
  return USE_CASE_BUCKETS.reduce((total, bucket) => total + entries[bucket.id].length, 0);
}

export function parseUseCaseEntries(raw: unknown): Record<UseCaseBucketId, string[]> {
  return normalizeEntries(raw);
}

export { isUseCaseBucketId };
