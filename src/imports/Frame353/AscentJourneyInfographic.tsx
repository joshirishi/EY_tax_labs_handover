/**
 * EY Tax Labs — The Ascent journey infographic (full artboard)
 * Figma node 3743:16946 — header copy, journey path, callouts, stages, banner.
 *
 * Fixed 1536×530 artboard, scales to container width via ResizeObserver.
 */

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { colors, fonts, typeScale } from "@/design-kit";

const W = 1536;
/** Tall enough for module 1.1 title label (≈446px) to clear the bottom milestone banner. */
const H = 530;
const BANNER_HEIGHT = 76;
const BANNER_TOP = H - BANNER_HEIGHT;
const ASSET = {
  cleanBackground: "/ascent/clean-background.png",
  flag: "/ascent/Flag.png",
  iconBookOpen: "/ascent/icon-book-open.svg",
  iconSearch: "/ascent/icon-search.svg",
  iconCpu: "/ascent/icon-cpu.svg",
  iconTrendingUp: "/ascent/icon-trending-up.svg",
  iconShield: "/ascent/icon-shield.svg",
  bannerDot: "/ascent/banner-dot.svg",
  bannerLine: "/ascent/banner-line.svg",
  accentLine: "/ascent/accent-line.svg",
} as const;

/** Figma Vector 2 — dashed ascending path (node 3811:4139). */
const JOURNEY_PATH_D =
  "M150.534 437.099L234.534 405.099C257.367 395.266 308.434 375.799 330.034 376.599C357.034 377.599 417.534 367.598 450.034 361.098C482.534 354.598 528.034 325.098 584.534 323.598C641.034 322.098 684.534 335.098 721.034 332.598C757.534 330.098 775.034 301.599 820.534 295.099C866.034 288.599 877.534 313.099 924.034 310.599C970.534 308.099 971.034 263.099 1012.03 265.599C1053.03 268.099 1054.03 295.099 1084.03 295.099C1114.03 295.099 1146.03 259.098 1159.03 243.598C1172.03 228.098 1179.03 216.098 1191.53 189.098C1201.53 167.498 1200.7 154.431 1199.03 150.598";

const JOURNEY_PATH_LAYOUT = {
  left: 187,
  top: 116,
  width: 1049.519,
  height: 286.501,
  viewBox: "0 0 1351.43 588.501",
  /** Matches SVG `inset-[-52.56%_-14.42%_-52.85%_-14.34%]` — artboard → viewBox. */
  svgInset: { top: 0.5256, right: 0.1442, bottom: 0.5285, left: 0.1434 },
} as const;

/** Artboard centers for module 1.1 + 6 stages (button center = left/top + half size). */
const PROGRESS_MARKER_CENTERS = [
  { x: 179, y: 389 }, // module 1.1 (156 + 23, 366 + 23)
  { x: 379, y: 315 }, // stage 1 — module 1.2
  { x: 574, y: 280 }, // stage 2 — module 1.3
  { x: 789, y: 260 }, // stage 3 — phase 2
  { x: 1038, y: 247 }, // stage 4 — phase 3
  { x: 1184, y: 222 }, // stage 5 — phase 4 (path terminus)
  { x: 1241, y: 114 }, // stage 6 — summit
] as const;

/** 0 = none (dim baseline only), 1 = module 1.1, 2–7 = stages 1–6 / full path. */
type ProgressLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Max progress level — full yellow path when user selects summit (level 7). */
const DEFAULT_PROGRESS: ProgressLevel = 7;

const PATH_REVEAL_MS = 650;

/**
 * How much of the path is lit, measured from the start.
 *
 * The reveal is cumulative: selecting a marker extends the glow up to the span
 * that ends at the NEXT marker, so each new selection adds to what is already
 * lit rather than moving it. Deselecting back to an earlier marker shortens
 * this value, and the stroke recoils along the same path.
 *
 *   level 1 (module 1.1) → stops[1]  (lit through the first span)
 *   level 2 (stage 1)   → stops[2]
 *   …
 *   level 6 (summit)    → the whole path
 */
function getLitLength(
  progressLevel: ProgressLevel,
  pathMetrics: { total: number; stops: number[] } | null,
): number {
  if (progressLevel <= 0 || !pathMetrics) return 0;
  if (progressLevel >= DEFAULT_PROGRESS) return pathMetrics.total;
  return pathMetrics.stops[progressLevel] ?? pathMetrics.total;
}

function artboardToViewBox(ax: number, ay: number) {
  const svgLeft =
    JOURNEY_PATH_LAYOUT.left - JOURNEY_PATH_LAYOUT.width * JOURNEY_PATH_LAYOUT.svgInset.left;
  const svgTop =
    JOURNEY_PATH_LAYOUT.top - JOURNEY_PATH_LAYOUT.height * JOURNEY_PATH_LAYOUT.svgInset.top;
  return { x: ax - svgLeft, y: ay - svgTop };
}

/** Binary-search the closest path length to a viewBox point. */
function closestPathLength(path: SVGPathElement, targetX: number, targetY: number): number {
  const total = path.getTotalLength();
  if (total <= 0) return 0;

  const sampleSteps = 240;
  let bestLen = 0;
  let bestDist = Infinity;

  for (let i = 0; i <= sampleSteps; i++) {
    const len = (i / sampleSteps) * total;
    const pt = path.getPointAtLength(len);
    const dist = (pt.x - targetX) ** 2 + (pt.y - targetY) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      bestLen = len;
    }
  }

  const window = total / sampleSteps * 4;
  let lo = Math.max(0, bestLen - window);
  let hi = Math.min(total, bestLen + window);

  for (let i = 0; i < 24; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    const d1 = distAt(path, m1, targetX, targetY);
    const d2 = distAt(path, m2, targetX, targetY);
    if (d1 < d2) hi = m2;
    else lo = m1;
  }

  return (lo + hi) / 2;
}

function distAt(path: SVGPathElement, len: number, tx: number, ty: number) {
  const pt = path.getPointAtLength(len);
  return (pt.x - tx) ** 2 + (pt.y - ty) ** 2;
}

const CALLOUTS = [
  { left: 140, top: 250, width: 149, quote: "I am confident in the foundational concepts of AI and ready to reimagine tax with AI-powered ways of working." },
  { left: 305, top: 188, width: 175, quote: "I understand prompt elements and techniques and can effectively communicate with AI." },
  { left: 498, top: 115, width: 165, quote: "I understand M365 Copilot Chat and Agents and can use them to work smarter and faster." },
  { left: 685, top: 95, width: 145, quote: "I can now identify AI opportunities in tax workflows and know when to use prompts or agents." },
  // Upper-right callouts — wider x gaps + diagonal stagger so all seven can stay open.
  { left: 848, top: 125, width: 125, quote: "I can confidently design prompts and Agents to solve business and tax challenges." },
  { left: 995, top: 38, width: 110, quote: "I can use AI responsibly while ensuring compliance and governance." },
  { left: 1125, top: 10, width: 115, quote: "I am an AI-enabled tax professional. I can confidently and responsibly use AI across the tax lifecycle to deliver greater value.", rounded: 4 },
] as const;

