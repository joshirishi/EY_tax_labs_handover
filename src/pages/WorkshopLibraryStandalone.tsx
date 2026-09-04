import { PromptBookshelfLibrary } from "../components/PromptBookshelfLibrary";
import { colors, contentRailStyle, fonts, spacing, typeScale } from "../design-kit";

/** Standalone library page — shelf and book reader only, for sharing. */
export default function WorkshopLibraryStandalone() {
  return (
    <div
      style={{
        minHeight: "100%",
        background: colors.confidentBlack,
        padding: `${spacing.sectionPaddingY} 0`,
      }}
    >
      <div style={contentRailStyle}>
        <h1
          style={{
            fontFamily: fonts.bold,
            fontSize: typeScale.h2.size,
            letterSpacing: typeScale.h2.tracking,
            color: colors.onDark,
            margin: "0 0 8px",
          }}
        >
          Workshop Reference Library
        </h1>
        <p
          style={{
            fontFamily: fonts.regular,
            fontSize: typeScale.body.size,
            color: colors.onDarkMuted,
            margin: "0 0 24px",
            lineHeight: 1.5,
          }}
        >
          Browse Prompt and Agent templates. Click a spine to open a book.
        </p>
        <PromptBookshelfLibrary />
      </div>
    </div>
  );
}
