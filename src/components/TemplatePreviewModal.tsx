import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { colors as C } from "../design-kit/tokens";

type Props = {
  imageSrc: string;
  title: string;
  onClose: () => void;
};

/** Lightbox for template screenshot preview — pattern from M365CopilotHub security cards. */
export function TemplatePreviewModal({ imageSrc, title, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [onClose]);

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
        aria-label={`${title} template preview`}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 12,
          maxWidth: "min(92vw, 1200px)",
          maxHeight: "92vh",
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: C.surfaceOnDark,
            border: `1px solid ${C.borderOnDark}`,
            color: C.onDark,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <X size={22} strokeWidth={1.75} aria-hidden />
        </button>
        <img
          src={imageSrc}
          alt={title}
          style={{
            maxWidth: "100%",
            maxHeight: "calc(92vh - 68px)",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            borderRadius: 12,
            boxShadow: `0 24px 64px color-mix(in srgb, ${C.confidentBlack} 60%, transparent)`,
          }}
        />
      </div>
    </div>
  );
}
