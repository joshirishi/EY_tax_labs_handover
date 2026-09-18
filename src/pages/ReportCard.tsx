import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Printer } from "lucide-react";
import { SiteHeader } from "../design-kit/SiteHeader";
import { ModuleHeader, SUBNAV_SCROLL_MARGIN, useModuleSectionHashScroll } from "../design-kit/LearningNav";
import {
  EYBody,
  EYCaption,
  EYEyebrow,
  EYHeading,
  StepBadge,
  colors,
  contentRailStyle,
  fonts,
  spacing,
} from "../design-kit";
import {
  hoursFromDuration,
  REPORT_CARD_FOOTER,
  REPORT_CARD_PRIMARY,
  REPORT_CARD_SUBTITLE,
  RESPONSIBLE_COLUMNS,
  SESSION_DURATION_HEADING,
  statusLabel,
  type BuildType,
  type ProcessUseCase,
  type ReportCardDataset,
  type UseCaseStatus,
} from "../data/report-card";
import heroImg from "../assets/images/AdobeStock-621943361.jpeg";

export const MODULE4_LABEL = "Module 4: Report Card";
export const MODULE4_NUMBER = 4;

const BUILD_COLUMNS: { id: BuildType; label: string }[] = [
  { id: "Prompt", label: "Prompt" },
  { id: "No-Code", label: "No-Code" },
  { id: "Pro-Code", label: "Pro-Code" },
];

const FOCUS = `2px solid ${colors.yellow}`;

const MATRIX_COLUMNS = "minmax(160px, 1.15fr) repeat(4, minmax(140px, 1fr))";
const COLUMN_MAX_HEIGHT = 700;
const QUIZ_MAX = 100;

const COLUMN_GRID: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(240px, 1fr))",
  gap: 16,
  minWidth: 760,
  alignItems: "stretch",
};

const MATRIX_ROW: CSSProperties = {
  display: "grid",
  gridTemplateColumns: MATRIX_COLUMNS,
  gap: 10,
};

function conceptLines(note: string): string[] {
  return note
    .split("\n")
    .map((line) => line.replace(/^•\s*/, "").trim())
    .filter(Boolean);
}

function statusColor(status: UseCaseStatus): string {
  if (status === "Done") return colors.success;
  if (status === "In Progress") return colors.accentOrange;
  return colors.gray01;
}

function statusCounts(rows: ProcessUseCase[]) {
  return {
    done: rows.filter((row) => row.status === "Done").length,
    inProgress: rows.filter((row) => row.status === "In Progress").length,
    notDone: rows.filter((row) => row.status === "Not Started").length,
  };
}

function columnCardStyle(background: string): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    maxHeight: COLUMN_MAX_HEIGHT,
    minHeight: 0,
    height: "100%",
    background,
    border: `1px solid ${colors.gray02}`,
    borderTop: `3px solid ${colors.yellow}`,
    borderRadius: 10,
    padding: "20px 18px 16px",
    overflow: "hidden",
  };
}

