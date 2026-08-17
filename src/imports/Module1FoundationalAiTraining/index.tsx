import svgPaths from "./svg-jnyzhb6w3u";
import imgVideoPosterGraphic from "./5d48ffef7c1a9b7556667d2a2734c09bef537610.png";

function ArrowLeft() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-left">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="arrow-left">
          <path d={svgPaths.pe197860} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function BackArrow() {
  return (
    <div className="content-stretch flex items-start p-[8px] relative rounded-[99px] shrink-0" data-name="Back Arrow">
      <div aria-hidden className="absolute border border-[#747480] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <ArrowLeft />
    </div>
  );
}

function Branding() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start not-italic relative shrink-0 whitespace-nowrap" data-name="Branding">
      <p className="font-['EYInterstate:Bold',sans-serif] leading-[0] relative shrink-0 text-[#ffe600] text-[20px]">
        <span className="leading-[normal]">{`EY.ai `}</span>
        <span className="leading-[normal] text-white">Tax Labs</span>
      </p>
      <p className="font-['EYInterstate:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#c4c4cd] text-[11px]">INDIA TAX HUB</p>
    </div>
  );
}

function LinkWrapper() {
  return (
    <div className="content-stretch flex flex-col items-start py-[4px] relative shrink-0" data-name="Link Wrapper">
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[13px] whitespace-nowrap">Understanding AI</p>
    </div>
  );
}

function LinkWrapper1() {
  return (
    <div className="content-stretch flex flex-col items-start py-[4px] relative shrink-0" data-name="Link Wrapper">
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c4c4cd] text-[13px] whitespace-nowrap">Evolution</p>
    </div>
  );
}

function LinkWrapper2() {
  return (
    <div className="content-stretch flex flex-col items-start py-[4px] relative shrink-0" data-name="Link Wrapper">
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c4c4cd] text-[13px] whitespace-nowrap">Key Terms</p>
    </div>
  );
}

function LinkWrapper3() {
  return (
    <div className="content-stretch flex flex-col items-start py-[4px] relative shrink-0" data-name="Link Wrapper">
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c4c4cd] text-[13px] whitespace-nowrap">GenAI vs Agents</p>
    </div>
  );
}

function LinkWrapper4() {
  return (
    <div className="content-stretch flex flex-col items-start py-[4px] relative shrink-0" data-name="Link Wrapper">
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c4c4cd] text-[13px] whitespace-nowrap">Cheat Sheet</p>
    </div>
  );
}

function LinkWrapper5() {
  return (
    <div className="content-stretch flex flex-col items-start py-[4px] relative shrink-0" data-name="Link Wrapper">
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c4c4cd] text-[13px] whitespace-nowrap">Quiz</p>
    </div>
  );
}

function LinkWrapper6() {
  return (
    <div className="content-stretch flex flex-col items-start py-[4px] relative shrink-0" data-name="Link Wrapper">
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c4c4cd] text-[13px] whitespace-nowrap">Act Now</p>
    </div>
  );
}

function JourneyLinks() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0" data-name="Journey Links">
      <LinkWrapper />
      <LinkWrapper1 />
      <LinkWrapper2 />
      <LinkWrapper3 />
      <LinkWrapper4 />
      <LinkWrapper5 />
      <LinkWrapper6 />
    </div>
  );
}

function NavLeft() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Nav Left">
      <BackArrow />
      <Branding />
      <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[24px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 1">
                <line id="Line" stroke="var(--stroke-0, white)" strokeOpacity="0.08" x2="24" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <JourneyLinks />
    </div>
  );
}

function ModulePill() {
  return (
    <div className="bg-[#ffe600] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Module Pill">
      <div aria-hidden className="absolute border border-[#ffe600] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[12px] whitespace-nowrap">Module 1</p>
    </div>
  );
}

function ModulePill1() {
  return (
    <div className="bg-white content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Module Pill">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">Module 2</p>
    </div>
  );
}

function ModulePill2() {
  return (
    <div className="bg-white content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Module Pill">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">Module 3</p>
    </div>
  );
}

function ModulePill3() {
  return (
    <div className="bg-white content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Module Pill">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">Module 4</p>
    </div>
  );
}

function NavRight() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Nav Right">
      <ModulePill />
      <ModulePill1 />
      <ModulePill2 />
      <ModulePill3 />
    </div>
  );
}

function TopNavigationBar() {
  return (
    <div className="bg-[#2e2e38] relative shrink-0 w-full" data-name="Top Navigation Bar">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[40px] py-[16px] relative size-full">
          <NavLeft />
          <NavRight />
        </div>
      </div>
    </div>
  );
}

function Tagline() {
  return (
    <div className="bg-[#ffe600] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[99px] shrink-0" data-name="Tagline">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[12px] uppercase whitespace-nowrap">EY India AI Tax Hub • Module 1</p>
    </div>
  );
}

function CtaMain() {
  return (
    <div className="bg-[#ffe600] content-stretch flex items-start px-[24px] py-[14px] relative rounded-[8px] shrink-0" data-name="CTA Main">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[15px] whitespace-nowrap">Begin Module Study</p>
    </div>
  );
}

function CtaSecondary() {
  return (
    <div className="content-stretch flex items-start px-[24px] py-[14px] relative rounded-[8px] shrink-0" data-name="CTA Secondary">
      <div aria-hidden className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[15px] whitespace-nowrap">Download Module Syllabus (PDF)</p>
    </div>
  );
}

function HeroActions() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0" data-name="Hero Actions">
      <CtaMain />
      <CtaSecondary />
    </div>
  );
}

function HeroLeft() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="Hero Left">
      <Tagline />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[48px] text-white w-[min-content]">
        <span className="leading-[1.2]">{`Foundational Concepts of `}</span>
        <span className="leading-[1.2] text-[#ffe600]">AI</span>
        <span className="leading-[1.2]">{` and its Application in `}</span>
        <span className="leading-[1.2] text-[#ffe600]">Tax</span>
      </p>
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.6] min-w-full not-italic relative shrink-0 text-[#2E2E38] text-[18px] w-[min-content]">Empowering modern tax professionals with actionable clarity on artificial intelligence. Move beyond marketing buzzwords into the programmatic foundations that govern risk, automation, and strategic advisory.</p>
      <HeroActions />
    </div>
  );
}

function Play() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="play">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="play">
          <path d={svgPaths.p2a2ba120} id="Vector" stroke="var(--stroke-0, #1A1A24)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function PlayButton() {
  return (
    <div className="bg-[#ffe600] content-stretch flex flex-col items-center justify-center relative rounded-[32px] shrink-0 size-[64px]" data-name="Play Button">
      <Play />
    </div>
  );
}

function HeroRightVideo() {
  return (
    <div className="bg-[#f6f6fa] h-[270px] relative rounded-[12px] shrink-0 w-[480px]" data-name="Hero Right (Video)">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-0 opacity-40" data-name="Video Poster Graphic">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgVideoPosterGraphic} />
        </div>
        <PlayButton />
        <p className="[word-break:break-word] absolute bottom-[32px] font-['EYInterstate:Bold',sans-serif] leading-[normal] left-[calc(50%-93px)] not-italic text-[#1a1a24] text-[12px] translate-y-full whitespace-nowrap">WATCH VIDEO SUMMARY (2:45)</p>
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Hero Section">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[64px] items-center px-[80px] py-[96px] relative size-full">
          <HeroLeft />
          <HeroRightVideo />
        </div>
      </div>
    </div>
  );
}

function SectionHeader() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[#1a1a24] whitespace-nowrap" data-name="Section Header">
      <p className="relative shrink-0 text-[14px] uppercase">MACRO INDICATORS</p>
      <p className="relative shrink-0 text-[32px]">The Meteoric Rise of Artificial Intelligence</p>
    </div>
  );
}

