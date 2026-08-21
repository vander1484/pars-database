"use client";
import Link from "next/link";
import {FormEvent,useState} from "react";
import {usePathname,useRouter} from "next/navigation";

const links=[['/players','Players'],['/matches','Matches'],['/seasons','Seasons'],['/competitions','Competitions'],['/records','Records']];
export default function SiteHeader(){
  const path=usePathname();
  const router=useRouter();
  const [q,setQ]=useState('');
  function submit(e:FormEvent){e.preventDefault();if(q.trim())router.push(`/search/?q=${encodeURIComponent(q.trim())}`)}
  return <header className="siteHeader">
    <Link className="brand" href="/">PARS<span>DATABASE</span></Link>
    <nav className="siteNav" aria-label="Primary navigation">{links.map(([href,label])=><Link className={path?.startsWith(href)?'active':''} href={href} key={href}>{label}</Link>)}</nav>
    <form className="globalSearch" onSubmit={submit} role="search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search the archive" aria-label="Search the archive"/><button aria-label="Search">Search</button></form>
  </header>
}
