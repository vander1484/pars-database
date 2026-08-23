"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import ClubBadge from "../components/ClubBadge";

type Match={id:number;season_id:number;round:string|null;home_score:number|null;away_score:number|null;venue:string|null;notes:string|null;home:{name:string}|null;away:{name:string}|null;competition_season:{competition:{name:string}|null}|null};
type Season={id:number;label:string;slug:string;start_year:number};

const U="https://uwhewuwnrcvrnclfzoge.supabase.co",K="sb_publishable_3qBGcpu8I6fytBGxdhJDNA_zOklTBeT",H={apikey:K,Authorization:`Bearer ${K}`};
const DAFC="Dunfermline Athletic";

function roundOrder(r:string){const s=r.toLowerCase();if(s.includes('preliminary'))return 0;if(s.includes('first'))return 1;if(s.includes('second'))return 2;if(s.includes('third'))return 3;if(s.includes('quarter'))return 4;if(s.includes('semi'))return 5;if(s.includes('final'))return 6;return 99}

export default function Europe(){
 const [matches,setMatches]=useState<Match[]>([]),[seasons,setSeasons]=useState<Season[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([
  fetch(`${U}/rest/v1/matches?select=id,season_id,round,home_score,away_score,venue,notes,home:clubs!matches_home_club_id_fkey(name),away:clubs!matches_away_club_id_fkey(name),competition_season:competition_seasons(competition:competitions(name,type))&competition_season.competition.type=eq.EUROPE`,{headers:H}).then(r=>r.json()),
  fetch(`${U}/rest/v1/seasons?select=id,label,slug,start_year&order=start_year.asc`,{headers:H}).then(r=>r.json())
 ]).then(([m,s])=>{setMatches(m);setSeasons(s)}).finally(()=>setLoading(false))},[]);

 const campaigns=useMemo(()=>{
  return seasons.map(season=>{
   const ms=matches.filter(m=>m.season_id===season.id&&m.competition_season?.competition?.name);
   if(!ms.length)return null;
   const comp=ms[0].competition_season?.competition?.name||'European competition';
   const byRound=new Map<string,Match[]>();
   ms.forEach(m=>{const r=m.round||'Tie';if(!byRound.has(r))byRound.set(r,[]);byRound.get(r)!.push(m)});
   const rounds=[...byRound.entries()].sort((a,b)=>roundOrder(a[0])-roundOrder(b[0])).map(([round,games])=>{
    const opponents=[...new Set(games.flatMap(g=>[g.home?.name,g.away?.name]).filter((n):n is string=>!!n&&n!==DAFC))];
    let gf=0,ga=0;games.forEach(g=>{const home=g.home?.name===DAFC;gf+=Number(home?g.home_score:g.away_score)||0;ga+=Number(home?g.away_score:g.home_score)||0});
    const note=games.find(g=>g.notes)?.notes||null;
    return {round,games,opponent:opponents.join(' / '),gf,ga,note};
   });
   const gf=rounds.reduce((a,r)=>a+r.gf,0),ga=rounds.reduce((a,r)=>a+r.ga,0);
   const deepest=Math.max(...rounds.map(r=>roundOrder(r.round)));
   return {season,comp,rounds,gf,ga,deepest};
  }).filter(Boolean) as {season:Season;comp:string;rounds:any[];gf:number;ga:number;deepest:number}[];
 },[matches,seasons]);

 const totalMatches=campaigns.reduce((a,c)=>a+c.rounds.reduce((x,r)=>x+r.games.length,0),0);
 const uniqueOpponents=new Set(campaigns.flatMap(c=>c.rounds.map(r=>r.opponent))).size;

 return <main className="archivePage europeArchive">
  <header className="archiveNav"><Link className="brand" href="/">PARS<span>DATABASE</span></Link><Link href="/competitions/">← Competitions</Link></header>
  <section className="archiveHero europeHero"><p className="eyebrow">THE PARS IN EUROPE</p><h1>European Nights</h1><p>Seven campaigns. Forty-two matches. From Dublin to Bratislava, follow Dunfermline Athletic's European story tie by tie.</p></section>
  <section className="archiveContent">
   <div className="seasonStatGrid europeStats"><div><strong>{campaigns.length}</strong><span>Campaigns</span></div><div><strong>{totalMatches}</strong><span>European matches</span></div><div><strong>{uniqueOpponents}</strong><span>Opponents</span></div><div><strong>1968/69</strong><span>Deepest run</span></div></div>
   {loading?<p>Loading European archive…</p>:<div className="europeTimeline">
    {campaigns.map((c,ci)=><section className={`europeCampaign ${c.season.slug==='1968-69'?'isGoldenRun':''}`} key={c.season.id}>
      <div className="campaignRail" aria-hidden="true"><span className="campaignDot">{ci+1}</span></div>
      <div className="campaignBody">
       <div className="campaignHead"><div><p className="eyebrow">{c.comp}</p><h2>{c.season.label.replace('/20','/')}</h2></div><div className="campaignScore"><strong>{c.gf}-{c.ga}</strong><span>Goals F-A</span></div></div>
       {c.season.slug==='1968-69'&&<div className="goldenCallout">SEMI-FINALISTS · CLUB'S DEEPEST EUROPEAN RUN</div>}
       <div className="tieList">{c.rounds.map((r,ri)=><article className="euroTie" key={`${c.season.id}-${r.round}`} style={{animationDelay:`${ri*90}ms`}}>
         <div className="tieRound"><span>{r.round}</span></div>
         <div className="tieOpponent"><ClubBadge name={r.opponent} size="lg"/><div><small>Opponent</small><strong>{r.opponent}</strong></div></div>
         <div className="tieAggregate"><strong>{r.gf}-{r.ga}</strong><span>Aggregate</span>{r.note&&<small>{r.note}</small>}</div>
         <div className="tieLegs">{r.games.map((g:Match)=><Link href={`/match/?id=${g.id}`} className="tieLeg" key={g.id}><span>{g.venue||''}</span><b>{g.home?.name} {g.home_score??'–'}–{g.away_score??'–'} {g.away?.name}</b><em>→</em></Link>)}</div>
       </article>)}</div>
      </div>
    </section>)}
   </div>}
  </section>
  <style jsx global>{`
   .europeHero{position:relative;overflow:hidden}.europeHero:after{content:'EUROPE';position:absolute;right:4%;bottom:-.22em;font-size:clamp(5rem,18vw,13rem);font-weight:900;letter-spacing:-.08em;opacity:.035;pointer-events:none}
   .europeStats{margin-bottom:4rem}.europeTimeline{position:relative}.europeCampaign{display:grid;grid-template-columns:54px minmax(0,1fr);gap:22px;position:relative;padding-bottom:4rem}.campaignRail{position:relative;display:flex;justify-content:center}.campaignRail:after{content:'';position:absolute;top:44px;bottom:-4rem;width:2px;background:linear-gradient(#111,#d5d5d5)}.europeCampaign:last-child .campaignRail:after{display:none}.campaignDot{width:44px;height:44px;border-radius:50%;background:#111;color:#fff;display:grid;place-items:center;font-weight:800;z-index:1}.campaignBody{min-width:0}.campaignHead{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1rem}.campaignHead h2{font-size:clamp(2rem,6vw,4rem);line-height:.95;margin:.15rem 0 0}.campaignScore{text-align:right}.campaignScore strong{display:block;font-size:2rem}.campaignScore span{font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;opacity:.55}.goldenCallout{background:#111;color:#fff;padding:.7rem 1rem;font-weight:800;letter-spacing:.08em;font-size:.75rem;margin:0 0 1rem}.tieList{display:grid;gap:12px}.euroTie{display:grid;grid-template-columns:150px minmax(190px,1fr) 150px minmax(250px,1.25fr);gap:18px;align-items:center;border:1px solid #dedede;background:#fff;padding:18px;animation:euroIn .55s both ease-out}.isGoldenRun .euroTie{border-left:4px solid #111}.tieRound span,.tieOpponent small,.tieAggregate span{display:block;text-transform:uppercase;font-size:.72rem;letter-spacing:.08em;opacity:.55}.tieOpponent{display:flex;align-items:center;gap:12px;min-width:0}.tieOpponent strong{display:block;white-space:normal}.tieAggregate strong{font-size:1.7rem;display:block}.tieAggregate small{display:block;margin-top:.35rem;opacity:.6}.tieLegs{display:grid;gap:6px}.tieLeg{display:grid;grid-template-columns:54px 1fr 18px;align-items:center;gap:8px;text-decoration:none;color:inherit;font-size:.8rem;padding:.45rem .55rem;background:#f6f6f6}.tieLeg:hover{background:#ececec}.tieLeg span{text-transform:uppercase;font-size:.62rem;letter-spacing:.06em;opacity:.55}.tieLeg em{font-style:normal;text-align:right}@keyframes euroIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.euroTie{animation:none}}@media(max-width:900px){.euroTie{grid-template-columns:1fr 1fr}.tieLegs{grid-column:1/-1}.campaignHead{align-items:flex-start}}@media(max-width:620px){.europeCampaign{grid-template-columns:32px minmax(0,1fr);gap:12px}.campaignDot{width:32px;height:32px;font-size:.8rem}.campaignRail:after{top:32px}.campaignHead{display:block}.campaignScore{text-align:left;margin-top:.8rem}.euroTie{grid-template-columns:1fr;padding:14px}.tieLegs{grid-column:auto}.tieOpponent .clubBadge-lg{width:48px;height:48px}}
  `}</style>
 </main>
}
