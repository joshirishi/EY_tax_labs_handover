/**
 * EY Tax Labs — The Ascent journey infographic (full artboard)
 * Figma node 3743:16946 — header copy, journey path, callouts, stages, banner.
 *
 * Fixed 1536×450 artboard, scales to container width via ResizeObserver.
 */

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { CirclePlay } from "lucide-react";
import { colors, fonts, typeScale } from "@/design-kit";

const W = 1536;
const H = 490;
const BANNER_HEIGHT = 44;
const BANNER_TOP = H - BANNER_HEIGHT;
const BANNER_FONT_SIZE = typeScale.label.size;

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

/** Artboard centers for base camp + 5 stages (button center = left/top + half size). */
const PROGRESS_MARKER_CENTERS = [
  { x: 179, y: 389 }, // base camp (156 + 23, 366 + 23)
  { x: 379, y: 315 }, // stage 1
  { x: 574, y: 280 }, // stage 2
  { x: 789, y: 260 }, // stage 3
  { x: 1038, y: 247 }, // stage 4
  { x: 1241, y: 114 }, // stage 5
] as const;

/** 0 = none (dim baseline only), 1 = base camp, 2–6 = stages 1–5 / full path. */
type ProgressLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Max progress level — full yellow path when user selects summit (level 6). */
const DEFAULT_PROGRESS: ProgressLevel = 6;

const PATH_REVEAL_MS = 650;

/**
 * How much of the path is lit, measured from the start.
 *
 * The reveal is cumulative: selecting a marker extends the glow up to the span
 * that ends at the NEXT marker, so each new selection adds to what is already
 * lit rather than moving it. Deselecting back to an earlier marker shortens
 * this value, and the stroke recoils along the same path.
 *
 *   level 1 (base camp) → stops[1]  (lit through the first span)
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
  { left: 140, top: 250, width: 149, quote: "Everyone is talking about AI, but I don't know where to start." },
  { left: 290, top: 195, width: 187, quote: "AI feels a lot less intimidating now. I finally understand how prompts and Microsoft 365 Copilot work." },
  { left: 502, top: 123, width: 167, quote: "I can clearly see where AI fits across our tax processes. Some use cases need prompts. Others need Agents." },
  { left: 722, top: 106, width: 150, quote: "I never thought I could build an Agent without coding. I'm starting to solve tax problems differently." },
  { left: 953, top: 114, width: 170, quote: "AI has become part of how I work. I rely on it to research, analyze and get work done faster." },
  { left: 1247, top: 8, width: 180, quote: "I am an AI-enabled tax professional. I can confidently and responsibly use AI across the tax lifecycle to deliver greater value.", rounded: 4 },
] as const;

const STAGE_NODES = [
  { left: 359, top: 295, icon: ASSET.iconBookOpen, alt: "Laying the Foundation" },
  { left: 554, top: 260, icon: ASSET.iconSearch, alt: "Discovering Opportunities" },
  { left: 769, top: 240, icon: ASSET.iconCpu, alt: "Building Solutions" },
  { left: 1018, top: 227, icon: ASSET.iconTrendingUp, alt: "Embedding Confidence" },
  { left: 1221, top: 94, icon: ASSET.iconShield, alt: "Peak Performance" },
] as const;

/** Vertical gap between marker button bottom and its title label box. */
const TITLE_LABEL_GAP = 8;

/**
 * Title labels sit below each marker and share the callout's left edge + width
 * so they stay horizontally aligned with that stage's thought-bubble callout.
 */
const STAGE_TITLE_LABELS = [
  { title: "Base Camp", markerTop: 366, markerSize: 46, calloutIndex: 0 },
  { title: "Laying the Foundation", markerTop: 295, markerSize: 40, calloutIndex: 1 },
  { title: "Discovering Opportunities", markerTop: 260, markerSize: 40, calloutIndex: 2 },
  { title: "Building Solutions", markerTop: 240, markerSize: 40, calloutIndex: 3 },
  { title: "Embedding Confidence", markerTop: 227, markerSize: 40, calloutIndex: 4 },
  { title: "Peak Performance", markerTop: 94, markerSize: 40, calloutIndex: 5 },
] as const;

