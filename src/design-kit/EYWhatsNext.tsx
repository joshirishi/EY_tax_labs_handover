/**
 * EYWhatsNext — reusable end-of-module CTA
 *
 * Colors from Figma node 3455:18320 (dark EY module surface):
 *   bg/page    #1A1A24  ·  bg/surface #2E2E38  ·  yellow #FFE600
 *   gray02     #C4C4CD  ·  gray01     #747480  ·  card border #2E2E38
 *
 * Use on every Phase 1 submodule screen so the handoff looks identical.
 */

import type { CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { colors, contentInlinePad, fonts, spacing } from "./tokens";
import whatsNextBg from "../assets/images/GettyImages-1399150019.jpg";

/** Figma dark-module palette (3455:18320) */
const DARK = {
  page: colors.confidentBlack, // #1A1A24
  surface: colors.offBlack, // #2E2E38
  yellow: colors.yellow, // #FFE600
  yellowSoft: "rgba(255, 230, 0, 0.10)",
  border: "#2E2E38",
  body: colors.gray02, // #C4C4CD
  caption: colors.gray01, // #747480
  white: colors.white,
} as const;

export interface EYWhatsNextProps {
  /** Small uppercase pill label — e.g. "What's Next" */
  eyebrow?: string;
  /** Main headline. Pass a string, or React nodes for a yellow highlight span. */
  title: ReactNode;
  /** Supporting paragraph under the title (temporarily not rendered) */
  description?: ReactNode;
  /** Primary CTA label */
  ctaLabel: string;
  /** Called when the yellow CTA is clicked */
  onContinue: () => void;
  /** Optional fine-print under the button */
  meta?: string;
  /** Section id for in-page anchors (default: whats-next) */
  id?: string;
  style?: CSSProperties;
}

export function EYWhatsNext({
  eyebrow = "What's Next",
  title,
  description,
  ctaLabel,
  onContinue,
  meta: _meta,
  id = "whats-next",
  style,
}: EYWhatsNextProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: `${spacing.sectionPaddingY} ${contentInlinePad}`,
        textAlign: "center",
        borderTop: `1px solid ${DARK.border}`,
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${whatsNextBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(26, 26, 36, 0.82) 0%, rgba(26, 26, 36, 0.68) 100%)`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "48px 40px",
          background: DARK.surface,
          border: `1px solid ${DARK.border}`,
          borderRadius: 16,
          boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        }}
      >
        {/* Yellow outline pill — matches Figma INTERACTIVE AUDIT badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: DARK.yellowSoft,
            border: `1px solid ${DARK.yellow}`,
            borderRadius: 100,
            padding: "4px 12px",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              color: DARK.yellow,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontFamily: fonts.bold,
              lineHeight: 1.2,
            }}
          >
            {eyebrow}
          </span>
        </div>

        <h2
          id={`${id}-heading`}
          style={{
            margin: "0 0 28px",
            fontSize: 32,
            lineHeight: "38px",
            fontWeight: 700,
            color: DARK.white,
            fontFamily: fonts.bold,
          }}
        >
          {title}
        </h2>

        {description ? (
          <p
            style={{
              margin: "0 0 28px",
              fontSize: 15,
              lineHeight: "22px",
              color: DARK.body,
              fontFamily: fonts.regular,
            }}
          >
            {description}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onContinue}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 28px",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: fonts.bold,
            background: DARK.yellow,
            color: DARK.page,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            lineHeight: 1.2,
          }}
        >
          {ctaLabel}
          <ArrowRight size={16} aria-hidden />
        </button>

        {/* Meta fine-print temporarily hidden — keep heading + CTA only
        {_meta ? (
          <p
            style={{
              margin: "18px 0 0",
              fontSize: 13,
              lineHeight: 1.5,
              color: DARK.caption,
              fontFamily: fonts.regular,
            }}
          >
            {_meta}
          </p>
        ) : null}
        */}
      </div>
      </div>
    </section>
  );
}

/** Yellow highlight for a phrase inside the title */
export function EYWhatsNextHighlight({ children }: { children: ReactNode }) {
  return <span style={{ color: DARK.yellow }}>{children}</span>;
}
