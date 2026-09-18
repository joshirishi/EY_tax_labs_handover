# Changelog

All notable updates to **EY.ai Tax Labs** from **25 August 2026** through **18 September 2026**.

Format: grouped by date, then by module or area. Echo reviewer notes from Gayatri (and team) are called out where they drove a change.

---

## 18 September 2026

### Module 4 Report Card

- Reworked Knowledge and Process sections into aligned three-card layouts and Responsible Use into a five-column assessment matrix.
- Added score progress bars and a dedicated A4 print layout using white and off-white sections.
- Print pagination keeps headings, cards, quiz rows, process rows, and Responsible Use question blocks together.
- Changed the report hero image while preserving the existing content and scores.

### Session and handover assets

- Moved the session editor into the shared header as a compact organisation icon that expands to show the client and session name.
- Added the Tax Knowledge Retrieval Agent preview image and downloadable Word template.
- Corrected Foundational Concepts font references to use the packaged `.woff` files instead of missing `.woff2` files.

---

## 16 September 2026

### Session setup gate

- Every visit starts on a blank session setup form before the landing page can be used: client name, session name, date, duration, facilitator, location, participant count, and online / in person. Previous answers are not kept.
- Facilitator and location are dropdowns. A small **Change session** control (top right) lets a facilitator update the current visit only.

### Module 4 Report Card

- New `/report-card` page: Motif DS cards, metrics, chips, and progress bars with the HTML report-card copy unchanged.
- Home Phase 4 card now opens the Report Card. Closure stays on the Guidance Implementation trek button; Control Room stays on the Closure trek button.

---

## 15 September 2026

### Reviewer content pass (Echo — Gayatri 6 Sep, Priya 9–15 Sep)

**M365 Copilot Hub (`/copilot-hub`)**

- **Techniques Instructions preview:** Instead of / Try now uses a red cross and green tick, matching Agent Best Practices (not a plain paragraph).
- **Dark rail type:** Title 19px and body 16px (`typeScale.subheading` / `body`) on Techniques and Elements.

**AI Tax Prompting (`/ai-tax-prompting`)**

- Removed Team Briefing helper line and both **Better brief** labels.
- Lazy vs Pro: new weak/strong quotes, Role / Context / Format / Length tags, and list-form results.
- Stack builder helper split onto two lines.
- All seven Elements **What it is / Why it matters / Without / With** updated from Gayatri’s Prompting elements document.

**Foundational (`/foundational`)**

- Rise of AI carousel restores the earlier four clippings (GOV.UK, Nvidia, Kotak, TCS) **and** keeps the Sep 2026 set.
- Rise and Reality Check screenshots now show **source + publish date** on the clipping.

**Held:** What-tab tour cutoff (Priya) until the last slide is confirmed. Echo threads left open for reviewer close-out.

---

## 4 September 2026

### Reviewer content pass (Echo — Gayatri)

**Module 1 — Foundational (`/foundational`)**

- **Gen AI Convo — journey recap:** Title is now *Inside Every Gen AI Conversation*; removed extra eyebrow, subtitle, and footer lines around the recap card.
- **RAG tab:** Removed the “How RAG works” heading, the green highlight line, the GST circulars body copy, and the Question → Search → Retrieve → Generate flow row. The teach card (*What is RAG?*) remains.
- **Hallucination beat:** Expanded newspaper carousel to **8 articles** (original 5 + 3 from Sep 2026 reference). Embed carousel uses headline **thumbnails**; lightbox still opens full clippings. Added *Source: Various Newspaper Articles*.
- **Tokenization tab:** Token-split animation loops continuously; token groups are center-aligned.
- **Thinking Partner (cheat sheet):** Updated three example prompts — Govt. Incentives (Explain), tax additions trend (Analyse), SOP loopholes (Evaluate).
- **GenAI vs Agents:** Removed subhead; LLM accordion is **What is LLM?** with the five bullet list; Agent line reads *Not only answers - but also takes action*; GST notice example cards updated for LLM, Agent, and Agentic AI.
- **Quiz:** Chip label **Tokenization**; description uses *query* instead of *question*; **Spot the Right Technology** moved **before** Match the Explanation; Spot quiz trimmed to **5** questions.

**AI Tax Prompting (`/ai-tax-prompting`)**

