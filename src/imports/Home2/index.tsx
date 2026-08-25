import { useNavigate } from "react-router";
import { SiteHeader } from "../../design-kit/SiteHeader";
import svgPaths from "./svg-9qo006nmu4";
import imgIndianTaxLady1 from "./cf830df8acc30d2ebe5a2c08149d39333d1079bd.png";
import imgResearchLitigation1 from "./c47d9607a0edbab8c4595b79a2b7a480058303f1.png";
import imgCompliance1 from "./3ade42659624abadce59b0790baf7f1d24194a8a.png";
import imgTaxLab1 from "./f68a98c7299f7f60dd06bf1faca4b1c636e4b255.png";
import { imgGroup, imgBackground, imgBackground1, imgBackground2, imgBackground3 } from "./svg-swdqj";

function Container() {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-[#2e2e38] to-[rgba(0,0,0,0)] via-[62.981%] via-[rgba(46,46,56,0.7)] w-full" data-name="Container">
      <div className="absolute inset-0 w-full h-full" data-name="IndianTaxLady 1">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover object-[70%_center] size-full" src={imgIndianTaxLady1} />
          <div className="absolute bg-[rgba(0,0,0,0.25)] inset-0" />
        </div>
      </div>
    </div>
  );
}

function Section() {
  return (
    <section className="relative shrink-0 w-full min-h-[420px] md:min-h-[560px] lg:min-h-[632px] overflow-hidden" data-name="section">
      <Container />
      <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#ffe600]" />
      <div className="relative z-[1] flex flex-col gap-5 md:gap-6 max-w-[640px] px-5 sm:px-8 md:px-10 pt-24 pb-16 md:pt-32 md:pb-20">
        <h1 className="font-['EYInterstate:Bold',sans-serif] leading-[1.1] not-italic text-[#ffe600] text-[36px] sm:text-[48px] md:text-[58px] tracking-[-0.02em] m-0">
          EY India AI Tax Hub
        </h1>
        <p className="font-['EYInterstate:Bold',sans-serif] leading-[1.45] not-italic m-0 text-[16px] sm:text-[18px] md:text-[20px] text-[rgba(255,255,255,0.85)]">
          A program offering suite of AI Agents for deep research, compliance, litigation and AI led bespoke tax function transformation capabilities. It is backed by trusted tax databases and sharpest tax minds in India.
        </p>
        <button
          type="button"
          className="bg-[#ffe600] border-0 cursor-pointer font-['EYInterstate:Regular',sans-serif] text-[#2e2e38] text-[16px] px-6 py-3 w-fit"
        >
          Know More
        </button>
      </div>
    </section>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full flex flex-col gap-2 items-center text-center px-2" data-name="Container">
      <h2 className="font-['EYInterstate:Bold',sans-serif] leading-[1.25] not-italic m-0 text-[#2e2e38] text-[24px] sm:text-[28px] md:text-[32px] tracking-[-0.02em]">
        Discover what&apos;s happening on the Hub
      </h2>
      <p className="font-['EYInterstate:Regular',sans-serif] leading-[1.5] not-italic m-0 text-[#747480] text-[15px] md:text-[16px] max-w-[720px]">
        The three foundational pillars of the EY India AI Tax Hub, designed to revolutionize your end-to-end tax operations.
      </p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-[#ffe600] content-stretch flex items-center justify-center py-[8px] relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Bold',sans-serif] leading-[32.004px] min-w-px not-italic relative text-[#2E2E38] text-[25.998px] text-center">{`Research & Litigation`}</p>
    </div>
  );
}

function FileSearchCorner() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 size-[45px] top-[71px]" data-name="file-search-corner 4">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 45">
        <g id="file-search-corner 4">
          <path d={svgPaths.p17d3fb80} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d={svgPaths.p1b4fc880} id="Vector_2" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d="M39.375 41.25L33.975 35.85" id="Vector_3" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d={svgPaths.p26318a80} id="Vector_4" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-gradient-to-t from-[61.538%] from-[rgba(46,46,56,0)] h-[192px] left-0 to-[rgba(0,0,0,0)] top-[0.41px] w-full" data-name="Container">
      <div className="absolute inset-0 w-full h-full" data-name="ResearchLitigation 1">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgResearchLitigation1} />
          <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
        </div>
      </div>
      <FileSearchCorner />
    </div>
  );
}

