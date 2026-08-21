"use client";
import {useEffect,useState} from "react";

type TeamResult={strTeam?:string;strBadge?:string;strLogo?:string};
const memory=new Map<string,string|null>();
const inflight=new Map<string,Promise<string|null>>();
const aliases:Record<string,string>={
  "Dundee":"Dundee FC",
  "East Stirling":"East Stirlingshire",
  "Heart of Midlothian":"Hearts",
  "Queen of the South":"Queen of the South",
  "St Johnstone":"St Johnstone",
  "St Mirren":"St Mirren",
  "FH Hafnarfjordur":"FH Hafnarfjordur",
  "Genclerbirligi":"Genclerbirligi",
  "Steaua Bucharest":"Steaua Bucuresti"
};
function keyFor(name:string){return `pars-badge:${name.toLowerCase()}`}
async function fetchBadge(name:string){
  if(memory.has(name))return memory.get(name)!;
  if(typeof window!=="undefined"){
    const stored=window.localStorage.getItem(keyFor(name));
    if(stored){const v=stored==='__none__'?null:stored;memory.set(name,v);return v}
  }
  if(inflight.has(name))return inflight.get(name)!;
  const p=(async()=>{try{
    const term=aliases[name]||name;
    const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(term)}`);
    if(!r.ok)throw new Error('badge lookup failed');
    const data=await r.json();
    const teams=(data?.teams||[]) as TeamResult[];
    const football=teams.find(t=>t.strTeam?.toLowerCase()===term.toLowerCase())||teams[0];
    const url=football?.strBadge||football?.strLogo||null;
    memory.set(name,url);
    if(typeof window!=="undefined")window.localStorage.setItem(keyFor(name),url||'__none__');
    return url;
  }catch{memory.set(name,null);return null}finally{inflight.delete(name)}})();
  inflight.set(name,p);return p;
}
export default function ClubBadge({name,size="sm"}:{name:string;size?:"sm"|"md"|"lg"}){const [src,setSrc]=useState<string|null>(()=>memory.get(name)??null),[done,setDone]=useState(memory.has(name));useEffect(()=>{let alive=true;fetchBadge(name).then(v=>{if(alive){setSrc(v);setDone(true)}});return()=>{alive=false}},[name]);const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();return <span className={`clubBadge clubBadge-${size}`} title={name}>{src?<img src={src} alt={`${name} badge`} loading="lazy" onError={()=>{setSrc(null);setDone(true)}}/>:<span className={done?"clubBadgeFallback":"clubBadgeLoading"}>{done?initials:""}</span>}</span>}
