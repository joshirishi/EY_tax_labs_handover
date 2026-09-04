import { useState, type CSSProperties } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { colors, fonts } from "@/design-kit";

export const WORKSHOP_LIBRARY_PATH = "/workshop-library.html";

export function workshopLibraryUrl() {
  return `${window.location.origin}${WORKSHOP_LIBRARY_PATH}`;
}

function emailDraft(url: string) {
  const subject = "Workshop Reference Library — EY.ai Tax Labs";
  const body = [
    "Hi,",
    "",
    "I'm sharing the Workshop Reference Library from EY.ai Tax Labs.",
    "Open the link to browse Prompt and Agent templates. Click a book spine to read the worked example.",
    "",
    url,
    "",
  ].join("\n");
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function shareBtnStyle(): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 6,
    border: `1px solid ${colors.yellow}`,
    background: "transparent",
    color: colors.yellow,
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

/** Copy the standalone library link, or open a mail draft that includes it. */
export function WorkshopLibraryShareActions() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = workshopLibraryUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this library link", url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
      <button
        type="button"
        onClick={() => { void copyLink(); }}
        aria-label="Copy standalone library link"
        style={shareBtnStyle()}
      >
        {copied ? <Check size={14} strokeWidth={1.75} aria-hidden /> : <Copy size={14} strokeWidth={1.75} aria-hidden />}
        {copied ? "Link copied" : "Copy link"}
      </button>
      <a
        href={emailDraft(workshopLibraryUrl())}
        aria-label="Share library link by email"
        style={{ ...shareBtnStyle(), textDecoration: "none" }}
      >
        <Mail size={14} strokeWidth={1.75} aria-hidden />
        Share via email
      </a>
    </div>
  );
}
