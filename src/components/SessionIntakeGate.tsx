import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
import { Building2, ChevronDown } from "lucide-react";
import {
  EYBody,
  EYButton,
  EYHeading,
  SESSION_HEADER_SLOT_ID,
  TabRail,
  colors,
  fonts,
} from "../design-kit";
import {
  blankSessionIntake,
  clearSessionIntake,
  FACILITATOR_OPTIONS,
  LOCATION_OPTIONS,
  validateSessionIntake,
  writeSessionIntake,
  type DeliveryMode,
  type SessionField,
  type SessionFieldErrors,
  type SessionIntake,
} from "../data/session-intake";

type GateContextValue = {
  session: SessionIntake | null;
  openEditor: () => void;
};

const SessionIntakeContext = createContext<GateContextValue | null>(null);

export function useSessionIntake(): GateContextValue {
  const value = useContext(SessionIntakeContext);
  if (!value) {
    return { session: null, openEditor: () => undefined };
  }
  return value;
}

const FOCUS_RING = `2px solid ${colors.yellow}`;

const FIELD_IDS: {
  key: SessionField;
  label: string;
  type: "text" | "date" | "number" | "select";
  autoComplete?: string;
  options?: readonly string[];
}[] = [
  { key: "clientName", label: "Client name", type: "text", autoComplete: "organization" },
  { key: "sessionName", label: "Session name", type: "text" },
  { key: "sessionDate", label: "Session date", type: "date" },
  { key: "durationHours", label: "Duration in hours", type: "number" },
  { key: "facilitator", label: "Facilitator", type: "select", options: FACILITATOR_OPTIONS },
  { key: "location", label: "Location", type: "select", options: LOCATION_OPTIONS },
  { key: "totalParticipants", label: "Total participants", type: "number" },
];

export function SessionIntakeGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionIntake | null>(() => {
    if (typeof window !== "undefined") clearSessionIntake();
    return null;
  });
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState<SessionIntake>(blankSessionIntake);
  const [errors, setErrors] = useState<SessionFieldErrors>({});
  const [saveError, setSaveError] = useState("");

  const isFirstVisit = session === null;
  const blocking = open && isFirstVisit;

  const openEditor = useCallback(() => {
    setDraft(session ?? blankSessionIntake());
    setErrors({});
    setSaveError("");
    setOpen(true);
  }, [session]);

  const contextValue = useMemo(
    () => ({ session, openEditor }),
    [session, openEditor],
  );

  const onSave = (next: SessionIntake) => {
    try {
      writeSessionIntake(next);
      setSession(next);
      setOpen(false);
      setErrors({});
      setSaveError("");
    } catch {
      setSaveError("This browser blocked saving. Check private browsing settings, then try again.");
    }
  };

  return (
    <SessionIntakeContext.Provider value={contextValue}>
      <div
        className="size-full"
        aria-hidden={open || undefined}
        style={open ? { pointerEvents: "none" } : undefined}
      >
        {children}
      </div>
      {session && !open ? (
        <ChangeSessionChip session={session} onClick={openEditor} />
      ) : null}
      {open ? (
        <SessionIntakeModal
          draft={draft}
          setDraft={setDraft}
          errors={errors}
          setErrors={setErrors}
          saveError={saveError}
          blocking={blocking}
          onSave={onSave}
          onCancel={blocking ? undefined : () => setOpen(false)}
        />
      ) : null}
    </SessionIntakeContext.Provider>
  );
}

