import { useEffect, useRef } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { colors as C, fonts as F } from "../design-kit/tokens";

/** Comic slides from Figma Frame 464 — illustration only; copy rendered in code. */
export const HITL_COMIC_SLIDES = [
  {
    title: "Checks the reasoning chain",
    detail: "Knows why the answer works",
    image: "/hitl/art-01.png",
  },
  {
    title: "Uses AI like a thinking partner",
    detail: "Iterates, refines, deepens",
    image: "/hitl/art-02.png",
  },
  {
    title: "Validates rigorously",
    detail: "Facts → law → jurisprudence",
    image: "/hitl/art-03.png",
  },
  {
    title: "Edits with professional judgment",
    detail: "Takes ownership of the output",
    image: "/hitl/art-04.png",
  },
  {
    title: "Optimises for judgment",
    detail: "“Is this defensible?”",
    image: "/hitl/art-05.png",
  },
  {
    title: "Stays persistent when the answer isn’t obvious",
    detail: "Goes deeper, reframes questions, and investigates further",
    image: "/hitl/art-06.png",
  },
  {
    title: "Interrogates the answer",
    detail: "Questions assumptions and gaps",
    image: "/hitl/art-07.png",
  },
  {
    title: "Starts with a point of view",
    detail: "“Here’s my hypothesis — challenge it”",
    image: "/hitl/art-08.png",
  },
];

export function HitlUnderstandModal({
  slideIndex,
  onClose,
  onChangeSlide,
}: {
  slideIndex: number;
  onClose: () => void;
  onChangeSlide: (index: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const slide = HITL_COMIC_SLIDES[slideIndex];
  const isFirst = slideIndex <= 0;
  const isLast = slideIndex >= HITL_COMIC_SLIDES.length - 1;

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" && !isFirst) {
        e.preventDefault();
        onChangeSlide(slideIndex - 1);
        return;
      }
      if (e.key === "ArrowRight" && !isLast) {
        e.preventDefault();
        onChangeSlide(slideIndex + 1);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, onChangeSlide, slideIndex, isFirst, isLast]);

  if (!slide) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: `color-mix(in srgb, ${C.confidentBlack} 92%, transparent)`,
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hitl-understand-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(92vw, 640px)",
          maxHeight: "92vh",
          overflowY: "auto",
          background: C.confidentBlack,
          border: `1px solid ${C.borderOnDark}`,
          borderRadius: 8,
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: C.surfaceOnDark,
            border: `1px solid ${C.borderOnDark}`,
            color: C.onDark,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={20} strokeWidth={1.75} aria-hidden />
        </button>

        <div style={{ padding: "24px 56px 16px 28px" }}>
          <p
            id="hitl-understand-title"
            style={{
              fontFamily: F.regular,
              fontSize: 18,
              color: C.onDark,
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            Tax professional using AI to{" "}
            <em style={{ fontFamily: F.bold, fontStyle: "italic", color: C.yellow, fontWeight: 700 }}>
              think better
            </em>
          </p>
        </div>

        <img
          src={slide.image}
          alt=""
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            background: C.offWhite,
          }}
        />

        <div style={{ padding: "20px 28px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
          {[slide.title, slide.detail].map((line) => (
            <p
              key={line}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                margin: 0,
                fontFamily: F.regular,
                fontSize: 15,
                color: C.onDark,
                lineHeight: 1.45,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: C.yellow,
                  color: C.confidentBlack,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Check size={11} strokeWidth={2.5} />
              </span>
              {line}
            </p>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "16px 24px 20px",
            borderTop: `1px solid ${C.borderOnDark}`,
          }}
        >
          <button
            type="button"
            onClick={() => onChangeSlide(slideIndex - 1)}
            disabled={isFirst}
            aria-label="Previous comic panel"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: isFirst ? C.gray02 : C.onDark,
              background: C.surfaceOnDark,
              border: `1px solid ${C.borderOnDark}`,
              cursor: isFirst ? "not-allowed" : "pointer",
              opacity: isFirst ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={18} strokeWidth={1.75} aria-hidden />
          </button>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {HITL_COMIC_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to panel ${i + 1}`}
                aria-current={i === slideIndex ? "true" : undefined}
                onClick={() => onChangeSlide(i)}
                style={{
                  width: i === slideIndex ? 22 : 8,
                  height: 8,
                  borderRadius: 999,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === slideIndex ? C.yellow : C.borderOnDark,
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChangeSlide(slideIndex + 1)}
            disabled={isLast}
            aria-label="Next comic panel"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: isLast ? C.gray02 : C.confidentBlack,
              background: isLast ? C.surfaceOnDark : C.yellow,
              border: isLast ? `1px solid ${C.borderOnDark}` : "none",
              cursor: isLast ? "not-allowed" : "pointer",
              opacity: isLast ? 0.4 : 1,
            }}
          >
            <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