function CardTopHighlight() {
  return (
    <div className="bg-[#ffe600] relative shrink-0 w-full" data-name="Card Top Highlight">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[4px] items-start leading-[normal] not-italic p-[20px] relative size-full text-[#1a1a24] whitespace-nowrap">
        <p className="relative shrink-0 text-[36px]">$48 Bn</p>
        <p className="relative shrink-0 text-[12px] uppercase">Data Centre Surge</p>
      </div>
    </div>
  );
}

function MetaRow() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Meta Row">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24]">ET India</p>
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[#747480]">March 2026</p>
    </div>
  );
}

function CardBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start not-italic p-[20px] relative size-full">
        <MetaRow />
        <p className="font-['EYInterstate:Regular',sans-serif] leading-[1.4] relative shrink-0 text-[#1a1a24] text-[14px] w-full">Indian data centre stocks set to skyrocket as global workloads shift to regional facilities.</p>
      </div>
    </div>
  );
}

function RiseCard() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Rise Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardTopHighlight />
        <CardBody />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function CardTopHighlight1() {
  return (
    <div className="bg-[#ffe600] relative shrink-0 w-full" data-name="Card Top Highlight">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[4px] items-start leading-[normal] not-italic p-[20px] relative size-full text-[#1a1a24] whitespace-nowrap">
        <p className="relative shrink-0 text-[36px]">£6 Bn+</p>
        <p className="relative shrink-0 text-[12px] uppercase">UK AI Funding</p>
      </div>
    </div>
  );
}

function MetaRow1() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Meta Row">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24]">Financial Times</p>
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[#747480]">Feb 2026</p>
    </div>
  );
}

function CardBody1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start not-italic p-[20px] relative size-full">
        <MetaRow1 />
        <p className="font-['EYInterstate:Regular',sans-serif] leading-[1.4] relative shrink-0 text-[#1a1a24] text-[14px] w-full">Government confirms over six billion pounds of public-private backing for core LLM research.</p>
      </div>
    </div>
  );
}

function RiseCard1() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Rise Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardTopHighlight1 />
        <CardBody1 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function CardTopHighlight2() {
  return (
    <div className="bg-[#ffe600] relative shrink-0 w-full" data-name="Card Top Highlight">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[4px] items-start leading-[normal] not-italic p-[20px] relative size-full text-[#1a1a24] whitespace-nowrap">
        <p className="relative shrink-0 text-[36px]">$5 Tn</p>
        <p className="relative shrink-0 text-[12px] uppercase">Nvidia Valuation</p>
      </div>
    </div>
  );
}

function MetaRow2() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Meta Row">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24]">Bloomberg</p>
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[#747480]">March 2026</p>
    </div>
  );
}

function CardBody2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start not-italic p-[20px] relative size-full">
        <MetaRow2 />
        <p className="font-['EYInterstate:Regular',sans-serif] leading-[1.4] relative shrink-0 text-[#1a1a24] text-[14px] w-full">Nvidia eclipses historic thresholds as data center infrastructure orders sustain exponential scale.</p>
      </div>
    </div>
  );
}

function RiseCard2() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Rise Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardTopHighlight2 />
        <CardBody2 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function CardTopHighlight3() {
  return (
    <div className="bg-[#ffe600] relative shrink-0 w-full" data-name="Card Top Highlight">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[4px] items-start leading-[normal] not-italic p-[20px] relative size-full text-[#1a1a24] whitespace-nowrap">
        <p className="relative shrink-0 text-[36px]">Enterprise</p>
        <p className="relative shrink-0 text-[12px] uppercase">TCS × Anthropic</p>
      </div>
    </div>
  );
}

function MetaRow3() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Meta Row">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24]">TechCrunch</p>
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[#747480]">Jan 2026</p>
    </div>
  );
}

function CardBody3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start not-italic p-[20px] relative size-full">
        <MetaRow3 />
        <p className="font-['EYInterstate:Regular',sans-serif] leading-[1.4] relative shrink-0 text-[#1a1a24] text-[14px] w-full">TCS launches dedicated Anthropic business unit to deploy Claude models inside Fortune 500 tax teams.</p>
      </div>
    </div>
  );
}

function RiseCard3() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Rise Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardTopHighlight3 />
        <CardBody3 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function RiseGrid() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full" data-name="Rise Grid">
      <RiseCard />
      <RiseCard1 />
      <RiseCard2 />
      <RiseCard3 />
    </div>
  );
}

function TheMeteoricRiseOfAi() {
  return (
    <div className="bg-[#f6f6fa] relative shrink-0 w-full" data-name="The Meteoric Rise of AI">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[40px] items-start p-[80px] relative size-full">
        <SectionHeader />
        <RiseGrid />
      </div>
    </div>
  );
}

function SectionHeader1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[8px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Section Header">
      <p className="relative shrink-0 text-[#FF4136] text-[14px] uppercase">THE REALITY CHECK</p>
      <p className="relative shrink-0 text-[#1a1a24] text-[32px]">When AI Goes Wrong: The Hidden Risks</p>
    </div>
  );
}

function CardTopHighlight4() {
  return (
    <div className="bg-[rgba(239,68,68,0.08)] relative shrink-0 w-full" data-name="Card Top Highlight">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[4px] items-start leading-[normal] not-italic p-[20px] relative size-full whitespace-nowrap">
        <p className="relative shrink-0 text-[#FF4136] text-[36px]">95%</p>
        <p className="relative shrink-0 text-[12px] text-white uppercase">Zero ROI</p>
      </div>
    </div>
  );
}

function MetaRow4() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Meta Row">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#FF4136]">McKinsey Support</p>
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-white">Feb 2026</p>
    </div>
  );
}

function CardBody4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start not-italic p-[20px] relative size-full">
        <MetaRow4 />
        <p className="font-['EYInterstate:Regular',sans-serif] leading-[1.4] relative shrink-0 text-[14px] text-white w-full">Ninety-five percent of generative AI pilots fail to expand past sandbox trial stages due to unstructured execution plans.</p>
      </div>
    </div>
  );
}

function WrongCard() {
  return (
    <div className="bg-[rgba(239,68,68,0.02)] flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Wrong Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardTopHighlight4 />
        <CardBody4 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(239,68,68,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function CardTopHighlight5() {
  return (
    <div className="bg-[rgba(239,68,68,0.08)] relative shrink-0 w-full" data-name="Card Top Highlight">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[4px] items-start leading-[normal] not-italic p-[20px] relative size-full whitespace-nowrap">
        <p className="relative shrink-0 text-[#FF4136] text-[36px]">$500M</p>
        <p className="relative shrink-0 text-[12px] text-white uppercase">Monthly Compute Cost</p>
      </div>
    </div>
  );
}

function MetaRow5() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Meta Row">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#FF4136]">The Information</p>
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-white">March 2026</p>
    </div>
  );
}

function CardBody5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start not-italic p-[20px] relative size-full">
        <MetaRow5 />
        <p className="font-['EYInterstate:Regular',sans-serif] leading-[1.4] relative shrink-0 text-[14px] text-white w-full">Enterprise finds itself saddled with unpredicted token processing fees after deploying unrestrained autonomous loops.</p>
      </div>
    </div>
  );
}

