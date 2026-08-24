"use client";
import {useEffect} from "react";

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

const coords:Record<string,Pt>={
  "Dunfermline Athletic":{x:29,y:24},
  "St Patrick's Athletic":{x:25,y:35},
  "Vardar":{x:61,y:64},
  "Újpesti Dózsa":{x:56,y:45},
  "Everton":{x:29,y:33},
  "Valencia":{x:30,y:69},
  "Örgryte IS":{x:48,y:24},
  "VfB Stuttgart":{x:46,y:46},
  "Athletic Bilbao":{x:27,y:60},
  "B 1903 Copenhagen":{x:49,y:30},
  "Spartak Brno":{x:54,y:44},
  "Real Zaragoza":{x:30,y:62},
  "Frigg":{x:45,y:19},
  "Dinamo Zagreb":{x:55,y:53},
  "APOEL":{x:74,y:72},
  "Olympiacos":{x:65,y:66},
  "West Bromwich Albion":{x:31,y:35},
  "Slovan Bratislava":{x:57,y:45},
  "Girondins de Bordeaux":{x:35,y:54},
  "Gwardia Warsaw":{x:61,y:36},
  "Anderlecht":{x:40,y:40},
  "FH Hafnarfjordur":{x:15,y:12},
  "BK Häcken":{x:48,y:24}
};

function path(a:Pt,b:Pt,i:number){
  const mx=(a.x+b.x)/2;
  const my=(a.y+b.y)/2-(7+(i%3)*2.5);
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export default function MapRuntimeFix(){
  useEffect(()=>{
    const root=document.querySelector('.euroV4');
    if(!root)return;

    const apply=()=>{
      const active=root.querySelector('.mapSeasonPicker button.active span')?.textContent?.trim()||'';
      const allowed=campaigns[active]||[];
      const allowedSet=new Set(allowed);

      const home=root.querySelector<HTMLElement>('.homeMarker');
      const hp=coords["Dunfermline Athletic"];
      if(home){home.style.left=`${hp.x}%`;home.style.top=`${hp.y}%`;}

      const destinations=[...root.querySelectorAll<HTMLElement>('.destination')];
      destinations.forEach(el=>{
        const opponent=el.querySelector('.destLabel span')?.textContent?.trim()||'';
        if(!allowedSet.has(opponent)){
          el.style.display='none';
          el.setAttribute('aria-hidden','true');
          return;
        }
        const p=coords[opponent];
        el.style.display='flex';
        el.removeAttribute('aria-hidden');
        if(p){el.style.left=`${p.x}%`;el.style.top=`${p.y}%`;}
      });

      const visible=allowed.map(name=>coords[name]).filter(Boolean);
      const lines=[...root.querySelectorAll<SVGPathElement>('.routeLine')];
      const points=[hp,...visible];
      lines.forEach((line,i)=>{
        if(i>=points.length-1){line.style.display='none';return;}
        line.style.display='';
        line.setAttribute('d',path(points[i],points[i+1],i));
      });

      const pulse=root.querySelector<SVGCircleElement>('.homePulse');
      if(pulse){pulse.setAttribute('cx',String(hp.x));pulse.setAttribute('cy',String(hp.y));}
    };

    const clickHandler=(e:Event)=>{
      const target=e.target as Element|null;
      if(target?.closest('.mapSeasonPicker button')){
        requestAnimationFrame(()=>requestAnimationFrame(apply));
        setTimeout(apply,120);
      }
    };
    root.addEventListener('click',clickHandler);

    const map=root.querySelector('.realMap');
    const observer=map?new MutationObserver(()=>requestAnimationFrame(apply)):null;
    if(map)observer?.observe(map,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});

    apply();
    const t1=setTimeout(apply,250);
    const t2=setTimeout(apply,900);
    return()=>{root.removeEventListener('click',clickHandler);observer?.disconnect();clearTimeout(t1);clearTimeout(t2)};
  },[]);
  return null;
}