/** null = hidden; 0 = base camp callout … 5 = summit stage callout. */
type CalloutIndex = 0 | 1 | 2 | 3 | 4 | 5;

/** Marker at callout index i is reached when activeProgress >= i + 1. */
function getNextCalloutIndex(activeProgress: ProgressLevel): CalloutIndex | null {
  if (activeProgress >= DEFAULT_PROGRESS) return null;
  return activeProgress as CalloutIndex;
}

type MarkerVisualInput = {
  isActive: boolean;
  isReached: boolean;
  isHovered: boolean;
  isNext: boolean;
};

type MarkerVisualStyles = {
  background: string;
  borderColor: string;
  boxShadow: string;
  transform: string;
};

/** Computes marker button visuals for default, hover, active, and visited states. */
function getMarkerVisualStyles({
  isActive,
  isReached,
  isHovered,
  isNext,
}: MarkerVisualInput): MarkerVisualStyles {
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
  onClick,
  ariaLabel,
  children,
}: {
  shapeClassName: string;
  positionStyle: CSSProperties;
  isActive: boolean;
  isReached: boolean;
  isNext: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const visual = getMarkerVisualStyles({ isActive, isReached, isHovered, isNext });
  const showNextPulse = isNext && !isActive;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isActive}
      data-active={isActive || undefined}
      data-reached={isReached || undefined}
      data-next={showNextPulse || undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute flex cursor-pointer items-center justify-center border-2 border-solid transition-[background-color,border-color,box-shadow,transform] duration-[650ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${shapeClassName}`}
      style={{
        ...positionStyle,
        background: visual.background,
        borderColor: visual.borderColor,
        outlineColor: colors.yellow,
        boxShadow: visual.boxShadow,
        transform: visual.transform,
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

function BaseCampStartMarker({
  isActive,
  isReached,
  isNext,
  onClick,
}: {
  isActive: boolean;
  isReached: boolean;
  isNext: boolean;
  onClick: () => void;
}) {
  return (
    <JourneyMarkerButton
      shapeClassName="size-[46px] rounded-full"
      positionStyle={{ left: 156, top: 366 }}
      isActive={isActive}
      isReached={isReached}
      isNext={isNext}
      onClick={onClick}
      ariaLabel="Base Camp — start of journey"
    >
      <CirclePlay size={22} strokeWidth={1.75} color={colors.yellow} aria-hidden />
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
  onClick,
}: {
  left: number;
  top: number;
  icon: string;
  alt: string;
  isActive: boolean;
  isReached: boolean;
  isNext: boolean;
  onClick: () => void;
}) {
  return (
    <JourneyMarkerButton
      shapeClassName="size-10 rounded-[20px]"
      positionStyle={{ left, top }}
      isActive={isActive}
      isReached={isReached}
      isNext={isNext}
      onClick={onClick}
      ariaLabel={alt}
    >
      <div className="relative size-[18px] shrink-0 overflow-clip" aria-hidden>
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

      <p
        className="min-w-full text-[14px] leading-[20px]"
        style={{ fontFamily: fonts.regular, color: colors.gray02 }}
      >
        Evolving into an AI-enabled tax professional.
      </p>
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

const bannerTextStyle = {
  fontFamily: fonts.bold,
  fontSize: BANNER_FONT_SIZE,
  fontWeight: typeScale.label.weight,
  letterSpacing: typeScale.label.tracking,
  textTransform: "uppercase" as const,
};

const BANNER_PHRASES = [
  "From uncertainty to impact",
  "From learning to leading",
  "From user to AI-enabled tax professional",
] as const;

const bannerBoxStyle: CSSProperties = {
  ...bannerTextStyle,
  color: colors.yellow,
  background: colors.confidentBlack,
  padding: "10px 16px",
  borderRadius: "var(--radius-sm)",
};

function BottomBanner() {
  return (
    <div
      className="absolute left-0 flex w-full items-center justify-center"
      style={{
        top: BANNER_TOP,
        height: BANNER_HEIGHT,
      }}
    >
      <div className="flex items-center gap-3">
        {BANNER_PHRASES.map((phrase) => (
          <p key={phrase} className="m-0 shrink-0 whitespace-nowrap" style={bannerBoxStyle}>
            {phrase}
          </p>
        ))}
      </div>
    </div>
  );
}

function AscentCanvas() {
  /** Every marker the user has opened. Callouts persist until clicked again. */
  const [openCallouts, setOpenCallouts] = useState<ReadonlySet<CalloutIndex>>(
    () => new Set<CalloutIndex>([0]),
  );

  const toggleCallout = (calloutIndex: CalloutIndex) => {
    setOpenCallouts((prev) => {
      const next = new Set(prev);
      if (next.has(calloutIndex)) next.delete(calloutIndex);
      else next.add(calloutIndex);
      return next;
    });
  };

  // The glow reaches as far as the furthest marker still open, so closing the
  // leading marker recoils the path back to the one before it.
  const activeProgress: ProgressLevel =
    openCallouts.size === 0
      ? 0
      : ((Math.max(...openCallouts) + 1) as ProgressLevel);

  const nextCalloutIndex = getNextCalloutIndex(activeProgress);

  return (
    <div
      className="relative size-full overflow-clip"
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
      `}</style>
      {/* Mountain photograph — hiker + sunset baked into clean-background.png */}
      <div className="absolute left-0 top-0 w-full" style={{ height: BANNER_TOP }}>
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-center"
          src={ASSET.cleanBackground}
        />
      </div>

      <HeaderTitleBlock />
      <JourneyPath progressLevel={activeProgress} />

      {/* Summit flag — anchored to Stage 5 (Peak Performance) node center */}
      <div className="absolute left-[1221px]" style={{ top: 40 }}>
        <img alt="" className="block h-16 w-auto" src={ASSET.flag} />
      </div>

      {/* Thought-bubble callouts — every opened marker stays visible */}
      {CALLOUTS.map((callout, index) =>
        openCallouts.has(index as CalloutIndex) ? (
          <div
            key={callout.quote}
            className="absolute"
            style={{ left: callout.left, top: callout.top }}
          >
            <CalloutBox
              quote={callout.quote}
              width={callout.width}
              rounded={"rounded" in callout ? callout.rounded : 12}
            />
          </div>
        ) : null,
      )}

      {/* Stage title labels — shown below markers only while that callout is open */}
      {STAGE_TITLE_LABELS.map(({ title, markerTop, markerSize, calloutIndex }) => {
        if (!openCallouts.has(calloutIndex)) return null;

        const callout = CALLOUTS[calloutIndex];
        const progressThreshold = (calloutIndex + 1) as ProgressLevel;

        return (
          <StageTitleLabel
            key={title}
            title={title}
            left={callout.left}
            top={markerTop + markerSize + TITLE_LABEL_GAP}
            width={callout.width}
            isActive={openCallouts.has(calloutIndex)}
            isReached={activeProgress >= progressThreshold}
          />
        );
      })}

      <BaseCampStartMarker
        isActive={openCallouts.has(0)}
        isReached={activeProgress >= 1}
        isNext={nextCalloutIndex === 0}
        onClick={() => toggleCallout(0)}
      />

      {/* Stage icon nodes */}
      {STAGE_NODES.map((node, index) => {
        const calloutIndex = (index + 1) as CalloutIndex;

        return (
          <StageNode
            key={node.alt}
            {...node}
            isActive={openCallouts.has(calloutIndex)}
            isReached={activeProgress >= index + 2}
            isNext={nextCalloutIndex === calloutIndex}
            onClick={() => toggleCallout(calloutIndex)}
          />
        );
      })}

      <BottomBanner />
    </div>
  );
}

export default function AscentJourneyInfographic() {
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
        <AscentCanvas />
      </div>
    </div>
  );
}
