import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { Bot, Check, ChevronDown, ChevronLeft, ChevronRight, Eye, ListTree, MessageSquare, RotateCcw, ShieldOff, Undo2, X } from "lucide-react";
import { SiteHeader } from "../design-kit/SiteHeader";
import { ModuleHeader, SUBNAV_SCROLL_MARGIN, useModuleSectionHashScroll } from "../design-kit/LearningNav";
import { colors, contentRailStyle, fonts, layout, spacing, spectrumCss, typeScale } from "../design-kit/tokens";
import { AscentModuleProgressSection } from "../imports/Frame353/ascentCurriculum";
import heroImg from "../assets/images/GettyImages-1399150019.jpg";
import { StepBadge } from "../design-kit/EYCard";
import { EYButton } from "../design-kit/EYButton";
import { EYBody, EYCaption, EYEyebrow, EYHeading, EYQuote } from "../design-kit/EYTypography";

export const PHASE4_LABEL = "Phase 4: Closure & AI Reinforcement";
export const PHASE4_NUMBER = 4;

const PHASE4_SECTIONS = [
  { id: "p4-risk",       label: "The Risk",       group: "learn" as const },
  { id: "p4-checks",     label: "The Checks",     group: "learn" as const },
  { id: "p4-checklist",  label: "Your Checklist", group: "apply" as const },
  { id: "p4-lead-governance", label: "Lead with governance", group: "apply" as const },
  { id: "p4-org",        label: "For Organisations", group: "apply" as const },
  { id: "journey-progress", label: "Ascent",  group: "apply" as const },
];

const RESPONSIBLE_USE_NEWS = [
  {
    src: "/reference-images/p4-news-data-leakage.png",
    tag: "Data leakage",
    headline: "Samsung Bans ChatGPT After Sensitive Code Leak",
    source: "Forbes",
    date: "2 May 2023",
    description: "Following multiple incidents involving confidential source code and internal information being uploaded to ChatGPT, Samsung imposed company-wide restrictions on generative AI tools.",
    isReal: true,
  },
  {
    src: "/reference-images/p4-news-cbdt-chatgpt.png",
    tag: "Unreviewed filing",
    headline: "CBDT Says ChatGPT Returns Can Be Filed With No Professional Review",
    source: "Briefing",
    date: "August 2026",
    description: "This one is made up for the room. No tax authority treats an unreviewed AI draft as a completed return. A professional still has to check and sign off.",
    isReal: false,
  },
  {
    src: "/reference-images/p4-news-confidentiality.png",
    tag: "Confidentiality exposure",
    headline: "Major Banks Restricted Employee Use of ChatGPT",
    source: "Forbes",
    date: "2023",
    description: "Financial institutions including JPMorgan imposed restrictions on ChatGPT due to concerns that employees could inadvertently expose sensitive financial and customer information.",
    isReal: true,
  },
  {
    src: "/reference-images/p4-news-copilot-gst.png",
    tag: "Auto-submit",
    headline: "Copilot Now Submits GST Returns With No Human Reviewer",
    source: "Dispatch",
    date: "August 2026",
    description: "This one is made up for the room. Copilot can help draft a working paper. It cannot file a GST return on its own, and a human still has to review it.",
    isReal: false,
  },
  {
    src: "/reference-images/p4-news-shadow-ai.png",
    tag: "Shadow AI",
    headline: "38% of Korean Workers Use Personal AI, Exposing Firms to Shadow AI Risk",
    source: "Seoul Economic Daily",
    date: "27 July 2026",
    description: "A Samsung SDS survey found that 38% of employees were using personally subscribed AI services for work instead of enterprise-approved platforms.",
    isReal: true,
  },
  {
    src: "/reference-images/p4-news-tokenmaxxing.png",
    tag: "Tokenmaxxing",
    headline: "Uber CTO Says Tokenmaxxing Era Is Ending After AI Budget Burnout",
    source: "The Hans India",
    date: "2026",
    description: "Uber's CTO warned against indiscriminately consuming AI tokens and model capacity without considering cost, efficiency, or business value.",
    isReal: true,
  },
  {
    src: "/reference-images/p4-news-value-leakage.png",
    tag: "Value leakage",
    headline: "IBM Apptio Helps CFOs Connect AI Spend to Business Value",
    source: "CFO Dive",
    date: "2026",
    description: "As AI budgets grow, many leadership teams struggle to distinguish genuine business impact from AI experimentation and usage statistics.",
    isReal: true,
  },
] as const;

type NewsArticle = (typeof RESPONSIBLE_USE_NEWS)[number];
const NEWS_FOCUS = `2px solid ${colors.yellow}`;

function NewsLightbox({
  src,
  caption,
  onClose,
}: {
  src: string;
  caption: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full article view"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(26,26,36,0.88)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed",
          top: 24,
          right: 28,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: `1px solid ${colors.borderOnDark}`,
          color: colors.white,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={20} strokeWidth={1.75} aria-hidden />
      </button>
      <img
        src={src}
        alt={caption}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "88vw",
          maxHeight: "84vh",
          borderRadius: 12,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }}
      />
      <p
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.7)",
          border: `1px solid ${colors.borderOnDark}`,
          borderRadius: 20,
          padding: "8px 20px",
          fontFamily: fonts.regular,
          fontSize: 12,
          color: colors.onDarkMuted,
          margin: 0,
          whiteSpace: "nowrap",
        }}
      >
        {caption}
      </p>
    </div>
  );
}

