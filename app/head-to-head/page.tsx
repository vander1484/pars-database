"use client";
import Link from "next/link";
import {AnimatePresence,motion,useReducedMotion} from "motion/react";
import {useEffect,useMemo,useState} from "react";
import {useSearchParams} from "next/navigation";
import ClubBadge from "../components/ClubBadge";
import "./head-to-head.css";

type Opponent=[string,number,number,number,number,number,number];
type Match={home_club_id:number|null;away_club_id:number|null;home_score:number|null;away_score:number|null};
type Club={id:number;name:string};

const U="https://uwhewuwnrcvrnclfzoge.supabase.co",K="sb_publishable_3qBGcpu8I6fytBGxdhJDNA_zOklTBeT",H={apikey:K,Authorization:`Bearer ${K}`};

// Stronger historical all-time totals already curated for the archive.
const historical:Opponent[]=[
['East Fife',161,79,34,48,299,228],['Raith Rovers',157,68,40,49,260,222],['Falkirk',153,57,38,58,223,225],['Dundee',149,48,37,64,207,244],['St Mirren',143,51,34,58,201,216],['Partick Thistle',141,55,35,51,212,202],['Queen of the South',139,61,29,49,235,201],['Ayr United',137,57,32,48,219,195],['Morton',135,52,32,51,207,204],['St Johnstone',132,48,36,48,186,187],['Hearts',128,36,29,63,161,226],['Hibernian',126,37,31,58,168,218],['Kilmarnock',124,43,29,52,173,196],['Motherwell',121,40,30,51,168,190],['Dundee United',119,39,30,50,160,188],['Celtic',117,18,20,79,103,262],['Rangers',112,17,20,75,104,249],['Clyde',109,50,23,36,191,160],['Hamilton Academical',104,43,28,33,161,140],['Cowdenbeath',101,56,19,26,210,139],['Dumbarton',96,44,23,29,169,133],['Airdrieonians',92,39,24,29,149,126],['Alloa Athletic',89,47,20,22,166,105],['Arbroath',86,39,23,24,139,111],['Inverness CT',72,24,20,28,89,98]
];

// Scottish clubs represented in the current match database. This keeps European,
// testimonial and touring opposition out of the domestic Head-to-Head index.
const SCOTTISH=new Set([
'Aberdeen','Airdrie United','Airdrieonians','Albion Rovers','Alloa Athletic','Annan Athletic','Arbroath','Ayr United','Berwick Rangers','Brechin City','Buckie Thistle','Celtic','Celtic B','Clyde','Clydebank','Cove Rangers','Cowdenbeath','Dumbarton','Dundee','Dundee FC','Dundee United','East Fife','East Kilbride','East Stirling','East Stirlingshire','Edinburgh City','Elgin City','Falkirk','Forfar Athletic','Fraserburgh','Greenock Morton','Hamilton Academical','Heart of Midlothian','Hearts','Hibernian','Inverness Caledonian Thistle','Inverness CT','Kelty Hearts','Kilmarnock','Livingston','Montrose','Motherwell','Partick Thistle','Peterhead',"Queen's Park",'Queen of the South','Raith Rovers','Rangers','Ross County','Spartans','St Johnstone','St Mirren','Stenhousemuir','Stirling Albion','Stranraer','Third Lanark'
]);

const canonical=(name:string)=>({
 'Greenock Morton':'Morton','Heart of Midlothian':'Hearts','Inverness Caledonian Thistle':'Inverness CT','Dundee FC':'Dundee','East Stirling':'East Stirlingshire','Airdrie United':'Airdrieonians'
}[name]||name);
function pct(n:number,d:number){return d?Math.round(n/d*1000)/10:0}

