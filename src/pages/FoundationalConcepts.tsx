/**
 * Foundational Concepts — native page (no iframe).
 *
 * The lesson still lives as HTML in src/imports/Foundational_Concepts.html, but
 * is rendered into the main document so elements are selectable. Styles are
 * soft-scoped under #module-content and remapped onto EY design-kit tokens so
 * spacing/colours match the rest of the app (and aren't crushed by a
 * high-specificity universal reset).
 */

import { useEffect, useMemo, useRef } from "react";
import foundationalHtml from "../imports/Foundational_Concepts.html?raw";
import { ModuleHeader, SUBNAV_SCROLL_MARGIN, SUBNAV_SCROLL_OFFSET, useModuleSectionHashScroll } from "../design-kit/LearningNav";
import { SiteHeader } from "../design-kit/SiteHeader";
import { EYWhatsNext } from "../design-kit/EYWhatsNext";
import { colors, fonts, layout, spacing, typeScale } from "../design-kit/tokens";

/**
 * Token bridge — maps the lesson HTML's CSS custom properties onto the
 * design-kit values so section padding / EY yellow / type stay consistent
 * with the rest of Tax Labs.
 */
const TOKEN_BRIDGE = `
#module-content {
  /* Colour tokens (design-kit) */
  --ey-yellow: ${colors.yellow};
  --eyebrow-gold: ${colors.eyebrowGold};
  --white: ${colors.white};
  --off-white: ${colors.offWhite};
  --gray-02: ${colors.gray02};
  --gray-01: ${colors.gray01};
  --ey-dark: ${colors.offBlack};
  --confident-black: ${colors.confidentBlack};
  --muted-foreground: ${colors.gray01};

  /* Surface aliases used by the lesson CSS */
  --ey-bg: ${colors.white};
  --ey-bg-alt: ${colors.offWhite};
  --ey-bg-deep: ${colors.offWhite};
  --card-bg: ${colors.white};
  --text-secondary: ${colors.gray01};
  --surface-neutral: ${colors.offWhite};
  --accent-blue: ${colors.frameBlue};
  --accent-green: ${colors.frameGreen};
  --accent-purple: ${colors.framePurple};
  --accent-orange: ${colors.frameOrange};

  /* Dark-module tokens (design-kit) */
  --ey-on-dark: ${colors.onDark};
  --ey-on-dark-72: ${colors.onDarkMuted};
  --ey-on-dark-55: ${colors.onDarkSubtle};
  --ey-surface-on-dark: ${colors.surfaceOnDark};
  --ey-border-on-dark: ${colors.borderOnDark};
  --ey-yellow-alpha-10: ${colors.yellowAlpha10};
  --ey-bg-card: ${colors.eyBgCard};
  --ey-card-deep: #54545F;

  /* Spacing + global content rail (change layout.contentWidth once → all pages) */
  --ey-content-width: ${layout.contentWidth};
  --ey-content-inline-pad: calc((100% - var(--ey-content-width)) / 2);
  --section-padding: ${spacing.sectionPaddingY} var(--ey-content-inline-pad);
  --card-padding: ${spacing.cardPadding};

  font-family: ${fonts.regular};
  background: ${colors.white};
  color: ${colors.offBlack};
  line-height: 1.6;
  scroll-behavior: smooth;
}

/* Reality Check — EY Off White light-grey band */
#module-content .wrong-section,
#module-content #reality-check {
  background: ${colors.offWhite} !important;
}

/* Reality Check — center the intro block (title + sub; hint commented out in HTML) */
#module-content .wrong-title,
#module-content .wrong-sub,
#module-content .wrong-hint {
  text-align: center;
}

/* Strategic Divide — paths footer callout (EY yellow + kit radius) */
#module-content .paths-footer {
  background: ${colors.yellow};
  border-radius: 12px;
  padding: 24px 32px;
}
#module-content .paths-footer-msg {
  color: ${colors.offBlack};
}
#module-content .paths-cta {
  background: ${colors.confidentBlack};
  color: ${colors.white};
}

/* Rise of AI — dark card surfaces (Figma 3645:4189) */
#module-content .rise-card,
#module-content .rise-card-body,
#module-content .rise-card-top--img {
  background: var(--ey-card-deep);
}
#module-content .rise-card {
  border-color: var(--ey-card-deep);
  border-top-width: 4px;
}
#module-content .rise-card-top--img::after {
  background: linear-gradient(0deg, var(--ey-card-deep) 0%, transparent 100%);
}
#module-content .rise-card-meta .source {
  color: ${colors.yellow};
}
#module-content .rise-card-meta .source::before {
  background: ${colors.yellow};
}
#module-content .rise-card-body p {
  color: ${colors.onDark};
  font-family: ${fonts.light};
  font-weight: 300;
}
#module-content .rise-card-body .date {
  border-top: none;
  color: ${colors.gray02};
}

/* Reality Check — dark news cards (Figma 3646:4189 / 3519:3125, rise-card device) */
#module-content .wrong-card,
#module-content .wrong-card-body,
#module-content .wrong-card-top {
  background: var(--ey-card-deep);
}
#module-content .wrong-card {
  border-color: var(--ey-card-deep);
  border-top-width: 4px;
}
#module-content .wrong-card-top::after {
  background: linear-gradient(0deg, var(--ey-card-deep) 0%, transparent 100%);
}
#module-content .wrong-card-meta .source {
  color: ${colors.error};
}
#module-content .wrong-card-meta .source::before {
  background: ${colors.yellow};
}
#module-content .wrong-card-meta .source::after {
  background: ${colors.error};
}
#module-content .wrong-card-body p {
  color: ${colors.onDark};
  font-family: ${fonts.light};
  font-weight: 300;
}
#module-content .wrong-card-body .date {
  border-top: none;
  color: ${colors.gray02};
}

/* Restore intended section breathing room (lesson used 90px 60px / 80px / 64px;
   unify major .section blocks on the kit's section padding). */
#module-content .section,
#module-content .rise-section,
#module-content .wrong-section,
#module-content .paths-section,
#module-content .gva-section,
#module-content .cheat-section {
  padding: var(--section-padding);
}

/* Cheat Sheet — pin EY kit surfaces so dark glass styles cannot leak back in */
#module-content .cheat-section {
  --cheat-row-closed: color-mix(in srgb, ${colors.offWhite} 92%, ${colors.offBlack} 8%);
  background: ${colors.offWhite} !important;
  color: ${colors.offBlack};
  border-bottom: 1px solid ${colors.gray02};
}
#module-content .cheat-title { color: ${colors.offBlack} !important; }
#module-content .cheat-subtitle { color: ${colors.gray01} !important; }
#module-content .cheat-card {
  background: ${colors.white};
  border: 1px solid ${colors.gray02};
  border-radius: 8px;
}
#module-content .cheat-card h3 { color: ${colors.offBlack}; }
#module-content .cheat-card-desc { color: ${colors.gray01}; }
#module-content .cheat-card-eg {
  background: ${colors.offWhite};
  border: 1px solid ${colors.gray02};
  border-left: 3px solid ${colors.yellow};
  color: ${colors.offBlack};
  border-radius: 6px;
  padding: 10px 12px;
  width: 100%;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: anywhere;
}
#module-content .cheat-columns { width: 100%; max-width: none; gap: 12px; }

/* Cheat Sheet row headers — EY dark-module surface; accent via ::before */
#module-content .cheat-col-head {
  position: relative;
  background: ${colors.eyBgCard};
  color: ${colors.onDark};
  border: 1px solid ${colors.borderOnDark};
  border-radius: 8px;
  padding: 16px;
  min-height: 56px;
  box-sizing: border-box;
}
#module-content .cheat-col-head::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: ${colors.borderOnDark};
}
#module-content .cheat-col:not([open]) .cheat-col-head {
  background: var(--cheat-row-closed);
  border-color: ${colors.gray02};
  color: ${colors.offBlack};
  border-radius: 8px;
}
#module-content .cheat-col:not([open]) .cheat-chevron {
  color: ${colors.gray01};
}
#module-content .cheat-col[open] .cheat-col-head {
  border-radius: 8px 0 0 8px;
  border-right: none;
}
#module-content .cheat-chevron { color: ${colors.onDarkMuted}; }
#module-content .cheat-col[data-tone="create"] .cheat-col-head {
  color: ${colors.onDark};
}
#module-content .cheat-col:not([open])[data-tone="create"] .cheat-col-head {
  color: ${colors.offBlack};
}
#module-content .cheat-col[data-tone="create"] .cheat-col-head::before { background: ${colors.yellow}; }
#module-content .cheat-col[data-tone="create"] .cheat-col-label { color: ${colors.onDark}; }
#module-content .cheat-col:not([open])[data-tone="create"] .cheat-col-label { color: ${colors.offBlack}; }
#module-content .cheat-col[data-tone="create"] .cheat-col-label svg { color: ${colors.yellow}; }
#module-content .cheat-col[data-tone="understand"] .cheat-col-head { color: ${colors.frameBlue}; }
#module-content .cheat-col[data-tone="understand"] .cheat-col-head::before { background: ${colors.frameBlue}; }
#module-content .cheat-col[data-tone="organize"] .cheat-col-head { color: ${colors.frameGreen}; }
#module-content .cheat-col[data-tone="organize"] .cheat-col-head::before { background: ${colors.frameGreen}; }
#module-content .cheat-col[data-tone="think"] .cheat-col-head { color: ${colors.framePurple}; }
#module-content .cheat-col[data-tone="think"] .cheat-col-head::before { background: ${colors.framePurple}; }

#module-content .cheat-col-body {
  padding: 16px;
  gap: 12px;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  #module-content .cheat-col:not([open]) {
    background: var(--cheat-row-closed);
  }
  #module-content .cheat-col:not([open]) .cheat-col-head {
    background: transparent;
    border-bottom: none;
  }
  #module-content .cheat-col-head {
    border: none;
    border-bottom: 1px solid ${colors.gray02};
    border-radius: 0;
    padding: 16px;
    min-height: 56px;
  }
  #module-content .cheat-col-head::before {
    left: 0;
    right: 0;
    top: 0;
    bottom: auto;
    width: auto;
    height: 3px;
  }
  #module-content .cheat-col:not([open]) .cheat-col-head,
  #module-content .cheat-col[open] .cheat-col-head {
    border-radius: 0;
    border-right: none;
  }
  #module-content .cheat-col-body {
    padding: 0 16px 16px;
    gap: 12px;
  }
}

/* Content rail — section padding already insets to layout.contentWidth;
   inner grids fill that rail (not the full viewport). */
#module-content .rise-grid,
#module-content .wrong-grid,
#module-content .gva-compare,
#module-content .gva-band-cells,
#module-content .gva-colheads,
#module-content .paths-row,
#module-content .hero-inner,
#module-content .velocity-header,
#module-content .velocity-card,
#module-content #evo-timeline-view,
#module-content .news-grid,
#module-content .cheat-columns {
  width: 100%;
  max-width: none;
  margin-left: 0;
  margin-right: 0;
}

/* LLM vs AI Agent vs Agentic AI — EY dark-module tokens only (no ad-hoc rgba washes) */
#module-content .gva-section {
  --gva-sticky-top: var(--ey-subnav-scroll-offset, ${SUBNAV_SCROLL_OFFSET}px);
  --gva-page: ${colors.confidentBlack};
  --gva-card: ${colors.eyBgCard};
  --gva-border: ${colors.borderOnDark};
  --gva-surface: ${colors.surfaceOnDark};
  --gva-text: ${colors.onDark};
  --gva-text-muted: ${colors.onDarkMuted};
  --gva-text-subtle: ${colors.onDarkSubtle};
  --gva-label: ${colors.gray01};
  --gva-yellow: ${colors.yellow};
  --gva-yellow-soft: ${colors.yellowAlpha10};
  --gva-blue: ${colors.frameBlue};
  --gva-green: ${colors.frameGreen};
  --gva-purple: ${colors.framePurple};
  --gva-radius: 8px;
  --gva-gap: 24px;
  --gva-pad: ${spacing.cardPadding};
  background: ${colors.confidentBlack} !important;
  color: ${colors.onDark};
  font-family: ${fonts.regular};
}
#module-content .gva-title { font-family: ${fonts.bold}; color: ${colors.onDark} !important; }
#module-content .gva-colheads { background: ${colors.confidentBlack}; }
#module-content .gva-band-label {
  background: ${colors.eyBgCard};
  color: ${colors.yellow};
  border-color: ${colors.borderOnDark};
}
#module-content .gva-colhead,
#module-content .gva-cell,
#module-content .gva-summary { background: ${colors.eyBgCard}; border-color: ${colors.borderOnDark}; }
#module-content .gva-cell.gva-cell-static { background: transparent; border: none; }
#module-content .gva-band-cells { background: ${colors.confidentBlack}; border-color: ${colors.borderOnDark}; }
#module-content .gva-band-mantras .gva-band-cells { background: transparent; border: none; }
#module-content .gva-compare,
#module-content .gva-band-cells,
#module-content .gva-colheads {
  width: 100%;
  max-width: none;
}

#module-content .hero {
  padding: 72px var(--ey-content-inline-pad) 80px;
}
#module-content .velocity-section,
#module-content .quiz-section,
#module-content .evo-section,
#module-content .sim-section {
  padding-left: var(--ey-content-inline-pad) !important;
  padding-right: var(--ey-content-inline-pad) !important;
}

/* Act Now — credit / attribution footnote */
#module-content .velocity-source {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${colors.gray02};
  font-family: ${fonts.light};
  font-size: ${typeScale.caption.size}px;
  font-weight: ${typeScale.caption.weight};
  font-style: italic;
  letter-spacing: ${typeScale.caption.tracking};
  line-height: 1.5;
  color: ${colors.gray01};
}
#module-content .velocity-source a {
  color: ${colors.gray01};
  text-decoration: underline;
  font-style: italic;
}

#module-content [id] {
  scroll-margin-top: var(--ey-subnav-scroll-offset, ${SUBNAV_SCROLL_OFFSET}px);
}

/* Section anchor titles — match ModuleHeader tab labels (curriculum.ts) */
#module-content .section-anchor-title {
  font-family: ${fonts.bold};
  font-size: ${typeScale.label.size}px;
  font-weight: ${typeScale.label.weight};
  letter-spacing: ${typeScale.label.tracking};
  text-transform: uppercase;
  color: ${colors.eyebrowGold};
  margin: 0 0 8px;
  line-height: 1.2;
}
#module-content .surface-dark .section-anchor-title,
#module-content .section-anchor-title--dark {
  color: ${colors.yellow};
}
#module-content .section-anchor-title--center {
  text-align: center;
  width: 100%;
}
`;

