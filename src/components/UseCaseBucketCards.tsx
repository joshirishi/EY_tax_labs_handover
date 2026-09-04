import { useState, type CSSProperties, type DragEvent } from "react";
import { GripVertical, PlusCircle, X } from "lucide-react";
import {
  USE_CASE_BUCKETS,
  type UseCaseBucketId,
} from "../data/use-case-buckets";
import { colors, fonts } from "../design-kit/tokens";

const DRAG_TYPE = "application/x-ey-use-case";

type DragPayload = { bucketId: UseCaseBucketId; index: number };

function readDragPayload(event: DragEvent): DragPayload | null {
  const raw = event.dataTransfer.getData(DRAG_TYPE) || event.dataTransfer.getData("text/plain");
  try {
    const parsed = JSON.parse(raw) as DragPayload;
    if (
      (parsed.bucketId === "prompt" || parsed.bucketId === "agent" || parsed.bucketId === "procode")
      && Number.isInteger(parsed.index)
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

type Props = {
  entries: Record<UseCaseBucketId, string[]>;
  editable?: boolean;
  drafts?: Record<UseCaseBucketId, string>;
  onDraftChange?: (bucketId: UseCaseBucketId, value: string) => void;
  onAdd?: (bucketId: UseCaseBucketId) => void;
  onRemove?: (bucketId: UseCaseBucketId, index: number) => void;
  onMove?: (fromBucket: UseCaseBucketId, fromIndex: number, toBucket: UseCaseBucketId, toIndex?: number) => void;
  sectionId?: string;
  /** Dark cards on black sections; light cards on grey/white sections. */
  tone?: "dark" | "light";
};

const cardBase: CSSProperties = {
  borderRadius: 10,
  padding: "clamp(20px, 2.5vw, 28px)",
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  minHeight: 320,
  height: "100%",
};

export function UseCaseBucketCards({
  entries,
  editable = false,
  drafts,
  onDraftChange,
  onAdd,
  onRemove,
  onMove,
  sectionId = "use-case-buckets",
  tone = "dark",
}: Props) {
  const [dropBucket, setDropBucket] = useState<UseCaseBucketId | null>(null);
  const canDrag = Boolean(editable && onMove);
  const focusRing = `2px solid ${colors.yellow}`;
  const light = tone === "light";
  const cardBg = light ? colors.white : colors.eyBgCard;
  const cardBorder = light ? "rgba(46,46,56,0.10)" : colors.borderOnDark;
  const hintColor = light ? colors.gray01 : colors.onDarkMuted;
  const emptyColor = light ? colors.gray01 : colors.onDarkSubtle;
  const wellBg = light ? colors.offWhite : colors.surfaceOnDark;
  const wellEmptyBorder = light ? colors.gray02 : colors.borderOnDark;
  const itemBorder = light ? "rgba(46,46,56,0.10)" : colors.borderOnDark;
  const itemText = light ? colors.offBlack : colors.onDark;
  const iconColor = light ? colors.gray01 : colors.onDarkMuted;
  const inputText = light ? colors.offBlack : colors.onDark;
  const addIdle = light ? colors.gray01 : colors.onDarkSubtle;

  return (
    <>
      {editable && (
        <style>{`
          #${sectionId} input::placeholder {
            color: ${light ? colors.gray01 : "rgba(255, 255, 255, 0.45)"};
          }
        `}</style>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "clamp(16px, 2vw, 24px)",
          alignItems: "stretch",
        }}
      >
        {USE_CASE_BUCKETS.map((bucket) => {
          const bucketEntries = entries[bucket.id];
          const isEmpty = bucketEntries.length === 0;
          const draftValue = drafts?.[bucket.id] ?? "";

          return (
            <div
              key={bucket.id}
              style={{
                ...cardBase,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderTop: `3px solid ${bucket.accent}`,
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: bucket.chipText,
                    background: bucket.accent,
                    borderRadius: 4,
                    padding: "3px 10px",
                  }}
                >
                  {bucket.label}
                </span>
              </div>
              <p
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 13,
                  color: hintColor,
                  margin: "0 0 16px",
                  lineHeight: 1.45,
                  minHeight: 38,
                }}
              >
                {bucket.hint}
              </p>

              <div
                onDragOver={(event) => {
                  if (!canDrag) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropBucket(bucket.id);
                }}
                onDragLeave={(event) => {
                  if (event.currentTarget.contains(event.relatedTarget as Node)) return;
                  setDropBucket((current) => (current === bucket.id ? null : current));
                }}
                onDrop={(event) => {
                  if (!canDrag || !onMove) return;
                  event.preventDefault();
                  setDropBucket(null);
                  const payload = readDragPayload(event);
                  if (!payload) return;
                  if (payload.bucketId === bucket.id && isEmpty) return;
                  onMove(payload.bucketId, payload.index, bucket.id);
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  border: `1.5px dashed ${dropBucket === bucket.id ? bucket.accent : (isEmpty ? wellEmptyBorder : `${bucket.accent}88`)}`,
                  borderRadius: 8,
                  padding: 14,
                  background: dropBucket === bucket.id
                    ? colors.yellowAlpha10
                    : (isEmpty ? wellBg : (light ? colors.offWhite : "rgba(255,255,255,0.04)")),
                  minHeight: 200,
                }}
              >
                {isEmpty ? (
                  <p
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 12,
                      color: emptyColor,
                      margin: 0,
                      lineHeight: 1.5,
                      fontStyle: "italic",
                    }}
                  >
                    {editable
                      ? "No use cases yet — add your first idea below."
                      : "No use cases in this bucket."}
                  </p>
                ) : (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                      overflowY: "auto",
                    }}
                  >
                    {bucketEntries.map((entry, index) => (
                      <li
                        key={`${bucket.id}-${index}-${entry}`}
                        draggable={canDrag}
                        onDragStart={(event) => {
                          if (!canDrag) return;
                          event.dataTransfer.setData(DRAG_TYPE, JSON.stringify({ bucketId: bucket.id, index }));
                          event.dataTransfer.setData("text/plain", JSON.stringify({ bucketId: bucket.id, index }));
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onDragEnd={() => setDropBucket(null)}
                        onDragOver={(event) => {
                          if (!canDrag) return;
                          event.preventDefault();
                          event.stopPropagation();
                          event.dataTransfer.dropEffect = "move";
                          setDropBucket(bucket.id);
                        }}
                        onDrop={(event) => {
                          if (!canDrag || !onMove) return;
                          event.preventDefault();
                          event.stopPropagation();
                          setDropBucket(null);
                          const payload = readDragPayload(event);
                          if (!payload) return;
                          onMove(payload.bucketId, payload.index, bucket.id, index);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          padding: "10px 12px",
                          borderRadius: 6,
                          background: wellBg,
                          border: `1px solid ${itemBorder}`,
                          cursor: canDrag ? "grab" : "default",
                        }}
                      >
                        {canDrag ? (
                          <GripVertical
                            size={14}
                            strokeWidth={1.75}
                            color={iconColor}
                            aria-hidden
                            style={{ flexShrink: 0, marginTop: 3 }}
                          />
                        ) : (
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: bucket.accent,
                              flexShrink: 0,
                              marginTop: 6,
                            }}
                          />
                        )}
                        <span
                          style={{
                            flex: 1,
                            fontFamily: fonts.regular,
                            fontSize: 13,
                            color: itemText,
                            lineHeight: 1.45,
                          }}
                        >
                          {entry}
                        </span>
                        {editable && onRemove && (
                          <button
                            type="button"
                            onClick={() => onRemove(bucket.id, index)}
                            aria-label={`Remove use case from ${bucket.label}`}
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              padding: 2,
                              color: iconColor,
                              flexShrink: 0,
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.outline = focusRing;
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.outline = "none";
                            }}
                          >
                            <X size={14} strokeWidth={1.75} aria-hidden />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {editable && onAdd && onDraftChange && (
                <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "stretch" }}>
                  <input
                    type="text"
                    value={draftValue}
                    onChange={(e) => onDraftChange(bucket.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onAdd(bucket.id);
                      }
                    }}
                    placeholder={bucket.placeholder}
                    aria-label={`Add ${bucket.label} use case`}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontFamily: fonts.regular,
                      fontSize: 13,
                      color: inputText,
                      background: wellBg,
                      border: `1px solid ${itemBorder}`,
                      borderRadius: 6,
                      padding: "10px 12px",
                      lineHeight: 1.4,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = focusRing;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onAdd(bucket.id)}
                    disabled={!draftValue.trim()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: fonts.bold,
                      fontSize: 12,
                      fontWeight: 700,
                      color: draftValue.trim() ? colors.confidentBlack : addIdle,
                      background: draftValue.trim() ? colors.yellow : wellBg,
                      border: `1px solid ${draftValue.trim() ? colors.yellow : itemBorder}`,
                      borderRadius: 6,
                      padding: "10px 14px",
                      cursor: draftValue.trim() ? "pointer" : "not-allowed",
                      whiteSpace: "nowrap",
                    }}
                    onFocus={(e) => {
                      if (draftValue.trim()) e.currentTarget.style.outline = focusRing;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = "none";
                    }}
                  >
                    <PlusCircle size={14} strokeWidth={1.75} aria-hidden />
                    Add
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
