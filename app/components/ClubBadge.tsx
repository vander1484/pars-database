"use client";
import {useEffect,useRef,useState} from "react";

type TeamResult={strTeam?:string;strTeamAlternate?:string;strBadge?:string;strLogo?:string;strSport?:string};
const memory=new Map<string,string>();
const inflight=new Map<string,Promise<string|null>>();

const aliases:Record<string,string>={
  "Dundee":"Dundee FC",
  "East Stirling":"East Stirlingshire",
  "Heart of Midlothian":"Heart of Midlothian FC",
  "Queen of the South":"Queen of the South",
  "FH Hafnarfjordur":"FH",
  "Genclerbirligi":"Genclerbirligi",
  "Steaua Bucharest":"FCSB",
  "Queen's Park":"Queen's Park",
  "St Patrick's Athletic":"St Patrick's Athletic",
  "Újpesti Dózsa":"Újpest",
  "Örgryte IS":"Örgryte",
  "Spartak Brno":"Zbrojovka Brno",
  "Girondins de Bordeaux":"Bordeaux",
  "B 1903 Copenhagen":"Boldklubben 1903",
  "Gwardia Warsaw":"Gwardia Warszawa",
  "Frigg":"Frigg Oslo FK",
  "Vardar":"FK Vardar"
};

const sportsDbIds:Record<string,string>={
  "Queen of the South":"134305",
  "Queen's Park":"138105",
  "St Patrick's Athletic":"134792",
  "Újpesti Dózsa":"138183",
  "Örgryte IS":"135668",
  "Athletic Bilbao":"133727",
  "Spartak Brno":"140094"
};

const directBadgeUrls:Record<string,string>={
  "Vardar":"https://footballia.net/uploads/team/logo/776/800px-FK_Vardar_logo.svg.png",
  "Gwardia Warsaw":"https://cdn.laczynaspilka.pl/cms2/prod/sites/default/files/2021-03/herb_gwardia_warszawa.png",
  "Frigg":"https://web.frigg.no/wp-content/uploads/2025/01/Frigg_logo_stor-1331x1536.png",
  "B 1903 Copenhagen":"https://cdn-img.zerozero.pt/img/logos/equipas/3795_imgbank_1697701988.png"
};

const CACHE_VERSION='v5';
function keyFor(name:string){return `pars-badge-${CACHE_VERSION}:${name.toLowerCase()}`}
let queue:Promise<unknown>=Promise.resolve();
function scheduled<T>(fn:()=>Promise<T>):Promise<T>{const run=queue.then(()=>new Promise<void>(r=>setTimeout(r,180))).then(fn);queue=run.catch(()=>undefined);return run}
function norm(s:string){return s.toLowerCase().replace(/\b(fc|footballclub|football|club)\b/g,'').replace(/[^a-z0-9]/g,'')}
async function lookup(name:string){
  const cached=memory.get(name);if(cached)return cached;
  const direct=directBadgeUrls[name];
  if(direct){memory.set(name,direct);if(typeof window!=="undefined")window.localStorage.setItem(keyFor(name),direct);return direct}
  if(typeof window!=="undefined"){const stored=window.localStorage.getItem(keyFor(name));if(stored){memory.set(name,stored);return stored}}
  if(inflight.has(name))return inflight.get(name)!;
  const p=scheduled(async()=>{try{
    const fixedId=sportsDbIds[name];
    const endpoint=fixedId
      ?`https://www.thesportsdb.com/api/v1/json/123/lookupteam.php?id=${fixedId}`
      :`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(aliases[name]||name)}`;
    const r=await fetch(endpoint,{cache:'force-cache'});
    if(!r.ok)return null;
    const data=await r.json();const teams=((data?.teams||[]) as TeamResult[]).filter(t=>!t.strSport||t.strSport==='Soccer');
    const term=aliases[name]||name;const wanted=[norm(name),norm(term)];
    const team=fixedId?(teams[0]||null):(teams.find(t=>wanted.includes(norm(t.strTeam||''))||wanted.includes(norm(t.strTeamAlternate||'')))||teams[0]||null);
    const url=team?.strBadge||team?.strLogo||null;
    if(url){memory.set(name,url);if(typeof window!=="undefined")window.localStorage.setItem(keyFor(name),url)}
    return url;
  }catch{return null}finally{inflight.delete(name)}});
  inflight.set(name,p);return p;
}

export default function ClubBadge({name,size="sm"}:{name:string;size?:"sm"|"md"|"lg"}){
  const [src,setSrc]=useState<string|null>(()=>memory.get(name)||directBadgeUrls[name]||null),[loading,setLoading]=useState(!memory.has(name)&&!directBadgeUrls[name]);const host=useRef<HTMLSpanElement>(null);
  useEffect(()=>{let alive=true,observer:IntersectionObserver|undefined;const load=()=>{setLoading(true);lookup(name).then(v=>{if(alive){setSrc(v);setLoading(false)}})};if(typeof IntersectionObserver==='undefined')load();else{observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer?.disconnect();load()}},{rootMargin:'220px'});if(host.current)observer.observe(host.current)}return()=>{alive=false;observer?.disconnect()}},[name]);
  const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  return <span ref={host} className={`clubBadge clubBadge-${size}`} title={name}>{src?<img src={src} alt={`${name} badge`} loading="lazy" referrerPolicy="no-referrer" onError={()=>{setSrc(null);setLoading(false)}}/>:<span className={loading?"clubBadgeLoading":"clubBadgeFallback"}>{loading?'':initials}</span>}</span>
}