function ResponsibleUseNewsCard({
  article,
  revealed,
  onGuess,
  onOpenClipping,
}: {
  article: NewsArticle;
  revealed: boolean;
  onGuess: () => void;
  onOpenClipping: () => void;
}) {
  const tone = revealed ? (article.isReal ? "real" : "fake") : "idle";
  const bodyBg = tone === "real" ? colors.success : tone === "fake" ? colors.destructive : colors.white;
  const bodyText = tone === "idle" ? colors.offBlack : colors.white;
  const mutedText = tone === "idle" ? colors.gray01 : colors.white;

  return (
    <article
      aria-label={
        revealed
          ? `${article.headline} — ${article.isReal ? "Real" : "Fake"}`
          : `${article.headline}. Ask the room, then choose Real or Fake.`
      }
      style={{
        background: colors.white,
        borderRadius: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        textAlign: "left",
        boxShadow: "0 2px 8px rgba(26,26,36,0.08)",
        width: "100%",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: 180, overflow: "hidden", flexShrink: 0, lineHeight: 0 }}>
        <img
          src={article.src}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
        />
      </div>
      <div
        style={{
          padding: "16px 16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
          minHeight: 0,
          background: bodyBg,
          transition: "background 160ms ease",
        }}
      >
        {revealed && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: fonts.bold,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.white,
            }}
          >
            {article.isReal ? <Check size={14} strokeWidth={2} aria-hidden /> : <X size={14} strokeWidth={2} aria-hidden />}
            {article.isReal ? "Real" : "Fake"}
          </span>
        )}
        <p style={{ fontFamily: fonts.bold, fontSize: 15, color: bodyText, margin: 0, lineHeight: 1.4, letterSpacing: "-0.01em" }}>
          {article.headline}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: fonts.regular, fontSize: 11, color: mutedText }}>{article.date}</span>
          <span aria-hidden style={{ fontSize: 11, color: tone === "idle" ? colors.gray02 : colors.white }}>|</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 11, color: bodyText }}>{article.source}</span>
        </div>
        {revealed ? (
          <>
            <p style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.white, margin: 0, lineHeight: 1.55, flex: 1 }}>
              {article.description}
            </p>
            <button
              type="button"
              onClick={onOpenClipping}
              aria-label={`View clipping: ${article.headline}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: fonts.bold,
                fontSize: 12,
                fontWeight: 700,
                color: colors.white,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
              onFocus={(e) => { e.currentTarget.style.outline = NEWS_FOCUS; }}
              onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
            >
              <Eye size={14} strokeWidth={1.75} aria-hidden />
              View clipping
            </button>
          </>
        ) : (
          <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 8 }}>
            <EYButton type="button" size="sm" variant="primary" onClick={onGuess} aria-label={`Reveal ${article.headline} as Real or Fake`}>
              Real
            </EYButton>
            <EYButton type="button" size="sm" variant="secondary" onClick={onGuess} aria-label={`Reveal ${article.headline} as Real or Fake`}>
              Fake
            </EYButton>
          </div>
        )}
      </div>
    </article>
  );
}

const NEWS_CARD_GAP = 20;

function CarouselChevron({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous headline" : "Next headline"}
      style={{
        position: "absolute",
        top: "50%",
        [dir === "prev" ? "left" : "right"]: 0,
        transform: "translateY(-50%)",
        zIndex: 3,
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: `1px solid ${colors.gray02}`,
        background: colors.white,
        color: colors.offBlack,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(26,26,36,0.10)",
        padding: 0,
      }}
      onFocus={(e) => { e.currentTarget.style.outline = NEWS_FOCUS; }}
      onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden />
    </button>
  );
}

function ResponsibleUseNewsCarousel({
  revealed,
  onGuess,
  onOpenClipping,
}: {
  revealed: Record<string, boolean>;
  onGuess: (src: string) => void;
  onOpenClipping: (article: NewsArticle) => void;
}) {
  const count = RESPONSIBLE_USE_NEWS.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const slots = useMemo(
    () =>
      ([-1, 0, 1] as const).map((offset) => ({
        offset,
        article: RESPONSIBLE_USE_NEWS[(activeIndex + offset + count) % count],
      })),
    [activeIndex, count],
  );

  const go = (delta: number) => {
    setActiveIndex((i) => (i + delta + count) % count);
  };

  return (
    <div>
      <div
        role="list"
        aria-label="Real or Fake headlines"
        aria-live="polite"
        style={{ position: "relative", padding: "8px 28px", marginBottom: 20 }}
      >
        <CarouselChevron dir="prev" onClick={() => go(-1)} />
        <CarouselChevron dir="next" onClick={() => go(1)} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr) minmax(0, 1fr)",
            gap: NEWS_CARD_GAP,
            alignItems: "center",
          }}
        >
          {slots.map(({ offset, article }) => {
            const isCenter = offset === 0;
            return (
              <motion.div
                key={article.src}
                role="listitem"
                layout
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{
                  opacity: isCenter ? 1 : 0.48,
                  scale: isCenter ? 1 : 0.88,
                  zIndex: isCenter ? 2 : 1,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ minWidth: 0, transformOrigin: "center center" }}
              >
                <ResponsibleUseNewsCard
                  article={article}
                  revealed={Boolean(revealed[article.src])}
                  onGuess={() => onGuess(article.src)}
                  onOpenClipping={() => onOpenClipping(article)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
        {RESPONSIBLE_USE_NEWS.map((article, i) => (
          <button
            key={article.src}
            type="button"
            aria-label={`Go to headline ${i + 1}: ${article.tag}`}
            aria-current={i === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(i)}
            style={{
              width: i === activeIndex ? 22 : 8,
              height: 8,
              borderRadius: 999,
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: i === activeIndex ? colors.yellow : colors.gray02,
              transition: "width 0.2s, background 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RecogniseTheRisk() {
  const [lightbox, setLightbox] = useState<NewsArticle | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const revealedCount = RESPONSIBLE_USE_NEWS.filter((a) => revealed[a.src]).length;
  const allRevealed = revealedCount === RESPONSIBLE_USE_NEWS.length;

  const guess = (src: string) => {
    setRevealed((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  return (
    <section
      id="p4-risk"
      aria-labelledby="risk-heading"
      style={{
        scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: colors.white,
        borderTop: `1px solid ${colors.gray02}`,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>
        <EYEyebrow style={{ textAlign: "center", marginBottom: 12 }}>Icebreaker</EYEyebrow>
        <EYHeading
          id="risk-heading"
          level={2}
          style={{
            fontSize: "clamp(22px, 3vw, 36px)",
            margin: "0 0 12px",
            textAlign: "center",
          }}
        >
          Real or Fake?
        </EYHeading>
        <EYBody style={{ margin: "0 auto 24px", textAlign: "center", maxWidth: 560, color: colors.gray01 }}>
          Ask the room. Then tap Real or Fake.
        </EYBody>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <button
            type="button"
            onClick={() => setRevealed({})}
            disabled={revealedCount === 0}
            aria-label="Refresh icebreaker — hide all answers"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              border: `1px solid ${colors.gray02}`,
              background: colors.offWhite,
              color: colors.offBlack,
              fontFamily: fonts.bold,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: revealedCount === 0 ? "not-allowed" : "pointer",
              opacity: revealedCount === 0 ? 0.45 : 1,
            }}
            onFocus={(e) => { e.currentTarget.style.outline = NEWS_FOCUS; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            <RotateCcw size={14} strokeWidth={2} aria-hidden />
            Refresh
          </button>
          <EYCaption style={{ margin: 0, color: colors.gray01 }}>
            {revealedCount > 0
              ? `${revealedCount} of ${RESPONSIBLE_USE_NEWS.length} revealed`
              : "Tap Real or Fake to reveal the answer."}
          </EYCaption>
        </div>

        <ResponsibleUseNewsCarousel
          revealed={revealed}
          onGuess={guess}
          onOpenClipping={setLightbox}
        />

        {allRevealed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: fonts.regular,
              fontSize: typeScale.body.size,
              color: colors.offBlack,
              textAlign: "center",
              margin: "28px 0 0",
              lineHeight: 1.5,
            }}
          >
            The real ones happened. The fakes are the shortcuts that still need a human. Next: the checks that stop this in a tax file.
          </motion.p>
        )}

        {lightbox && (
          <NewsLightbox
            src={lightbox.src}
            caption={`${lightbox.source} — ${lightbox.headline} · ${lightbox.date}`}
            onClose={() => setLightbox(null)}
          />
        )}
      </div>
    </section>
  );
}

// ── Shared placeholder div ────────────────────────────────────────────────────
function PlaceholderBlock({
  id,
  eyebrow,
  heading,
  sub,
  dark = false,
  minHeight = 480,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  sub: string;
  dark?: boolean;
  minHeight?: number;
}) {
  const bg = dark ? colors.confidentBlack : colors.white;
  const headingColor = dark ? colors.white : colors.offBlack;
  const subColor = dark ? colors.onDarkMuted : colors.gray01;

  return (
    <section
      id={id}
      style={{
        scrollMarginTop: SUBNAV_SCROLL_MARGIN,
        background: bg,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>
        <p
          style={{
            fontFamily: fonts.bold,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: colors.yellow,
            margin: "0 0 12px",
            textAlign: "center",
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            fontFamily: fonts.bold,
            fontSize: "clamp(22px, 3.5vw, 36px)",
            color: headingColor,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontFamily: fonts.regular,
            fontSize: "clamp(14px, 1.5vw, 16px)",
            color: subColor,
            margin: "0 0 48px",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          {sub}
        </p>

        {/* Content placeholder */}
        <div
          style={{
            minHeight,
            border: `2px dashed ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}`,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: fonts.regular,
              fontSize: 13,
              color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Content coming soon
          </span>
        </div>
      </div>
    </section>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
const DOES_NOT_BULLETS = [
  "The facts used",
  "The authorities cited",
  "The calculations performed",
  "The conclusions reached",
  "The information disclosed",
  "The final professional work product",
];

function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        backgroundColor: colors.confidentBlack,
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        padding: "80px 0 80px",
      }}
    >
      {/* Left scrim — keeps type readable over the image bloom */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(26,26,36,0.97) 0%, rgba(26,26,36,0.84) 45%, rgba(26,26,36,0.45) 72%, rgba(26,26,36,0.28) 100%)", pointerEvents: "none" }} />
      <div style={{ ...contentRailStyle, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <h1 id="hero-heading" style={{ fontFamily: fonts.bold, fontSize: "clamp(28px, 3.4vw, 48px)", letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0 }}>
          <span style={{ color: colors.white }}>From Using AI</span><br />
          <span style={{ color: colors.yellow, whiteSpace: "nowrap" }}>to Using AI Responsibly</span>
        </h1>
        <p style={{ fontFamily: fonts.regular, fontSize: "clamp(14px, 1.4vw, 17px)", color: colors.onDarkMuted, margin: "0 0 36px", lineHeight: 1.65, maxWidth: 560 }}>
          A practical governance playbook for senior tax and finance professionals.
        </p>
      </div>
    </section>
  );
}

// ── Hero context — three differentiated accountability cards (Echo 44d60a89) ─
function HeroContextSection() {
  const cardBase: React.CSSProperties = {
    borderRadius: 10,
    padding: "28px 28px 32px",
  };

  const bulletStyle: React.CSSProperties = {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.gray01,
    lineHeight: 1.6,
    margin: "0 0 6px 0",
    paddingLeft: 16,
    position: "relative",
  };

  const bulletsLeft = DOES_NOT_BULLETS.slice(0, 3);
  const bulletsRight = DOES_NOT_BULLETS.slice(3);

  return (
    <section
      style={{
        background: colors.offWhite,
        padding: `${spacing.sectionPaddingY} 0`,
        width: "100%",
      }}
    >
      <div style={{ ...contentRailStyle }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 24 }}>
          <div style={{ ...cardBase, background: colors.white, border: `1px solid ${colors.gray02}`, borderTop: `3px solid ${colors.frameBlue}` }}>
            <h2 style={{ fontFamily: fonts.bold, fontSize: "clamp(15px, 1.8vw, 18px)", color: colors.offBlack, margin: "0 0 20px", lineHeight: 1.3 }}>
              AI Does Not Take Responsibility For
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {bulletsLeft.map((b) => (
                <li key={b} style={bulletStyle}>
                  <span aria-hidden="true" style={{ position: "absolute", left: 0, color: colors.frameBlue }}>›</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ ...cardBase, background: colors.white, border: `1px solid ${colors.gray02}`, borderTop: `3px solid ${colors.frameOrange}` }}>
            <h2 style={{ fontFamily: fonts.bold, fontSize: "clamp(15px, 1.8vw, 18px)", color: colors.offBlack, margin: "0 0 20px", lineHeight: 1.3 }}>
              You Remain Accountable For
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {bulletsRight.map((b) => (
                <li key={b} style={bulletStyle}>
                  <span aria-hidden="true" style={{ position: "absolute", left: 0, color: colors.frameOrange }}>›</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ ...cardBase, background: colors.confidentBlack, border: `1px solid ${colors.gray02}`, borderTop: `3px solid ${colors.yellow}`, display: "flex", alignItems: "center" }}>
            <p
              style={{
                fontFamily: fonts.bold,
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: colors.white,
                margin: 0,
                lineHeight: 1.45,
                textAlign: "center",
                width: "100%",
              }}
            >
              How do you use AI capabilities without compromising accuracy, confidentiality, professional judgement or trust?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


// ── TheChecks ─────────────────────────────────────────────────────────────────

function InnerCard({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div style={{ background: colors.white, borderTop: `3px solid ${color}`, borderRight: "1px solid rgba(46,46,56,0.09)", borderBottom: "1px solid rgba(46,46,56,0.09)", borderLeft: "1px solid rgba(46,46,56,0.09)", borderRadius: 8, padding: "16px 18px" }}>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 16, listStyle: "disc" }}>
      {items.map((item) => (
        <li key={item} style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray01, lineHeight: 1.6, marginBottom: 3 }}>{item}</li>
      ))}
    </ul>
  );
}

function CheckCallout({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 16, background: colors.confidentBlack, borderLeft: `4px solid ${colors.yellow}`, borderRadius: 6, padding: "14px 20px" }}>
      <p style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.yellow, margin: 0, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

function Check1Body() {
  const psio = [
    { label: "Purpose",     color: colors.frameBlue,   questions: ["What specific task am I asking AI to perform?", "What will I do with the output?"] },
    { label: "Suitability", color: colors.frameGreen,  questions: ["Is this an appropriate AI-assisted activity?", "Can the result be independently checked?", "Does the activity require qualified tax or finance judgment?"] },
    { label: "Impact",      color: colors.frameOrange, questions: ["Could the output influence a tax position, filing, written advice, client communication or management decision?"] },
    { label: "Ownership",   color: colors.framePurple, questions: ["Who will review the output?", "Who is accountable for the final decision?"] },
  ];
  const tiers = [
    { icon: "✓", label: "Usually suitable for AI assistance—subject to applicable policies", color: colors.frameGreen,  items: ["Organising information", "Summarising supplied material", "Creating a first draft", "Comparing defined documents", "Identifying questions or possible gaps"] },
    { icon: "⚠", label: "Requires heightened review",                                        color: colors.frameOrange, items: ["Technical research", "Analysis of tax positions", "Case-law or statutory summaries", "Draft advice", "Calculations or forecasts", "Authority-facing or client-facing documents"] },
    { icon: "✕", label: "Do not delegate to AI",                                              color: colors.frameRed,    items: ["Final professional judgment", "Approval of a tax position", "Sign-off on a filing", "Final advice without qualified review", "Decisions that cannot be independently supported"] },
  ];
  return (
    <div>
      {/* Journey Checkpoint callout */}
      <div style={{ background: colors.confidentBlack, borderRadius: 8, padding: "14px 18px", marginBottom: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontFamily: fonts.regular, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.yellow, margin: 0 }}>Journey Checkpoint</p>
        <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.white, margin: 0 }}><strong>DEFINE:</strong> What am I trying to achieve?</p>
        <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.white, margin: 0 }}><strong>DECIDE:</strong> Is AI suitable for this activity?</p>
      </div>
      {/* Zone A: PSIO — unified horizontal panel, 4 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(46,46,56,0.10)", marginBottom: 14 }}>
        {psio.map((q, i) => (
          <div key={q.label} style={{
            padding: "20px 18px 22px",
            background: colors.white,
            borderLeft: i > 0 ? "1px solid rgba(46,46,56,0.08)" : "none",
            borderTop: `3px solid ${q.color}`,
          }}>
            <p style={{ fontFamily: fonts.bold, fontSize: 10, color: q.color, margin: "0 0 14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{q.label}</p>
            {q.questions.map((qs) => (
              <p key={qs} style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.gray01, lineHeight: 1.6, margin: "0 0 6px" }}>{qs}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Zone B: Traffic-light suitability tiers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
        {tiers.map((tier) => (
          <div key={tier.label} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${tier.color}` }}>
            <div style={{ background: tier.color, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.white, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{tier.icon}</span>
              <p style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.white, margin: 0, lineHeight: 1.4 }}>{tier.label}</p>
            </div>
            <div style={{ background: `color-mix(in srgb, ${tier.color} 6%, white)`, padding: "14px 16px" }}>
              <ul style={{ margin: 0, paddingLeft: 14, listStyle: "disc" }}>
                {tier.items.map((item) => (
                  <li key={item} style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.gray01, lineHeight: 1.55, marginBottom: 4 }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <CheckCallout text="If the purpose, information, reviewer or verification method is unclear—pause and seek guidance before proceeding." />
    </div>
  );
}

