/**
 * Motif DS 4.17 interactive subset — progress, badge, primary CTA.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { fonts } from "../tokens";

const F = fonts;

type ProgressVariant = "accent" | "success" | "warning" | "critical";

const PROGRESS_FILL: Record<ProgressVariant, string> = {
  accent: "var(--foreground)",
  success: "var(--chip-success-dot)",
  warning: "var(--chip-warning-dot)",
  critical: "var(--chip-critical-dot)",
};

export function MotifProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  variant = "accent",
  height = 6,
}: {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: ProgressVariant;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      {(label || showValue) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 6,
          }}
        >
          {label && (
            <span
              style={{
                fontFamily: F.regular,
                fontSize: 14,
                fontWeight: 400,
                color: "var(--foreground)",
              }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              style={{
                fontFamily: F.regular,
                fontSize: 14,
                fontWeight: 400,
                color: "var(--foreground)",
              }}
            >
              {Math.round(value)}/100
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        style={{
          width: "100%",
          height,
          borderRadius: 999,
          background: "var(--muted)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: PROGRESS_FILL[variant],
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

const BADGE: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  success: { bg: "var(--chip-success-bg)", text: "var(--chip-success-text)" },
  warning: { bg: "var(--chip-warning-bg)", text: "var(--chip-warning-text)" },
  error: { bg: "var(--chip-critical-bg)", text: "var(--chip-critical-text)" },
  info: { bg: "var(--chip-info-bg)", text: "var(--chip-info-text)" },
  default: {
    bg: "var(--card)",
    text: "var(--muted-foreground)",
    border: "1px solid var(--chip-default-border)",
  },
};

export function MotifBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  const tone = BADGE[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 200,
        padding: "2px 8px",
        fontFamily: F.regular,
        fontSize: 12,
        fontWeight: 400,
        background: tone.bg,
        color: tone.text,
        border: tone.border,
        lineHeight: 1.3,
      }}
    >
      {children}
    </span>
  );
}

/** Motif primary CTA — `--primary` fill, 4px radius. */
export function MotifButton({
  children,
  variant = "default",
  style,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
}) {
  const isPrimary = variant === "default";
  return (
    <button
      type="button"
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        borderRadius: 4,
        fontFamily: F.regular,
        fontSize: 14,
        fontWeight: 400,
        cursor: "pointer",
        background: isPrimary ? "var(--primary)" : "transparent",
        color: isPrimary ? "var(--primary-foreground)" : "var(--foreground)",
        border: isPrimary ? "none" : "1px solid var(--border-button)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
