import { useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { ELEMENTS, ELEM_FACETS } from "../data/prompt-elements";
import { colors as C, fonts as F } from "../design-kit/tokens";

function MatchResultBadge({ kind, label }: { kind: "ok" | "bad"; label: string }) {
  const color = kind === "ok" ? C.success : C.destructive;
  const Icon = kind === "ok" ? Check : X;
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        background: color + "14",
        color,
        flexShrink: 0,
      }}
    >
      <Icon size={14} strokeWidth={2} aria-hidden />
    </span>
  );
}

/** Left nav + What / Why / Without / With detail — same shell as Prompt like a Pro. */
export function EightElementsPane() {
  const [selectedId, setSelectedId] = useState(ELEMENTS[0].id);
  const elem = ELEMENTS.find(e => e.id === selectedId) ?? ELEMENTS[0];
  const focusRing = `2px solid ${C.yellow}`;

  return (
    <div className="pt-wizard" style={{
      border: `1px solid rgba(46,46,56,0.10)`,
      borderRadius: 12,
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "minmax(260px, 300px) 1fr",
      height: 760,
      textAlign: "left",
      background: C.white,
    }}>
      <nav aria-label="Prompt elements" style={{
        background: C.offWhite,
        borderRight: `1px solid rgba(46,46,56,0.08)`,
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}>
        <div style={{ padding: "0 20px 16px", borderBottom: `1px solid rgba(46,46,56,0.08)` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gray01, fontFamily: F.bold, marginBottom: 4 }}>
            Prompt like a Pro — Elements
          </div>
          <div style={{ fontSize: 13, color: C.offBlack, fontFamily: F.regular, lineHeight: 1.5 }}>
            Pick an element to explore.
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
          {ELEMENTS.map(item => {
            const active = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => setSelectedId(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  marginBottom: 2,
                  background: active ? C.confidentBlack : "transparent",
                  border: active ? "none" : "1px solid transparent",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onFocus={e => { e.currentTarget.style.outline = focusRing; }}
                onBlur={e => { e.currentTarget.style.outline = "none"; }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: active ? C.yellow : item.color + "18",
                  border: `1.5px solid ${active ? C.yellow : item.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800,
                  color: C.confidentBlack,
                  fontFamily: F.bold,
                }}>
                  {item.id}
                </span>
                <span style={{
                  flex: 1, minWidth: 0,
                  fontSize: 13, fontWeight: 700,
                  color: active ? C.white : C.confidentBlack,
                  fontFamily: F.bold,
                }}>
                  {item.name}
                </span>
                <ChevronRight size={14} color={active ? C.yellow : C.gray01} style={{ flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{ display: "flex", flexDirection: "column", background: C.white, minHeight: 0 }}>
        <div style={{
          padding: "16px 24px",
          background: C.confidentBlack,
          borderBottom: `1px solid ${C.borderOnDark}`,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          flexShrink: 0,
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            background: C.yellow, color: C.confidentBlack,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, fontFamily: F.bold,
          }}>
            {elem.id}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.onDark, fontFamily: F.bold }}>{elem.name}</span>
          <span style={{ fontSize: 11, color: C.yellow, fontWeight: 700, fontFamily: F.bold }}>{elem.q}</span>
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {ELEM_FACETS.map(f => {
            const isExample = f.key === "without" || f.key === "with";
            const text = elem[f.key];
            return (
              <section key={f.key} aria-labelledby={`elem-facet-${elem.id}-${f.key}`}>
                <span
                  id={`elem-facet-${elem.id}-${f.key}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    padding: "4px 10px",
                    borderRadius: 100,
                    border: `1px solid ${f.color}55`,
                    background: f.color + "14",
                    fontSize: 12,
                    fontWeight: 700,
                    color: f.color,
                    fontFamily: F.bold,
                    lineHeight: 1.3,
                  }}
                >
                  {f.key === "without" && <MatchResultBadge kind="bad" label="Without this element" />}
                  {f.key === "with" && <MatchResultBadge kind="ok" label="With this element" />}
                  {f.label}
                </span>
                <p style={{
                  fontSize: isExample ? 14 : 16,
                  lineHeight: 1.7,
                  color: f.key === "without" ? C.destructive : f.key === "with" ? C.success : C.offBlack,
                  fontFamily: isExample ? F.light : F.regular,
                  fontStyle: isExample ? "italic" : "normal",
                  margin: 0,
                  maxWidth: 560,
                  padding: isExample ? "14px 18px" : 0,
                  background: isExample
                    ? f.key === "without" ? C.destructive + "0a" : C.success + "0a"
                    : "transparent",
                  borderRadius: isExample ? 8 : 0,
                  borderLeft: isExample ? `3px solid ${f.color}` : "none",
                }}>
                  {text}
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
