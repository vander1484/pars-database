"use client";
import {useMemo,useState} from 'react';
import './team-picker.css';

type Player={id:string;name:string;position:string;years:string;decades:string[]};
const PLAYERS:Player[]=[
{id:'norrie-mccathie',name:'Norrie McCathie',position:'CB',years:'1981-1996',decades:['80s','90s','all']},
{id:'bert-paton',name:'Bert Paton',position:'CM',years:'1961-1969',decades:['60s','all']},
{id:'jim-leishman',name:'Jim Leishman',position:'FW',years:'1970-1977',decades:['70s','all']},
{id:'andy-tod',name:'Andy Tod',position:'CB',years:'1992-2005',decades:['90s','00s','all']},
{id:'stevie-crawford',name:'Stevie Crawford',position:'FW',years:'1996-1999, 2000-2004',decades:['90s','00s','all']},
{id:'craig-brewster',name:'Craig Brewster',position:'FW',years:'1991-1995',decades:['90s','all']},
{id:'istvan-kozma',name:'Istvan Kozma',position:'CM',years:'1989-1992',decades:['80s','90s','all']},
{id:'hamish-french',name:'Hamish French',position:'CM',years:'1987-1993',decades:['80s','90s','all']},
{id:'lee-bullen',name:'Lee Bullen',position:'DEF',years:'2000-2004',decades:['00s','all']},
{id:'scott-thomson',name:'Scott Thomson',position:'DEF',years:'1997-2008',decades:['90s','00s','all']},
{id:'doruston',name:'Dorus de Vries',position:'GK',years:'2006-2007',decades:['00s','all']},
{id:'joe-cardle',name:'Joe Cardle',position:'LW',years:'2009-2012, 2015-2018',decades:['00s','10s','all']},
{id:'andy-kirk',name:'Andy Kirk',position:'FW',years:'2008-2013',decades:['00s','10s','all']},
{id:'ryan-williamson',name:'Ryan Williamson',position:'RB',years:'2012-2019',decades:['10s','all']},
{id:'faissal-el-bakhtaoui',name:'Faissal El Bakhtaoui',position:'FW',years:'2012-2016',decades:['10s','all']},
{id:'matty-todd',name:'Matty Todd',position:'CM',years:'2019-',decades:['10s','20s','all']},
{id:'kyle-benedictus',name:'Kyle Benedictus',position:'CB',years:'2022-',decades:['20s','all']},
{id:'chris-hamilton',name:'Chris Hamilton',position:'CM',years:'2022-',decades:['20s','all']}
];
const FORMATIONS:{[k:string]:{x:number,y:number}[]}={
'4-4-2':[{x:50,y:90},{x:15,y:70},{x:38,y:72},{x:62,y:72},{x:85,y:70},{x:14,y:45},{x:38,y:48},{x:62,y:48},{x:86,y:45},{x:36,y:20},{x:64,y:20}],
'4-3-3':[{x:50,y:90},{x:15,y:70},{x:38,y:72},{x:62,y:72},{x:85,y:70},{x:25,y:48},{x:50,y:43},{x:75,y:48},{x:18,y:20},{x:50,y:15},{x:82,y:20}],
'3-5-2':[{x:50,y:90},{x:25,y:70},{x:50,y:72},{x:75,y:70},{x:10,y:45},{x:32,y:50},{x:50,y:42},{x:68,y:50},{x:90,y:45},{x:36,y:18},{x:64,y:18}],
'4-2-3-1':[{x:50,y:90},{x:15,y:70},{x:38,y:72},{x:62,y:72},{x:85,y:70},{x:38,y:54},{x:62,y:54},{x:18,y:35},{x:50,y:30},{x:82,y:35},{x:50,y:12}]
};
const DECADES=[['all','ALL-TIME'],['20s','2020s'],['10s','2010s'],['00s','2000s'],['90s','1990s'],['80s','1980s'],['70s','1970s'],['60s','1960s']];
export default function TeamPicker(){const [decade,setDecade]=useState('all'),[formation,setFormation]=useState('4-4-2'),[team,setTeam]=useState<(Player|null)[]>(Array(11).fill(null)),[slot,setSlot]=useState(0),[query,setQuery]=useState(''),[open,setOpen]=useState(true),[copied,setCopied]=useState(false);const available=useMemo(()=>PLAYERS.filter(p=>p.decades.includes(decade)&&p.name.toLowerCase().includes(query.toLowerCase())),[decade,query]);function pick(p:Player){const next=[...team];next[slot]=p;setTeam(next);setOpen(false)}function clear(i:number){const next=[...team];next[i]=null;setTeam(next)}async function share(){const payload={d:decade,f:formation,t:team.map(p=>p?.id||'')};const url=`${location.origin}${location.pathname}?team=${btoa(JSON.stringify(payload))}`;try{if(navigator.share)await navigator.share({title:'My Ultimate Pars XI',text:'Here is my Ultimate Dunfermline Athletic XI',url});else{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1800)}}catch{}}return <main className="tpPage"><section className="tpHero"><span>BUILD YOUR PARS XI</span><h1>ELEVEN SHIRTS.<br/><em>ONE IMPOSSIBLE ARGUMENT.</em></h1><p>Pick your ultimate Dunfermline Athletic team, or settle the debate decade by decade.</p></section><section className="tpControls"><div className="seg">{DECADES.map(d=><button key={d[0]} className={decade===d[0]?'on':''} onClick={()=>{setDecade(d[0]);setTeam(Array(11).fill(null))}}>{d[1]}</button>)}</div><label>FORMATION<select value={formation} onChange={e=>setFormation(e.target.value)}>{Object.keys(FORMATIONS).map(f=><option key={f}>{f}</option>)}</select></label></section><section className="builder"><div className="pitch">{FORMATIONS[formation].map((p,i)=><button key={i} className="shirtSlot" style={{left:`${p.x}%`,top:`${p.y}%`}} onClick={()=>{setSlot(i);setOpen(true)}}><span>{team[i]?.name.split(' ').slice(-1)[0]||'+'}</span><small>{team[i]?.position||`PLAYER ${i+1}`}</small>{team[i]&&<i onClick={e=>{e.stopPropagation();clear(i)}}>×</i>}</button>)}</div><aside className={`drawer ${open?'open':''}`}><div className="drawerHead"><div><span>PLAYER DATABASE</span><h2>Who gets the shirt?</h2></div><button onClick={()=>setOpen(false)}>×</button></div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search players..."/><div className="playerList">{available.map(p=><button key={p.id} onClick={()=>pick(p)}><div className="avatar">{p.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><strong>{p.name}</strong><small>{p.position} · {p.years}</small></div><span>ADD +</span></button>)}</div><p className="dbNote">Player options are being linked progressively to the Pars Database. More names and full player cards will appear as the archive grows.</p></aside></section><section className="tpBottom"><div><small>{team.filter(Boolean).length}/11 SELECTED</small><strong>{DECADES.find(d=>d[0]===decade)?.[1]} · {formation}</strong></div><button disabled={team.filter(Boolean).length<11} onClick={share}>{copied?'LINK COPIED ✓':'SHARE MY XI ↗'}</button><button className="saveGhost" disabled>SAVE TO PROFILE · COMING SOON</button></section></main>}
