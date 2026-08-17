import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { layout } from "./design-kit/tokens";

// Single source of truth: tokens.ts → CSS var used by every page
document.documentElement.style.setProperty("--ey-content-width", layout.contentWidth);

// Disable browser scroll restoration globally — each page manages its own scroll position
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

createRoot(document.getElementById("root")!).render(<App />);
  