"use client";
import {useEffect} from "react";

type Geo={lon:number;lat:number};
type Pt={x:number;y:number};

const campaigns:Record<string,string[]>={
  "61/62":["St Patrick's Athletic","Vardar","Újpesti Dózsa"],
  "62/63":["Everton","Valencia"],
  "64/65":["Örgryte IS","VfB Stuttgart","Athletic Bilbao"],
  "65/66":["B 1903 Copenhagen","Spartak Brno","Real Zaragoza"],
  "66/67":["Frigg","Dinamo Zagreb"],
  "68/69":["APOEL","Olympiacos","West Bromwich Albion","Slovan Bratislava"],
  "69/70":["Girondins de Bordeaux","Gwardia Warsaw","Anderlecht"],
  "04/05":["FH Hafnarfjordur"],
  "07/08":["BK Häcken"]
};

/* Real city coordinates. These are projected into the same viewport as the map image. */
const geo:Record<string,Geo>={
  "Dunfermline Athletic":{lon:-3.46,lat:56.07},
  "St Patrick's Athletic":{lon:-6.32,lat:53.34},
  "Vardar":{lon:21.43,lat:42.00},
  "Újpesti Dózsa":{lon:19.08,lat:47.56},
  "Everton":{lon:-2.96,lat:53.44},
  "Valencia":{lon:-0.38,lat:39.47},
  "Örgryte IS":{lon:11.97,lat:57.71},
  "VfB Stuttgart":{lon:9.18,lat:48.78},
  "Athletic Bilbao":{lon:-2.94,lat:43.26},
  "B 1903 Copenhagen":{lon:12.57,lat:55.68},
  "Spartak Brno":{lon:16.61,lat:49.20},
  "Real Zaragoza":{lon:-0.88,lat:41.65},
  "Frigg":{lon:10.75,lat:59.91},
  "Dinamo Zagreb":{lon:15.98,lat:45.81},
  "APOEL":{lon:33.38,lat:35.19},
  "Olympiacos":{lon:23.65,lat:37.94},
  "West Bromwich Albion":{lon:-1.99,lat:52.51},
  "Slovan Bratislava":{lon:17.11,lat:48.15},
  "Girondins de Bordeaux":{lon:-0.58,lat:44.84},
  "Gwardia Warsaw":{lon:21.01,lat:52.23},
  "Anderlecht":{lon:4.31,lat:50.84},
  "FH Hafnarfjordur":{lon:-21.95,lat:64.07},
  "BK Häcken":{lon:11.97,lat:57.71}
};

/* Viewport chosen to frame every opponent while filling a wide desktop panel. */
const bounds={minLon:-25,maxLon:38,minLat:34,maxLat:66};
function project(g:Geo):Pt{
  const x=((g.lon-bounds.minLon)/(bounds.maxLon-bounds.minLon))*100;
  /* Mercator-ish latitude correction gives a better visual match than linear latitude. */
  const merc=(lat:number)=>Math.log(Math.tan(Math.PI/4+(lat*Math.PI/180)/2));
  const top=merc(bounds.maxLat),bottom=merc(bounds.minLat),v=merc(g.lat);
  const y=((top-v)/(top-bottom))*100;
  return{x,y};
}
function path(a:Pt,b:Pt,i:number){const mx=(a.x+b.x)/2,my=(a.y+b.y)/2-(5+(i%3)*2);return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}

export default function MapRuntimeFix(){
 useEffect(()=>{
  const root=document.querySelector('.euroV4');if(!root)return;
  const map=root.querySelector<HTMLElement>('.realMap');if(!map)return;

  let base=map.querySelector<HTMLImageElement>('.geoBase');
  if(!base){
    base=document.createElement('img');
    base.className='geoBase';
    base.alt='Map of Europe';
    base.src='https://raw.githubusercontent.com/highcharts/map-collection-dist/master/custom/europe.svg';
    map.prepend(base);
  }

  const apply=()=>{
    const active=root.querySelector('.mapSeasonPicker button.active span')?.textContent?.trim()||'';
    const allowed=campaigns[active]||[];const allowedSet=new Set(allowed);
    const hp=project(geo["Dunfermline Athletic"]);
    const home=root.querySelector<HTMLElement>('.homeMarker');if(home){home.style.left=`${hp.x}%`;home.style.top=`${hp.y}%`}

    const destinations=[...root.querySelectorAll<HTMLElement>('.destination')];
    destinations.forEach(el=>{
      const opponent=el.querySelector('.destLabel span')?.textContent?.trim()||'';
      if(!allowedSet.has(opponent)){el.style.display='none';el.setAttribute('aria-hidden','true');return}
      const g=geo[opponent];if(!g){el.style.display='none';return}
      const p=project(g);el.style.display='flex';el.removeAttribute('aria-hidden');el.style.left=`${p.x}%`;el.style.top=`${p.y}%`;
    });

    const points=[hp,...allowed.map(n=>geo[n]).filter(Boolean).map(project)];
    const lines=[...root.querySelectorAll<SVGPathElement>('.routeLine')];
    lines.forEach((line,i)=>{if(i>=points.length-1){line.style.display='none';return}line.style.display='';line.setAttribute('d',path(points[i],points[i+1],i))});
    const pulse=root.querySelector<SVGCircleElement>('.homePulse');if(pulse){pulse.setAttribute('cx',String(hp.x));pulse.setAttribute('cy',String(hp.y))}
  };

  const click=(e:Event)=>{if((e.target as Element|null)?.closest('.mapSeasonPicker button')){requestAnimationFrame(()=>requestAnimationFrame(apply));setTimeout(apply,100)}};
  root.addEventListener('click',click);
  const ro=new ResizeObserver(apply);ro.observe(map);
  apply();const t1=setTimeout(apply,250),t2=setTimeout(apply,900);
  return()=>{root.removeEventListener('click',click);ro.disconnect();clearTimeout(t1);clearTimeout(t2)};
 },[]);
 return null;
}
