/**
 * EY Global Design Kit
 *
 * Import any component or token from this single entry point:
 *
 *   import { EYNavbar, EYButton, EYCard, colors } from '@/design-kit';
 *   // or
 *   import { EYFrame, EYTypography } from '../design-kit';
 */

// ── Tokens ───────────────────────────────────────────────────────────────────
export {
  colors,
  fonts,
  typeScale,
  spacing,
  layout,
  contentRailStyle,
  contentInlinePad,
  spectrumGradients,
  spectrumCss,
  frameStroke,
} from './tokens';

// ── Components ───────────────────────────────────────────────────────────────
export { EYLogo } from './EYLogo';
export { EYButton } from './EYButton';
export { EYNavbar } from './EYNavbar';
export { EYFooter } from './EYFooter';
export { EYCard, StepBadge } from './EYCard';
export { EYFrame } from './EYFrame';
export { SiteHeader } from './SiteHeader';
export type { SiteSection } from './SiteHeader';
export { ModuleHeader, ModulePrevNext, SUBNAV_SCROLL_MARGIN, SUBNAV_SCROLL_OFFSET, useModuleSectionHashScroll } from './LearningNav';
export { EYWhatsNext, EYWhatsNextHighlight } from './EYWhatsNext';
export { TabRail } from './TabRail';
export {
  MODULES,
  PHASES,
  PHASE_LABEL,
  PHASE_NUMBER,
  PHASE_PATH,
  BRAND_LABEL,
  TOTAL_MODULES,
  TOTAL_PHASES,
  getModule,
  getPhase,
  getCurrentPhase,
  getAllModules,
  getAdjacentModules,
  getSubModuleGroups,
  moduleSectionPath,
  isModuleAvailable,
} from './curriculum';
export {
  EYEyebrow,
  SectionAnchorTitle,
  EYDisplay,
  EYHeading,
  EYSubheading,
  EYBody,
  EYCTA,
  EYCaption,
  EYQuote,
} from './EYTypography';

// ── Types re-exported for convenience ────────────────────────────────────────
export type { NavItem } from './EYNavbar';
export type { ModuleId, CurriculumModule, SubModule, CurriculumPhase } from './curriculum';
