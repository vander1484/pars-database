import Link from "next/link";

const sections = [
  { title: "Players", text: "Every player, appearance and goal in one searchable archive.", href: "/players" },
  { title: "Matches", text: "Browse more than a century of Dunfermline Athletic results.", href: "/matches" },
  { title: "Seasons", text: "Explore results, squads, tables and cup runs season by season.", href: "/seasons" },
  { title: "Competitions", text: "League, Scottish Cup, League Cup, Europe and more.", href: "/competitions" },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <Link className="brand" href="/">PARS<span>DATABASE</span></Link>
          <div><Link href="/players">Players</Link><Link href="/matches">Matches</Link><Link href="/seasons">Seasons</Link><Link href="/records">Records</Link></div>
        </nav>
        <div className="heroContent">
          <p className="eyebrow">DUNFERMLINE ATHLETIC • HISTORICAL ARCHIVE</p>
          <h1>Every player.<br />Every match.<br /><em>Every season.</em></h1>
          <p className="intro">The complete statistical history of Dunfermline Athletic, rebuilt as a modern, searchable football archive.</p>
        </div>
      </section>
      <section className="stats"><div><strong>1912</strong><span>Archive begins</span></div><div><strong>100+</strong><span>Seasons</span></div><div><strong>DAFC</strong><span>One complete history</span></div></section>
      <section className="explore"><p className="eyebrow dark">EXPLORE THE ARCHIVE</p><h2>A century of Pars history,<br/>properly connected.</h2><div className="grid">{sections.map((item, i) => <Link className="card" href={item.href} key={item.title}><span>0{i+1}</span><h3>{item.title}</h3><p>{item.text}</p><b>Explore →</b></Link>)}</div></section>
    </main>
  );
}
