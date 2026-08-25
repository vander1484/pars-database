"use client";
import {useMemo,useState} from 'react';
import './team-picker.css';

type Player={id:string;name:string;position:string;group:'GK'|'DEF'|'MID'|'FWD';years:string;decades:string[]};
type Slot={x:number;y:number;label:string;accept:Player['group'][]};

const PLAYERS:Player[]=[
{id:'norrie-mccathie',name:'Norrie McCathie',position:'CB',group:'DEF',years:'1981-1996',decades:['80s','90s','all']},
{id:'bert-paton',name:'Bert Paton',position:'CM',group:'MID',years:'1961-1969',decades:['60s','all']},
{id:'jim-leishman',name:'Jim Leishman',position:'FW',group:'FWD',years:'1970-1977',decades:['70s','all']},
{id:'andy-tod',name:'Andy Tod',position:'CB',group:'DEF',years:'1992-2005',decades:['90s','00s','all']},
{id:'stevie-crawford',name:'Stevie Crawford',position:'ST',group:'FWD',years:'1996-1999, 2000-2004',decades:['90s','00s','all']},
{id:'craig-brewster',name:'Craig Brewster',position:'ST',group:'FWD',years:'1991-1995',decades:['90s','all']},
{id:'istvan-kozma',name:'Istvan Kozma',position:'CM',group:'MID',years:'1989-1992',decades:['80s','90s','all']},
{id:'hamish-french',name:'Hamish French',position:'CM',group:'MID',years:'1987-1993',decades:['80s','90s','all']},
{id:'lee-bullen',name:'Lee Bullen',position:'CB',group:'DEF',years:'2000-2004',decades:['00s','all']},
{id:'scott-thomson',name:'Scott Thomson',position:'CB',group:'DEF',years:'1997-2008',decades:['90s','00s','all']},
{id:'dorus-de-vries',name:'Dorus de Vries',position:'GK',group:'GK',years:'2006-2007',decades:['00s','all']},
{id:'joe-cardle',name:'Joe Cardle',position:'LW',group:'MID',years:'2009-2012, 2015-2018',decades:['00s','10s','all']},
{id:'andy-kirk',name:'Andy Kirk',position:'ST',group:'FWD',years:'2008-2013',decades:['00s','10s','all']},
{id:'ryan-williamson',name:'Ryan Williamson',position:'RB',group:'DEF',years:'2012-2019',decades:['10s','all']},
{id:'faissal-el-bakhtaoui',name:'Faissal El Bakhtaoui',position:'ST',group:'FWD',years:'2012-2016',decades:['10s','all']},
{id:'matty-todd',name:'Matty Todd',position:'CM',group:'MID',years:'2019-',decades:['10s','20s','all']},
{id:'kyle-benedictus',name:'Kyle Benedictus',position:'CB',group:'DEF',years:'2022-',decades:['20s','all']},
{id:'chris-hamilton',name:'Chris Hamilton',position:'CM',group:'MID',years:'2022-',decades:['20s','all']}
];

const F=(x:number,y:number,label:string,accept:Player['group'][]):Slot=>({x,y,label,accept});
const FORMATIONS:Record<string,Slot[]>={
'4-4-2':[F(50,89,'GK',['GK']),F(14,68,'LB',['DEF']),F(38,72,'CB',['DEF']),F(62,72,'CB',['DEF']),F(86,68,'RB',['DEF']),F(14,44,'LM',['MID']),F(38,49,'CM',['MID']),F(62,49,'CM',['MID']),F(86,44,'RM',['MID']),F(36,20,'ST',['FWD']),F(64,20,'ST',['FWD'])],
'4-3-3':[F(50,89,'GK',['GK']),F(14,68,'LB',['DEF']),F(38,72,'CB',['DEF']),F(62,72,'CB',['DEF']),F(86,68,'RB',['DEF']),F(25,48,'CM',['MID']),F(50,43,'CM',['MID']),F(75,48,'CM',['MID']),F(18,20,'LW',['MID','FWD']),F(50,15,'ST',['FWD']),F(82,20,'RW',['MID','FWD'])],
'3-5-2':[F(50,89,'GK',['GK']),F(25,70,'CB',['DEF']),F(50,73,'CB',['DEF']),F(75,70,'CB',['DEF']),F(10,45,'LWB',['DEF','MID']),F(32,50,'CM',['MID']),F(50,42,'CM',['MID']),F(68,50,'CM',['MID']),F(90,45,'RWB',['DEF','MID']),F(36,18,'ST',['FWD']),F(64,18,'ST',['FWD'])],
'4-2-3-1':[F(50,89,'GK',['GK']),F(14,68,'LB',['DEF']),F(38,72,'CB',['DEF']),F(62,72,'CB',['DEF']),F(86,68,'RB',['DEF']),F(38,54,'CM',['MID']),F(62,54,'CM',['MID']),F(18,34,'LW',['MID','FWD']),F(50,30,'AM',['MID']),F(82,34,'RW',['MID','FWD']),F(50,12,'ST',['FWD'])]
};
const DECADES=[['all','All-Time'],['20s','2020s'],['10s','2010s'],['00s','2000s'],['90s','1990s'],['80s','1980s'],['70s','1970s'],['60s','1960s']];
const POSITIONS:[string,string][]=[['ALL','All'],['GK','Goalkeepers'],['DEF','Defenders'],['MID','Midfielders'],['FWD','Forwards']];