const STAGE_NODES = [
  { left: 359, top: 295, icon: ASSET.iconSearch, alt: "Laying the Foundation" },
  { left: 554, top: 260, icon: ASSET.iconCpu, alt: "Discovering Opportunities" },
  { left: 769, top: 240, icon: ASSET.iconTrendingUp, alt: "Building Solutions" },
  { left: 1018, top: 227, icon: ASSET.iconSearch, alt: "Embedding Confidence" },
  { left: 1164, top: 202, icon: ASSET.iconCpu, alt: "Embedding Confidence" },
  { left: 1221, top: 94, icon: ASSET.iconShield, alt: "Peak Performance" },
] as const;

/** Vertical gap between marker button bottom and its title label box. */
const TITLE_LABEL_GAP = 8;

/** Keep callouts, title pills, and CTAs inside the artboard and above the banner. */
const ARTBOARD_SAFE = { left: 16, right: 16, top: 10, bottom: 10 } as const;
const OVERLAY_MAX_BOTTOM = BANNER_TOP - 12;
const CALLOUT_EST_HEIGHT = 100;
const OVERLAY_GAP = 10;

type BoxRect = { left: number; top: number; width: number; height: number };

function clampBoxLeft(left: number, width: number): number {
  return Math.max(ARTBOARD_SAFE.left, Math.min(left, W - ARTBOARD_SAFE.right - width));
}

function clampBoxTop(top: number, height: number): number {
  return Math.max(ARTBOARD_SAFE.top, Math.min(top, OVERLAY_MAX_BOTTOM - height));
}

function clampBox(rect: BoxRect): BoxRect {
  return {
    ...rect,
    left: clampBoxLeft(rect.left, rect.width),
    top: clampBoxTop(rect.top, rect.height),
  };
}

function boxesOverlap(a: BoxRect, b: BoxRect, gap = OVERLAY_GAP): boolean {
  return (
    a.left < b.left + b.width + gap &&
    a.left + a.width + gap > b.left &&
    a.top < b.top + b.height + gap &&
    a.top + a.height + gap > b.top
  );
}

/** Estimate wrapped callout height from quote length — used for overlap resolution. */
function estimateCalloutHeight(quote: string, width: number): number {
  const innerWidth = Math.max(width - 24, 80);
  const charsPerLine = Math.max(10, Math.floor(innerWidth / 5.2));
  const lines = Math.ceil(quote.length / charsPerLine);
  return 12 + 14 + 4 + lines * 15 + 12 + 16;
}

/** Nudge a callout until it clears fixed obstacles (other callouts, title pills). */
function resolveCalloutBox(desired: BoxRect, obstacles: BoxRect[]): BoxRect {
  let box = clampBox(desired);
  const preferUp = desired.top < BANNER_TOP / 2;
  const maxDown = preferUp ? desired.top + 36 : OVERLAY_MAX_BOTTOM;

  for (let attempt = 0; attempt < 64; attempt++) {
    const blocker = obstacles.find((o) => boxesOverlap(box, o));
    if (!blocker) return box;

    if (preferUp) {
      const above = clampBox({ ...box, top: blocker.top - box.height - OVERLAY_GAP });
      if (!obstacles.some((o) => boxesOverlap(above, o))) {
        box = above;
        continue;
      }

      const upLeft = clampBox({
        ...box,
        left: blocker.left - box.width - OVERLAY_GAP,
      });
      if (!obstacles.some((o) => boxesOverlap(upLeft, o))) {
        box = upLeft;
        continue;
      }
    }

    const belowTop = blocker.top + blocker.height + OVERLAY_GAP;
    if (belowTop <= maxDown) {
      const below = clampBox({ ...box, top: belowTop });
      if (!obstacles.some((o) => boxesOverlap(below, o))) {
        box = below;
        continue;
      }
    }

    const toLeft = clampBox({
      ...box,
      left: blocker.left - box.width - OVERLAY_GAP,
    });
    if (!obstacles.some((o) => boxesOverlap(toLeft, o))) {
      box = toLeft;
      continue;
    }

    const toRight = clampBox({
      ...box,
      left: blocker.left + blocker.width + OVERLAY_GAP,
    });
    if (!obstacles.some((o) => boxesOverlap(toRight, o))) {
      box = toRight;
      continue;
    }

    if (box.top + 12 <= maxDown) {
      box = clampBox({ ...box, top: box.top + 12 });
    } else {
      break;
    }
  }

  return box;
}

/** Base-camp marker geometry, mirroring ModuleStartMarker's own position/size. */
const BASE_MARKER_BOX: BoxRect = { left: 156, top: 366, width: 46, height: 46 };
/** StageNode renders at `size-10`. */
const STAGE_MARKER_SIZE = 40;

/**
 * Hit-box of the marker a callout belongs to. Callouts have to treat every
 * marker as an obstacle — otherwise a box lands on top of the very circle it
 * is describing, which is both a visual collision and makes the callout's
 * owning step ambiguous.
 */
function getMarkerBox(
  index: CalloutIndex,
  stageNodes: readonly AscentStageNodeEntry[],
): BoxRect | null {
  if (index === 0) return BASE_MARKER_BOX;
  const node = stageNodes[index - 1];
  if (!node) return null;
  return {
    left: node.left,
    top: node.top,
    width: STAGE_MARKER_SIZE,
    height: STAGE_MARKER_SIZE,
  };
}

/** Total area by which a box intrudes on the obstacles it hits. */
function overlapArea(box: BoxRect, obstacles: BoxRect[]): number {
  return obstacles.reduce((sum, o) => {
    const ox = Math.min(box.left + box.width, o.left + o.width) - Math.max(box.left, o.left);
    const oy = Math.min(box.top + box.height, o.top + o.height) - Math.max(box.top, o.top);
    return ox > 0 && oy > 0 ? sum + ox * oy : sum;
  }, 0);
}

/**
 * Place a callout in a ring of candidate slots around its own marker, taking
 * the first that clears every obstacle.
 *
 * The previous approach nudged a hand-tuned start position 12px at a time and
 * gave up after 64 tries, which for the taller callouts meant returning a box
 * still sitting on a marker. Searching discrete slots around the marker instead
 * both guarantees the callout reads as belonging to that marker and copes with
 * quote text of any length. Falls back to the least-overlapping candidate so a
 * genuinely impossible case degrades gracefully rather than landing on a circle.
 */
