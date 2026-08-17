/**
 * EY AI Tax Hub — Core Processing Pipeline illustration
 * Figma node 3543:4136 — Infographic - Core Processing Pipeline (v2)
 *
 * Renders at the designed 1200×820 size, then scales to the container width.
 *
 * All orbiting icons share one circle: center (CX, CY) + radius R,
 * placed by angle (0° = east, positive = counterclockwise).
 */

import { useEffect, useRef, useState } from "react";

const ASSET = {
  ringGrayHalf: "/pipeline/v2/ring-gray-half.svg",
  ringWhiteHalf: "/pipeline/v2/ring-white-half.svg",
  copilot: "/pipeline/copilot-icon.svg",
  iconChat: "/pipeline/v2/icon-chat.svg",
  iconRag: "/pipeline/v2/icon-rag.svg",
  iconHuman: "/pipeline/v2/icon-human.svg",
  iconModel: "/pipeline/v2/icon-model.svg",
  word: "/pipeline/word.svg",
  excel: "/pipeline/excel.svg",
  teams: "/pipeline/teams.svg",
  powerpoint: "/pipeline/powerpoint.svg",
  sharepoint: "/pipeline/sharepoint.svg",
  outlook: "/pipeline/outlook.svg",
} as const;

const W = 1200;
const H = 820;
/** Side-by-side hero column: render at 70% of fit-to-width scale. */
const DISPLAY_SCALE = 0.7;

/** Copilot ring box: left 409, top 224, size 384 → geometric center. */
const CX = 409 + 384 / 2; // 601
const CY = 224 + 384 / 2; // 416
/** Shared orbit radius for every left + right icon (outside the 192px ring). */
const R = 300;

const CARD_W = 100;
const ICON_BOX = 67;
/** Yellow card: circle point = icon center (label hangs below). */
const CARD_ICON_CX = CARD_W / 2;
const CARD_ICON_CY = ICON_BOX / 2;

const MS_SIZE = 96;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Top-left of a box whose center sits on the shared circle at `angleDeg`. */
function boxOnCircle(angleDeg: number, boxW: number, boxH: number) {
  const rad = degToRad(angleDeg);
  return {
    left: CX + R * Math.cos(rad) - boxW / 2,
    top: CY + R * Math.sin(rad) - boxH / 2,
  };
}

/**
 * Left half (Core Processing): 4 yellow icons on the left semicircle,
 * evenly spaced from near-top to near-bottom via west.
 * angle = -90° - (i + 0.5) / 4 * 180°
 */
const LEFT_CARDS = [
  {
    title: "Chat",
    angle: -90 - (0 + 0.5) * 45, // -112.5°
    composedIcon: ASSET.iconChat,
    bakedIcon: null as string | null,
  },
  {
    title: "RAG",
    angle: -90 - (1 + 0.5) * 45, // -157.5°
    composedIcon: null,
    bakedIcon: ASSET.iconRag,
  },
  {
    title: "Human in the Loop",
    angle: -90 - (2 + 0.5) * 45, // -202.5° → 157.5°
    composedIcon: ASSET.iconHuman,
    bakedIcon: null,
  },
  {
    title: "Model",
    angle: -90 - (3 + 0.5) * 45, // -247.5° → 112.5°
    composedIcon: null,
    bakedIcon: ASSET.iconModel,
  },
] as const;

/**
 * Right half (M365): 6 Microsoft app icons on the right semicircle,
 * evenly spaced from near-top to near-bottom via east.
 * angle = -90° + (i + 0.5) / 6 * 180°
 */
const RIGHT_APPS = [
  { alt: "Microsoft Word", src: ASSET.word, angle: -90 + (0 + 0.5) * 30 }, // -75°
  { alt: "Microsoft Excel", src: ASSET.excel, angle: -90 + (1 + 0.5) * 30 }, // -45°
  { alt: "Microsoft Teams", src: ASSET.teams, angle: -90 + (2 + 0.5) * 30 }, // -15°
  { alt: "Microsoft PowerPoint", src: ASSET.powerpoint, angle: -90 + (3 + 0.5) * 30 }, // 15°
  { alt: "Microsoft SharePoint", src: ASSET.sharepoint, angle: -90 + (4 + 0.5) * 30 }, // 45°
  { alt: "Microsoft Outlook", src: ASSET.outlook, angle: -90 + (5 + 0.5) * 30 }, // 75°
] as const;