/** Pull <style>, <script>, and body markup out of the standalone HTML file. */
function parseLessonHtml(html: string): { css: string; body: string; scripts: string[] } {
  const styles: string[] = [];
  const scripts: string[] = [];

  let rest = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_m, css: string) => {
    styles.push(css);
    return "";
  });

  rest = rest.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (_m, js: string) => {
    if (js.trim()) scripts.push(js);
    return "";
  });

  const bodyMatch = rest.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : rest;

  let css = styles.join("\n");

  // CRITICAL: do NOT rewrite the universal reset as `#module-content * { padding:0 }` —
  // that has higher specificity than `.hero` / `.section` and wipes all spacing.
  // Only set box-sizing on descendants; zero margin/padding on the container alone.
  css = css.replace(
    /\*,\s*\*::before,\s*\*::after\s*\{[^}]*\}/,
    `#module-content { margin: 0; padding: 0; }
#module-content, #module-content *, #module-content *::before, #module-content *::after { box-sizing: border-box; }`
  );

  // Former <body> / :root rules → scoped to the lesson region.
  css = css.replace(/(^|})\s*body\s*\{/g, "$1\n#module-content {");
  css = css.replace(/(^|})\s*:root\s*\{/g, "$1\n#module-content {");

  // Token bridge last so kit values win over the HTML's hardcoded hex.
  css += `\n${TOKEN_BRIDGE}\n`;

  return { css, body, scripts };
}

