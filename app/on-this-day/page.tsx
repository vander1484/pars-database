"use client";
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import './on-this-day.css';
import {curatedEvents,type CuratedEvent} from './curated';

type Match={id:number;played_on:string|null;home_club_id:number|null;away_club_id:number|null;home_score:number|null;away_score:number|null;competition_season_id:number|null;round:string|null;attendance:number|null;venue:string|null};
type Club={id:number;name:string};
type CS={id:number;display_name:string|null};
const U="https://uwhewuwnrcvrnclfzoge.supabase.co",K="sb_publishable_3qBGcpu8I6fytBGxdhJDNA_zOklTBeT",H={apikey:K,Authorization:`Bearer ${K}`};
const MONTHS=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const key=(m:number,d:number)=>`${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const dateParts=(s:string)=>{const [y,m,d]=s.split('-').map(Number);return {year:y,month:m,day:d}};

export default function OnThisDay(){
 const now=new Date(),[month,setMonth]=useState(now.getMonth()+1),[day,setDay]=useState(now.getDate()),[matches,setMatches]=useState<Match[]>([]),[clubs,setClubs]=useState<Club[]>([]),[css,setCss]=useState<CS[]>([]);
 useEffect(()=>{Promise.all([
  fetch(`${U}/rest/v1/matches?select=id,played_on,home_club_id,away_club_id,home_score,away_score,competition_season_id,round,attendance,venue&played_on=not.is.null&order=played_on.desc&limit=5000`,{headers:H}).then(r=>r.json()),
  fetch(`${U}/rest/v1/clubs?select=id,name&limit=5000`,{headers:H}).then(r=>r.json()),
  fetch(`${U}/rest/v1/competition_seasons?select=id,display_name&limit=5000`,{headers:H}).then(r=>r.json())
 ]).then(([m,c,s])=>{setMatches(Array.isArray(m)?m:[]);setClubs(Array.isArray(c)?c:[]);setCss(Array.isArray(s)?s:[])}).catch(()=>{})},[]);
 const clubMap=useMemo(()=>new Map(clubs.map(c=>[c.id,c.name])),[clubs]);
 const csMap=useMemo(()=>new Map(css.map(c=>[c.id,c.display_name||'Match'])),[css]);
 const curated=useMemo(()=>curatedEvents.filter(x=>x.month===month&&x.day===day).sort((a,b)=>b.year-a.year),[month,day]);
 const dayMatches=useMemo(()=>matches.filter(m=>m.played_on&&m.played_on.slice(5)===key(month,day)).sort((a,b)=>(b.played_on||'').localeCompare(a.played_on||'')),[matches,month,day]);
 const curatedMatchKeys=useMemo(()=>new Set(curated.filter(e=>!e.milestone).map(e=>`${e.year}-${String(e.month).padStart(2,'0')}-${String(e.day).padStart(2,'0')}`)),[curated]);
 const ordinary=useMemo(()=>dayMatches.filter(m=>!curatedMatchKeys.has(m.played_on||'')),[dayMatches,curatedMatchKeys]);
 const coveredDays=useMemo(()=>{const s=new Set(curatedEvents.map(e=>key(e.month,e.day)));matches.forEach(m=>{if(m.played_on)s.add(m.played_on.slice(5))});return s.size},[matches]);
 const total=curated.length+ordinary.length;
 function surprise(){const pool=[...new Set([...curatedEvents.map(e=>key(e.month,e.day)),...matches.filter(m=>m.played_on).map(m=>m.played_on!.slice(5))])];const x=pool[Math.floor(Math.random()*pool.length)];const [m,d]=x.split('-').map(Number);setMonth(m);setDay(d)}
 function title(m:Match){const h=clubMap.get(m.home_club_id||-1)||'Home',a=clubMap.get(m.away_club_id||-1)||'Away';return `${h} ${m.home_score??'–'} ${a} ${m.away_score??'–'}`}
 return <main className="otdPage">
  <section className="otdHero"><div><span>THE PARS · ON THIS DAY</span><h1>{String(day).padStart(2,'0')}<small>{MONTHS[month-1]}</small></h1><p>{total?`${total} ${total===1?'entry':'entries'} from this date in Dunfermline Athletic history.`:'No event is attached to this date yet.'}</p></div><button onClick={surprise}>TAKE ME TO ANOTHER DAY ↗</button></section>
  <section className="dateStrip"><select value={month} onChange={e=>setMonth(+e.target.value)}>{MONTHS.map((m,i)=><option value={i+1} key={m}>{m}</option>)}</select><input type="number" min="1" max="31" value={day} onChange={e=>setDay(Math.max(1,Math.min(31,+e.target.value)))} /><span>{coveredDays} CALENDAR DAYS CURRENTLY COVERED · CURATED HISTORY + FULL MATCH ARCHIVE</span></section>
  <section className="otdStories">
   {curated.map((e:CuratedEvent,i)=><article className={i===0?'lead':''} key={`c-${e.n}-${e.year}`}><div className="year">{e.year}</div><div className="story"><span>{e.milestone?'CLUB MILESTONE':`MEMORABLE MATCH #${e.n}`}</span><h2>{e.title}</h2><p>{e.competition}</p>{e.note&&<strong>{e.note}</strong>}</div></article>)}
   {ordinary.map((m,i)=>{const p=dateParts(m.played_on!);return <article className={!curated.length&&i===0?'lead':''} key={`m-${m.id}`}><div className="year">{p.year}</div><div className="story"><span>FROM THE MATCH ARCHIVE</span><h2>{title(m)}</h2><p>{csMap.get(m.competition_season_id||-1)||m.round||'Match'}{m.round?` · ${m.round}`:''}</p>{m.attendance&&<strong>Attendance: {m.attendance.toLocaleString()}</strong>}<Link href={`/match/?id=${m.id}`}>VIEW MATCH IN PARS DATABASE →</Link></div></article>})}
   {!total&&<div className="empty"><b>NOTHING HERE. YET.</b><h2>History is still being added.</h2><p>This is one of the remaining gaps in the calendar. As the historical match backfill grows, it will fill automatically.</p><button onClick={surprise}>SHOW ME A PARS DAY</button></div>}
  </section>
 </main>
}
