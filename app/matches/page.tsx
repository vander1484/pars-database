"use client";

import Link from "next/link";
import { useEffect,useState } from "react";

type Match={id:number;played_on:string;home_score:number|null;away_score:number|null;venue:string|null;home:{name:string}|null;away:{name:string}|null;competition_season:{competition:{name:string}|null}|null};
const SUPABASE_URL="https://uwhewuwnrcvrnclfzoge.supabase.co";
const SUPABASE_KEY="sb_publishable_3qBGcpu8I6fytBGxdhJDNA_zOklTBeT";

export default function Matches(){
 const [matches,setMatches]=useState<Match[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{const q='select=id,played_on,home_score,away_score,venue,home:clubs!matches_home_club_id_fkey(name),away:clubs!matches_away_club_id_fkey(name),competition_season:competition_seasons(competition:competitions(name))&order=played_on.desc';fetch(`${SUPABASE_URL}/rest/v1/matches?${q}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.ok?r.json():Promise.reject()).then(setMatches).finally(()=>setLoading(false));},[]);
 return <main className="archivePage"><header className="archiveNav"><Link className="brand" href="/">PARS<span>DATABASE</span></Link><Link href="/">← Home</Link></header><section className="archiveHero"><p className="eyebrow">FROM 1912 TO TODAY</p><h1>Matches</h1><p>Results, opponents and competitions from the live historical database.</p></section><section className="archiveContent"><div className="archiveToolbar"><h2>Match archive</h2><span>{loading?'Loading live records…':`${matches.length} matches imported`}</span></div><div className="dataList">{matches.map(m=><Link className="matchRow" href={`/match/?id=${m.id}`} key={m.id}><span>{m.played_on} · {m.competition_season?.competition?.name||'Match'}</span><strong>{m.home?.name} <em>{m.home_score ?? '–'} - {m.away_score ?? '–'}</em> {m.away?.name}</strong><b>→</b></Link>)}</div>{!loading&&matches.length===0&&<p className="migrationNote">No match records were returned by the live database.</p>}</section></main>;
}