export default function TeamPicker(){
 const [decade,setDecade]=useState('all');
 const [formation,setFormation]=useState('4-4-2');
 const [team,setTeam]=useState<(Player|null)[]>(Array(11).fill(null));
 const [slot,setSlot]=useState(0);
 const [query,setQuery]=useState('');
 const [position,setPosition]=useState('ALL');
 const [copied,setCopied]=useState(false);
 const activeSlot=FORMATIONS[formation][slot];
 const selectedIds=new Set(team.filter(Boolean).map(p=>p!.id));
 const available=useMemo(()=>PLAYERS.filter(p=>p.decades.includes(decade)).filter(p=>position==='ALL'||p.group===position).filter(p=>`${p.name} ${p.position} ${p.years}`.toLowerCase().includes(query.toLowerCase())),[decade,position,query]);
 const picked=team.filter(Boolean).length;
 function chooseSlot(i:number){setSlot(i);const s=FORMATIONS[formation][i];if(s.accept.length===1)setPosition(s.accept[0]);else setPosition('ALL')}
 function pick(p:Player){const next=[...team];next[slot]=p;setTeam(next)}
 function clear(i:number){const next=[...team];next[i]=null;setTeam(next)}
 function reset(){setTeam(Array(11).fill(null));setSlot(0);setQuery('');setPosition('ALL')}
 async function share(){const payload={d:decade,f:formation,t:team.map(p=>p?.id||'')};const url=`${location.origin}${location.pathname}?team=${btoa(JSON.stringify(payload))}`;try{if(navigator.share)await navigator.share({title:'My Ultimate Pars XI',text:'My Ultimate Dunfermline Athletic XI',url});else{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1800)}}catch{}}
 return <main className="tpPage">
  <section className="tpHero"><div className="tpHeroKicker">ULTIMATE PARS XI</div><h1>BUILD YOUR<br/><em>DREAM TEAM.</em></h1><p>Choose an era, pick a formation and settle the arguments that have been going on since the East End Park turnstiles first opened.</p><div className="tpHeroSteps"><span><b>01</b> Choose era</span><span><b>02</b> Pick shape</span><span><b>03</b> Select XI</span><span><b>04</b> Share it</span></div></section>
  <section className="tpTopbar"><div><small>TEAM ERA</small><div className="decades">{DECADES.map(d=><button key={d[0]} className={decade===d[0]?'on':''} onClick={()=>{setDecade(d[0]);reset()}}>{d[1]}</button>)}</div></div><div className="formationControl"><small>FORMATION</small><select value={formation} onChange={e=>{setFormation(e.target.value);setTeam(Array(11).fill(null));setSlot(0)}}>{Object.keys(FORMATIONS).map(f=><option key={f}>{f}</option>)}</select></div></section>
  <section className="teamWorkspace">
   <div className="pitchPanel"><div className="pitchTop"><div><small>YOUR XI</small><strong>{DECADES.find(d=>d[0]===decade)?.[1]} · {formation}</strong></div><div className="progress"><span>{picked}</span>/11 selected</div></div><div className="pitch"><div className="box boxTop"/><div className="box boxBottom"/>{FORMATIONS[formation].map((p,i)=>{const player=team[i];return <button key={i} className={`playerSpot ${slot===i?'active':''} ${player?'filled':''}`} style={{left:`${p.x}%`,top:`${p.y}%`}} onClick={()=>chooseSlot(i)}><span className="shirt"><b>{player?player.name.split(' ').slice(-1)[0]:'+'}</b></span><strong>{player?.name||p.label}</strong><small>{player?player.position:'SELECT PLAYER'}</small>{player&&<i onClick={e=>{e.stopPropagation();clear(i)}} aria-label="Remove player">×</i>}</button>})}</div><div className="pitchActions"><button onClick={reset}>RESET XI</button><span>Tip: select a position on the pitch to filter the player list automatically.</span></div></div>
   <aside className="playerPanel"><div className="panelHeader"><div><small>PLAYER DATABASE</small><h2>{team[slot]?'Change player':'Select a player'} <span>for {activeSlot.label}</span></h2></div><b className="slotBadge">{slot+1}/11</b></div><div className="searchBox"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by player name..."/><kbd>{available.length}</kbd></div><div className="positionFilters">{POSITIONS.map(([key,label])=><button key={key} className={position===key?'on':''} onClick={()=>setPosition(key)}>{label}</button>)}</div><div className="playerResults">{available.length?available.map(p=>{const used=selectedIds.has(p.id)&&team[slot]?.id!==p.id;return <button className="playerCard" key={p.id} disabled={used} onClick={()=>pick(p)}><div className="playerAvatar">{p.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div className="playerMeta"><strong>{p.name}</strong><span>{p.position}<i>•</i>{p.years}</span></div><b>{used?'IN XI':'ADD +'}</b></button>}):<div className="noPlayers"><strong>No players found</strong><span>Try another position or search term.</span></div>}</div><div className="panelNote"><span>DATABASE LINK</span><p>This list will expand automatically as more historic players are connected to the Pars Database.</p></div></aside>
  </section>
  <section className="tpSharebar"><div><small>YOUR TEAM</small><strong>{picked===11?'XI COMPLETE. READY TO SHARE.':`${11-picked} PLAYER${11-picked===1?'':'S'} TO GO.`}</strong></div><button className="profileBtn" disabled>SAVE TO PROFILE <span>COMING SOON</span></button><button className="shareBtn" disabled={picked<11} onClick={share}>{copied?'LINK COPIED ✓':'SHARE MY XI ↗'}</button></section>
 </main>
}