function Check2Body() {
  const questions = [
    "Am I using an organisation-approved tool?",
    "Is the intended information permitted in that environment?",
    "Do I have authority to use the information for this purpose?",
    "Have I included only what is necessary?",
    "Can names, identifiers or sensitive details be removed?",
    "Can a limited extract replace the complete document?",
    "Are intended users permitted to access the connected source?",
    "Do I know how to report an unintended disclosure or data issue?",
  ];
  const categories = [
    "Client and taxpayer information",
    "Personal data",
    "Employee information",
    "Confidential business information",
    "Transaction details",
    "Privileged or restricted material",
    "Tax returns and supporting records",
    "Credentials or access information",
  ];
  return (
    <div>
      {/* Journey Checkpoint callout */}
      <div style={{ background: colors.confidentBlack, borderRadius: 8, padding: "14px 18px", marginBottom: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontFamily: fonts.regular, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.yellow, margin: 0 }}>Journey Checkpoint</p>
        <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.white, margin: 0 }}><strong>PROTECT:</strong> What information will AI receive?</p>
      </div>
      {/* Zone A: 8 pre-flight questions as 2×4 numbered cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(46,46,56,0.10)", marginBottom: 14 }}>
        {questions.map((q, i) => (
          <div key={q} style={{
            padding: "16px 16px 18px",
            background: colors.white,
            borderLeft: i % 4 > 0 ? "1px solid rgba(46,46,56,0.08)" : "none",
            borderTop: i >= 4 ? "1px solid rgba(46,46,56,0.08)" : `3px solid ${colors.frameGreen}`,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: colors.frameGreen, color: colors.white, fontFamily: fonts.bold, fontSize: 11, flexShrink: 0, marginBottom: 8 }}>{i + 1}</span>
            <p style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.gray01, margin: 0, lineHeight: 1.55 }}>{q}</p>
          </div>
        ))}
      </div>

      {/* Zone B: Dark "sensitive categories" panel — full width */}
      <div style={{ background: colors.confidentBlack, borderRadius: 10, padding: "20px 24px 22px", marginBottom: 14, borderTop: `3px solid ${colors.eyebrowGold}` }}>
        <p style={{ fontFamily: fonts.bold, fontSize: 10, color: colors.eyebrowGold, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>
          Protect these categories carefully
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {categories.map((cat) => (
            <span key={cat} style={{
              fontFamily: fonts.regular, fontSize: 12, color: colors.white,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 4, padding: "5px 12px",
            }}>{cat}</span>
          ))}
        </div>
      </div>

      {/* Zone C: Better Practice — Avoid / Prefer side by side */}
      <p style={{ fontFamily: fonts.bold, fontSize: 10, color: colors.eyebrowGold, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Better Practice Example</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: `color-mix(in srgb, ${colors.frameRed} 10%, white)`, border: `1.5px solid ${colors.frameRed}`, borderRadius: 8, padding: "16px 18px" }}>
          <p style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.frameRed, margin: "0 0 10px" }}>Avoid</p>
          <p style={{ fontFamily: fonts.quote, fontStyle: "italic", fontSize: 13, color: colors.offBlack, margin: 0, lineHeight: 1.55 }}>"Review the entire client file and identify all tax risks."</p>
        </div>
        <div style={{ background: `color-mix(in srgb, ${colors.frameGreen} 10%, white)`, border: `1.5px solid ${colors.frameGreen}`, borderRadius: 8, padding: "16px 18px" }}>
          <p style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.frameGreen, margin: "0 0 10px" }}>Prefer</p>
          <p style={{ fontFamily: fonts.quote, fontStyle: "italic", fontSize: 13, color: colors.offBlack, margin: 0, lineHeight: 1.55 }}>"Using the permitted and minimised fact pattern provided, identify issues that may require further professional review. Do not assume missing facts."</p>
        </div>
      </div>

      <div style={{ background: colors.offWhite, border: `1px solid rgba(46,46,56,0.12)`, borderLeft: `3px solid ${colors.eyebrowGold}`, borderRadius: 6, padding: "12px 16px", marginBottom: 14 }}>
        <p style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.offBlack, margin: 0, lineHeight: 1.5 }}>Good prompting requires relevant context—not unrestricted data.</p>
      </div>

      <CheckCallout text="Do not enter professional, client or taxpayer information into an unapproved AI tool." />
    </div>
  );
}

