# EY India AI Tax Hub — Design Reference

> **Read this before writing any UI code.**  
> Cursor rule: `.cursor/rules/ey-design-tokens.mdc` enforces these patterns in every session.

This document is the **canonical design spec** for the EY India AI Tax Hub / EY.ai Tax Labs learning platform. It covers the design kit, tokens, layout, page patterns, and embedded HTML lessons actually used in this repo.

**Legacy note:** An older Motif DS 4.17 spec lives at [`docs/design/EY-India-AI-Tax-Hub-Design-System.md`](../docs/design/EY-India-AI-Tax-Hub-Design-System.md). That file describes a different component library (`ds-cards.tsx`, `motif-ds.tsx`) that is **not present in this codebase**. Use this document and `src/design-kit/` instead.

---

## Table of Contents

1. [Design principles](#1-design-principles)
2. [Token reference](#2-token-reference)
3. [Typography](#3-typography)
4. [Color usage](#4-color-usage)
5. [Layout & spacing](#5-layout--spacing)
6. [Component catalog](#6-component-catalog)
7. [UI patterns by page type](#7-ui-patterns-by-page-type)
8. [Icons](#8-icons)
9. [File map](#9-file-map)
10. [Do's and don'ts checklist](#10-dos-and-donts-checklist)

---

## 1. Design principles

| Principle | What it means in this app |
|-----------|---------------------------|
| **EY brand, not generic AI** | Confident Black (`#1A1A24`), Off Black (`#2E2E38`), Off White (`#F6F6FA`), EY Yellow (`#FFE600`) markers, EYInterstate type, Spectrum gradient accents — **not** purple/violet “AI SaaS” palettes |
| **Token-first styling** | Colors, spacing, and type come from `tokens.ts` / `theme.css`. No invented hex in components |
| **Kit before one-offs** | Prefer `EYButton`, `EYCard`, `EYTypography`, `SiteHeader`, `ModuleHeader`, etc. over ad-hoc styled divs |
| **Full-bleed backgrounds, railed content** | Section backgrounds span the viewport; text and cards sit in the shared content rail |
| **Dark modules vs light sections** | Learning modules alternate **dark** (`confidentBlack` / `#1A1A24`), **neutral** (`offWhite`), and **light** (`white`) surfaces — see [Surface rhythm](#surface-rhythm-dark--neutral--light) |
| **Yellow is a marker** | EY Yellow marks active nav, eyebrows on dark, tab underlines, progress chips — never large fills or body text on white |
| **Line icons only** | Lucide React (or equivalent stroke SVGs). No emoji as UI icons |
| **Accessible focus** | Yellow `2px` focus rings on interactive chrome (`SiteHeader`, `ModuleHeader`) |

---

## 2. Token reference

**Do not duplicate every hex here.** The source files are authoritative:

| Concern | Source | Import / usage |
|---------|--------|----------------|
| JS tokens | [`design-kit/tokens.ts`](design-kit/tokens.ts) | `import { colors, fonts, typeScale, spacing, layout, contentRailStyle, contentInlinePad, spectrumCss } from '@/design-kit'` |
| CSS variables | [`styles/theme.css`](styles/theme.css) | `var(--foreground)`, `var(--ey-brand-yellow)`, `var(--ey-content-width)`, etc. |
| Fonts | [`styles/fonts.css`](styles/fonts.css) | `@font-face` for `EYInterstate:Light/Regular/Bold` |
| Runtime sync | [`main.tsx`](main.tsx) | Writes `layout.contentWidth` → `--ey-content-width` on `:root` |

### 2.1 Primary palette (`colors.*`)

| Token | Role |
|-------|------|
| `yellow` | Brand marker / accent only |
| `white`, `offWhite` | Light surfaces, cards |
| `gray02`, `gray01` | Borders, secondary text |
| `offBlack`, `confidentBlack` | Primary text (light bg) / dark module bases |
| `eyebrowGold` | Eyebrow labels on **light** backgrounds |

### 2.2 Spectrum / Frame accents

Used for pipeline diagrams, element cards, comparison accents, and `EYFrame` / `EYCard` gradient borders:

`frameOrange`, `frameRed`, `frameMagenta`, `framePurple`, `frameLime`, `frameGreen`, `frameTeal`, `frameBlue`

Seven presets in `spectrumGradients` (Yellow always anchors the start). Helper:

```tsx
import { spectrumCss } from '@/design-kit';
// linear-gradient string, 1-indexed preset
background: spectrumCss(4);
```

### 2.3 Semantic aliases

| Token | Use |
|-------|-----|
| `success` / `frameGreen` | Correct states, positive indicators |
| `destructive` / `error` | Incorrect / critical |
| `info` / `frameBlue` | Informational accents |
| `accentOrange` / `frameOrange` | Activity badges |

### 2.4 Dark module surfaces

Mirrored in CSS as `--ey-*` vars in `theme.css`:

| Token | Role |
|-------|------|
| `eyBgBody` / `confidentBlack` | Page base on dark modules |
| `eyBgCard` / `offBlack` | Elevated cards on dark |
| `onDark`, `onDarkMuted`, `onDarkSubtle` | Text hierarchy on dark |
| `surfaceOnDark`, `borderOnDark` | Inner panels and dividers |
| `yellowAlpha10`, `yellowAlpha12` | Soft yellow tints on dark |

### 2.5 M365 app colors (CSS only)

For realistic Microsoft app chrome in Copilot Hub / pipeline: `--ey-app-word`, `--ey-app-excel`, `--ey-app-ppt`, `--ey-app-outlook`, `--ey-app-copilot`.

### 2.6 Shadcn / Tailwind bridge (`theme.css`)

Light/dark theme tokens (`--background`, `--foreground`, `--card`, `--border`, etc.) bridge into Tailwind via `@theme inline`. Prefer EY kit tokens for new learning UI; shadcn vars remain for base layer compatibility.

---

## 3. Typography

**Font:** EYInterstate only — via `fonts.light` (300), `fonts.regular` (400), `fonts.bold` (700).  
**Allowed weights:** 300, 400, 700 only. Never 500 or 600.

### 3.1 Type scale (`typeScale`)

| Role | Size | Weight | Tracking | Component |
|------|------|--------|----------|-----------|
| Display | 64px | 700 | −0.025em | `<EYDisplay>` |
| H1 | 40px | 700 | −0.02em | `<EYHeading level={1}>` |
| H2 | 32px | 700 | −0.02em | `<EYHeading level={2}>` |
| H3 | 20px | 700 | −0.02em | `<EYHeading level={3}>` |
| Subheading | 19px | 400 | −0.01em | `<EYSubheading>` |
| Body | 16px | 300 | −0.01em | `<EYBody>` |
| CTA text | 16px | 700 | −0.02em | `<EYCTA>` (underline link, not a button) |
| Label / eyebrow | 13px | 700 | +0.04em, uppercase | `<EYEyebrow>` |
| Caption | 12px | 300 | −0.01em | `<EYCaption>` |
| Quote | 22px Georgia | 400 italic | — | `<EYQuote>` |

### 3.2 When to use components vs raw tokens

| Situation | Use |
|-----------|-----|
| Standard headings, body, eyebrows in React pages | `<EYHeading>`, `<EYBody>`, `<EYEyebrow>`, etc. with `theme="light"` \| `"dark"` |
| One-off sizing inside a complex widget | `fonts.*` + `typeScale.*` inline |
| Embedded HTML lessons | Map CSS custom properties via token bridge (see [Foundational Concepts](#foundational-concepts-html-lesson)) |
| Figma-export pages (`Home2`, `Frame353`) | Often hardcode `font-['EYInterstate:Bold']` — **new code should migrate toward kit components** |

`<EYBody>` applies `maxWidth: 640` for readable measure. Override with `style` when full-width copy is intentional.

---

## 4. Color usage

### 4.1 EY Yellow rules

`#FFE600` (`colors.yellow` / `var(--ey-brand-yellow)`) **only** for:

- Active nav underline / tab indicator (`ModuleHeader`, `EYNavbar`)
- Eyebrows and pills on **dark** backgrounds
- Progress “you are here” chip (`ModuleHeader`)
- Vertical accent bars and small markers
- **Primary CTA on dark** (`EYWhatsNext` button — yellow fill on dark card is the sanctioned exception)
- Footer column headings (`EYFooter`)

**Never:**

- Body text on white/off-white
- Large decorative section fills (except sanctioned callouts like `paths-footer` in the lesson HTML)
- Solid primary buttons on light backgrounds (`EYButton` explicitly forbids yellow fill)

### 4.2 Surface rhythm (dark → neutral → light)

Module pages (e.g. `AiTaxPrompting.tsx`) define a `SURFACE` map:

| Tone | Background | Heading | Body | Eyebrow |
|------|------------|---------|------|---------|
| `dark` | `confidentBlack` | `onDark` | `gray02` | `yellow` |
| `neutral` | `offWhite` | `confidentBlack` | `gray01` | `eyebrowGold` |
| `light` | `white` | `confidentBlack` | `gray01` | `eyebrowGold` |

Alternate sections down the page for visual rhythm. HTML lessons use `.surface-dark`, `.surface-neutral`, `.surface-light` classes with the same intent.

### 4.3 Spectrum gradients

Use for hero top rules, footer accent lines, frame strokes, and category color coding — **not** as full-page backgrounds.

---

## 5. Layout & spacing

### 5.1 Content rail (single global token)

```tsx
import { layout, contentRailStyle, contentInlinePad, spacing } from '@/design-kit';

// Centered rail
<div style={contentRailStyle}>...</div>

// Full-bleed section with railed content
<section style={{ padding: spacing.sectionPadding }}>
  <div className="ey-content-rail">...</div>
</section>

// Or horizontal inset only
<section style={{ padding: `${spacing.sectionPaddingY} ${contentInlinePad}` }} />
```

| Token | Default | Notes |
|-------|---------|-------|
| `layout.contentWidth` | `min(90%, 1440px)` | Change **once** in `tokens.ts`; `main.tsx` syncs to `--ey-content-width` |
| `spacing.sectionPadding` | `72px` + inline pad | Vertical + sides |
| `spacing.sectionPaddingY` | `72px` | Vertical only |
| `spacing.cardPadding` | `18px` | Card interiors |
| `spacing.navHeight` | `60px` | Navbar reference |

**Rules:**

- Section **backgrounds** are full-bleed; **content** sits in the rail
- Do **not** hardcode `maxWidth: 1100` / `1200` wrappers
- CSS class `.ey-content-rail` mirrors `contentRailStyle`

### 5.2 Sticky learning chrome

`ModuleHeader` is `position: sticky; top: 0; z-index: 200`. In-page sections must set:

```tsx
style={{ scrollMarginTop: SUBNAV_SCROLL_OFFSET }} // 156px
```

Export: `SUBNAV_SCROLL_OFFSET` from `LearningNav.tsx`.

### 5.3 Frame stroke formula

```tsx
import { frameStroke } from '@/design-kit';
frameStroke(longestEdgePx, square?) // square=true → ÷60, else ÷120
```

---

## 6. Component catalog

Import everything from [`design-kit/index.ts`](design-kit/index.ts).

### 6.1 EYLogo

| Prop | Values | Purpose |
|------|--------|---------|
| `variant` | `stacked` \| `horizontal-sm` \| `horizontal-lg` \| `mark-only` | Logo lockup |
| `theme` | `dark` \| `light` | Letter color (white vs off-black) |
| `onClick` | handler | Optional navigation |

**When to use:** Any branded mark. `SiteHeader` and `EYNavbar` use `mark-only` on dark bars.

### 6.2 EYButton

| Prop | Values | Purpose |
|------|--------|---------|
| `variant` | `primary` \| `secondary` \| `text` | Dark fill / outline / underline link |
| `size` | `sm` \| `md` \| `lg` | Padding scale |
| `arrow` | boolean | Appends → on primary/secondary |

**When to use:** Standalone CTAs on marketing or form actions. **Never** yellow-filled buttons.

### 6.3 EYCard

Insight card with thumbnail, Spectrum frame overlay, eyebrow, title, body, CTA.

| Prop | Notes |
|------|-------|
| `gradient` | 1–7 spectrum preset for frame border |
| `theme` | `light` (default) \| `dark` |
| `imageUrl`, `imageHeight` | Thumbnail area |
| `onClick` | Enables hover lift |

**When to use:** Hub cards, featured content tiles. Phase 1 course cards in `Frame353` follow a similar visual pattern.

### 6.4 EYFrame

Signature L-shaped Spectrum/Yellow frame with optional “Approach Line” squares.

| Prop | Notes |
|------|-------|
| `variant` | `spectrum` \| `yellow` \| `breakthrough` |
| `gradient` | 1–7 for spectrum stroke |
| `headline`, `headlineEnd`, `subheading`, `cta` | Content slots |
| `showApproach` | Three yellow squares + tagline |

**When to use:** Hero callouts, brand moments on dark backgrounds.

### 6.5 EYTypography

| Component | Purpose |
|-----------|---------|
| `EYEyebrow` | Uppercase category label (gold on light, yellow on dark) |
| `EYDisplay` | Hero display |
| `EYHeading` | `level={1\|2\|3}` |
| `EYSubheading` | Supporting headline |
| `EYBody` | Body copy (640px max width) |
| `EYCTA` | Underlined bold link text |
| `EYCaption` | Muted caption |
| `EYQuote` | Georgia pull-quote |

All accept `theme="light"|"dark"`, `className`, `style`.

### 6.6 SiteHeader

Shared top chrome for hub and learning flows.

| Prop | Notes |
|------|-------|
| `variant` | `hub` (Home + Phased) \| `learning` (modules) |
| `activeSection` | `home` \| `tax-labs` (hub only) |
| `onNavigate` | Route callback |
| `rightSlot` | Hub brand bar extras |
| `skipLinkTarget` | e.g. `#module-content` |

**Hub variant:** Yellow 3px strip → off-black brand bar → site section nav (`About…` \| `EY.ai Tax Labs`).

**Learning variant:** Confident black bar, EY mark, “EY.ai Tax Labs” / “INDIA TAX HUB”, `PlatformModeBadge`.

Also exports: `PlatformModeBadge`.

### 6.7 ModuleHeader + ModulePrevNext (`LearningNav.tsx`)

**ModuleHeader** — Figma Level 2 breadcrumb + Learn/Apply tabs.

| Mode | Props | UI |
|------|-------|-----|
| `phase-overview` | `mode="phase-overview"` | Back + workshop picker + progress chips |
| `module` | `currentModuleId` | Above + Learn/Apply section tabs with scroll-spy |

| Prop | Notes |
|------|-------|
| `onSectionClick` | For iframe/custom scroll (optional) |
| `sectionStatus` | Optional live status text |

Also exports: `SUBNAV_SCROLL_OFFSET`, `useModuleSectionHashScroll`, `ModulePrevNext`.

**When to use:** Every `/phase1`, `/foundational`, `/ai-tax-prompting`, `/copilot-hub` page.

### 6.8 EYWhatsNext + EYWhatsNextHighlight

End-of-module handoff CTA (Figma 3455:18320).

| Prop | Notes |
|------|-------|
| `eyebrow` | Default `"What's Next"` |
| `title` | Headline; wrap phrases in `<EYWhatsNextHighlight>` for yellow |
| `ctaLabel`, `onContinue` | Yellow button on dark card |
| `id` | Default `whats-next` |

Full-bleed Getty background + dark gradient overlay + centered `#2E2E38` card.

### 6.9 EYNavbar

Global sticky nav (alternate to `SiteHeader` for simpler pages).

| Prop | Notes |
|------|-------|
| `items` | `{ label, href?, active?, onClick? }[]` |
| `onLogoClick` | Logo handler |
| `rightSlot` | Extra actions |

Active link: white text + 2px yellow bottom border.

### 6.10 EYFooter

| Prop | Notes |
|------|-------|
| `columns` | `{ heading, links[] }` — heading in yellow |
| `gradient` | 1–7 spectrum top accent line |
| `copyright`, `socialSlot` | Bottom row |

### 6.11 Curriculum helpers (`curriculum.ts`)

Not visual components, but drive all nav labels and section IDs:

- `MODULES`, `PHASES`, `getModule`, `getSubModuleGroups`, `moduleSectionPath`
- Sub-module `group`: `"learn"` \| `"apply"` → `ModuleHeader` tab clusters

---

## 7. UI patterns by page type

### 7.1 Route map

| Route | Component | Chrome |
|-------|-----------|--------|
| `/` | `imports/Home2` | `SiteHeader` hub |
| `/phased` | `Frame353/PhasedEngagementView` | Hub header (Figma export) |
| `/phase1` | `Frame353/Phase1View` | Learning header + `ModuleHeader` phase-overview |
| `/foundational` | `pages/FoundationalConcepts` | Learning + module header |
| `/ai-tax-prompting` | `pages/AiTaxPrompting` | Learning + module header |
| `/copilot-hub` | `pages/M365CopilotHub` | Learning + module header |

Standard module page shell:

```tsx
<SiteHeader variant="learning" onNavigate={onNavigate} skipLinkTarget="#module-content" />
<ModuleHeader currentModuleId="…" onNavigate={onNavigate} onBack={onBack} />
{/* sections with scrollMarginTop: SUBNAV_SCROLL_OFFSET */}
<EYWhatsNext … />
<ModulePrevNext … />  {/* optional */}
```

### 7.2 Hub home (`Home2`)

| Pattern | Description |
|---------|-------------|
| **Hero** | Full-bleed image, dark gradient scrim, yellow display title, white subcopy, yellow CTA pill |
| **Pillar cards** | Three-column grid: yellow title bar, image + line icon overlay, gray body |
| **Tax Labs entry** | Card linking to `/phased` |

### 7.3 Phased engagement (`Frame353`)

| Pattern | Description |
|---------|-------------|
| **Hub header** | Yellow strip + off-black brand + site section nav |
| **Timeline cards** | `TimelineCard` — phase milestones |
| **Core Processing Pipeline** | `CoreProcessingPipeline.tsx` — 1200×820 infographic, Copilot center ring, left processing cards, right M365 app orbit |
| **Phase 1 overview** | Course module cards with unlock states; navigates to module routes |

**Pipeline diagram:** Shared orbit geometry (`CX`, `CY`, `R`); yellow cards for Chat/RAG/Human/Model; MS app icons on right semicircle. Scales to container at `DISPLAY_SCALE`.

### 7.4 Module header + Learn/Apply tabs

Defined in `curriculum.ts`, rendered by `ModuleHeader`:

- **Row A:** Yellow back circle → “Tax Labs” → workshop dropdown → page title → Module/Sub-module progress chips
- **Row B (modules only):** Off-white bar; **Learn** and **Apply** pill clusters; yellow 3px active tab underline; scroll-spy via `IntersectionObserver`

Example groups (Foundational Concepts):

| Learn | Apply |
|-------|-------|
| Act Now, Understanding AI, Evolution, Key Terms, GenAI vs Agents | Cheat Sheet, Quiz |

### 7.5 Foundational Concepts (HTML lesson)

Source: [`imports/Foundational_Concepts.html`](imports/Foundational_Concepts.html), rendered by [`pages/FoundationalConcepts.tsx`](pages/FoundationalConcepts.tsx) with a **token bridge** (`TOKEN_BRIDGE`) scoping styles under `#module-content`.

| Section ID | Pattern | Surface |
|------------|---------|---------|
| `#home` / `.hero` | Video hero, play overlay, duration label | Dark |
| `#rise-of-ai` | News card grid, lightbox | Dark (`.rise-section`) |
| `#reality-check` | “Wrong assumptions” interactive | Neutral |
| `#strategic-divide` | Two-path comparison + VS divider + yellow footer CTA | Light |
| `#evolution` | Timeline breadcrumb, concentric nest, featured era panel, analogy + chips | Dark (`.evo-section`) |
| `#terminology` | Key terms / simulation | Light |
| `#cheatsheet` | Accordion columns (`<details>`) with cheat rows | Neutral |
| `#genai-vs-agents` | GVA compare grid (sticky column headers) | Dark (`.gva-section`) |
| `#quiz` | Multi-card quiz with feedback states | Light |

**HTML lesson conventions:**

- Lucide-equivalent stroke SVGs in markup (not emoji)
- `.paths-cta` uses confident-black fill + white text
- Section padding uses `--section-padding` / `--ey-content-inline-pad` from bridge

### 7.6 AI Tax Prompting (`AiTaxPrompting.tsx`)

React-native module with alternating `SURFACE` tones.

| Section ID | Pattern |
|------------|---------|
| `#module-content` | Dark hero — stock image, left scrim, spectrum top rule, yellow highlight in H1 |
| `#pipeline` | Prompt flow diagram |
| `#team-briefing` | Briefing cards |
| `#elements` | 7 Elements — left facet nav + detail pane (spectrum-colored facets) |
| `#lazy-vs-pro` | Side-by-side weak vs strong prompts |
| `#stack-builder` | Interactive prompt stack composer |
| `#advanced` | Advanced techniques — bucket toggle, CoT / decomposition / ensemble panels |
| `#match-activity` | Drag-match exercise |
| `#dos-donts` | Do's / Don'ts two-column lists |

Reusable widgets inside the page: `AdvancedViewToggle`, `SteppedFlow`, `TechniqueExampleQuote`, `MatchResultBadge`, `EightElementsWizard`, `PromptStackBuilder`.

### 7.7 M365 Copilot Hub (`M365CopilotHub.tsx`)

| Section ID | Pattern |
|------------|---------|
| `#prompt-repository` | App tabs (Word/Excel/PPT/Outlook/M365 Chat) — app-colored eyebrows |
| Laptop stage | Floating app widgets → jump to tab; “coming soon” dock |
| Per-tab content | Use-case grid + Copilot prompt panel + screenshot column |
| `#useful-links` | Link list |
| `#security` | Security & governance content |

Uses M365 app colors for **app chrome realism** only; structure still follows EY rail + surfaces.

### 7.8 What's Next CTA

Shared `<EYWhatsNext>` at module end. Yellow outline eyebrow pill, white headline (optional `<EYWhatsNextHighlight>`), yellow CTA with Lucide `ArrowRight`.

### 7.9 Accordion / comparison / cheat sheet patterns

| Pattern | Where | Implementation |
|---------|-------|------------------|
| **Accordion** | Cheat sheet columns | Native `<details>` / `<summary>` with stroke chevron |
| **Comparison grid** | GVA (GenAI vs Agents) | Sticky column headers, dark card surfaces, spectrum category colors |
| **Two-path compare** | Strategic divide | `.paths-card.bad` / `.good`, VS diamond divider |
| **Cheat sheet rows** | Cheat sheet | `.cheat-card` — icon + title + example prompt |
| **Quiz cards** | Quiz section | Option buttons + success/destructive feedback |
| **Left-nav wizard** | 7 Elements, Advanced | Facet list + detail pane; yellow active border |

### 7.10 Prev/Next module footer

`<ModulePrevNext>` — off-white bar, uppercase Previous/Next labels, yellow hover underline on module title.

---

## 8. Icons

| Rule | Detail |
|------|--------|
| **Library** | `lucide-react` — line/stroke icons only |
| **Size** | 16–20px inline; `strokeWidth={1.75}` typical |
| **Color** | `currentColor` inheriting from parent token |
| **HTML lessons** | Inline SVG matching Lucide stroke style |
| **Forbidden** | Emoji (👇 ✅ ➡️), filled pictorial icon sets |

Examples in codebase: `ArrowRight` in `EYWhatsNext`; facet icons in `AiTaxPrompting`; `FileSearch`-style SVGs in `Home2` pillar cards.

---

## 9. File map

| Path | Contents |
|------|----------|
| `src/design-kit/` | Components + `tokens.ts` + `curriculum.ts` |
| `src/design-kit/index.ts` | Single import entry |
| `src/styles/theme.css` | CSS custom properties + Tailwind bridge |
| `src/styles/fonts.css` | EYInterstate `@font-face` |
| `src/styles/index.css` | Aggregates styles |
| `src/main.tsx` | Syncs `--ey-content-width` from tokens |
| `src/pages/` | Native React module pages |
| `src/imports/` | Figma-export views + HTML lessons |
| `src/imports/Frame353/CoreProcessingPipeline.tsx` | Pipeline infographic |
| `src/app/routes.tsx` | React Router routes |
| `.cursor/rules/ey-design-tokens.mdc` | Agent enforcement rule |

---

## 10. Do's and don'ts checklist

Before shipping UI:

- [ ] No hardcoded hex/rgba except in `tokens.ts` / `theme.css`
- [ ] No Tailwind color utilities (`bg-blue-*`, `text-gray-*`, `text-[#…]`)
- [ ] Text uses `fonts.*` + `typeScale` or `EYTypography` components
- [ ] Font weights are **300 / 400 / 700** only
- [ ] Spacing from `spacing.*` or established kit patterns
- [ ] Content uses `contentRailStyle` / `var(--ey-content-width)` — no ad-hoc `maxWidth: 1200`
- [ ] Section backgrounds full-bleed; content railed
- [ ] EY Yellow is marker/accent only — not body text on white, not primary buttons on light
- [ ] Icons are Lucide line strokes — never emoji
- [ ] Dark module sections use `colors.onDark*` / `--ey-on-dark*` hierarchy
- [ ] In-page sections set `scrollMarginTop: SUBNAV_SCROLL_OFFSET` when using `ModuleHeader` tabs
- [ ] Prefer existing kit components over new one-off patterns

---

*Last updated: July 2026 · Canonical path: `src/DESIGN.md`*
