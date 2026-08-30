"use client";

import {animate,useReducedMotion,useScroll,useMotionValueEvent} from "motion/react";
import {usePathname} from "next/navigation";
import {useEffect,useRef,useState} from "react";

export default function TimelineMotion(){
  const path=usePathname();
  const reduced=useReducedMotion();
  const {scrollY}=useScroll();
  const [activeEra,setActiveEra]=useState<string>("");
  const lastProgress=useRef(-1);

  useMotionValueEvent(scrollY,"change",()=>{
    if(path!=="/timeline"||reduced)return;
    const wrap=document.querySelector<HTMLElement>(".timelineWrap");
    if(!wrap)return;
    const rect=wrap.getBoundingClientRect();
    const viewport=window.innerHeight;
    const travelled=viewport*.62-rect.top;
    const total=Math.max(1,rect.height-viewport*.2);
    const progress=Math.min(1,Math.max(0,travelled/total));
    if(Math.abs(progress-lastProgress.current)<.002)return;
    lastProgress.current=progress;
    document.documentElement.style.setProperty("--timeline-progress",String(progress));
  });

  useEffect(()=>{
    if(path!=="/timeline")return;
    document.documentElement.style.setProperty("--timeline-progress",reduced?"1":"0");
    const cleanups:(()=>void)[]=[];
    const eras=Array.from(document.querySelectorAll<HTMLElement>(".eraBlock"));
    const events=Array.from(document.querySelectorAll<HTMLElement>(".timelineEvent"));

    if(reduced){
      eras.forEach(e=>e.classList.add("motionEraActive"));
      events.forEach(e=>e.classList.add("motionMilestoneActive"));
      return;
    }

    const eraObserver=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      const el=visible.target as HTMLElement;
      setActiveEra(el.id);
      el.classList.add("motionEraActive");
      const intro=el.querySelector<HTMLElement>(".eraIntro");
      if(intro)animate(intro,{opacity:[.45,1],y:[24,0]},{duration:.55,ease:[.16,1,.3,1]});
    },{threshold:[.18,.35,.55],rootMargin:"-18% 0px -45% 0px"});
    eras.forEach(e=>eraObserver.observe(e));
    cleanups.push(()=>eraObserver.disconnect());

    const eventObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target as HTMLElement;
      el.classList.add("motionMilestoneActive");
      const card=el.querySelector<HTMLElement>(".timelineCard");
      const dot=el.querySelector<HTMLElement>(".timelineDot");
      if(card)animate(card,{opacity:[0,1],y:[22,0],scale:el.classList.contains("featured")?[.965,1]:[.985,1]},{duration:el.classList.contains("featured")?.62:.46,ease:[.16,1,.3,1]});
      if(dot)animate(dot,{scale:[.35,1.22,1]},{duration:.42,ease:"easeOut"});
      eventObserver.unobserve(el);
    }),{threshold:.35,rootMargin:"0px 0px -12% 0px"});
    events.forEach(e=>eventObserver.observe(e));
    cleanups.push(()=>eventObserver.disconnect());

    const decade=document.querySelector<HTMLElement>(".timelineBreak");
    if(decade){
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        animate(decade,{opacity:[0,1],scale:[.96,1]},{duration:.65,ease:[.16,1,.3,1]});
        observer.disconnect();
      }),{threshold:.25});
      observer.observe(decade);cleanups.push(()=>observer.disconnect());
    }
    return()=>cleanups.forEach(fn=>fn());
  },[path,reduced]);

  useEffect(()=>{
    if(path!=="/timeline")return;
    document.querySelectorAll<HTMLAnchorElement>(".eraNav a").forEach(a=>{
      const id=(a.getAttribute("href")||"").replace("#","");
      a.classList.toggle("motionActiveEra",id===activeEra);
    });
  },[activeEra,path]);

  if(path!=="/timeline")return null;
  return <div className="timelineMotionStatus" aria-hidden="true"><span>{activeEra}</span></div>;
}
