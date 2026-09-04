/**
 * Workshop Reference Library — physical bookshelf metaphor.
 * Browse spines on shelves, pull a book forward, read its template in a modal.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  BookMarked,
  BookOpen,
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Library,
  X,
} from "lucide-react";
import { AGENT_TEMPLATE_LIBRARY } from "@/data/agent-template-library";
import {
  PROMPT_LIBRARY,
  PROMPT_LIBRARY_FILTERS,
  PROMPT_LIBRARY_WHY_TYPE_FILTERS,
  type PromptLibraryCategory,
  type PromptLibraryEntry,
  type PromptLibraryWhyType,
} from "@/data/prompt-library";
import { colors, fonts, spacing, typeScale } from "@/design-kit";

type LibraryKind = "prompt" | "agent";

const LIBRARY_TABS: { id: LibraryKind; label: string; icon: typeof FileText }[] = [
  { id: "prompt", label: "Prompt Template Library", icon: FileText },
  { id: "agent", label: "Agent Template Library", icon: Bot },
];

const CATEGORY_SPINE: Record<PromptLibraryCategory, string> = {
  Research: colors.frameBlue,
  Compliance: colors.frameGreen,
  "Planning and Communication": colors.framePurple,
  Data: colors.frameOrange,
};

const SPINE_HEIGHTS = [176, 192, 208, 224] as const;

/** Fixed reading-panel height so every book opens at the same size. */
const READING_PANEL_HEIGHT = "80vh";

type CategoryFilterId = "all" | PromptLibraryCategory;
type WhyTypeFilterId = "all" | PromptLibraryWhyType;

function matchesCategory(entry: PromptLibraryEntry, categoryFilter: CategoryFilterId) {
  return categoryFilter === "all" || entry.category === categoryFilter;
}

function matchesWhyType(entry: PromptLibraryEntry, whyTypeFilter: WhyTypeFilterId) {
  return whyTypeFilter === "all" || entry.capabilities.includes(whyTypeFilter);
}

/** Copy + Download as one mark — Lucide has no combined ClipboardDown in this version. */
function CopyDownloadIcon() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }} aria-hidden>
      <Copy size={13} strokeWidth={1.75} />
      <Download size={13} strokeWidth={1.75} />
    </span>
  );
}

/** Same text as the page body paragraphs — no title, category, or page labels. */
function promptBodyText(entry: PromptLibraryEntry) {
  return entry.slides.map((slide) => slide.body).join("\n\n");
}