function WrongCard1() {
  return (
    <div className="bg-[rgba(239,68,68,0.02)] flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Wrong Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardTopHighlight5 />
        <CardBody5 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(239,68,68,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function CardTopHighlight6() {
  return (
    <div className="bg-[rgba(239,68,68,0.08)] relative shrink-0 w-full" data-name="Card Top Highlight">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[4px] items-start leading-[normal] not-italic p-[20px] relative size-full whitespace-nowrap">
        <p className="relative shrink-0 text-[#FF4136] text-[36px]">Sanctioned</p>
        <p className="relative shrink-0 text-[12px] text-white uppercase">AI Rationing</p>
      </div>
    </div>
  );
}

function MetaRow6() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="Meta Row">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#FF4136]">{`Bar & Bench`}</p>
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-white">Dec 2025</p>
    </div>
  );
}

function CardBody6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start not-italic p-[20px] relative size-full">
        <MetaRow6 />
        <p className="font-['EYInterstate:Regular',sans-serif] leading-[1.4] relative shrink-0 text-[14px] text-white w-full">Senior legal advisory firm penalized by tax appellate tribunal for submitting fabricated case precedents generated by raw LLM.</p>
      </div>
    </div>
  );
}

function WrongCard2() {
  return (
    <div className="bg-[rgba(239,68,68,0.02)] flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Wrong Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardTopHighlight6 />
        <CardBody6 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(239,68,68,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function WrongGrid() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full" data-name="Wrong Grid">
      <WrongCard />
      <WrongCard1 />
      <WrongCard2 />
    </div>
  );
}

function WhenAiGoesWrong() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="When AI Goes Wrong">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[40px] items-start p-[80px] relative size-full">
        <SectionHeader1 />
        <WrongGrid />
      </div>
    </div>
  );
}

function SectionHeader2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[8px] items-center leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-center w-full" data-name="Section Header">
      <p className="relative shrink-0 text-[14px] uppercase whitespace-nowrap">STRATEGIC DIVIDE</p>
      <p className="min-w-full relative shrink-0 text-[32px] w-[min-content]">Why Fundamentals Matter: Two Paths for Tax Practice</p>
    </div>
  );
}

function PathTitleStack() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Path Title Stack">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#FF4136] text-[20px]">{`The "Just Wing It" Path`}</p>
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[13px] text-white">Treating complex enterprise AI like a simple search engine toy.</p>
    </div>
  );
}

function XCircle() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_9_830)" id="x-circle">
          <path d={svgPaths.p2fb39800} id="Vector" stroke="var(--stroke-0, #FF4136)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_9_830">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PathItem() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Path Item">
      <XCircle />
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-px not-italic relative text-[#1a1a24] text-[14px]">Pilot programs that drag on indefinitely with zero measurable ROI.</p>
    </div>
  );
}

function XCircle1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_9_830)" id="x-circle">
          <path d={svgPaths.p2fb39800} id="Vector" stroke="var(--stroke-0, #FF4136)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_9_830">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PathItem1() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Path Item">
      <XCircle1 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-px not-italic relative text-[#1a1a24] text-[14px]">Hallucinated tax code adjustments trusted blindly in audit filings.</p>
    </div>
  );
}

function XCircle2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_9_830)" id="x-circle">
          <path d={svgPaths.p2fb39800} id="Vector" stroke="var(--stroke-0, #FF4136)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_9_830">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PathItem2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Path Item">
      <XCircle2 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-px not-italic relative text-[#1a1a24] text-[14px]">{`Massive token & compute bills incurred with zero long-term infrastructure strategy.`}</p>
    </div>
  );
}

function XCircle3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_9_830)" id="x-circle">
          <path d={svgPaths.p2fb39800} id="Vector" stroke="var(--stroke-0, #FF4136)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_9_830">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PathItem3() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Path Item">
      <XCircle3 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-px not-italic relative text-[#1a1a24] text-[14px]">Tax professionals sanctioned by authorities for inaccurate machine output.</p>
    </div>
  );
}

function PathItems() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Path Items">
      <PathItem />
      <PathItem1 />
      <PathItem2 />
      <PathItem3 />
    </div>
  );
}

function TheJustWingItPath() {
  return (
    <div className="bg-[rgba(239,68,68,0.03)] flex-[1_0_0] min-w-px relative rounded-[16px]" data-name="The Just Wing It Path">
      <div aria-hidden className="absolute border border-[rgba(239,68,68,0.25)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[32px] relative size-full">
        <PathTitleStack />
        <PathItems />
      </div>
    </div>
  );
}

function VsCircle() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#f6f6fa] content-stretch flex flex-col items-center justify-center left-1/2 rounded-[24px] size-[48px] top-0" data-name="VS Circle">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[14px] whitespace-nowrap">VS</p>
    </div>
  );
}

function PathTitleStack1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Path Title Stack">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#00C864] text-[20px]">The Foundations First Path</p>
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[13px] text-white">Structuring AI with programmatic governance and deep tax context.</p>
    </div>
  );
}

function Check() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="check">
          <path d={svgPaths.p3901e500} id="Vector" stroke="var(--stroke-0, #00C864)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function PathItem4() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Path Item">
      <Check />
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-px not-italic relative text-[#1a1a24] text-[14px]">Intentional model selection tailored to specific data constraints.</p>
    </div>
  );
}

function Check1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="check">
          <path d={svgPaths.p3901e500} id="Vector" stroke="var(--stroke-0, #00C864)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function PathItem5() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Path Item">
      <Check1 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-px not-italic relative text-[#1a1a24] text-[14px]">Rigorous human-in-the-loop oversight workflows integrated from Day 1.</p>
    </div>
  );
}

function Check2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="check">
          <path d={svgPaths.p3901e500} id="Vector" stroke="var(--stroke-0, #00C864)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function PathItem6() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Path Item">
      <Check2 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-px not-italic relative text-[#1a1a24] text-[14px]">Measurable accuracy gains and direct reduction in manual processing hours.</p>
    </div>
  );
}

function Check3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="check">
          <path d={svgPaths.p3901e500} id="Vector" stroke="var(--stroke-0, #00C864)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function PathItem7() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Path Item">
      <Check3 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-px not-italic relative text-[#1a1a24] text-[14px]">Enterprise-ready, secure output ready for high-stakes compliance.</p>
    </div>
  );
}

function PathItems1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Path Items">
      <PathItem4 />
      <PathItem5 />
      <PathItem6 />
      <PathItem7 />
    </div>
  );
}

function TheFoundationsFirstPath() {
  return (
    <div className="bg-[rgba(16,185,129,0.03)] flex-[1_0_0] min-w-px relative rounded-[16px]" data-name="The Foundations First Path">
      <div aria-hidden className="absolute border border-[rgba(16,185,129,0.25)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[32px] relative size-full">
        <PathTitleStack1 />
        <PathItems1 />
      </div>
    </div>
  );
}

function PathComparisonRow() {
  return (
    <div className="content-stretch flex gap-[20px] items-center relative shrink-0 w-full" data-name="Path Comparison Row">
      <TheJustWingItPath />
      <VsCircle />
      <TheFoundationsFirstPath />
    </div>
  );
}

function ArrowDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-down">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="arrow-down">
          <path d={svgPaths.p2ee8d680} id="Vector" stroke="var(--stroke-0, #1A1A24)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function PlayIconWrapper() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Play Icon Wrapper">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[14px] whitespace-nowrap">EXPLORE TIMELINE BELOW</p>
      <ArrowDown />
    </div>
  );
}

function CtaBanner() {
  return (
    <div className="bg-[#ffe600] relative rounded-[12px] shrink-0 w-full" data-name="CTA Banner">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[24px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[18px] whitespace-nowrap">This is why we start here - with the foundations.</p>
          <PlayIconWrapper />
        </div>
      </div>
    </div>
  );
}

function WhyFundamentalsMatter() {
  return (
    <div className="bg-[#f6f6fa] relative shrink-0 w-full" data-name="Why Fundamentals Matter">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[48px] items-start p-[80px] relative size-full">
        <SectionHeader2 />
        <PathComparisonRow />
        <CtaBanner />
      </div>
    </div>
  );
}

function SectionHeader3() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[#1a1a24] whitespace-nowrap" data-name="Section Header">
      <p className="relative shrink-0 text-[14px] uppercase">HISTORICAL TRAJECTORY</p>
      <p className="relative shrink-0 text-[32px]">The Evolution of Artificial Intelligence</p>
    </div>
  );
}

