"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Player = { id: number; slug: string; name: string; position: string | null };

const SUPABASE_URL = "https://uwhewuwnrcvrnclfzoge.supabase.co";
const SUPABASE_KEY = "sb_publishable_3qBGcpu8I6fytBGxdhJDNA_zOklTBeT";

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/players?select=id,slug,name,position&order=name.asc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Database request failed")))
      .then(setPlayers)
      .finally(() => setLoading(false));
  }, []);

  return <main className="archivePage">
    <header className="archiveNav"><Link className="brand" href="/">PARS<span>DATABASE</span></Link><Link href="/">← Home</Link></header>
    <section className="archiveHero"><p className="eyebrow">THE PEOPLE BEHIND THE PARS</p><h1>Players</h1><p>Explore Dunfermline Athletic players across the club's history. This page reads directly from the live Pars Database.</p></section>
    <section className="archiveContent">
      <div className="archiveToolbar"><h2>Player archive</h2><span>{loading ? "Loading live records…" : `${players.length} records imported`}</span></div>
      <div className="dataList">{players.map((player,i)=><div className="dataRow" key={player.id}><span>{String(i+1).padStart(3,"0")}</span><strong>{player.name}</strong><small>{player.position || "Historical player record"}</small><b>→</b></div>)}</div>
      {!loading && players.length === 0 && <p className="migrationNote">No player records were returned by the live database.</p>}
    </section>
  </main>;
}
