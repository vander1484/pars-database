"use client";
import {useEffect} from "react";
import {geoMercator,geoPath} from "d3-geo";
import {feature} from "topojson-client";
import countries from "world-atlas/countries-110m.json";

type Geo={lon:number;lat:number};
type Pt=[number,number];

const locations:Record<string,Geo>={
  "Dunfermline Athletic":{lon:-3.46,lat:56.07},
  "St Patrick's Athletic":{lon:-6.32,lat:53.34},
  "Vardar":{lon:21.43,lat:42},
  "Újpesti Dózsa":{lon:19.08,lat:47.56},
  "Everton":{lon:-2.96,lat:53.44},
  "Valencia":{lon:-0.38,lat:39.47},
  "Örgryte IS":{lon:11.97,lat:57.71},
  "VfB Stuttgart":{lon:9.18,lat:48.78},
  "Athletic Bilbao":{lon:-2.94,lat:43.26},
  "B 1903 Copenhagen":{lon:12.57,lat:55.68},
  "Spartak Brno":{lon:16.61,lat:49.2},
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

const countryCodes:Record<string,string>={
  Ireland:"ie","North Macedonia":"mk",Hungary:"hu",England:"gb-eng",Spain:"es",Sweden:"se",Germany:"de",Denmark:"dk",
  Czechia:"cz",Norway:"no",Croatia:"hr",Cyprus:"cy",Greece:"gr",Scotland:"gb-sct",Slovakia:"sk",France:"fr",Poland:"pl",Belgium:"be",Iceland:"is"
};

const labelOffsets:Record<string,[number,number]>={
  "St Patrick's Athletic":[8,-4],"Vardar":[8,10],"Újpesti Dózsa":[8,-10],"Everton":[8,-8],"Valencia":[8,10],
  "Örgryte IS":[8,-8],"VfB Stuttgart":[8,8],"Athletic Bilbao":[8,-10],"B 1903 Copenhagen":[8,8],"Spartak Brno":[8,-8],
  "Real Zaragoza":[8,10],"Frigg":[8,-10],"Dinamo Zagreb":[8,8],"APOEL":[-150,8],"Olympiacos":[8,-8],
  "West Bromwich Albion":[8,8],"Slovan Bratislava":[8,-10],"Girondins de Bordeaux":[8,8],"Gwardia Warsaw":[8,-8],"Anderlecht":[8,10],
  "FH Hafnarfjordur":[8,8],"BK Häcken":[8,-8]
};

const labelName=(el:Element)=>el.querySelector('.destLabel span')?.textContent?.trim()||'';

export default function MapRuntimeFix(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.euroV4');
  if(!root)return;

  const geojson=feature(countries as any,(countries as any).objects.countries) as any;
  const projection=geoMercator();
  let map:HTMLElement|null=null;
  let svg:SVGSVGElement|null=null;
  let resizeObserver:ResizeObserver|null=null;

  const convertFlags=()=>{
    root.querySelectorAll<HTMLElement>('.stamp').forEach(stamp=>{
      const country=stamp.querySelector('b')?.textContent?.trim()||'';
      const code=countryCodes[country];
      const span=stamp.querySelector<HTMLElement>('span');
      if(!span||!code)return;
      span.textContent='';
      span.className=`stampFlag fi fi-${code}`;
      span.setAttribute('role','img');
      span.setAttribute('aria-label',`${country} flag`);
    });
  };

  const setupMap=()=>{
    const next=root.querySelector<HTMLElement>('.realMap');
    if(!next)return false;
    if(map!==next){
      if(resizeObserver)resizeObserver.disconnect();
      map=next;
      resizeObserver=new ResizeObserver(()=>requestAnimationFrame(render));
      resizeObserver.observe(map);
    }
    root.querySelectorAll('.tileLayer,.mapAttribution,.geoBase').forEach(n=>n.remove());
    const old=root.querySelector<SVGSVGElement>('.europeShape');
    if(old)old.style.display='none';
    svg=map.querySelector<SVGSVGElement>('.d3EuropeMap');
    if(!svg){
      svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.classList.add('d3EuropeMap');
      map.prepend(svg);
    }
    return true;
  };

  const render=()=>{
    if(!setupMap()||!map||!svg)return;
    const w=map.clientWidth,h=map.clientHeight;
    if(!w||!h)return;

    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio','none');

    const europeBounds={type:'MultiPoint',coordinates:[[-25,34],[-25,66],[38,34],[38,66]]};
    projection
      .fitExtent([[42,28],[w-42,h-28]],europeBounds as any)
      .clipExtent([[0,0],[w,h]]);

    const path=geoPath(projection);
    svg.innerHTML='';

    const countriesG=document.createElementNS('http://www.w3.org/2000/svg','g');
    countriesG.setAttribute('class','d3Countries');
    svg.append(countriesG);
    for(const f of geojson.features){
      const d=path(f);
      if(!d)continue;
      const p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d',d);
      p.setAttribute('class','d3Country');
      countriesG.append(p);
    }

    const hp=projection([locations['Dunfermline Athletic'].lon,locations['Dunfermline Athletic'].lat]) as Pt|null;
    const home=map.querySelector<HTMLElement>('.homeMarker');
    if(home&&hp){home.style.left=`${hp[0]}px`;home.style.top=`${hp[1]}px`}

    const routesG=document.createElementNS('http://www.w3.org/2000/svg','g');
    routesG.setAttribute('class','d3Routes');
    svg.append(routesG);

    const destinations=[...map.querySelectorAll<HTMLElement>('.destination')];
    destinations.forEach(el=>{
      const name=labelName(el);
      const loc=locations[name];
      if(!loc)return;
      const p=projection([loc.lon,loc.lat]) as Pt|null;
      if(!p)return;
      el.style.left=`${p[0]}px`;
      el.style.top=`${p[1]}px`;
      const label=el.querySelector<HTMLElement>('.destLabel');
      const offset=labelOffsets[name]||[8,0];
      if(label)label.style.transform=`translate(${offset[0]}px,${offset[1]}px)`;
      if(hp){
        const route=document.createElementNS('http://www.w3.org/2000/svg','path');
        const mx=(hp[0]+p[0])/2;
        const my=(hp[1]+p[1])/2-24;
        route.setAttribute('d',`M${hp[0]},${hp[1]} Q${mx},${my} ${p[0]},${p[1]}`);
        route.setAttribute('class','d3Route');
        routesG.append(route);
      }
    });

    if(hp){
      const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('cx',String(hp[0]));
      dot.setAttribute('cy',String(hp[1]));
      dot.setAttribute('r','5');
      dot.setAttribute('class','d3HomeDot');
      routesG.append(dot);
    }
  };

  let attempts=0;
  const bootstrap=setInterval(()=>{
    attempts++;
    convertFlags();
    render();
    if((root.querySelectorAll('.stamp').length>0&&root.querySelector('.realMap'))||attempts>=40)clearInterval(bootstrap);
  },250);

  const click=(e:Event)=>{
    if((e.target as Element|null)?.closest('.mapSeasonPicker button')){
      requestAnimationFrame(()=>requestAnimationFrame(render));
      setTimeout(render,80);
    }
  };
  root.addEventListener('click',click);
  convertFlags();
  render();

  return()=>{
    clearInterval(bootstrap);
    resizeObserver?.disconnect();
    root.removeEventListener('click',click);
  };
 },[]);
 return null;
}
