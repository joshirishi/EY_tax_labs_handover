import svgPaths from "./svg-zcwswyol0e";
type StatusIndicatorProps = {
  className?: string;
  property1?: "active" | "locked";
};

function StatusIndicator({ className, property1 = "active" }: StatusIndicatorProps) {
  const isLocked = property1 === "locked";
  return (
    <div className={className || `content-stretch flex items-start px-[10px] py-[4px] relative rounded-[12px] ${isLocked ? "bg-[#c4c4cd]" : "bg-[#F6F6FA]"}`}>
      <div aria-hidden className="absolute border border-[#ffe600] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <p className={`[word-break:break-word] font-["EYInterstate:Regular",sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${isLocked ? "text-[#747480]" : "text-[#2e2e38]"}`}>ACTIVE PHASE</p>
    </div>
  );
}
type CtaButtonProps = {
  className?: string;
  state?: "Open" | "Locked" | "Completed";
};

function CtaButton({ className, state = "Open" }: CtaButtonProps) {
  const isLocked = state === "Locked";
  const isCompleted = state === "Completed";
  return (
    <div className={className || `content-stretch flex items-center justify-center px-[20px] py-[10px] relative rounded-[6px] ${isLocked ? "bg-[#C4C4CD] gap-[8px]" : isCompleted ? "bg-[#00C864] gap-[8px]" : "bg-[#ffe600]"}`}>
      {state === "Open" && <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#2E2E38] text-[16px] whitespace-nowrap">Click here to Proceed</p>}
      {isLocked && (
        <>
          <div className="relative shrink-0 size-[16px]" data-name="Lock Icon">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <g id="Lock Icon">
                <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #747480)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #747480)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              </g>
            </svg>
          </div>
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#747480] text-[16px] whitespace-nowrap">This journey is locked</p>
        </>
      )}
      {isCompleted && (
        <>
          <div className="relative shrink-0 size-[16px]" data-name="Check Icon">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d="M13.5 4L6 11.5L2.5 8" stroke="var(--stroke-0, #FFFFFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-white text-[16px] whitespace-nowrap">Completed</p>
        </>
      )}
    </div>
  );
}
type TimelineCardProps = {
  className?: string;
  expanded?: boolean;
  onProceed?: () => void;
};

export default function TimelineCard({ className, expanded = true, onProceed }: TimelineCardProps) {
  const isExpanded = expanded;
  const isNotExpanded = !expanded;
  return (
    <div className={className || `bg-white content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.05)] flex p-[32px] relative rounded-[12px] w-[1006px] ${isNotExpanded ? "gap-[16px] items-center" : "flex-col gap-[24px] items-start"}`}>
      <div aria-hidden className="absolute border border-[#C4C4CD] border-solid inset-0 pointer-events-none rounded-[12px]" />
      {isExpanded && (
        <>
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Card-Header">
            <StatusIndicator className="bg-[#F6F6FA] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[12px] shrink-0" />
            <div className="content-stretch flex h-[24px] items-center justify-center overflow-clip relative shrink-0 w-[13px]" data-name="Collapse-Icon">
              <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">▲</p>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-full" data-name="Card-Body">
            <p className="font-['EYInterstate:Bold',sans-serif] leading-[30px] relative shrink-0 text-[#2e2e38] text-[24px] w-full">Foundational Workshop</p>
            <p className="font-['EYInterstate:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#747480] text-[14px] w-full">Covers essential generative AI structures, tax workflows prompt architecture, and M365 Copilot productivity.</p>
          </div>
          <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-name="Card-Details">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px relative" data-name="Coverage-Col">
              <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#2e2e38] text-[12px] uppercase whitespace-nowrap">Coverage</p>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="List">
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Frame">
                  <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Bullet">
                    <div className="relative shrink-0 size-[16px]" data-name="check">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g id="check">
                          <path d={svgPaths.p221839c0} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[#2e2e38] text-[14px]">AI Fundamentals for Tax</p>
                </div>
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Frame">
                  <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Bullet">
                    <div className="relative shrink-0 size-[16px]" data-name="check">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g id="check">
                          <path d={svgPaths.p221839c0} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[#2e2e38] text-[14px]">Prompt engineering basics</p>
                </div>
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Frame">
                  <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Bullet">
                    <div className="relative shrink-0 size-[16px]" data-name="check">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g id="check">
                          <path d={svgPaths.p221839c0} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[#2e2e38] text-[14px]">M365 Copilot across tax use cases</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px relative" data-name="Deliverables-Col">
              <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#2e2e38] text-[12px] uppercase whitespace-nowrap">Deliverables</p>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="List">
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Frame">
                  <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Bullet">
                    <div className="relative shrink-0 size-[16px]" data-name="file-text">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g id="file-text">
                          <path d={svgPaths.p3cbc4600} id="Vector" stroke="var(--stroke-0, #00C864)" strokeLinecap="round" strokeWidth="2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[#2e2e38] text-[14px]">Copilot Prompt Templates</p>
                </div>
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Frame">
                  <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Bullet">
                    <div className="relative shrink-0 size-[16px]" data-name="file-text">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g id="file-text">
                          <path d={svgPaths.p3cbc4600} id="Vector" stroke="var(--stroke-0, #00C864)" strokeLinecap="round" strokeWidth="2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[#2e2e38] text-[14px]">{`Adoption & Enablement Toolkit`}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex items-start pt-[12px] relative shrink-0 w-full"
            data-name="Action-Section"
            onClick={(e) => { e.stopPropagation(); onProceed?.(); }}
          >
            <div aria-hidden className="absolute border-[#C4C4CD] border-solid border-t inset-0 pointer-events-none" />
            <CtaButton className="bg-[#ffe600] content-stretch flex items-center justify-center px-[20px] py-[10px] relative rounded-[6px] shrink-0" />
          </div>
        </>
      )}
      {isNotExpanded && (
        <>
          <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Bold',sans-serif] h-full leading-[30px] min-w-px not-italic relative text-[#2e2e38] text-[24px]">Foundational Workshop</p>
          <StatusIndicator className="bg-[#F6F6FA] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[12px] shrink-0" />
          <div className="content-stretch flex h-[24px] items-center justify-center overflow-clip relative shrink-0 w-[13px]" data-name="Expand-Icon">
            <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">▼</p>
          </div>
        </>
      )}
    </div>
  );
}