function ChangeSessionChip({
  session,
  onClick,
}: {
  session: SessionIntake;
  onClick: () => void;
}) {
  const { pathname } = useLocation();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const label = [session.clientName, session.sessionName].filter(Boolean).join(" · ");

  useEffect(() => {
    setSlot(document.getElementById(SESSION_HEADER_SLOT_ID));
  }, [pathname]);

  if (!slot) return null;

  return createPortal(
    <button
      type="button"
      className="report-card-print-hide"
      onClick={onClick}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      aria-label={`Change session: ${label}`}
      title={`Change session: ${label}`}
      onFocus={(e) => {
        setExpanded(true);
        e.currentTarget.style.outline = FOCUS_RING;
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        setExpanded(false);
        e.currentTarget.style.outline = "none";
      }}
      style={{
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: expanded ? "flex-start" : "center",
        gap: expanded ? 8 : 0,
        height: 32,
        width: expanded ? "auto" : 32,
        minWidth: 32,
        maxWidth: expanded ? 280 : 32,
        padding: expanded ? "0 12px 0 9px" : 0,
        overflow: "hidden",
        background: colors.offWhite,
        color: colors.offBlack,
        border: "none",
        borderLeft: `3px solid ${colors.yellow}`,
        cursor: "pointer",
        fontFamily: fonts.regular,
        fontSize: 12,
        lineHeight: 1.3,
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "max-width 220ms ease, padding 220ms ease, gap 220ms ease",
      }}
    >
      <Building2 size={15} strokeWidth={1.75} aria-hidden style={{ flexShrink: 0, display: "block" }} />
      <span
        style={{
          minWidth: 0,
          maxWidth: expanded ? 220 : 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: fonts.bold,
          fontSize: 12,
          lineHeight: 1.3,
          opacity: expanded ? 1 : 0,
          transition: "opacity 180ms ease, max-width 220ms ease",
        }}
      >
        {label}
      </span>
    </button>,
    slot,
  );
}

