"use client";

import {animate,motion,useMotionValue,useReducedMotion,useScroll,useSpring,useTransform} from "motion/react";
import {usePathname} from "next/navigation";
import {useEffect,useMemo,useRef} from "react";

const CARDS=".card,.homeFeatureCard,.competitionCard,.majorCard,.honourTile,.countryCard,.recordHero,.bookCard,.loanCard,.playerCard,.searchResult";
const ROWS=".playerTableRow,.matchRow,.dataRow,.leagueTableRow,.appearanceRow,.h2hRow,.timelineEvent,.otdStories article";
const NUMBERS=".stats strong,.heroStats strong,.timelineHeroStats strong,.recordHero>strong,.majorCard .big,.searchSummary strong";
function numeric(text:string){const x=text.replace(/,/g,"").trim();return /^\d+(?:\.\d+)?$/.test(x)?Number(x):null}

export default function MotionEnhancer(){
 const path=usePathname(),reduced=useReducedMotion(),{scrollYProgress}=useScroll(),smooth=useSpring(scrollYProgress,{stiffness:130,damping:28,mass:.25}),progress=useMotionValue(0),ambientY=useTransform(smooth,[0,.35],[0,-44]),ambientOpacity=useTransform(smooth,[0,.22],[1,.76]),rootRef=useRef<HTMLDivElement>(null);
 useEffect(()=>smooth.on("change",v=>progress.set(v)),[smooth,progress]);
 useEffect(()=>{if(reduced)return;const clean:(()=>void)[]=[];
  const enhance=(el:HTMLElement,i=0)=>{if(el.dataset.motionEnhanced)return;el.dataset.motionEnhanced="true";const over=()=>animate(el,{transform:"translateY(-4px) scale(1.008)"},{duration:.18,ease:"easeOut"}),out=()=>animate(el,{transform:"translateY(0px) scale(1)"},{duration:.28,ease:"easeOut"});el.addEventListener("pointerenter",over);el.addEventListener("pointerleave",out);clean.push(()=>{el.removeEventListener("pointerenter",over);el.removeEventListener("pointerleave",out)});if(el.matches(ROWS))animate(el,{opacity:[0,1],y:[10,0]},{delay:Math.min(i%10,9)*.018,duration:.3})};
  document.querySelectorAll<HTMLElement>(`${CARDS},${ROWS}`).forEach(enhance);
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target as HTMLElement,raw=el.textContent||"",n=numeric(raw);if(n===null){io.unobserve(el);return}const d=(raw.split(".")[1]||"").length,c=animate(0,n,{duration:.9,ease:[.16,1,.3,1],onUpdate:v=>el.textContent=v.toLocaleString("en-GB",{minimumFractionDigits:d,maximumFractionDigits:d})});clean.push(()=>c.stop());io.unobserve(el)}),{threshold:.45});document.querySelectorAll<HTMLElement>(NUMBERS).forEach(el=>io.observe(el));clean.push(()=>io.disconnect());
  document.querySelectorAll<HTMLElement>(".h2hRow").forEach(el=>{const pct=Number(el.querySelector("em")?.textContent?.replace("%","")||0);el.style.setProperty("--h2h-pct",`${pct}%`)});
  document.querySelectorAll<HTMLElement>(".loanCard").forEach(el=>{const pct=el.querySelector(".loanResult strong")?.textContent||"0%";el.style.setProperty("--vote-pct",pct)});
  const rail=document.querySelector<HTMLElement>(".timelineWrap");if(rail){const update=()=>{const r=rail.getBoundingClientRect(),span=Math.max(1,rail.offsetHeight-innerHeight),p=Math.min(1,Math.max(0,-r.top/span));rail.style.setProperty("--timeline-progress",String(p))};update();addEventListener("scroll",update,{passive:true});clean.push(()=>removeEventListener("scroll",update))}
  const stories=document.querySelector<HTMLElement>(".otdStories"),month=document.querySelector<HTMLSelectElement>(".dateStrip select"),day=document.querySelector<HTMLInputElement>(".dateStrip input");if(stories&&month&&day){let start=0;const down=(e:PointerEvent)=>start=e.clientX,up=(e:PointerEvent)=>{const dx=e.clientX-start;if(Math.abs(dx)<65)return;const date=new Date(2024,Number(month.value)-1,Number(day.value));date.setDate(date.getDate()+(dx<0?1:-1));month.value=String(date.getMonth()+1);day.value=String(date.getDate());month.dispatchEvent(new Event("change",{bubbles:true}));day.dispatchEvent(new Event("change",{bubbles:true}));animate(stories,{x:[dx<0?18:-18,0],opacity:[.55,1]},{duration:.3})};stories.addEventListener("pointerdown",down);stories.addEventListener("pointerup",up);clean.push(()=>{stories.removeEventListener("pointerdown",down);stories.removeEventListener("pointerup",up)})}
  const mo=new MutationObserver(()=>document.querySelectorAll<HTMLElement>(`${CARDS},${ROWS}`).forEach(enhance));mo.observe(document.body,{subtree:true,childList:true});clean.push(()=>mo.disconnect());return()=>clean.forEach(f=>f())
 },[path,reduced]);
 const heroes=useMemo(()=>".hero>*,.archiveHero>*,.compactHero>*,.h2hHero>*,.recordsHeroInner,.timelineHeroInner,.pollHero>*,.tpHero>*",[]);
 useEffect(()=>{if(reduced)return;const els=document.querySelectorAll<HTMLElement>(heroes),u=smooth.on("change",v=>els.forEach(el=>el.style.transform=`translate3d(0,${Math.max(-34,-v*115)}px,0)`));return()=>{u();els.forEach(el=>el.style.transform="")}},[path,reduced,heroes,smooth]);
 return <div ref={rootRef} className="motionSystem" aria-hidden="true"><motion.div className="motionScrollProgress" style={{scaleX:progress}}/><motion.div className="motionAmbient" style={{y:ambientY,opacity:ambientOpacity}}/></div>
}
