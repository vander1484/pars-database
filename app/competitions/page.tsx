const comps=[
  {title:'League',text:'Scottish league history and tables',href:'/pars-database/seasons/'},
  {title:'Scottish Cup',text:'Every Scottish Cup campaign',href:'/pars-database/matches/?competition=Scottish%20Cup'},
  {title:'League Cup',text:'League Cup results and campaigns',href:'/pars-database/matches/?competition=League%20Cup'},
  {title:'Europe',text:'The Pars in European competition',href:'/pars-database/europe/'},
  {title:'Challenge Cup',text:'Challenge Cup history',href:'/pars-database/matches/?competition=Scottish%20Challenge%20Cup'},
  {title:'Other',text:'Friendlies and other competitions',href:'/pars-database/matches/?competition=Other'}
];

export default function Competitions(){return <main className="archivePage"><header className="archiveNav"><a className="brand" href="/pars-database/">PARS<span>DATABASE</span></a><a href="/pars-database/">← Home</a></header><section className="archiveHero"><p className="eyebrow">LEAGUE • CUP • EUROPE</p><h1>Competitions</h1><p>Follow Dunfermline Athletic through domestic leagues, famous cup runs and European nights.</p></section><section className="archiveContent"><div className="competitionGrid">{comps.map((c,i)=><a className="competitionCard competitionCardLink" href={c.href} key={c.title}><span>0{i+1}</span><h2>{c.title}</h2><p>{c.text}</p><b>Explore →</b></a>)}</div></section><style>{`.competitionGrid{position:relative;z-index:2}.competitionCardLink{position:relative;z-index:3;pointer-events:auto!important;cursor:pointer!important;text-decoration:none}.competitionCardLink *{pointer-events:none}.competitionCardLink:hover{background:#111;color:#fff}.competitionCardLink:hover p{color:#aaa}`}</style></main>}
