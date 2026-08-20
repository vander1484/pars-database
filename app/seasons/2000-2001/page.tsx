"use client";

import Link from "next/link";
import { useEffect,useMemo,useState } from "react";

type Match={id:number;played_on:string;home_score:number|null;away_score:number|null;notes:string|null;home:{name:string}|null;away:{name:string}|null;competition_season:{competition:{name:string}|null}|null};
const SUPABASE_URL="https://uwhewuwnrcvrnclfzoge.supabase.co";
const SUPABASE_KEY="sb_publishable_3qBGcpu8I6fytBGxdhJDNA_zOklTBeT";
export default function Season2000(){
 const [matches,setMatches]=useState<Match[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{const q='season_id=eq.87&select=id,played_on,home_score,away_score,notes,home:clubs!matches_home_club_id_fkey(name),away:clubs!matches_away_club_id_fkey(name),competition_season:competition_seasons(competition:competitions(name))&order=played_on.asc';fetch(`${SUPABASE_URL}/rest/v1/matches?${q}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.ok?r.json():Promise.reject()).then(setMatches).finally(()=>setLoading(false));},[]);
 const groups=useMemo(()=>matches.reduce<Record<string,Match[]>>((a,m)=>{const n=m.competition_season?.competition?.name||'Other';(a[n]??=[]).push(m);return a;},{}),[matches]);
 return <main className="archivePage"><header className="archiveNav"><Link className="brand" href="/">PARS<span>DATABASE</span></Link><Link href="/seasons/">← Seasons</Link></header><section className="archiveHero"><p className="eyebrow">SEASON ARCHIVE</p><h1>2000/01</h1><p>The first fully migrated season in the new Pars Database, covering league, cups and other recorded fixtures.</p></section><section className="archiveContent"><div className="archiveToolbar"><h2>All fixtures</h2><span>{loading?'Loading…':`${matches.length} matches`}</span></div>{Object.entries(groups).map(([competition,items])=><section key={competition} style={{marginBottom:'4rem'}}><h2>{competition} <small style={{fontSize:'.8rem',fontWeight:400}}>({items.length})</small></h2><div className="dataList">{items.map(m=><Link className="matchRow" href={`/match/?id=${m.id}`} key={m.id}><span>{m.played_on}</span><strong>{m.home?.name} <em>{m.home_score} - {m.away_score}</em> {m.away?.name}</strong><b>→</b></Link>)}</div></section>)}</section></main>;
}
