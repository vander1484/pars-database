import Link from 'next/link';
import './timeline.css';

type Event={year:string,title:string,text:string,tag?:string,featured?:boolean};
type Era={id:string,years:string,title:string,intro:string,events:Event[]};

const eras:Era[]=[
{id:'origins',years:'1885—1912',title:'The club takes shape',intro:'From a cricket club offshoot to an established senior football club at East End Park.',events:[
{year:'1885',title:'Dunfermline Athletic is born',text:'Dunfermline Athletic Football Club is formed, emerging from the town’s cricket club.',tag:'Foundation',featured:true},
{year:'1886',title:'East End Park',text:'The new club establishes its home at East End Park, the ground that remains home to the Pars.',tag:'East End Park'},
{year:'1889',title:'The first Fife Cup',text:'Dunfermline win the Fife Cup, an early piece of silverware in the club’s formative years.',tag:'Honour'},
{year:'1899',title:'Senior status',text:'The club enters a new era as the Scottish game develops into a national league structure.',tag:'Club'},
{year:'1912',title:'Scottish League football',text:'Dunfermline Athletic enter the Scottish Football League and begin the league story recorded in the archive.',tag:'League',featured:true}
]},
{id:'between',years:'1912—1958',title:'League football and the long climb',intro:'Promotion, war, huge crowds and the foundations of the side that would transform the club in the 1960s.',events:[
{year:'1926',title:'Second Division champions',text:'Dunfermline win a first Scottish league championship and earn promotion to the top division.',tag:'Champions',featured:true},
{year:'1934',title:'Back to the top flight',text:'Another strong Second Division campaign brings promotion and a return to Scotland’s leading level.',tag:'Promotion'},
{year:'1949',title:'A first League Cup final',text:'The Pars reach the Scottish League Cup final for the first time, facing East Fife at Hampden.',tag:'Final',featured:true},
{year:'1955',title:'Promotion again',text:'A runner-up finish takes Dunfermline back into the First Division and begins a sustained top-flight period.',tag:'Promotion'},
{year:'1958',title:'The Stein era begins',text:'Jock Stein takes charge at East End Park, beginning one of the most important chapters in club history.',tag:'Manager',featured:true}
]},
{id:'golden',years:'1958—1972',title:'The golden age',intro:'Scottish Cups, European nights and a Dunfermline side that became one of the strongest clubs in the country.',events:[
{year:'1961',title:'Scottish Cup winners',text:'Dunfermline defeat Celtic after a replay to win the Scottish Cup for the first time.',tag:'Scottish Cup',featured:true},
{year:'1961',title:'Into Europe',text:'The Scottish Cup triumph takes the Pars into European competition and onto a new stage.',tag:'Europe'},
{year:'1962',title:'European progress',text:'European football becomes part of the East End Park story as Dunfermline begin building a formidable continental reputation.',tag:'Europe'},
{year:'1963',title:'A European quarter-final',text:'The Pars reach the last eight of the Cup Winners’ Cup, establishing themselves well beyond Scotland.',tag:'Europe',featured:true},
{year:'1964',title:'Stein departs',text:'Jock Stein leaves Dunfermline after transforming the club’s standing at home and abroad.',tag:'Manager'},
{year:'1965',title:'Scottish Cup finalists',text:'Dunfermline return to Hampden and finish runners-up in the Scottish Cup.',tag:'Final'},
{year:'1966',title:'Fairs Cup quarter-finalists',text:'The Pars reach the quarter-finals of the Inter-Cities Fairs Cup during another memorable European run.',tag:'Europe',featured:true},
{year:'1968',title:'Scottish Cup winners again',text:'George Farm’s side defeat Hearts 3–1 at Hampden to lift the Scottish Cup for a second time.',tag:'Scottish Cup',featured:true},
{year:'1968',title:'27,816 at East End Park',text:'A record home crowd watches the Pars face Celtic at East End Park.',tag:'Record'},
{year:'1969',title:'European semi-finalists',text:'Dunfermline reach the Cup Winners’ Cup semi-final, the club’s greatest European achievement.',tag:'Europe',featured:true},
{year:'1969',title:'Third in Scotland',text:'The Pars finish third in the top flight, the club’s highest league placing.',tag:'League'},
{year:'1972',title:'End of an era',text:'Relegation closes the extraordinary sustained top-flight chapter that defined the 1960s.',tag:'League'}
]},
{id:'rebuild',years:'1972—1985',title:'Changing times',intro:'Relegations and restructuring bring a more difficult period, but the next great revival is taking shape.',events:[
{year:'1973',title:'Promotion challenge',text:'The Pars finish runners-up in the second tier as the club seeks a route back to the top.',tag:'League'},
{year:'1979',title:'Second Division runners-up',text:'Another promotion campaign brings a runners-up finish and movement back up the Scottish pyramid.',tag:'Promotion'},
{year:'1983',title:'A difficult low point',text:'The club drops into the bottom tier, setting the stage for one of the great Dunfermline revivals.',tag:'League'},
{year:'1983',title:'Jim Leishman takes charge',text:'Leishman begins a managerial era that reconnects the team, support and town.',tag:'Manager',featured:true}
]},
{id:'leishman',years:'1985—1992',title:'Leishmania',intro:'Two promotions in three seasons, packed terraces and the return of Dunfermline Athletic to Scotland’s top flight.',events:[
{year:'1986',title:'Second Division champions',text:'The Pars win the title and promotion as Leishman’s revival gathers pace.',tag:'Champions',featured:true},
{year:'1987',title:'Promotion at the first attempt',text:'Dunfermline finish runners-up and climb into the Premier Division, completing a remarkable rise.',tag:'Promotion',featured:true},
{year:'1989',title:'First Division champions',text:'After relegation, the Pars respond immediately by winning the title and returning to the Premier Division.',tag:'Champions',featured:true},
{year:'1991',title:'League Cup finalists',text:'Dunfermline reach another national final, meeting Hibernian in the Scottish League Cup.',tag:'Final'},
{year:'1992',title:'A chapter closes',text:'The first Leishman managerial era ends after transforming the club’s fortunes and identity.',tag:'Manager'}
]},
{id:'premier',years:'1992—2007',title:'Paton, Calderwood and the Premier years',intro:'Promotion, tragedy, European qualification and a new generation that takes Dunfermline back to major finals.',events:[
{year:'1996',title:'First Division champions',text:'Bert Paton’s side wins the title and promotion to the Premier Division.',tag:'Champions',featured:true},
{year:'1996',title:'Remembering Norrie',text:'Club captain Norrie McCathie dies suddenly aged 34. His legacy remains central to Dunfermline Athletic.',tag:'Club',featured:true},
{year:'2000',title:'Back in the top flight',text:'Jimmy Calderwood leads the Pars to promotion and begins an ambitious Premier League period.',tag:'Promotion'},
{year:'2003',title:'European qualification',text:'A strong Premier League campaign earns the Pars a return to European competition.',tag:'Europe'},
{year:'2004',title:'Scottish Cup finalists',text:'Dunfermline face Celtic at Hampden after a memorable cup run and finish runners-up.',tag:'Final',featured:true},
{year:'2004',title:'Europe returns',text:'The UEFA Cup brings continental football back to East End Park after a long absence.',tag:'Europe'},
{year:'2006',title:'League Cup finalists',text:'The Pars reach Hampden again, facing Celtic in the Scottish League Cup final.',tag:'Final'},
{year:'2007',title:'Another Scottish Cup final',text:'Despite a difficult league season, Dunfermline reach the Scottish Cup final against Celtic.',tag:'Final',featured:true},
{year:'2007',title:'European football again',text:'The cup run earns another UEFA Cup campaign, including the tie with BK Häcken.',tag:'Europe'}
]},
{id:'modern',years:'2007—2026',title:'Highs, lows and recovery',intro:'Championships, administration, supporter ownership and repeated rebuilds define the modern Pars story.',events:[
{year:'2008',title:'Challenge Cup finalists',text:'Dunfermline reach the Scottish Challenge Cup final, finishing runners-up to St Johnstone.',tag:'Final'},
{year:'2011',title:'First Division champions',text:'Jim McIntyre’s Pars win the league and return to the Scottish Premier League.',tag:'Champions',featured:true},
{year:'2013',title:'Administration',text:'A financial crisis pushes the club into administration and threatens its future.',tag:'Club',featured:true},
{year:'2013',title:'Supporters secure the future',text:'Pars United completes the takeover of the club, beginning a supporter-led recovery.',tag:'Club',featured:true},
{year:'2014',title:'League One runners-up',text:'The rebuilding Pars finish second in League One.',tag:'League'},
{year:'2016',title:'League One champions',text:'Allan Johnston’s side wins the title in emphatic fashion and returns to the Championship.',tag:'Champions',featured:true},
{year:'2022',title:'Relegation to League One',text:'The Pars drop into the third tier after defeat in the Championship play-offs.',tag:'League'},
{year:'2023',title:'League One champions',text:'James McPake’s side wins the title, losing only once during the league campaign.',tag:'Champions',featured:true},
{year:'2025',title:'A new chapter',text:'The club enters another period of transition as the modern Dunfermline story continues.',tag:'Club'},
{year:'2026',title:'Scottish Cup finalists',text:'The Pars reach another Scottish Cup final, adding a new Hampden chapter to the club timeline.',tag:'Final',featured:true}
]}
];