function H2() {
  return <div className="absolute h-[27px] left-[16px] top-[149px] w-full max-w-full" data-name="h3" />;
}

function Container4() {
  return (
    <div className="h-[192px] relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-between p-[10px] relative size-full">
          <Container5 />
          <H2 />
        </div>
      </div>
    </div>
  );
}

function P2() {
  return (
    <div className="h-[67.195px] relative shrink-0 w-full" data-name="p">
      <p className="[word-break:break-word] absolute font-['EYInterstate:Bold',sans-serif] leading-[23.996px] left-0 not-italic text-[#747480] text-[16.002px] top-[0.5px] w-full">Platform for research and litigation with deeply embedded agentic capabilities.</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="bg-[#C4C4CD] content-stretch flex items-center justify-center px-[16px] py-[7px] relative shrink-0" data-name="Link">
        <div aria-hidden className="absolute border border-[#747480] border-solid inset-0 pointer-events-none" />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1a1a24] text-[14px] whitespace-nowrap">Know more</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative rounded-[5px] w-full" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-between p-[20px] relative size-full">
          <P2 />
          <Frame24 />
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container4 />
          <Container6 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#ffe600] border-solid inset-0 pointer-events-none shadow-[0px_1px_2px_0px_rgba(35,35,47,0.06),0px_4px_8px_0px_rgba(35,35,47,0.08)]" />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col items-stretch relative w-full min-w-0 md:min-h-[391px]">
      <div aria-hidden className="absolute border border-[#C4C4CD] border-solid inset-[-1px] pointer-events-none" />
      <Frame20 />
      <Container3 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#ffe600] content-stretch flex items-center justify-center py-[8px] relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Bold',sans-serif] leading-[32.004px] min-w-px not-italic relative text-[#2E2E38] text-[25.998px] text-center">Compliance</p>
    </div>
  );
}

function ListChecks() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 size-[45px] top-[73.41px]" data-name="list-checks 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 45">
        <g id="list-checks 1">
          <path d="M24.375 9.375H39.375" id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d="M24.375 22.5H39.375" id="Vector_2" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d="M24.375 35.625H39.375" id="Vector_3" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d={svgPaths.p3eb8a400} id="Vector_4" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d={svgPaths.p2dd93a80} id="Vector_5" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-[#2e2e38] h-[192px] left-0 top-0 w-full" data-name="Container">
      <div className="absolute inset-0 w-full h-full" data-name="Compliance 1">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgCompliance1} />
          <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
        </div>
      </div>
      <ListChecks />
    </div>
  );
}

function H3() {
  return <div className="absolute h-[27px] left-[16px] top-[149px] w-full max-w-full" data-name="h3" />;
}

function Container8() {
  return (
    <div className="h-[192px] relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-between p-[10px] relative size-full">
          <Container9 />
          <H3 />
        </div>
      </div>
    </div>
  );
}

function P3() {
  return (
    <div className="content-stretch flex items-center justify-center py-px relative shrink-0" data-name="p">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[23.996px] not-italic relative shrink-0 text-[#747480] text-[16.002px] w-full">Platforms for multiple tax compliances powered by AI agents</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="bg-[#C4C4CD] content-stretch flex items-center justify-center px-[16px] py-[7px] relative shrink-0" data-name="Link">
        <div aria-hidden className="absolute border border-[#747480] border-solid inset-0 pointer-events-none" />
        <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1a1a24] text-[14px] whitespace-nowrap">Know more</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white relative rounded-[5px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[20px] relative size-full">
        <P3 />
        <Frame25 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container8 />
          <Container10 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#ffe600] border-solid inset-0 pointer-events-none shadow-[0px_1px_2px_0px_rgba(35,35,47,0.06),0px_4px_8px_0px_rgba(35,35,47,0.08)]" />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col items-stretch relative w-full min-w-0 md:min-h-[391px]">
      <div aria-hidden className="absolute border border-[#C4C4CD] border-solid inset-[-1px] pointer-events-none" />
      <Frame22 />
      <Container7 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-[#ffe600] content-stretch flex items-center justify-center py-[8px] relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['EYInterstate:Bold',sans-serif] leading-[32.004px] min-w-px not-italic relative text-[#2E2E38] text-[25.998px] text-center">EY.ai Tax Labs</p>
    </div>
  );
}

function FlaskConical() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 size-[45px] top-[73.41px]" data-name="flask-conical (1) 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 45">
        <g id="flask-conical (1) 1">
          <path d={svgPaths.p110f3b80} id="Vector" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d="M12.0994 28.125H32.9006" id="Vector_2" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d="M15.9375 3.75H29.0625" id="Vector_3" stroke="var(--stroke-0, #FFE600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-gradient-to-t from-1/2 from-[rgba(46,46,56,0.6)] h-[192px] left-0 to-[rgba(0,0,0,0)] top-0 w-full" data-name="Container">
      <div className="absolute inset-0 w-full h-full" data-name="Tax lab 1">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[150.96%] left-[-30.48%] max-w-none top-[-32.57%] w-[153.51%]" src={imgTaxLab1} />
          </div>
          <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
        </div>
      </div>
      <FlaskConical />
    </div>
  );
}