function Check3Body() {
  const dimensions = [
    { n: 1, label: "Task",        questions: ["Is the task clear and appropriately limited?", "Have I separated assistance from final decision-making?"] },
    { n: 2, label: "Context",     questions: ["Have I provided the relevant facts?", "Have I avoided unnecessary sensitive information?"] },
    { n: 3, label: "Sources",     questions: ["Have I identified approved material?", "Have I instructed AI not to invent or supplement missing sources?"] },
    { n: 4, label: "Boundaries",  questions: ["Have I said what AI must not assume?", "Have I told AI not to reach a final tax conclusion?", "Have I asked AI to distinguish facts from assumptions?"] },
    { n: 5, label: "Uncertainty", questions: ["Have I asked AI to identify missing information?", "Have I asked it to show limitations and statements requiring verification?"] },
    { n: 6, label: "Output",      questions: ["Is the requested format suitable for human review?", "Am I treating the response as a draft?"] },
  ];
  return (
    <div>
      {/* Journey Checkpoint callout */}
      <div style={{ background: colors.confidentBlack, borderRadius: 8, padding: "14px 18px", marginBottom: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontFamily: fonts.regular, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.yellow, margin: 0 }}>Journey Checkpoint</p>
        <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.white, margin: 0 }}><strong>CONTROL:</strong> What instructions, sources and boundaries will I provide?</p>
      </div>
      {/* Zone A: unified 3×2 sequenced dimension panel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(46,46,56,0.10)", marginBottom: 14 }}>
        {dimensions.map((d, i) => (
          <div key={d.label} style={{
            padding: "18px 18px 20px",
            background: colors.white,
            borderLeft: i % 3 > 0 ? "1px solid rgba(46,46,56,0.08)" : "none",
            borderTop: i >= 3 ? "1px solid rgba(46,46,56,0.08)" : `3px solid ${colors.framePurple}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: colors.framePurple, color: colors.white, fontFamily: fonts.bold, fontSize: 11, flexShrink: 0 }}>{d.n}</span>
              <p style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.framePurple, margin: 0, letterSpacing: "0.07em", textTransform: "uppercase" }}>{d.label}</p>
            </div>
            {d.questions.map((q) => (
              <p key={q} style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.gray01, margin: "0 0 6px", lineHeight: 1.55 }}>{q}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Zone B: reusable template — dark climax panel */}
      <div style={{ background: colors.confidentBlack, borderRadius: 10, padding: "22px 28px", borderTop: `3px solid ${colors.framePurple}` }}>
        <p style={{ fontFamily: fonts.bold, fontSize: 10, color: colors.framePurple, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Reusable Responsible-Prompt Instruction</p>
        <p style={{ fontFamily: fonts.quote, fontStyle: "italic", fontSize: "clamp(13px, 1.2vw, 15px)", color: colors.onDark, margin: 0, lineHeight: 1.7 }}>
          "Use only the supplied sources. Do not invent facts, authorities or citations. Clearly separate facts, assumptions and observations. Identify missing information, conflicting material and statements requiring independent verification. Treat the output as a draft for qualified human review and do not provide a final tax conclusion."
        </p>
      </div>
    </div>
  );
}

function Check4Body() {
  const guardrails = [
    { letter: "A", label: "Purpose",               items: ["One clear and narrow purpose", "Intended users defined", "Business owner identified", "Supports—does not replace—professional judgment"] },
    { letter: "B", label: "Knowledge",              items: ["Approved, relevant and current sources", "Appropriate access permissions", "Users may access underlying information", "Process for outdated or conflicting sources"] },
    { letter: "C", label: "Responsibilities",       items: ["Permitted activities listed", "Prohibited activities listed", "Retrieval, summarising, drafting and deciding distinguished", "Unsupported conclusions prohibited"] },
    { letter: "D", label: "Workflow",               items: ["Operating steps defined", "Expected outputs specified", "Qualified review before consequential use", "Clear stopping point"] },
    { letter: "E", label: "Escalation",             items: ["Stop when material facts are missing", "Flag conflicting or unavailable sources", "Advice requests escalated", "Escalation owner identified"] },
    { letter: "F", label: "Testing and monitoring", items: ["Representative scenarios tested", "Inaccurate or unexpected outputs recorded", "Sources and instructions reassessed", "Procedure for errors, access issues or unintended behaviour"] },
  ];
  return (
    <div>
      {/* Unified 3×2 guardrail panel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(46,46,56,0.10)", marginBottom: 14 }}>
        {guardrails.map((g, i) => (
          <div key={g.letter} style={{
            padding: "18px 18px 20px",
            background: colors.white,
            borderLeft: i % 3 > 0 ? "1px solid rgba(46,46,56,0.08)" : "none",
            borderTop: i >= 3 ? "1px solid rgba(46,46,56,0.08)" : `3px solid ${colors.frameTeal}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: colors.frameTeal, color: colors.offBlack, fontFamily: fonts.bold, fontSize: 12, flexShrink: 0 }}>{g.letter}</span>
              <p style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.offBlack, margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>{g.label}</p>
            </div>
            <BulletList items={g.items} />
          </div>
        ))}
      </div>

      {/* Dark callout */}
      <div style={{ background: colors.confidentBlack, borderRadius: 10, padding: "20px 28px", borderTop: `3px solid ${colors.frameTeal}` }}>
        <p style={{ fontFamily: fonts.bold, fontSize: "clamp(13px, 1.2vw, 15px)", color: colors.frameTeal, margin: 0, lineHeight: 1.6 }}>
          No Agent should have broader access, authority or autonomy than its approved purpose requires.
        </p>
      </div>
    </div>
  );
}

function Check5Body() {
  const verifyCards = [
    { letter: "V", title: "Validate the facts",          desc: "Are names, dates, amounts, events and circumstances correct? Are relevant facts missing?" },
    { letter: "E", title: "Examine the evidence",        desc: "Does each material authority exist? Have primary materials been opened and read? Does the source support the statement?" },
    { letter: "R", title: "Reperform the calculations",  desc: "Can figures, formulas and assumptions be independently reproduced? Are period, currency and units correct?" },
    { letter: "I", title: "Identify assumptions",        desc: "What has AI assumed? What information was unavailable? What uncertainty remains?" },
    { letter: "F", title: "Find contrary views",         desc: "Are exceptions, limitations or alternative interpretations missing? Has AI ignored conflicting evidence?" },
    { letter: "Y", title: "You decide",                  desc: "Does the conclusion properly connect verified facts with verified law? Would a qualified professional stand behind it?" },
  ] as const;
  const cols = 3;
  const adviceItems = [
    "1. Validate factual assumptions",
    "2. Identify applicable provisions and authorities",
    "3. Read and verify material sources",
    "4. Relate verified law to verified facts",
    "5. Apply independent professional judgment",
    "6. Revise or reject unsupported content",
  ] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Journey Checkpoint callout */}
      <div style={{ background: colors.confidentBlack, borderRadius: 8, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontFamily: fonts.regular, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.yellow, margin: 0 }}>Journey Checkpoint</p>
        <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.white, margin: 0 }}><strong>VERIFY:</strong> Are the facts, calculations and authorities correct?</p>
      </div>
      {/* Zone A: VERIFY — 3×2 unified panel */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(46,46,56,0.1)" }}>
        {verifyCards.map((card, i) => (
          <div
            key={card.letter}
            style={{
              padding: "18px 16px",
              background: colors.white,
              borderTop: i < cols ? `3px solid ${colors.frameOrange}` : `1px solid rgba(46,46,56,0.08)`,
              borderLeft: i % cols !== 0 ? "1px solid rgba(46,46,56,0.08)" : "none",
            }}
          >
            {/* offBlack on frameOrange = 5.25:1 ✓ WCAG AA */}
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: "50%",
              background: colors.frameOrange, color: colors.offBlack,
              fontFamily: fonts.bold, fontSize: 13, marginBottom: 8, flexShrink: 0,
            }}>
              {card.letter}
            </span>
            <p style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.offBlack, margin: "0 0 6px", lineHeight: 1.3 }}>
              {card.title}
            </p>
            <p style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray01, margin: 0, lineHeight: 1.5 }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Zone B: Written Tax Advice Test — dark panel */}
      <div style={{ background: colors.confidentBlack, borderTop: `3px solid ${colors.frameOrange}`, borderRadius: 10, padding: "20px 24px" }}>
        {/* frameOrange on confidentBlack = 6.74:1 ✓ WCAG AA */}
        <p style={{ fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.frameOrange, margin: "0 0 12px" }}>
          Written tax advice test
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 32px" }}>
          {adviceItems.map((item) => (
            <p key={item} style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.onDark, margin: 0, lineHeight: 1.5 }}>
              {item}
            </p>
          ))}
        </div>
      </div>

      {/* Zone C: Hero punchline */}
      <div style={{ background: colors.confidentBlack, borderLeft: `4px solid ${colors.yellow}`, borderRadius: 6, padding: "16px 20px" }}>
        <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.onDarkMuted, margin: "0 0 6px", lineHeight: 1.5 }}>
          Do not ask only whether the answer sounds right.
        </p>
        <p style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.yellow, margin: 0, lineHeight: 1.35 }}>
          Ask whether it can be supported.
        </p>
      </div>

      {/* Zone D: Warning footnote — offBlack on tinted bg (14:1 ✓), orange left-border + tinted bg */}
      <div style={{ borderLeft: `3px solid ${colors.frameOrange}`, background: "rgba(255,125,30,0.06)", borderRadius: "0 6px 6px 0", padding: "12px 14px" }}>
        <p style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray01, margin: 0, lineHeight: 1.6 }}>
          <span style={{ fontFamily: fonts.bold, color: colors.offBlack }}>Do not claim</span> that the model's internal reasoning has been verified. Instead, evaluate whether the stated rationale is supported by verified facts, calculations and authorities.
        </p>
      </div>
    </div>
  );
}