function placeCalloutNearMarker(
  desired: BoxRect,
  marker: BoxRect,
  obstacles: BoxRect[],
): BoxRect {
  const GAP = 22;
  const mx = marker.left + marker.width / 2;
  const my = marker.top + marker.height / 2;
  const w = desired.width;
  const h = desired.height;
  const above = marker.top - h - GAP;
  const below = marker.top + marker.height + GAP;
  const leftOf = marker.left - w - GAP;
  const rightOf = marker.left + marker.width + GAP;
  const centreX = mx - w / 2;
  const centreY = my - h / 2;

  const candidates: BoxRect[] = [
    { left: centreX, top: above, width: w, height: h },
    { left: leftOf, top: above, width: w, height: h },
    { left: rightOf, top: above, width: w, height: h },
    { left: leftOf, top: centreY, width: w, height: h },
    { left: rightOf, top: centreY, width: w, height: h },
    { left: centreX, top: below, width: w, height: h },
    { left: leftOf, top: below, width: w, height: h },
    { left: rightOf, top: below, width: w, height: h },
    { left: leftOf, top: ARTBOARD_SAFE.top, width: w, height: h },
    { left: rightOf, top: ARTBOARD_SAFE.top, width: w, height: h },
  ].map(clampBox);

  for (const candidate of candidates) {
    if (!obstacles.some((o) => boxesOverlap(candidate, o))) return candidate;
  }

  let best = candidates[0];
  let bestArea = Number.POSITIVE_INFINITY;
  for (const candidate of candidates) {
    const area = overlapArea(candidate, obstacles);
    if (area < bestArea) {
      bestArea = area;
      best = candidate;
    }
  }
  return best;
}

/** Resolve non-overlapping boxes for every open callout (labels and markers are fixed obstacles). */
function resolveOpenCalloutLayout(
  callouts: readonly AscentCalloutEntry[],
  stageTitleLabels: readonly AscentStageTitleEntry[],
  openCallouts: ReadonlySet<CalloutIndex>,
  stageNodes: readonly AscentStageNodeEntry[],
): Map<CalloutIndex, BoxRect> {
  const layout = new Map<CalloutIndex, BoxRect>();
  const obstacles: BoxRect[] = [];

  // Every marker is an obstacle, not just the open ones — a callout must never
  // cover any circle on the path.
  for (let i = 0 as CalloutIndex; i <= 6; i = (i + 1) as CalloutIndex) {
    const markerBox = getMarkerBox(i, stageNodes);
    if (markerBox) obstacles.push(markerBox);
  }

  openCallouts.forEach((index) => {
    const label = stageTitleLabels[index];
    const callout = callouts[index];
    if (label && callout) {
      obstacles.push(getTitleLabelBox(label, callout));
    }
  });

  [...openCallouts].sort((a, b) => a - b).forEach((index) => {
    const callout = callouts[index];
    if (!callout) return;

    const desired: BoxRect = {
      left: callout.left,
      top: callout.top,
      width: callout.width,
      height: estimateCalloutHeight(callout.quote, callout.width),
    };
    const marker = getMarkerBox(index, stageNodes);
    const resolved = marker
      ? placeCalloutNearMarker(desired, marker, obstacles)
      : resolveCalloutBox(desired, obstacles);

    layout.set(index, resolved);
    obstacles.push(resolved);
  });

  return layout;
}

/** Rough title-pill height — wraps on long stage names (e.g. Closure & AI Reinforcement). */
function estimateTitleLabelHeight(title: string, width: number): number {
  const charsPerLine = Math.max(8, Math.floor(Math.max(width - 8, 60) / 5.8));
  const lines = Math.ceil(title.length / charsPerLine);
  return 12 + lines * 14;
}

/** Nudge the continue CTA down/right until it clears open callouts and title pills. */
function resolveCtaBox(desired: BoxRect, obstacles: BoxRect[]): BoxRect {
  let box = clampBox(desired);

  for (let attempt = 0; attempt < 48; attempt++) {
    const blocker = obstacles.find((o) => boxesOverlap(box, o));
    if (!blocker) return box;

    const below = clampBox({
      ...box,
      top: blocker.top + blocker.height + OVERLAY_GAP,
    });
    if (!obstacles.some((o) => boxesOverlap(below, o))) {
      box = below;
      continue;
    }

    const toRight = clampBox({
      ...box,
      left: blocker.left + blocker.width + OVERLAY_GAP,
    });
    if (!obstacles.some((o) => boxesOverlap(toRight, o))) {
      box = toRight;
      continue;
    }

    box = clampBox({ ...box, top: box.top + 12 });
  }

  return box;
}

const CTA_MARKER_GAP = 10;
const CTA_MAX_WIDTH = 212;
const CTA_MIN_HEIGHT = STAGE_MARKER_SIZE;
const CTA_H_PAD = 16;
const CTA_V_PAD = 8;
const CTA_FONT_SIZE = 12;
const CTA_CHAR_WIDTH = 7.35;
const CTA_LINE_HEIGHT = 15;

function estimateCtaDimensions(label: string): { width: number; height: number } {
  const text = label.toUpperCase();
  const width = CTA_MAX_WIDTH;
  const innerWidth = width - CTA_H_PAD * 2 - 18;
  const charsPerLine = Math.max(10, Math.floor(innerWidth / CTA_CHAR_WIDTH));
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
  const height = Math.max(CTA_MIN_HEIGHT, CTA_V_PAD * 2 + lines * CTA_LINE_HEIGHT);
  return { width, height };
}

/** Place continue CTA beside the next marker on one horizontal row. */
function resolveInlineCtaBox(
  marker: BoxRect,
  ctaWidth: number,
  ctaHeight: number,
  obstacles: BoxRect[],
): BoxRect {
  const rowTop = marker.top + (marker.height - ctaHeight) / 2;
  const baseLeft = marker.left + marker.width + CTA_MARKER_GAP;

  for (let dx = 0; dx <= 240; dx += 12) {
    const candidate = clampBox({
      left: baseLeft + dx,
      top: rowTop,
      width: ctaWidth,
      height: ctaHeight,
    });
    if (!obstacles.some((o) => boxesOverlap(candidate, o))) {
      return candidate;
    }
  }

  const leftOfMarker = clampBox({
    left: marker.left - CTA_MARKER_GAP - ctaWidth,
    top: rowTop,
    width: ctaWidth,
    height: ctaHeight,
  });
  if (!obstacles.some((o) => boxesOverlap(leftOfMarker, o))) {
    return leftOfMarker;
  }

  return resolveCtaBox(
    {
      left: marker.left,
      top: marker.top + marker.height + OVERLAY_GAP,
      width: ctaWidth,
      height: ctaHeight,
    },
    obstacles,
  );
}

/**
 * Title labels sit below each marker and share the callout's left edge + width
 * so they stay horizontally aligned with that stage's thought-bubble callout.
 */
const STAGE_TITLE_LABELS = [
  { title: "Base Camp", markerTop: 366, markerSize: 46, calloutIndex: 0 },
  { title: "Laying the Foundation", markerTop: 295, markerSize: 40, calloutIndex: 1 },
  { title: "Discovering Opportunities", markerTop: 260, markerSize: 40, calloutIndex: 2 },
  { title: "Building Solutions", markerTop: 240, markerSize: 40, calloutIndex: 3 },
  { title: "Embedding Confidence", markerTop: 227, markerSize: 40, calloutIndex: 4, labelLeft: 978, labelWidth: 120 },
  { title: "Embedding Confidence", markerTop: 202, markerSize: 40, calloutIndex: 5, labelLeft: 1132, labelTop: 250, labelWidth: 105 },
  { title: "Peak Performance", markerTop: 94, markerSize: 40, calloutIndex: 6, labelLeft: 1310, labelTop: 152, labelWidth: 105 },
] as const;

