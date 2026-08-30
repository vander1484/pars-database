"use client";

import {animate, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform} from "motion/react";
import {usePathname} from "next/navigation";
import {useEffect, useMemo, useRef} from "react";

const CARD_SELECTORS = ".card,.homeFeatureCard,.competitionCard,.majorCard,.honourTile,.countryCard,.recordHero,.bookCard,.loanCard,.playerCard,.searchResult";
const ROW_SELECTORS = ".playerTableRow,.matchRow,.dataRow,.leagueTableRow,.appearanceRow,.h2hRow,.timelineEvent,.otdStories article";
const NUMBER_SELECTORS = ".stats strong,.heroStats strong,.timelineHeroStats strong,.recordHero>strong,.majorCard .big,.searchSummary strong";

function parseNumber(text:string){const cleaned=text.replace(/,/g,"").trim();if(!/^\d+(?:\.\d+)?$/.test(cleaned))return null;return Number(cleaned)}

export default function MotionEnhancer(){
  const path=usePathname();
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll();
  const smoothProgress=useSpring(scrollYProgress,{stiffness:130,damping:28,mass:.25});
  const heroY=useTransform(smoothProgress,[0,.35],[0,-44]);
  const heroOpacity=useTransform(smoothProgress,[0,.22],[1,.76]);
  const progressScale=useMotionValue(0);
  const rootRef=useRef<HTMLDivElement>(null);

  useEffect(()=>smoothProgress.on("change",v=>progressScale.set(v)),[smoothProgress,progressScale]);

  useEffect(()=>{
    if(reduced)return;
    const cleanup:(()=>void)[]=[];
    const els=Array.from(document.querySelectorAll<HTMLElement>(`${CARD_SELECTORS},${ROW_SELECTORS}`));
    els.forEach((el,i)=>{
      el.dataset.motionEnhanced="true";
      const enter=()=>animate(el,{transform:"translateY(-4px) scale(1.008)"},{duration:.18,ease:"easeOut"});
      const leave=()=>animate(el,{transform:"translateY(0px) scale(1)"},{duration:.28,ease:"easeOut"});
      el.addEventListener("pointerenter",enter);el.addEventListener("pointerleave",leave);
      cleanup.push(()=>{el.removeEventListener("pointerenter",enter);el.removeEventListener("pointerleave",leave)});
      if(el.matches(ROW_SELECTORS)) animate(el,{opacity:[0,1],y:[10,0]},{delay:Math.min(i%10,9)*.018,duration:.3});
    });

    const numbers=Array.from(document.querySelectorAll<HTMLElement>(NUMBER_SELECTORS));
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target as HTMLElement; const raw=el.textContent||""; const n=parseNumber(raw); if(n===null){observer.unobserve(el);return}
      const decimals=(raw.split(".")[1]||"").length;
      const controls=animate(0,n,{duration:.9,ease:[.16,1,.3,1],onUpdate:v=>{el.textContent=v.toLocaleString("en-GB",{minimumFractionDigits:decimals,maximumFractionDigits:decimals})}});
      cleanup.push(()=>controls.stop()); observer.unobserve(el);
    }),{threshold:.45});
    numbers.forEach(el=>observer.observe(el));cleanup.push(()=>observer.disconnect());

    const mutation=new MutationObserver(()=>{
      document.querySelectorAll<HTMLElement>(`${CARD_SELECTORS},${ROW_SELECTORS}`).forEach(el=>{
        if(el.dataset.motionEnhanced)return;el.dataset.motionEnhanced="true";
        animate(el,{opacity:[0,1],y:[8,0]},{duration:.28,ease:"easeOut"});
      });
    });
    mutation.observe(document.body,{subtree:true,childList:true});cleanup.push(()=>mutation.disconnect());
    return()=>cleanup.forEach(fn=>fn());
  },[path,reduced]);

  const heroSelector=useMemo(()=>".hero>*,.archiveHero>*,.compactHero>*,.h2hHero>*,.recordsHeroInner,.timelineHeroInner,.pollHero>*,.tpHero>*",[]);
  useEffect(()=>{
    if(reduced)return;
    const heroes=document.querySelectorAll<HTMLElement>(heroSelector);
    const unsub=smoothProgress.on("change",v=>{const y=Math.max(-34,-v*115);heroes.forEach(el=>{el.style.transform=`translate3d(0,${y}px,0)`})});
    return()=>{unsub();heroes.forEach(el=>el.style.transform="")};
  },[path,reduced,heroSelector,smoothProgress]);

  return <div ref={rootRef} className="motionSystem" aria-hidden="true">
    <motion.div className="motionScrollProgress" style={{scaleX:progressScale}} />
    <motion.div className="motionAmbient" style={{y:heroY,opacity:heroOpacity}} />
  </div>;
}
