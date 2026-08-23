import Link from "next/link";

const comps=[
  {title:'League',text:'Scottish league history and tables',href:'/seasons/'},
  {title:'Scottish Cup',text:'Every Scottish Cup campaign',href:'/matches/?competition=Scottish%20Cup'},
  {title:'League Cup',text:'League Cup results and campaigns',href:'/matches/?competition=League%20Cup'},
  {title:'Europe',text:'The Pars in European competition',href:'/matches/?competition=Europe'},
  {title:'Challenge Cup',text:'Challenge Cup history',href:'/matches/?competition=Scottish%20Challenge%20Cup'},
  {title:'Other',text:'Friendlies and other competitions',href:'/matches/?competition=Other'}
];

export default function Competitions(){return <main className="archivePage"><header className="archiveNav"><Link className="brand" href="/">PARS<span>DATABASE</span></Link><Link href="/">← Home</Link></header><section className="archiveHero"><p className="eyebrow">LEAGUE • CUP • EUROPE</p><h1>Competitions</h1><p>Follow Dunfermline Athletic through domestic leagues, famous cup runs and European nights.</p></section><section className="archiveContent"><div className="competitionGrid">{comps.map((c,i)=><Link className="competitionCard" href={c.href} key={c.title}><span>0{i+1}</span><h2>{c.title}</h2><p>{c.text}</p><b>Explore →</b></Link>)}</div></section></main>}