function LayerColorAccent() {
  return <div className="bg-[#4696FF] h-[40px] relative rounded-[6px] shrink-0 w-[12px]" data-name="Layer Color Accent" />;
}

function LayerYear() {
  return (
    <div className="bg-white content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="Layer Year">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[13px] whitespace-nowrap">1943</p>
    </div>
  );
}

function LayerContent() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic relative" data-name="Layer Content">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Artificial Intelligence (AI)</p>
      <p className="font-['EYInterstate:Regular',sans-serif] min-w-full relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Rules-based logic and symbolic processing modeling basic human decision paths.</p>
    </div>
  );
}

function Pill() {
  return (
    <div className="bg-[rgba(59,130,246,0.08)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[99px] shrink-0" data-name="Pill">
      <div aria-hidden className="absolute border border-[rgba(59,130,246,0.25)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#4696FF] text-[11px] whitespace-nowrap">Rules Engine</p>
    </div>
  );
}

function TimelineLayer() {
  return (
    <div className="bg-white content-stretch flex gap-[20px] items-center px-[24px] py-[16px] relative rounded-[12px] shrink-0 w-[1280px]" data-name="Timeline Layer">
      <div aria-hidden className="absolute border border-[#1A1A24] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <LayerColorAccent />
      <LayerYear />
      <LayerContent />
      <Pill />
    </div>
  );
}

function LayerColorAccent1() {
  return <div className="bg-[#00C864] h-[40px] relative rounded-[6px] shrink-0 w-[12px]" data-name="Layer Color Accent" />;
}

function LayerYear1() {
  return (
    <div className="bg-white content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="Layer Year">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[13px] whitespace-nowrap">1959</p>
    </div>
  );
}

function LayerContent1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic relative" data-name="Layer Content">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Machine Learning (ML)</p>
      <p className="font-['EYInterstate:Regular',sans-serif] min-w-full relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Algorithms that learn patterns directly from structured tabular numerical datasets over time.</p>
    </div>
  );
}

function Pill1() {
  return (
    <div className="bg-[rgba(16,185,129,0.08)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[99px] shrink-0" data-name="Pill">
      <div aria-hidden className="absolute border border-[rgba(16,185,129,0.25)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#00C864] text-[11px] whitespace-nowrap">Pattern Recognition</p>
    </div>
  );
}

function TimelineLayer1() {
  return (
    <div className="bg-white content-stretch flex gap-[20px] items-center px-[24px] py-[16px] relative rounded-[12px] shrink-0 w-[1240px]" data-name="Timeline Layer">
      <div aria-hidden className="absolute border border-[#1A1A24] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <LayerColorAccent1 />
      <LayerYear1 />
      <LayerContent1 />
      <Pill1 />
    </div>
  );
}

function LayerColorAccent2() {
  return <div className="bg-[#FF7D1E] h-[40px] relative rounded-[6px] shrink-0 w-[12px]" data-name="Layer Color Accent" />;
}

function LayerYear2() {
  return (
    <div className="bg-white content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="Layer Year">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[13px] whitespace-nowrap">2006</p>
    </div>
  );
}

function LayerContent2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic relative" data-name="Layer Content">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Deep Learning (DL)</p>
      <p className="font-['EYInterstate:Regular',sans-serif] min-w-full relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Multi-layered neural networks built to parse unstructured data like complex image arrays and raw sound.</p>
    </div>
  );
}

function Pill2() {
  return (
    <div className="bg-[rgba(249,115,22,0.08)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[99px] shrink-0" data-name="Pill">
      <div aria-hidden className="absolute border border-[rgba(249,115,22,0.25)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF7D1E] text-[11px] whitespace-nowrap">Neural Networks</p>
    </div>
  );
}

function TimelineLayer2() {
  return (
    <div className="bg-white content-stretch flex gap-[20px] items-center px-[24px] py-[16px] relative rounded-[12px] shrink-0 w-[1200px]" data-name="Timeline Layer">
      <div aria-hidden className="absolute border border-[#747480] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <LayerColorAccent2 />
      <LayerYear2 />
      <LayerContent2 />
      <Pill2 />
    </div>
  );
}

function LayerColorAccent3() {
  return <div className="bg-[#FF3C00] h-[40px] relative rounded-[6px] shrink-0 w-[12px]" data-name="Layer Color Accent" />;
}

function LayerYear3() {
  return (
    <div className="bg-white content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="Layer Year">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[13px] whitespace-nowrap">2017-22</p>
    </div>
  );
}

function LayerContent3() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic relative" data-name="Layer Content">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">{`LLMs & Generative AI`}</p>
      <p className="font-['EYInterstate:Regular',sans-serif] min-w-full relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Transformer architectures capable of predicting the next token and synthesizing novel content.</p>
    </div>
  );
}

function Pill3() {
  return (
    <div className="bg-[rgba(234,88,12,0.08)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[99px] shrink-0" data-name="Pill">
      <div aria-hidden className="absolute border border-[rgba(234,88,12,0.25)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF3C00] text-[11px] whitespace-nowrap">Foundational Models</p>
    </div>
  );
}

function TimelineLayer3() {
  return (
    <div className="bg-white content-stretch flex gap-[20px] items-center px-[24px] py-[16px] relative rounded-[12px] shrink-0 w-[1160px]" data-name="Timeline Layer">
      <div aria-hidden className="absolute border border-[#747480] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <LayerColorAccent3 />
      <LayerYear3 />
      <LayerContent3 />
      <Pill3 />
    </div>
  );
}

function LayerColorAccent4() {
  return <div className="bg-[#4696FF] h-[40px] relative rounded-[6px] shrink-0 w-[12px]" data-name="Layer Color Accent" />;
}

function LayerYear4() {
  return (
    <div className="bg-white content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="Layer Year">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[13px] whitespace-nowrap">2024</p>
    </div>
  );
}

function LayerContent4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic relative" data-name="Layer Content">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Agentic AI</p>
      <p className="font-['EYInterstate:Regular',sans-serif] min-w-full relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Sovereign systems executing sequential multi-step goals with continuous tool-use feedback loops.</p>
    </div>
  );
}

function Pill4() {
  return (
    <div className="bg-[rgba(139,92,246,0.08)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[99px] shrink-0" data-name="Pill">
      <div aria-hidden className="absolute border border-[rgba(139,92,246,0.25)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#4696FF] text-[11px] whitespace-nowrap">Goal Execution</p>
    </div>
  );
}

function TimelineLayer4() {
  return (
    <div className="bg-white content-stretch flex gap-[20px] items-center px-[24px] py-[16px] relative rounded-[12px] shrink-0 w-[1120px]" data-name="Timeline Layer">
      <div aria-hidden className="absolute border border-[#C4C4CD] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <LayerColorAccent4 />
      <LayerYear4 />
      <LayerContent4 />
      <Pill4 />
    </div>
  );
}

function TimelineStack() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Timeline Stack">
      <TimelineLayer />
      <TimelineLayer1 />
      <TimelineLayer2 />
      <TimelineLayer3 />
      <TimelineLayer4 />
    </div>
  );
}

function SimplifierButton() {
  return (
    <div className="content-stretch flex items-start px-[20px] py-[12px] relative rounded-[8px] shrink-0" data-name="Simplifier Button">
      <div aria-hidden className="absolute border border-[#ffe600] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[14px] whitespace-nowrap">{`Need a simpler explanation? Let's use the 'Cabinet Analogy'`}</p>
    </div>
  );
}

function SimplerExplanationButtonWrapper() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Simpler Explanation Button Wrapper">
      <SimplifierButton />
    </div>
  );
}

