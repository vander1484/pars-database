"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Match={id:number;played_on:string;home_score:number|null;away_score:number|null;venue:string|null;notes:string|null;source_url:string|null;home:{name:string}|null;away:{name:string}|null;competition_season:{competition:{name:string}|null}|null};
const SUPABASE_URL="https://uwhewuwnrcvrnclfzoge.supabase.co";
const SUPABASE_KEY="sb_publishable_3qBGcpu8I6fytBGxdhJDNA_zOklTBeT";

function MatchRecord(){
 const params=useSearchParams(); const id=params.get("id"); const [match,setMatch]=useState<Match|null>(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{if(!id){setLoading(false);return;}const q=`id=eq.${encodeURIComponent(id)}&select=id,played_on,home_score,away_score,venue,notes,source_url,home:clubs!matches_home_club_id_fkey(name),away:clubs!matches_away_club_id_fkey(name),competition_season:competition_seasons(competition:competitions(name))`;fetch(`${SUPABASE_URL}/rest/v1/matches?${q}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.ok?r.json():Promise.reject()).then(x=>setMatch(x[0]||null)).finally(()=>setLoading(false));},[id]);
 return <>{loading?<section className="archiveContent"><p>Loading match…</p></section>:match?<><section className="archiveHero"><p className="eyebrow">{match.competition_season?.competition?.name||"MATCH"} · {match.played_on}</p><h1 style={{fontSize:"clamp(3rem,7vw,7rem)"}}>{match.home?.name}<br/>{match.home_score} - {match.away_score}<br/>{match.away?.name}</h1></section><section className="archiveContent"><h2>Match record</h2>{match.notes&&<p className="migrationNote">{match.notes}</p>}<p><strong>Venue:</strong> {match.venue||"Not recorded"}</p>{match.source_url&&<p><a href={match.source_url} target="_blank" rel="noreferrer">View original ParsDatabase source →</a></p>}</section></>:<section className="archiveContent"><h2>Match not found</h2></section>}</>;
}

export default function MatchDetail(){return <main className="archivePage"><header className="archiveNav"><Link className="brand" href="/">PARS<span>DATABASE</span></Link><Link href="/matches/">← Matches</Link></header><Suspense fallback={<section className="archiveContent"><p>Loading match…</p></section>}><MatchRecord/></Suspense></main>}
