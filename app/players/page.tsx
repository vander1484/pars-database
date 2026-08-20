import Link from "next/link";

type Player = { id: number; slug: string; name: string; position: string | null };

async function getPlayers(): Promise<Player[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  const response = await fetch(`${url}/rest/v1/players?select=id,slug,name,position&order=name.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    next: { revalidate: 300 },
  });
  if (!response.ok) return [];
  return response.json();
}

export default async function Players() {
  const players = await getPlayers();
  return <main className="archivePage">
    <header className="archiveNav"><Link className="brand" href="/">PARS<span>DATABASE</span></Link><Link href="/">← Home</Link></header>
    <section className="archiveHero"><p className="eyebrow">THE PEOPLE BEHIND THE PARS</p><h1>Players</h1><p>Explore Dunfermline Athletic players across the club's history. Records are now being served from the live Pars Database.</p></section>
    <section className="archiveContent">
      <div className="archiveToolbar"><h2>Player archive</h2><span>{players.length} records imported</span></div>
      <div className="dataList">{players.map((player,i)=><div className="dataRow" key={player.id}><span>{String(i+1).padStart(3,"0")}</span><strong>{player.name}</strong><small>{player.position || "Historical player record"}</small><b>→</b></div>)}</div>
      {players.length === 0 && <p className="migrationNote">The database connection is awaiting its Vercel environment configuration.</p>}
    </section>
  </main>;
}
