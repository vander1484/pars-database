const sections = [
  { title: "Players", text: "Every player, appearance and goal in one searchable archive.", href: "/pars-database/players/" },
  { title: "Matches", text: "Browse more than a century of Dunfermline Athletic results.", href: "/pars-database/matches/" },
  { title: "Seasons", text: "Explore results, squads, tables and cup runs season by season.", href: "/pars-database/seasons/" },
  { title: "Competitions", text: "League, Scottish Cup, League Cup, Europe and more.", href: "/pars-database/competitions/" },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <a className="brand" href="/pars-database/">PARS<span>DATABASE</span></a>
          <div><a href="/pars-database/players/">Players</a><a href="/pars-database/matches/">Matches</a><a href="/pars-database/seasons/">Seasons</a><a href="/pars-database/records/">Records</a></div>
        </nav>
        <div className="heroContent">
          <p className="eyebrow">DUNFERMLINE ATHLETIC • HISTORICAL ARCHIVE</p>
          <h1>Every player.<br />Every match.<br /><em>Every season.</em></h1>
          <p className="intro">The complete statistical history of Dunfermline Athletic, rebuilt as a modern, searchable football archive.</p>
          <form className="search" action="/pars-database/search/"><input name="q" aria-label="Search" placeholder="Search players, matches, seasons..."/><button>Search</button></form>
        </div>
      </section>
      <section className="stats"><div><strong>1912</strong><span>Archive begins</span></div><div><strong>100+</strong><span>Seasons</span></div><div><strong>DAFC</strong><span>One complete history</span></div></section>
      <section className="explore"><p className="eyebrow dark">EXPLORE THE ARCHIVE</p><h2>A century of Pars history,<br/>properly connected.</h2><div className="grid">{sections.map((item, i) => <a className="card" href={item.href} key={item.title}><span>0{i+1}</span><h3>{item.title}</h3><p>{item.text}</p><b>Explore →</b></a>)}</div></section>
    </main>
  );
}
