import { useState } from "react";
import { List, Printer, Shield, Star } from "lucide-react";
import { SiteHeader } from "../design-kit/SiteHeader";
import { ModuleHeader, SUBNAV_SCROLL_MARGIN, useModuleSectionHashScroll } from "../design-kit/LearningNav";
import { contentRailStyle, fonts as F, spacing } from "../design-kit/tokens";
import {
  Chip,
  DSCard,
  DSCardBody,
  DSCardHeader,
  MetricCard,
  MotifBadge,
  MotifButton,
  MotifProgressBar,
  PageHeader,
} from "../design-kit/motif";
import {
  hoursFromDuration,
  REPORT_CARD_FOOTER,
  REPORT_CARD_PRIMARY,
  REPORT_CARD_SUBTITLE,
  RESPONSIBLE_COLUMNS,
  SESSION_DURATION_HEADING,
  statusChipVariant,
  statusLabel,
  type BuildType,
  type ProcessUseCase,
} from "../data/report-card";

export const MODULE4_LABEL = "Module 4: Report Card";
export const MODULE4_NUMBER = 4;

const SECTIONS = [
  { id: "knowledge", label: "Knowledge Acquired", group: "learn" as const },
  { id: "processes", label: "Processes Reimagined", group: "learn" as const },
  { id: "responsible", label: "Responsible Use of AI", group: "apply" as const },
];

const BUILD_TYPES: BuildType[] = ["Prompt", "No-Code", "Pro-Code"];

function conceptLines(note: string): string[] {
  return note
    .split("\n")
    .map((line) => line.replace(/^•\s*/, "").trim())
    .filter(Boolean);
}