function TheEvolutionOfAiTimeline() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="The Evolution of AI Timeline">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[40px] items-start p-[80px] relative size-full">
        <SectionHeader3 />
        <TimelineStack />
        <SimplerExplanationButtonWrapper />
      </div>
    </div>
  );
}

function SectionHeader4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[#1a1a24] whitespace-nowrap" data-name="Section Header">
      <p className="relative shrink-0 text-[14px] uppercase">INTERACTIVE RUNTIME</p>
      <p className="relative shrink-0 text-[32px]">See AI in Action - Live Simulation</p>
    </div>
  );
}

function OsDots() {
  return (
    <div className="h-[12px] relative shrink-0 w-[52px]" data-name="OS Dots">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 12">
        <g id="OS Dots">
          <circle cx="6" cy="6" fill="var(--fill-0, #FF4136)" id="Ellipse" r="6" />
          <circle cx="26" cy="6" fill="var(--fill-0, #FFE600)" id="Ellipse_2" r="6" />
          <circle cx="46" cy="6" fill="var(--fill-0, #00C864)" id="Ellipse_3" r="6" />
        </g>
      </svg>
    </div>
  );
}

function ConnectionStatus() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Connection Status">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, #00C864)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#00C864] text-[12px] whitespace-nowrap">CONNECTED</p>
    </div>
  );
}

function ConsoleTopBar() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Console Top Bar">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start justify-between px-[24px] py-[14px] relative size-full">
        <OsDots />
        <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#747480] text-[13px] whitespace-nowrap">EY.ai Copilot (Simulation Mode)</p>
        <ConnectionStatus />
      </div>
    </div>
  );
}

function EyAiAvatar() {
  return (
    <div className="bg-[#ffe600] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="EY AI Avatar">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[14px] whitespace-nowrap">EY</p>
    </div>
  );
}

function StartDemoButton() {
  return (
    <div className="bg-[#ffe600] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Start Demo Button">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[12px] whitespace-nowrap">Start the Demo</p>
    </div>
  );
}

function DemoStartCard() {
  return (
    <div className="bg-[#ffe600] relative rounded-[8px] shrink-0 w-full" data-name="Demo Start Card">
      <div aria-hidden className="absolute border border-[rgba(255,230,0,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#1a1a24] text-[13px] w-[min-content]">Would you like to analyze our sample simulated Ledger 102 for potential Transfer Pricing inconsistencies?</p>
        <StartDemoButton />
      </div>
    </div>
  );
}

function MessageContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px relative" data-name="Message Content">
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[14px] text-white w-full">
        <span className="leading-[1.5]">{`Welcome to the `}</span>
        <span className="font-['EYInterstate:Bold',sans-serif] leading-[1.5] text-[#ffe600]">EY.ai Copilot</span>
        <span className="leading-[1.5]">. This interface is built to demystify complex computations by letting you interrogate simulated corporate ledgers through natural language.</span>
      </p>
      <DemoStartCard />
    </div>
  );
}

function SystemWelcomeBlock() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="System Welcome Block">
      <EyAiAvatar />
      <MessageContent />
    </div>
  );
}

function ConsoleBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="Console Body">
      <div className="content-stretch flex flex-col items-start p-[32px] relative size-full">
        <SystemWelcomeBlock />
      </div>
    </div>
  );
}

function Send() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="send">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_9_815)" id="send">
          <path d={svgPaths.p179fe300} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_9_815">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ConsoleInputBar() {
  return (
    <div className="bg-[rgba(0,0,0,0.1)] relative shrink-0 w-full" data-name="Console Input Bar">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[16px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-px not-italic relative text-[#c4c4cd] text-[14px]">Ask me about tax...</p>
        <Send />
      </div>
    </div>
  );
}

function TerminalSandbox() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Terminal Sandbox">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ConsoleTopBar />
        <ConsoleBody />
        <ConsoleInputBar />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function SeeAiInActionLive() {
  return (
    <div className="bg-[#f6f6fa] relative shrink-0 w-full" data-name="See AI in Action - Live">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[40px] items-start p-[80px] relative size-full">
        <SectionHeader4 />
        <TerminalSandbox />
      </div>
    </div>
  );
}

function SectionHeader5() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[#1a1a24] whitespace-nowrap" data-name="Section Header">
      <p className="relative shrink-0 text-[14px] uppercase">AUTONOMY SPECTRUM</p>
      <p className="relative shrink-0 text-[32px]">LLM vs Agent vs Agentic Workflow vs Multi-Agent</p>
    </div>
  );
}

function StepBadge() {
  return (
    <div className="bg-[#4696FF] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Step Badge">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-white uppercase whitespace-nowrap">Generate</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="bg-[rgba(59,130,246,0.08)] relative shrink-0 w-full" data-name="Card Header">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#4696FF] text-[18px] whitespace-nowrap">LLM / GenAI</p>
        <StepBadge />
      </div>
    </div>
  );
}

function DiagramBox() {
  return (
    <div className="bg-white content-stretch flex h-[32px] items-center justify-center relative rounded-[6px] shrink-0 w-full" data-name="Diagram Box">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold','Noto_Sans:Bold','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Bold','Noto_Sans_Symbols2:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#4696FF] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100, "wght" 700' }}>
        Prompt ➔ Output
      </p>
    </div>
  );
}

function BestForMeta() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Best For Meta">
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[#747480] text-[11px] uppercase">BEST FOR</p>
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[13px]">{`Summarization & Drafting`}</p>
    </div>
  );
}

function CardBody7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#747480] text-[13px] w-full">A static knowledge generator that responds immediately to a prompt. No actions, no long-term memory.</p>
        <DiagramBox />
        <BestForMeta />
      </div>
    </div>
  );
}

function SpectrumCard() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Spectrum Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardHeader />
        <CardBody7 />
      </div>
      <div aria-hidden className="absolute border border-[#747480] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function StepBadge1() {
  return (
    <div className="bg-[#00C864] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Step Badge">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-white uppercase whitespace-nowrap">Act</p>
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="bg-[rgba(16,185,129,0.08)] relative shrink-0 w-full" data-name="Card Header">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#00C864] text-[18px] whitespace-nowrap">AI Agent</p>
        <StepBadge1 />
      </div>
    </div>
  );
}

function DiagramBox1() {
  return (
    <div className="bg-white content-stretch flex h-[32px] items-center justify-center relative rounded-[6px] shrink-0 w-full" data-name="Diagram Box">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold','Noto_Sans:Bold','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Bold','Noto_Sans_Symbols2:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#00C864] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100, "wght" 700' }}>
        Goal ➔ Loop ➔ Output
      </p>
    </div>
  );
}

function BestForMeta1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Best For Meta">
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[#747480] text-[11px] uppercase">BEST FOR</p>
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[13px]">Information Retrieval</p>
    </div>
  );
}

function CardBody8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#747480] text-[13px] w-full">Equipped with memory and tool access. Executes web lookups, makes API queries, and revises its plan.</p>
        <DiagramBox1 />
        <BestForMeta1 />
      </div>
    </div>
  );
}

function SpectrumCard1() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Spectrum Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardHeader1 />
        <CardBody8 />
      </div>
      <div aria-hidden className="absolute border border-[#747480] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function StepBadge2() {
  return (
    <div className="bg-[#FF7D1E] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Step Badge">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-white uppercase whitespace-nowrap">Orchestrate</p>
    </div>
  );
}

function CardHeader2() {
  return (
    <div className="bg-[rgba(249,115,22,0.08)] relative shrink-0 w-full" data-name="Card Header">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF7D1E] text-[18px] whitespace-nowrap">Agentic Workflow</p>
        <StepBadge2 />
      </div>
    </div>
  );
}

