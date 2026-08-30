import "./globals.css";
import "./qa-fixes.css";
import "./design-upgrade.css";
import "./nav-animations.css";
import "./responsive-breakpoints.css";
import "./motion-enhancements.css";
import "./accessibility-fixes.css";
import SiteHeader from "./components/SiteHeader";
import MotionEnhancer from "./components/MotionEnhancer";
import SupabaseFetchCache from "./components/SupabaseFetchCache";
import PageTransition from "./components/PageTransition";

export const metadata = {
  title: "Pars Database | Dunfermline Athletic Archive",
  description: "A connected historical archive of Dunfermline Athletic players, matches, seasons, competitions and club history.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://uwhewuwnrcvrnclfzoge.supabase.co" crossOrigin="anonymous"/><link rel="dns-prefetch" href="https://uwhewuwnrcvrnclfzoge.supabase.co"/></head><body><SiteHeader/><SupabaseFetchCache/><MotionEnhancer/><PageTransition>{children}</PageTransition></body></html>;
}
