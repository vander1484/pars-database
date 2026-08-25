import "./globals.css";
import "./qa-fixes.css";
import "./design-upgrade.css";
import SiteHeader from "./components/SiteHeader";

export const metadata = {
  title: "Pars Database | Dunfermline Athletic Archive",
  description: "A connected historical archive of Dunfermline Athletic players, matches, seasons, competitions and club history.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader/>{children}</body></html>;
}
