import { useLayoutEffect, useRef, type RefObject } from "react";
import { createBrowserRouter, Outlet, useLocation, useNavigate } from "react-router";
import Home from "../imports/Home2/index";
import { PhasedEngagementView, Phase1View } from "../imports/Frame353/index";
import FoundationalConcepts from "../pages/FoundationalConcepts";
import AiTaxPrompting from "../pages/AiTaxPrompting";
import M365CopilotHub from "../pages/M365CopilotHub";
import BrainstormingUseCases from "../pages/BrainstormingUseCases";
import GuidanceImplementation from "../pages/GuidanceImplementation";
import ClosureAiReinforcement from "../pages/ClosureAiReinforcement";

// ── /  ──────────────────────────────────────────────────────────────────────
function HomeRoute() {
  return (
    <div className="relative w-full max-w-full min-w-0 overflow-x-hidden">
      <Home />
    </div>
  );
}

// ── /phased  ─────────────────────────────────────────────────────────────────
function PhasedRoute() {
  const navigate = useNavigate();
  // The Phase 2 card routes through onNavigateToBrainstorming. An
  // onNavigateToPhase2 prop was also passed here, but PhasedEngagementView
  // never declared or consumed it, so it silently did nothing — removed.
  return (
    <div className="relative w-full max-w-full min-w-0 overflow-x-hidden">
      <PhasedEngagementView
        onNavigateToPhase1={() => navigate("/phase1")}
        onNavigateToBrainstorming={() => navigate("/phase2")}
        onNavigateToImplementation={() => navigate("/guidance-implementation")}
        onNavigateToClosure={() => navigate("/closure-ai-reinforcement")}
      />
    </div>
  );
}

// ── /guidance-implementation  ────────────────────────────────────────────────
function GuidanceImplementationRoute() {
  const navigate = useNavigate();
  return (
    <div className="size-full">
      <GuidanceImplementation onBack={() => navigate("/phased")} onNavigate={navigate} />
    </div>
  );
}

// ── /phase1  ─────────────────────────────────────────────────────────────────
function Phase1Route() {
  const navigate = useNavigate();
  return (
    <div style={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
      <Phase1View
        onNavigate={navigate}
        onNavigateToFoundational={() => navigate("/foundational")}
        onNavigateToAiTaxPrompting={() => navigate("/ai-tax-prompting")}
        onNavigateToCopilotHub={() => navigate("/copilot-hub")}
      />
    </div>
  );
}

// ── /phase2  ─────────────────────────────────────────────────────────────────
function Phase2Route() {
  const navigate = useNavigate();
  return (
    <div className="size-full">
      <BrainstormingUseCases
        onBack={() => navigate("/phased")}
        onNavigate={navigate}
      />
    </div>
  );
}

// ── /copilot-hub  ────────────────────────────────────────────────────────────
function CopilotHubRoute() {
  const navigate = useNavigate();
  return (
    <div className="size-full">
      <M365CopilotHub onBack={() => navigate("/phase1")} onNavigate={navigate} />
    </div>
  );
}

// ── /ai-tax-prompting  ───────────────────────────────────────────────────────
function AiTaxPromptingRoute() {
  const navigate = useNavigate();
  return (
    <div className="size-full">
      <AiTaxPrompting onBack={() => navigate("/phase1")} onNavigate={navigate} />
    </div>
  );
}

// ── /foundational  ──────────────────────────────────────────────────────────
function FoundationalRoute() {
  const navigate = useNavigate();
  return (
    <div className="size-full">
      <FoundationalConcepts onBack={() => navigate("/phase1")} onNavigate={navigate} />
    </div>
  );
}

// ── /closure-ai-reinforcement  ───────────────────────────────────────────────
function ClosureAiReinforcementRoute() {
  const navigate = useNavigate();
  return (
    <div className="size-full">
      <ClosureAiReinforcement onBack={() => navigate("/phased")} onNavigate={navigate} />
    </div>
  );
}

/**
 * Resets scroll to the top on every route change.
 *
 * The page scroller is the Root shell below — `size-full overflow-auto` — not
 * the window. `document.scrollingElement.scrollTop` and `window.scrollY` both
 * stay pinned at 0 no matter how far down the app is scrolled, so the
 * `window.scrollTo(0, 0)` calls that earlier fixes reached for were no-ops.
 * Scrolling the shell itself is what actually works.
 *
 * useLayoutEffect (not useEffect) so the reset lands before paint — otherwise
 * the new page flashes at the outgoing page's scroll offset first.
 *
 * A hash link (/page#section) is left alone so in-page anchors still work.
 */
function ScrollToTop({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return;
    containerRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Belt-and-braces: if the shell ever stops being the scroller, this keeps working.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, containerRef]);

  return null;
}

// ── Root layout  ─────────────────────────────────────────────────────────────
function Root() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={scrollRef} className="size-full overflow-auto bg-white">
      <ScrollToTop containerRef={scrollRef} />
      <Outlet />
    </div>
  );
}

// ── Router  ──────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomeRoute },
      { path: "phased", Component: PhasedRoute },
      { path: "phase1", Component: Phase1Route },
      { path: "phase2", Component: Phase2Route },
      { path: "ai-tax-prompting", Component: AiTaxPromptingRoute },
      { path: "foundational", Component: FoundationalRoute },
      { path: "copilot-hub", Component: CopilotHubRoute },
      { path: "guidance-implementation", Component: GuidanceImplementationRoute },
      { path: "closure-ai-reinforcement", Component: ClosureAiReinforcementRoute },
    ],
  },
]);
