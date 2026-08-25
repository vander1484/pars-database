"use client";
import Link from "next/link";
import {FormEvent,useState} from "react";
import {usePathname,useRouter} from "next/navigation";
import ClubBadge from "./ClubBadge";

const groups=[
 {label:'Archive',items:[['/players','Players'],['/matches','Matches'],['/seasons','Seasons'],['/competitions','Competitions']]},
 {label:'Club',items:[['/managers','Managers'],['/records','Honours & Records'],['/greatest-50','Greatest 50'],['/timeline','Timeline'],['/europe','European History']]},
 {label:'Interactive',items:[['/interactive','Games Hub'],['/polls','Supporter Polls'],['/team-picker','Ultimate XI'],['/on-this-day','On This Day'],['/interactive/pardle','Pardle'],['/interactive/career-path','Career Path'],['/interactive/higher-lower','Higher or Lower'],['/interactive/starting-xi','Starting XI']]}
];

export default function SiteHeader(){
 const path=usePathname();const router=useRouter();const [q,setQ]=useState('');const [open,setOpen]=useState<string|null>(null);
 function submit(e:FormEvent){e.preventDefault();if(q.trim())router.push(`/search/?q=${encodeURIComponent(q.trim())}`)}
 return <header className="siteHeader">
  <Link className="brand" href="/" aria-label="Pars Database home"><span className="navCrest"><ClubBadge name="Dunfermline Athletic" size="sm"/></span><span className="brandWord">PARS<span>DATABASE</span></span></Link>
  <nav className="siteNav groupedNav" aria-label="Primary navigation">
   {groups.map(g=>{const active=g.items.some(([href])=>path?.startsWith(href));return <div className={`navGroup ${active?'active':''} ${open===g.label?'open':''}`} key={g.label} onMouseEnter={()=>setOpen(g.label)} onMouseLeave={()=>setOpen(null)}>
    <button type="button" onClick={()=>setOpen(open===g.label?null:g.label)} aria-expanded={open===g.label}>{g.label}<span>⌄</span></button>
    <div className="navDropdown">{g.items.map(([href,label])=><Link className={path?.startsWith(href)?'active':''} href={href} key={href} onClick={()=>setOpen(null)}>{label}<b>→</b></Link>)}</div>
   </div>})}
  </nav>
  <form className="globalSearch" onSubmit={submit} role="search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search the archive" aria-label="Search the archive"/><button aria-label="Search">Search</button></form>
  <style jsx global>{`
   .navCrest{display:inline-flex;vertical-align:middle;margin-right:.65rem}.brand{display:flex;align-items:center}.brandWord{color:#fff!important}.brandWord>span{color:#d51f2b!important}.groupedNav{gap:.2rem!important;justify-content:center}.navGroup{height:100%;position:relative;display:flex;align-items:center}.navGroup>button{height:100%;border:0;border-bottom:3px solid transparent;background:transparent;color:#fff;padding:0 1rem;font-size:.73rem;font-weight:900;text-transform:uppercase;letter-spacing:.07em;cursor:pointer}.navGroup>button span{color:#777;margin-left:.45rem;font-size:.8rem}.navGroup:hover>button,.navGroup.active>button,.navGroup.open>button{border-bottom-color:#d51f2b;background:#141414}.navDropdown{display:none;position:absolute;left:0;top:76px;background:#111;color:#fff;min-width:245px;border-top:3px solid #d51f2b;box-shadow:0 16px 30px rgba(0,0,0,.28);padding:.45rem;z-index:200}.navGroup.open .navDropdown,.navGroup:hover .navDropdown{display:block}.navDropdown a{height:auto!important;min-height:42px;border:0!important;padding:.7rem .8rem;display:flex!important;justify-content:space-between;align-items:center;font-size:.68rem!important;text-transform:none!important;letter-spacing:.02em!important}.navDropdown a b{color:#555}.navDropdown a:hover,.navDropdown a.active{background:#242424;color:#fff}.navDropdown a:hover b{color:#d51f2b}@media(max-width:1050px){.siteHeader{grid-template-columns:auto 1fr auto;gap:1rem}.globalSearch{max-width:220px}.navGroup>button{padding:0 .65rem}}@media(max-width:780px){.siteHeader{height:auto;min-height:76px;display:flex;flex-wrap:wrap;padding:.7rem 4vw}.groupedNav{order:3;width:100%;height:44px!important;justify-content:flex-start!important}.navGroup>button{height:44px}.navDropdown{top:44px}.globalSearch{margin-left:auto;max-width:180px}body{padding-top:120px}}
  `}</style>
 </header>
}