/** null = hidden; 0 = module 1.1 callout … 6 = summit callout. */
type CalloutIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AscentCalloutEntry = { left: number; top: number; width: number; quote: string; rounded?: number };
export type AscentStageNodeEntry = { left: number; top: number; icon: string; alt: string };
export type AscentStageTitleEntry = {
  title: string;
  markerTop: number;
  markerSize: number;
  calloutIndex: CalloutIndex;
  /** Override pill left — keeps crowded summit labels off the path. */
  labelLeft?: number;
  labelTop?: number;
  labelWidth?: number;
};

function getTitleLabelBox(label: AscentStageTitleEntry, callout: AscentCalloutEntry): BoxRect {
  const width = label.labelWidth ?? callout.width;
  const left = label.labelLeft ?? callout.left;
  const top = label.labelTop ?? label.markerTop + label.markerSize + TITLE_LABEL_GAP;
  return clampBox({
    left,
    top,
    width,
    height: estimateTitleLabelHeight(label.title, width),
  });
}

function buildOpenOverlayObstacles(
  callouts: readonly AscentCalloutEntry[],
  stageTitleLabels: readonly AscentStageTitleEntry[],
  openCallouts: ReadonlySet<CalloutIndex>,
  calloutLayout?: Map<CalloutIndex, BoxRect>,
): BoxRect[] {
  const obstacles: BoxRect[] = [];

  openCallouts.forEach((index) => {
    const callout = callouts[index];
    if (!callout) return;

    const resolved = calloutLayout?.get(index);
    obstacles.push(
      resolved ??
        clampBox({
          left: callout.left,
          top: callout.top,
          width: callout.width,
          height: estimateCalloutHeight(callout.quote, callout.width),
        }),
    );

    const label = stageTitleLabels[index];
    if (!label) return;

    obstacles.push(getTitleLabelBox(label, callout));
  });

  return obstacles;
}

export type AscentOverrides = {
  callouts?: readonly AscentCalloutEntry[];
  stageNodes?: readonly AscentStageNodeEntry[];
  stageTitleLabels?: readonly AscentStageTitleEntry[];
  /** Open all callouts by default and show full path glow */
  defaultAllOpen?: boolean;
  /**
   * Callout indices open on first render (0 = module 1.1 … 6 = summit).
   * Drives path progress + banner milestones. Ignored when `defaultAllOpen`.
   */
  defaultOpenCallouts?: readonly CalloutIndex[];
  /** CTA button rendered below the last stage marker */
  lastNodeCtaLabel?: string;
  onLastNodeCta?: () => void;
  /**
   * Primary continue CTA on the *next* trek step (first unopened stage).
   * When the path is complete, sits under the summit instead.
   * Prefer this over the old footer WhatsNext pattern.
   */
  nextStepCtaLabel?: string;
  onNextStepCta?: () => void;
  /**
   * When set, the module 1.1 start marker also advances the learner — same job as module
   * footer WhatsNext buttons (e.g. continue to 1.2 / 1.3).
   * Prefer `onNextStepCta` on the next trek marker instead.
   */
  onBaseCampCta?: () => void;
  /**
   * Module-end trek progress — furthest reached callout (0 = module 1.1 … 6 = summit).
   * When set, only the immediately next marker stays prominent; all later markers are subdued.
   */
  progressThrough?: CalloutIndex;
};

/** Marker at callout index i is reached when activeProgress >= i + 1. */
function getNextCalloutIndex(activeProgress: ProgressLevel): CalloutIndex | null {
  if (activeProgress >= DEFAULT_PROGRESS) return null;
  return activeProgress as CalloutIndex;
}

type MarkerProgressState = {
  isActive: boolean;
  isReached: boolean;
  isNext: boolean;
  isSubdued: boolean;
};

/** Trek marker visuals — module progress uses fixed curriculum position; hub uses live toggle state. */
function getMarkerProgressState(
  calloutIndex: CalloutIndex,
  progressThrough: CalloutIndex | undefined,
  activeProgress: ProgressLevel,
  nextCalloutIndex: CalloutIndex | null,
  openCallouts: ReadonlySet<CalloutIndex>,
): MarkerProgressState {
  const isActive = openCallouts.has(calloutIndex);

  if (progressThrough !== undefined) {
    return {
      isActive,
      isReached: calloutIndex <= progressThrough,
      isNext: calloutIndex === progressThrough + 1,
      isSubdued: calloutIndex > progressThrough + 1,
    };
  }

  return {
    isActive,
    isReached: activeProgress >= ((calloutIndex + 1) as ProgressLevel),
    isNext: nextCalloutIndex === calloutIndex,
    isSubdued: false,
  };
}

type MarkerVisualInput = {
  isActive: boolean;
  isReached: boolean;
  isHovered: boolean;
  isNext: boolean;
  isSubdued: boolean;
};

type MarkerVisualStyles = {
  background: string;
  borderColor: string;
  boxShadow: string;
  transform: string;
};

/** Computes marker button visuals for default, hover, active, visited, next, and subdued states. */
function getMarkerVisualStyles({
  isActive,
  isReached,
  isHovered,
  isNext,
  isSubdued,
}: MarkerVisualInput): MarkerVisualStyles {
  if (isSubdued) {
    return {
      background: colors.confidentBlack,
      borderColor: colors.borderOnDark,
      boxShadow: "none",
      transform: "scale(1)",
    };
  }

  let background: string = colors.confidentBlack;
  const borderColor = colors.yellow;
  let boxShadow = "0px 0px 6px 0px rgba(255, 230, 0, 0.25)";
  let transform = "scale(1)";

  if (isNext && !isActive) {
    boxShadow = "0px 0px 8px 0px rgba(255, 230, 0, 0.32)";
  }

  if (isReached && !isActive) {
    background = colors.yellowAlpha10;
    boxShadow =
      "0px 0px 8px 0px rgba(255, 230, 0, 0.4), 0px 0px 16px 0px rgba(255, 230, 0, 0.22)";
  }

  if (isActive) {
    background = colors.yellowAlpha12;
    boxShadow =
      "0px 0px 12px 0px rgba(255, 230, 0, 0.65), 0px 0px 24px 0px rgba(255, 230, 0, 0.45), 0px 0px 40px 0px rgba(255, 230, 0, 0.2)";
    transform = "scale(1.06)";
  }

  if (isHovered && !isActive) {
    background = isReached ? colors.yellowAlpha10 : colors.surfaceOnDark;
    boxShadow = isReached
      ? "0px 0px 10px 0px rgba(255, 230, 0, 0.5), 0px 0px 22px 0px rgba(255, 230, 0, 0.35)"
      : "0px 0px 10px 0px rgba(255, 230, 0, 0.45), 0px 0px 18px 0px rgba(255, 230, 0, 0.28)";
  }

  if (isHovered && isActive) {
    boxShadow =
      "0px 0px 14px 0px rgba(255, 230, 0, 0.72), 0px 0px 28px 0px rgba(255, 230, 0, 0.52), 0px 0px 44px 0px rgba(255, 230, 0, 0.24)";
    transform = "scale(1.08)";
  }

  return { background, borderColor, boxShadow, transform };
}