export default function HeadToHead(){
 const reduced=useReducedMotion(),params=useSearchParams(),requested=params.get('opponent')||'';
 const [selected,setSelected]=useState(0),[query,setQuery]=useState(''),[matches,setMatches]=useState<Match[]>([]),[clubs,setClubs]=useState<Club[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([
  fetch(`${U}/rest/v1/matches?select=home_club_id,away_club_id,home_score,away_score&or=(home_club_id.eq.1,away_club_id.eq.1)&home_score=not.is.null&away_score=not.is.null`,{headers:H}).then(r=>r.ok?r.json():[]),
  fetch(`${U}/rest/v1/clubs?select=id,name`,{headers:H}).then(r=>r.ok?r.json():[])
 ]).then(([m,c])=>{setMatches(Array.isArray(m)?m:[]);setClubs(Array.isArray(c)?c:[])}).finally(()=>setLoading(false))},[]);

 const opponents=useMemo(()=>{
  const clubById=Object.fromEntries(clubs.map(c=>[c.id,c.name]));
  const derived=new Map<string,Opponent>();
  for(const m of matches){
   const parsHome=m.home_club_id===1,oppId=parsHome?m.away_club_id:m.home_club_id;if(!oppId)continue;
   const raw=clubById[oppId];if(!raw||!SCOTTISH.has(raw))continue;
   const name=canonical(raw),gf=parsHome?(m.home_score||0):(m.away_score||0),ga=parsHome?(m.away_score||0):(m.home_score||0);
   const row=derived.get(name)||[name,0,0,0,0,0,0];row[1]++;row[5]+=gf;row[6]+=ga;if(gf>ga)row[2]++;else if(gf===ga)row[3]++;else row[4]++;derived.set(name,row);
  }
  const hist=new Map(historical.map(x=>[x[0],x]));
  for(const [name,row] of derived)if(!hist.has(name))hist.set(name,row);
  return [...hist.values()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
 },[matches,clubs]);

 const requestedName=canonical(requested),requestedIndex=useMemo(()=>requestedName?opponents.findIndex(x=>x[0].toLowerCase()===requestedName.toLowerCase()):-1,[requestedName,opponents]);
 useEffect(()=>{if(requestedIndex>=0){setSelected(requestedIndex);setQuery('')}},[requestedIndex]);
 useEffect(()=>{if(selected>=opponents.length)setSelected(0)},[opponents.length,selected]);
 const current=opponents[selected]||historical[0],filtered=useMemo(()=>opponents.map((x,i)=>({x,i})).filter(({x})=>x[0].toLowerCase().includes(query.toLowerCase())),[opponents,query]);
 const [name,p,w,d,l,gf,ga]=current,winPct=pct(w,p),drawPct=pct(d,p),lossPct=pct(l,p),goalDiff=gf-ga;

 if(!loading&&requested&&requestedIndex<0)return <main className="h2hPage"><section className="h2hHero"><div><p>THE OPPOSITION ARCHIVE</p><h1>Head<br/><em>to Head.</em></h1><span>Every rivalry has a number. Explore Dunfermline Athletic's historical record against opponents across Scottish football.</span></div></section><section className="h2hWrap"><div className="h2hIntro"><div><small>OPPONENT NOT YET PROFILED</small><h2>{requested}</h2></div><p>No reliable Head-to-Head record is available for this opponent yet.</p></div><section className="h2hCompare"><div className="emptyState"><strong>Head-to-Head profile coming later.</strong><span>You can still open every recorded Dunfermline match against {requested} in the full match archive.</span><Link className="h2hCompareCta" href={`/matches/?opponent=${encodeURIComponent(requested)}`}>Explore matches against {requested} →</Link><Link href="/head-to-head/">Browse profiled opponents →</Link></div></section></section></main>;

 return <main className="h2hPage"><section className="h2hHero"><div><p>THE OPPOSITION ARCHIVE</p><h1>Head<br/><em>to Head.</em></h1><span>Every rivalry has a number. Explore Dunfermline Athletic's historical record against opponents across Scottish football.</span></div></section><section className="h2hWrap"><div className="h2hIntro"><div><small>CLUB VS CLUB</small><h2>The record.</h2></div><p>Historical all-time records are retained where already verified, with additional Scottish opponents generated from the expanding Pars match database.</p></div><section className="h2hCompare" aria-live="polite"><div className="h2hCompareTop"><div><small>SELECTED RIVAL</small><h3>{name}</h3></div><label><span>Find opponent</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Scottish clubs..." aria-describedby="h2h-result-count"/></label></div><p id="h2h-result-count" className="pageContextBar"><strong>{query?`${filtered.length} matching opponent${filtered.length===1?'':'s'}`:`${opponents.length} Scottish opponents profiled`}</strong><span>{loading?'Updating from the match database…':query?'Select a club below to compare the record.':'Search or browse the expanded comparison table.'}</span></p><AnimatePresence mode="wait"><motion.div key={name} className="h2hStage" initial={reduced?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:-14}} transition={{duration:.28,ease:[.16,1,.3,1]}}><div className="h2hClub"><ClubBadge name="Dunfermline Athletic" size="lg"/><strong>Dunfermline Athletic</strong><span>{w} wins</span></div><div className="h2hVs"><small>{p}</small><b>MEETINGS</b><span>VS</span></div><div className="h2hClub"><ClubBadge name={name} size="lg"/><strong>{name}</strong><span>{l} wins</span></div></motion.div></AnimatePresence><div className="h2hMetrics"><motion.article layout><small>WIN RATE</small><strong>{winPct}%</strong></motion.article><motion.article layout><small>GOAL DIFFERENCE</small><strong>{goalDiff>0?'+':''}{goalDiff}</strong></motion.article><motion.article layout><small>GOALS FOR</small><strong>{gf}</strong></motion.article><motion.article layout><small>GOALS AGAINST</small><strong>{ga}</strong></motion.article></div><div className="h2hBars"><div><span><b>W</b>{w} wins</span><strong>{winPct}%</strong><i><motion.em initial={false} animate={{scaleX:w/p}} transition={reduced?{duration:0}:{type:'spring',stiffness:180,damping:26}}/></i></div><div><span><b>D</b>{d} draws</span><strong>{drawPct}%</strong><i><motion.em initial={false} animate={{scaleX:d/p}} transition={reduced?{duration:0}:{type:'spring',stiffness:180,damping:26}}/></i></div><div><span><b>L</b>{l} defeats</span><strong>{lossPct}%</strong><i><motion.em initial={false} animate={{scaleX:l/p}} transition={reduced?{duration:0}:{type:'spring',stiffness:180,damping:26}}/></i></div></div><Link className="h2hCompareCta" href={`/matches/?opponent=${encodeURIComponent(name)}`}>Explore every match against {name} →</Link></section><div className="h2hTable"><div className="h2hHead"><span>Opponent</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GF</span><span>GA</span><span>Win %</span></div>{filtered.length?<motion.div layout className="h2hRows">{filtered.map(({x,i})=>{const rowPct=pct(x[2],x[1]);return <motion.button layout key={x[0]} className={`h2hRow ${selected===i?'selected':''}`} aria-pressed={selected===i} onClick={()=>setSelected(i)} whileTap={reduced?undefined:{scale:.995}}><strong>{x[0]}</strong><span>{x[1]}</span><b>{x[2]}</b><span>{x[3]}</span><span>{x[4]}</span><span>{x[5]}</span><span>{x[6]}</span><em>{rowPct.toFixed(1)}%</em></motion.button>})}</motion.div>:<div className="h2hEmptyFilter"><strong>No profiled opponents match “{query}”.</strong><span>Try a shorter club name or clear the search.</span><button className="loadMore" onClick={()=>setQuery('')}>Clear search</button></div>}</div><div className="h2hKey"><span><b>P</b> Played</span><span><b>W</b> Won</span><span><b>D</b> Drawn</span><span><b>L</b> Lost</span><span><b>GF</b> Goals for</span><span><b>GA</b> Goals against</span></div></section><section className="h2hOutro"><p>MORE THAN A SCORELINE</p><h2>Know<br/><em>your rivals.</em></h2><Link href="/matches/">Explore every match →</Link></section></main>}