function DiagramBox2() {
  return (
    <div className="bg-white content-stretch flex h-[32px] items-center justify-center relative rounded-[6px] shrink-0 w-full" data-name="Diagram Box">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold','Noto_Sans:Bold','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Bold','Noto_Sans_Symbols2:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#FF7D1E] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100, "wght" 700' }}>
        Agent A ➔ Audit ➔ Agent B
      </p>
    </div>
  );
}

function BestForMeta2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Best For Meta">
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[#747480] text-[11px] uppercase">BEST FOR</p>
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[13px]">Multi-Step Tax Filings</p>
    </div>
  );
}

function CardBody9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#747480] text-[13px] w-full">A structured process loop of sequential tasks with integrated human-in-the-loop audit checks.</p>
        <DiagramBox2 />
        <BestForMeta2 />
      </div>
    </div>
  );
}

function SpectrumCard2() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Spectrum Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardHeader2 />
        <CardBody9 />
      </div>
      <div aria-hidden className="absolute border border-[#747480] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function StepBadge3() {
  return (
    <div className="bg-[#4696FF] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Step Badge">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-white uppercase whitespace-nowrap">Collaborate</p>
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="bg-[rgba(139,92,246,0.08)] relative shrink-0 w-full" data-name="Card Header">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#4696FF] text-[18px] whitespace-nowrap">Multi-Agent System</p>
        <StepBadge3 />
      </div>
    </div>
  );
}

function DiagramBox3() {
  return (
    <div className="bg-white content-stretch flex h-[32px] items-center justify-center relative rounded-[6px] shrink-0 w-full" data-name="Diagram Box">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#4696FF] text-[11px] whitespace-nowrap">Persona debate loop</p>
    </div>
  );
}

function BestForMeta3() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Best For Meta">
      <p className="font-['EYInterstate:Regular',sans-serif] relative shrink-0 text-[#747480] text-[11px] uppercase">BEST FOR</p>
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[13px]">Audit Mock-Defense</p>
    </div>
  );
}

function CardBody10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Body">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#747480] text-[13px] w-full">Specialist personas working in parallel (e.g., Transfer Pricing agent debating a Customs compliance agent).</p>
        <DiagramBox3 />
        <BestForMeta3 />
      </div>
    </div>
  );
}

function SpectrumCard3() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Spectrum Card">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <CardHeader3 />
        <CardBody10 />
      </div>
      <div aria-hidden className="absolute border border-[#747480] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function ConnectedSpectrumRow() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Connected Spectrum Row">
      <SpectrumCard />
      <SpectrumCard1 />
      <SpectrumCard2 />
      <SpectrumCard3 />
    </div>
  );
}

function BookOpen() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="book-open">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="book-open">
          <path d={svgPaths.p36206300} id="Vector" stroke="var(--stroke-0, #2E2E38)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#ffe600] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Badge">
      <BookOpen />
    </div>
  );
}

function SummaryTextStack() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic relative" data-name="Summary Text Stack">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">When to Use What?</p>
      <p className="font-['EYInterstate:Regular',sans-serif] min-w-full relative shrink-0 text-[#2E2E38] text-[13px] w-[min-content]">Do not use a Multi-Agent system where a simple LLM draft fits. Match system autonomy strictly to operational audit tolerance.</p>
    </div>
  );
}

function SummaryRowBanner() {
  return (
    <div className="bg-[#f6f6fa] relative rounded-[12px] shrink-0 w-full" data-name="Summary Row Banner">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[20px] items-center p-[24px] relative size-full">
          <Badge />
          <SummaryTextStack />
        </div>
      </div>
    </div>
  );
}

function EvolutionProgression() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Evolution Progression">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[40px] items-start p-[80px] relative size-full">
        <SectionHeader5 />
        <ConnectedSpectrumRow />
        <SummaryRowBanner />
      </div>
    </div>
  );
}

function SectionHeader6() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[#1a1a24] whitespace-nowrap" data-name="Section Header">
      <p className="relative shrink-0 text-[14px] uppercase">FUNCTIONAL TAXONOMY</p>
      <p className="relative shrink-0 text-[32px]">GenAI Can Be Your Smart Thought Partner</p>
    </div>
  );
}

function Star() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Generate</p>
    </div>
  );
}

function CapabilityCard() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Create structural outlines and preliminary brief drafts.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Drafting a customs response draft.</p>
      </div>
    </div>
  );
}

function Star1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star1 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Extract</p>
    </div>
  );
}

function CapabilityCard1() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow1 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Locate target parameters inside massive scanned files.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Pulling loan rates from audit PDFs.</p>
      </div>
    </div>
  );
}

function Star2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star2 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Query</p>
    </div>
  );
}

function CapabilityCard2() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow2 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Retrieve answers from localized document repositories.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Interrogating statutory definitions.</p>
      </div>
    </div>
  );
}

function Star3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star3 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Transform</p>
    </div>
  );
}

function CapabilityCard3() {
  return (
    <div className="bg-white col-4 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow3 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Reformat tabular listings into valid tax formats.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Structuring transaction logs to ledger tables.</p>
      </div>
    </div>
  );
}

function Star4() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star4 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Classify</p>
    </div>
  );
}

function CapabilityCard4() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[12px] row-2 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow4 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Categorize line-item transactions automatically.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Tagging capital vs revenue expenses.</p>
      </div>
    </div>
  );
}

function Star5() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star5 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Summarise</p>
    </div>
  );
}

function CapabilityCard5() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[12px] row-2 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow5 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Condense long-form regulatory briefs into bullet summaries.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Reading 200-page high court judgments.</p>
      </div>
    </div>
  );
}

function Star6() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star6 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Analyse</p>
    </div>
  );
}

function CapabilityCard6() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[12px] row-2 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow6 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Examine financial reports for internal math outliers.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Scanning tax schedules for reconciliation errors.</p>
      </div>
    </div>
  );
}

function Star7() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star7 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Evaluate</p>
    </div>
  );
}

function CapabilityCard7() {
  return (
    <div className="bg-white col-4 justify-self-stretch relative rounded-[12px] row-2 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow7 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Verify contracts against compliance checklists.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Highlighting missing clause safeguards.</p>
      </div>
    </div>
  );
}

function Star8() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star8 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Explain</p>
    </div>
  );
}

function CapabilityCard8() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[12px] row-3 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow8 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Simplify complex cross-border guidelines on request.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Explaining BEPS Pillar Two parameters.</p>
      </div>
    </div>
  );
}

function Star9() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star9 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Compare</p>
    </div>
  );
}

function CapabilityCard9() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[12px] row-3 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow9 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Compare tax regulations across multiple active years.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Contrasting Finance Act revisions.</p>
      </div>
    </div>
  );
}

function Star10() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star10 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Advise</p>
    </div>
  );
}

function CapabilityCard10() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[12px] row-3 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow10 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Model hypothetical tax structuring variations.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Analyzing local restructuring options.</p>
      </div>
    </div>
  );
}

function Star11() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="star">
          <path d={svgPaths.p2d98d000} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconRow11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Row">
      <Star11 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[16px] whitespace-nowrap">Synthesize</p>
    </div>
  );
}

function CapabilityCard11() {
  return (
    <div className="bg-white col-4 justify-self-stretch relative rounded-[12px] row-3 self-start shrink-0" data-name="Capability Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative size-full">
        <IconRow11 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#747480] text-[13px] w-[min-content]">Combine disparate sources into unified summaries.</p>
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#4696FF] text-[12px] w-[min-content]">e.g. Consolidating state tax policy revisions.</p>
      </div>
    </div>
  );
}