export default function Timeline(){const count=eras.reduce((n,e)=>n+e.events.length,0);return <main className="timelinePage">
<section className="timelineHero"><div className="timelineHeroInner"><p className="timelineEyebrow">DUNFERMLINE ATHLETIC · THE STORY</p><h1>140 years.<br/><em>One timeline.</em></h1><p>From a cricket club meeting in 1885 to Hampden, Europe, promotions, relegations and revival. Scroll through the moments that made Dunfermline Athletic.</p><div className="timelineHeroStats"><div><strong>1885</strong><span>Founded</span></div><div><strong>{count}</strong><span>Milestones</span></div><div><strong>2</strong><span>Scottish Cups</span></div><div><strong>140+</strong><span>Years of history</span></div></div></div></section>
<nav className="eraNav">{eras.map(e=><a key={e.id} href={`#${e.id}`}>{e.years}</a>)}</nav>
<div className="timelineWrap">{eras.map((era,ei)=><section className="eraBlock" id={era.id} key={era.id}><div className="eraIntro"><div className="eraYears">{era.years}</div><div className="eraCopy"><small>ERA {String(ei+1).padStart(2,'0')}</small><h2>{era.title}</h2><p>{era.intro}</p></div></div><div className="timelineRail">{era.events.map((event,i)=><article className={`timelineEvent ${event.featured?'featured':''}`} key={`${event.year}-${event.title}`}><span className="timelineDot"/><div className="timelineCard"><div className="timelineYear">{event.year}</div><h3>{event.title}</h3><p>{event.text}</p>{event.tag&&<span className="timelineTag">{event.tag}</span>}</div></article>)}</div>{era.id==='golden'&&<div className="timelineBreak"><div className="timelineBreakNumber">60s</div><div className="timelineBreakCopy"><small>THE GOLDEN DECADE</small><h3>When East End Park looked out at Europe.</h3><p>Two Scottish Cups, a third-place league finish and repeated European adventures turned Dunfermline into one of the defining Scottish sides of the decade.</p></div></div>}</section>)}</div>
<section className="timelineSource"><p>Historical timeline developed from the Dunfermline Athletic Heritage Trust chronology and expanded with links to the Pars Database archive.</p><a href="https://daht.org.uk/story.php?t=Dunfermline_Athletic_Timeline&ID=2490" target="_blank" rel="noreferrer">Heritage Trust source ↗</a></section>
<section className="timelineOutro"><p>THE STORY DOESN’T STOP HERE</p><h2>Explore every<br/><em>season.</em></h2><Link href="/seasons/">Open the season archive →</Link></section>
</main>}
