import "./globals.css";
import "./qa-fixes.css";
import "./design-upgrade.css";
import "./nav-animations.css";
import "./text-reveal.css";
import "./page-transitions.css";
import "./responsive-breakpoints.css";
import "./motion-enhancements.css";
import SiteHeader from "./components/SiteHeader";
import ScrollAnimations from "./components/ScrollAnimations";
import MotionEnhancer from "./components/MotionEnhancer";
import TimelineMotion from "./components/TimelineMotion";
import PageTransition from "./components/PageTransition";

export const metadata = {
  title: "Pars Database | Dunfermline Athletic Archive",
  description: "A connected historical archive of Dunfermline Athletic players, matches, seasons, competitions and club history.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader/><ScrollAnimations/><MotionEnhancer/><TimelineMotion/><PageTransition>{children}</PageTransition></body></html>;
}
