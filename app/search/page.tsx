"use client";
import Link from "next/link";
import {Suspense,useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";

const U="https://uwhewuwnrcvrnclfzoge.supabase.co",K="sb_publishable_3qBGcpu8I6fytBGxdhJDNA_zOklTBeT",H={apikey:K,Authorization:`Bearer ${K}`};
type Player={id:number;name:string;slug:string;position:string|null;photo_url:string|null};
type Season={id:number;label:string;slug:string};
type Competition={id:number;name:string};
type Club={id:number;name:string};
type Match={id:number;played_on:string;home_score:number|null;away_score:number|null;home_club_id:number;away_club_id:number;home:{name:string}|null;away:{name:string}|null;competition_season:{competition:{name:string}|null}|null};

async function json<T>(url:string,signal:AbortSignal):Promise<T>{const r=await fetch(url,{headers:H,signal});if(!r.ok)throw new Error(`Request failed: ${r.status}`);return r.json()}
function norm(v:string){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function playerSearchText(name:string){const basic=norm(name);const parts=name.split(',').map(x=>x.trim()).filter(Boolean);const natural=parts.length===2?norm(`${parts[1]} ${parts[0]}`):basic;return `${basic} ${natural}`}
function matchesTerms(value:string,q:string){const terms=norm(q).split(/\s+/).filter(Boolean);const hay=norm(value);return terms.every(t=>hay.includes(t))}
function matchesPlayer(name:string,q:string){const terms=norm(q).split(/\s+/).filter(Boolean);const hay=playerSearchText(name);return terms.every(t=>hay.includes(t))}

function Results(){
 const p=useSearchParams(),q=(p.get('q')||'').trim();
 const [players,setPlayers]=useState<Player[]>([]),[seasons,setSeasons]=useState<Season[]>([]),[competitions,setCompetitions]=useState<Competition[]>([]),[matches,setMatches]=useState<Match[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 useEffect(()=>{const controller=new AbortController();setPlayers([]);setSeasons([]);setCompetitions([]);setMatches([]);setError('');if(!q){setLoading(false);return()=>controller.abort()}setLoading(true);
  Promise.all([
   json<Player[]>(`${U}/rest/v1/players?select=id,name,slug,position,photo_url&order=name.asc&limit=1000`,controller.signal),
   json<Season[]>(`${U}/rest/v1/seasons?select=id,label,slug&order=start_year.desc&limit=200`,controller.signal),
   json<Competition[]>(`${U}/rest/v1/competitions?select=id,name&order=name.asc&limit=200`,controller.signal),
   json<Club[]>(`${U}/rest/v1/clubs?select=id,name&order=name.asc&limit=1000`,controller.signal)
  ]).then(async([allPlayers,allSeasons,allCompetitions,allClubs])=>{
   if(controller.signal.aborted)return;
   const playerHits=allPlayers.filter(x=>matchesPlayer(x.name,q)).slice(0,30);
   const seasonHits=allSeasons.filter(x=>matchesTerms(x.label,q)).slice(0,20);
   const competitionHits=allCompetitions.filter(x=>matchesTerms(x.name,q)).slice(0,20);
   const clubIds=allClubs.filter(x=>matchesTerms(x.name,q)).map(x=>x.id);
   let matchHits:Match[]=[];
   if(clubIds.length){const ors=clubIds.flatMap(id=>[`home_club_id.eq.${id}`,`away_club_id.eq.${id}`]).join(',');matchHits=await json<Match[]>(`${U}/rest/v1/matches?select=id,played_on,home_score,away_score,home_club_id,away_club_id,home:clubs!matches_home_club_id_fkey(name),away:clubs!matches_away_club_id_fkey(name),competition_season:competition_seasons(competition:competitions(name))&or=(${ors})&order=played_on.desc&limit=40`,controller.signal)}
   if(controller.signal.aborted)return;setPlayers(playerHits);setSeasons(seasonHits);setCompetitions(competitionHits);setMatches(matchHits)
  }).catch(e=>{if((e as Error).name!=='AbortError')setError('The archive search could not be loaded right now. Please try again.')}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});return()=>controller.abort()
 },[q,retry]);
 const total=players.length+seasons.length+competitions.length+matches.length;
 if(loading)return <div className="searchSkeleton"><i/><i/><i/><i/></div>;
 if(!q)return <div className="emptyState"><strong>Search 100+ years of Pars history.</strong><span>Try a player, season, competition or opponent.</span></div>;
 if(error)return <div className="emptyState archiveError"><strong>We couldn’t search the archive.</strong><span>{error}</span><button className="loadMore" onClick={()=>setRetry(x=>x+1)}>Try again</button></div>;
 return <><div className="searchSummary"><strong>{total}</strong><span>results for “{q}”</span></div>{players.length>0&&<section className="searchSection"><h2>Players <small>{players.length}</small></h2><div className="searchCards">{players.map(x=><Link className="searchResult" href={`/player/?slug=${x.slug}`} key={x.id}><span className="playerAvatar">{x.photo_url&&<img src={x.photo_url} alt="" loading="lazy" decoding="async"/>}<span className="playerInitials">{x.name.replace(/,/g,' ').trim().split(/\s+/).slice(0,2).map(v=>v[0]?.toUpperCase()).join('')}</span></span><span><strong>{x.name}</strong><small>{x.position||'Player'} · View career profile</small></span><b>→</b></Link>)}</div></section>}{seasons.length>0&&<section className="searchSection"><h2>Seasons <small>{seasons.length}</small></h2><div className="searchCards">{seasons.map(x=><Link className="searchResult" href={`/season/?slug=${x.slug}`} key={x.id}><span className="searchIcon">S</span><span><strong>{x.label}</strong><small>Season archive</small></span><b>→</b></Link>)}</div></section>}{competitions.length>0&&<section className="searchSection"><h2>Competitions <small>{competitions.length}</small></h2><div className="searchCards">{competitions.map(x=><Link className="searchResult" href={`/matches/?competition=${encodeURIComponent(x.name)}`} key={x.id}><span className="searchIcon">C</span><span><strong>{x.name}</strong><small>View matches in this competition</small></span><b>→</b></Link>)}</div></section>}{matches.length>0&&<section className="searchSection"><h2>Matches <small>{matches.length}</small></h2><div className="searchCards">{matches.map(x=><Link className="searchResult" href={`/match/?id=${x.id}`} key={x.id}><span className="searchIcon">M</span><span><strong>{x.home?.name} {x.home_score??'–'} - {x.away_score??'–'} {x.away?.name}</strong><small>{x.played_on} · {x.competition_season?.competition?.name||'Match'}</small></span><b>→</b></Link>)}</div></section>}{total===0&&<div className="emptyState"><strong>No archive records found.</strong><span>Try a shorter name, surname only, a season such as 2016, a competition or an opponent.</span><div className="searchRecovery"><Link href="/players/">Browse players</Link><Link href="/matches/">Browse matches</Link><Link href="/seasons/">Browse seasons</Link><Link href="/competitions/">Browse competitions</Link></div></div>}<style jsx global>{`.searchSkeleton{display:grid;gap:.7rem}.searchSkeleton i{height:70px;background:linear-gradient(90deg,#e7e2d8,#f5f2ec,#e7e2d8);background-size:200% 100%;animation:searchPulse 1.2s infinite}@keyframes searchPulse{to{background-position:-200% 0}}.searchRecovery{display:flex;justify-content:center;gap:.5rem;flex-wrap:wrap;margin-top:1rem}.searchRecovery a{background:#111;color:#fff;padding:.7rem .9rem;font-size:.7rem;font-weight:900;text-transform:uppercase}.archiveError{border-left:4px solid #d51f2b;background:#fff}`}</style></>
}
export default function SearchPage(){return <main className="archivePage"><section className="compactHero"><p className="eyebrow">SEARCH THE ARCHIVE</p><h1>Find anything.</h1><p>Players, seasons, competitions, opponents and matches across Dunfermline Athletic history.</p></section><section className="archiveContent"><Suspense fallback={<p>Searching…</p>}><Results/></Suspense></section></main>}