function ProcessBucket({ type, items }: { type: BuildType; items: ProcessUseCase[] }) {
  const bucket = items.filter((row) => row.buildType === type);
  const isProCode = type === "Pro-Code";
  const done = bucket.filter((row) => row.status === "Done").length;
  const inProgress = bucket.filter((row) => row.status === "In Progress").length;
  const notDone = bucket.filter((row) => row.status === "Not Started").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <p style={{ margin: 0, fontFamily: F.regular, fontSize: 16, fontWeight: 400, color: "var(--foreground)" }}>
          <strong style={{ fontFamily: F.bold, fontWeight: 700 }}>{type}</strong>
          {isProCode && (
            <span
              style={{
                marginLeft: 8,
                fontFamily: F.light,
                fontSize: 12,
                fontWeight: 300,
                color: "var(--muted-foreground)",
              }}
            >
              Futuristic process maps
            </span>
          )}
        </p>
        <p style={{ margin: "4px 0 0", fontFamily: F.light, fontSize: 14, fontWeight: 300, color: "var(--muted-foreground)" }}>
          {`${bucket.length} use case${bucket.length === 1 ? "" : "s"}`}
        </p>
      </div>
      {!isProCode && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {[
            { label: "Done", value: done },
            { label: "In Progress", value: inProgress },
            { label: "Not Done", value: notDone },
          ].map((row) => (
            <div key={row.label} style={{ border: "1px solid var(--border)", borderRadius: 4, padding: "8px 10px" }}>
              <span style={{ display: "block", fontFamily: F.light, fontSize: 12, color: "var(--muted-foreground)" }}>
                {row.label}
              </span>
              <strong style={{ fontFamily: F.bold, fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
                {row.value}
              </strong>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {bucket.map((row) => (
          <div
            key={row.useCase}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "8px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: F.regular,
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.4,
                color: "var(--foreground)",
              }}
            >
              {row.useCase}
            </h3>
            {!isProCode && <Chip text={statusLabel(row.status)} variant={statusChipVariant(row.status)} />}
          </div>
        ))}
      </div>
    </div>
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
  const data = REPORT_CARD_PRIMARY;
  const [participants, setParticipants] = useState(String(data.meta.participants));
  const [hours, setHours] = useState(hoursFromDuration(data.meta.duration));
  const [days, setDays] = useState("5");

  return (
    <div
      className="relative bg-white content-stretch flex flex-col items-stretch w-full max-w-full min-w-0"
      data-name="EY.ai Tax Labs - Module 4 Report Card"
    >
      <style>{`
        @media print {
          .report-card-print-hide { display: none !important; }
          .report-card-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1100px) {
          .report-card-grid { grid-template-columns: 1fr !important; }
          .report-card-meta { grid-template-columns: 1fr !important; }
          .report-card-duration { grid-column: auto !important; }
          .responsible-grid { min-width: 720px; }
        }
      `}</style>

      <div className="report-card-print-hide">
        <SiteHeader variant="learning" onNavigate={onNavigate} skipLinkTarget="#report-card-content" />
        <ModuleHeader
          mode="phase-overview"
          hideModuleDropdown
          phaseLabel={MODULE4_LABEL}
          phaseNumber={MODULE4_NUMBER}
          sections={SECTIONS}
          onNavigate={onNavigate}
          onBack={onBack}
        />
      </div>

      <main id="report-card-content" style={{ background: "var(--background)", padding: `${spacing.sectionPaddingY} 0` }}>
        <div style={contentRailStyle}>
          <PageHeader
            title="Report Card"
            subtitle={REPORT_CARD_SUBTITLE}
            action={
              <span className="report-card-print-hide">
                <MotifButton onClick={() => window.print()}>
                  <Printer size={16} strokeWidth={1.75} aria-hidden />
                  Export / Print
                </MotifButton>
              </span>
            }
          />

          <div
            className="report-card-meta"
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(160px, 1fr))",
              gap: 12,
              maxWidth: 760,
            }}
          >
            <MetricCard
              description="Total Participants"
              input={{ value: participants, onChange: setParticipants, ariaLabel: "Total Participants" }}
            />
            <div
              className="report-card-duration"
              style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              <p
                style={{
                  gridColumn: "1 / -1",
                  margin: 0,
                  fontFamily: F.light,
                  fontSize: 15,
                  fontWeight: 300,
                  color: "var(--muted-foreground)",
                }}
              >
                {SESSION_DURATION_HEADING}
              </p>
              <MetricCard
                description="No. of Hrs"
                input={{ value: hours, onChange: setHours, ariaLabel: "No. of Hrs" }}
              />
              <MetricCard
                description="No. of Days"
                input={{ value: days, onChange: setDays, ariaLabel: "No. of Days" }}
              />
            </div>
          </div>

          <div
            className="report-card-grid"
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
              alignItems: "start",
            }}
          >
            <DSCard id="knowledge" style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
              <DSCardHeader
                icon={Star}
                title="Knowledge Acquired"
                subtitle="In-session concepts and quiz performance"
              />
              <DSCardBody>
                {data.conceptsLearned.map((topic) => (
                  <div key={topic.topic} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <h3 style={{ margin: 0, fontFamily: F.regular, fontSize: 14, fontWeight: 400, color: "var(--foreground)" }}>
                      {topic.topic}
                    </h3>
                    <div>
                      <p
                        style={{
                          margin: "0 0 6px",
                          fontFamily: F.regular,
                          fontSize: 10,
                          letterSpacing: "0.4px",
                          textTransform: "uppercase",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        Concepts covered
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 18, fontFamily: F.light, fontSize: 13, lineHeight: 1.5, color: "var(--foreground)" }}>
                        {conceptLines(topic.note).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: F.regular,
                        fontSize: 10,
                        letterSpacing: "0.4px",
                        textTransform: "uppercase",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      Quiz performance
                    </p>
                    {topic.quizzes.map((quiz) => (
                      <MotifProgressBar
                        key={quiz.name}
                        label={quiz.name}
                        value={quiz.score}
                        variant="success"
                        showValue
                      />
                    ))}
                  </div>
                ))}
              </DSCardBody>
            </DSCard>

            <DSCard id="processes" style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN }}>
              <DSCardHeader
                icon={List}
                title="Processes Reimagined and Developed"
                subtitle="Use case ideation, build approach, and execution status"
              />
              <DSCardBody>
                {BUILD_TYPES.map((type) => (
                  <ProcessBucket key={type} type={type} items={data.processReimagined} />
                ))}
              </DSCardBody>
            </DSCard>

            <DSCard id="responsible" style={{ scrollMarginTop: SUBNAV_SCROLL_MARGIN, overflowX: "auto" }}>
              <DSCardHeader
                icon={Shield}
                title="Responsible Use of AI"
                subtitle="Applied understanding of safety, governance, and control concepts"
              />
              <DSCardBody style={{ padding: "16px 12px" }}>
                <div
                  className="responsible-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(140px, 1.1fr) repeat(4, minmax(110px, 1fr))",
                    gap: 8,
                  }}
                >
                  <div style={{ fontFamily: F.regular, fontSize: 12, color: "var(--muted-foreground)" }}>Concepts</div>
                  {RESPONSIBLE_COLUMNS.map((column) => (
                    <div key={column} style={{ fontFamily: F.regular, fontSize: 12, color: "var(--muted-foreground)" }}>
                      {column}
                    </div>
                  ))}
                  {data.responsibleUse.map((row) => (
                    <div key={row.question} style={{ display: "contents" }}>
                      <div>
                        <h3 style={{ margin: 0, fontFamily: F.regular, fontSize: 13, fontWeight: 400, color: "var(--foreground)" }}>
                          {row.question}
                        </h3>
                        <p style={{ margin: "6px 0 0", fontFamily: F.regular, fontSize: 12, color: "var(--foreground)" }}>
                          {row.score}/100
                        </p>
                      </div>
                      {row.answers.map((answer) => (
                        <div
                          key={`${row.question}-${answer.concept}`}
                          style={{
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            padding: 10,
                            background: "var(--card)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <MotifBadge variant={answer.result === "Correct" ? "success" : "error"}>
                            {answer.result}
                          </MotifBadge>
                          <p style={{ margin: 0, fontFamily: F.light, fontSize: 12, fontWeight: 300, lineHeight: 1.5, color: "var(--foreground)" }}>
                            {answer.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </DSCardBody>
            </DSCard>
          </div>

          <p
            style={{
              margin: "28px 0 0",
              fontFamily: F.light,
              fontSize: 13,
              fontWeight: 300,
              lineHeight: 1.6,
              color: "var(--muted-foreground)",
            }}
          >
            {REPORT_CARD_FOOTER}
          </p>
        </div>
      </main>
    </div>
  );
}
