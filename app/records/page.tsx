import Link from "next/link";

const honours = [
  { title: "Scottish Cup", lines: ["Winners (2): 1960–61, 1967–68", "Runners-up (4): 1964–65, 2003–04, 2006–07, 2025–26"] },
  { title: "Scottish League Cup", lines: ["Runners-up (3): 1949–50, 1991–92, 2005–06"] },
  { title: "Scottish Championship · second tier", lines: ["Champions (4): 1925–26, 1988–89, 1995–96, 2010–11", "Runners-up (9): 1912–13, 1933–34, 1954–55, 1957–58, 1972–73, 1986–87, 1993–94, 1994–95, 1999–2000"] },
  { title: "Scottish League One · third tier", lines: ["Champions (3): 1985–86, 2015–16, 2022–23", "Runners-up (2): 1978–79, 2013–14"] },
  { title: "Scottish Challenge Cup", lines: ["Runners-up (1): 2007–08"] },
];

const records = [
  ["Highest home attendance", "27,816 vs Celtic · 30 April 1968"],
  ["Highest home European attendance", "26,000 vs West Bromwich Albion · European Cup Winners’ Cup quarter-final · 15 January 1969"],
  ["Biggest league win", "11–2 vs Stenhousemuir · 1930"],
  ["Biggest league defeat", "0–10 vs Dundee · 22 March 1947"],
  ["Biggest all-time defeat", "2–17 vs Clackmannan · Midland League · 1891"],
  ["Most capped player", "Andrius Skerla · 84 Lithuania caps · 2000–2005"],
  ["Most appearances", "Norrie McCathie · 576 (497 league) · 1981–1996"],
  ["Most career goals", "Charlie Dickson · 212 (154 league) · 1955–1964"],
  ["Record transfer fee paid", "£540,000 · Istvan Kozma from Bordeaux · 9 August 1989"],
  ["Record transfer fee received", "£650,000 · Jackie McNamara to Celtic · 4 October 1995"],
];

export default function Records(){
  return <main className="archivePage">
    <header className="archiveNav"><Link className="brand" href="/">PARS<span>DATABASE</span></Link><Link href="/">← Home</Link></header>
    <section className="archiveHero"><p className="eyebrow">THE NUMBERS THAT MATTER</p><h1>Records & Honours</h1><p>The landmark achievements, trophies and club records of Dunfermline Athletic.</p></section>
    <section className="archiveContent">
      <section style={{marginBottom:'4rem'}}><p className="eyebrow">HONOURS</p><h2>Major & minor honours</h2><div className="dataList">{honours.map((h,i)=><div className="dataRow" key={h.title}><span>{String(i+1).padStart(2,'0')}</span><strong>{h.title}</strong><small>{h.lines.map(line=><span key={line} style={{display:'block'}}>{line}</span>)}</small></div>)}</div></section>
      <section><p className="eyebrow">CLUB RECORDS</p><h2>Record book</h2><div className="dataList">{records.map((r,i)=><div className="dataRow" key={r[0]}><span>{String(i+1).padStart(2,'0')}</span><strong>{r[0]}</strong><small>{r[1]}</small></div>)}</div></section>
      <p className="migrationNote">Honours and club records updated from published Dunfermline Athletic reference records. Historical database records remain subject to source verification as the archive expands.</p>
    </section>
  </main>
}
