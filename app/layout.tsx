import "./globals.css";

export const metadata = {
  title: "Pars Database | Dunfermline Athletic Archive",
  description: "The complete statistical history of Dunfermline Athletic.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