function CapabilitiesGrid() {
  return (
    <div className="gap-x-[20px] gap-y-[20px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(3,fit-content(100%))] relative shrink-0 w-full" data-name="Capabilities Grid">
      <CapabilityCard />
      <CapabilityCard1 />
      <CapabilityCard2 />
      <CapabilityCard3 />
      <CapabilityCard4 />
      <CapabilityCard5 />
      <CapabilityCard6 />
      <CapabilityCard7 />
      <CapabilityCard8 />
      <CapabilityCard9 />
      <CapabilityCard10 />
      <CapabilityCard11 />
    </div>
  );
}

function CapabilitiesGridSection() {
  return (
    <div className="bg-[#f6f6fa] relative shrink-0 w-full" data-name="Capabilities Grid Section">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[40px] items-start p-[80px] relative size-full">
        <SectionHeader6 />
        <CapabilitiesGrid />
      </div>
    </div>
  );
}

function SectionHeader7() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[8px] items-center leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-center w-full" data-name="Section Header">
      <p className="relative shrink-0 text-[14px] uppercase whitespace-nowrap">KNOWLEDGE CHECK</p>
      <p className="min-w-full relative shrink-0 text-[32px] w-[min-content]">Can You Spot the AI? Mini-Quiz</p>
    </div>
  );
}

function NumCircle() {
  return (
    <div className="bg-[#ffe600] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="Num Circle">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[12px] whitespace-nowrap">1</p>
    </div>
  );
}

function CardTop() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Card Top">
      <NumCircle />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">Google Maps</p>
    </div>
  );
}

function UsesAiButton() {
  return (
    <div className="bg-[rgba(16,185,129,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="Uses AI Button">
      <div aria-hidden className="absolute border border-[#00C864] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#00C864] text-[11px] whitespace-nowrap">Uses AI</p>
        </div>
      </div>
    </div>
  );
}

function NoAiButton() {
  return (
    <div className="bg-[rgba(239,68,68,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="No AI Button">
      <div aria-hidden className="absolute border border-[#FF4136] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF4136] text-[11px] whitespace-nowrap">No AI</p>
        </div>
      </div>
    </div>
  );
}

function QuizButtonsRow() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Quiz Buttons Row">
      <UsesAiButton />
      <NoAiButton />
    </div>
  );
}

function QuizCard() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Quiz Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <CardTop />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#1a1a24] text-[13px] w-full">Suggests alternative routes based on aggregate historic traffic patterns.</p>
        <QuizButtonsRow />
      </div>
    </div>
  );
}

function NumCircle1() {
  return (
    <div className="bg-[#ffe600] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="Num Circle">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[12px] whitespace-nowrap">2</p>
    </div>
  );
}

function CardTop1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Card Top">
      <NumCircle1 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">UPI Fraud Detection</p>
    </div>
  );
}

function UsesAiButton1() {
  return (
    <div className="bg-[rgba(16,185,129,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="Uses AI Button">
      <div aria-hidden className="absolute border border-[#00C864] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#00C864] text-[11px] whitespace-nowrap">Uses AI</p>
        </div>
      </div>
    </div>
  );
}

function NoAiButton1() {
  return (
    <div className="bg-[rgba(239,68,68,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="No AI Button">
      <div aria-hidden className="absolute border border-[#FF4136] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF4136] text-[11px] whitespace-nowrap">No AI</p>
        </div>
      </div>
    </div>
  );
}

function QuizButtonsRow1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Quiz Buttons Row">
      <UsesAiButton1 />
      <NoAiButton1 />
    </div>
  );
}

function QuizCard1() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Quiz Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <CardTop1 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#1a1a24] text-[13px] w-full">Blocks instant transaction spikes that deviate from typical daily spending templates.</p>
        <QuizButtonsRow1 />
      </div>
    </div>
  );
}

function NumCircle2() {
  return (
    <div className="bg-[#ffe600] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="Num Circle">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[12px] whitespace-nowrap">3</p>
    </div>
  );
}

function CardTop2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Card Top">
      <NumCircle2 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">Clock App Alarm</p>
    </div>
  );
}

function UsesAiButton2() {
  return (
    <div className="bg-[rgba(16,185,129,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="Uses AI Button">
      <div aria-hidden className="absolute border border-[#00C864] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#00C864] text-[11px] whitespace-nowrap">Uses AI</p>
        </div>
      </div>
    </div>
  );
}

function NoAiButton2() {
  return (
    <div className="bg-[rgba(239,68,68,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="No AI Button">
      <div aria-hidden className="absolute border border-[#FF4136] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF4136] text-[11px] whitespace-nowrap">No AI</p>
        </div>
      </div>
    </div>
  );
}

function QuizButtonsRow2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Quiz Buttons Row">
      <UsesAiButton2 />
      <NoAiButton2 />
    </div>
  );
}

function QuizCard2() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Quiz Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <CardTop2 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#1a1a24] text-[13px] w-full">Plays ringtones at a hardcoded timestamp designated manually by the user.</p>
        <QuizButtonsRow2 />
      </div>
    </div>
  );
}

function NumCircle3() {
  return (
    <div className="bg-[#ffe600] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="Num Circle">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[12px] whitespace-nowrap">4</p>
    </div>
  );
}

function CardTop3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Card Top">
      <NumCircle3 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">LinkedIn Suggestions</p>
    </div>
  );
}

function UsesAiButton3() {
  return (
    <div className="bg-[rgba(16,185,129,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="Uses AI Button">
      <div aria-hidden className="absolute border border-[#00C864] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#00C864] text-[11px] whitespace-nowrap">Uses AI</p>
        </div>
      </div>
    </div>
  );
}

function NoAiButton3() {
  return (
    <div className="bg-[rgba(239,68,68,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="No AI Button">
      <div aria-hidden className="absolute border border-[#FF4136] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF4136] text-[11px] whitespace-nowrap">No AI</p>
        </div>
      </div>
    </div>
  );
}

function QuizButtonsRow3() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Quiz Buttons Row">
      <UsesAiButton3 />
      <NoAiButton3 />
    </div>
  );
}

function QuizCard3() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Quiz Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <CardTop3 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#1a1a24] text-[13px] w-full">Recommends connections utilizing graph algorithms scoring mutual affiliations.</p>
        <QuizButtonsRow3 />
      </div>
    </div>
  );
}

function NumCircle4() {
  return (
    <div className="bg-[#ffe600] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="Num Circle">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[12px] whitespace-nowrap">5</p>
    </div>
  );
}

function CardTop4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Card Top">
      <NumCircle4 />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#747480] text-[12px] whitespace-nowrap">Gmail Smart Compose</p>
    </div>
  );
}

function UsesAiButton4() {
  return (
    <div className="bg-[rgba(16,185,129,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="Uses AI Button">
      <div aria-hidden className="absolute border border-[#00C864] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#00C864] text-[11px] whitespace-nowrap">Uses AI</p>
        </div>
      </div>
    </div>
  );
}

function NoAiButton4() {
  return (
    <div className="bg-[rgba(239,68,68,0.15)] flex-[1_0_0] min-w-px relative rounded-[6px]" data-name="No AI Button">
      <div aria-hidden className="absolute border border-[#FF4136] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF4136] text-[11px] whitespace-nowrap">No AI</p>
        </div>
      </div>
    </div>
  );
}

function QuizButtonsRow4() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Quiz Buttons Row">
      <UsesAiButton4 />
      <NoAiButton4 />
    </div>
  );
}

function QuizCard4() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Quiz Card">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <CardTop4 />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#1a1a24] text-[13px] w-full">Predicts and suggests complete phrases in real-time as you type a message.</p>
        <QuizButtonsRow4 />
      </div>
    </div>
  );
}

function QuizRow() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Quiz Row">
      <QuizCard />
      <QuizCard1 />
      <QuizCard2 />
      <QuizCard3 />
      <QuizCard4 />
    </div>
  );
}

function SpotTheAiQuizSection() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Spot the AI Quiz Section">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[40px] items-start p-[80px] relative size-full">
        <SectionHeader7 />
        <QuizRow />
      </div>
    </div>
  );
}