function JourneyMarkerButton({
  shapeClassName,
  positionStyle,
  isActive,
  isReached,
  isNext,
  isSubdued,
  onClick,
  ariaLabel,
  children,
}: {
  shapeClassName: string;
  positionStyle: CSSProperties;
  isActive: boolean;
  isReached: boolean;
  isNext: boolean;
  isSubdued: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const visual = getMarkerVisualStyles({
    isActive,
    isReached,
    isHovered: isSubdued ? false : isHovered,
    isNext,
    isSubdued,
  });
  const showNextPulse = isNext && !isActive && !isSubdued;

  return (
    <button
      type="button"
      onClick={isSubdued ? undefined : onClick}
      disabled={isSubdued}
      aria-label={ariaLabel}
      aria-expanded={isActive}
      aria-disabled={isSubdued || undefined}
      data-active={isActive || undefined}
      data-reached={isReached || undefined}
      data-next={showNextPulse || undefined}
      data-subdued={isSubdued || undefined}
      onMouseEnter={() => {
        if (!isSubdued) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute flex items-center justify-center border-2 border-solid transition-[background-color,border-color,box-shadow,transform,opacity] duration-[650ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isSubdued ? "cursor-default" : "cursor-pointer"} ${shapeClassName}`}
      style={{
        ...positionStyle,
        background: visual.background,
        borderColor: visual.borderColor,
        outlineColor: colors.yellow,
        boxShadow: visual.boxShadow,
        transform: visual.transform,
        opacity: isSubdued ? 0.38 : 1,
        zIndex: isSubdued ? 5 : 10,
      }}
    >
      {showNextPulse ? (
        <span className="ascent-marker-next-pulse absolute inset-0 rounded-[inherit]" aria-hidden />
      ) : null}
      {children}
      {isReached && !isActive ? (
        <span
          className="absolute bottom-1 right-1 size-1.5 rounded-full"
          style={{ background: colors.yellow, boxShadow: "0 0 6px rgba(255, 230, 0, 0.55)" }}
          aria-hidden
        />
      ) : null}
    </button>
  );
}

function CalloutBox({
  quote,
  width,
  rounded = 12,
}: {
  quote: string;
  width: number;
  rounded?: number;
}) {
  return (
    <div
      className="flex flex-col gap-1 p-3 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)]"
      style={{
        width,
        background: "rgba(26, 26, 36, 0.8)",
        border: `1px solid ${colors.yellowAlpha12}`,
        borderRadius: rounded,
      }}
    >
      <p
        className="shrink-0 whitespace-nowrap text-[18px] leading-[14px]"
        style={{ fontFamily: fonts.bold, color: colors.yellow }}
      >
        "
      </p>
      <p
        className="min-w-full text-[11px] leading-[15px]"
        style={{ fontFamily: fonts.regular, color: colors.white }}
      >
        {quote}
      </p>
    </div>
  );
}

/** Title box below a journey marker — visible only while its callout is open. */
function StageTitleLabel({
  title,
  left,
  top,
  width,
  isActive,
  isReached,
}: {
  title: string;
  left: number;
  top: number;
  width: number;
  isActive: boolean;
  isReached: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute py-1.5 transition-[background-color,border-color,box-shadow] duration-[650ms] ease-out"
      style={{
        left,
        top,
        width,
        paddingLeft: 4,
        paddingRight: 4,
        zIndex: 10,
        background: colors.confidentBlack,
        border: `1px solid ${colors.yellow}`,
        borderRadius: 4,
        boxShadow: isActive
          ? "0px 0px 8px 0px rgba(255, 230, 0, 0.35)"
          : isReached
            ? "0px 0px 4px 0px rgba(255, 230, 0, 0.2)"
            : undefined,
      }}
      aria-hidden
    >
      <p
        className="text-center text-[10px] uppercase leading-[14px]"
        style={{
          fontFamily: fonts.bold,
          color: colors.yellow,
        }}
      >
        {title}
      </p>
    </div>
  );
}

function ModuleStartMarker({
  isActive,
  isReached,
  isNext,
  isSubdued,
  onClick,
  advancesJourney,
}: {
  isActive: boolean;
  isReached: boolean;
  isNext: boolean;
  isSubdued: boolean;
  onClick: () => void;
  advancesJourney?: boolean;
}) {
  return (
    <JourneyMarkerButton
      shapeClassName="size-[46px] rounded-full"
      positionStyle={{ left: 156, top: 366 }}
      isActive={isActive}
      isReached={isReached}
      isNext={isNext}
      isSubdued={isSubdued}
      onClick={onClick}
      ariaLabel={
        advancesJourney
          ? "Base Camp — continue to the next module"
          : "Base Camp — start of journey"
      }
    >
      <div
        className="relative size-[18px] shrink-0 overflow-clip"
        style={{ opacity: isSubdued ? 0.55 : 1 }}
        aria-hidden
      >
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSET.iconBookOpen} />
      </div>
    </JourneyMarkerButton>
  );
}

function StageNode({
  left,
  top,
  icon,
  alt,
  isActive,
  isReached,
  isNext,
  isSubdued,
  onClick,
}: {
  left: number;
  top: number;
  icon: string;
  alt: string;
  isActive: boolean;
  isReached: boolean;
  isNext: boolean;
  isSubdued: boolean;
  onClick: () => void;
}) {
  return (
    <JourneyMarkerButton
      shapeClassName="size-10 rounded-[20px]"
      positionStyle={{ left, top }}
      isActive={isActive}
      isReached={isReached}
      isNext={isNext}
      isSubdued={isSubdued}
      onClick={onClick}
      ariaLabel={alt}
    >
      <div
        className="relative size-[18px] shrink-0 overflow-clip"
        style={{ opacity: isSubdued ? 0.55 : 1 }}
        aria-hidden
      >
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={icon} />
      </div>
    </JourneyMarkerButton>
  );
}

function HeaderTitleBlock() {
  return (
    <div
      className="absolute flex flex-col gap-4"
      style={{ left: 24, top: 32, width: 360 }}
      data-name="Header Title Block"
      data-node-id="3743:16959"
    >
      <div className="flex w-full flex-col gap-2" data-name="Title Text">
        <p
          className="min-w-full text-[28px] leading-[34px]"
          style={{ fontFamily: fonts.bold, color: colors.white }}
        >
          Your journey from <span style={{ color: colors.yellow }}>curiosity</span> to{" "}
          <span style={{ color: colors.yellow }}>confidence</span>.
        </p>
        <div className="relative h-[3px] w-10 shrink-0 overflow-clip">
          <img alt="" className="block size-full max-w-none" src={ASSET.accentLine} />
        </div>
      </div>
    </div>
  );
}

/** Figma node 3811:4139 — dashed ascending path with progressive yellow reveal. */
function JourneyPath({ progressLevel }: { progressLevel: ProgressLevel }) {
  const uid = useId().replace(/:/g, "");
  const glowFilterId = `${uid}-glow`;
  const revealMaskId = `${uid}-reveal`;
  const measureRef = useRef<SVGPathElement>(null);
  const [pathMetrics, setPathMetrics] = useState<{ total: number; stops: number[] } | null>(null);

  useLayoutEffect(() => {
    const path = measureRef.current;
    if (!path) return;

    const total = path.getTotalLength();
    const stops = PROGRESS_MARKER_CENTERS.map(({ x, y }) => {
      const { x: vx, y: vy } = artboardToViewBox(x, y);
      return closestPathLength(path, vx, vy);
    });

    // Ensure stops are monotonically increasing along the path.
    for (let i = 1; i < stops.length; i++) {
      stops[i] = Math.max(stops[i], stops[i - 1]);
    }

    setPathMetrics({ total, stops });
  }, []);

  const totalLength = pathMetrics?.total ?? 0;
  const revealedLength = Math.min(getLitLength(progressLevel, pathMetrics), totalLength);

  // The visible stroke carries the decorative "6 6" dashes, so its own dashoffset
  // could only slide that pattern along — it cannot clip the path. The reveal is
  // driven instead by a solid stroke inside a mask whose dasharray is the whole
  // path length. Keeping that dasharray CONSTANT and animating only the offset
  // makes the lit edge grow and recoil smoothly along the path.
  const maskDashArray = totalLength || 1;
  const maskDashOffset = maskDashArray - revealedLength;

  return (
    <div
      className="absolute"
      style={{
        left: JOURNEY_PATH_LAYOUT.left,
        top: JOURNEY_PATH_LAYOUT.top,
        width: JOURNEY_PATH_LAYOUT.width,
        height: JOURNEY_PATH_LAYOUT.height,
        zIndex: 1,
        isolation: "isolate",
      }}
      data-name="journey-path-container"
      data-node-id="3811:4139"
    >
      <svg
        id="journey-path"
        data-name="journey-path"
        className="absolute block overflow-visible inset-[-52.56%_-14.42%_-52.85%_-14.34%]"
        style={{ pointerEvents: "none" }}
        viewBox={JOURNEY_PATH_LAYOUT.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <filter
            id={glowFilterId}
            x="0"
            y="0"
            width="1351.43"
            height="588.501"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="effect1_dropShadow" />
            <feOffset />
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.901961 0 0 0 0 0 0 0 0 0.95 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect2_dropShadow" />
            <feOffset />
            <feGaussianBlur stdDeviation="8" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.901961 0 0 0 0 0 0 0 0 0.9 0" />
            <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology radius="6" operator="dilate" in="SourceAlpha" result="effect3_dropShadow" />
            <feOffset />
            <feGaussianBlur stdDeviation="20" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.901961 0 0 0 0 0 0 0 0 0.6 0" />
            <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology radius="8" operator="dilate" in="SourceAlpha" result="effect4_dropShadow" />
            <feOffset />
            <feGaussianBlur stdDeviation="40" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.901961 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="effect3_dropShadow" result="effect4_dropShadow" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology radius="10" operator="dilate" in="SourceAlpha" result="effect5_dropShadow" />
            <feOffset />
            <feGaussianBlur stdDeviation="70" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.901961 0 0 0 0 0 0 0 0 0.12 0" />
            <feBlend mode="normal" in2="effect4_dropShadow" result="effect5_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect5_dropShadow" result="shape" />
          </filter>

          {/*
            Progressive reveal wipe. One solid dash the length of the whole path;
            sliding its offset uncovers the yellow stroke up to the selected
            marker. Stroke is wider than the 3px path so the dashes are never
            clipped along their edges, and butt caps keep the leading edge a
            clean vertical wipe rather than a rounded bulge.
          */}
          <mask id={revealMaskId} maskUnits="userSpaceOnUse">
            <path
              d={JOURNEY_PATH_D}
              fill="none"
              stroke="#fff"
              strokeWidth={24}
              strokeLinecap="butt"
              strokeDasharray={maskDashArray}
              strokeDashoffset={maskDashOffset}
              style={{ transition: `stroke-dashoffset ${PATH_REVEAL_MS}ms ease` }}
            />
          </mask>
        </defs>

        {/* Hidden geometry used to sample marker stops along the path */}
        <path ref={measureRef} d={JOURNEY_PATH_D} fill="none" stroke="none" visibility="hidden" />

        {/* Dim baseline — full path, always drawn; the lit stroke covers it dash-for-dash */}
        <path
          d={JOURNEY_PATH_D}
          fill="none"
          stroke={colors.white}
          strokeOpacity={0.22}
          strokeWidth={3}
          strokeMiterlimit={4.28366}
          strokeDasharray="6 6"
          strokeLinecap="round"
          style={{ pointerEvents: "stroke", cursor: "pointer" }}
          data-name="journey-path-baseline"
        />

        {/* Lit overlay — yellow dashed stroke with glow, wiped in by the reveal mask */}
        <g filter={`url(#${glowFilterId})`}>
          <g mask={`url(#${revealMaskId})`}>
            <path
              id="journey-path-stroke"
              data-name="journey-path-stroke"
              d={JOURNEY_PATH_D}
              fill="none"
              stroke={colors.yellow}
              strokeWidth={3}
              strokeMiterlimit={4.28366}
              strokeDasharray="6 6"
              strokeLinecap="round"
              style={{ pointerEvents: "stroke", cursor: "pointer" }}
            />
          </g>
        </g>

        {/* Wide invisible hit target — keeps glow path selectable without blocking markers */}
        <path
          d={JOURNEY_PATH_D}
          fill="none"
          stroke="transparent"
          strokeWidth={16}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: "stroke", cursor: "pointer" }}
          data-name="journey-path-hit"
        />
      </svg>
    </div>
  );
}

const BANNER_MILESTONES = [
  { phrase: "From uncertainty to impact", revealAt: 2 as ProgressLevel },
  { phrase: "From learning to leading", revealAt: 5 as ProgressLevel },
  {
    phrase: "From user to AI-enabled tax professional",
    revealAt: 7 as ProgressLevel,
  },
] as const;

const milestonePhraseStyle: CSSProperties = {
  fontFamily: fonts.regular,
  fontSize: typeScale.subheading.size,
  fontWeight: typeScale.subheading.weight,
  letterSpacing: typeScale.subheading.tracking,
  textTransform: "none",
  color: colors.yellow,
  margin: 0,
  lineHeight: 1.45,
};

function MilestoneBox({
  phrase,
  isRevealed,
  summitPulse,
}: {
  phrase: string;
  isRevealed: boolean;
  summitPulse: boolean;
}) {
  return (
    <div
      className={`relative flex min-h-[52px] flex-1 flex-col justify-center ${summitPulse ? "ascent-banner-summit-pulse" : ""}`}
      style={{
        minWidth: 0,
        padding: "14px 20px",
        background: colors.eyBgCard,
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${isRevealed ? "rgba(255,230,0,0.45)" : "rgba(255,255,255,0.18)"}`,
        boxShadow: isRevealed
          ? "0 6px 20px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 4px 14px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: `border-color ${PATH_REVEAL_MS}ms ease, box-shadow ${PATH_REVEAL_MS}ms ease`,
      }}
    >
      <div
        className="absolute left-0 top-0 h-[3px] w-full"
        style={{ background: isRevealed ? colors.yellow : "rgba(255,255,255,0.22)" }}
        aria-hidden
      />
      <p style={milestonePhraseStyle}>{phrase}</p>
      <div
        className="absolute bottom-0 left-0 h-0.5"
        style={{
          background: colors.yellow,
          width: isRevealed ? "100%" : "0%",
          transition: `width ${PATH_REVEAL_MS}ms ease`,
        }}
        aria-hidden
      />
    </div>
  );
}

function BottomBanner({ activeProgress }: { activeProgress: ProgressLevel }) {
  return (
    <div
      className="absolute left-0 flex w-full items-center px-6"
      style={{
        top: BANNER_TOP,
        height: BANNER_HEIGHT,
      }}
      data-name="bottom-banner"
    >
      <div className="flex w-full items-stretch gap-5">
        {BANNER_MILESTONES.map((milestone, index) => (
          <MilestoneBox
            key={milestone.phrase}
            phrase={milestone.phrase}
            isRevealed={activeProgress >= milestone.revealAt}
            summitPulse={index === 2 && activeProgress >= DEFAULT_PROGRESS}
          />
        ))}
      </div>
    </div>
  );
}

function AscentCanvas({
  callouts: calloutsOverride,
  stageNodes: stageNodesOverride,
  stageTitleLabels: stageTitleLabelsOverride,
  defaultAllOpen,
  defaultOpenCallouts,
  lastNodeCtaLabel,
  onLastNodeCta,
  nextStepCtaLabel,
  onNextStepCta,
  onBaseCampCta,
  progressThrough,
}: AscentOverrides = {}) {
  const callouts = calloutsOverride ?? CALLOUTS;
  const stageNodes = stageNodesOverride ?? STAGE_NODES;
  const stageTitleLabels = stageTitleLabelsOverride ?? STAGE_TITLE_LABELS;
  /** Every marker the user has opened. Callouts persist until clicked again. */
  const [openCallouts, setOpenCallouts] = useState<ReadonlySet<CalloutIndex>>(
    () => {
      if (defaultAllOpen) return new Set<CalloutIndex>([0, 1, 2, 3, 4, 5, 6]);
      if (defaultOpenCallouts && defaultOpenCallouts.length > 0) {
        return new Set<CalloutIndex>(defaultOpenCallouts);
      }
      return new Set<CalloutIndex>([0]);
    },
  );

  /**
   * Accordion: opening a marker closes the others. With all seven open the
   * callouts crowded each other and it stopped being clear which box belonged
   * to which step, so only one stays open at a time. Clicking the open marker
   * again collapses it.
   */
  const toggleCallout = (calloutIndex: CalloutIndex) => {
    setOpenCallouts((prev) =>
      prev.has(calloutIndex) && prev.size === 1
        ? new Set<CalloutIndex>()
        : new Set<CalloutIndex>([calloutIndex]),
    );
  };

  // The glow reaches as far as the furthest marker still open, so closing the
  // leading marker recoils the path back to the one before it.
  const activeProgress: ProgressLevel =
    openCallouts.size === 0
      ? 0
      : ((Math.max(...openCallouts) + 1) as ProgressLevel);

  const nextCalloutIndex = getNextCalloutIndex(activeProgress);
  const moduleNextCalloutIndex =
    progressThrough !== undefined && progressThrough < 6
      ? ((progressThrough + 1) as CalloutIndex)
      : null;
  const ctaTargetCalloutIndex =
    progressThrough !== undefined ? moduleNextCalloutIndex : nextCalloutIndex;

  const openCalloutLayout = useMemo(
    () => resolveOpenCalloutLayout(callouts, stageTitleLabels, openCallouts, stageNodes),
    [callouts, stageTitleLabels, openCallouts, stageNodes],
  );

  /**
   * Leader lines: an elbow from each open callout to its own marker, so the
   * pairing is explicit rather than inferred from proximity.
   */
  const leaderLines = useMemo(() => {
    const lines: {
      index: CalloutIndex;
      path: string;
      endX: number;
      endY: number;
    }[] = [];
    openCalloutLayout.forEach((box, index) => {
      const marker = getMarkerBox(index, stageNodes);
      if (!marker) return;
      const mx = marker.left + marker.width / 2;
      const my = marker.top + marker.height / 2;
      const boxCx = box.left + box.width / 2;
      // Leave from whichever edge faces the marker, so the line never crosses
      // back over the callout it came from.
      const startX = mx < box.left ? box.left : mx > box.left + box.width ? box.left + box.width : boxCx;
      const startY = my < box.top ? box.top : my > box.top + box.height ? box.top + box.height : box.top + box.height;
      const midY = startY + (my - startY) / 2;
      lines.push({
        index,
        path: `M ${startX} ${startY} L ${startX} ${midY} L ${mx} ${midY} L ${mx} ${my}`,
        endX: mx,
        endY: my,
      });
    });
    return lines;
  }, [openCalloutLayout, stageNodes]);

  const baseCampState = getMarkerProgressState(
    0,
    progressThrough,
    activeProgress,
    nextCalloutIndex,
    openCallouts,
  );

  return (
    <div
      className="relative size-full"
      style={{ background: colors.confidentBlack }}
      data-name="the-ascent-journey-infographic"
      data-node-id="3743:16946"
    >
      <style>{`
        @keyframes ascent-marker-next-glow {
          0%, 100% {
            box-shadow:
              0 0 8px 2px rgba(255, 230, 0, 0.28),
              0 0 18px 4px rgba(255, 230, 0, 0.14);
            opacity: 0.65;
          }
          50% {
            box-shadow:
              0 0 14px 4px rgba(255, 230, 0, 0.55),
              0 0 28px 8px rgba(255, 230, 0, 0.32),
              0 0 44px 12px rgba(255, 230, 0, 0.14);
            opacity: 1;
          }
        }
        .ascent-marker-next-pulse {
          pointer-events: none;
          animation: ascent-marker-next-glow 2s ease-in-out infinite;
        }
        @keyframes ascent-banner-summit-pulse {
          0% {
            border-color: ${colors.yellowAlpha12};
            box-shadow: 0 0 0 0 rgba(255, 230, 0, 0);
          }
          50% {
            border-color: ${colors.yellow};
            box-shadow: 0 0 10px 2px rgba(255, 230, 0, 0.4);
          }
          100% {
            border-color: ${colors.yellowAlpha12};
            box-shadow: 0 0 0 0 rgba(255, 230, 0, 0);
          }
        }
        .ascent-banner-summit-pulse {
          animation: ascent-banner-summit-pulse 250ms ease-out;
        }
      `}</style>
      {/* Mountain photograph — hiker + sunset baked into clean-background.png */}
      <div className="absolute left-0 top-0 w-full overflow-clip" style={{ height: BANNER_TOP }}>
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-center"
          src={ASSET.cleanBackground}
        />
      </div>

      <HeaderTitleBlock />
      <JourneyPath progressLevel={activeProgress} />

      {/* Summit flag — anchored to Phase 4 node center */}
      <div className="absolute left-[1221px]" style={{ top: 40 }}>
        <img alt="" className="block h-16 w-auto" src={ASSET.flag} />
      </div>

      {/* Thought-bubble callouts — every opened marker stays visible */}
      {callouts.map((callout, index) => {
        if (!openCallouts.has(index as CalloutIndex)) return null;

        const resolved = openCalloutLayout.get(index as CalloutIndex);
        const left = resolved?.left ?? clampBoxLeft(callout.left, callout.width);
        const top =
          resolved?.top ??
          clampBoxTop(callout.top, estimateCalloutHeight(callout.quote, callout.width));

        return (
          <div
            key={callout.quote}
            className="absolute"
            style={{
              left,
              top,
              zIndex: 10 + index,
            }}
          >
            <CalloutBox
              quote={callout.quote}
              width={callout.width}
              rounded={"rounded" in callout ? callout.rounded : 12}
            />
          </div>
        );
      })}

      {/* Stage title labels — shown below markers only while that callout is open */}
      {stageTitleLabels.map((label) => {
        const { title, calloutIndex } = label;
        if (!openCallouts.has(calloutIndex)) return null;

        const callout = callouts[calloutIndex];
        const progressThreshold = (calloutIndex + 1) as ProgressLevel;
        const labelBox = getTitleLabelBox(label, callout);

        return (
          <StageTitleLabel
            key={`stage-title-${calloutIndex}`}
            title={title}
            left={labelBox.left}
            top={labelBox.top}
            width={labelBox.width}
            isActive={openCallouts.has(calloutIndex)}
            isReached={activeProgress >= progressThreshold}
          />
        );
      })}

      {/* Leader lines — drawn beneath the markers so the circles stay crisp */}
      {leaderLines.length > 0 && (
        <svg
          className="pointer-events-none absolute left-0 top-0"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden
        >
          {leaderLines.map((line) => (
            <g key={`leader-${line.index}`}>
              <path
                d={line.path}
                fill="none"
                stroke="rgba(255,230,0,0.55)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 4"
              />
              <circle cx={line.endX} cy={line.endY} r={2.5} fill="rgba(255,230,0,0.85)" />
            </g>
          ))}
        </svg>
      )}

      <ModuleStartMarker
        isActive={baseCampState.isActive}
        isReached={baseCampState.isReached}
        isNext={baseCampState.isNext}
        isSubdued={baseCampState.isSubdued}
        advancesJourney={Boolean(onBaseCampCta)}
        onClick={() => {
          toggleCallout(0);
          onBaseCampCta?.();
        }}
      />

      {/* Stage icon nodes */}
      {stageNodes.map((node, index) => {
        const calloutIndex = (index + 1) as CalloutIndex;
        const markerState = getMarkerProgressState(
          calloutIndex,
          progressThrough,
          activeProgress,
          nextCalloutIndex,
          openCallouts,
        );

        return (
          <StageNode
            key={`stage-node-${calloutIndex}`}
            {...node}
            isActive={markerState.isActive}
            isReached={markerState.isReached}
            isNext={markerState.isNext}
            isSubdued={markerState.isSubdued}
            onClick={() => toggleCallout(calloutIndex)}
          />
        );
      })}

      {/* Continue CTA inline with the next trek marker */}
      {(() => {
        const ctaLabel = nextStepCtaLabel ?? lastNodeCtaLabel;
        const ctaHandler = onNextStepCta ?? onLastNodeCta;
        if (!ctaLabel || !ctaHandler) return null;

        const targetIndex: CalloutIndex =
          ctaTargetCalloutIndex !== null ? ctaTargetCalloutIndex : 6;
        const markerBox = getMarkerBox(targetIndex, stageNodes);
        if (!markerBox) return null;

        const { width: ctaWidth, height: ctaHeight } = estimateCtaDimensions(ctaLabel);
        const obstacles = buildOpenOverlayObstacles(
          callouts,
          stageTitleLabels,
          openCallouts,
          openCalloutLayout,
        );
        const ctaBox = resolveInlineCtaBox(markerBox, ctaWidth, ctaHeight, obstacles);

        return (
          <>
            <style>{`
              @keyframes ascent-cta-pulse {
                0%, 100% { box-shadow: 0 0 18px 4px rgba(255,230,0,0.55), 0 2px 12px rgba(0,0,0,0.35); }
                50%       { box-shadow: 0 0 36px 10px rgba(255,230,0,0.85), 0 2px 12px rgba(0,0,0,0.35); }
              }
            `}</style>
            <button
              type="button"
              onClick={ctaHandler}
              aria-label={ctaLabel}
              style={{
                position: "absolute",
                left: ctaBox.left,
                top: ctaBox.top,
                width: ctaBox.width,
                height: ctaBox.height,
                zIndex: 20,
                boxSizing: "border-box",
                fontFamily: fonts.bold,
                fontSize: CTA_FONT_SIZE,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: colors.yellow,
                color: colors.confidentBlack,
                border: `2px solid ${colors.yellow}`,
                borderRadius: 32,
                padding: `${CTA_V_PAD}px ${CTA_H_PAD}px`,
                cursor: "pointer",
                animation: "ascent-cta-pulse 2s ease-in-out infinite",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                lineHeight: `${CTA_LINE_HEIGHT}px`,
                textAlign: "center",
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              <span style={{ minWidth: 0, flex: "1 1 auto" }}>{ctaLabel}</span>
              <span
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 16,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
                aria-hidden
              >
                →
              </span>
            </button>
          </>
        );
      })()}

      <BottomBanner activeProgress={activeProgress} />
    </div>
  );
}

export default function AscentJourneyInfographic(overrides: AscentOverrides = {}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={shellRef}
      className="relative w-full overflow-hidden"
      style={{ height: H * scale, background: colors.confidentBlack }}
      data-name="ascent-journey-infographic-viewport"
    >
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: W,
          height: H,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <AscentCanvas {...overrides} />
      </div>
    </div>
  );
}