function H4() {
  return <div className="h-[27px] relative shrink-0 w-full max-w-full" data-name="h3" />;
}

function Container12() {
  return (
    <div className="h-[192px] relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[10px] items-start p-[16px] relative size-full">
          <Container13 />
          <H4 />
        </div>
      </div>
    </div>
  );
}

function P4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="p">
      <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[23.996px] not-italic relative shrink-0 text-[#747480] text-[16.002px] w-full">Your space to build the tax function of the future</p>
    </div>
  );
}

function Frame26({ onOpenTaxLabs }: { onOpenTaxLabs?: () => void }) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenTaxLabs?.();
        }}
        className="bg-[#ffe600] border-0 content-stretch flex items-center justify-center px-[16px] py-[7px] relative shrink-0 cursor-pointer"
        data-name="Get started"
      >
        <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#2e2e38] text-[14px] whitespace-nowrap">Get Started</p>
      </button>
    </div>
  );
}

function Container14({ onOpenTaxLabs }: { onOpenTaxLabs?: () => void }) {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-between p-[20px] relative size-full">
          <P4 />
          <Frame26 onOpenTaxLabs={onOpenTaxLabs} />
        </div>
      </div>
    </div>
  );
}

function Container11({ onOpenTaxLabs }: { onOpenTaxLabs?: () => void }) {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container12 />
          <Container14 onOpenTaxLabs={onOpenTaxLabs} />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#ffe600] border-solid inset-0 pointer-events-none shadow-[0px_1px_2px_0px_rgba(35,35,47,0.06),0px_4px_8px_0px_rgba(35,35,47,0.08)]" />
    </div>
  );
}

function Frame18({ onOpenTaxLabs }: { onOpenTaxLabs?: () => void }) {
  return (
    <div
      onClick={onOpenTaxLabs}
      title="Explore EY.ai Tax Labs"
      className="content-stretch flex flex-col items-stretch relative w-full min-w-0 md:min-h-[391px] bg-transparent border-0 p-0 cursor-pointer text-left"
    >
      <div aria-hidden className="absolute border border-[#C4C4CD] border-solid inset-[-1px] pointer-events-none" />
      <Frame21 />
      <Container11 onOpenTaxLabs={onOpenTaxLabs} />
    </div>
  );
}

function Frame19({ onOpenTaxLabs }: { onOpenTaxLabs?: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative shrink-0 w-full min-w-0">
      <Frame16 />
      <Frame17 />
      <Frame18 onOpenTaxLabs={onOpenTaxLabs} />
    </div>
  );
}

function Section1({ onOpenTaxLabs }: { onOpenTaxLabs?: () => void }) {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Section">
      <div className="content-stretch flex flex-col gap-8 items-stretch p-5 sm:p-8 md:p-10 relative size-full">
        <Container2 />
        <Frame19 onOpenTaxLabs={onOpenTaxLabs} />
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden className="absolute border-[#c4c4cd] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip pb-10 md:pb-[60px] relative shrink-0 w-full" data-name="Container">
      <Separator />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[0_0.16%_0_0] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[91.85px_100px]" style={{ maskImage: `url("${imgGroup}")` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 91.8509 100">
        <g id="Group">
          <path d={svgPaths.p3955b500} fill="var(--fill-0, #FFE600)" id="Vector" />
          <path d={svgPaths.pf788bc0} fill="var(--fill-0, #2E2E38)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[0_0.16%_0_0]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function EyLogo() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[7px] relative shrink-0 w-full" data-name="EY logo">
      <div className="h-[100px] overflow-clip relative shrink-0 w-[92px]" data-name="Component 6">
        <ClipPathGroup />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] px-[8px] relative shrink-0 w-[221.33px]" data-name="Container">
      <EyLogo />
    </div>
  );
}

function ItemMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[6.59px] pl-[24px] pt-[7px] relative shrink-0" data-name="Item:margin">
      <div className="h-[20px] relative shrink-0 w-[122.25px]" data-name="Component 1">
        <div aria-hidden className="absolute border-[#2e2e38] border-b border-solid inset-0 pointer-events-none" />
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['EYInterstate:Bold',sans-serif] h-[24px] justify-center leading-[0] left-0 not-italic text-[#2e2e38] text-[16px] top-[9.5px] w-[122.639px]">
          <p className="leading-[24px]">Connect with us</p>
        </div>
      </div>
    </div>
  );
}

function ItemMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[6.59px] pl-[24px] pt-[7px] relative shrink-0" data-name="Item:margin">
      <div className="h-[20px] relative shrink-0 w-[101.56px]" data-name="Component 1">
        <div aria-hidden className="absolute border-[#2e2e38] border-b border-solid inset-0 pointer-events-none" />
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['EYInterstate:Bold',sans-serif] h-[24px] justify-center leading-[0] left-0 not-italic text-[#2e2e38] text-[16px] top-[9.5px] w-[101.917px]">
          <p className="leading-[24px]">Our locations</p>
        </div>
      </div>
    </div>
  );
}

function ItemMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[6.59px] pl-[24px] pt-[7px] relative shrink-0" data-name="Item:margin">
      <div className="h-[20px] relative shrink-0 w-[48.92px]" data-name="Component 1">
        <div aria-hidden className="absolute border-[#2e2e38] border-b border-solid inset-0 pointer-events-none" />
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['EYInterstate:Bold',sans-serif] h-[24px] justify-center leading-[0] left-0 not-italic text-[#2e2e38] text-[16px] top-[9.5px] w-[49.27px]">
          <p className="leading-[24px]">My EY</p>
        </div>
      </div>
    </div>
  );
}

function ItemMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[6.59px] pl-[24px] pt-[7px] relative shrink-0" data-name="Item:margin">
      <div className="h-[20px] relative shrink-0 w-[67.06px]" data-name="Component 1">
        <div aria-hidden className="absolute border-[#2e2e38] border-b border-solid inset-0 pointer-events-none" />
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['EYInterstate:Bold',sans-serif] h-[24px] justify-center leading-[0] left-0 not-italic text-[#2e2e38] text-[16px] top-[9.5px] w-[67.363px]">
          <p className="leading-[24px]">Site map</p>
        </div>
      </div>
    </div>
  );
}

function ItemMargin4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[6.59px] pl-[24px] pt-[7px] relative shrink-0" data-name="Item:margin">
      <div className="h-[20px] relative shrink-0 w-[133.05px]" data-name="Component 1">
        <div aria-hidden className="absolute border-[#2e2e38] border-b border-solid inset-0 pointer-events-none" />
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['EYInterstate:Bold',sans-serif] h-[24px] justify-center leading-[0] left-0 not-italic text-[#2e2e38] text-[16px] top-[9.5px] w-[133.353px]">
          <p className="leading-[24px]">Legal and privacy</p>
        </div>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="content-center flex flex-wrap gap-2.5 items-center justify-start sm:justify-end relative shrink-0 w-auto max-w-full" data-name="List">
      <ItemMargin />
      <ItemMargin1 />
      <ItemMargin2 />
      <ItemMargin3 />
      <ItemMargin4 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start pb-8 md:pb-[56.41px] pt-[30px] px-0 md:px-[8px] relative shrink-0 w-full md:w-auto md:max-w-[640px] min-w-0" data-name="Container">
      <List />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col md:flex-row md:items-center justify-between gap-6 relative shrink-0 w-full min-w-0">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-1 flex-col items-start min-w-0 relative" data-name="Container">
      <p className="m-0 font-['EYInterstate:Light',sans-serif] text-[#747480] text-[14px] leading-[20px] max-w-prose">
        EY refers to the global organization, and may refer to one or more, of the member firms of Ernst & Young Global Limited, each of which is a separate legal entity. Ernst & Young Global Limited, a UK company limited by guarantee, does not provide services to clients.
      </p>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="size-[44px] relative shrink-0" data-name="Mask Group">
      <div className="absolute bg-[#2e2e38] inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[100%_100%]" style={{ maskImage: `url("${imgBackground}")` }} data-name="Background" />
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 size-[44px]" data-name="Item">
      <div className="content-stretch flex items-center justify-center relative rounded-[22px] size-full" data-name="Component 7">
        <div className="absolute bg-white left-[2px] rounded-[20px] size-[40px] top-[2px]" data-name="Background+Border">
          <div aria-hidden className="absolute border border-[#c4c4cd] border-solid inset-0 pointer-events-none rounded-[20px]" />
        </div>
        <MaskGroup />
      </div>
    </div>
  );
}