function QuizProgress({
  name,
  score,
  theme = "light",
}: {
  name: string;
  score: number;
  theme?: "light" | "dark";
}) {
  const pct = Math.max(0, Math.min(100, (score / QUIZ_MAX) * 100));
  const onDark = theme === "dark";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontFamily: fonts.regular,
          fontSize: 12,
          color: onDark ? colors.onDarkMuted : colors.offBlack,
          lineHeight: 1.3,
          flex: "0 1 auto",
          minWidth: 0,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
      <div
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={QUIZ_MAX}
        aria-label={`${name}: ${score} out of ${QUIZ_MAX}`}
        style={{
          flex: "1 1 48px",
          minWidth: 40,
          height: 8,
          borderRadius: 999,
          background: onDark ? colors.borderOnDark : colors.gray02,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 999,
            background: onDark ? colors.white : colors.confidentBlack,
          }}
        />
      </div>
      <strong
        style={{
          fontFamily: fonts.bold,
          fontSize: 13,
          fontWeight: 700,
          color: onDark ? colors.onDark : colors.offBlack,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {score} / {QUIZ_MAX}
      </strong>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  subtitle,
  theme = "light",
  titleId,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  theme?: "light" | "dark";
  titleId: string;
}) {
  return (
    <div className="print-heading" style={{ textAlign: "center", marginBottom: 36 }}>
      <EYEyebrow theme={theme} style={{ marginBottom: 12 }}>
        {eyebrow}
      </EYEyebrow>
      <EYHeading
        id={titleId}
        level={2}
        theme={theme}
        style={{ fontSize: "clamp(22px, 3vw, 36px)", margin: "0 0 12px", textAlign: "center" }}
      >
        {title}
      </EYHeading>
      <EYBody
        theme={theme}
        style={{
          margin: "0 auto",
          textAlign: "center",
          maxWidth: 560,
          color: theme === "dark" ? colors.onDarkMuted : colors.gray01,
        }}
      >
        {subtitle}
      </EYBody>
    </div>
  );
}

function PrintProgress({ name, score }: { name: string; score: number }) {
  const pct = Math.max(0, Math.min(QUIZ_MAX, score));
  return (
    <div className="print-progress-row">
      <span className="print-progress-name">{name}</span>
      <span className="print-progress-track" aria-hidden>
        <span className="print-progress-fill" style={{ width: `${pct}%` }} />
      </span>
      <strong>{score} / {QUIZ_MAX}</strong>
    </div>
  );
}

function PrintSectionHeading({
  eyebrow,
  title,
  subtitle,
  titleId,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  titleId: string;
}) {
  return (
    <header className="print-section-heading">
      <span>{eyebrow}</span>
      <h2 id={titleId}>{title}</h2>
      <p>{subtitle}</p>
    </header>
  );
}

function PrintReportCard({
  data,
  participants,
  hours,
  days,
}: {
  data: ReportCardDataset;
  participants: string;
  hours: string;
  days: string;
}) {
  return (
    <article className="report-print-version" aria-label="Printable report card">
      <header className="print-cover">
        <div className="print-cover-marker" aria-hidden />
        <p className="print-eyebrow">EY.ai Tax Labs · Session close-out</p>
        <h1>Report Card</h1>
        <p className="print-cover-subtitle">{REPORT_CARD_SUBTITLE}</p>
        <dl className="print-summary">
          {[
            ["Client", data.meta.client],
            ["Date", data.meta.date],
            ["Facilitator", data.meta.facilitator],
            ["Participants", participants],
            ["Duration", `${hours} hours · ${days} days`],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="print-section" aria-labelledby="print-knowledge-heading">
        <PrintSectionHeading
          eyebrow="Learn"
          title="Knowledge Acquired"
          subtitle="In-session concepts and quiz performance"
          titleId="print-knowledge-heading"
        />
        <div className="print-card-stack">
          {data.conceptsLearned.map((topic, index) => (
            <article className="print-card print-knowledge-card" key={topic.topic}>
              <div className="print-card-title">
                <span>{index + 1}</span>
                <h3>{topic.topic}</h3>
              </div>
              <div className="print-knowledge-grid">
                <div>
                  <h4>Concepts covered</h4>
                  <ul>
                    {conceptLines(topic.note).map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </div>
                <div className="print-quiz-panel">
                  <h4>Quiz performance</h4>
                  {topic.quizzes.map((quiz) => (
                    <PrintProgress key={quiz.name} name={quiz.name} score={quiz.score} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="print-section" aria-labelledby="print-processes-heading">
        <PrintSectionHeading
          eyebrow="Learn"
          title="Processes Reimagined and Developed"
          subtitle="Use case ideation, build approach, and execution status"
          titleId="print-processes-heading"
        />
        <div className="print-card-stack">
          {BUILD_COLUMNS.map((column, index) => {
            const rows = data.processReimagined.filter((row) => row.buildType === column.id);
            const isProCode = column.id === "Pro-Code";
            const counts = statusCounts(rows);
            return (
              <article className="print-card print-process-card" key={column.id}>
                <div className="print-card-title">
                  <span>{index + 1}</span>
                  <h3>{column.label}</h3>
                  <p>
                    {rows.length} use case{rows.length === 1 ? "" : "s"}
                    {!isProCode && ` · Done ${counts.done} · In progress ${counts.inProgress}`}
                  </p>
                </div>
                <ul className="print-process-list">
                  {rows.map((row) => (
                    <li key={row.useCase}>
                      <span>{row.useCase}</span>
                      {!isProCode && <strong>{statusLabel(row.status)}</strong>}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="print-section print-responsible-section" aria-labelledby="print-responsible-heading">
        <PrintSectionHeading
          eyebrow="Apply"
          title="Responsible Use of AI"
          subtitle="Applied understanding of safety, governance, and control concepts"
          titleId="print-responsible-heading"
        />
        <div className="print-card-stack">
          {data.responsibleUse.map((row, rowIndex) => (
            <article className="print-card print-responsible-card" key={row.question}>
              <header>
                <div className="print-card-title">
                  <span>{rowIndex + 1}</span>
                  <h3>{row.question}</h3>
                </div>
                <PrintProgress name="Score" score={row.score} />
              </header>
              <div className="print-answer-grid">
                {row.answers.map((answer, answerIndex) => (
                  <div key={`${row.question}-${answer.concept}`}>
                    <h4>{RESPONSIBLE_COLUMNS[answerIndex]}</h4>
                    <p>{answer.answer}</p>
                    <strong>{answer.result}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="print-footer">{REPORT_CARD_FOOTER}</p>
      </section>
    </article>
  );
}

function FactField({
  label,
  value,
  onChange,
  ariaLabel,
  onDark,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  ariaLabel: string;
  onDark?: boolean;
}) {
  const id = ariaLabel.replace(/\s+/g, "-").toLowerCase();
  return (
    <label htmlFor={id} style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span
        style={{
          fontFamily: fonts.bold,
          fontSize: 12,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: onDark ? colors.yellow : colors.confidentBlack,
          marginBottom: 8,
        }}
      >
        {label}
      </span>
      <input
        id={id}
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          e.currentTarget.style.outline = FOCUS;
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
        style={{
          fontFamily: fonts.regular,
          fontSize: 16,
          color: onDark ? colors.white : colors.offBlack,
          background: onDark ? colors.surfaceOnDark : colors.white,
          border: `1px solid ${onDark ? colors.borderOnDark : colors.gray02}`,
          borderRadius: 6,
          padding: "11px 12px",
          lineHeight: 1.4,
          width: "100%",
        }}
      />
    </label>
  );
}

export default function ReportCard({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (path: string) => void;
}) {
  useModuleSectionHashScroll();
  const reduceMotion = useReducedMotion();
  const data = REPORT_CARD_PRIMARY;
  const [participants, setParticipants] = useState(String(data.meta.participants));
  const [hours, setHours] = useState(hoursFromDuration(data.meta.duration));
  const [days, setDays] = useState("5");

  const printReport = () => {
    const previousTitle = document.title;
    document.title = "EY.ai Tax Labs — Report Card";
    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  return (
    <div
      className="relative bg-white content-stretch flex flex-col items-stretch w-full max-w-full min-w-0"
      data-name="EY.ai Tax Labs - Module 4 Report Card"
    >
      <style>{`
        .report-print-version {
          display: none;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 11mm 12mm 13mm;
          }

          html, body, #root {
            height: auto !important;
            overflow: visible !important;
            background: ${colors.white} !important;
          }

          #root > div,
          #root .size-full,
          #root .overflow-auto {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
          }

          .report-screen-version {
            display: none !important;
          }

          .report-print-version {
            display: block !important;
            width: 100%;
            color: ${colors.offBlack};
            background: ${colors.white};
            font-family: ${fonts.regular};
            font-size: 9.5pt;
            line-height: 1.4;
          }

          .report-card-print-hide,
          button[aria-label^="Change session"],
          [role="dialog"],
          [role="presentation"]:has([role="dialog"]),
          a[href="#report-card-content"],
          iframe[src*="echo"],
          [id*="echo"],
          [class*="echo-"] {
            display: none !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
          }

          h1, h2, h3, .print-heading {
            break-after: avoid;
            page-break-after: avoid;
          }

          p, li, .print-keep, .report-column, .responsible-row {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          p, li {
            orphans: 4;
            widows: 4;
          }

          .knowledge-columns-scroll,
          .process-columns-scroll,
          .responsible-matrix-scroll {
            overflow: visible !important;
          }

          .knowledge-columns-scroll .report-columns {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .report-columns,
          .responsible-matrix {
            min-width: 0 !important;
          }

          .report-column {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
          }

          .report-column-list {
            overflow: visible !important;
          }

          [role="cell"] {
            transform: none !important;
            animation: none !important;
          }

          .report-print-version *,
          .report-print-version *::before,
          .report-print-version *::after {
            box-sizing: border-box;
          }

          .print-cover {
            padding: 8mm;
            background: ${colors.white};
            border: 1px solid ${colors.gray02};
            border-top: 3px solid ${colors.yellow};
            break-inside: avoid;
          }

          .print-cover-marker {
            width: 18mm;
            height: 1.2mm;
            margin-bottom: 4mm;
            background: ${colors.yellow};
          }

          .print-eyebrow,
          .print-section-heading > span {
            margin: 0 0 1.5mm;
            color: ${colors.eyebrowGoldDark};
            font-family: ${fonts.bold};
            font-size: 8pt;
            font-weight: 700;
            letter-spacing: 0.09em;
            text-transform: uppercase;
          }

          .print-cover h1 {
            margin: 0 0 2mm;
            color: ${colors.confidentBlack};
            font-family: ${fonts.bold};
            font-size: 25pt;
            line-height: 1.05;
          }

          .print-cover-subtitle {
            max-width: 145mm;
            margin: 0 0 6mm;
            color: ${colors.gray01};
            font-size: 11pt;
          }

          .print-summary {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 3mm;
            margin: 0;
          }

          .print-summary > div {
            min-width: 0;
            padding: 3mm;
            background: ${colors.offWhite};
            border: 1px solid ${colors.gray02};
            break-inside: avoid;
          }

          .print-summary dt,
          .print-card h4 {
            margin: 0 0 1mm;
            color: ${colors.gray01};
            font-family: ${fonts.bold};
            font-size: 7.5pt;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }

          .print-summary dd {
            margin: 0;
            color: ${colors.confidentBlack};
            font-family: ${fonts.bold};
            font-size: 10pt;
          }

          .print-section {
            margin-top: 8mm;
          }

          .print-responsible-section {
            break-before: page;
            page-break-before: always;
          }

          .print-section-heading {
            margin: 0 0 4mm;
            padding-bottom: 2.5mm;
            border-bottom: 1px solid ${colors.gray02};
            break-inside: avoid;
            page-break-inside: avoid;
            break-after: avoid;
            page-break-after: avoid;
          }

          .print-section-heading h2 {
            margin: 0 0 1mm;
            color: ${colors.confidentBlack};
            font-family: ${fonts.bold};
            font-size: 17pt;
            line-height: 1.15;
          }

          .print-section-heading p {
            margin: 0;
            color: ${colors.gray01};
            font-size: 9pt;
          }

          .print-card-stack {
            display: flex;
            flex-direction: column;
            gap: 4mm;
          }

          .print-card {
            padding: 4mm;
            background: ${colors.offWhite};
            border: 1px solid ${colors.gray02};
            border-top: 2px solid ${colors.yellow};
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .print-card-title {
            display: flex;
            align-items: center;
            gap: 2.5mm;
            min-width: 0;
          }

          .print-card-title > span {
            display: inline-flex;
            width: 6mm;
            height: 6mm;
            flex: 0 0 6mm;
            align-items: center;
            justify-content: center;
            background: ${colors.yellow};
            color: ${colors.confidentBlack};
            border-radius: 50%;
            font-family: ${fonts.bold};
            font-size: 8pt;
          }

          .print-card-title h3 {
            margin: 0;
            color: ${colors.confidentBlack};
            font-family: ${fonts.bold};
            font-size: 12pt;
            line-height: 1.2;
          }

          .print-card-title > p {
            margin: 0 0 0 auto;
            color: ${colors.gray01};
            font-size: 8pt;
            white-space: nowrap;
          }

          .print-knowledge-grid {
            display: grid;
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
            gap: 5mm;
            margin-top: 3mm;
          }

          .print-knowledge-grid ul {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1mm 5mm;
            margin: 0;
            padding-left: 4mm;
          }

          .print-knowledge-grid li {
            margin: 0;
            font-size: 8.5pt;
          }

          .print-quiz-panel {
            padding-left: 5mm;
            border-left: 1px solid ${colors.gray02};
          }

          .print-progress-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 30mm 18mm;
            align-items: center;
            gap: 2.5mm;
            min-width: 0;
            padding: 1.5mm 0;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .print-progress-name {
            min-width: 0;
            overflow: hidden;
            color: ${colors.offBlack};
            font-size: 8pt;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .print-progress-track {
            display: block;
            height: 2mm;
            overflow: hidden;
            background: ${colors.gray02};
            border-radius: 2mm;
          }

          .print-progress-fill {
            display: block;
            height: 100%;
            background: ${colors.confidentBlack};
            border-radius: 2mm;
          }

          .print-progress-row strong {
            color: ${colors.confidentBlack};
            font-family: ${fonts.bold};
            font-size: 8.5pt;
            text-align: right;
            white-space: nowrap;
          }

          .print-process-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0 6mm;
            margin: 3mm 0 0;
            padding: 0;
            list-style: none;
          }

          .print-process-list li {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 2mm;
            min-width: 0;
            padding: 1.5mm 0;
            border-bottom: 1px solid ${colors.gray02};
            font-size: 8.5pt;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .print-process-list li > span {
            min-width: 0;
          }

          .print-process-list strong {
            color: ${colors.offBlack};
            font-family: ${fonts.bold};
            font-size: 7pt;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .print-responsible-card > header {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 72mm;
            align-items: center;
            gap: 5mm;
            padding-bottom: 3mm;
            border-bottom: 1px solid ${colors.gray02};
          }

          .print-answer-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 3mm;
            margin-top: 3mm;
          }

          .print-answer-grid > div {
            display: flex;
            min-height: 24mm;
            flex-direction: column;
            padding: 3mm;
            background: ${colors.white};
            border: 1px solid ${colors.gray02};
            break-inside: avoid;
          }

          .print-answer-grid p {
            flex: 1;
            margin: 0 0 2mm;
            color: ${colors.offBlack};
            font-size: 8.5pt;
            line-height: 1.35;
          }

          .print-answer-grid strong {
            color: ${colors.confidentBlack};
            font-family: ${fonts.bold};
            font-size: 7pt;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }

          .print-footer {
            margin: 6mm 0 0;
            padding-top: 3mm;
            color: ${colors.gray01};
            border-top: 1px solid ${colors.gray02};
            font-size: 8pt;
            text-align: center;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="report-screen-version">
        <div className="report-card-print-hide">
          <SiteHeader variant="learning" onNavigate={onNavigate} skipLinkTarget="#report-card-content" />
          <ModuleHeader
            mode="phase-overview"
            hideModuleDropdown
            phaseLabel={MODULE4_LABEL}
            phaseNumber={MODULE4_NUMBER}
            onNavigate={onNavigate}
            onBack={onBack}
          />
        </div>

        <main>
        <section
          id="report-card-content"
          aria-labelledby="report-card-heading"
          style={{
            backgroundColor: colors.confidentBlack,
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            padding: "80px 0",
            position: "relative",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(26,26,36,0.97) 0%, rgba(26,26,36,0.84) 45%, rgba(26,26,36,0.45) 72%, rgba(26,26,36,0.28) 100%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ ...contentRailStyle, position: "relative", zIndex: 1 }}>
            <EYEyebrow theme="dark" style={{ marginBottom: 12 }}>
              Session close-out
            </EYEyebrow>
            <EYHeading
              id="report-card-heading"
              level={1}
              theme="dark"
              style={{ fontSize: "clamp(28px, 3.4vw, 48px)", margin: "0 0 12px", maxWidth: 720 }}
            >
              Report Card
            </EYHeading>
            <EYBody theme="dark" style={{ margin: "0 0 32px", maxWidth: 560, color: colors.onDarkMuted }}>
              {REPORT_CARD_SUBTITLE}
            </EYBody>

            <div
              className="print-keep"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 16,
                maxWidth: 640,
                marginBottom: 28,
              }}
            >
              <FactField
                label="Total participants"
                value={participants}
                onChange={setParticipants}
                ariaLabel="Total Participants"
                onDark
              />
              <FactField
                label={`${SESSION_DURATION_HEADING} — hours`}
                value={hours}
                onChange={setHours}
                ariaLabel="No. of Hrs"
                onDark
              />
              <FactField
                label={`${SESSION_DURATION_HEADING} — days`}
                value={days}
                onChange={setDays}
                ariaLabel="No. of Days"
                onDark
              />
            </div>

            <div className="report-card-print-hide">
              <button
                type="button"
                onClick={printReport}
                onFocus={(e) => {
                  e.currentTarget.style.outline = FOCUS;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  fontFamily: fonts.bold,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  background: colors.white,
                  color: colors.confidentBlack,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Printer size={16} strokeWidth={1.75} aria-hidden />
                Export / Print
              </button>
            </div>
          </div>
        </section>

        <section
          id="knowledge"
          aria-labelledby="knowledge-heading"
          style={{
            scrollMarginTop: SUBNAV_SCROLL_MARGIN,
            background: colors.offWhite,
            padding: `${spacing.sectionPaddingY} 0`,
            width: "100%",
          }}
        >
          <div style={contentRailStyle}>
            <SectionHead
              eyebrow="Learn"
              title="Knowledge Acquired"
              subtitle="In-session concepts and quiz performance"
              titleId="knowledge-heading"
            />
            <div className="knowledge-columns-scroll" style={{ overflowX: "auto" }}>
              <div className="report-columns" style={COLUMN_GRID}>
                {data.conceptsLearned.map((topic, index) => (
                  <article
                    key={topic.topic}
                    className="report-column"
                    aria-labelledby={`knowledge-${index}-heading`}
                    style={columnCardStyle(colors.white)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <StepBadge n={index + 1} onLight />
                      <EYHeading
                        id={`knowledge-${index}-heading`}
                        level={3}
                        style={{ margin: 0, fontSize: 18 }}
                      >
                        {topic.topic}
                      </EYHeading>
                    </div>
                    <EYCaption style={{ margin: "0 0 8px", color: colors.gray01 }}>Concepts covered</EYCaption>
                    <ul
                      className="report-column-list"
                      style={{
                        margin: 0,
                        paddingLeft: 18,
                        flex: 1,
                        minHeight: 0,
                        overflowY: "auto",
                      }}
                    >
                      {conceptLines(topic.note).map((line) => (
                        <li
                          key={line}
                          style={{
                            fontFamily: fonts.regular,
                            fontSize: 14,
                            lineHeight: 1.45,
                            color: colors.offBlack,
                            marginBottom: 8,
                          }}
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 14,
                        borderTop: `1px solid ${colors.gray02}`,
                      }}
                    >
                      <EYCaption style={{ margin: "0 0 12px", color: colors.gray01 }}>Quiz performance</EYCaption>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {topic.quizzes.map((quiz) => (
                          <QuizProgress key={quiz.name} name={quiz.name} score={quiz.score} />
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="processes"
          aria-labelledby="processes-heading"
          style={{
            scrollMarginTop: SUBNAV_SCROLL_MARGIN,
            background: colors.white,
            borderTop: `1px solid ${colors.gray02}`,
            padding: `${spacing.sectionPaddingY} 0`,
            width: "100%",
          }}
        >
          <div style={contentRailStyle}>
            <SectionHead
              eyebrow="Learn"
              title="Processes Reimagined and Developed"
              subtitle="Use case ideation, build approach, and execution status"
              titleId="processes-heading"
            />
            <div className="process-columns-scroll" style={{ overflowX: "auto" }}>
              <div className="report-columns" style={COLUMN_GRID}>
                {BUILD_COLUMNS.map((column, index) => {
                  const rows = data.processReimagined.filter((row) => row.buildType === column.id);
                  const isProCode = column.id === "Pro-Code";
                  const counts = statusCounts(rows);
                  return (
                    <article
                      key={column.id}
                      className="report-column"
                      aria-labelledby={`process-${column.id}-heading`}
                      style={columnCardStyle(colors.offWhite)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <StepBadge n={index + 1} onLight />
                        <EYHeading
                          id={`process-${column.id}-heading`}
                          level={3}
                          style={{ margin: 0, fontSize: 18 }}
                        >
                          {column.label}
                        </EYHeading>
                      </div>
                      <EYCaption style={{ margin: "0 0 6px", color: colors.gray01 }}>
                        {rows.length} use case{rows.length === 1 ? "" : "s"}
                        {isProCode ? " · Futuristic process maps" : ""}
                      </EYCaption>
                      {!isProCode && (
                        <p
                          style={{
                            margin: "0 0 12px",
                            fontFamily: fonts.regular,
                            fontSize: 13,
                            color: colors.gray01,
                          }}
                        >
                          Done {counts.done} · In Progress {counts.inProgress} · Not Done {counts.notDone}
                        </p>
                      )}
                      {isProCode && <div style={{ height: 8 }} />}
                      <ul
                        className="report-column-list"
                        style={{
                          margin: 0,
                          padding: 0,
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          minHeight: 0,
                          overflowY: "auto",
                        }}
                      >
                        {rows.map((row: ProcessUseCase) => (
                          <li
                            key={row.useCase}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 12,
                              flex: "1 0 auto",
                              padding: "8px 0",
                              borderBottom: `1px solid ${colors.gray02}`,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: fonts.regular,
                                fontSize: 14,
                                color: colors.offBlack,
                                lineHeight: 1.4,
                              }}
                            >
                              {row.useCase}
                            </span>
                            {!isProCode && (
                              <span
                                style={{
                                  fontFamily: fonts.bold,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  letterSpacing: "0.04em",
                                  textTransform: "uppercase",
                                  color: statusColor(row.status),
                                  flexShrink: 0,
                                }}
                              >
                                {statusLabel(row.status)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          id="responsible"
          aria-labelledby="responsible-heading"
          style={{
            scrollMarginTop: SUBNAV_SCROLL_MARGIN,
            background: colors.confidentBlack,
            padding: `${spacing.sectionPaddingY} 0`,
            width: "100%",
          }}
        >
          <div style={contentRailStyle}>
            <SectionHead
              eyebrow="Apply"
              title="Responsible Use of AI"
              subtitle="Applied understanding of safety, governance, and control concepts"
              theme="dark"
              titleId="responsible-heading"
            />
            <div className="responsible-matrix-scroll" style={{ overflowX: "auto" }}>
              <div
                className="responsible-matrix"
                role="table"
                aria-label="Responsible use of AI matrix"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  minWidth: 760,
                }}
              >
                <div role="row" className="responsible-row" style={MATRIX_ROW}>
                  <div
                    role="columnheader"
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: colors.yellow,
                      padding: "8px 10px",
                    }}
                  >
                    Concepts
                  </div>
                  {RESPONSIBLE_COLUMNS.map((column) => (
                    <div
                      key={column}
                      role="columnheader"
                      style={{
                        fontFamily: fonts.bold,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: colors.yellow,
                        padding: "8px 10px",
                      }}
                    >
                      {column}
                    </div>
                  ))}
                </div>

                {data.responsibleUse.map((row, rowIndex) => (
                  <div key={row.question} role="row" className="responsible-row" style={MATRIX_ROW}>
                    <div
                      role="rowheader"
                      style={{
                        background: colors.surfaceOnDark,
                        border: `1px solid ${colors.borderOnDark}`,
                        borderRadius: 10,
                        padding: "14px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <StepBadge n={rowIndex + 1} />
                        <EYHeading level={3} theme="dark" style={{ margin: 0, fontSize: 14, lineHeight: 1.35 }}>
                          {row.question}
                        </EYHeading>
                      </div>
                      <QuizProgress name="Score" score={row.score} theme="dark" />
                    </div>
                    {row.answers.map((answer) => {
                      const isReview = answer.result === "Review";
                      return (
                        <motion.div
                          key={`${row.question}-${answer.concept}`}
                          role="cell"
                          initial={false}
                          animate={
                            isReview && !reduceMotion
                              ? {
                                  scale: [1, 1.04, 1],
                                  boxShadow: [
                                    `0 0 0 0 ${colors.yellow}00`,
                                    `0 0 0 8px ${colors.yellow}45`,
                                    `0 0 0 0 ${colors.yellow}00`,
                                  ],
                                }
                              : { scale: 1, boxShadow: "0 0 0 0 transparent" }
                          }
                          transition={{ duration: 0.3, ease: "easeOut", delay: isReview ? 0.15 : 0 }}
                          style={{
                            background: colors.surfaceOnDark,
                            border: `1px solid ${colors.borderOnDark}`,
                            borderLeft: `3px solid ${isReview ? colors.yellow : colors.success}`,
                            borderRadius: 10,
                            padding: "14px 14px 16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            minHeight: 100,
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontFamily: fonts.regular,
                              fontSize: 13,
                              lineHeight: 1.5,
                              color: colors.onDark,
                              flex: 1,
                            }}
                          >
                            {answer.answer}
                          </p>
                          <span
                            style={{
                              fontFamily: fonts.bold,
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                              color: isReview ? colors.destructive : colors.success,
                            }}
                          >
                            {answer.result}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <p
              style={{
                margin: "36px 0 0",
                fontFamily: fonts.light,
                fontSize: 13,
                fontWeight: 300,
                lineHeight: 1.6,
                color: colors.onDarkMuted,
                textAlign: "center",
              }}
            >
              {REPORT_CARD_FOOTER}
            </p>
          </div>
        </section>
        </main>
      </div>

      <PrintReportCard
        data={data}
        participants={participants}
        hours={hours}
        days={days}
      />
    </div>
  );
}