const CHECKS_META = [
  { n: "1",   label: "Check 1: Pause Before You Prompt",                                subtitle: "Clarify the purpose, suitability, impact and ownership before using AI.",                                                                              journey: "DEFINE • DECIDE",  color: colors.frameBlue,   onColor: colors.offBlack, Body: Check1Body  },
  { n: "2",   label: "Check 2: If the Input Is Sensitive, the AI Use Is Sensitive",     subtitle: "Control what enters the AI environment before focusing on what comes out.",                                                                             journey: "PROTECT",          color: colors.frameGreen,  onColor: colors.offBlack, Body: Check2Body  },
  { n: "3",   label: "Check 3: A Responsible Prompt Sets Boundaries",                   subtitle: "A responsible prompt does not merely tell AI what to do—it also tells AI where to stop.",                                                               journey: "CONTROL",          color: colors.framePurple, onColor: colors.white,    Body: Check3Body  },
  { n: "4",   label: "Check 4: Build No-Code Agents with Guardrails",                   subtitle: "No Agent should have broader access, authority or autonomy than its approved purpose requires.",                                                         journey: "CONTROL",          color: colors.frameTeal,   onColor: colors.offBlack, Body: Check4Body  },
  { n: "5",   label: "Check 5: Do Not Approve What You Cannot Defend",                  subtitle: "Evaluate whether the output's stated rationale is supported by verified facts, calculations and authorities.",                                            journey: "VERIFY",           color: colors.frameOrange, onColor: colors.offBlack, Body: Check5Body  },
];

