"use client";
import {useEffect,useRef} from "react";
import {usePathname} from "next/navigation";

const LONG_FORM_ROUTES=["/records","/timeline","/greatest-50","/season"];

export default function MotionEnhancer(){
  const progressRef=useRef<HTMLDivElement>(null);
  const pathname=usePathname();
  const showProgress=LONG_FORM_ROUTES.some(route=>pathname.startsWith(route));

  useEffect(()=>{
    if(!showProgress)return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    if(reduced.matches)return;
    let frame=0;
    const update=()=>{
      frame=0;
      const doc=document.documentElement;
      const max=Math.max(1,doc.scrollHeight-window.innerHeight);
      const progress=Math.min(1,Math.max(0,window.scrollY/max));
      if(progressRef.current)progressRef.current.style.transform=`scaleX(${progress})`;
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
    update();
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule,{passive:true});
    return()=>{
      window.removeEventListener("scroll",schedule);
      window.removeEventListener("resize",schedule);
      if(frame)cancelAnimationFrame(frame);
    };
  },[showProgress]);

  if(!showProgress)return null;
  return <div className="motionSystem" aria-hidden="true">
    <div ref={progressRef} className="motionScrollProgress" style={{transform:"scaleX(0)"}}/>
  </div>;
}
