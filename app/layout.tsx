import "./globals.css";
import "./qa-fixes.css";
import "./design-upgrade.css";
import "./nav-animations.css";
import "./text-reveal.css";
import "./page-transitions.css";
import "./responsive-breakpoints.css";
import SiteHeader from "./components/SiteHeader";
import ScrollAnimations from "./components/ScrollAnimations";

export const metadata = {
  title: "Pars Database | Dunfermline Athletic Archive",
  description: "A connected historical archive of Dunfermline Athletic players, matches, seasons, competitions and club history.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader/><ScrollAnimations/>{children}</body></html>;
}