function TheChecks() {
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([0]));
  const savedScrollRef = useRef<{ top: number; el: HTMLElement } | null>(null);
  const openKey = useMemo(() => [...openSet].sort((a, b) => a - b).join(","), [openSet]);

  useLayoutEffect(() => {
    const saved = savedScrollRef.current;
    if (!saved) return;
    saved.el.scrollTop = saved.top;
    savedScrollRef.current = null;
  }, [openKey]);

  const toggleCheck = (index: number, scrollEl: HTMLElement | null) => {
    if (scrollEl) savedScrollRef.current = { top: scrollEl.scrollTop, el: scrollEl };
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section
      id="p4-checks"
      aria-labelledby="checks-heading"
      style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN, background: colors.offWhite, borderTop: `1px solid ${colors.gray02}`, padding: `${spacing.sectionPaddingY} 0`, width: "100%" }}
    >
      <div style={{ ...contentRailStyle }}>
        <p style={{ fontFamily: fonts.bold, fontSize: typeScale.label.size, letterSpacing: typeScale.label.tracking, textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 12px", textAlign: "center" }}>
          The Checks
        </p>
        <h2 id="checks-heading" style={{ fontFamily: fonts.bold, fontSize: "clamp(26px, 3vw, 36px)", color: colors.offBlack, margin: "0 0 14px", lineHeight: 1.2, textAlign: "center" }}>
          Checks for Responsible AI
        </h2>
        <p style={{ fontFamily: fonts.regular, fontSize: "clamp(15px, 1.4vw, 18px)", color: colors.gray01, margin: "0 auto 48px", lineHeight: 1.6, textAlign: "center", maxWidth: 620 }}>
          Each check maps to a step in the Responsible AI Journey. Apply them throughout the task—not only at the end.
        </p>

        <div role="list" aria-label="The five checks" style={{ overflowAnchor: "none" }}>
          {CHECKS_META.map((check, i) => {
            const isOpen = openSet.has(i);
            return (
              <div
                key={check.n}
                role="listitem"
                style={{
                  borderTop: i === 0 ? `1px solid rgba(46,46,56,0.1)` : "none",
                  borderBottom: `1px solid rgba(46,46,56,0.1)`,
                  borderLeft: isOpen ? `4px solid ${colors.yellow}` : `4px solid transparent`,
                  background: colors.white,
                  boxShadow: isOpen ? "0 2px 12px rgba(46,46,56,0.10)" : "none",
                  transition: "border-left-color 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`check-body-${i}`}
                  onClick={(e) => {
                    const container = e.currentTarget.closest(".overflow-auto") as HTMLElement | null;
                    toggleCheck(i, container);
                  }}
                  style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 14, padding: "18px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                    background: isOpen ? colors.offBlack : `${check.color}22`,
                    border: `1.5px solid ${isOpen ? colors.offBlack : check.color}`,
                    color: isOpen ? colors.yellow : colors.offBlack,
                    fontFamily: fonts.bold, fontSize: 13,
                    transition: "background 0.25s, border-color 0.25s, color 0.25s",
                  }}>
                    {check.n}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: fonts.bold, fontSize: "clamp(13px, 1.3vw, 15px)", color: colors.offBlack, transition: "color 0.2s", lineHeight: 1.3 }}>
                      {check.label}
                    </span>
                    <span style={{ display: "block", fontFamily: fonts.regular, fontSize: 12, color: colors.gray01, marginTop: 3, lineHeight: 1.5, transition: "color 0.2s" }}>
                      {check.subtitle}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase",
                    flexShrink: 0, marginTop: 2, whiteSpace: "nowrap",
                    background: isOpen ? colors.offBlack : `${check.color}22`,
                    color: isOpen ? colors.yellow : colors.offBlack,
                    border: isOpen ? "none" : `1px solid ${check.color}`,
                    borderRadius: 3, padding: "3px 7px",
                    transition: "background 0.25s, color 0.25s",
                  }}>
                    {check.journey}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 4, transition: "transform 0.3s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M4 6l4 4 4-4" stroke={colors.offBlack} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  id={`check-body-${i}`}
                  style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.32s cubic-bezier(0.22, 1, 0.36, 1)" }}
                >
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <div style={{ padding: "4px 24px 28px" }}>
                      <check.Body />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── How to Use AI in Tax (flowchart → one question at a time) ─────────────────
type AiTaxQ = "confidential" | "client" | "public";
type AiTaxAnswer = "yes" | "no";
type AiTaxOutcome = "ban" | "chat" | "chat-or-agent" | "chat-studio-or-agent";

const AI_TAX_ORDER: AiTaxQ[] = ["confidential", "client", "public"];
const AI_TAX_QUESTIONS: Record<AiTaxQ, { label: string; short: string }> = {
  confidential: { label: "Is the data confidential?", short: "Confidential" },
  client: { label: "Is the data client-related?", short: "Client-related" },
  public: { label: "Is the data from a public source?", short: "Public source" },
};
const AI_TAX_OUTCOMES: Record<AiTaxOutcome, { title: string; hint: string; marker: string; Icon: typeof ShieldOff }> = {
  ban: { title: "Do not use AI", hint: "Confidential data must not be entered into AI tools.", marker: colors.destructive, Icon: ShieldOff },
  chat: { title: "Use Copilot Chat", hint: "This data can be used in Copilot Chat.", marker: colors.frameBlue, Icon: MessageSquare },
  "chat-or-agent": { title: "Use Copilot Chat or Agent", hint: "Client-related data from a public source.", marker: colors.frameBlue, Icon: Bot },
  "chat-studio-or-agent": { title: "Use Copilot Chat, Copilot Studio, or Agent", hint: "Client-related data that is not from a public source.", marker: colors.frameBlue, Icon: Bot },
};

function nextAiTaxStep(q: AiTaxQ, a: AiTaxAnswer): AiTaxQ | AiTaxOutcome {
  if (q === "confidential") return a === "yes" ? "ban" : "client";
  if (q === "client") return a === "no" ? "chat" : "public";
  return a === "yes" ? "chat-or-agent" : "chat-studio-or-agent";
}

function deriveAiTax(answers: Partial<Record<AiTaxQ, AiTaxAnswer>>) {
  const path: AiTaxQ[] = [];
  for (const q of AI_TAX_ORDER) {
    const a = answers[q];
    if (!a) return { question: q as AiTaxQ | null, outcome: null as AiTaxOutcome | null, path };
    path.push(q);
    const nxt = nextAiTaxStep(q, a);
    if (nxt === "confidential" || nxt === "client" || nxt === "public") continue;
    return { question: null, outcome: nxt, path };
  }
  return { question: "confidential" as AiTaxQ | null, outcome: null, path };
}

type AiTaxMapNode =
  | { kind: "q"; id: AiTaxQ; yes: AiTaxMapNode; no: AiTaxMapNode }
  | { kind: "out"; id: AiTaxOutcome };

const AI_TAX_TREE: AiTaxMapNode = {
  kind: "q",
  id: "confidential",
  yes: { kind: "out", id: "ban" },
  no: {
    kind: "q",
    id: "client",
    no: { kind: "out", id: "chat" },
    yes: {
      kind: "q",
      id: "public",
      yes: { kind: "out", id: "chat-or-agent" },
      no: { kind: "out", id: "chat-studio-or-agent" },
    },
  },
};

function yellowFocus(el: HTMLElement, on: boolean) {
  el.style.outline = on ? `2px solid ${colors.yellow}` : "none";
  el.style.outlineOffset = on ? "2px" : "0";
}

function MapNodeView({
  node,
  answers,
  currentQ,
  outcome,
  onJump,
  muted,
}: {
  node: AiTaxMapNode;
  answers: Partial<Record<AiTaxQ, AiTaxAnswer>>;
  currentQ: AiTaxQ | null;
  outcome: AiTaxOutcome | null;
  onJump: (q: AiTaxQ) => void;
  muted: boolean;
}) {
  if (node.kind === "out") {
    const o = AI_TAX_OUTCOMES[node.id];
    const reached = outcome === node.id;
    return (
      <div
        style={{
          fontFamily: reached ? fonts.bold : fonts.regular,
          fontSize: 13,
          lineHeight: 1.4,
          color: muted && !reached ? colors.gray01 : colors.offBlack,
          borderLeft: reached ? `3px solid ${o.marker}` : "3px solid transparent",
          paddingLeft: 8,
        }}
      >
        {o.title}
      </div>
    );
  }

  const isCurrent = currentQ === node.id;
  return (
    <div style={{
      borderLeft: isCurrent ? `3px solid ${colors.yellow}` : `1px solid ${colors.gray02}`,
      paddingLeft: 12,
      marginTop: 4,
    }}>
      <button
        type="button"
        onClick={() => onJump(node.id)}
        aria-current={isCurrent ? "step" : undefined}
        onFocus={(e) => yellowFocus(e.currentTarget, true)}
        onBlur={(e) => yellowFocus(e.currentTarget, false)}
        style={{
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          background: "none", border: "none", padding: "4px 0", cursor: "pointer",
          textAlign: "left", fontFamily: fonts.bold, fontSize: 13, lineHeight: 1.4,
          color: muted && !isCurrent ? colors.gray01 : colors.offBlack,
        }}
      >
        {AI_TAX_QUESTIONS[node.id].label}
        {isCurrent && (
          <span style={{
            fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.04em",
            textTransform: "uppercase", color: colors.eyebrowGoldDark,
          }}>
            You are here
          </span>
        )}
      </button>
      {(["yes", "no"] as const).map((a) => {
        const chosen = answers[node.id];
        const state = !chosen ? "open" : chosen === a ? "taken" : "not-taken";
        const childMuted = muted || state === "not-taken";
        return (
          <div key={a} style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "flex-start" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0, minWidth: 44, marginTop: 2,
              fontFamily: fonts.bold, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase",
              color: state === "not-taken" ? colors.gray01 : colors.offBlack,
            }}>
              {state === "taken" && <Check size={12} strokeWidth={1.75} aria-hidden />}
              {a === "yes" ? "Yes" : "No"}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <MapNodeView
                node={a === "yes" ? node.yes : node.no}
                answers={answers}
                currentQ={currentQ}
                outcome={outcome}
                onJump={onJump}
                muted={childMuted}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HowToUseAiInTax() {
  const [answers, setAnswers] = useState<Partial<Record<AiTaxQ, AiTaxAnswer>>>({});
  const [mapOpen, setMapOpen] = useState(false);
  const { question, outcome, path } = deriveAiTax(answers);
  const lastQ = path[path.length - 1];

  const choose = (a: AiTaxAnswer) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question]: a }));
  };
  const rewindTo = (q: AiTaxQ) => {
    const idx = AI_TAX_ORDER.indexOf(q);
    setAnswers((prev) => {
      const next = { ...prev };
      AI_TAX_ORDER.slice(idx).forEach((k) => { delete next[k]; });
      return next;
    });
  };

  const onChoiceKeys = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const buttons = Array.from(e.currentTarget.querySelectorAll("button"));
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = buttons[(i + dir + buttons.length) % buttons.length];
    next?.focus({ preventScroll: true });
  };

  return (
    <div
      role="region"
      aria-labelledby="ai-tax-guide-title"
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      <EYEyebrow id="ai-tax-guide-title" style={{ color: colors.eyebrowGoldDark }}>
        How to Use AI in Tax
      </EYEyebrow>

      <div aria-label="Your path so far" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
        <span style={{
          fontFamily: fonts.bold, fontSize: typeScale.caption.size, letterSpacing: typeScale.label.tracking,
          textTransform: "uppercase", color: colors.gray01,
        }}>
          Your path
        </span>
        {path.length === 0 && (
          <EYCaption style={{ color: colors.gray01 }}>Start here — one question at a time.</EYCaption>
        )}
        {path.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => rewindTo(q)}
            aria-label={`Change answer: ${AI_TAX_QUESTIONS[q].short} ${answers[q] === "yes" ? "Yes" : "No"}`}
            onFocus={(e) => yellowFocus(e.currentTarget, true)}
            onBlur={(e) => yellowFocus(e.currentTarget, false)}
            style={{
              fontFamily: fonts.regular, fontSize: typeScale.caption.size, color: colors.offBlack,
              background: colors.offWhite, border: `1px solid ${colors.gray02}`, borderRadius: 4,
              padding: "4px 8px", cursor: "pointer",
            }}
          >
            {AI_TAX_QUESTIONS[q].short}: {answers[q] === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          borderLeft: `3px solid ${outcome ? AI_TAX_OUTCOMES[outcome].marker : colors.yellow}`,
          background: colors.offWhite,
          padding: spacing.cardPadding,
          minHeight: 140,
        }}
      >
        {question && (
          <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
            <legend style={{
              fontFamily: fonts.bold, fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em",
              color: colors.offBlack, margin: "0 0 16px", lineHeight: 1.3,
            }}>
              {AI_TAX_QUESTIONS[question].label}
            </legend>
            <div role="group" aria-label="Yes or No" onKeyDown={onChoiceKeys} style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {(["yes", "no"] as const).map((a) => (
                <EYButton
                  key={a}
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => choose(a)}
                  onFocus={(e) => yellowFocus(e.currentTarget, true)}
                  onBlur={(e) => yellowFocus(e.currentTarget, false)}
                >
                  {a === "yes" ? "Yes" : "No"}
                </EYButton>
              ))}
            </div>
          </fieldset>
        )}

        {outcome && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }}>
            {(() => {
              const o = AI_TAX_OUTCOMES[outcome];
              return (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <o.Icon size={20} strokeWidth={1.75} color={o.marker} aria-hidden />
                    <div>
                      <EYHeading level={3} style={{ color: colors.offBlack }}>{o.title}</EYHeading>
                      <EYBody style={{ marginTop: 6, color: colors.gray01, maxWidth: "none" }}>{o.hint}</EYBody>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
                    {lastQ && (
                      <EYButton
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => rewindTo(lastQ)}
                        onFocus={(e) => yellowFocus(e.currentTarget, true)}
                        onBlur={(e) => yellowFocus(e.currentTarget, false)}
                      >
                        <Undo2 size={14} strokeWidth={1.75} aria-hidden />
                        Change last answer
                      </EYButton>
                    )}
                    <EYButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setAnswers({})}
                      onFocus={(e) => yellowFocus(e.currentTarget, true)}
                      onBlur={(e) => yellowFocus(e.currentTarget, false)}
                    >
                      <RotateCcw size={14} strokeWidth={1.75} aria-hidden />
                      Start over
                    </EYButton>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </div>

      <div>
        <button
          type="button"
          aria-expanded={mapOpen}
          aria-controls="ai-tax-path-map"
          onClick={() => setMapOpen((o) => !o)}
          onFocus={(e) => yellowFocus(e.currentTarget, true)}
          onBlur={(e) => yellowFocus(e.currentTarget, false)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: fonts.bold, fontSize: 13, color: colors.offBlack,
          }}
        >
          <ListTree size={16} strokeWidth={1.75} aria-hidden />
          {mapOpen ? "Hide all Yes / No paths" : "See all Yes / No paths"}
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            aria-hidden
            style={{ transform: mapOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          />
        </button>
        {mapOpen && (
          <div
            id="ai-tax-path-map"
            role="tree"
            aria-label="All Yes and No paths"
            style={{ marginTop: 12, padding: spacing.cardPadding, background: colors.offWhite }}
          >
            <div style={{
              fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.04em",
              textTransform: "uppercase", color: colors.gray01, marginBottom: 8,
            }}>
              Start
            </div>
            <MapNodeView
              node={AI_TAX_TREE}
              answers={answers}
              currentQ={question}
              outcome={outcome}
              onJump={rewindTo}
              muted={false}
            />
          </div>
        )}
      </div>

      <p style={{
        fontFamily: fonts.regular, fontSize: typeScale.caption.size, color: colors.gray01,
        margin: 0, lineHeight: 1.6,
      }}>
        <span style={{ fontFamily: fonts.bold, color: colors.offBlack }}>Note: </span>
        If you are using Copilot Chat, Copilot Studio, or Agent, you must still follow the{" "}
        <a
          href="#p4-checks"
          style={{ fontFamily: fonts.bold, color: colors.offBlack, textUnderlineOffset: 3 }}
        >
          5 Checks
        </a>
        .
      </p>
    </div>
  );
}

// ── Lead with governance (Figma 4009:16919 — comparison, not a quiz) ──────────
// Copy from Figma. Dark slide 2-col lists adapted to EY light surfaces.
const LEAD_GOVERNANCE_OUTCOMES = [
  "Understand and mitigate the risks of AI before they materialize",
  "Proactively identify high-value areas for AI deployment",
  "Develop direct value generation through clear and consistent innovation",
  "Scale learnings and leading practices discovered in early pilots",
  "Accelerate ROI by protecting revenue in addition to generating it",
  "Adopt AI at scale and increase impact across functions and BUs",
  "Have a focused and consistent approach to innovation and scaling",
] as const;

const DONT_LEAD_GOVERNANCE_OUTCOMES = [
  "Adopt AI in silos which limits scale, ROI, and visibility",
  "Create prioritization chaos, which results in fragmented investment",
  "Reactively address risks, damaging both reputation and finances",
  "Repeat mistakes across BUs throughout the AI adoption lifecycle",
  "Result in slow-paced innovation, culture regression and reduced collaboration",
] as const;

function GovernanceBulletCols({
  items,
  leftCount,
  Icon,
  iconColor,
}: {
  items: readonly string[];
  leftCount: number;
  Icon: typeof Check;
  iconColor: string;
}) {
  const cols = [items.slice(0, leftCount), items.slice(leftCount)];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px 24px",
      }}
    >
      {cols.map((col, i) => (
        <ul key={i} style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
          {col.map((text) => (
            <li key={text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Icon size={16} strokeWidth={1.75} color={iconColor} aria-hidden style={{ flexShrink: 0, marginTop: 3 }} />
              <span style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 1.6, color: colors.offBlack }}>
                {text}
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function GovernanceCompareCard({
  marker,
  Icon,
  iconColor,
  titleBefore,
  titleEmph,
  items,
  leftCount,
  hierarchyRank,
}: {
  marker: string;
  Icon: typeof Check;
  iconColor: string;
  titleBefore: string;
  titleEmph: string;
  items: readonly string[];
  leftCount: number;
  hierarchyRank: 1 | 2;
}) {
  const [hovered, setHovered] = useState(false);
  const isDontLead = hierarchyRank === 2;
  // Don't-lead chrome uses destructive + alpha (Team Briefing weak-brief), not solid red.
  const edge = isDontLead ? `${marker}4d` : marker;
  const hairline = isDontLead
    ? hovered ? `${marker}4d` : `${marker}33`
    : hovered ? marker : colors.gray02;
  return (
    <article
      aria-labelledby={hierarchyRank === 1 ? "p4-lead-card-title" : "p4-dont-lead-card-title"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isDontLead ? `${marker}0a` : colors.offWhite,
        border: `1px solid ${hairline}`,
        ...(isDontLead ? {} : { borderLeft: `6px solid ${edge}` }),
        borderRadius: 8,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hovered ? "0 4px 16px rgba(46,46,56,0.10)" : "none",
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "50%",
              flexShrink: 0,
              marginTop: 2,
              background: hierarchyRank === 1 ? colors.yellow : `${marker}0d`,
              border: hierarchyRank === 1 ? "none" : `1.5px solid ${edge}`,
            }}
          >
            <Icon size={14} strokeWidth={2} color={hierarchyRank === 1 ? colors.offBlack : marker} />
          </span>
          <h3
            id={hierarchyRank === 1 ? "p4-lead-card-title" : "p4-dont-lead-card-title"}
            style={{
              fontFamily: fonts.regular,
              fontSize: 20,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: colors.offBlack,
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {titleBefore}{" "}
            <span style={{ fontFamily: fonts.bold, fontWeight: 700 }}>{titleEmph}</span>
          </h3>
        </div>
        <div style={{ height: 1, background: colors.gray02 }} />
      </header>
      <GovernanceBulletCols items={items} leftCount={leftCount} Icon={Icon} iconColor={iconColor} />
    </article>
  );
}

function LeadWithGovernance() {
  return (
    <section
      id="p4-lead-governance"
      aria-labelledby="p4-lead-governance-title"
      style={{
        background: colors.white,
        padding: spacing.sectionPadding,
        scrollMarginTop: SUBNAV_SCROLL_MARGIN,
      }}
    >
      <div style={contentRailStyle}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <EYEyebrow style={{ color: colors.gray01, marginBottom: 16 }}>
            Strategy & governance in action
          </EYEyebrow>
          <EYHeading id="p4-lead-governance-title" level={2} style={{ color: colors.offBlack, marginBottom: 14 }}>
            AI adoption should start with governance for innovation
          </EYHeading>
          <div
            style={{
              background: colors.offWhite,
              border: `1px solid ${colors.gray02}`,
              borderRadius: 8,
              padding: spacing.cardPadding,
              maxWidth: 720,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <EYBody style={{ color: colors.gray01, maxWidth: "none", margin: 0 }}>
              By setting up the right governance framework for AI, an organization can{" "}
              <span style={{ fontFamily: fonts.bold, fontWeight: 700, color: colors.offBlack }}>
                amplify the positive outcomes
              </span>{" "}
              of innovation and{" "}
              <span style={{ fontFamily: fonts.bold, fontWeight: 700, color: colors.offBlack }}>mitigate potential risks</span>, especially considering the rapid pace of technological innovation in this field.
            </EYBody>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 32,
            alignItems: "stretch",
          }}
        >
          <GovernanceCompareCard
            marker={colors.yellow}
            Icon={Check}
            iconColor={colors.success}
            titleBefore="Organizations who"
            titleEmph="Lead with governance"
            items={LEAD_GOVERNANCE_OUTCOMES}
            leftCount={4}
            hierarchyRank={1}
          />
          <GovernanceCompareCard
            marker={colors.destructive}
            Icon={X}
            iconColor={colors.destructive}
            titleBefore="Organizations who"
            titleEmph="Do not lead with governance"
            items={DONT_LEAD_GOVERNANCE_OUTCOMES}
            leftCount={3}
            hierarchyRank={2}
          />
        </div>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ClosureAiReinforcement({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (path: string) => void;
}) {
  useModuleSectionHashScroll();
  // Scroll-to-top is handled globally by <ScrollToTop/> in routes.tsx. A
  // window.scrollTo() here was a no-op anyway — the scroller is the Root shell.

  return (
    <div
      className="relative bg-white content-stretch flex flex-col items-stretch w-full max-w-full min-w-0"
      data-name="EY.ai Tax Labs - Phase 4"
    >
      <SiteHeader variant="learning" onNavigate={onNavigate} skipLinkTarget="#phase4-content" />
      <ModuleHeader
        mode="phase-overview"
        hideModuleDropdown
        phaseLabel={PHASE4_LABEL}
        phaseNumber={PHASE4_NUMBER}
        subPhaseLabel="4.1"
        sections={PHASE4_SECTIONS}
        onNavigate={onNavigate}
        onBack={onBack}
      />

      <main id="phase4-content">
        <HeroSection />

        <HeroContextSection />

        <RecogniseTheRisk />

        <TheChecks />

        {/* ── p4-checklist ─────────────────────────────────────────────── */}
        <section
          id="p4-checklist"
          style={{ background: colors.confidentBlack, padding: spacing.sectionPadding, scrollMarginTop: SUBNAV_SCROLL_MARGIN }}
        >
          <div style={contentRailStyle}>

            {/* Header row: eyebrow + title + download button */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 40 }}>
              <div>
                {/* eyebrowGold on confidentBlack = 6.35:1 ✓ */}
                <p style={{ fontFamily: fonts.bold, fontSize: typeScale.label.size, letterSpacing: typeScale.label.tracking, textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 10px" }}>
                  Take-Away
                </p>
                {/* white on confidentBlack ≈ 15:1 ✓ */}
                <h2 style={{ fontFamily: fonts.bold, fontSize: "clamp(28px, 3vw, 40px)", color: colors.onDark, margin: "0 0 10px", lineHeight: 1.1 }}>
                  Your Responsible AI Checklist
                </h2>
                <p style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.onDarkMuted, margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
                  Use this playbook after the programme for prompts, no-code Agents and final professional outputs.
                </p>
              </div>

              {/* Download button — yellow bg + offBlack text = 10.6:1 ✓ */}
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  const section = document.getElementById("p4-checklist");
                  if (!section) return;
                  const btn = e.currentTarget as HTMLAnchorElement;
                  const savedHTML = btn.innerHTML;
                  btn.innerHTML = "Generating…";
                  btn.style.pointerEvents = "none";
                  try {
                    const link = document.createElement("a");
                    link.download = "Responsible AI Checklist.png";
                    link.href = "/Responsible Checklist.png";
                    link.click();
                  } catch (err) {
                    console.error("PDF generation failed:", err);
                  } finally {
                    btn.innerHTML = savedHTML;
                    btn.style.pointerEvents = "";
                  }
                }}
                data-no-print
                aria-label="Download Responsible AI Checklist as PDF"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0,
                  background: colors.yellow, color: colors.offBlack,
                  fontFamily: fonts.bold, fontSize: 13, letterSpacing: "0.02em",
                  padding: "12px 20px", borderRadius: 4, textDecoration: "none",
                  border: "none", cursor: "pointer", marginTop: 4,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke={colors.offBlack} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download Checklist
              </a>
            </div>

            {/* 2×2 checklist card grid */}
            {(() => {
              const cards = [
                {
                  phase: "Before use",
                  title: "Before using AI",
                  accent: colors.frameBlue,      // frameBlue border on confidentBlack = 5.80:1 ✓ non-text
                  titleColor: colors.frameBlue,   // frameBlue at 20px bold on confidentBlack = 5.80:1 ✓ (>4.5:1)
                  items: [
                    "Define the purpose",
                    "Confirm the task is suitable for AI",
                    "Use an approved tool",
                    "Check whether the information is permitted",
                    "Minimise confidential and personal data",
                    "Identify the qualified reviewer",
                  ],
                },
                {
                  phase: "While prompting",
                  title: "While prompting or configuring an Agent",
                  accent: colors.framePurple,     // framePurple border on confidentBlack = 3.60:1 ✓ non-text
                  titleColor: colors.onDark,       // white — framePurple at 20px bold on surfaceOnDark = 3.05:1 borderline; use white for safety
                  items: [
                    "Use approved and relevant sources",
                    "Set clear instructions and boundaries",
                    "Separate facts from assumptions",
                    "Require limitations and uncertainty to be shown",
                    "Define prohibited activities",
                    "Add escalation and stopping rules",
                    "Place human approval before consequential use",
                  ],
                },
                {
                  phase: "Before output",
                  title: "Before relying on the output",
                  accent: colors.eyebrowGold,     // eyebrowGold border = 6.35:1 ✓ non-text
                  titleColor: colors.eyebrowGold,  // eyebrowGold at 20px bold on confidentBlack = 6.35:1 ✓
                  items: [
                    "Verify facts",
                    "Read and verify authorities",
                    "Reperform calculations",
                    "Check the jurisdiction and relevant period",
                    "Identify missing or conflicting information",
                    "Consider alternative interpretations",
                    "Apply qualified professional judgment",
                  ],
                },
                {
                  phase: "After use",
                  title: "After use",
                  accent: colors.frameGreen,      // frameGreen border = 7.76:1 ✓ non-text
                  titleColor: colors.frameGreen,   // frameGreen at 20px bold on confidentBlack = 7.76:1 ✓
                  items: [
                    "Retain the appropriate review record",
                    "Report errors, breaches or unexpected behaviour",
                    "Correct affected outputs",
                    "Update prompts, Agent instructions or sources where required",
                    "Reassess the use case as tools, sources and requirements change",
                  ],
                },
              ] as const;

              return (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  {cards.map((card) => (
                    <div
                      key={card.phase}
                      style={{
                        background: colors.surfaceOnDark,
                        borderTop: `3px solid ${card.accent}`,
                        borderRight: `1px solid ${colors.borderOnDark}`,
                        borderBottom: `1px solid ${colors.borderOnDark}`,
                        borderLeft: `1px solid ${colors.borderOnDark}`,
                        borderRadius: 10,
                        padding: "20px 22px",
                      }}
                    >
                      {/* Phase chip — yellow bg + offBlack text = 10.6:1 ✓ */}
                      <span style={{
                        display: "inline-block",
                        background: colors.yellow, color: colors.offBlack,
                        fontFamily: fonts.bold, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
                        padding: "3px 8px", borderRadius: 3, marginBottom: 10,
                      }}>
                        {card.phase}
                      </span>
                      {/* Title — 20px bold — colored or white (see titleColor) */}
                      <p style={{ fontFamily: fonts.bold, fontSize: 20, color: card.titleColor, margin: "0 0 14px", lineHeight: 1.2 }}>
                        {card.title}
                      </p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {card.items.map((item) => (
                          <li key={item} style={{ position: "relative", paddingLeft: 14, marginBottom: 7, fontFamily: fonts.regular, fontSize: 13, color: colors.onDarkMuted, lineHeight: 1.5 }}>
                            <span aria-hidden="true" style={{ position: "absolute", left: 0, top: "0.6em", width: 4, height: 4, borderRadius: "50%", background: card.accent }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Summary strip — yellow border, 3-col */}
            <div style={{
              border: `1.5px solid ${colors.yellow}`,
              borderRadius: 8,
              padding: "20px 28px",
              marginBottom: 28,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px 32px",
            }}>
              {([
                {
                  label: "For every prompt",
                  chain: "Protect → Ground → Constrain → Challenge → Verify",
                },
                {
                  label: "For every Agent",
                  chain: "Purpose → Sources → Permissions → Responsibilities → Guardrails → Human approval → Monitoring",
                },
                {
                  label: "For every final output",
                  chain: "Facts → Authorities → Calculations → Judgment → Accountability",
                },
              ] as const).map((col) => (
                <div key={col.label}>
                  {/* yellow on confidentBlack = 10.6:1 ✓ */}
                  <p style={{ fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.yellow, margin: "0 0 6px" }}>
                    {col.label}
                  </p>
                  {/* onDark on confidentBlack = ~15:1 ✓ */}
                  <p style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.onDark, margin: 0, lineHeight: 1.6 }}>
                    {col.chain}
                  </p>
                </div>
              ))}
            </div>

            {/* Tagline — yellow on confidentBlack = 10.6:1 ✓ */}
            <p style={{
              fontFamily: fonts.bold, fontSize: "clamp(15px, 1.4vw, 18px)",
              color: colors.yellow, textAlign: "center",
              margin: 0, lineHeight: 1.5,
            }}>
              Use AI to extend professional capability—never to transfer professional accountability.
            </p>

          </div>
        </section>

        <LeadWithGovernance />

        {/* ── p4-org ────────────────────────────────────────────────────── */}
        <section
          id="p4-org"
          style={{
            background: colors.offWhite,
            padding: spacing.sectionPadding,
            scrollMarginTop: SUBNAV_SCROLL_MARGIN,
          }}
        >
          <div style={contentRailStyle}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{
                fontFamily: fonts.bold, fontSize: 10, letterSpacing: "0.1em",
                textTransform: "uppercase", color: colors.eyebrowGold, margin: "0 0 12px",
              }}>
                GOVERNANCE COMPANION
              </p>
              <h2 style={{
                fontFamily: fonts.bold, fontSize: 32, color: colors.confidentBlack,
                margin: "0 0 14px", lineHeight: 1.2,
              }}>
                Organisational governance companion
              </h2>
              <p style={{
                fontFamily: fonts.regular, fontSize: 17, color: colors.gray01,
                margin: "0 auto", maxWidth: 640, lineHeight: 1.6,
              }}>
                A responsible-AI checklist to keep AI use visible, owned, controlled and continually reassessed.
              </p>
            </div>

            {/* Official responsible-AI checklists (Echo Aug 11 attachment) */}
            <div
              style={{
                background: colors.white,
                border: `1px solid ${colors.gray02}`,
                borderRadius: 12,
                padding: 16,
                marginBottom: 36,
                overflow: "hidden",
              }}
            >
              <HowToUseAiInTax />
            </div>

            {/* Tagline — yellow fails on offWhite; use confidentBlack */}
            <p style={{
              fontFamily: fonts.bold, fontSize: 17, color: colors.confidentBlack,
              textAlign: "center", margin: 0, lineHeight: 1.55,
            }}>
              Make governance practical: visible ownership, clear controls and regular reassessment.
            </p>
          </div>
        </section>
      </main>

      {/* Journey progress — continue via Control Room trek CTA */}
      <AscentModuleProgressSection
        moduleKey="m4"
        id="journey-progress"
        onNextStepCta={() => window.open("/control-room.html", "_blank", "noopener")}
      />
    </div>
  );
}
