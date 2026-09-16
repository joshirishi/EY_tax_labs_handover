/**
 * Motif DS 4.17 layout atoms — subset used by the Module 4 Report Card.
 * Tokens: theme.css only. Type: EYInterstate 300/400/700.
 */

import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { fonts } from "../tokens";

const F = fonts;

export function DSCard({
  children,
  className,
  style,
  id,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  return (
    <article
      id={id}
      className={className}
      style={{
        border: "1px solid var(--border)",
        borderRadius: 6,
        background: "var(--card)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </article>
  );
}

export function DSCardHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        padding: "20px 24px",
        borderBottom: "1px solid var(--border-header)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
        {Icon && (
          <span
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: 4,
              background: "var(--muted)",
              color: "var(--foreground)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={16} strokeWidth={1.75} />
          </span>
        )}
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: F.regular,
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.4,
              color: "var(--foreground)",
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                margin: "4px 0 0",
                fontFamily: F.light,
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.4,
                color: "var(--muted-foreground)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action}
    </header>
  );
}

export function DSCardBody({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        flex: 1,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  title,
  description,
  input,
}: {
  title?: string;
  description: string;
  input?: {
    value: string;
    onChange: (value: string) => void;
    ariaLabel: string;
  };
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 6,
        border: "1px solid var(--border)",
        background: "var(--card)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 66,
      }}
    >
      <label
        style={{
          fontFamily: F.regular,
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "0.4px",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
        }}
      >
        {description}
      </label>
      {input ? (
        <input
          type="text"
          value={input.value}
          onChange={(e) => input.onChange(e.target.value)}
          aria-label={input.ariaLabel}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            color: "var(--foreground)",
            fontFamily: F.regular,
            fontSize: 24,
            fontWeight: 400,
            lineHeight: 1.2,
            outline: "none",
            padding: 0,
          }}
        />
      ) : (
        <p
          style={{
            margin: 0,
            fontFamily: F.regular,
            fontSize: 24,
            fontWeight: 400,
            color: "var(--foreground)",
          }}
        >
          {title}
        </p>
      )}
    </div>
  );
}

type ChipVariant = "success" | "warning" | "critical" | "neutral";

const CHIP: Record<ChipVariant, { bg: string; text: string }> = {
  success: { bg: "var(--chip-success-bg)", text: "var(--chip-success-text)" },
  warning: { bg: "var(--chip-warning-bg)", text: "var(--chip-warning-text)" },
  critical: { bg: "var(--chip-critical-bg)", text: "var(--chip-critical-text)" },
  neutral: { bg: "var(--card)", text: "var(--muted-foreground)" },
};

export function Chip({
  text,
  variant = "neutral",
}: {
  text: string;
  variant?: ChipVariant;
}) {
  const tone = CHIP[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 16,
        padding: "2px 8px",
        fontFamily: F.regular,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.3,
        background: tone.bg,
        color: tone.text,
        border: variant === "neutral" ? "1px solid var(--chip-default-border)" : "none",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
        <span
          aria-hidden
          style={{
            width: 3,
            height: 24,
            borderRadius: 2,
            background: "var(--ey-yellow)",
            flexShrink: 0,
            marginTop: 4,
          }}
        />
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: F.regular,
              fontSize: "var(--text-h3)",
              fontWeight: 400,
              lineHeight: 1.3,
              color: "var(--foreground)",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                margin: "8px 0 0",
                maxWidth: 760,
                fontFamily: F.light,
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.6,
                color: "var(--muted-foreground)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