function SessionIntakeModal({
  draft,
  setDraft,
  errors,
  setErrors,
  saveError,
  blocking,
  onSave,
  onCancel,
}: {
  draft: SessionIntake;
  setDraft: (next: SessionIntake) => void;
  errors: SessionFieldErrors;
  setErrors: (next: SessionFieldErrors) => void;
  saveError: string;
  blocking: boolean;
  onSave: (next: SessionIntake) => void;
  onCancel?: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const errorId = useId();
  const errorList = Object.values(errors).filter(Boolean);
  const hasErrors = errorList.length > 0 || Boolean(saveError);
  const ctaLabel = draft.sessionName.trim()
    ? `Enter “${draft.sessionName.trim()}”`
    : "Enter the hub";

  useEffect(() => {
    firstFieldRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!blocking) onCancel?.();
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
  }, [blocking, onCancel]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateSessionIntake(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave(draft);
  };

  const patch = (key: SessionField, value: string) => {
    setDraft({ ...draft, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  return (
    <div
      role="presentation"
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: `color-mix(in srgb, ${colors.confidentBlack} 92%, transparent)`,
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <style>{`
        @keyframes sessionGateIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hasErrors ? errorId : undefined}
        style={{
          width: "min(92vw, 720px)",
          maxHeight: "92vh",
          overflowY: "auto",
          background: colors.white,
          animation: "sessionGateIn 220ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ height: 4, background: colors.yellow }} aria-hidden />
        <form onSubmit={onSubmit} style={{ padding: "28px 28px 24px" }} noValidate>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
              padding: "14px 16px",
              background: colors.confidentBlack,
              borderLeft: `3px solid ${colors.yellow}`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: colors.surfaceOnDark,
                color: colors.yellow,
              }}
              aria-hidden
            >
              <Building2 size={20} strokeWidth={1.75} />
            </div>
            <div style={{ minWidth: 0 }}>
              <EYHeading level={3} id={titleId} theme="dark">
                Session setup
              </EYHeading>
              <EYBody
                theme="dark"
                style={{ margin: "3px 0 0", color: colors.onDarkMuted, maxWidth: "none", lineHeight: 1.4 }}
              >
                Record this workshop so the hub is tagged to the right client.
              </EYBody>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {FIELD_IDS.map((field, index) => (
              <FieldControl
                key={field.key}
                fieldKey={field.key}
                label={field.label}
                type={field.type}
                autoComplete={field.autoComplete}
                options={field.options}
                value={draft[field.key]}
                error={errors[field.key]}
                inputRef={index === 0 ? firstFieldRef : undefined}
                onChange={(value) => patch(field.key, value)}
              />
            ))}
            <div>
              <span
                id={`${titleId}-mode`}
                style={{
                  display: "block",
                  fontFamily: fonts.bold,
                  fontSize: 13,
                  color: colors.offBlack,
                  marginBottom: 8,
                }}
              >
                Delivery mode
              </span>
              <TabRail<DeliveryMode>
                tabs={[
                  { id: "online", label: "Online" },
                  { id: "in-person", label: "In person" },
                ]}
                active={draft.deliveryMode}
                onChange={(id) => patch("deliveryMode", id)}
                style={{ marginBottom: 0, width: "100%", display: "flex" }}
              />
              {errors.deliveryMode ? (
                <p style={errorTextStyle}>{errors.deliveryMode}</p>
              ) : null}
            </div>
          </div>

          {hasErrors ? (
            <p id={errorId} role="alert" style={{ ...errorTextStyle, marginTop: 16 }}>
              {saveError || "Please fill the highlighted fields, then try again."}
            </p>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 16,
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            {onCancel ? (
              <EYButton type="button" variant="secondary" onClick={onCancel}>
                Keep current
              </EYButton>
            ) : null}
            <EYButton type="submit" variant="primary" arrow>
              {ctaLabel}
            </EYButton>
          </div>
        </form>
      </div>
    </div>
  );
}

const errorTextStyle: CSSProperties = {
  margin: "8px 0 0",
  fontFamily: fonts.regular,
  fontSize: 13,
  color: colors.error,
  lineHeight: 1.4,
};

function FieldControl({
  fieldKey,
  label,
  type,
  autoComplete,
  options,
  value,
  error,
  inputRef,
  onChange,
}: {
  fieldKey: SessionField;
  label: string;
  type: "text" | "date" | "number" | "select";
  autoComplete?: string;
  options?: readonly string[];
  value: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  onChange: (value: string) => void;
}) {
  const id = `session-${fieldKey}`;
  const describedBy = error ? `${id}-error` : undefined;
  const controlStyle: CSSProperties = {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: value ? colors.offBlack : colors.gray01,
    background: colors.offWhite,
    border: `1px solid ${error ? colors.error : colors.gray02}`,
    borderRadius: 6,
    padding: "11px 12px",
    lineHeight: 1.4,
    width: "100%",
  };

  return (
    <label htmlFor={id} style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span
        style={{
          fontFamily: fonts.bold,
          fontSize: 13,
          color: colors.offBlack,
          marginBottom: 8,
        }}
      >
        {label}
      </span>
      {type === "select" ? (
        <div style={{ position: "relative" }}>
          <select
            id={id}
            name={fieldKey}
            value={value}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...controlStyle, appearance: "none", paddingRight: 44, cursor: "pointer" }}
            onFocus={(e) => {
              e.currentTarget.style.outline = FOCUS_RING;
              e.currentTarget.style.outlineOffset = "1px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {(options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            strokeWidth={1.75}
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              right: 14,
              color: colors.gray01,
              pointerEvents: "none",
              transform: "translateY(-50%)",
            }}
          />
        </div>
      ) : (
        <input
          ref={inputRef}
          id={id}
          name={fieldKey}
          type={type}
          autoComplete={autoComplete}
          value={value}
          min={type === "number" ? (fieldKey === "totalParticipants" ? 1 : 0.5) : undefined}
          step={type === "number" ? (fieldKey === "totalParticipants" ? 1 : 0.5) : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...controlStyle, color: colors.offBlack }}
          onFocus={(e) => {
            e.currentTarget.style.outline = FOCUS_RING;
            e.currentTarget.style.outlineOffset = "1px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        />
      )}
      {error ? (
        <span id={`${id}-error`} style={errorTextStyle}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