function PipelineCard({
  title,
  angle,
  composedIcon,
  bakedIcon,
}: {
  title: string;
  angle: number;
  composedIcon: string | null;
  bakedIcon: string | null;
}) {
  // Anchor the card so the icon (not the label) sits on the shared circle.
  const rad = degToRad(angle);
  const left = CX + R * Math.cos(rad) - CARD_ICON_CX;
  const top = CY + R * Math.sin(rad) - CARD_ICON_CY;

  return (
    <div
      className="absolute flex w-[100px] flex-col items-center gap-3"
      style={{ left, top }}
    >
      {bakedIcon ? (
        <img alt="" className="size-[67px] drop-shadow-[0px_2px_5px_rgba(0,0,0,0.24)]" src={bakedIcon} />
      ) : (
        <div className="flex size-[67px] items-center justify-center rounded-[10px] bg-[#ffe600] drop-shadow-[0px_2px_5px_rgba(0,0,0,0.24)]">
          <img alt="" className="size-[42px]" src={composedIcon ?? undefined} />
        </div>
      )}
      <p className="whitespace-nowrap text-center font-['EYInterstate:Bold',sans-serif] text-base leading-6 text-white">
        {title}
      </p>
    </div>
  );
}

/** Curved ring labels — "Core Processing Pipeline" (left, gray half) / "M365" (right, white half). */
function RingLabels() {
  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={384}
      height={384}
      viewBox="0 0 384 384"
    >
      <defs>
        <path id="ring-label-left" d="M 138 43.5 A 158 158 0 0 0 138 340.5" fill="none" />
        <path id="ring-label-right" d="M 246 43.5 A 158 158 0 0 1 246 340.5" fill="none" />
      </defs>
      <text
        fontFamily="EYInterstate:Bold, sans-serif"
        fontWeight={700}
        fontSize={13.5}
        letterSpacing="0.5"
        fill="#1a1a24"
      >
        <textPath href="#ring-label-left" startOffset="50%" textAnchor="middle">
          Core Processing Pipeline
        </textPath>
      </text>
      <text
        fontFamily="EYInterstate:Bold, sans-serif"
        fontWeight={700}
        fontSize={13.5}
        letterSpacing="4"
        fill="#1a1a24"
      >
        <textPath href="#ring-label-right" startOffset="50%" textAnchor="middle">
          M365
        </textPath>
      </text>
    </svg>
  );
}

/** Center ring: two-tone (gray / white) halves, curved labels, Copilot mark. */
function CopilotRing() {
  return (
    <div className="absolute left-[409px] top-[224px] size-[384px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="-rotate-90 size-[384px]">
          <div className="relative size-[384px]">
            <div className="absolute bottom-1/2 left-0 right-0 top-0">
              <img alt="" className="block size-full max-w-none" src={ASSET.ringGrayHalf} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-1/2">
              <img alt="" className="block size-full max-w-none" src={ASSET.ringWhiteHalf} />
            </div>
          </div>
        </div>
      </div>

      <RingLabels />

      {/* Inner cutout — 248px — punches the ring hole through to the page background. */}
      <div className="absolute left-[68px] top-[68px] size-[248px] rounded-full bg-[#1a1a24]" />

      <div className="absolute left-1/2 top-1/2 flex size-[116px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <img alt="Microsoft Copilot" className="block size-full max-w-none" src={ASSET.copilot} />
      </div>
    </div>
  );
}

export default function CoreProcessingPipeline() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const update = () => setScale((el.clientWidth / W) * DISPLAY_SCALE);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={shellRef}
      className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-2xl"
      style={{ height: H * scale }}
      data-name="Infographic - Core Processing Pipeline"
      data-node-id="3543:4136"
    >
      <div
        className="absolute left-1/2 top-0 bg-[#1a1a24]"
        style={{
          width: W,
          height: H,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <CopilotRing />

        {LEFT_CARDS.map((card) => (
          <PipelineCard key={card.title} {...card} />
        ))}

        {RIGHT_APPS.map((app) => {
          const { left, top } = boxOnCircle(app.angle, MS_SIZE, MS_SIZE);
          return (
            <div
              key={app.alt}
              className="absolute overflow-clip"
              style={{ left, top, width: MS_SIZE, height: MS_SIZE }}
            >
              <img alt={app.alt} className="absolute inset-0 size-full max-w-none" src={app.src} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
