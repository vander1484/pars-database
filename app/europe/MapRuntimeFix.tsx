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

const ZOOM=4;
const TILE=256;
const CENTER={lon:6.5,lat:50.2};
function world(g:Geo):Pt{
  const size=TILE*Math.pow(2,ZOOM);
  const x=(g.lon+180)/360*size;
  const s=Math.sin(g.lat*Math.PI/180);
  const y=(.5-Math.log((1+s)/(1-s))/(4*Math.PI))*size;
  return{x,y};
}
function curve(a:Pt,b:Pt,i:number){
  const mx=(a.x+b.x)/2;
  const my=(a.y+b.y)/2-(34+(i%3)*16);
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export default function MapRuntimeFix(){
 useEffect(()=>{
  const root=document.querySelector('.euroV4');if(!root)return;
  const map=root.querySelector<HTMLElement>('.realMap');if(!map)return;

  map.querySelectorAll('.geoBase,.tileLayer,.mapAttribution').forEach(el=>el.remove());
  const tileLayer=document.createElement('div');tileLayer.className='tileLayer';map.prepend(tileLayer);
  const attribution=document.createElement('div');attribution.className='mapAttribution';attribution.innerHTML='© OpenStreetMap contributors · © CARTO';map.append(attribution);

  const render=()=>{
    const w=map.clientWidth,h=map.clientHeight;if(!w||!h)return;
    const size=TILE*Math.pow(2,ZOOM),center=world(CENTER);
    const origin={x:center.x-w/2,y:center.y-h/2};

    tileLayer.innerHTML='';
    const minTx=Math.floor(origin.x/TILE)-1,maxTx=Math.floor((origin.x+w)/TILE)+1;
    const minTy=Math.floor(origin.y/TILE)-1,maxTy=Math.floor((origin.y+h)/TILE)+1;
    const n=Math.pow(2,ZOOM);
    for(let tx=minTx;tx<=maxTx;tx++)for(let ty=minTy;ty<=maxTy;ty++){
      if(ty<0||ty>=n)continue;
      const img=document.createElement('img');
      img.src=`https://basemaps.cartocdn.com/dark_nolabels/${ZOOM}/${((tx%n)+n)%n}/${ty}.png`;
      img.alt='';img.decoding='async';img.loading='eager';
      img.style.left=`${tx*TILE-origin.x}px`;img.style.top=`${ty*TILE-origin.y}px`;
      tileLayer.append(img);
    }

    const screen=(g:Geo):Pt=>{const p=world(g);return{x:p.x-origin.x,y:p.y-origin.y}};
    const active=root.querySelector('.mapSeasonPicker button.active span')?.textContent?.trim()||'';
    const allowed=campaigns[active]||[];const allowedSet=new Set(allowed);
    const hp=screen(geo["Dunfermline Athletic"]);
    const home=root.querySelector<HTMLElement>('.homeMarker');if(home){home.style.left=`${hp.x}px`;home.style.top=`${hp.y}px`}

    const destinations=[...root.querySelectorAll<HTMLElement>('.destination')];
    destinations.forEach(el=>{
      const opponent=el.querySelector('.destLabel span')?.textContent?.trim()||'';
      if(!allowedSet.has(opponent)){el.style.display='none';el.setAttribute('aria-hidden','true');return}
      const g=geo[opponent];if(!g){el.style.display='none';return}
      const p=screen(g);el.style.display='flex';el.removeAttribute('aria-hidden');el.style.left=`${p.x}px`;el.style.top=`${p.y}px`;
    });

    const svg=root.querySelector<SVGSVGElement>('.europeShape');
    if(svg){svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('preserveAspectRatio','none')}
    const points=[hp,...allowed.map(nm=>geo[nm]).filter(Boolean).map(screen)];
    const lines=[...root.querySelectorAll<SVGPathElement>('.routeLine')];
    lines.forEach((line,i)=>{if(i>=points.length-1){line.style.display='none';return}line.style.display='';line.setAttribute('d',curve(points[i],points[i+1],i))});
    const pulse=root.querySelector<SVGCircleElement>('.homePulse');if(pulse){pulse.setAttribute('cx',String(hp.x));pulse.setAttribute('cy',String(hp.y));pulse.setAttribute('r','6')}
  };

  const click=(e:Event)=>{if((e.target as Element|null)?.closest('.mapSeasonPicker button')){requestAnimationFrame(()=>requestAnimationFrame(render));setTimeout(render,120)}};
  root.addEventListener('click',click);
  const ro=new ResizeObserver(render);ro.observe(map);
  render();const t1=setTimeout(render,350),t2=setTimeout(render,1100);
  return()=>{root.removeEventListener('click',click);ro.disconnect();clearTimeout(t1);clearTimeout(t2)};
 },[]);
 return null;
}