function SectionHeader8() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['EYInterstate:Bold',sans-serif] gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[#1a1a24] whitespace-nowrap" data-name="Section Header">
      <p className="relative shrink-0 text-[14px] uppercase">VELOCITY STATISTICS</p>
      <p className="relative shrink-0 text-[32px]">AI Adoption Speed: Time to Reach 100 Million Users</p>
    </div>
  );
}

function BarTrack() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-name="Bar Track">
      <div className="bg-[#747480] h-[24px] relative rounded-[4px] shrink-0 w-[800px]" data-name="Bar Fill" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2E2E38] text-[12px] whitespace-nowrap">75 Years</p>
    </div>
  );
}

function ChartRow() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Chart Row">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[14px] w-[120px]">Telephone</p>
      <BarTrack />
    </div>
  );
}

function BarTrack1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-name="Bar Track">
      <div className="bg-[#747480] h-[24px] relative rounded-[4px] shrink-0 w-[560px]" data-name="Bar Fill" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2E2E38] text-[12px] whitespace-nowrap">16 Years</p>
    </div>
  );
}

function ChartRow1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Chart Row">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[14px] w-[120px]">Mobile</p>
      <BarTrack1 />
    </div>
  );
}

function BarTrack2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-name="Bar Track">
      <div className="bg-[#747480] h-[24px] relative rounded-[4px] shrink-0 w-[400px]" data-name="Bar Fill" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2E2E38] text-[12px] whitespace-nowrap">7 Years</p>
    </div>
  );
}

function ChartRow2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Chart Row">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[14px] w-[120px]">Internet</p>
      <BarTrack2 />
    </div>
  );
}

function BarTrack3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-name="Bar Track">
      <div className="bg-[#747480] h-[24px] relative rounded-[4px] shrink-0 w-[280px]" data-name="Bar Fill" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2E2E38] text-[12px] whitespace-nowrap">4 Years</p>
    </div>
  );
}

function ChartRow3() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Chart Row">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[14px] w-[120px]">iPhone</p>
      <BarTrack3 />
    </div>
  );
}

function BarTrack4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-name="Bar Track">
      <div className="bg-[#747480] h-[24px] relative rounded-[4px] shrink-0 w-[200px]" data-name="Bar Fill" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2E2E38] text-[12px] whitespace-nowrap">2.5 Years</p>
    </div>
  );
}

function ChartRow4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Chart Row">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[14px] w-[120px]">Instagram</p>
      <BarTrack4 />
    </div>
  );
}

function BarTrack5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-name="Bar Track">
      <div className="bg-[#FF4136] h-[24px] relative rounded-[4px] shrink-0 w-[64px]" data-name="Bar Fill" />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF4136] text-[12px] whitespace-nowrap">2 Months</p>
    </div>
  );
}

function ChartRow5() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Chart Row">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#FF4136] text-[14px] w-[120px]">ChatGPT</p>
      <BarTrack5 />
    </div>
  );
}

function ChartHighlightBox() {
  return (
    <div className="[word-break:break-word] content-stretch flex gap-[12px] items-center leading-[normal] not-italic relative shrink-0 w-full" data-name="Chart Highlight Box">
      <p className="font-['EYInterstate:Bold',sans-serif] relative shrink-0 text-[#1a1a24] text-[32px] whitespace-nowrap">100 Million Users in 2 Months</p>
      <p className="flex-[1_0_0] font-['EYInterstate:Regular',sans-serif] min-w-px relative text-[#2E2E38] text-[14px]">- Generative AI is not an incremental technical shift. It is the fastest-adopted business and consumer tool in human history.</p>
    </div>
  );
}

function ChartContainer() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Chart Container">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[20px] items-start p-[32px] relative size-full">
        <ChartRow />
        <ChartRow1 />
        <ChartRow2 />
        <ChartRow3 />
        <ChartRow4 />
        <ChartRow5 />
        <div className="h-0 relative shrink-0 w-full" data-name="Line">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1216 1">
              <line id="Line" stroke="var(--stroke-0, white)" strokeOpacity="0.08" x2="1216" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
        <ChartHighlightBox />
      </div>
    </div>
  );
}

function AiAdoptionSpeedChartSection() {
  return (
    <div className="bg-[#f6f6fa] relative shrink-0 w-full" data-name="AI Adoption Speed Chart Section">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[40px] items-start p-[80px] relative size-full">
        <SectionHeader8 />
        <ChartContainer />
      </div>
    </div>
  );
}

function Eyebrow() {
  return (
    <div className="bg-[#ffe600] content-stretch flex items-start px-[12px] py-[4px] relative rounded-[4px] shrink-0" data-name="Eyebrow">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a24] text-[11px] uppercase whitespace-nowrap">CONGRATULATIONS ON COMPLETING PART 1</p>
    </div>
  );
}

function NextButton() {
  return (
    <div className="bg-[#ffe600] content-stretch flex items-start px-[32px] py-[16px] relative rounded-[8px] shrink-0" data-name="Next Button">
      <p className="[word-break:break-word] font-['EYInterstate:Bold','Noto_Sans:Bold','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Bold','Noto_Sans_Symbols2:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#1a1a24] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100, "wght" 700' }}>
        Continue to Part 2: Basics of Prompting in Tax ➔
      </p>
    </div>
  );
}

function CtaGlowingCard() {
  return (
    <div className="bg-[#f6f6fa] content-stretch drop-shadow-[0px_0px_12px_rgba(255,230,0,0.15)] flex flex-col gap-[24px] items-center p-[48px] relative rounded-[16px] shrink-0 w-[800px]" data-name="CTA Glowing Card">
      <div aria-hidden className="absolute border border-[#ffe600] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Eyebrow />
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#1a1a24] text-[28px] text-center w-[min-content]">{`Fundamentals are clear. Now it's time to use AI effectively.`}</p>
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[1.6] min-w-full not-italic relative shrink-0 text-[#2E2E38] text-[15px] text-center w-[min-content]">{`In Part 2, we will step beyond definitions. We'll explore the immediate mechanics of prompt design, system guidelines, and structured variable patterns designed for concrete corporate tax reporting.`}</p>
      <NextButton />
    </div>
  );
}

function WhatsNextCtaSection() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="What's Next CTA Section">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[80px] py-[96px] relative size-full">
          <CtaGlowingCard />
        </div>
      </div>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0" data-name="Footer Links">
      <p className="relative shrink-0">Privacy Policy</p>
      <p className="relative shrink-0">Terms of Use</p>
      <p className="relative shrink-0">EY.ai Tax Labs Support</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-row items-center size-full">
        <div className="[word-break:break-word] content-stretch flex font-['EYInterstate:Regular',sans-serif] items-center justify-between leading-[normal] not-italic px-[80px] py-[32px] relative size-full text-[#2E2E38] text-[13px] whitespace-nowrap">
          <p className="relative shrink-0">© 2026 EY India AI Tax Hub | Building a better working world</p>
          <FooterLinks />
        </div>
      </div>
    </div>
  );
}

export default function Module1FoundationalAiTraining() {
  return (
    <div className="bg-[#f6f6fa] content-stretch flex flex-col items-start relative size-full" data-name="module-1-foundational-ai-training">
      <TopNavigationBar />
      <HeroSection />
      <TheMeteoricRiseOfAi />
      <WhenAiGoesWrong />
      <WhyFundamentalsMatter />
      <TheEvolutionOfAiTimeline />
      <SeeAiInActionLive />
      <EvolutionProgression />
      <CapabilitiesGridSection />
      <SpotTheAiQuizSection />
      <AiAdoptionSpeedChartSection />
      <WhatsNextCtaSection />
      <Footer />
    </div>
  );
}