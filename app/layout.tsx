import "./globals.css";
import "./qa-fixes.css";
import "./design-upgrade.css";
import "./nav-animations.css";
import "./responsive-breakpoints.css";
import "./motion-enhancements.css";
import "./accessibility-fixes.css";
import SiteHeader from "./components/SiteHeader";
import MotionEnhancer from "./components/MotionEnhancer";
import TimelineMotion from "./components/TimelineMotion";
import PageTransition from "./components/PageTransition";
import SupabaseFetchCache from "./components/SupabaseFetchCache";

export const metadata = {
  title: "Pars Database | Dunfermline Athletic Archive",
  description: "A connected historical archive of Dunfermline Athletic players, matches, seasons, competitions and club history.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SupabaseFetchCache/><SiteHeader/><MotionEnhancer/><TimelineMotion/><PageTransition>{children}</PageTransition></body></html>;
}