function MaskGroup1() {
  return (
    <div className="size-[44px] relative shrink-0" data-name="Mask Group">
      <div className="absolute bg-[#2e2e38] inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[100%_100%]" style={{ maskImage: `url("${imgBackground1}")` }} data-name="Background" />
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 size-[44px]" data-name="Item">
      <div className="content-stretch flex items-center justify-center relative rounded-[22px] size-full" data-name="Component 7">
        <div className="absolute bg-white left-[2px] rounded-[20px] size-[40px] top-[2px]" data-name="Background+Border">
          <div aria-hidden className="absolute border border-[#c4c4cd] border-solid inset-0 pointer-events-none rounded-[20px]" />
        </div>
        <MaskGroup1 />
      </div>
    </div>
  );
}

function MaskGroup2() {
  return (
    <div className="size-[44px] relative shrink-0" data-name="Mask Group">
      <div className="absolute bg-[#2e2e38] inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[100%_100%]" style={{ maskImage: `url("${imgBackground2}")` }} data-name="Background" />
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 size-[44px]" data-name="Item">
      <div className="content-stretch flex items-center justify-center relative rounded-[22px] size-full" data-name="Component 7">
        <div className="absolute bg-white left-[2px] rounded-[20px] size-[40px] top-[2px]" data-name="Background+Border">
          <div aria-hidden className="absolute border border-[#c4c4cd] border-solid inset-0 pointer-events-none rounded-[20px]" />
        </div>
        <MaskGroup2 />
      </div>
    </div>
  );
}

function MaskGroup3() {
  return (
    <div className="size-[44px] relative shrink-0" data-name="Mask Group">
      <div className="absolute bg-[#2e2e38] inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[100%_100%]" style={{ maskImage: `url("${imgBackground3}")` }} data-name="Background" />
    </div>
  );
}

function Item3() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 size-[44px]" data-name="Item">
      <div className="content-stretch flex items-center justify-center relative rounded-[22px] size-full" data-name="Component 7">
        <div className="absolute bg-white left-[2px] rounded-[20px] size-[40px] top-[2px]" data-name="Background+Border">
          <div aria-hidden className="absolute border border-[#c4c4cd] border-solid inset-0 pointer-events-none rounded-[20px]" />
        </div>
        <MaskGroup3 />
      </div>
    </div>
  );
}

function List1() {
  return (
    <div className="content-center flex flex-wrap gap-2.5 items-center justify-start sm:justify-end relative shrink-0 w-auto max-w-full" data-name="List">
      <Item />
      <Item1 />
      <Item2 />
      <Item3 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col sm:flex-row sm:items-center gap-4 relative shrink-0 w-full min-w-0">
      <Container19 />
      <List1 />
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-[5px] pt-[10px] px-0 sm:px-[8px] relative w-full">
        <Frame15 />
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-8 md:gap-[36px] items-stretch relative shrink-0 w-full min-w-0">
      <Frame14 />
      <Container18 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame12 />
    </div>
  );
}

function Frame({ onOpenTaxLabs }: { onOpenTaxLabs?: () => void }) {
  return (
    <div className="content-stretch flex flex-col items-stretch relative shrink-0 w-full min-w-0">
      <Section />
      <Section1 onOpenTaxLabs={onOpenTaxLabs} />
      <div className="bg-white content-stretch flex flex-col items-stretch justify-center px-4 sm:px-8 md:px-[64px] py-10 md:py-14 relative shrink-0 w-full overflow-hidden" data-name="Footer Final">
        <Container15 />
        <Frame13 />
      </div>
    </div>
  );
}

