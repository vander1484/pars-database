"use client";
import Link from "next/link";
import {useState} from "react";
import ClubBadge from "./ClubBadge";
const groups=[
 {label:'Archive',items:[['/players','Players'],['/matches','Matches'],['/seasons','Seasons'],['/competitions','Competitions']]},
 {label:'Club',items:[['/managers','Managers'],['/records','Honours & Records'],['/greatest-50','Greatest 50'],['/timeline','Timeline'],['/europe','European History']]},
 {label:'Interactive',items:[['/interactive','Games Hub'],['/polls','Supporter Polls'],['/team-picker','Ultimate XI'],['/on-this-day','On This Day'],['/interactive/pardle','Pardle'],['/interactive/career-path','Career Path'],['/interactive/higher-lower','Higher or Lower'],['/interactive/starting-xi','Starting XI']]}
];

export default function SiteHeader(){
 const [open,setOpen]=useState(false); const [active,setActive]=useState<string|null>(null);
 return <header className="siteHeader"><div className="siteHeaderInner"><Link href="/" className="brand"><ClubBadge name="Dunfermline Athletic" size="sm"/><span><b>PARS</b> DATABASE</span></Link><button className="menuBtn" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?'CLOSE':'MENU'}</button><nav className={open?'open':''}>{groups.map(g=><div className="navGroup" key={g.label} onMouseEnter={()=>setActive(g.label)} onMouseLeave={()=>setActive(null)}><button onClick={()=>setActive(active===g.label?null:g.label)}>{g.label}<span>⌄</span></button><div className={`drop ${active===g.label?'show':''}`}>{g.items.map(i=><Link key={i[0]} href={i[0]} onClick={()=>{setOpen(false);setActive(null)}}>{i[1]}</Link>)}</div></div>)}</nav></div></header>
}