- **Strong brief:** Payee ABC Inc, Subject Royalty payments, Issue Withholding tax, Jurisdiction USA, PAN Not Available, Deadline Thursday.
- Removed the YOU → Instruction → AI → RESULT diagram.
- Removed helper line under Strong Brief (*A well-defined prompt that powers a repeatable AI Agent…*).
- Video section heading → **Importance of Prompt**.
- Removed *Each element is a lever — pick one from the list…* under Elements.

### News & assets

- **Rise of AI** carousel: Sep 2026 clippings (Lenovo, Databricks, L&T AI Factory, AI M&As).
- **Reality Check** carousel: refreshed images and copy (AI safety, pullback, 95% ROI, $500M bill, corporate rationing).
- **Security** infographics on Copilot Hub updated (`copilot2`–`copilot4`).

### Naming

- Phase 1 hub label aligned to **Foundational Workshop** (was “Foundational Training Workshops”) in curriculum, timeline cards, and content areas.

---

## 2 September 2026

### Module 1 — Foundational

- **GenAI vs Agents:** Column titles centered on their icons for clearer scan.
- **Evolution:** Full-frame portrait images for ML, DL, Gen AI, and Agent levels.
- **Ascent journey:** Reviewer copy on trek callouts and milestone markers.

### M365 Copilot Hub & prompting

- Reviewer copy on Copilot walkthrough beats and related hub chrome.

---

## 1 September 2026

### M365 Copilot Hub (`/copilot-hub`)

- **Agent instruction area:** Redesigned **Techniques** and **Elements** tabs from workbook content; improved summary readability on the dark rail (20px titles, 16px body).
- **Agent hub:** What / How / Effective Drafting pill navigation; Field Guide patterns; Figma-aligned sidebar icons.
- **M365 Chat tour:** Trimmed to setup, create, and all-agents beats; polished in-card CTAs and workflow step numbering.
- **Security** section infographics refreshed.

### Ascent journey (all modules)

- Journey marker polish and callout alignment across Phase 1–4 ascent banners.

---

## 31 August 2026

### M365 Copilot Hub

- Chat and Agent slide tours: saved prompts, flyout fixes, and **What** tab flow for agents.
- Agent landing aligned visually with Chat tour UI.

---

## 30 August 2026

### M365 Copilot Hub

- **What / How** pill experiences on the Agent instruction hub.
- Removed redundant “Example Purpose” footer from agent examples.

---

## 28 August 2026

### M365 Copilot Hub

- Expanded **M365 Chat** and **M365 Agent** slide tours; Agent landing matches Chat UI patterns.
- **Field Guide:** Summary pattern peek sheet; clearer Weak vs Strong instruction cards.

### Module 1 — Foundational

- **Velocity chart:** Launch years per app (Netflix 1999, Facebook 2004, Dropbox/Spotify 2008, Instagram 2010, ChatGPT 2022) with scroll-reveal animation.

### AI Tax Prompting

- **Team Briefing** activity: missing chips stay visible after the strong brief is revealed.

---

## 25 August 2026

### Landing & Phase 1 hub (`/`, `/phase1`)

- Phase 1 course cards stay in **one row** on wide screens.
- Removed unused “coming soon” Copilot app tiles from the hub.

### Cross-module

- **Workshop library** and lesson embed updates landed on the feature branch.
- **Control Room** (`/control-room.html`): assessment UX refinements.
- **Evolution** assets: agent bot and deep-learning neural artwork for the hierarchy section.
- **TabRail** component added to the design kit for consistent Learn / Apply section tabs.
- **Eight Elements** pane and **Prompt Bookshelf** library components introduced for Phase 2/3 flows.
- Large refactors on **Brainstorming**, **Guidance Implementation**, and **Closure** pages to align with the shared curriculum nav and content rail patterns.

---

## Reference

| Item | Detail |
|------|--------|
| **Handover snapshot** | 18 Sep 2026 |
| **Built from** | `joshirishi/EY_landing_mockup` @ `c57fdfb` |

---

## Not yet in this build (open Echo / backlog)

- Technique tooltips on AI Tax Prompting (Priya, 14 Aug).
- Governance cards click-to-reveal one-by-one on Closure (14 Aug).
- Copilot Hub image swaps pending attached assets (27 Aug).
- Guidance “3 buckets” section and bingo game (Wave 4 deferred).