function Body({ onOpenTaxLabs }: { onOpenTaxLabs?: () => void }) {
  return (
    <div className="relative bg-white content-stretch flex flex-col items-stretch w-full min-w-0" data-name="Body">
      <Frame onOpenTaxLabs={onOpenTaxLabs} />
    </div>
  );
}

function Div4() {
  return <div className="bg-[#ffe600] h-[3px] relative shrink-0 w-full" data-name="div" />;
}

function Container20() {
  return (
    <div className="flex-[1_0_0] h-[42px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute left-0 size-[40px] top-0" data-name="Logo">
          <div className="absolute inset-[50.09%_59.92%_0.87%_0.85%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.6919 19.6154">
              <path d={svgPaths.p27ea6ec0} fill="var(--fill-0, white)" id="Vector" />
            </svg>
          </div>
          <div className="absolute inset-[50.09%_17.76%_0.87%_33.29%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5808 19.6154">
              <path d={svgPaths.p35786b00} fill="var(--fill-0, white)" id="Vector" />
            </svg>
          </div>
          <div className="absolute inset-[0_3.06%_64.62%_0]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38.7776 14.153">
              <path d={svgPaths.p18fe2b40} fill="var(--fill-0, #FFE600)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="h-[42px] relative shrink-0 w-[57.984px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container20 />
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="div">
      <div aria-hidden className="absolute border-[#747480] border-l border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['EYInterstate:Regular',sans-serif] leading-[19.5px] left-[13px] not-italic text-[13px] text-white top-[2px] whitespace-nowrap">India AI Tax Hub</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[42px] relative shrink-0 w-[183.898px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Div6 />
        <Div7 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#ffe600] flex-[1_0_0] min-w-px relative" data-name="button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[22px] py-[7px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Bold',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#2e2e38] text-[13px] text-center whitespace-nowrap">Start Access</p>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[35.5px] relative shrink-0 w-[171.43px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Button1 />
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="content-stretch flex h-[64px] items-center justify-between pr-[0.008px] relative shrink-0 w-[1336px]" data-name="div">
      <Link />
      <Container21 />
    </div>
  );
}

function Nav() {
  return (
    <div className="bg-[#2e2e38] content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="nav">
      <Div4 />
      <Div5 />
    </div>
  );
}

// Only the two site sections that actually exist in this app are shown here.
// The rest of the original Figma export (Research & Litigation, Compliance,
// EY Tax AI Performance, How it helps, Why EY, Responsible AI, Resources,
// Coming soon) belonged to pages that were never built, so they're
// intentionally omitted rather than shown as broken/disabled links.
function Frame1() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      aria-current="page"
      className="relative shrink-0 w-full text-left"
      style={{ background: "none", border: "none", cursor: "default" }}
    >
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
          <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#ffe600] text-[13px] whitespace-nowrap">About EY India AI Tax Hub</p>
        </div>
      </div>
    </button>
  );
}

function Frame5() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/phased")}
      className="content-stretch flex items-center justify-center p-[10px] relative shrink-0"
      style={{ background: "none", border: "none", cursor: "pointer" }}
    >
      <p className="[word-break:break-word] font-['EYInterstate:Regular',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#c4c4cd] text-[13px] whitespace-nowrap">EY.ai Tax Labs</p>
    </button>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <div className="content-stretch flex flex-col items-start px-px relative shrink-0 w-[180px]" data-name="NavLink">
          <Frame1 />
        </div>
        <div className="content-stretch flex flex-col items-start px-px relative shrink-0" data-name="NavLink">
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 w-[892.711px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Frame3 />
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="content-stretch flex items-center pr-[0.008px] relative shrink-0 w-[1192px]" data-name="div">
      <Container22 />
    </div>
  );
}

function Nav1() {
  return (
    <div className="bg-[#2E2E38] content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="nav">
      <Div8 />
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full max-w-full min-w-0 overflow-x-hidden bg-white" data-name="HOME 2">
      <div className="sticky top-0 z-[300] w-full">
        <SiteHeader variant="hub" activeSection="home" onNavigate={navigate} skipLinkTarget="#home-content" />
      </div>
      <div id="home-content" className="w-full min-w-0">
        <Body onOpenTaxLabs={() => navigate("/phased")} />
      </div>
    </div>
  );
}