/** Copies the visible prompt text, then saves the same text as a .txt file. */
async function copyAndDownloadPrompt(entry: PromptLibraryEntry, kind: LibraryKind) {
  const text = promptBodyText(entry);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const suffix = kind === "agent" ? "agent" : "prompt";
  link.download = `${entry.name.replace(/[^\w]+/g, "-").toLowerCase()}-${suffix}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // File still downloads if the browser blocks clipboard access.
  }
}

function filterChipStyle(isActive: boolean): CSSProperties {
  return {
    padding: "8px 16px",
    borderRadius: 6,
    border: `1px solid ${isActive ? colors.yellow : colors.borderOnDark}`,
    background: isActive ? colors.yellowAlpha12 : colors.surfaceOnDark,
    color: isActive ? colors.yellow : colors.onDarkMuted,
    fontFamily: isActive ? fonts.bold : fonts.regular,
    fontSize: typeScale.caption.size,
    fontWeight: isActive ? 700 : 400,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "border-color 150ms, background 150ms",
  };
}

function filterCountStyle(isActive: boolean): CSSProperties {
  return {
    fontFamily: fonts.bold,
    fontSize: 10,
    padding: "1px 6px",
    borderRadius: 10,
    background: isActive ? colors.yellowAlpha10 : colors.borderOnDark,
    color: isActive ? colors.confidentBlack : colors.onDarkSubtle,
  };
}

function spineHeight(entry: PromptLibraryEntry) {
  return SPINE_HEIGHTS[entry.id % SPINE_HEIGHTS.length];
}

function shelfBoardStyle(): CSSProperties {
  return {
    width: "100%",
    height: 16,
    marginTop: 0,
    borderRadius: "0 0 4px 4px",
    background: `linear-gradient(180deg, ${colors.offBlack} 0%, ${colors.confidentBlack} 55%, ${colors.confidentBlack} 100%)`,
    boxShadow: `0 6px 16px ${colors.onDarkSubtle}, inset 0 1px 0 ${colors.onDarkMuted}`,
    position: "relative",
  };
}

function shelfLipStyle(): CSSProperties {
  return {
    position: "absolute",
    top: -3,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: "2px 2px 0 0",
    background: `linear-gradient(180deg, ${colors.gray01}, ${colors.offBlack})`,
  };
}

export function PromptBookshelfLibrary() {
  const [libraryKind, setLibraryKind] = useState<LibraryKind>("prompt");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterId>("all");
  const [whyTypeFilter, setWhyTypeFilter] = useState<WhyTypeFilterId>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [packSaved, setPackSaved] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const catalog = libraryKind === "prompt" ? PROMPT_LIBRARY : AGENT_TEMPLATE_LIBRARY;
  const activeLibrary = LIBRARY_TABS.find((tab) => tab.id === libraryKind) ?? LIBRARY_TABS[0];

  const resetSelection = useCallback(() => {
    setSelectedId(null);
    setSlide(0);
  }, []);

  const switchLibrary = useCallback((kind: LibraryKind) => {
    setLibraryKind(kind);
    setCategoryFilter("all");
    setWhyTypeFilter("all");
    setSelectedId(null);
    setSlide(0);
  }, []);

  const filtered = useMemo(
    () =>
      catalog.filter(
        (entry) =>
          matchesCategory(entry, categoryFilter) &&
          matchesWhyType(entry, whyTypeFilter),
      ),
    [catalog, categoryFilter, whyTypeFilter],
  );

  const whyTypeFiltersWithCounts = useMemo(
    () =>
      PROMPT_LIBRARY_WHY_TYPE_FILTERS.map((f) => ({
        ...f,
        count:
          f.id === "all"
            ? catalog.filter((entry) => matchesCategory(entry, categoryFilter)).length
            : catalog.filter(
                (entry) =>
                  entry.capabilities.includes(f.id) &&
                  matchesCategory(entry, categoryFilter),
              ).length,
      })),
    [catalog, categoryFilter],
  );

  const visibleWhyTypeFilters = useMemo(
    () => whyTypeFiltersWithCounts.filter((f) => f.id === "all" || f.count > 0),
    [whyTypeFiltersWithCounts],
  );

  useEffect(() => {
    if (whyTypeFilter === "all") return;
    const stillVisible = whyTypeFiltersWithCounts.some(
      (f) => f.id === whyTypeFilter && f.count > 0,
    );
    if (!stillVisible) {
      setWhyTypeFilter("all");
      resetSelection();
    }
  }, [whyTypeFilter, whyTypeFiltersWithCounts, resetSelection]);

  const selected = useMemo(
    () => filtered.find((b) => b.id === selectedId) ?? null,
    [filtered, selectedId],
  );

  const selectBook = useCallback((entry: PromptLibraryEntry) => {
    setSelectedId((prev) => (prev === entry.id ? null : entry.id));
    setSlide(0);
    setPackSaved(false);
  }, []);

  const closeReading = useCallback(() => {
    setSelectedId(null);
  }, []);

  useEffect(() => {
    if (!selected) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeReading();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSlide((s) => Math.min(s + 1, selected.slides.length - 1));
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSlide((s) => Math.max(s - 1, 0));
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
  }, [selected, closeReading]);

  return (
    <div>
      {/* Library alcove — dark reading-room backdrop for the shelves */}
      <div
        style={{
          background: `linear-gradient(165deg, ${colors.confidentBlack} 0%, ${colors.offBlack} 48%, ${colors.confidentBlack} 100%)`,
          borderRadius: 12,
          padding: spacing.cardPadding,
          border: `1px solid ${colors.borderOnDark}`,
          boxShadow: `0 12px 40px ${colors.onDarkSubtle}`,
        }}
      >
        <div
          role="tablist"
          aria-label="Template libraries"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {LIBRARY_TABS.map((tab) => {
            const isActive = libraryKind === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => switchLibrary(tab.id)}
                style={{
                  ...filterChipStyle(isActive),
                  padding: "10px 16px",
                  fontSize: typeScale.caption.size,
                }}
              >
                <Icon size={14} strokeWidth={1.75} aria-hidden />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Library header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: `1px solid ${colors.borderOnDark}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: colors.surfaceOnDark,
                border: `1px solid ${colors.borderOnDark}`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.yellow,
              }}
              aria-hidden
            >
              <Library size={20} strokeWidth={1.75} />
            </div>
            <p
              style={{
                fontFamily: fonts.light,
                fontSize: typeScale.body.size,
                color: colors.onDark,
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              Click a spine to open it. Use arrow keys to turn pages.
            </p>
          </div>
        </div>

        {/* Library section filters */}
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              fontFamily: fonts.bold,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.onDarkSubtle,
              margin: "0 0 8px",
            }}
          >
            Section
          </p>
          <div
            role="tablist"
            aria-label="Library sections"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {PROMPT_LIBRARY_FILTERS.map((f) => {
              const isActive = categoryFilter === f.id;
              const count =
                f.id === "all"
                  ? catalog.filter((entry) => matchesWhyType(entry, whyTypeFilter)).length
                  : catalog.filter(
                      (entry) => entry.category === f.id && matchesWhyType(entry, whyTypeFilter),
                    ).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setCategoryFilter(f.id);
                    resetSelection();
                  }}
                  style={filterChipStyle(isActive)}
                >
                  {f.label}
                  <span style={filterCountStyle(isActive)}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              fontFamily: fonts.bold,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.onDarkSubtle,
              margin: "0 0 8px",
            }}
          >
            Task type
          </p>
          <div
            role="tablist"
            aria-label="Task type filters"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {visibleWhyTypeFilters.map((f) => {
              const isActive = whyTypeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setWhyTypeFilter(f.id);
                    resetSelection();
                  }}
                  style={filterChipStyle(isActive)}
                >
                  {f.label}
                  <span style={filterCountStyle(isActive)}>{f.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Single shelf — all books in one row, scroll on narrow viewports */}
        {filtered.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              padding: "48px 24px",
              fontFamily: fonts.regular,
              color: colors.onDarkMuted,
              margin: 0,
            }}
          >
            No templates match these filters
          </p>
        ) : (
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                position: "relative",
                overflowX: "auto",
                overflowY: "visible",
                WebkitOverflowScrolling: "touch",
                paddingBottom: 4,
              }}
            >
              <div
                role="group"
                aria-label="Prompt template books"
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  gap: 0,
                  minWidth: "min-content",
                  padding: "20px 8px 0",
                }}
              >
                {filtered.map((book) => {
                  const isSelected = selectedId === book.id;
                  const height = spineHeight(book);
                  const spineColor = CATEGORY_SPINE[book.category];
                  return (
                    <button
                      key={book.id}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`${book.name}, ${book.category}, book ${book.id}`}
                      onClick={() => selectBook(book)}
                      style={{
                        width: 62,
                        flexShrink: 0,
                        margin: "0 2px",
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        transformOrigin: "bottom center",
                        transform: isSelected
                          ? "translateY(-18px) scale(1.05)"
                          : undefined,
                        transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                        zIndex: isSelected ? 12 : 1,
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = `2px solid ${colors.yellow}`;
                        e.currentTarget.style.outlineOffset = "2px";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.outline = "none";
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = "translateY(-10px) scale(1.03)";
                          e.currentTarget.style.zIndex = "8";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.zIndex = "1";
                        }
                      }}
                    >
                      <div
                        style={{
                          height,
                          borderRadius: "3px 6px 6px 3px",
                          background: `linear-gradient(90deg, ${colors.confidentBlack} 0%, ${spineColor} 12%, ${spineColor} 100%)`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px 4px",
                          boxShadow: isSelected
                            ? `0 8px 20px ${colors.onDarkSubtle}, 0 0 0 2px ${colors.yellow}`
                            : `2px 4px 10px ${colors.onDarkSubtle}`,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Spine edge highlight */}
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 4,
                            background: colors.confidentBlack,
                            opacity: 0.45,
                          }}
                        />
                        <span
                          style={{
                            writingMode: "vertical-rl",
                            textOrientation: "mixed",
                            fontFamily: fonts.bold,
                            fontSize: typeScale.label.size,
                            fontWeight: typeScale.label.weight,
                            letterSpacing: typeScale.label.tracking,
                            color: colors.white,
                            maxHeight: height - 52,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {book.name}
                        </span>
                        <span
                          style={{
                            writingMode: "vertical-rl",
                            fontFamily: fonts.regular,
                            fontSize: typeScale.caption.size,
                            fontWeight: typeScale.caption.weight,
                            color: colors.onDarkMuted,
                            marginTop: 8,
                          }}
                        >
                          #{book.id}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Shelf board */}
            <div aria-hidden style={shelfBoardStyle()}>
              <div style={shelfLipStyle()} />
            </div>
            <div
              aria-hidden
              style={{
                height: 10,
                margin: "0 24px",
                background: colors.onDarkSubtle,
                filter: "blur(8px)",
                borderRadius: "50%",
                opacity: 0.5,
              }}
            />
          </div>
        )}
      </div>

      {/* Open book — modal reading panel (pattern: TemplatePreviewModal) */}
      {selected && (
        <div
          role="presentation"
          onClick={closeReading}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: `color-mix(in srgb, ${colors.confidentBlack} 72%, transparent)`,
            backdropFilter: "blur(6px)",
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
            aria-labelledby={`reading-title-${selected.id}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 12,
              width: "min(94vw, 880px)",
              animation: "bookshelfModalIn 220ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={closeReading}
              aria-label="Close book"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: colors.surfaceOnDark,
                border: `1px solid ${colors.borderOnDark}`,
                color: colors.onDark,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={22} strokeWidth={1.75} aria-hidden />
            </button>
            <div
              role="region"
              aria-label={`Reading ${selected.name}`}
              style={{
                width: "100%",
                height: READING_PANEL_HEIGHT,
                minHeight: READING_PANEL_HEIGHT,
                maxHeight: READING_PANEL_HEIGHT,
                display: "flex",
                flexDirection: "column",
                borderRadius: 12,
                overflow: "hidden",
                border: `1px solid ${colors.gray02}`,
                background: colors.white,
                boxShadow: `0 24px 64px color-mix(in srgb, ${colors.confidentBlack} 60%, transparent)`,
              }}
            >
          {/* Book header — cover strip */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              minHeight: 72,
              flexShrink: 0,
              background: `linear-gradient(90deg, ${CATEGORY_SPINE[selected.category]} 0%, ${colors.offBlack} 100%)`,
            }}
          >
            <div
              style={{
                width: 72,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: colors.surfaceOnDark,
                borderRight: `1px solid ${colors.borderOnDark}`,
                color: colors.yellow,
              }}
              aria-hidden
            >
              <BookOpen size={28} strokeWidth={1.75} />
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  id={`reading-title-${selected.id}`}
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: typeScale.subheading.size,
                    color: colors.onDark,
                    margin: 0,
                    letterSpacing: typeScale.subheading.tracking,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selected.name}
                </h3>
                <p
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: typeScale.caption.size,
                    color: colors.onDarkMuted,
                    margin: "4px 0 0",
                  }}
                >
                  {selected.category} · {libraryKind === "agent" ? "Agent" : "Template"} #{selected.id}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 8,
                  flexShrink: 0,
                  marginLeft: "auto",
                  maxWidth: "min(100%, 360px)",
                }}
              >
                {selected.capabilities.map((cap) => (
                  <span
                    key={cap}
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: 10,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: 4,
                      background: colors.yellowAlpha12,
                      color: colors.yellow,
                      border: `1px solid ${colors.borderOnDark}`,
                    }}
                  >
                    {cap}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    void copyAndDownloadPrompt(selected, libraryKind).then(() => {
                      setPackSaved(true);
                      window.setTimeout(() => setPackSaved(false), 2000);
                    });
                  }}
                  aria-label="Copy prompt to clipboard and download as a text file"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: fonts.bold,
                    fontSize: 12,
                    fontWeight: 700,
                    color: colors.confidentBlack,
                    background: colors.yellow,
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 14px",
                    cursor: "pointer",
                  }}
                >
                  {packSaved ? <Check size={14} strokeWidth={1.75} aria-hidden /> : <CopyDownloadIcon />}
                  {packSaved ? "Copied & saved" : "Copy & download"}
                </button>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: 0,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
            }}
          >
            {/* Left page margin — book gutter */}
            <div
              aria-hidden
              style={{
                width: 28,
                flexShrink: 0,
                background: colors.offWhite,
                borderRight: `1px solid ${colors.gray02}`,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: 32,
              }}
            >
              <BookMarked size={14} strokeWidth={1.75} color={colors.gray01} />
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "24px 16px 32px",
              }}
            >
              <button
                type="button"
                onClick={() => setSlide((s) => Math.max(0, s - 1))}
                disabled={slide === 0}
                aria-label="Previous page"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  border: `1px solid ${colors.gray02}`,
                  background: colors.offWhite,
                  cursor: slide === 0 ? "not-allowed" : "pointer",
                  opacity: slide === 0 ? 0.4 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.offBlack,
                  flexShrink: 0,
                }}
              >
                <ChevronLeft size={20} strokeWidth={1.75} />
              </button>

              <div style={{ flex: 1, textAlign: "left", padding: "0 8px", minWidth: 0 }}>
                <h4
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: "clamp(16px, 2vw, 22px)",
                    color: colors.confidentBlack,
                    margin: "0 0 16px",
                    letterSpacing: typeScale.h2.tracking,
                    lineHeight: 1.3,
                  }}
                >
                  {selected.slides[slide].sub}
                </h4>
                <p
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: typeScale.body.size,
                    color: colors.gray01,
                    lineHeight: 1.65,
                    margin: 0,
                    maxWidth: "100%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selected.slides[slide].body}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSlide((s) => Math.min(selected.slides.length - 1, s + 1))
                }
                disabled={slide === selected.slides.length - 1}
                aria-label="Next page"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  border: `1px solid ${colors.gray02}`,
                  background: colors.offWhite,
                  cursor:
                    slide === selected.slides.length - 1 ? "not-allowed" : "pointer",
                  opacity: slide === selected.slides.length - 1 ? 0.4 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.offBlack,
                  flexShrink: 0,
                }}
              >
                <ChevronRight size={20} strokeWidth={1.75} />
              </button>
            </div>

            {/* Right page margin */}
            <div
              aria-hidden
              style={{
                width: 28,
                flexShrink: 0,
                background: colors.offWhite,
                borderLeft: `1px solid ${colors.gray02}`,
              }}
            />
          </div>

          {/* Page tabs + footer */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 20px 16px",
              borderTop: `1px solid ${colors.gray02}`,
              background: colors.offWhite,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {selected.slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlide(i)}
                  aria-label={`Page ${i + 1}`}
                  aria-current={i === slide ? "page" : undefined}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 4,
                    border: `1px solid ${i === slide ? colors.confidentBlack : colors.gray02}`,
                    background: i === slide ? colors.yellow : colors.white,
                    fontFamily: fonts.regular,
                    fontSize: typeScale.caption.size,
                    color: colors.offBlack,
                    cursor: "pointer",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p
              style={{
                fontFamily: fonts.regular,
                fontSize: typeScale.caption.size,
                color: colors.gray01,
                margin: 0,
              }}
            >
              Page {slide + 1} of {selected.slides.length}
            </p>
          </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes bookshelfModalIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
