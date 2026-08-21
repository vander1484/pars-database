"use client";
import {useEffect,useRef,useState} from "react";

type TeamResult={strTeam?:string;strTeamAlternate?:string;strBadge?:string;strLogo?:string;strSport?:string};
const memory=new Map<string,string>();
const inflight=new Map<string,Promise<string|null>>();
const aliases:Record<string,string>={
  "Dundee":"Dundee FC",
  "East Stirling":"East Stirlingshire",
  "Heart of Midlothian":"Heart of Midlothian FC",
  "Queen of the South":"Queen of the South FC",
  "FH Hafnarfjordur":"FH",
  "Genclerbirligi":"Genclerbirligi",
  "Steaua Bucharest":"FCSB",
  "Queen's Park":"Queen's Park FC"
};
const CACHE_VERSION='v3';
function keyFor(name:string){return `pars-badge-${CACHE_VERSION}:${name.toLowerCase()}`}
let queue:Promise<unknown>=Promise.resolve();
function scheduled<T>(fn:()=>Promise<T>):Promise<T>{const run=queue.then(()=>new Promise<void>(r=>setTimeout(r,180))).then(fn);queue=run.catch(()=>undefined);return run}
function norm(s:string){return s.toLowerCase().replace(/\b(fc|footballclub|football|club)\b/g,'').replace(/[^a-z0-9]/g,'')}
async function lookup(name:string){
  const cached=memory.get(name);if(cached)return cached;
  if(typeof window!=="undefined"){const stored=window.localStorage.getItem(keyFor(name));if(stored){memory.set(name,stored);return stored}}
  if(inflight.has(name))return inflight.get(name)!;
  const p=scheduled(async()=>{try{
    const term=aliases[name]||name;
    const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(term)}`,{cache:'force-cache'});
    if(!r.ok)return null;
    const data=await r.json();const teams=((data?.teams||[]) as TeamResult[]).filter(t=>!t.strSport||t.strSport==='Soccer');
    const wanted=[norm(name),norm(term)];
    const team=teams.find(t=>wanted.includes(norm(t.strTeam||''))||wanted.includes(norm(t.strTeamAlternate||'')))||null;
    const url=team?.strBadge||team?.strLogo||null;
    if(url){memory.set(name,url);if(typeof window!=="undefined")window.localStorage.setItem(keyFor(name),url)}
    return url;
  }catch{return null}finally{inflight.delete(name)}});
  inflight.set(name,p);return p;
}
export default function ClubBadge({name,size="sm"}:{name:string;size?:"sm"|"md"|"lg"}){
  const [src,setSrc]=useState<string|null>(()=>memory.get(name)||null),[loading,setLoading]=useState(!memory.has(name));const host=useRef<HTMLSpanElement>(null);
  useEffect(()=>{let alive=true,observer:IntersectionObserver|undefined;const load=()=>{setLoading(true);lookup(name).then(v=>{if(alive){setSrc(v);setLoading(false)}})};if(typeof IntersectionObserver==='undefined')load();else{observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer?.disconnect();load()}},{rootMargin:'220px'});if(host.current)observer.observe(host.current)}return()=>{alive=false;observer?.disconnect()}},[name]);
  const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  return <span ref={host} className={`clubBadge clubBadge-${size}`} title={name}>{src?<img src={src} alt={`${name} badge`} loading="lazy" onError={()=>{setSrc(null);setLoading(false)}}/>:<span className={loading?"clubBadgeLoading":"clubBadgeFallback"}>{loading?'':initials}</span>}</span>
}