/** Marker on dynamically injected lesson scripts so cleanup can find them. */
const FC_SCRIPT_ATTR = "data-fc-lesson-script";

type FcLessonWindow = Window & {
  initEvoExplorer?: () => void;
  __fcNavScrollHandler?: () => void;
};

/**
 * Wrap inline lesson scripts so they can run again after HMR / Strict Mode
 * remount without re-declaring top-level `const` / `let` in the global scope.
 * Top-level `function` declarations are re-published onto `window` for inline
 * `onclick=""` handlers in the HTML markup.
 */
function wrapLessonScript(source: string): string {
  const trimmed = source.trim();
  // Already an IIFE (cheat accordion, GVA sticky, etc.) — safe to re-execute.
  if (/^\(function\b/.test(trimmed)) {
    return trimmed.endsWith(";") ? trimmed : `${trimmed};`;
  }

  const fnNames = [
    ...trimmed.matchAll(/^\s*function\s+([A-Za-z_$][\w$]*)\s*\(/gm),
  ].map((m) => m[1]);

  const exports =
    fnNames.length > 0
      ? fnNames.map((name) => `w.${name}=${name};`).join("\n")
      : "";

  return `(function(w){
${trimmed}
${exports}
})(typeof globalThis!=="undefined"?globalThis:window);`;
}

/** Remove prior injected scripts and duplicate scroll listener from a prior mount. */
function cleanupLessonScripts(): void {
  document.querySelectorAll(`script[${FC_SCRIPT_ATTR}]`).forEach((node) => {
    node.remove();
  });

  const win = window as FcLessonWindow;
  if (win.__fcNavScrollHandler) {
    window.removeEventListener("scroll", win.__fcNavScrollHandler);
    delete win.__fcNavScrollHandler;
  }
}

/** Patch scroll-nav listener so remounts don't stack duplicate handlers. */
function patchNavScrollListener(source: string): string {
  return source.replace(
    /window\.addEventListener\s*\(\s*['"]scroll['"]\s*,\s*\(\)\s*=>\s*\{/,
    `(function(w){
if(w.__fcNavScrollHandler){w.removeEventListener('scroll',w.__fcNavScrollHandler);}
w.__fcNavScrollHandler=function(){`,
  ).replace(
    /\}\s*\)\s*;\s*\n(?=\/\/ Pipeline stage tabs)/,
    `};w.addEventListener('scroll',w.__fcNavScrollHandler);})(typeof globalThis!=='undefined'?globalThis:window);\n`,
  );
}

export default function FoundationalConcepts({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (path: string) => void;
}) {
  const { css, body, scripts } = useMemo(
    () => parseLessonHtml(foundationalHtml),
    [foundationalHtml]
  );
  const contentRef = useRef<HTMLDivElement>(null);
  useModuleSectionHashScroll();

  // Inline onclick="" handlers work via innerHTML; <script> blocks do not —
  // re-run them after the markup is in the DOM. Wrapped in IIFEs so HMR /
  // Strict Mode remounts don't throw on duplicate `const` / `let` globals.
  useEffect(() => {
    cleanupLessonScripts();

    for (const raw of scripts) {
      const patched = patchNavScrollListener(raw);
      const el = document.createElement("script");
      el.setAttribute(FC_SCRIPT_ATTR, "");
      el.text = wrapLessonScript(patched);
      document.body.appendChild(el);
    }

    // Lesson scripts may listen for DOMContentLoaded — that already fired in SPA
    // mode, so boot explorers that expose a window init (e.g. era tabs).
    const boot = window as FcLessonWindow;
    if (typeof boot.initEvoExplorer === "function") boot.initEvoExplorer();

    return cleanupLessonScripts;
  }, [scripts]);

  return (
    <div style={{ position: "fixed", inset: 0, overflowY: "auto", background: colors.white }}>
      <SiteHeader variant="learning" onNavigate={onNavigate} skipLinkTarget="#module-content" />
      <ModuleHeader currentModuleId="foundational" onNavigate={onNavigate} onBack={onBack} />

      <div id="module-content" ref={contentRef}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>

      {/* Shared dark CTA — Figma 3455:18320 palette */}
      <EYWhatsNext
        title="Fundamentals are clear."
        ctaLabel="Continue to Part 2: Basics of Prompting in Tax"
        onContinue={() => onNavigate("/ai-tax-prompting")}
        meta="Part 2 covers: prompt structure, role-setting, context framing, output formatting, and real tax prompt templates"
      />
    </div>
  );
}
