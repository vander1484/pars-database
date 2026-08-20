"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Season = { id:number; slug:string; label:string; start_year:number; end_year:number };
const SUPABASE_URL="https://uwhewuwnrcvrnclfzoge.supabase.co";
const SUPABASE_KEY="sb_publishable_3qBGcpu8I6fytBGxdhJDNA_zOklTBeT";

export default function Seasons(){
  const [seasons,setSeasons]=useState<Season[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch(`${SUPABASE_URL}/rest/v1/seasons?select=id,slug,label,start_year,end_year&order=start_year.desc`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.ok?r.json():Promise.reject()).then(setSeasons).finally(()=>setLoading(false));},[]);
  const grouped=useMemo(()=>seasons.reduce<Record<string,Season[]>>((acc,s)=>{const decade=`${Math.floor(s.start_year/10)*10}s`; (acc[decade]??=[]).push(s); return acc;},{}),[seasons]);
  return <main className="archivePage"><header className="archiveNav"><Link className="brand" href="/">PARS<span>DATABASE</span></Link><Link href="/">← Home</Link></header><section className="archiveHero"><p className="eyebrow">SEASON BY SEASON</p><h1>Seasons</h1><p>Travel through Dunfermline Athletic history with results, squads, league tables, scorers and cup campaigns connected in one place.</p></section><section className="archiveContent"><div className="archiveToolbar"><h2>Season archive</h2><span>{loading?"Loading live records…":`${seasons.length} seasons in the database`}</span></div><div className="decadeGrid">{Object.entries(grouped).map(([decade,items])=><div className="decade" key={decade}><strong>{decade}</strong><div>{items.map(s=>s.label==='2000/2001'?<Link key={s.id} href="/seasons/2000-2001/">{s.label} →</Link>:<span key={s.id} style={{display:'block',marginTop:'.55rem'}}>{s.label}</span>)}</div></div>)}</div><p className="migrationNote">2000/01 is now the first fully connected live season. Other seasons will become clickable as their match records are migrated.</p></section></main>;
}
